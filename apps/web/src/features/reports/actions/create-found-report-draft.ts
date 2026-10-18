'use server';

import { PetRepository } from '@buscohuella/pet-data';
import { ReportRepository, type Database as ReportDatabase } from '@buscohuella/report-data';
import { createReportSchema } from '@buscohuella/report-domain';
import type { SupabaseClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

import { getServerTranslator } from '@/features/i18n/server';
import { formatDate } from '@/features/i18n/format';
import { logServerError } from '@/lib/server-logger';
import { createClient } from '@/services/supabase/server';

import {
  composeFoundAnimalDescription,
  type FoundAnimalCareStatus,
} from '../lib/found-report-details';
import {
  getFormNullableNumber,
  getFormString,
  isReportIncidentMoment,
  parseReportDraftLocation,
  resolveIncidentAt,
} from '../lib/report-draft-input';
import type { CreateFoundReportDraftState } from '../types/create-found-report-draft-state';

function isCareStatus(value: string): value is FoundAnimalCareStatus {
  return value === 'IN_CARE' || value === 'LOCATED';
}

export async function createFoundReportDraftAction(
  _previousState: CreateFoundReportDraftState,
  formData: FormData,
): Promise<CreateFoundReportDraftState> {
  const { locale, translate } = await getServerTranslator();
  const speciesId = Number(getFormString(formData, 'speciesId'));
  const description = getFormString(formData, 'description');
  const careStatus = getFormString(formData, 'careStatus');
  const moment = getFormString(formData, 'moment');
  const exactDate = getFormString(formData, 'exactDate');
  const parsedLocation = parseReportDraftLocation({
    source: getFormString(formData, 'locationSource'),
    exactLatitude: getFormNullableNumber(formData, 'exactLatitude'),
    exactLongitude: getFormNullableNumber(formData, 'exactLongitude'),
    publicLatitude: getFormNullableNumber(formData, 'publicLatitude'),
    publicLongitude: getFormNullableNumber(formData, 'publicLongitude'),
    placeLabel: getFormString(formData, 'placeLabel'),
    municipalityName: getFormString(formData, 'municipalityName'),
  });
  const incidentAt = resolveIncidentAt(moment, exactDate);

  if (
    !Number.isInteger(speciesId) ||
    speciesId <= 0 ||
    description.length > 500 ||
    !isCareStatus(careStatus) ||
    !isReportIncidentMoment(moment) ||
    (moment === 'CUSTOM' && !incidentAt)
  ) {
    return {
      status: 'error',
      message: translate('reports.found.review.errors.incomplete'),
    };
  }

  if (!parsedLocation) {
    return {
      status: 'error',
      message: translate('reports.found.review.errors.location'),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      message: translate('reports.found.review.errors.session'),
    };
  }

  let speciesCode: string;

  try {
    const species = await new PetRepository(supabase).listEnabledSpecies({
      mvpOnly: true,
    });
    const selectedSpecies = species.find((item) => item.id === speciesId);

    if (!selectedSpecies) {
      return {
        status: 'error',
        message: translate('reports.found.review.errors.species'),
      };
    }

    speciesCode = selectedSpecies.code;
  } catch (error) {
    logServerError('report.found.species_validation_failed', error, {
      userId: user.id,
      speciesId,
    });

    return {
      status: 'error',
      message: translate('reports.found.review.errors.species'),
    };
  }

  const speciesName = translate(`pets.form.speciesOptions.${speciesCode}`);
  const title = translate('reports.found.quick.generatedTitle', {
    species: speciesName,
  });
  const finalDescription = composeFoundAnimalDescription({
    description,
    careStatus,
    careHeading: translate('reports.found.review.careHeading'),
    momentHeading: translate('reports.found.review.momentHeading'),
    momentLabel:
      moment === 'CUSTOM' && incidentAt
        ? `${translate('reports.incidentTime.summary.CUSTOM')}: ${formatDate(incidentAt, locale, {
            dateStyle: 'long',
            timeStyle: 'short',
          })}`
        : translate(`reports.incidentTime.summary.${moment}`),
    inCareLabel: translate('reports.found.care.options.IN_CARE.description'),
    locatedLabel: translate('reports.found.care.options.LOCATED.description'),
  });
  const parsed = createReportSchema.safeParse({
    reportType: 'FOUND_ANIMAL',
    petId: null,
    speciesId,
    status: 'DRAFT',
    title,
    titleSource: 'SYSTEM',
    description: finalDescription,
    incidentAt,
    exactLocation: parsedLocation.exactLocation,
    publicLocation: parsedLocation.publicLocation,
    publicLocationPrecision: parsedLocation.publicLocationPrecision,
    municipalityName: parsedLocation.municipalityName,
    locationIsSensitive: true,
    contactMode: 'PLATFORM_ONLY',
    publicPhone: null,
    publicEmail: null,
    resolutionType: null,
    resolutionNotes: null,
    closureReason: null,
  });

  if (!parsed.success) {
    logServerError('report.found.validation_failed', parsed.error, {
      userId: user.id,
      speciesId,
    });

    return {
      status: 'error',
      message: translate('reports.found.review.errors.validation'),
    };
  }

  try {
    const client = supabase as unknown as SupabaseClient<ReportDatabase>;
    const report = await new ReportRepository(client).createReport(user.id, parsed.data);

    revalidatePath('/mis-reportes');
    revalidatePath('/mis-avisos/propios');

    return {
      status: 'success',
      message: translate('reports.found.review.success'),
      reportId: report.id,
    };
  } catch (error) {
    logServerError('report.found.create_failed', error, {
      userId: user.id,
      speciesId,
    });

    return {
      status: 'error',
      message: translate('reports.found.review.errors.create'),
    };
  }
}
