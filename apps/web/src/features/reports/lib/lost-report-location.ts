export const lostReportLocationStorageKey =
  'buscohuella:lost-report:location';

export type GpsReportLocation = {
  source: 'GPS';
  placeLabel?: string;
  municipalityName?: string;
  exactLatitude: number;
  exactLongitude: number;
  publicLatitude: number;
  publicLongitude: number;
  accuracyMeters: number | null;
  capturedAt: string;
};

export type ManualReportLocation = {
  source: 'MANUAL';
  placeLabel: string;
  municipalityName?: string;
  exactLatitude?: number;
  exactLongitude?: number;
  publicLatitude?: number;
  publicLongitude?: number;
  capturedAt: string;
};

export type LostReportLocation =
  | GpsReportLocation
  | ManualReportLocation;

export type ReportDraftLocation = LostReportLocation;

export function approximateCoordinate(
  value: number,
) {
  return Number(value.toFixed(3));
}

export function saveLostReportLocation(
  location: LostReportLocation,
) {
  saveReportDraftLocation(
    lostReportLocationStorageKey,
    location,
  );
}

export function saveReportDraftLocation(
  storageKey: string,
  location: ReportDraftLocation,
) {
  window.sessionStorage.setItem(
    storageKey,
    JSON.stringify(location),
  );
}

export function readLostReportLocation():
  | LostReportLocation
  | null {
  return readReportDraftLocation(
    lostReportLocationStorageKey,
  );
}

export function readReportDraftLocation(
  storageKey: string,
): ReportDraftLocation | null {
  const value = window.sessionStorage.getItem(
    storageKey,
  );

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(
      value,
    ) as LostReportLocation;
  } catch {
    window.sessionStorage.removeItem(
      storageKey,
    );
    return null;
  }
}
