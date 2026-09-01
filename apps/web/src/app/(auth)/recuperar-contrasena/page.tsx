import type { Metadata } from 'next';

import { AuthCard } from '@/components/auth/auth-card';
import { AuthShell } from '@/components/auth/auth-shell';
import { AuthNotice } from '@/features/auth/components/auth-notice';
import { PasswordRecoveryForm } from '@/features/auth/components/password-recovery-form';
import { getServerTranslator } from '@/features/i18n/server';

export const metadata: Metadata = {
  title: 'Recuperar contraseña | BuscoHuella',
  description: 'Solicita un enlace para recuperar tu contraseña.',
};

interface PasswordRecoveryPageProps {
  searchParams: Promise<{
    recovery_required?: string;
    recovery_expired?: string;
  }>;
}

export default async function PasswordRecoveryPage({
  searchParams,
}: PasswordRecoveryPageProps) {
  const params = await searchParams;
  const { translate } = await getServerTranslator();

  const notice =
    params.recovery_expired === '1'
      ? translate('auth.recover.expired')
      : params.recovery_required === '1'
        ? translate('auth.recover.required')
        : undefined;

  return (
    <AuthShell
      title={translate('auth.recover.title')}
      description={translate('auth.recover.description')}
    >
      <AuthCard>
        <AuthNotice message={notice} tone="error" />
        <PasswordRecoveryForm />
      </AuthCard>
    </AuthShell>
  );
}
