'use client';

import { Map, ScrollText, ShieldCheck, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { BackToTopButton } from '@/components/layout/back-to-top-button';
import { MobilePublicNav } from '@/components/layout/mobile-public-nav';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSelector } from '@/features/i18n/language-selector';
import { useTranslations } from '@/features/i18n/i18n-provider';

export interface AuthShellProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function AuthShell({
  children,
  title,
  description,
}: AuthShellProps) {
  const { t } = useTranslations('auth');
  const { t: commonT } = useTranslations('common');

  return (
    <main className="relative mx-auto min-h-screen max-w-7xl overflow-hidden bg-[radial-gradient(circle_at_85%_10%,var(--primary-soft),transparent_30%),var(--background)] pt-20 lg:grid lg:grid-cols-2">
      <header className="absolute inset-x-0 top-0 z-20 border-b border-border-soft bg-surface-elevated/90 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft" aria-label={t('shell.homeAria')}>
            <Image src="/brand/mark.png" alt="" width={40} height={40} className="size-9 object-contain sm:size-10" priority />
            <span className="text-base font-bold tracking-tight text-foreground sm:text-lg">BuscoHuella</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label={commonT('navigation.publicLabel')}>
            <Link href="/mapa" className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"><Map className="size-4" aria-hidden="true" />{commonT('navigation.map')}</Link>
            <Link href="/explorar-avisos" className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"><ScrollText className="size-4" aria-hidden="true" />{commonT('navigation.reports')}</Link>
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSelector />
            <div className="hidden md:block"><ThemeToggle /></div>
            <MobilePublicNav label={commonT('navigation.menu')} mapLabel={commonT('navigation.map')} reportsLabel={commonT('navigation.reports')} themeLabel={commonT('navigation.theme')} loginLabel={commonT('navigation.login')} registerLabel={commonT('navigation.register')} showAuth={true} />
          </div>
        </div>
      </header>

      <div className="hidden">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <section className="relative hidden overflow-hidden bg-[linear-gradient(145deg,var(--primary-soft)_0%,var(--background)_75%)] px-8 pb-10 pt-24 lg:flex lg:flex-col lg:justify-start xl:px-12">
        <div className="pointer-events-none absolute -right-28 top-24 size-96 rounded-full border-[3rem] border-primary/5" aria-hidden="true" />
        <div className="relative mx-auto w-full max-w-lg">
          <span className="mb-6 flex size-14 items-center justify-center rounded-xl bg-surface-elevated text-primary shadow-[var(--shadow-sm)]">
            <ShieldCheck
              className="size-7"
              aria-hidden="true"
            />
          </span>

          <p className="text-sm font-semibold text-primary">
            {t('shell.tagline')}
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight xl:text-4xl">
            {t('shell.headline')}
          </h2>

          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            {t('shell.description')}
          </p>

          <ul className="mt-7 grid gap-2 text-sm font-semibold" aria-label={t('shell.benefitsLabel')}>
            {(['privacy', 'community', 'control'] as const).map((benefit, index) => (
              <li key={benefit} className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-surface-elevated/75 p-3 shadow-[var(--shadow-sm)]">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary" aria-hidden="true">
                  {index === 1 ? <Users className="size-4" /> : <ShieldCheck className="size-4" />}
                </span>
                {t(`shell.benefits.${benefit}`)}
              </li>
            ))}
          </ul>
        </div>

        <p className="absolute bottom-8 left-8 text-xs text-muted-foreground xl:left-12">
          {t('shell.pilot')}
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:bg-surface/60 lg:px-8 lg:backdrop-blur-sm xl:px-10">
        <div className="w-full max-w-[440px]">
          <div>
            <p className="text-sm font-semibold text-primary">
              {t('shell.secureAccess')}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="mt-6">{children}</div>
          <footer className="mt-6 border-t border-border-soft pt-4 text-center text-xs text-muted-foreground">
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-label={t('footer.label')}>
              <Link href="/legal/privacidad" className="underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{t('footer.privacy')}</Link>
              <Link href="/legal/terminos" className="underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{t('footer.terms')}</Link>
              <Link href="/legal/cookies" className="underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{t('footer.cookies')}</Link>
              <Link href="/legal/cookies" className="underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{t('footer.cookies')}</Link>
              <a href="mailto:info@buscohuella.com" className="underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{t('footer.contact')}</a>
            </nav>
            <a href="https://buscohuella.com/" className="mt-2 inline-block underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">© 2026 BuscoHuella</a>
          </footer>
        </div>
      </section>
      <BackToTopButton label={commonT('actions.backToTop')} />
    </main>
  );
}
