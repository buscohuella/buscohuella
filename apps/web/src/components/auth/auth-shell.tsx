'use client';

import { ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { BrandLogo } from '@/components/brand/brand-logo';
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

  return (
    <main className="relative min-h-screen bg-background lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)]">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 sm:right-6 sm:top-6">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <section className="relative hidden overflow-hidden bg-primary-soft p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-28 top-24 size-96 rounded-full border-[3rem] border-primary/5" aria-hidden="true" />
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          aria-label={t('shell.homeAria')}
        >
          <BrandLogo className="h-20 w-56" priority />
        </Link>

        <div className="relative max-w-xl">
          <span className="mb-6 flex size-14 items-center justify-center rounded-xl bg-surface-elevated text-primary shadow-[var(--shadow-sm)]">
            <ShieldCheck
              className="size-7"
              aria-hidden="true"
            />
          </span>

          <p className="text-sm font-semibold text-primary">
            {t('shell.tagline')}
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            {t('shell.headline')}
          </h2>

          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            {t('shell.description')}
          </p>

          <ul className="mt-8 grid gap-3 text-sm font-semibold" aria-label={t('shell.benefitsLabel')}>
            {(['privacy', 'community', 'control'] as const).map((benefit, index) => (
              <li key={benefit} className="flex items-center gap-3">
                <span className="flex size-8 items-center justify-center rounded-full bg-surface-elevated text-primary shadow-[var(--shadow-sm)]" aria-hidden="true">
                  {index === 1 ? <Users className="size-4" /> : <ShieldCheck className="size-4" />}
                </span>
                {t(`shell.benefits.${benefit}`)}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-muted-foreground">
          {t('shell.pilot')}
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft lg:hidden"
            aria-label={t('shell.homeAria')}
          >
            <BrandLogo className="h-16 w-48" priority />
          </Link>

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

          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
