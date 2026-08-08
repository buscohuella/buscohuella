import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { AppShell } from '@/components/layout/app-shell';
import { getCurrentUser } from '@/features/auth/queries/get-current-user';
import { getProfile } from '@/features/profile/queries/get-profile';

export default async function ApplicationLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await getProfile();

  return <AppShell user={user} avatarUrl={profile?.avatarUrl ?? null}>{children}</AppShell>;
}
