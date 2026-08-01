'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { LogIn } from 'lucide-react';

import { loginAction } from '../actions/login';
import { initialAuthActionState } from '../types/auth-action-state';
import { ActionMessage } from './action-message';
import { FormField } from './form-field';
import { SubmitButton } from './submit-button';

export function LoginForm() {
  const [state, formAction] = useActionState(
    loginAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <ActionMessage state={state} />

      <FormField
        id="email"
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
        id="password"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="Introduce tu contraseña"
        autoComplete="current-password"
        error={state.fieldErrors?.password}
        required
      />

      <div className="flex items-center justify-end">
        <Link
          href="/recuperar-contrasena"
          className="rounded text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          ¿Has olvidado tu contraseña?
        </Link>
      </div>

      <SubmitButton pendingText="Iniciando sesión...">
        <LogIn className="size-5" aria-hidden="true" />
        Iniciar sesión
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        ¿Todavía no tienes cuenta?{' '}
        <Link
          href="/registro"
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          Crear cuenta
        </Link>
      </p>
    </form>
  );
}
