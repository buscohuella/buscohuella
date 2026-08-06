'use server';

import {
  ReportRepository,
  type Database as ReportDatabase,
} from '@buscohuella/report-data';
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

  if (locationSource === 'GPS') {
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
      title: translate(
        'reports.review.generatedTitle',
        { name: pet.name },
      ),
      description: finalDescription,
      incidentAt: resolveIncidentAt(
        moment,
        exactDate,
      ),
      exactLocation,
      publicLocation,
      publicLocationPrecision:
        locationSource === 'GPS'
          ? 'APPROXIMATE_500M'
          : 'MUNICIPALITY_ONLY',
      municipalityName:
        locationSource === 'MANUAL'
          ? placeLabel || null
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
    const reportRepository =
      new ReportRepository(
        supabase as unknown as SupabaseClient<ReportDatabase>,
      );

    const report =
      await reportRepository.createReport(
        user.id,
        parsed.data,
      );

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
