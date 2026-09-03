import type { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';

export interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Card elevated className="rounded-3xl border-border-soft shadow-[0_20px_60px_rgba(15,23,42,0.1)]">
      <CardContent className="px-4 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-6">{children}</CardContent>
    </Card>
  );
}
