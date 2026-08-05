import type { Metadata } from 'next';

import { AuthCard } from '@/components/auth/auth-card';
import { AuthShell } from '@/components/auth/auth-shell';
import { AuthNotice } from '@/features/auth/components/auth-notice';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: 'Iniciar sesión | BuscoHuella',
  description: 'Accede a tu cuenta de BuscoHuella.',
};

interface LoginPageProps {
  searchParams: Promise<{
    registered?: string;
    password_updated?: string;
    logged_out?: string;
    auth_error?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;

  const notice =
    params.registered === '1'
      ? 'Cuenta creada. Revisa tu correo electrónico y confirma la cuenta antes de iniciar sesión.'
      : params.password_updated === '1'
        ? 'Contraseña actualizada correctamente. Ya puedes iniciar sesión.'
        : params.logged_out === '1'
          ? 'La sesión se ha cerrado correctamente.'
          : undefined;

  return (
    <AuthShell
      title="Inicia sesión"
      description="Accede a tus mascotas, reportes y alertas."
    >
      <AuthCard>
        <AuthNotice message={notice} />
        <LoginForm />
      </AuthCard>
    </AuthShell>
  );
}
