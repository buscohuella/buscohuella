import type { Metadata } from 'next';

import { AuthCard } from '@/components/auth/auth-card';
import { AuthShell } from '@/components/auth/auth-shell';
import { AuthNotice } from '@/features/auth/components/auth-notice';
import { LoginForm } from '@/features/auth/components/login-form';
import { RegistrationSuccessNotice } from '@/features/auth/components/registration-success-notice';
import { getServerTranslator } from '@/features/i18n/server';

export const metadata: Metadata = {
  title: 'Iniciar sesión | BuscoHuella',
  description: 'Accede a tu cuenta de BuscoHuella.',
  robots: { index: false, follow: false },
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

  const registrationSucceeded = params.registered === '1';
  const notice =
    params.password_updated === '1'
        ? translate('auth.login.passwordUpdated')
      : params.logged_out === '1'
        ? translate('auth.login.loggedOut')
        : params.auth_error === 'oauth'
          ? translate('auth.login.oauthError')
          : params.auth_error === 'confirmation'
            ? translate('auth.login.confirmationError')
            : undefined;

  return (
    <AuthShell
      title={translate('auth.login.title')}
      description={translate('auth.login.description')}
    >
      <AuthCard>
        {registrationSucceeded ? (
          <RegistrationSuccessNotice next={params.next} />
        ) : null}
        <AuthNotice
          message={notice}
          tone={params.auth_error ? 'error' : 'success'}
        />
        <LoginForm next={params.next} />
      </AuthCard>
    </AuthShell>
  );
}
