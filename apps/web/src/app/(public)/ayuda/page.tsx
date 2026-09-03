import type { Metadata } from 'next';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageContainer } from '@/components/layout/page-container';
import { getServerTranslator } from '@/features/i18n/server';
import { SupportForm } from '@/features/support/components/support-form';

export async function generateMetadata(): Promise<Metadata> {
  const { translate } = await getServerTranslator();
  return { title: translate('common.support.metadata.title'), description: translate('common.support.metadata.description') };
}

export default async function SupportPage() {
  const { translate } = await getServerTranslator();
  return (
    <PageContainer className="space-y-7 py-6 sm:py-10">
      <Breadcrumbs label={translate('common.navigation.publicLabel')} items={[{ href: '/', label: translate('common.navigation.home') }, { label: translate('common.support.title') }]} />
      <header className="max-w-2xl">
        <p className="text-sm font-semibold text-primary">{translate('common.support.eyebrow')}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{translate('common.support.title')}</h1>
        <p className="mt-3 text-base leading-7 text-muted-foreground">{translate('common.support.description')}</p>
      </header>
      <SupportForm />
    </PageContainer>
  );
}
