import type { Metadata } from 'next';

import { AuthCard } from '@/components/auth/auth-card';
import { AuthShell } from '@/components/auth/auth-shell';
import { RegisterForm } from '@/features/auth/components/register-form';
import { getServerTranslator } from '@/features/i18n/server';

export const metadata: Metadata = {
  title: 'Crear cuenta | BuscoHuella',
  description: 'Crea una cuenta en BuscoHuella.',
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
  }>;
}) {
  const params = await searchParams;
  const { translate } = await getServerTranslator();

  return (
    <AuthShell
      title={translate('auth.register.title')}
      description={translate('auth.register.description')}
    >
      <AuthCard>
        <RegisterForm next={params.next} />
      </AuthCard>
    </AuthShell>
  );
}
