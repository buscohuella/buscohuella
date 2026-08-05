import * as React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from 'lucide-react';

import { cn } from '@/lib/utils';

export type AlertVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'danger';

export interface AlertProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'title'
  > {
  variant?: AlertVariant;
  title?: React.ReactNode;
}

const styles: Record<AlertVariant, string> = {
  info: 'border-info/40 bg-info-soft text-foreground',
  success:
    'border-success/40 bg-success-soft text-foreground',
  warning:
    'border-warning/40 bg-warning-soft text-foreground',
  danger:
    'border-danger/40 bg-danger-soft text-foreground',
};

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
} as const;

export function Alert({
  children,
  className,
  title,
  variant = 'info',
  role,
  ...props
}: AlertProps) {
  const Icon = icons[variant];

  return (
    <div
      role={
        role ??
        (variant === 'danger' ? 'alert' : 'status')
      }
      className={cn(
        'flex gap-3 rounded-xl border p-4',
        styles[variant],
        className,
      )}
      {...props}
    >
      <Icon
        className="mt-0.5 size-5 shrink-0"
        aria-hidden="true"
      />

      <div className="min-w-0">
        {title ? (
          <p className="font-semibold">{title}</p>
        ) : null}

        <div className={cn('text-sm', title && 'mt-1')}>
          {children}
        </div>
      </div>
    </div>
  );
}