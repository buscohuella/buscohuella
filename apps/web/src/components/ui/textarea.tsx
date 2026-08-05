import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(
  (
    {
      className,
      hasError = false,
      rows = 4,
      ...props
    },
    ref,
  ) => (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={hasError || undefined}
      className={cn(
        'flex min-h-28 w-full resize-y rounded-lg border bg-surface-elevated px-3 py-2.5',
        'text-base text-foreground placeholder:text-subtle-foreground',
        'transition-[border-color,box-shadow,background-color] duration-150',
        'focus-visible:outline-none focus-visible:ring-4',
        'disabled:cursor-not-allowed disabled:bg-surface disabled:text-disabled-foreground disabled:opacity-70',
        hasError
          ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/20'
          : 'border-border focus-visible:border-primary focus-visible:ring-focus-soft',
        className,
      )}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';