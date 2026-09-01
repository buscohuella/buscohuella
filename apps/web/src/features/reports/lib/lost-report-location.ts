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

export function approximateCoordinate(
  value: number,
) {
  return Number(value.toFixed(3));
}

export function saveLostReportLocation(
  location: LostReportLocation,
) {
  window.sessionStorage.setItem(
    lostReportLocationStorageKey,
    JSON.stringify(location),
  );
}

export function readLostReportLocation():
  | LostReportLocation
  | null {
  const value = window.sessionStorage.getItem(
    lostReportLocationStorageKey,
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
      lostReportLocationStorageKey,
    );
    return null;
  }
}
