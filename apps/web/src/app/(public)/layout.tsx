import type { ReactNode } from 'react';

import { PublicShell } from '@/components/layout/public-shell';
import { getCurrentUser } from '@/features/auth/queries/get-current-user';

export default async function PublicLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUser();

  return <PublicShell user={user}>{children}</PublicShell>;
}
