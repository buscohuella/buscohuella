'use server';

import { createClient } from '@/services/supabase/server';
import { getServerTranslator } from '@/features/i18n/server';

import { validateEmail } from '../lib/email-policy';
import { recoveryEmailCooldownSeconds } from '../lib/recovery-flow';
import type { AuthActionState } from '../types/auth-action-state';
import { getRequestOrigin, getString } from './helpers';

export async function recoverPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const { translate } = await getServerTranslator();
  const emailValidation = validateEmail(
    getString(formData, 'email'),
  );

  if (!emailValidation.isValid) {
    return {
      status: 'error',
      message: translate('auth.validation.review'),
      fieldErrors: {
        email: emailValidation.error,
      },
    };
  }

  const origin = await getRequestOrigin();
  const supabase = await createClient();

  const { error } =
    await supabase.auth.resetPasswordForEmail(
      emailValidation.normalizedEmail,
      {
        redirectTo: `${origin}/nueva-contrasena`,
      },
    );

  if (
    error?.code === 'over_email_send_rate_limit' ||
    error?.status === 429
  ) {
    return {
      status: 'error',
      message: translate('auth.recover.cooldown', {
        seconds: recoveryEmailCooldownSeconds,
      }),
    };
  }

  if (error) {
    return {
      status: 'error',
      message: translate('auth.recover.sendError'),
    };
  }

  // Respuesta deliberadamente genérica para no revelar si una cuenta existe.
  return {
    status: 'success',
    message: translate('auth.recover.successDescription'),
  };
}
