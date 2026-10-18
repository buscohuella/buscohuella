import type { GeoPoint } from '@buscohuella/report-domain';

export const reportIncidentMoments = ['NOW', 'RECENT', 'TODAY', 'YESTERDAY', 'CUSTOM'] as const;

export type ReportIncidentMoment = (typeof reportIncidentMoments)[number];

export type ReportDraftLocationInput = {
  source: string;
  exactLatitude: number | null;
  exactLongitude: number | null;
  publicLatitude: number | null;
  publicLongitude: number | null;
  placeLabel: string;
  municipalityName: string;
};

export type ParsedReportDraftLocation = {
  exactLocation: GeoPoint | null;
  publicLocation: GeoPoint | null;
  municipalityName: string | null;
  publicLocationPrecision: 'APPROXIMATE_500M' | 'MUNICIPALITY_ONLY';
};

export function getFormString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === 'string' ? value.trim() : '';
}

export function getFormBoolean(formData: FormData, name: string) {
  return getFormString(formData, name) === 'true';
}

export function getFormNullableNumber(formData: FormData, name: string) {
  const value = getFormString(formData, name);

  if (!value) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

export function isReportIncidentMoment(value: string): value is ReportIncidentMoment {
  return reportIncidentMoments.some((moment) => moment === value);
}

export function resolveIncidentAt(moment: string, exactDate: string) {
  if (moment === 'CUSTOM') {
    const date = new Date(exactDate);

    if (!exactDate || Number.isNaN(date.getTime()) || date.getTime() > Date.now()) {
      return null;
    }

    return date.toISOString();
  }

  if (moment === 'NOW') {
    return new Date().toISOString();
  }

  return null;
}

export function parseReportDraftLocation(
  input: ReportDraftLocationInput,
): ParsedReportDraftLocation | null {
  if (!['GPS', 'MANUAL'].includes(input.source)) {
    return null;
  }

  const hasAnyCoordinates =
    input.exactLatitude !== null ||
    input.exactLongitude !== null ||
    input.publicLatitude !== null ||
    input.publicLongitude !== null;

  if (input.source === 'GPS' || hasAnyCoordinates) {
    if (
      input.exactLatitude === null ||
      input.exactLongitude === null ||
      input.publicLatitude === null ||
      input.publicLongitude === null
    ) {
      return null;
    }

    return {
      exactLocation: {
        latitude: input.exactLatitude,
        longitude: input.exactLongitude,
      },
      publicLocation: {
        latitude: input.publicLatitude,
        longitude: input.publicLongitude,
      },
      municipalityName: input.municipalityName || null,
      publicLocationPrecision: 'APPROXIMATE_500M',
    };
  }

  if (input.placeLabel.length < 3) {
    return null;
  }

  return {
    exactLocation: null,
    publicLocation: null,
    municipalityName: input.municipalityName || input.placeLabel,
    publicLocationPrecision: 'MUNICIPALITY_ONLY',
  };
}
