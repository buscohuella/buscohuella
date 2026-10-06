import type { EmailOtpType } from '@supabase/supabase-js';

import { getSafeInternalPath } from './safe-redirect';

const EMAIL_OTP_TYPES = [
  'email',
  'signup',
  'invite',
  'magiclink',
  'recovery',
  'email_change',
] as const satisfies readonly EmailOtpType[];

export type EmailConfirmationAttempt =
  | { method: 'pkce'; code: string }
  | {
      method: 'token_hash';
      tokenHash: string;
      type: EmailOtpType;
    };

export function buildEmailConfirmationRedirectUrl({
  origin,
  locale,
  next,
}: {
  origin: string;
  locale: string;
  next: string | null;
}) {
  const redirectUrl = new URL('/auth/confirm', origin);
  redirectUrl.searchParams.set('locale', locale);

  const safeNext = getSafeInternalPath(next);

  if (safeNext) {
    redirectUrl.searchParams.set('next', safeNext);
  }

  return redirectUrl.toString();
}

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

export function isPasswordRecoveryConfirmation(
  searchParams: URLSearchParams,
  attempt: EmailConfirmationAttempt,
) {
  return (
    (attempt.method === 'token_hash' &&
      attempt.type === 'recovery') ||
    (attempt.method === 'pkce' &&
      searchParams.get('flow') === 'recovery')
  );
}

export function getSafeEmailConfirmationNextPath(
  value: string | null,
  attempt: EmailConfirmationAttempt,
) {
  const safeNext = getSafeInternalPath(value);

  if (safeNext) {
    return safeNext;
  }

  return attempt.method === 'token_hash' && attempt.type === 'recovery'
    ? '/nueva-contrasena'
    : '/inicio?account_confirmed=1';
}
