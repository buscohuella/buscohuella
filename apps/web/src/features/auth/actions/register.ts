'use server';

import { createClient } from '@/services/supabase/server';

import { validatePassword } from '../lib/password-policy';
import type { AuthActionState } from '../types/auth-action-state';
import { getRequestOrigin, getString } from './helpers';

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = getString(formData, 'fullName');
  const email = getString(formData, 'email').toLowerCase();
  const password = getString(formData, 'password');
  const confirmPassword = getString(formData, 'confirmPassword');
  const acceptTerms = formData.get('acceptTerms') === 'on';
  const passwordValidation = validatePassword(password);

  const fieldErrors: AuthActionState['fieldErrors'] = {};

  if (!fullName) {
    fieldErrors.fullName = 'Introduce tu nombre completo.';
  }

  if (!email) {
    fieldErrors.email = 'Introduce tu correo electrónico.';
  }

  if (!passwordValidation.isValid) {
    fieldErrors.password = passwordValidation.errors.join(' ');
  }

  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  if (!acceptTerms) {
    fieldErrors.acceptTerms =
      'Debes aceptar los términos y la política de privacidad.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 'error',
      message: 'Revisa los campos indicados.',
      fieldErrors,
    };
  }

  const origin = await getRequestOrigin();
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    if (
      error.code === 'user_already_exists' ||
      error.code === 'email_exists'
    ) {
      return {
        status: 'error',
        message:
          'No se ha podido completar el registro con ese correo.',
      };
    }

    if (error.code === 'weak_password') {
      return {
        status: 'error',
        message:
          'La contraseña no cumple los requisitos de seguridad.',
        fieldErrors: {
          password:
            'Usa una contraseña con mayúscula, minúscula y número.',
        },
      };
    }

    return {
      status: 'error',
      message:
        'No se ha podido crear la cuenta. Inténtalo de nuevo.',
    };
  }

  return {
    status: 'success',
    message:
      'Revisa tu correo electrónico y confirma la cuenta para continuar.',
  };
}
