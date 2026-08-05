import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  title?: ReactNode;
  description: ReactNode;
  incidentId?: string;
  actions?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = 'No hemos podido completar la acción',
  description,
  incidentId,
  actions,
  className,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className={cn(
        'rounded-2xl border border-danger/40 bg-danger-soft p-5',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-danger text-danger-foreground"
          aria-hidden="true"
        >
          <AlertTriangle className="size-5" />
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="font-semibold">{title}</h2>

          <div className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </div>

          {incidentId ? (
            <p className="mt-3 text-xs font-medium text-muted-foreground">
              Código de incidencia: <code>{incidentId}</code>
            </p>
          ) : null}

          {actions ? (
            <div className="mt-5 flex flex-wrap gap-3">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}