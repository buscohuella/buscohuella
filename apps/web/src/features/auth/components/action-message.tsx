import type { AuthActionState } from '../types/auth-action-state';

export interface ActionMessageProps {
  state: AuthActionState;
}

export function ActionMessage({ state }: ActionMessageProps) {
  if (!state.message) {
    return null;
  }

  return (
    <div
      role={state.status === 'error' ? 'alert' : 'status'}
      className={
        state.status === 'error'
          ? 'rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm font-medium text-danger'
          : 'rounded-lg border border-success/30 bg-primary-soft p-4 text-sm font-medium text-success'
      }
    >
      {state.message}
    </div>
  );
}
