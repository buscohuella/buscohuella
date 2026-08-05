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

import { registerAction } from '../actions/register';
import { emailInputPattern } from '../lib/email-policy';
import { passwordHint } from '../lib/password-policy';
import { initialAuthActionState } from '../types/auth-action-state';
import { ActionMessage } from './action-message';
import { FormField } from './form-field';
import { PasswordRequirements } from './password-requirements';
import { SubmitButton } from './submit-button';

export function RegisterForm() {
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
    <form action={formAction} className="space-y-5">
      {!hasFieldErrors ? (
        <ActionMessage state={state} />
      ) : null}

      <FormErrorSummary
        errors={formErrors}
        title={
          state.message ??
          'Revisa los campos indicados.'
        }
      />

      <FormField
        id="full-name"
        name="fullName"
        type="text"
        label="Nombre completo"
        placeholder="Tu nombre"
        autoComplete="name"
        maxLength={120}
        error={state.fieldErrors?.fullName}
        required
      />

      <FormField
        id="register-email"
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="nombre@dominio.com"
        autoComplete="email"
        inputMode="email"
        maxLength={254}
        pattern={emailInputPattern}
        title="Introduce un correo con usuario, dominio y extensión, por ejemplo nombre@empresa.es."
        hint="Puede ser Gmail, Hotmail, un correo profesional o cualquier dominio válido."
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
        label="Repite la contraseña"
        placeholder="Vuelve a escribir la contraseña"
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
              Acepto los{' '}
              <Link
                href="https://buscohuella.es/terminos"
                className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
              >
                términos de uso
              </Link>{' '}
              y la{' '}
              <Link
                href="https://buscohuella.es/privacidad"
                className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
              >
                política de privacidad
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

      <SubmitButton pendingText="Creando cuenta...">
        <UserPlus
          className="size-5"
          aria-hidden="true"
        />
        Crear cuenta
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          Iniciar sesión
        </Link>
      </p>
    </form>
  );
}
