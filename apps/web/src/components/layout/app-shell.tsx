import type { ReactNode } from 'react';

import { AppSidebar } from './app-sidebar';
import { AppTopbar } from './app-topbar';
import { MobileNavigation } from './mobile-navigation';

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />

      <div className="min-h-screen lg:pl-72">
        <AppTopbar />

        <main className="pb-28 lg:pb-0">{children}</main>
      </div>

      <MobileNavigation />
    </div>
  );
}
