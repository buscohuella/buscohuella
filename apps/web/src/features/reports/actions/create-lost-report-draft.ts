'use server';

import {
  ReportRepository,
  ReportDataError,
  type Database as ReportDatabase,
} from '@buscohuella/report-data';
import {
  PetPhotoRepository,
  type Database as PetDatabase,
} from '@buscohuella/pet-data';
import {
  createReportSchema,
  type GeoPoint,
} from '@buscohuella/report-domain';
import { PetRepository } from '@buscohuella/pet-data';
import type { SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

import { getServerTranslator } from '@/features/i18n/server';
import { logServerError } from '@/lib/server-logger';
import { finalizeArchivedReportDeletion } from '@/services/database/report-cleanup';
import { createClient } from '@/services/supabase/server';

import type { CreateLostReportDraftState } from '../types/create-lost-report-draft-state';
import {
  copyPetPhotosToReport,
  createDraftWithOptionalPetPhotos,
  PetPhotoCopyError,
  rollbackFailedDraft,
} from '../lib/lost-report-photo-copy';

const PET_PHOTOS_BUCKET = 'pet-photos';
const REPORT_PHOTOS_BUCKET = 'report-photos';

type RollbackLifecycleAction =
  | 'CLOSE'
  | 'ARCHIVE';

type RollbackLifecycleResult = {
  data: ReportDatabase['public']['Tables']['reports']['Row'] | null;
  error: {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  } | null;
};

type WebSupabaseClient = Awaited<
  ReturnType<typeof createClient>
>;

function getRollbackLifecycleRpc(
  client: SupabaseClient<ReportDatabase>,
) {
  return client.rpc.bind(
    client,
  ) as unknown as (
    functionName:
      'manage_report_lifecycle',
    args: {
      target_report_id: string;
      target_action:
        RollbackLifecycleAction;
      target_resolution_type: null;
      target_notes: string | null;
    },
  ) => Promise<RollbackLifecycleResult>;
}

async function copyExistingPetPhotos({
  supabase,
  reportClient,
  userId,
  petId,
  reportId,
}: {
  supabase: WebSupabaseClient;
  reportClient: SupabaseClient<ReportDatabase>;
  userId: string;
  petId: string;
  reportId: string;
}) {
  const petClient =
    supabase as unknown as
      SupabaseClient<PetDatabase>;
  const photoRepository =
    new PetPhotoRepository(petClient);

  await copyPetPhotosToReport({
    userId,
    petId,
    reportId,
    listPetPhotos: (targetPetId) =>
      photoRepository.listPetPhotos(
        targetPetId,
      ),
    downloadPetPhoto: async (
      storagePath,
    ) => {
      const { data, error } =
        await supabase.storage
          .from(PET_PHOTOS_BUCKET)
          .download(storagePath);

      if (error || !data) {
        throw error ??
          new Error(
            'Pet photo download returned no file',
          );
      }

      return data;
    },
    uploadReportPhoto: async ({
      storagePath,
      file,
      mimeType,
    }) => {
      const { error } =
        await supabase.storage
          .from(REPORT_PHOTOS_BUCKET)
          .upload(storagePath, file, {
            contentType: mimeType,
            cacheControl: '3600',
            upsert: false,
          });

      if (error) {
        throw error;
      }
    },
    insertReportPhotoMetadata:
      async (metadata) => {
        const { error } =
          await reportClient
            .from('report_photos')
            .insert({
              id: metadata.id,
              report_id:
                metadata.reportId,
              storage_path:
                metadata.storagePath,
              position:
                metadata.position,
              is_primary:
                metadata.isPrimary,
              alt_text:
                metadata.altText,
              mime_type:
                metadata.mimeType,
              file_size_bytes:
                metadata.fileSizeBytes,
              width: metadata.width,
              height: metadata.height,
            });

        if (error) {
          throw error;
        }
      },
    removeReportPhotos: async (
      paths,
    ) => {
      const { error } =
        await supabase.storage
          .from(REPORT_PHOTOS_BUCKET)
          .remove(paths);

      if (error) {
        throw error;
      }
    },
    deleteReportPhotoMetadata:
      async (photoIds) => {
        const { error } =
          await reportClient
            .from('report_photos')
            .delete()
            .in('id', photoIds);

        if (error) {
          throw error;
        }
      },
    generatePhotoId: () =>
      crypto.randomUUID(),
    onCleanupFailure: (
      stage,
      error,
    ) => {
      logServerError(
        'report.draft.photo_copy_cleanup_failed',
        error,
        {
          userId,
          petId,
          reportId,
          stage,
        },
      );
    },
  });
}

async function compensateFailedDraft({
  reportClient,
  userId,
  petId,
  reportId,
}: {
  reportClient: SupabaseClient<ReportDatabase>;
  userId: string;
  petId: string;
  reportId: string;
}) {
  const lifecycleRpc =
    getRollbackLifecycleRpc(
      reportClient,
    );

  const transition = async (
    action: RollbackLifecycleAction,
  ) => {
    const { data, error } =
      await lifecycleRpc(
        'manage_report_lifecycle',
        {
          target_report_id: reportId,
          target_action: action,
          target_resolution_type: null,
          target_notes:
            action === 'CLOSE'
              ? 'DRAFT_CREATION_PHOTO_COPY_FAILED'
              : null,
        },
      );

    if (error || !data) {
      throw error ??
        new Error(
          `Draft rollback ${action} returned no report`,
        );
    }
  };

  return rollbackFailedDraft({
    closeDraft: () =>
      transition('CLOSE'),
    archiveDraft: () =>
      transition('ARCHIVE'),
    finalizeArchivedReportDeletion: async () => {
      const deleted = await finalizeArchivedReportDeletion(
        reportId,
        userId,
      );

      if (!deleted) {
        throw new Error(
          'Draft rollback finalizer returned no deletion',
        );
      }
    },
    onRollbackFailure: (
      stage,
      error,
    ) => {
      logServerError(
        'report.draft.rollback_failed',
        error,
        {
          userId,
          petId,
          reportId,
          stage,
        },
      );
    },
  });
}

function getString(
  formData: FormData,
  name: string,
) {
  const value = formData.get(name);
  return typeof value === 'string'
    ? value.trim()
    : '';
}

function getBoolean(
  formData: FormData,
  name: string,
) {
  return getString(formData, name) === 'true';
}

function getNullableNumber(
  formData: FormData,
  name: string,
) {
  const value = getString(formData, name);

  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed)
    ? parsed
    : null;
}

