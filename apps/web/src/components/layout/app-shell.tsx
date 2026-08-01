import type { ReactNode } from 'react';

import type { AuthUser } from '@/features/auth/types/auth-user';

import { AppSidebar } from './app-sidebar';
import { AppTopbar } from './app-topbar';
import { MobileNavigation } from './mobile-navigation';

export interface AppShellProps {
  children: ReactNode;
  user: AuthUser;
}

export function AppShell({ children, user }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar user={user} />

      <div className="min-h-screen lg:pl-72">
        <AppTopbar user={user} />
        <main className="pb-28 lg:pb-0">{children}</main>
      </div>

      <MobileNavigation />
    </div>
  );
}
