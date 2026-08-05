import { Alert } from '@/components/ui/alert';

import type { AuthActionState } from '../types/auth-action-state';

export interface ActionMessageProps {
  state: AuthActionState;
}

export function ActionMessage({ state }: ActionMessageProps) {
  if (!state.message) {
    return null;
  }

  return (
    <Alert
      variant={
        state.status === 'error' ? 'danger' : 'success'
      }
    >
      {state.message}
    </Alert>
  );
}
