'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { Mail, MailCheck, RotateCcw } from 'lucide-react';

import { recoverPasswordAction } from '../actions/recover-password';
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
  const [remainingSeconds, setRemainingSeconds] = useState(
    recoveryEmailCooldownSeconds,
  );

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
    window.location.assign('/recuperar-contrasena');
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
          Revisa tu correo
        </h2>

        <p role="status" className="mt-3 text-muted-foreground">
          {message}
        </p>
      </div>

      <div className="rounded-lg border border-border-soft bg-surface p-4 text-left text-sm text-muted-foreground">
        <p>
          Abre el mensaje de BuscoHuella y pulsa el enlace para crear una
          contraseña nueva.
        </p>
        <p className="mt-2">
          El enlace puede abrirse en otra pestaña. Cuando lo hayas abierto,
          puedes cerrar esta página.
        </p>
        <p className="mt-2">
          Si no aparece en unos minutos, revisa las carpetas de spam, correo
          no deseado o promociones.
        </p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={restartRecovery}
          disabled={isCoolingDown}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-surface-elevated px-5 font-semibold text-foreground transition-colors hover:bg-surface focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          {isCoolingDown
            ? `Enviar otro enlace en ${formatCountdown(remainingSeconds)}`
            : 'Enviar otro enlace'}
        </button>

        <p
          className="text-xs text-muted-foreground"
          aria-live="polite"
        >
          {isCoolingDown
            ? 'El botón se activará automáticamente al finalizar la espera.'
            : 'Ya puedes solicitar otro enlace.'}
        </p>

        <Link
          href="/login"
          className="inline-flex min-h-11 items-center justify-center rounded px-3 text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}

export function PasswordRecoveryForm() {
  const [state, formAction] = useActionState(
    recoverPasswordAction,
    initialAuthActionState,
  );

  if (state.status === 'success') {
    return <RecoverySuccessState message={state.message} />;
  }

  return (
    <form action={formAction} className="space-y-5">
      <ActionMessage state={state} />

      <FormField
        id="recovery-email"
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="tu@correo.com"
        autoComplete="email"
        inputMode="email"
        hint="Te enviaremos un enlace seguro para crear una nueva contraseña."
        error={state.fieldErrors?.email}
        required
      />

      <SubmitButton pendingText="Enviando enlace...">
        <Mail className="size-5" aria-hidden="true" />
        Enviar enlace
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          Volver al inicio de sesión
        </Link>
      </p>
    </form>
  );
}
