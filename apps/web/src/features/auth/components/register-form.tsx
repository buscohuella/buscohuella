'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { UserPlus } from 'lucide-react';

import { registerAction } from '../actions/register';
import { passwordHint } from '../lib/password-policy';
import { initialAuthActionState } from '../types/auth-action-state';
import { ActionMessage } from './action-message';
import { FormField } from './form-field';
import { SubmitButton } from './submit-button';

export function RegisterForm() {
  const [state, formAction] = useActionState(
    registerAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <ActionMessage state={state} />

      <FormField
        id="full-name"
        name="fullName"
        type="text"
        label="Nombre completo"
        placeholder="Tu nombre"
        autoComplete="name"
        error={state.fieldErrors?.fullName}
        required
      />

      <FormField
        id="register-email"
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="tu@correo.com"
        autoComplete="email"
        inputMode="email"
        error={state.fieldErrors?.email}
        required
      />

      <FormField
        id="register-password"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="Crea una contraseña segura"
        autoComplete="new-password"
        hint={passwordHint}
        minLength={8}
        error={state.fieldErrors?.password}
        required
      />

      <FormField
        id="confirm-password"
        name="confirmPassword"
        type="password"
        label="Repite la contraseña"
        placeholder="Vuelve a escribir la contraseña"
        autoComplete="new-password"
        minLength={8}
        error={state.fieldErrors?.confirmPassword}
        required
      />

      <div>
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            name="acceptTerms"
            className="mt-1 size-4 rounded border-border accent-[var(--primary)]"
            aria-describedby={
              state.fieldErrors?.acceptTerms
                ? 'accept-terms-error'
                : undefined
            }
            required
          />
          <span>
            Acepto los{' '}
            <Link
              href="https://buscohuella.es/terminos"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              términos de uso
            </Link>{' '}
            y la{' '}
            <Link
              href="https://buscohuella.es/privacidad"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              política de privacidad
            </Link>
            .
          </span>
        </label>

        {state.fieldErrors?.acceptTerms && (
          <p
            id="accept-terms-error"
            className="mt-2 text-sm font-medium text-danger"
          >
            {state.fieldErrors.acceptTerms}
          </p>
        )}
      </div>

      <SubmitButton pendingText="Creando cuenta...">
        <UserPlus className="size-5" aria-hidden="true" />
        Crear cuenta
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
