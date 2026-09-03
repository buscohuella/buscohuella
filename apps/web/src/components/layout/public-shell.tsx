import type { ReactNode } from 'react';

import type { AuthUser } from '@/features/auth/types/auth-user';
import { BackToTopButton } from './back-to-top-button';
import { PublicHeader } from './public-header';
import { PublicFooter } from './public-footer';
import { getServerTranslator } from '@/features/i18n/server';

export async function PublicShell({
  children,
  user,
}: {
  children: ReactNode;
  user: AuthUser | null;
}) {
  const { translate } = await getServerTranslator();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <PublicHeader user={user} />
      <main>{children}</main>
      <PublicFooter />
      <BackToTopButton label={translate('common.actions.backToTop')} />
    </div>
  );
}
