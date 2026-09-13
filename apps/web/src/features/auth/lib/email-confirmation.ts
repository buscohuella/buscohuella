import type { EmailOtpType } from '@supabase/supabase-js';

const EMAIL_OTP_TYPES = [
  'email',
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
] as const satisfies readonly EmailOtpType[];
const INTERNAL_ORIGIN = 'https://buscohuella.invalid';

export type EmailConfirmationAttempt =
  | { method: 'pkce'; code: string }
  | {
      method: 'token_hash';
      tokenHash: string;
      type: EmailOtpType;
    };

function isEmailOtpType(value: string | null): value is EmailOtpType {
  return value !== null && EMAIL_OTP_TYPES.some((type) => type === value);
}

export function getEmailConfirmationAttempt(
  searchParams: URLSearchParams,
): EmailConfirmationAttempt | null {
  const code = searchParams.get('code');

  if (code) {
    return { method: 'pkce', code };
  }

  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type');

  if (tokenHash && isEmailOtpType(type)) {
    return { method: 'token_hash', tokenHash, type };
  }

  return null;
}

export function getSafeEmailConfirmationNextPath(
  value: string | null,
  attempt: EmailConfirmationAttempt,
) {
  if (value && value.startsWith('/') && !value.startsWith('//')) {
    try {
      const resolved = new URL(value, INTERNAL_ORIGIN);

      if (resolved.origin === INTERNAL_ORIGIN) {
        return value;
      }
    } catch {
      // Fall through to the safe default for malformed destinations.
    }
  }

  return attempt.method === 'token_hash' && attempt.type === 'recovery'
    ? '/nueva-contrasena'
    : '/inicio?account_confirmed=1';
}
