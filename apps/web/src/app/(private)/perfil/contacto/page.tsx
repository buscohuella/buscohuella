import { EyeOff } from 'lucide-react';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageContainer } from '@/components/layout/page-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getServerTranslator } from '@/features/i18n/server';
import { NotificationPreferencesForm } from '@/features/notifications/components/notification-preferences-form';
import { getMyNotificationPreferences } from '@/features/notifications/lib/notification-preferences';

export default async function ProfileContactPage() {
  const { translate } = await getServerTranslator();
  const preferences = await getMyNotificationPreferences();
  const title = translate('profile.hub.sections.contact.title');
  return (
    <>
      <PageContainer className="pb-0"><Breadcrumbs label={translate('profile.page.breadcrumbLabel')} items={[{ href: '/inicio', label: translate('profile.page.home') }, { href: '/perfil', label: translate('profile.page.title') }, { label: title }]} /></PageContainer>
      <PageContainer className="space-y-6 pt-2">
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
            <h2 className="font-semibold">{translate('profile.page.contactSettingsTitle')}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{translate('profile.page.contactSettingsDescription')}</p>
            <div className="mt-6">
              <NotificationPreferencesForm
                initialSightings={preferences.inAppSightings}
                initialReportUpdates={preferences.inAppReportUpdates}
              />
            </div>
          </CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
