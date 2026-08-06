export const lostReportDetailsStorageKey =
  'buscohuella:lost-report:details';

export type LostReportDetails = {
  description: string;
  hasCollarOrHarness: boolean;
  needsMedication: boolean;
  isFearful: boolean;
  isFriendly: boolean;
  usePetPhotos: boolean;
  savedAt: string;
};

export function saveLostReportDetails(
  details: LostReportDetails,
) {
  window.sessionStorage.setItem(
    lostReportDetailsStorageKey,
    JSON.stringify(details),
  );
}

export function readLostReportDetails():
  | LostReportDetails
  | null {
  const value = window.sessionStorage.getItem(
    lostReportDetailsStorageKey,
  );

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(
      value,
    ) as LostReportDetails;
  } catch {
    window.sessionStorage.removeItem(
      lostReportDetailsStorageKey,
    );
    return null;
  }
}
