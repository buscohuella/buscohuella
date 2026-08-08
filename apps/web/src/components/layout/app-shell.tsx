import type { ReactNode } from 'react';

import type { AuthUser } from '@/features/auth/types/auth-user';

import { AppSidebar } from './app-sidebar';
import { AppTopbar } from './app-topbar';
import { MobileNavigation } from './mobile-navigation';

export interface AppShellProps {
  children: ReactNode;
  user: AuthUser;
  avatarUrl: string | null;
}

export function AppShell({ children, user, avatarUrl }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar user={user} avatarUrl={avatarUrl} />

      <div className="min-h-screen lg:pl-72">
        <AppTopbar user={user} avatarUrl={avatarUrl} />
        <main className="pb-28 lg:pb-0">{children}</main>
      </div>

      <MobileNavigation />
    </div>
  );
}
