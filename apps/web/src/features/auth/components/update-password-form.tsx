'use client';

import { KeyRound } from 'lucide-react';
import {
  useActionState,
  useState,
} from 'react';

import {
  FormErrorSummary,
  type FormErrorItem,
} from '@/components/ui/form-error-summary';

import { updatePasswordAction } from '../actions/update-password';
import { passwordHint } from '../lib/password-policy';
import { initialAuthActionState } from '../types/auth-action-state';
import { ActionMessage } from './action-message';
import { FormField } from './form-field';
import { PasswordRequirements } from './password-requirements';
import { SubmitButton } from './submit-button';

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(
    updatePasswordAction,
    initialAuthActionState,
  );
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] =
    useState('');

  const formErrors: FormErrorItem[] = [];

  if (state.fieldErrors?.password) {
    formErrors.push({
      id: 'password',
      fieldId: 'new-password',
      message: state.fieldErrors.password,
    });
  }

  if (state.fieldErrors?.confirmPassword) {
    formErrors.push({
      id: 'confirm-password',
      fieldId: 'confirm-new-password',
      message:
        state.fieldErrors.confirmPassword,
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
          'Revisa los requisitos de la nueva contraseña.'
        }
      />

      <FormField
        id="new-password"
        name="password"
        type="password"
        label="Nueva contraseña"
        placeholder="Crea una contraseña segura"
        autoComplete="new-password"
        minLength={8}
        hint={passwordHint}
        value={password}
        onChange={(event) =>
          setPassword(event.currentTarget.value)
        }
        error={state.fieldErrors?.password}
        required
      />

      <FormField
        id="confirm-new-password"
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

      <SubmitButton pendingText="Actualizando contraseña...">
        <KeyRound
          className="size-5"
          aria-hidden="true"
        />
        Guardar contraseña
      </SubmitButton>
    </form>
  );
}
