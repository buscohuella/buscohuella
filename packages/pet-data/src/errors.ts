import { PetDomainError, type PetErrorCode } from '@buscohuella/pet-domain';

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
};

export const normalizePetDataError = (
  error: SupabaseLikeError,
  fallback: PetErrorCode = 'PET_UNKNOWN',
): PetDomainError => {
  const code = error.code ? POSTGRES_TO_PET_ERROR[error.code] ?? fallback : fallback;

  return new PetDomainError(
    code,
    error.message ?? 'Pet data operation failed',
    error,
  );
};
