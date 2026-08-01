import type { Metadata } from 'next';

import { AuthCard } from '@/components/auth/auth-card';
import { AuthShell } from '@/components/auth/auth-shell';
import { AuthNotice } from '@/features/auth/components/auth-notice';
import { PasswordRecoveryForm } from '@/features/auth/components/password-recovery-form';

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

  const notice =
    params.recovery_expired === '1'
      ? 'El enlace de recuperación ha caducado. Solicita uno nuevo.'
      : params.recovery_required === '1'
        ? 'Para crear una contraseña nueva, solicita primero un enlace de recuperación.'
        : undefined;

  return (
    <AuthShell
      title="Recupera tu contraseña"
      description="Introduce tu correo y te enviaremos un enlace seguro."
    >
      <AuthCard>
        <AuthNotice message={notice} tone="error" />
        <PasswordRecoveryForm />
      </AuthCard>
    </AuthShell>
  );
}
