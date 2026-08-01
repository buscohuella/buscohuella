import type { EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest, NextResponse } from 'next/server';

import {
  recoveryFlowCookie,
  recoveryFlowCookieMaxAge,
} from '@/features/auth/lib/recovery-flow';
import { createClient } from '@/services/supabase/server';

function getSafeNextPath(
  value: string | null,
  type: EmailOtpType | null,
) {
  if (value && value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }

  return type === 'recovery'
    ? '/nueva-contrasena'
    : '/inicio?account_confirmed=1';
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get('token_hash');
  const type = request.nextUrl.searchParams.get(
    'type',
  ) as EmailOtpType | null;
  const next = getSafeNextPath(
    request.nextUrl.searchParams.get('next'),
    type,
  );

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (!error) {
      const response = NextResponse.redirect(
        new URL(next, request.url),
      );

      if (type === 'recovery') {
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
