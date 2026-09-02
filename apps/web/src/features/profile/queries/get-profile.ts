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

  const { data: privacyData } = await supabase
    .from('profiles')
    .select('public_show_avatar, public_show_municipality')
    .eq('id', user.id)
    .maybeSingle<{
      public_show_avatar: boolean;
      public_show_municipality: boolean;
    }>();

  const { data: signedAvatar } = data.avatar_path
    ? await supabase.storage
        .from('profile-avatars')
        .createSignedUrl(data.avatar_path, 3600)
    : { data: null };

  return {
    id: data.id,
    fullName: data.full_name,
    publicAlias: data.public_alias ?? '',
    avatarPath: data.avatar_path ?? '',
    avatarUrl: signedAvatar?.signedUrl ?? '',
    municipality: data.municipality ?? '',
    bio: data.bio ?? '',
    isPublic: data.is_public,
    publicShowAvatar: privacyData?.public_show_avatar ?? true,
    publicShowMunicipality: privacyData?.public_show_municipality ?? true,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}
