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

interface EmailConfirmationAuth {
  exchangeCodeForSession(
    code: string,
  ): Promise<{ error: unknown | null }>;
  verifyOtp(params: {
    type: EmailOtpType;
    token_hash: string;
  }): Promise<{ error: unknown | null }>;
}

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

export async function verifyEmailConfirmationAttempt(
  attempt: EmailConfirmationAttempt,
  auth: EmailConfirmationAuth,
) {
  const { error } =
    attempt.method === 'pkce'
      ? await auth.exchangeCodeForSession(attempt.code)
      : await auth.verifyOtp({
          type: attempt.type,
          token_hash: attempt.tokenHash,
        });

  return error === null;
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

export function getEmailConfirmationErrorPath(
  searchParams: URLSearchParams,
) {
  return searchParams.get('flow') === 'recovery'
    ? '/recuperar-contrasena?recovery_expired=1'
    : '/login?auth_error=confirmation';
}
