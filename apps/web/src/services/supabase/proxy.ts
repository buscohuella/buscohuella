import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

import { getPrivateRouteLoginRedirect } from '@/features/auth/lib/private-route';
import { env } from '@/lib/env';

const AUTH_RESPONSE_HEADERS = [
  'cache-control',
  'expires',
  'pragma',
] as const;

function redirectWithAuthState(
  redirectUrl: URL,
  authResponse: NextResponse,
) {
  const redirectResponse = NextResponse.redirect(redirectUrl);

  authResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  AUTH_RESPONSE_HEADERS.forEach((header) => {
    const value = authResponse.headers.get(header);

    if (value) {
      redirectResponse.headers.set(header, value);
    }
  });

  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    env.supabaseUrl,
    env.supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
  cookiesToSet.forEach(({ name, value }) => {
    request.cookies.set(name, value);
  });

  response = NextResponse.next({
    request,
  });

  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
},
      },
    },
  );

  // Verifica el token y actualiza las cookies cuando sea necesario.
  const { data } = await supabase.auth.getClaims();
  const loginRedirect = getPrivateRouteLoginRedirect(
    request.nextUrl,
    Boolean(data?.claims?.sub),
  );

  if (loginRedirect) {
    return redirectWithAuthState(loginRedirect, response);
  }

  return response;
}
