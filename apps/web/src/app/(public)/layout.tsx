import type { ReactNode } from 'react';

import { AppShell } from '@/components/layout/app-shell';
import { PublicShell } from '@/components/layout/public-shell';
import { getCurrentUser } from '@/features/auth/queries/get-current-user';

export default async function PublicLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUser();

  if (user) {
    return <AppShell user={user}>{children}</AppShell>;
  }

  return <PublicShell user={null}>{children}</PublicShell>;
}
