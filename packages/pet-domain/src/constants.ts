export const PET_STATUSES = ['ACTIVE', 'ARCHIVED', 'DECEASED'] as const;

export const PET_VISIBILITIES = [
  'PRIVATE',
  'PUBLIC_WHEN_REPORTED',
  'PUBLIC',
] as const;

export const PET_SEXES = ['FEMALE', 'MALE', 'UNKNOWN'] as const;

export const PET_SIZES = [
  'TINY',
  'SMALL',
  'MEDIUM',
  'LARGE',
  'GIANT',
  'UNKNOWN',
] as const;

export const BIRTH_DATE_PRECISIONS = [
  'EXACT',
  'APPROXIMATE',
  'UNKNOWN',
] as const;

export const BREED_KNOWLEDGE_VALUES = [
  'KNOWN',
  'UNKNOWN',
  'MIXED_UNKNOWN',
] as const;

export const PET_PHOTO_VISIBILITIES = [
  'PRIVATE',
  'PUBLIC_PROFILE',
  'PUBLIC_REPORT',
] as const;

export const PET_SPECIES_CATEGORIES = [
  'COMPANION',
  'EQUINE',
  'FARM',
  'OTHER',
] as const;

export const PET_LIMITS = {
  nameMinLength: 1,
  nameMaxLength: 80,
  breedMaxLength: 120,
  colorMaxLength: 80,
  secondaryColorsMaxCount: 8,
  descriptionMaxLength: 1_000,
  distinctiveFeaturesMaxLength: 1_000,
  identificationNotesMaxLength: 1_000,
  privateNotesMaxLength: 2_000,
  microchipMinLength: 8,
  microchipMaxLength: 30,
  photosMaxCount: 10,
  photoMaxSizeBytes: 8 * 1024 * 1024,
  photoAltTextMaxLength: 300,
} as const;

export const PET_PHOTO_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const DEFAULT_PET_VALUES = {
  breedKnowledge: 'UNKNOWN',
  primaryBreedId: null,
  secondaryBreedId: null,
  isMixedBreed: false,
  sex: 'UNKNOWN',
  birthDatePrecision: 'UNKNOWN',
  size: 'UNKNOWN',
  secondaryColors: [],
  hasMicrochip: false,
  status: 'ACTIVE',
  visibility: 'PUBLIC_WHEN_REPORTED',
} as const;
