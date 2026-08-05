import { cn } from '@/lib/utils';

export interface ProgressProps {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
) => Math.min(Math.max(value, minimum), maximum);

export function Progress({
  value,
  max = 100,
  label,
  showValue = false,
  className,
}: ProgressProps) {
  const isDeterminate =
    typeof value === 'number' && max > 0;
  const normalizedValue = isDeterminate
    ? clamp(value, 0, max)
    : undefined;
  const percentage =
    normalizedValue === undefined
      ? undefined
      : Math.round((normalizedValue / max) * 100);

  return (
    <div className={cn('grid gap-2', className)}>
      {label || (showValue && percentage !== undefined) ? (
        <div className="flex items-center justify-between gap-3 text-sm">
          {label ? (
            <span className="font-medium">{label}</span>
          ) : (
            <span />
          )}

          {showValue && percentage !== undefined ? (
            <span className="text-muted-foreground">
              {percentage} %
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={isDeterminate ? 0 : undefined}
        aria-valuemax={isDeterminate ? max : undefined}
        aria-valuenow={normalizedValue}
        aria-valuetext={
          percentage === undefined
            ? 'En progreso'
            : `${percentage} %`
        }
        className="h-2.5 overflow-hidden rounded-full bg-surface-sunken"
      >
        <div
          className={cn(
            'h-full rounded-full bg-primary',
            percentage === undefined &&
              'w-1/3 animate-pulse',
          )}
          style={
            percentage === undefined
              ? undefined
              : { width: `${percentage}%` }
          }
        />
      </div>
    </div>
  );
}