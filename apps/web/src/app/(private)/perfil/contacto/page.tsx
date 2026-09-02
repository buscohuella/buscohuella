import { EyeOff } from 'lucide-react';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getServerTranslator } from '@/features/i18n/server';

export default async function ProfileContactPage() {
  const { translate } = await getServerTranslator();
  const title = translate('profile.hub.sections.contact.title');
  return (
    <>
      <PageContainer className="pb-0"><Breadcrumbs label={translate('profile.page.breadcrumbLabel')} items={[{ href: '/inicio', label: translate('profile.page.home') }, { href: '/perfil', label: translate('profile.page.title') }, { label: title }]} /></PageContainer>
      <PageContainer className="space-y-6 pt-2">
        <Link href="/perfil" className="inline-flex min-h-10 items-center rounded-sm font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
          <span aria-hidden="true">←</span>
          <span className="ml-2">{translate('profile.page.back')}</span>
        </Link>
        <header className="max-w-3xl space-y-2">
          <p className="text-sm font-semibold text-primary">{translate('profile.page.eyebrow')}</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="text-base leading-7 text-muted-foreground">{translate('profile.hub.sections.contact.description')}</p>
        </header>
        <Card>
          <CardHeader>
            <EyeOff className="mb-3 size-8 text-primary" aria-hidden="true" />
            <CardTitle>{translate('profile.page.contactTitle')}</CardTitle>
            <CardDescription>{translate('profile.page.contactDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="border-t border-border pt-6">
            <h2 className="font-semibold">{translate('profile.page.contactHowTitle')}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{translate('profile.page.contactHowDescription')}</p>
            <h2 className="mt-6 font-semibold">{translate('profile.page.contactPrivacyTitle')}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{translate('profile.page.contactPrivacyDescription')}</p>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
