'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/services/supabase/server';
import { getServerTranslator } from '@/features/i18n/server';
import type { AuthActionState } from '../types/auth-action-state';
import { getString } from './helpers';

function safeNext(value: string) {
  return value.startsWith('/') &&
    !value.startsWith('//')
    ? value
    : '/inicio?login=success';
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getString(formData, 'email').toLowerCase();
  const { translate } = await getServerTranslator();
  const password = getString(formData, 'password');
  const next = safeNext(
    getString(formData, 'next'),
  );
  const fieldErrors: AuthActionState['fieldErrors'] = {};

  if (!email) fieldErrors.email = translate('auth.validation.emailRequired');
  if (!password) fieldErrors.password = translate('auth.validation.passwordRequired');

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 'error',
      message: translate('auth.validation.review'),
      fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: 'error',
      message:
        error.code === 'email_not_confirmed'
          ? translate('auth.validation.emailNotConfirmed')
          : translate('auth.validation.credentialsInvalid'),
    };
  }

  redirect(next);
}
