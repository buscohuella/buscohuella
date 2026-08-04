import {
  PetDomainError,
  type PetErrorCode,
} from '@buscohuella/pet-domain';

export interface SupabaseLikeError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

const POSTGRES_TO_PET_ERROR: Record<string, PetErrorCode> = {
  '23505': 'PET_MICROCHIP_DUPLICATE',
  '23503': 'PET_OWNER_MISMATCH',
  '23514': 'PET_UNKNOWN',
  '42501': 'PET_FORBIDDEN',
  PGRST116: 'PET_NOT_FOUND',
  P0002: 'PET_NOT_FOUND',
};

function inferPetErrorCode(
  error: SupabaseLikeError,
  fallback: PetErrorCode,
): PetErrorCode {
  const message = `${error.message ?? ''} ${error.details ?? ''}`;

  if (message.includes('PET_PHOTO_LIMIT_REACHED')) {
    return 'PET_PHOTO_LIMIT_REACHED';
  }

  if (message.includes('PET_PHOTO_NOT_FOUND')) {
    return 'PET_NOT_FOUND';
  }

  if (message.includes('mime type')) {
    return 'PET_PHOTO_UNSUPPORTED_TYPE';
  }

  if (message.includes('maximum allowed size')) {
    return 'PET_PHOTO_TOO_LARGE';
  }

  return error.code
    ? POSTGRES_TO_PET_ERROR[error.code] ?? fallback
    : fallback;
}

export const normalizePetDataError = (
  error: SupabaseLikeError,
  fallback: PetErrorCode = 'PET_UNKNOWN',
): PetDomainError => {
  const code = inferPetErrorCode(error, fallback);

  return new PetDomainError(
    code,
    error.message ?? 'Pet data operation failed',
    error,
  );
};
