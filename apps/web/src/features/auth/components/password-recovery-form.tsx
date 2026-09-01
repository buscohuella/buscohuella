'use client';

import {
  Mail,
  MailCheck,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import {
  useActionState,
  useEffect,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';
import { useTranslations } from '@/features/i18n/i18n-provider';
import {
  FormErrorSummary,
  type FormErrorItem,
} from '@/components/ui/form-error-summary';

import { recoverPasswordAction } from '../actions/recover-password';
import { emailInputPattern } from '../lib/email-policy';
import { recoveryEmailCooldownSeconds } from '../lib/recovery-flow';
import { initialAuthActionState } from '../types/auth-action-state';
import { ActionMessage } from './action-message';
import { FormField } from './form-field';
import { SubmitButton } from './submit-button';

function formatCountdown(seconds: number) {
  return `0:${seconds.toString().padStart(2, '0')}`;
}

function RecoverySuccessState({
  message,
}: {
  message?: string;
}) {
  const { t } = useTranslations('auth');
  const [remainingSeconds, setRemainingSeconds] =
    useState(recoveryEmailCooldownSeconds);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  function restartRecovery() {
    window.location.assign(
      '/recuperar-contrasena',
    );
  }

  const isCoolingDown = remainingSeconds > 0;

  return (
    <div className="space-y-6 text-center">
      <span
        className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary"
        aria-hidden="true"
      >
        <MailCheck className="size-8" />
      </span>

      <div>
        <h2 className="text-xl font-bold tracking-tight">
          {t('recover.successTitle')}
        </h2>

        <p
          role="status"
          className="mt-3 text-muted-foreground"
        >
          {message}
        </p>
      </div>

      <div className="rounded-lg border border-border-soft bg-surface p-4 text-left text-sm text-muted-foreground">
        <p>
          {t('recover.inboxHint')}
          enlace para crear una contraseña nueva.
        </p>
        <p className="mt-2">
          {t('recover.tabHint')}
        </p>
        <p className="mt-2">
          {t('recover.spamHint')}
        </p>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="secondary"
          fullWidth
          disabled={isCoolingDown}
          onClick={restartRecovery}
        >
          <RotateCcw
            className="size-4"
            aria-hidden="true"
          />
          {isCoolingDown
            ? t('recover.resendIn', { seconds: formatCountdown(remainingSeconds) })
            : t('recover.resend')}
        </Button>

        <p
          className="text-xs text-muted-foreground"
          aria-live="polite"
        >
          {isCoolingDown
            ? t('recover.resendCooldown')
            : t('recover.resendReady')}
        </p>

        <Link
          href="/login"
          className="inline-flex min-h-11 items-center justify-center rounded px-3 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          {t('recover.backToLogin')}
        </Link>
      </div>
    </div>
  );
}

export function PasswordRecoveryForm() {
  const { t } = useTranslations('auth');
  const [state, formAction] = useActionState(
    recoverPasswordAction,
    initialAuthActionState,
  );

  if (state.status === 'success') {
    return (
      <RecoverySuccessState
        message={state.message}
      />
    );
  }

  const formErrors: FormErrorItem[] = [];

  if (state.fieldErrors?.email) {
    formErrors.push({
      id: 'email',
      fieldId: 'recovery-email',
      message: state.fieldErrors.email,
    });
  }

  return (
    <form action={formAction} className="space-y-5">
      {formErrors.length === 0 ? (
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
        id="recovery-email"
        name="email"
        type="email"
        label={t('recover.email')}
        placeholder={t('recover.emailPlaceholder')}
        autoComplete="email"
        inputMode="email"
        maxLength={254}
        pattern={emailInputPattern}
        title={t('recover.emailHint')}
        hint={t('recover.emailHint')}
        error={state.fieldErrors?.email}
        required
      />

      <SubmitButton pendingText={t('recover.pending')}>
        <Mail
          className="size-5"
          aria-hidden="true"
        />
        {t('recover.submit')}
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          {t('recover.backToLogin')}
        </Link>
      </p>
    </form>
  );
}
