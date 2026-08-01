import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/features/auth/queries/get-current-user';

export default async function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await getCurrentUser();

  if (user) {
    redirect('/inicio');
  }

  return children;
}
