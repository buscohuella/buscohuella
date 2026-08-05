import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  actions,
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface px-5 py-10 text-center',
        className,
      )}
    >
      {icon ? (
        <span
          className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary"
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}

      <h2 className="text-lg font-semibold tracking-tight">
        {title}
      </h2>

      {description ? (
        <div className="mt-2 max-w-prose text-sm leading-6 text-muted-foreground">
          {description}
        </div>
      ) : null}

      {actions ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {actions}
        </div>
      ) : null}
    </section>
  );
}