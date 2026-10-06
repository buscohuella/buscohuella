import { NextResponse } from 'next/server';

import { getSafeInternalPath } from '@/features/auth/lib/safe-redirect';
import { createClient } from '@/services/supabase/server';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next =
    getSafeInternalPath(url.searchParams.get('next')) ?? '/inicio';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const metadata = user?.user_metadata ?? {};
      const hasName = [metadata.full_name, metadata.name].some(
        (value) => typeof value === 'string' && value.trim().length > 0,
      );

      if (!hasName) {
        return NextResponse.redirect(
          new URL('/perfil/datos?setup=1', url.origin),
        );
      }

      const destination = next === '/inicio'
        ? '/inicio?login=success'
        : next;
      return NextResponse.redirect(new URL(destination, url.origin));
    }
  }

  return NextResponse.redirect(new URL('/login?auth_error=oauth', url.origin));
}
