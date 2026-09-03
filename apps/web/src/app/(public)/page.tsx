import {
  ArrowRight,
  HeartHandshake,
  LockKeyhole,
  Map,
  MapPin,
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
      id: 'create',
      title: translate('home.actions.reportTitle'),
      description: translate('home.actions.reportDescription'),
      href: '/registro?intent=publish&next=/mis-reportes/nuevo',
      icon: HeartHandshake,
    },
  ];

  return (
    <PageContainer className="space-y-10 py-10 sm:py-14">
      <section className="relative overflow-hidden rounded-3xl border border-primary/10 bg-[linear-gradient(135deg,var(--primary-soft)_0%,var(--surface)_58%,var(--surface-sunken)_100%)] p-6 shadow-[0_20px_60px_rgba(6,95,70,0.08)] sm:p-10 lg:p-14">
        <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-primary/10" aria-hidden="true" />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 self-start rounded-full bg-surface-elevated px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary shadow-[var(--shadow-sm)]">
              <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
              {translate('common.app.tagline')}
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{translate('home.hero.title')}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{translate('home.hero.description')}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/explorar-avisos"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-6 text-lg font-semibold text-primary-foreground transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_10px_24px_rgba(6,95,70,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          >
            {translate('home.hero.explore')}
            <ArrowRight
              className="size-5"
              aria-hidden="true"
            />
          </Link>

          <Link
            href="/registro"
            className="inline-flex min-h-14 items-center justify-center rounded-full border border-border bg-surface-elevated px-6 text-lg font-semibold text-foreground transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-surface-hover hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          >
            {translate('home.hero.register')}
          </Link>
            </div>
          </div>
          <div className="relative rounded-3xl border border-primary/15 bg-surface-elevated/95 p-6 shadow-[var(--shadow-md)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">{translate('home.hero.panelEyebrow')}</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">{translate('home.hero.panelTitle')}</h2>
              </div>
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                <MapPin className="size-6" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{translate('home.hero.panelDescription')}</p>
            <div className="mt-6 grid gap-3">
              <Link href="/explorar-avisos" className="inline-flex min-h-12 items-center justify-between gap-3 rounded-2xl bg-primary px-4 font-semibold text-primary-foreground transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
                <span className="flex items-center gap-2"><Search className="size-5" aria-hidden="true" />{translate('home.hero.panelExplore')}</span>
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
              <Link href="/mapa" className="inline-flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 font-semibold text-foreground transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-surface-hover hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
                <span className="flex items-center gap-2"><Map className="size-5 text-primary" aria-hidden="true" />{translate('home.hero.panelMap')}</span>
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-6 flex items-start gap-3 border-t border-border-soft pt-5 text-sm text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>{translate('home.hero.panelPrivacy')}</span>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="public-actions-title"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2
            id="public-actions-title"
            className="text-2xl font-bold tracking-tight"
          >
            {translate('home.actions.title')}
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">{translate('home.actions.description')}</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.id}
                href={action.href}
                className="rounded-xl transition-transform duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
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

      <section aria-labelledby="home-help-title" className="rounded-3xl border border-accent/40 bg-accent-soft p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent/20 text-accent">
              <HeartHandshake className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h2 id="home-help-title" className="font-bold">{translate('home.help.title')}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{translate('home.help.description')}</p>
            </div>
          </div>
          <Link href="/registro?intent=publish&next=/mis-reportes/nuevo" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 font-semibold text-accent-foreground transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[var(--shadow-sm)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
            {translate('home.help.action')}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section aria-labelledby="home-trust-title" className="rounded-3xl border border-border-soft bg-surface-elevated p-6 sm:p-8">
        <div className="max-w-2xl">
          <h2 id="home-trust-title" className="text-2xl font-bold tracking-tight">{translate('home.trust.title')}</h2>
          <p className="mt-2 text-muted-foreground">{translate('home.trust.description')}</p>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            { icon: LockKeyhole, title: 'privacyTitle', description: 'privacyDescription' },
            { icon: Users, title: 'communityTitle', description: 'communityDescription' },
            { icon: ShieldCheck, title: 'accessibleTitle', description: 'accessibleDescription' },
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
