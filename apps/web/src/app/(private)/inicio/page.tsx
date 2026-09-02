import { Bell, Map, PawPrint, ScrollText } from 'lucide-react';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AuthNotice } from '@/features/auth/components/auth-notice';
import { getServerTranslator } from '@/features/i18n/server';
import { getCurrentUser } from '@/features/auth/queries/get-current-user';
import { TimeGreeting } from '@/features/home/components/time-greeting';

interface PrivateHomePageProps {
  searchParams: Promise<{
    login?: string;
    account_confirmed?: string;
  }>;
}

export default async function PrivateHomePage({
  searchParams,
}: PrivateHomePageProps) {
  const params = await searchParams;
  const { translate: t } = await getServerTranslator();
  const user = await getCurrentUser();

  const notice =
    params.account_confirmed === '1'
      ? t('home.private.notices.accountConfirmed')
      : params.login === 'success'
        ? t('home.private.notices.loginSuccess')
        : undefined;

  const shortcuts = [
    {
      href: '/mapa',
      title: t('home.private.shortcuts.map.title'),
      description: t('home.private.shortcuts.map.description'),
      icon: Map,
    },
    {
      href: '/mis-reportes',
      title: t('home.private.shortcuts.reports.title'),
      description: t('home.private.shortcuts.reports.description'),
      icon: ScrollText,
    },
    {
      href: '/mis-mascotas',
      title: t('home.private.shortcuts.pets.title'),
      description: t('home.private.shortcuts.pets.description'),
      icon: PawPrint,
    },
  ];

  return (
    <PageContainer className="space-y-8">
      <AuthNotice message={notice} />

      <section className="rounded-xl border border-border-soft bg-primary-soft p-6 sm:p-8">
        <p className="text-sm font-semibold text-primary">
          {t('home.private.areaLabel')}
        </p>

        <TimeGreeting
          name={user?.fullName ?? t('home.private.greetingFallbackName')}
          labels={{
            morning: t('home.private.greeting.morning'),
            afternoon: t('home.private.greeting.afternoon'),
            night: t('home.private.greeting.night'),
          }}
        />

        <p className="mt-4 max-w-2xl text-muted-foreground">
          {t('home.private.description')}
        </p>
      </section>

      <section aria-labelledby="private-shortcuts-title">
        <h2
          id="private-shortcuts-title"
          className="text-2xl font-bold tracking-tight"
        >
          {t('home.private.shortcutsTitle')}
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;

            return (
              <Link
                key={shortcut.title}
                href={shortcut.href}
                className="group block rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
                aria-label={`${shortcut.title}: ${shortcut.description}`}
              >
              <Card className="h-full transition-colors group-hover:border-primary group-hover:bg-primary-soft">
                <CardHeader>
                  <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <CardTitle>{shortcut.title}</CardTitle>
                  <CardDescription>{shortcut.description}</CardDescription>
                </CardHeader>
              </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <Card elevated>
        <CardHeader>
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent-hover">
            <Bell className="size-6" aria-hidden="true" />
          </span>
          <CardTitle>{t('home.private.activity.title')}</CardTitle>
          <CardDescription>{t('home.private.activity.description')}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-border-soft bg-surface p-5 text-center">
            <p className="font-semibold">{t('home.private.activity.empty')}</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
