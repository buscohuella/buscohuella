import * as React from 'react';

import { cn } from '@/lib/utils';

export interface FieldProps
  extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  htmlFor?: string;
  description?: React.ReactNode;
  error?: React.ReactNode;
  optional?: boolean;
  required?: boolean;
}

export function Field({
  children,
  className,
  label,
  htmlFor,
  description,
  error,
  optional = false,
  required = false,
  ...props
}: FieldProps) {
  return (
    <div className={cn('grid gap-2', className)} {...props}>
      <label
        htmlFor={htmlFor}
        className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-foreground"
      >
        <span>{label}</span>
        {optional ? (
          <span className="text-xs font-normal text-muted-foreground">
            Opcional
          </span>
        ) : null}
        {required ? (
          <span className="text-danger" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      {description ? (
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}

      {children}

      {error ? (
        <p className="text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}