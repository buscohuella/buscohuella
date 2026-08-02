export const PET_ERROR_CODES = [
  'PET_NAME_INVALID',
  'PET_SPECIES_DISABLED',
  'PET_BIRTH_DATE_FUTURE',
  'PET_WEIGHT_INVALID',
  'PET_MICROCHIP_INVALID',
  'PET_MICROCHIP_DUPLICATE',
  'PET_STATUS_TRANSITION_INVALID',
  'PET_OWNER_MISMATCH',
  'PET_PHOTO_LIMIT_REACHED',
  'PET_PHOTO_UNSUPPORTED_TYPE',
  'PET_PHOTO_TOO_LARGE',
  'PET_PRIMARY_PHOTO_CONFLICT',
  'PET_NOT_FOUND',
  'PET_FORBIDDEN',
  'PET_UNKNOWN',
] as const;

export type PetErrorCode = (typeof PET_ERROR_CODES)[number];

export class PetDomainError extends Error {
  readonly code: PetErrorCode;
  readonly cause?: unknown;

  constructor(code: PetErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = 'PetDomainError';
    this.code = code;
    this.cause = cause;
  }
}
