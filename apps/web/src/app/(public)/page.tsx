import {
  ArrowRight,
  HeartHandshake,
  Map,
  PawPrint,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentUser } from '@/features/auth/queries/get-current-user';
import { getServerTranslator } from '@/features/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { translate } = await getServerTranslator();

  return {
    title: translate('home.metadata.title'),
    description: translate(
      'home.metadata.description',
    ),
  };
}

export default async function PublicHomePage() {
  const [user, { translate }] =
    await Promise.all([
      getCurrentUser(),
      getServerTranslator(),
    ]);

  if (user) {
    redirect('/inicio');
  }

  const actions = [
    {
      id: 'map',
      title: translate(
        'home.actions.mapTitle',
      ),
      description: translate(
        'home.actions.mapDescription',
      ),
      href: '/mapa',
      icon: Map,
    },
    {
      id: 'reports',
      title: translate(
        'home.actions.reportsTitle',
      ),
      description: translate(
        'home.actions.reportsDescription',
      ),
    href: '/explorar-avisos',
      icon: Search,
    },
    {
      id: 'create',
      title: translate('home.actions.reportTitle'),
      description: translate('home.actions.reportDescription'),
      href: '/registro?intent=publish&next=/mis-reportes/nuevo',
      icon: HeartHandshake,
    },
  ];

  return (
    <PageContainer className="space-y-10 py-10 sm:py-14">
      <section className="relative overflow-hidden rounded-3xl border border-border-soft bg-primary-soft p-6 sm:p-10 lg:p-14">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/10" aria-hidden="true" />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-center">
          <div>
            <span className="flex size-14 items-center justify-center rounded-2xl bg-surface-elevated text-primary shadow-[var(--shadow-sm)]">
              <PawPrint className="size-7" aria-hidden="true" />
            </span>
            <p className="mt-6 text-sm font-semibold text-primary">{translate('common.app.tagline')}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{translate('home.hero.title')}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{translate('home.hero.description')}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/mapa"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-6 text-lg font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          >
            {translate('home.hero.explore')}
            <ArrowRight
              className="size-5"
              aria-hidden="true"
            />
          </Link>

          <Link
            href="/registro"
            className="inline-flex min-h-14 items-center justify-center rounded-full border border-border bg-surface-elevated px-6 text-lg font-semibold text-foreground hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          >
            {translate('home.hero.register')}
          </Link>
            </div>
          </div>
          <div className="relative rounded-3xl border border-primary/15 bg-surface-elevated/90 p-6 shadow-[var(--shadow-md)]">
            <p className="text-sm font-semibold text-primary">{translate('home.hero.visualTitle')}</p>
            <p className="mt-2 text-sm text-muted-foreground">{translate('home.hero.visualDescription')}</p>
            <ol className="mt-6 space-y-4">
              {[translate('home.hero.stepOne'), translate('home.hero.stepTwo'), translate('home.hero.stepThree')].map((step, index) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span>
                  <span className="text-sm font-semibold">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="public-actions-title"
      >
        <h2
          id="public-actions-title"
          className="text-2xl font-bold tracking-tight"
        >
          {translate('home.actions.title')}
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.id}
                href={action.href}
                className="rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
              >
                <Card className="h-full">
                  <CardHeader>
                    <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon
                        className="size-6"
                        aria-hidden="true"
                      />
                    </span>
                    <CardTitle>
                      {action.title}
                    </CardTitle>
                    <CardDescription>
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="home-trust-title" className="rounded-3xl border border-border-soft bg-surface-elevated p-6 sm:p-8">
        <div className="max-w-2xl">
          <h2 id="home-trust-title" className="text-2xl font-bold tracking-tight">{translate('home.trust.title')}</h2>
          <p className="mt-2 text-muted-foreground">{translate('home.trust.description')}</p>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: 'privacyTitle', description: 'privacyDescription' },
            { icon: Users, title: 'communityTitle', description: 'communityDescription' },
            { icon: HeartHandshake, title: 'accessibleTitle', description: 'accessibleDescription' },
          ].map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="size-5" aria-hidden="true" /></span>
              <div><h3 className="font-semibold">{translate(`home.trust.${title}`)}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{translate(`home.trust.${description}`)}</p></div>
            </div>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
