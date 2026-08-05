export const REPORT_TYPES = [
  'LOST_PET',
  'FOUND_ANIMAL',
] as const;

export const REPORT_STATUSES = [
  'DRAFT',
  'ACTIVE',
  'PAUSED',
  'RESOLVED',
  'CLOSED',
  'ARCHIVED',
] as const;

export const REPORT_RESOLUTION_TYPES = [
  'REUNITED',
  'OWNER_LOCATED',
  'TRANSFERRED_TO_AUTHORITY',
  'TRANSFERRED_TO_SHELTER',
  'SAFE_WITH_FINDER',
  'OTHER',
] as const;

export const REPORT_LOCATION_PRECISIONS = [
  'EXACT_AREA',
  'APPROXIMATE_100M',
  'APPROXIMATE_500M',
  'APPROXIMATE_1KM',
  'MUNICIPALITY_ONLY',
  'HIDDEN',
] as const;

export const REPORT_CONTACT_MODES = [
  'PLATFORM_ONLY',
  'PUBLIC_PHONE',
  'PUBLIC_EMAIL',
  'HIDDEN',
] as const;

export const SIGHTING_CONFIDENCE_VALUES = [
  'UNSURE',
  'POSSIBLE',
  'LIKELY',
  'CERTAIN',
] as const;

export const SIGHTING_REVIEW_STATUSES = [
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'FLAGGED',
] as const;

export const REPORT_EVENT_TYPES = [
  'CREATED',
  'PUBLISHED',
  'PAUSED',
  'REACTIVATED',
  'UPDATED',
  'SIGHTING_CREATED',
  'RESOLVED',
  'CLOSED',
  'ARCHIVED',
] as const;

export const REPORT_PHOTO_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const REPORT_LIMITS = {
  titleMinLength: 1,
  titleMaxLength: 120,
  descriptionMinLength: 1,
  descriptionMaxLength: 4_000,
  municipalityMaxLength: 160,
  publicPhoneMinLength: 6,
  publicPhoneMaxLength: 40,
  publicEmailMaxLength: 320,
  resolutionNotesMaxLength: 2_000,
  closureReasonMaxLength: 1_000,
  photoAltTextMaxLength: 300,
  reportPhotosMaxCount: 10,
  sightingPhotosMaxCount: 5,
  photoMaxSizeBytes: 8 * 1024 * 1024,
  imageMaxDimension: 10_000,
  imageMaxPixels: 25_000_000,
  sightingNotesMaxLength: 2_000,
} as const;

export const DEFAULT_REPORT_VALUES = {
  status: 'DRAFT',
  publicLocationPrecision: 'APPROXIMATE_500M',
  contactMode: 'PLATFORM_ONLY',
  locationIsSensitive: false,
} as const;

export const DEFAULT_SIGHTING_VALUES = {
  publicLocationPrecision: 'APPROXIMATE_500M',
  confidence: 'UNSURE',
  reviewStatus: 'PENDING',
} as const;

export const OPEN_REPORT_STATUSES = [
  'DRAFT',
  'ACTIVE',
  'PAUSED',
] as const;

export const PUBLIC_REPORT_STATUSES = [
  'ACTIVE',
] as const;
