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
    intent?: string;
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
        {params.intent === 'publish' ? (
          <div className="mb-5 rounded-xl border border-primary/20 bg-primary-soft p-4" role="note">
            <p className="font-semibold">{translate('auth.register.publishNoticeTitle')}</p>
            <p className="mt-1 text-sm text-muted-foreground">{translate('auth.register.publishNoticeDescription')}</p>
          </div>
        ) : null}
        <RegisterForm next={params.next} />
      </AuthCard>
    </AuthShell>
  );
}
