import { createClient } from '@/services/supabase/server';

import type { AuthUser } from '../types/auth-user';

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const fullName =
    typeof user.user_metadata.full_name === 'string'
      ? user.user_metadata.full_name.trim()
      : '';

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: fullName || user.email?.split('@')[0] || 'Usuario',
  };
}
