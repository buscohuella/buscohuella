import { ShieldCheck } from 'lucide-react';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getServerTranslator } from '@/features/i18n/server';

export default async function ProfilePrivacyPage() {
  const { translate } = await getServerTranslator();
  const title = translate('profile.hub.sections.privacy.title');
  return (
    <>
      <PageContainer className="pb-0"><Breadcrumbs label={translate('profile.page.breadcrumbLabel')} items={[{ href: '/inicio', label: translate('profile.page.home') }, { href: '/perfil', label: translate('profile.page.title') }, { label: title }]} /></PageContainer>
      <PageContainer className="space-y-6 pt-2">
        <header className="max-w-3xl space-y-2">
          <p className="text-sm font-semibold text-primary">{translate('profile.page.eyebrow')}</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          <p className="text-base leading-7 text-muted-foreground">{translate('profile.hub.sections.privacy.description')}</p>
        </header>
        <Card>
          <CardHeader>
            <ShieldCheck className="mb-3 size-8 text-primary" aria-hidden="true" />
            <CardTitle>{translate('profile.page.privacyTitle')}</CardTitle>
            <CardDescription>{translate('profile.page.privacyDescription')}</CardDescription>
          </CardHeader>
          <div className="grid gap-6 border-t border-border px-6 py-6 md:grid-cols-2">
            <div>
              <h2 className="font-semibold">{translate('profile.page.privacyPublicTitle')}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                <li>{translate('profile.page.privacyPublicPointOne')}</li>
                <li>{translate('profile.page.privacyPublicPointTwo')}</li>
                <li>{translate('profile.page.privacyPublicPointThree')}</li>
              </ul>
            </div>
            <div>
              <h2 className="font-semibold">{translate('profile.page.privacyPrivateTitle')}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                <li>{translate('profile.page.privacyPrivatePointOne')}</li>
                <li>{translate('profile.page.privacyPrivatePointTwo')}</li>
                <li>{translate('profile.page.privacyPrivatePointThree')}</li>
              </ul>
            </div>
          </div>
        </Card>
      </PageContainer>
    </>
  );
}
