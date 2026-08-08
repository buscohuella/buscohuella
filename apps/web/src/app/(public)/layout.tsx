import type { ReactNode } from 'react';

import { AppShell } from '@/components/layout/app-shell';
import { PublicShell } from '@/components/layout/public-shell';
import { getCurrentUser } from '@/features/auth/queries/get-current-user';
import { getProfile } from '@/features/profile/queries/get-profile';

export default async function PublicLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUser();

  if (user) {
    const profile = await getProfile();
    return <AppShell user={user} avatarUrl={profile?.avatarUrl ?? null}>{children}</AppShell>;
  }

  return <PublicShell user={null}>{children}</PublicShell>;
}
