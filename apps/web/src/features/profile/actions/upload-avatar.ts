'use server';

import sharp from 'sharp';
import { revalidatePath } from 'next/cache';

import { getServerTranslator } from '@/features/i18n/server';
import { createClient } from '@/services/supabase/server';

import type { UploadAvatarState } from '../types/upload-avatar-state';

export async function uploadAvatarAction(
  _previous: UploadAvatarState,
  formData: FormData,
): Promise<UploadAvatarState> {
  const { translate } = await getServerTranslator();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: 'error', message: translate('profile.avatar.sessionExpired') };
  }

  const value = formData.get('avatar');
  if (!(value instanceof File) || value.size === 0) {
    return { status: 'error', message: translate('profile.avatar.required') };
  }

  if (value.size > 5 * 1024 * 1024) {
    return { status: 'error', message: translate('profile.avatar.size') };
  }

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(value.type)) {
    return { status: 'error', message: translate('profile.avatar.format') };
  }

  let processed: Buffer;
  try {
    processed = await sharp(Buffer.from(await value.arrayBuffer()))
      .rotate()
      .resize(512, 512, { fit: 'cover', position: 'centre' })
      .webp({ quality: 84 })
      .toBuffer();
  } catch {
    return { status: 'error', message: translate('profile.avatar.processError') };
  }

  const path = `${user.id}/avatar.webp`;
  const { error: uploadError } = await supabase.storage
    .from('profile-avatars')
    .upload(path, processed, {
      contentType: 'image/webp',
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    return { status: 'error', message: translate('profile.avatar.uploadError') };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ avatar_path: path })
    .eq('id', user.id);

  if (profileError) {
    await supabase.storage.from('profile-avatars').remove([path]);
    return { status: 'error', message: translate('profile.avatar.profileError') };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/perfil');
  revalidatePath('/perfil/datos');

  return { status: 'success', message: translate('profile.avatar.success') };
}
