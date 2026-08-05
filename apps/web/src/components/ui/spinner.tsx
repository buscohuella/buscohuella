import { LoaderCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SpinnerProps {
  label?: string;
  className?: string;
}

export function Spinner({
  className,
  label = 'Cargando',
}: SpinnerProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-sm text-muted-foreground',
        className,
      )}
      role="status"
    >
      <LoaderCircle
        className="size-5 animate-spin"
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
}