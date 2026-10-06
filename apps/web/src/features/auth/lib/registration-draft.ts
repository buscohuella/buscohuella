import { validateEmail } from './email-policy';
import { getSafeInternalPath } from './safe-redirect';

export const registrationDraftStorageKey =
  'buscohuella:registration-draft';
export const registrationDraftMaxAgeMs = 15 * 60 * 1000;

export interface RegistrationDraft {
  fullName: string;
  email: string;
  next: string | null;
  createdAt: number;
}

export function createRegistrationDraft(
  {
    fullName,
    email,
    next,
  }: {
    fullName: string;
    email: string;
    next?: string | null;
  },
  createdAt = Date.now(),
): RegistrationDraft | null {
  const normalizedFullName = fullName.trim();
  const emailValidation = validateEmail(email);

  if (
    !normalizedFullName ||
    normalizedFullName.length > 120 ||
    !emailValidation.isValid
  ) {
    return null;
  }

  return {
    fullName: normalizedFullName,
    email: emailValidation.normalizedEmail,
    next: getSafeInternalPath(next ?? null),
    createdAt,
  };
}

export function parseRegistrationDraft(
  serializedDraft: string | null,
  now = Date.now(),
): RegistrationDraft | null {
  if (!serializedDraft) {
    return null;
  }

  try {
    const value: unknown = JSON.parse(serializedDraft);

    if (!value || typeof value !== 'object') {
      return null;
    }

    const candidate = value as Record<string, unknown>;

    if (
      typeof candidate.fullName !== 'string' ||
      typeof candidate.email !== 'string' ||
      typeof candidate.createdAt !== 'number' ||
      !Number.isFinite(candidate.createdAt) ||
      candidate.createdAt > now ||
      now - candidate.createdAt > registrationDraftMaxAgeMs
    ) {
      return null;
    }

    return createRegistrationDraft(
      {
        fullName: candidate.fullName,
        email: candidate.email,
        next:
          typeof candidate.next === 'string'
            ? candidate.next
            : null,
      },
      candidate.createdAt,
    );
  } catch {
    return null;
  }
}

export function buildRegistrationEditPath(next: string | null) {
  const searchParams = new URLSearchParams({ edit: '1' });
  const safeNext = getSafeInternalPath(next);

  if (safeNext) {
    searchParams.set('next', safeNext);
  }

  return `/registro?${searchParams.toString()}`;
}
