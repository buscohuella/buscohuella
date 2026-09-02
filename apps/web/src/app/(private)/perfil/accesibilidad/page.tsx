import Link from 'next/link';
import { Accessibility } from 'lucide-react';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessibilitySettings } from '@/features/accessibility/components/accessibility-settings';
import { getServerTranslator } from '@/features/i18n/server';

export default async function AccessibilityPage() {
  const { translate } = await getServerTranslator();
  const title = translate('profile.hub.sections.accessibility.title');

  return (
    <>
      <PageContainer className="pb-0">
        <Breadcrumbs label={translate('profile.page.breadcrumbLabel')} items={[{ href: '/inicio', label: translate('profile.page.home') }, { href: '/perfil', label: translate('profile.page.title') }, { label: title }]} />
      </PageContainer>
      <PageContainer className="space-y-6 pt-2">
        <header className="max-w-3xl space-y-2">
          <p className="text-sm font-semibold text-primary">{translate('profile.page.eyebrow')}</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="text-base leading-7 text-muted-foreground">{translate('profile.hub.sections.accessibility.description')}</p>
        </header>
        <Card elevated>
          <CardHeader>
            <span className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary"><Accessibility className="size-7" aria-hidden="true" /></span>
            <CardTitle>{translate('accessibility.page.title')}</CardTitle>
            <CardDescription>{translate('accessibility.page.description')}</CardDescription>
          </CardHeader>
          <CardContent><AccessibilitySettings /></CardContent>
        </Card>
        <Link href="/perfil" className="inline-flex min-h-10 items-center rounded-lg font-semibold text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('accessibility.page.back')}</Link>
      </PageContainer>
    </>
  );
}
