import * as React from 'react';

import { cn } from '@/lib/utils';

export interface LiveRegionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  politeness?: 'polite' | 'assertive';
  visuallyHidden?: boolean;
}

export function LiveRegion({
  children,
  className,
  politeness = 'polite',
  visuallyHidden = true,
  ...props
}: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-atomic="true"
      className={cn(visuallyHidden && 'sr-only', className)}
      {...props}
    >
      {children}
    </div>
  );
}