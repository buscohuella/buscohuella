'use client';

import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

import {
  FormErrorSummary,
  type FormErrorItem,
} from '@/components/ui/form-error-summary';

import { loginAction } from '../actions/login';
import { initialAuthActionState } from '../types/auth-action-state';
import { ActionMessage } from './action-message';
import { FormField } from './form-field';
import { SubmitButton } from './submit-button';

export function LoginForm({
  next,
}: {
  next?: string;
}) {
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
    <form action={formAction} className="space-y-5">
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
          className="rounded text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
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
          href={
            next
              ? `/registro?next=${encodeURIComponent(next)}`
              : '/registro'
          }
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          Crear cuenta
        </Link>
      </p>
    </form>
  );
}
