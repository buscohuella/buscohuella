import { createClient } from '@/services/supabase/server';

import type { PublicProfile } from '../types/public-profile';

interface PublicProfileRow {
  public_alias: string;
  avatar_path: string | null;
  municipality: string | null;
  bio: string | null;
  created_at: string;
}

export async function getPublicProfile(
  alias: string,
): Promise<PublicProfile | null> {
  const normalizedAlias = alias.trim().toLowerCase();

  if (!/^[a-z0-9][a-z0-9_-]{2,29}$/.test(normalizedAlias)) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from('public_profiles')
    .select(
      'public_alias, avatar_path, municipality, bio, created_at',
    )
    .eq('public_alias', normalizedAlias)
    .maybeSingle<PublicProfileRow>();

  if (error || !data) {
    return null;
  }

  return {
    publicAlias: data.public_alias,
    avatarPath: data.avatar_path ?? '',
    municipality: data.municipality ?? '',
    bio: data.bio ?? '',
    createdAt: data.created_at,
  };
}