function resolveIncidentAt(
  moment: string,
  exactDate: string,
) {
  if (moment === 'CUSTOM') {
    const date = new Date(exactDate);

    if (
      !exactDate ||
      Number.isNaN(date.getTime()) ||
      date.getTime() > Date.now()
    ) {
      return null;
    }

    return date.toISOString();
  }

  if (moment === 'NOW') {
    return new Date().toISOString();
  }

  return null;
}

function composeDescription({
  description,
  hasCollarOrHarness,
  needsMedication,
  isFearful,
  isFriendly,
  translate,
}: {
  description: string;
  hasCollarOrHarness: boolean;
  needsMedication: boolean;
  isFearful: boolean;
  isFriendly: boolean;
  translate: (key: string) => string;
}) {
  const details: string[] = [];

  if (hasCollarOrHarness) {
    details.push(
      translate(
        'reports.review.details.hasCollar',
      ),
    );
  }

  if (needsMedication) {
    details.push(
      translate(
        'reports.review.details.needsMedication',
      ),
    );
  }

  if (isFearful) {
    details.push(
      translate(
        'reports.review.details.isFearful',
      ),
    );
  }

  if (isFriendly) {
    details.push(
      translate(
        'reports.review.details.isFriendly',
      ),
    );
  }

  if (details.length === 0) {
    return description;
  }

  return `${description}\n\n${translate(
    'reports.review.details.heading',
  )}\n${details
    .map((detail) => `• ${detail}`)
    .join('\n')}`;
}

