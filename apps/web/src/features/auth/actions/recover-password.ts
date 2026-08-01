'use server';

import { recoveryEmailCooldownSeconds } from '../lib/recovery-flow';
import type { AuthActionState } from '../types/auth-action-state';
import { createClient } from '@/services/supabase/server';
import { getRequestOrigin, getString } from './helpers';

export async function recoverPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = getString(formData, 'email').toLowerCase();

  if (!email) {
    return {
      status: 'error',
      message: 'Revisa los campos indicados.',
      fieldErrors: {
        email: 'Introduce tu correo electrónico.',
      },
    };
  }

  const origin = await getRequestOrigin();
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/nueva-contrasena`,
  });

  if (
    error?.code === 'over_email_send_rate_limit' ||
    error?.status === 429
  ) {
    return {
      status: 'error',
      message: `Has solicitado otro enlace demasiado pronto. Espera ${recoveryEmailCooldownSeconds} segundos antes de volver a intentarlo.`,
    };
  }

  if (error) {
    return {
      status: 'error',
      message:
        'No se ha podido enviar el enlace en este momento. Inténtalo de nuevo más tarde.',
    };
  }

  // Respuesta deliberadamente genérica para no revelar si una cuenta existe.
  return {
    status: 'success',
    message:
      'Si existe una cuenta asociada, recibirás un enlace para cambiar la contraseña.',
  };
}
