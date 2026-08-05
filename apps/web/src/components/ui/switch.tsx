'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface SwitchProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'onChange'
  > {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export const Switch = React.forwardRef<
  HTMLButtonElement,
  SwitchProps
>(
  (
    {
      checked,
      className,
      description,
      disabled,
      label,
      onCheckedChange,
      ...props
    },
    ref,
  ) => (
    <div
      className={cn(
        'flex min-h-11 items-center justify-between gap-4',
        disabled && 'opacity-65',
        className,
      )}
    >
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

      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        className={cn(
          'relative h-7 w-12 shrink-0 rounded-full border transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft',
          checked
            ? 'border-primary bg-primary'
            : 'border-border bg-surface-sunken',
        )}
        onClick={() => onCheckedChange(!checked)}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            'absolute top-1/2 size-5 -translate-y-1/2 rounded-full shadow-sm transition-transform duration-150',
            checked
              ? 'translate-x-6 bg-primary-foreground'
              : 'translate-x-1 bg-surface-elevated',
          )}
        />
      </button>
    </div>
  ),
);

Switch.displayName = 'Switch';