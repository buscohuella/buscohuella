'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/services/supabase/server';
import { getRequestLocale } from '@/features/i18n/server';
import { getServerTranslator } from '@/features/i18n/server';

import { validateEmail } from '../lib/email-policy';
import { validatePassword } from '../lib/password-policy';
import type { AuthActionState } from '../types/auth-action-state';
import { getRequestOrigin, getString } from './helpers';

function safeNext(value: string) {
  return value.startsWith('/') &&
    !value.startsWith('//')
    ? value
    : '';
}

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const { translate } = await getServerTranslator();
  const fullName = getString(formData, 'fullName');
  const next = safeNext(
    getString(formData, 'next'),
  );
  const emailValidation = validateEmail(
    getString(formData, 'email'),
  );
  const password = getString(formData, 'password');
  const confirmPassword = getString(
    formData,
    'confirmPassword',
  );
  const acceptTerms =
    formData.get('acceptTerms') === 'on';
  const passwordValidation =
    validatePassword(password);

  const fieldErrors: AuthActionState['fieldErrors'] =
    {};

  if (!fullName) {
    fieldErrors.fullName = translate('auth.validation.fullNameRequired');
  }

  if (!emailValidation.isValid) {
    fieldErrors.email = emailValidation.error;
  }

  if (!passwordValidation.isValid) {
    fieldErrors.password =
      passwordValidation.errors.join(' ');
  }

  if (password !== confirmPassword) {
    fieldErrors.confirmPassword = translate('auth.validation.passwordMismatch');
  }

  if (!acceptTerms) {
    fieldErrors.acceptTerms = translate('auth.validation.acceptTerms');
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 'error',
      message: translate('auth.validation.review'),
      fieldErrors,
    };
  }

  const origin = await getRequestOrigin();
  const locale = await getRequestLocale();
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: emailValidation.normalizedEmail,
    password,
    options: {
      data: {
        full_name: fullName,
        locale,
      },
      emailRedirectTo: `${origin}/auth/confirm?locale=${locale}`,
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
          translate('auth.validation.registerFailed'),
      };
    }

    if (error.code === 'weak_password') {
      return {
        status: 'error',
        message:
          translate('auth.validation.weakPassword'),
        fieldErrors: {
          password:
            translate('auth.validation.weakPasswordHint'),
        },
      };
    }

    return {
      status: 'error',
      message:
        translate('auth.validation.genericRegisterFailed'),
    };
  }

  const query = new URLSearchParams({
    registered: '1',
  });

  if (next) {
    query.set('next', next);
  }

  redirect(`/login?${query.toString()}`);
}
