'use server';

import { revalidatePath } from 'next/cache';

import { createClient } from '@/services/supabase/server';

import type { ProfileActionState } from '../types/profile-action-state';

function getString(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === 'string' ? value.trim() : '';
}

export async function updateProfileAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const fullName = getString(formData, 'fullName');
  const publicAlias = getString(formData, 'publicAlias').toLowerCase();
  const municipality = getString(formData, 'municipality');
  const bio = getString(formData, 'bio');
  const isPublic = formData.get('isPublic') === 'on';

  const fieldErrors: ProfileActionState['fieldErrors'] = {};

  if (!fullName) {
    fieldErrors.fullName = 'Introduce tu nombre.';
  } else if (fullName.length > 120) {
    fieldErrors.fullName = 'El nombre no puede superar 120 caracteres.';
  }

  if (
    publicAlias &&
    !/^[a-z0-9][a-z0-9_-]{2,29}$/.test(publicAlias)
  ) {
    fieldErrors.publicAlias =
      'Usa entre 3 y 30 caracteres: letras minúsculas, números, guion o guion bajo.';
  }

  if (municipality.length > 120) {
    fieldErrors.municipality =
      'El municipio no puede superar 120 caracteres.';
  }

  if (bio.length > 500) {
    fieldErrors.bio =
      'La biografía no puede superar 500 caracteres.';
  }

  if (isPublic && !publicAlias) {
    fieldErrors.isPublic =
      'Necesitas un alias para activar el perfil público.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 'error',
      message: 'Revisa los campos indicados.',
      fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: 'error',
      message: 'Tu sesión ha caducado. Inicia sesión de nuevo.',
    };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      public_alias: publicAlias || null,
      municipality: municipality || null,
      bio: bio || null,
      is_public: isPublic,
    })
    .eq('id', user.id);

  if (error?.code === '23505') {
    return {
      status: 'error',
      message: 'Ese alias ya está siendo utilizado.',
      fieldErrors: {
        publicAlias: 'Elige otro alias público.',
      },
    };
  }

  if (error) {
    return {
      status: 'error',
      message:
        'No se ha podido guardar el perfil. Inténtalo de nuevo.',
    };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/perfil');
  revalidatePath(`/u/${publicAlias || 'perfil-no-publico'}`);

  return {
    status: 'success',
    message: 'Perfil actualizado correctamente.',
  };
}
