export type ReportDataErrorCode =
  | 'REPORT_NOT_FOUND'
  | 'REPORT_FORBIDDEN'
  | 'REPORT_OPEN_LOST_DUPLICATE'
  | 'REPORT_INVALID'
  | 'REPORT_TRANSITION_INVALID'
  | 'REPORT_NOT_ACCEPTING_SIGHTINGS'
  | 'SIGHTING_NOT_FOUND'
  | 'REPORT_UNKNOWN';

export interface SupabaseLikeError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

export class ReportDataError extends Error {
  constructor(
    public readonly code: ReportDataErrorCode,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ReportDataError';
  }
}

const inferCode = (
  error: SupabaseLikeError,
  fallback: ReportDataErrorCode,
): ReportDataErrorCode => {
  const message =
    `${error.message ?? ''} ${error.details ?? ''}`.toUpperCase();

  if (
    message.includes('REPORTS_ONE_OPEN_LOST_PET_IDX') ||
    (error.code === '23505' && message.includes('PET_ID'))
  ) {
    return 'REPORT_OPEN_LOST_DUPLICATE';
  }

  if (message.includes('REPORT_STATUS_TRANSITION_INVALID')) {
    return 'REPORT_TRANSITION_INVALID';
  }

  if (message.includes('REPORT_NOT_ACCEPTING_SIGHTINGS')) {
    return 'REPORT_NOT_ACCEPTING_SIGHTINGS';
  }

  if (
    message.includes('REPORT_') ||
    message.includes('SIGHTING_') ||
    error.code === '23514' ||
    error.code === '22023' ||
    error.code === '22007'
  ) {
    return 'REPORT_INVALID';
  }

  if (error.code === '42501') return 'REPORT_FORBIDDEN';
  if (error.code === 'PGRST116' || error.code === 'P0002') {
    return fallback;
  }

  return fallback;
};

export const normalizeReportDataError = (
  error: SupabaseLikeError,
  fallback: ReportDataErrorCode = 'REPORT_UNKNOWN',
): ReportDataError =>
  new ReportDataError(
    inferCode(error, fallback),
    error.message ?? 'Report data operation failed',
    error,
  );
