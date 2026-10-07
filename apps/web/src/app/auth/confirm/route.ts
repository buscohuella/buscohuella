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
  getEmailConfirmationErrorPath,
  getEmailConfirmationAttempt,
  getSafeEmailConfirmationNextPath,
  isPasswordRecoveryConfirmation,
  verifyEmailConfirmationAttempt,
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
    const confirmationSucceeded =
      await verifyEmailConfirmationAttempt(
        attempt,
        supabase.auth,
      );

    if (confirmationSucceeded) {
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
        isPasswordRecoveryConfirmation(
          request.nextUrl.searchParams,
          attempt,
        )
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
    new URL(
      getEmailConfirmationErrorPath(
        request.nextUrl.searchParams,
      ),
      request.url,
    ),
  );
}
