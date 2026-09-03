import type { ReactNode } from 'react';

import type { AuthUser } from '@/features/auth/types/auth-user';

import { AppSidebar } from './app-sidebar';
import { AppTopbar } from './app-topbar';
import { BackToTopButton } from './back-to-top-button';
import { MobileNavigation } from './mobile-navigation';
import { getServerTranslator } from '@/features/i18n/server';

export interface AppShellProps {
  children: ReactNode;
  user: AuthUser;
  avatarUrl: string | null;
}

export async function AppShell({ children, user, avatarUrl }: AppShellProps) {
  const { translate } = await getServerTranslator();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar user={user} avatarUrl={avatarUrl} />

      <div className="min-h-screen lg:pl-72">
        <AppTopbar user={user} avatarUrl={avatarUrl} />
        <main className="pb-28 lg:pb-0">{children}</main>
      </div>

      <MobileNavigation />
      <BackToTopButton label={translate('common.actions.backToTop')} />
    </div>
  );
}
