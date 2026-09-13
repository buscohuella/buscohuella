import { type NextRequest, NextResponse } from 'next/server';

import {
  localeCookieMaxAge,
  localeCookieName,
  normalizeLocale,
} from '@/features/i18n/config';
import {
  recoveryFlowCookie,
  recoveryFlowCookieMaxAge,
} from '@/features/auth/lib/recovery-flow';
import {
  getEmailConfirmationAttempt,
  getSafeEmailConfirmationNextPath,
} from '@/features/auth/lib/email-confirmation';
import { createClient } from '@/services/supabase/server';

export async function GET(request: NextRequest) {
  const attempt = getEmailConfirmationAttempt(
    request.nextUrl.searchParams,
  );
  const requestedLocale = normalizeLocale(
    request.nextUrl.searchParams.get('locale'),
  );

  if (attempt) {
    const supabase = await createClient();
    const { error } = attempt.method === 'pkce'
      ? await supabase.auth.exchangeCodeForSession(attempt.code)
      : await supabase.auth.verifyOtp({
          type: attempt.type,
          token_hash: attempt.tokenHash,
        });

    if (!error) {
      const next = getSafeEmailConfirmationNextPath(
        request.nextUrl.searchParams.get('next'),
        attempt,
      );
      const response = NextResponse.redirect(
        new URL(next, request.url),
      );

      if (requestedLocale) {
        response.cookies.set(localeCookieName, requestedLocale, {
          httpOnly: false,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: localeCookieMaxAge,
        });
      }

      if (
        attempt.method === 'token_hash' &&
        attempt.type === 'recovery'
      ) {
        response.cookies.set(recoveryFlowCookie, '1', {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: recoveryFlowCookieMaxAge,
        });
      }

      return response;
    }
  }

  return NextResponse.redirect(
    new URL('/login?auth_error=confirmation', request.url),
  );
}