export async function createLostReportDraftAction(
  _previousState: CreateLostReportDraftState,
  formData: FormData,
): Promise<CreateLostReportDraftState> {
  const { translate } =
    await getServerTranslator();

  const petId = getString(
    formData,
    'petId',
  );
  const moment = getString(
    formData,
    'moment',
  );
  const exactDate = getString(
    formData,
    'exactDate',
  );
  const description = getString(
    formData,
    'description',
  );
  const usePetPhotos = getBoolean(
    formData,
    'usePetPhotos',
  );

  const locationSource = getString(
    formData,
    'locationSource',
  );
  const exactLatitude =
    getNullableNumber(
      formData,
      'exactLatitude',
    );
  const exactLongitude =
    getNullableNumber(
      formData,
      'exactLongitude',
    );
  const publicLatitude =
    getNullableNumber(
      formData,
      'publicLatitude',
    );
  const publicLongitude =
    getNullableNumber(
      formData,
      'publicLongitude',
    );
  const placeLabel = getString(
    formData,
    'placeLabel',
  );
  const municipalityName = getString(
    formData,
    'municipalityName',
  );

  if (
    !petId ||
    description.length < 10 ||
    !['GPS', 'MANUAL'].includes(
      locationSource,
    )
  ) {
    return {
      status: 'error',
      message: translate(
        'reports.review.errors.incomplete',
      ),
    };
  }

  let exactLocation: GeoPoint | null =
    null;
  let publicLocation: GeoPoint | null =
    null;

  const hasManualCoordinates =
    locationSource === 'MANUAL' &&
    (exactLatitude !== null ||
      exactLongitude !== null ||
      publicLatitude !== null ||
      publicLongitude !== null);
  if (locationSource === 'GPS' || hasManualCoordinates) {
    if (
      exactLatitude === null ||
      exactLongitude === null ||
      publicLatitude === null ||
      publicLongitude === null
    ) {
      return {
        status: 'error',
        message: translate(
          'reports.review.errors.location',
        ),
      };
    }

    exactLocation = {
      latitude: exactLatitude,
      longitude: exactLongitude,
    };
    publicLocation = {
      latitude: publicLatitude,
      longitude: publicLongitude,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      message: translate(
        'reports.review.errors.session',
      ),
    };
  }

  const petRepository =
    new PetRepository(supabase);

  let pet;

  try {
    pet =
      await petRepository.getOwnPetById(
        petId,
      );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : '';
    if (
      errorMessage.includes(
        'reports_one_open_lost_pet_idx',
      )
    ) {
      return {
        status: 'error',
        message: translate(
          'reports.review.errors.duplicateOpen',
        ),
      };
    }
    logServerError(
      'report.draft.pet_load_failed',
      error,
      {
        userId: user.id,
        petId,
      },
    );

    return {
      status: 'error',
      message: translate(
        'reports.review.errors.pet',
      ),
    };
  }

  if (pet.status !== 'ACTIVE') {
    return {
      status: 'error',
      message: translate(
        'reports.review.errors.pet',
      ),
    };
  }

  const finalDescription =
    composeDescription({
      description,
      hasCollarOrHarness: getBoolean(
        formData,
        'hasCollarOrHarness',
      ),
      needsMedication: getBoolean(
        formData,
        'needsMedication',
      ),
      isFearful: getBoolean(
        formData,
        'isFearful',
      ),
      isFriendly: getBoolean(
        formData,
        'isFriendly',
      ),
      translate,
    });

  const parsed =
    createReportSchema.safeParse({
      reportType: 'LOST_PET',
      petId: pet.id,
      speciesId: pet.speciesId,
      status: 'DRAFT',
      title: pet.name,
      titleSource: 'SYSTEM',
      description: finalDescription,
      incidentAt: resolveIncidentAt(
        moment,
        exactDate,
      ),
      exactLocation,
      publicLocation,
      publicLocationPrecision:
        exactLocation && publicLocation
          ? 'APPROXIMATE_500M'
          : 'MUNICIPALITY_ONLY',
      municipalityName:
        locationSource === 'MANUAL'
          ? hasManualCoordinates
            ? municipalityName || null
            : placeLabel || null
          : null,
      locationIsSensitive: true,
      contactMode: 'PLATFORM_ONLY',
      publicPhone: null,
      publicEmail: null,
      resolutionType: null,
      resolutionNotes: null,
      closureReason: null,
    });

  if (!parsed.success) {
    logServerError(
      'report.draft.validation_failed',
      parsed.error,
      {
        userId: user.id,
        petId,
      },
    );

    return {
      status: 'error',
      message: translate(
        'reports.review.errors.validation',
      ),
    };
  }

  try {
    const reportClient =
      supabase as unknown as
        SupabaseClient<ReportDatabase>;
    const reportRepository =
      new ReportRepository(
        reportClient,
      );

    const reportId =
      await createDraftWithOptionalPetPhotos({
        usePetPhotos,
        createDraft: async () => {
          const report =
            await reportRepository.createReport(
              user.id,
              parsed.data,
            );

          return report.id;
        },
        copyPetPhotos: (createdReportId) =>
          copyExistingPetPhotos({
            supabase,
            reportClient,
            userId: user.id,
            petId: pet.id,
            reportId: createdReportId,
          }),
        rollbackDraft: (createdReportId) =>
          compensateFailedDraft({
            reportClient,
            userId: user.id,
            petId: pet.id,
            reportId: createdReportId,
          }),
      });

    revalidatePath('/mis-reportes');

    return {
      status: 'success',
      message: translate(
        'reports.review.success',
      ),
      reportId,
    };
  } catch (error) {
    if (
      error instanceof ReportDataError &&
      error.code === 'REPORT_OPEN_LOST_DUPLICATE'
    ) {
      return {
        status: 'error',
        message: translate(
          'reports.review.errors.duplicateOpen',
        ),
      };
    }

    logServerError(
      'report.draft.create_failed',
      error instanceof
      PetPhotoCopyError
        ? error.cause
        : error,
      {
        userId: user.id,
        petId,
        photoCopyCleanupCompleted:
          error instanceof
          PetPhotoCopyError
            ? error.cleanupCompleted
            : undefined,
      },
    );

    return {
      status: 'error',
      message: translate(
        'reports.review.errors.create',
      ),
    };
  }
}
