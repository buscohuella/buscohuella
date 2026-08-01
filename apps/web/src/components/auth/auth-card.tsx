import type { ReactNode } from 'react';

import { Card, CardContent } from '@/components/ui/card';

export interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Card elevated>
      <CardContent className="pt-5">{children}</CardContent>
    </Card>
  );
}
