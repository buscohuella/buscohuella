'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/services/supabase/server';

export type PublicVisibilityResult = {
  ok: boolean;
  reason?: 'SESSION' | 'ALIAS_REQUIRED' | 'DATABASE';
};

export async function updatePublicVisibilityAction(
  preferences: {
    isPublic: boolean;
    showAvatar: boolean;
    showMunicipality: boolean;
  },
): Promise<PublicVisibilityResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, reason: 'SESSION' };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('public_alias')
    .eq('id', user.id)
    .single<{ public_alias: string | null }>();

  if (profileError) return { ok: false, reason: 'DATABASE' };
  if (preferences.isPublic && !profile.public_alias) {
    return { ok: false, reason: 'ALIAS_REQUIRED' };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      is_public: preferences.isPublic,
      public_show_avatar: preferences.showAvatar,
      public_show_municipality: preferences.showMunicipality,
    } as never)
    .eq('id', user.id);

  if (error) return { ok: false, reason: 'DATABASE' };

  revalidatePath('/perfil');
  revalidatePath('/perfil/datos');
  revalidatePath('/perfil/privacidad');
  if (profile.public_alias) revalidatePath(`/u/${profile.public_alias}`);

  return { ok: true };
}
