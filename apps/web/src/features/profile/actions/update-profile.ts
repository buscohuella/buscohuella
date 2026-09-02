'use server';

import { revalidatePath } from 'next/cache';

import { getServerTranslator } from '@/features/i18n/server';
import { createClient } from '@/services/supabase/server';

import type { ProfileActionState } from '../types/profile-action-state';

function getString(
  formData: FormData,
  name: string,
) {
  const value = formData.get(name);

  return typeof value === 'string'
    ? value.trim()
    : '';
}

export async function updateProfileAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const { translate } =
    await getServerTranslator();

  const fullName = getString(
    formData,
    'fullName',
  );
  const publicAlias = getString(
    formData,
    'publicAlias',
  ).toLowerCase();
  const municipality = getString(
    formData,
    'municipality',
  );
  const bio = getString(formData, 'bio');
  const fieldErrors: ProfileActionState['fieldErrors'] =
    {};

  if (!fullName) {
    fieldErrors.fullName = translate(
      'profile.validation.fullNameRequired',
    );
  } else if (fullName.length > 120) {
    fieldErrors.fullName = translate(
      'profile.validation.fullNameLength',
    );
  }

  if (
    publicAlias &&
    !/^[a-z0-9][a-z0-9_-]{2,29}$/.test(
      publicAlias,
    )
  ) {
    fieldErrors.publicAlias = translate(
      'profile.validation.aliasFormat',
    );
  }

  if (municipality.length > 120) {
    fieldErrors.municipality = translate(
      'profile.validation.municipalityLength',
    );
  }

  if (bio.length > 500) {
    fieldErrors.bio = translate(
      'profile.validation.bioLength',
    );
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 'error',
      message: translate(
        'profile.validation.review',
      ),
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
      message: translate(
        'profile.result.sessionExpired',
      ),
    };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      public_alias: publicAlias || null,
      municipality: municipality || null,
      bio: bio || null,
    })
    .eq('id', user.id);

  if (error?.code === '23505') {
    return {
      status: 'error',
      message: translate(
        'profile.validation.aliasUnavailable',
      ),
      fieldErrors: {
        publicAlias: translate(
          'profile.validation.chooseAnotherAlias',
        ),
      },
    };
  }

  if (error) {
    return {
      status: 'error',
      message: translate(
        'profile.result.saveError',
      ),
    };
  }

  revalidatePath('/', 'layout');
  revalidatePath('/perfil');
  revalidatePath('/perfil/datos');
  revalidatePath(
    `/u/${publicAlias || 'perfil-no-publico'}`,
  );

  return {
    status: 'success',
    message: translate(
      'profile.result.success',
    ),
  };
}
