'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  recoveryFlowCookie,
} from '../lib/recovery-flow';
import { validatePassword } from '../lib/password-policy';
import type { AuthActionState } from '../types/auth-action-state';
import { createClient } from '@/services/supabase/server';
import { getString } from './helpers';

export async function updatePasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = getString(formData, 'password');
  const confirmPassword = getString(formData, 'confirmPassword');
  const passwordValidation = validatePassword(password);

  const fieldErrors: AuthActionState['fieldErrors'] = {};

  if (!passwordValidation.isValid) {
    fieldErrors.password = passwordValidation.errors.join(' ');
  }

  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 'error',
      message: 'Revisa los requisitos de la nueva contraseña.',
      fieldErrors,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const cookieStore = await cookies();
    cookieStore.delete(recoveryFlowCookie);

    return {
      status: 'error',
      message:
        'El enlace no es válido o ha caducado. Solicita uno nuevo.',
    };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    if (error.code === 'same_password') {
      return {
        status: 'error',
        message:
          'La nueva contraseña no puede ser igual a la contraseña actual.',
      };
    }

    if (error.code === 'weak_password') {
      return {
        status: 'error',
        message:
          'La contraseña no cumple los requisitos de seguridad. Revisa los campos indicados.',
        fieldErrors: {
          password:
            'Usa una contraseña distinta, con mayúscula, minúscula y número.',
        },
      };
    }

    return {
      status: 'error',
      message:
        'No se ha podido actualizar la contraseña. Solicita un enlace nuevo e inténtalo otra vez.',
    };
  }

  const cookieStore = await cookies();
  cookieStore.delete(recoveryFlowCookie);

  await supabase.auth.signOut();

  redirect('/login?password_updated=1');
}
