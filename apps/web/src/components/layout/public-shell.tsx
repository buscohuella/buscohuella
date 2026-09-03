import type { ReactNode } from 'react';

import type { AuthUser } from '@/features/auth/types/auth-user';
import { PublicHeader } from './public-header';
import { PublicFooter } from './public-footer';

export function PublicShell({
  children,
  user,
}: {
  children: ReactNode;
  user: AuthUser | null;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader user={user} />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
