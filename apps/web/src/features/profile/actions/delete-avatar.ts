'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/services/supabase/server';
import { getServerTranslator } from '@/features/i18n/server';

import type { DeleteAvatarState } from '../types/delete-avatar-state';

export async function deleteAvatarAction(_previousState: DeleteAvatarState, _formData: FormData): Promise<DeleteAvatarState> {
  void _previousState;
  void _formData;
  const { translate } = await getServerTranslator();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: 'error', message: translate('profile.avatar.sessionExpired') };

  const { data: profile, error: profileError } = await supabase.from('profiles').select('avatar_path').eq('id', user.id).maybeSingle();
  if (profileError) return { status: 'error', message: translate('profile.avatar.deleteError') };

  if (profile?.avatar_path) {
    const { error: storageError } = await supabase.storage.from('profile-avatars').remove([profile.avatar_path]);
    if (storageError) return { status: 'error', message: translate('profile.avatar.deleteError') };
  }

  const { error: updateError } = await supabase.from('profiles').update({ avatar_path: null }).eq('id', user.id);
  if (updateError) return { status: 'error', message: translate('profile.avatar.profileError') };

  revalidatePath('/', 'layout');
  revalidatePath('/perfil');
  revalidatePath('/perfil/datos');
  return { status: 'success', message: translate('profile.avatar.deleteSuccess') };
}
