import type { Metadata } from 'next';

import { AuthCard } from '@/components/auth/auth-card';
import { AuthShell } from '@/components/auth/auth-shell';
import { AuthNotice } from '@/features/auth/components/auth-notice';
import { LoginForm } from '@/features/auth/components/login-form';
import { getServerTranslator } from '@/features/i18n/server';

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
    next?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params = await searchParams;
  const { translate } = await getServerTranslator();

  const notice =
    params.registered === '1'
      ? translate('auth.login.registered')
      : params.password_updated === '1'
        ? translate('auth.login.passwordUpdated')
      : params.logged_out === '1'
        ? translate('auth.login.loggedOut')
        : params.auth_error === 'oauth'
          ? translate('auth.login.oauthError')
          : undefined;

  return (
    <AuthShell
      title={translate('auth.login.title')}
      description={translate('auth.login.description')}
    >
      <AuthCard>
        <AuthNotice message={notice} />
        <LoginForm next={params.next} />
      </AuthCard>
    </AuthShell>
  );
}
