import { createClient } from '@/services/supabase/server';

import type { UserProfile } from '../types/profile';

interface ProfileRow {
  id: string;
  full_name: string;
  public_alias: string | null;
  avatar_path: string | null;
  municipality: string | null;
  bio: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export async function getProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select(
      'id, full_name, public_alias, avatar_path, municipality, bio, is_public, created_at, updated_at',
    )
    .eq('id', user.id)
    .single<ProfileRow>();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    fullName: data.full_name,
    publicAlias: data.public_alias ?? '',
    avatarPath: data.avatar_path ?? '',
    municipality: data.municipality ?? '',
    bio: data.bio ?? '',
    isPublic: data.is_public,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
