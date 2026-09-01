'use client';

import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

import {
  FormErrorSummary,
  type FormErrorItem,
} from '@/components/ui/form-error-summary';
import { useTranslations } from '@/features/i18n/i18n-provider';

import { loginAction } from '../actions/login';
import { initialAuthActionState } from '../types/auth-action-state';
import { ActionMessage } from './action-message';
import { FormField } from './form-field';
import { GoogleAuthButton } from './google-auth-button';
import { SubmitButton } from './submit-button';

export function LoginForm({
  next,
}: {
  next?: string;
}) {
  const { t } = useTranslations('auth');
  const [state, formAction] = useActionState(
    loginAction,
    initialAuthActionState,
  );

 const formErrors: FormErrorItem[] = [];

if (state.fieldErrors?.email) {
  formErrors.push({
    id: 'email',
    fieldId: 'email',
    message: state.fieldErrors.email,
  });
}

if (state.fieldErrors?.password) {
  formErrors.push({
    id: 'password',
    fieldId: 'password',
    message: state.fieldErrors.password,
  });
}

  return (
    <form action={formAction} noValidate className="space-y-5">
      <input
        type="hidden"
        name="next"
        value={next ?? ''}
      />
      <ActionMessage state={state} />
      <FormErrorSummary errors={formErrors} />

      <FormField
        id="email"
        name="email"
        type="email"
        label={t('login.email')}
        placeholder={t('login.emailPlaceholder')}
        autoComplete="email"
        inputMode="email"
        error={state.fieldErrors?.email}
        required
      />

      <FormField
        id="password"
        name="password"
        type="password"
        label={t('login.password')}
        placeholder={t('login.passwordPlaceholder')}
        autoComplete="current-password"
        error={state.fieldErrors?.password}
        required
      />

      <div className="flex items-center justify-end">
        <Link
          href="/recuperar-contrasena"
          className="rounded text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          {t('login.forgotPassword')}
        </Link>
      </div>

      <SubmitButton pendingText={t('login.pending')}>
        <LogIn className="size-5" aria-hidden="true" />
        {t('login.submit')}
      </SubmitButton>

      <div className="relative py-1 text-center text-xs text-muted-foreground before:absolute before:left-0 before:right-0 before:top-1/2 before:border-t before:border-border-soft">
        <span className="relative bg-surface-elevated px-3">o</span>
      </div>
      <GoogleAuthButton
        label={t('login.google')}
        pendingLabel={t('login.googlePending')}
        errorLabel={t('login.googleError')}
        next={next}
      />

      <p className="text-center text-sm text-muted-foreground">
        {t('login.noAccount')}{' '}
        <Link
          href={
            next
              ? `/registro?next=${encodeURIComponent(next)}`
              : '/registro'
          }
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          {t('login.createAccount')}
        </Link>
      </p>
    </form>
  );
}
