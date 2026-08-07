'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/services/supabase/server';
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
  const password = getString(formData, 'password');
  const next = safeNext(
    getString(formData, 'next'),
  );
  const fieldErrors: AuthActionState['fieldErrors'] = {};

  if (!email) fieldErrors.email = 'Introduce tu correo electrónico.';
  if (!password) fieldErrors.password = 'Introduce tu contraseña.';

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 'error',
      message: 'Revisa los campos indicados.',
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
          ? 'Confirma tu correo electrónico antes de iniciar sesión.'
          : 'El correo o la contraseña no son correctos.',
    };
  }

  redirect(next);
}
