'use server';

import {
  ReportRepository,
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
import { createClient } from '@/services/supabase/server';

import type { CreateLostReportDraftState } from '../types/create-lost-report-draft-state';

const PET_PHOTOS_BUCKET = 'pet-photos';
const REPORT_PHOTOS_BUCKET = 'report-photos';

function photoExtension(
  mimeType: string | null,
) {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  return 'webp';
}

async function copyPetPhotosToReport({
  supabase,
  reportClient,
  userId,
  petId,
  reportId,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  reportClient: SupabaseClient<ReportDatabase>;
  userId: string;
  petId: string;
  reportId: string;
}) {
  const petClient =
    supabase as unknown as SupabaseClient<PetDatabase>;
  const photoRepository =
    new PetPhotoRepository(petClient);
  const petPhotos =
    await photoRepository.listPetPhotos(petId);

  if (petPhotos.length === 0) {
    return;
  }

  const uploadedPaths: string[] = [];
  const insertedPhotoIds: string[] = [];

  try {
    for (const [index, petPhoto] of petPhotos.entries()) {
      const {
        data: file,
        error: downloadError,
      } = await supabase.storage
        .from(PET_PHOTOS_BUCKET)
        .download(petPhoto.storagePath);

      if (downloadError || !file) {
        throw downloadError ?? new Error(
          'Pet photo download returned no file',
        );
      }

      const photoId = crypto.randomUUID();
      const mimeType =
        petPhoto.mimeType ?? 'image/webp';
      const storagePath =
        `${userId}/${reportId}/${photoId}.${photoExtension(mimeType)}`;

      const { error: uploadError } =
        await supabase.storage
          .from(REPORT_PHOTOS_BUCKET)
          .upload(storagePath, file, {
            contentType: mimeType,
            cacheControl: '3600',
            upsert: false,
          });

      if (uploadError) {
        throw uploadError;
      }

      uploadedPaths.push(storagePath);
      insertedPhotoIds.push(photoId);

      const { error: metadataError } =
        await reportClient
          .from('report_photos')
          .insert({
            id: photoId,
            report_id: reportId,
            storage_path: storagePath,
            position: index,
            is_primary:
              petPhoto.isPrimary || index === 0,
            alt_text: petPhoto.altText,
            mime_type: mimeType,
            file_size_bytes:
              petPhoto.fileSizeBytes ?? file.size,
            width: petPhoto.width,
            height: petPhoto.height,
          });

      if (metadataError) {
        throw metadataError;
      }
    }
  } catch (error) {
    if (uploadedPaths.length > 0) {
      await supabase.storage
        .from(REPORT_PHOTOS_BUCKET)
        .remove(uploadedPaths);
    }

    if (insertedPhotoIds.length > 0) {
      await reportClient
        .from('report_photos')
        .delete()
        .in('id', insertedPhotoIds);
    }

    throw error;
  }
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

    const report =
      await reportRepository.createReport(
        user.id,
        parsed.data,
      );

    if (usePetPhotos) {
      await copyPetPhotosToReport({
        supabase,
        reportClient,
        userId: user.id,
        petId: pet.id,
        reportId: report.id,
      });
    }

    revalidatePath('/mis-reportes');

    return {
      status: 'success',
      message: translate(
        'reports.review.success',
      ),
      reportId: report.id,
    };
  } catch (error) {
    logServerError(
      'report.draft.create_failed',
      error,
      {
        userId: user.id,
        petId,
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
