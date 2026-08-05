import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = React.forwardRef<
  HTMLSelectElement,
  SelectProps
>(
  (
    {
      children,
      className,
      hasError = false,
      ...props
    },
    ref,
  ) => (
    <div className="relative">
      <select
        ref={ref}
        aria-invalid={hasError || undefined}
        className={cn(
          'min-h-12 w-full appearance-none rounded-lg border bg-surface-elevated px-3 py-2 pr-11',
          'text-base text-foreground',
          'transition-[border-color,box-shadow,background-color] duration-150',
          'focus-visible:outline-none focus-visible:ring-4',
          'disabled:cursor-not-allowed disabled:bg-surface disabled:text-disabled-foreground disabled:opacity-70',
          hasError
            ? 'border-danger focus-visible:border-danger focus-visible:ring-danger/20'
            : 'border-border focus-visible:border-primary focus-visible:ring-focus-soft',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  ),
);

Select.displayName = 'Select';