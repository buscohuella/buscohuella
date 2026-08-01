import { createClient } from '@/services/supabase/server';

import type { AuthUser } from '../types/auth-user';

interface ProfileIdentityRow {
  full_name: string;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle<ProfileIdentityRow>();

  const metadataFullName =
    typeof user.user_metadata.full_name === 'string'
      ? user.user_metadata.full_name.trim()
      : '';

  const profileFullName = profile?.full_name.trim() ?? '';

  return {
    id: user.id,
    email: user.email ?? '',
    fullName:
      profileFullName ||
      metadataFullName ||
      user.email?.split('@')[0] ||
      'Usuario',
  };
}
