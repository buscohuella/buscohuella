'use client';

import { useActionState } from 'react';
import { KeyRound } from 'lucide-react';

import { updatePasswordAction } from '../actions/update-password';
import { passwordHint } from '../lib/password-policy';
import { initialAuthActionState } from '../types/auth-action-state';
import { ActionMessage } from './action-message';
import { FormField } from './form-field';
import { SubmitButton } from './submit-button';

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(
    updatePasswordAction,
    initialAuthActionState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <ActionMessage state={state} />

      <FormField
        id="new-password"
        name="password"
        type="password"
        label="Nueva contraseña"
        placeholder="Crea una contraseña segura"
        autoComplete="new-password"
        minLength={8}
        hint={passwordHint}
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
        error={state.fieldErrors?.confirmPassword}
        required
      />

      <SubmitButton pendingText="Actualizando contraseña...">
        <KeyRound className="size-5" aria-hidden="true" />
        Guardar contraseña
      </SubmitButton>
    </form>
  );
}
