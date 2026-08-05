import * as React from 'react';

import { cn } from '@/lib/utils';

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type'
  > {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  CheckboxProps
>(
  (
    {
      className,
      description,
      disabled,
      label,
      ...props
    },
    ref,
  ) => (
    <label
      className={cn(
        'flex min-h-11 items-start gap-3 rounded-lg',
        disabled && 'cursor-not-allowed opacity-65',
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        className={cn(
          'mt-0.5 size-5 shrink-0 rounded border-border accent-primary',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft',
        )}
        {...props}
      />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">
          {label}
        </span>
        {description ? (
          <span className="mt-0.5 block text-sm text-muted-foreground">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  ),
);

Checkbox.displayName = 'Checkbox';