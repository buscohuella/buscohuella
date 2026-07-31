import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError = false, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        aria-invalid={hasError || undefined}
        className={cn(
          'flex min-h-12 w-full rounded-lg border bg-surface-elevated px-3 py-2',
          'text-base text-foreground placeholder:text-subtle-foreground',
          'transition-[border-color,box-shadow,background-color] duration-150',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15',
          'disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60',
          hasError
            ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/15'
            : 'border-border focus-visible:border-primary',
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';
