'use client';

import { UserPlus } from 'lucide-react';
import Link from 'next/link';
import {
  useActionState,
  useState,
} from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import {
  FormErrorSummary,
  type FormErrorItem,
} from '@/components/ui/form-error-summary';
import { useTranslations } from '@/features/i18n/i18n-provider';

import { registerAction } from '../actions/register';
import { emailInputPattern } from '../lib/email-policy';
import { initialAuthActionState } from '../types/auth-action-state';
import { ActionMessage } from './action-message';
import { FormField } from './form-field';
import { GoogleAuthButton } from './google-auth-button';
import { PasswordRequirements } from './password-requirements';
import { SubmitButton } from './submit-button';

export function RegisterForm({
  next,
}: {
  next?: string;
}) {
  const { t } = useTranslations('auth');
  const [state, formAction] = useActionState(
    registerAction,
    initialAuthActionState,
  );
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] =
    useState('');

  const formErrors: FormErrorItem[] = [];

  if (state.fieldErrors?.fullName) {
    formErrors.push({
      id: 'full-name',
      fieldId: 'full-name',
      message: state.fieldErrors.fullName,
    });
  }

  if (state.fieldErrors?.email) {
    formErrors.push({
      id: 'email',
      fieldId: 'register-email',
      message: state.fieldErrors.email,
    });
  }

  if (state.fieldErrors?.password) {
    formErrors.push({
      id: 'password',
      fieldId: 'register-password',
      message: state.fieldErrors.password,
    });
  }

  if (state.fieldErrors?.confirmPassword) {
    formErrors.push({
      id: 'confirm-password',
      fieldId: 'confirm-password',
      message:
        state.fieldErrors.confirmPassword,
    });
  }

  if (state.fieldErrors?.acceptTerms) {
    formErrors.push({
      id: 'accept-terms',
      fieldId: 'accept-terms',
      message: state.fieldErrors.acceptTerms,
    });
  }

  const hasFieldErrors = formErrors.length > 0;

  return (
    <form action={formAction} noValidate className="space-y-5">
      <input
        type="hidden"
        name="next"
        value={next ?? ''}
      />
      {!hasFieldErrors ? (
        <ActionMessage state={state} />
      ) : null}

      <FormErrorSummary
        errors={formErrors}
        title={
          state.message ??
          t('validation.review')
        }
      />

      <FormField
        id="full-name"
        name="fullName"
        type="text"
        label={t('register.fullName')}
        placeholder={t('register.fullNamePlaceholder')}
        autoComplete="name"
        maxLength={120}
        error={state.fieldErrors?.fullName}
        required
      />

      <FormField
        id="register-email"
        name="email"
        type="email"
        label={t('register.email')}
        placeholder={t('register.emailPlaceholder')}
        autoComplete="email"
        inputMode="email"
        maxLength={254}
        pattern={emailInputPattern}
        title={t('register.emailHint')}
        hint={t('register.emailHint')}
        error={state.fieldErrors?.email}
        required
      />

      <FormField
        id="register-password"
        name="password"
        type="password"
        label={t('register.password')}
        placeholder={t('register.passwordPlaceholder')}
        autoComplete="new-password"
        hint={t('register.passwordHint')}
        minLength={8}
        value={password}
        onChange={(event) =>
          setPassword(event.currentTarget.value)
        }
        error={state.fieldErrors?.password}
        required
      />

      <FormField
        id="confirm-password"
        name="confirmPassword"
        type="password"
        label={t('register.confirmPassword')}
        placeholder={t('register.confirmPasswordPlaceholder')}
        autoComplete="new-password"
        minLength={8}
        value={confirmation}
        onChange={(event) =>
          setConfirmation(
            event.currentTarget.value,
          )
        }
        error={
          state.fieldErrors?.confirmPassword
        }
        required
      />

      <PasswordRequirements
        password={password}
        confirmation={confirmation}
      />

      <div>
        <Checkbox
          id="accept-terms"
          name="acceptTerms"
          required
          aria-invalid={
            Boolean(
              state.fieldErrors?.acceptTerms,
            ) || undefined
          }
          aria-describedby={
            state.fieldErrors?.acceptTerms
              ? 'accept-terms-error'
              : undefined
          }
          label={
            <>
              {t('register.termsPrefix')}{' '}
              <Link
                href="https://buscohuella.es/terminos"
                className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
              >
                {t('register.terms')}
              </Link>{' '}
              {' '}{t('register.and')}{' '}
              <Link
                href="https://buscohuella.es/privacidad"
                className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
              >
                {t('register.privacy')}
              </Link>
              .
            </>
          }
        />

        {state.fieldErrors?.acceptTerms ? (
          <p
            id="accept-terms-error"
            className="mt-2 text-sm font-medium text-danger"
            role="alert"
          >
            {state.fieldErrors.acceptTerms}
          </p>
        ) : null}
      </div>

      <SubmitButton pendingText={t('register.pending')}>
        <UserPlus
          className="size-5"
          aria-hidden="true"
        />
        {t('register.submit')}
      </SubmitButton>

      <div className="relative py-1 text-center text-xs text-muted-foreground before:absolute before:left-0 before:right-0 before:top-1/2 before:border-t before:border-border-soft">
        <span className="relative bg-surface-elevated px-3">o</span>
      </div>
      <GoogleAuthButton
        label={t('register.google')}
        pendingLabel={t('register.googlePending')}
        errorLabel={t('register.googleError')}
        next={next}
      />

      <p className="text-center text-sm text-muted-foreground">
        {t('register.hasAccount')}{' '}
        <Link
          href={
            next
              ? `/login?next=${encodeURIComponent(next)}`
              : '/login'
          }
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          {t('register.login')}
        </Link>
      </p>
    </form>
  );
}
