import * as React from 'react';

import { cn } from '@/lib/utils';

export type IconButtonVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger';

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: IconButtonVariant;
}

const variants: Record<IconButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover',
  secondary:
    'border border-border bg-surface-elevated text-foreground hover:bg-surface-hover',
  ghost:
    'bg-transparent text-foreground hover:bg-surface-hover',
  danger:
    'bg-danger text-danger-foreground hover:bg-danger-hover',
};

export const IconButton = React.forwardRef<
  HTMLButtonElement,
  IconButtonProps
>(
  (
    {
      children,
      className,
      disabled,
      label,
      type = 'button',
      variant = 'ghost',
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-11 shrink-0 items-center justify-center rounded-full',
        'transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft',
        'disabled:pointer-events-none disabled:opacity-55',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

IconButton.displayName = 'IconButton';