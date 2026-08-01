import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { recoveryFlowCookie } from '@/features/auth/lib/recovery-flow';
import { getCurrentUser } from '@/features/auth/queries/get-current-user';

export default async function RecoveryLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [cookieStore, user] = await Promise.all([
    cookies(),
    getCurrentUser(),
  ]);

  const hasRecoveryFlow =
    cookieStore.get(recoveryFlowCookie)?.value === '1';

  if (!hasRecoveryFlow) {
    if (user) {
      redirect('/inicio');
    }

    redirect('/recuperar-contrasena?recovery_required=1');
  }

  if (!user) {
    redirect('/recuperar-contrasena?recovery_expired=1');
  }

  return children;
}
