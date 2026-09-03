'use client';

import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import { useTranslations } from '@/features/i18n/i18n-provider';

export function PublicFooter() {
  const { t: translate } = useTranslations('common');

  return (
    <footer className="mt-16 bg-footer-background text-footer-foreground">
      <PageContainer className="py-10 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1.35fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-sm">
            <a href="https://buscohuella.com/" className="inline-flex items-center gap-3 rounded-lg underline-offset-4 transition-[color,text-decoration-color,transform] hover:-translate-y-0.5 hover:text-primary hover:underline active:translate-y-0 active:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
              <Image src="/brand/mark.png" alt="" width={36} height={36} className="size-9 object-contain" />
              <span className="text-lg font-bold tracking-tight"><span className="text-primary">Busco</span><span className="text-accent">Huella</span></span>
            </a>
            <p className="mt-4 text-sm leading-6 text-footer-muted">{translate('footer.description')}</p>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-footer-muted">{translate('footer.exploreTitle')}</h2>
            <nav className="mt-4 grid gap-3 text-sm" aria-label={translate('footer.exploreTitle')}>
              <Link href="/explorar-avisos" className="group inline-flex w-fit items-center gap-1 underline-offset-4 transition-[color,text-decoration-color] hover:text-primary hover:underline active:text-primary active:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('navigation.reports')}<ArrowUpRight className="size-3 text-footer-muted opacity-0 transition-[color,opacity,transform] group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" aria-hidden="true" /></Link>
              <Link href="/mapa" className="group inline-flex w-fit items-center gap-1 underline-offset-4 transition-[color,text-decoration-color] hover:text-primary hover:underline active:text-primary active:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('navigation.map')}<ArrowUpRight className="size-3 text-footer-muted opacity-0 transition-[color,opacity,transform] group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" aria-hidden="true" /></Link>
              <Link href="/ayuda" className="group inline-flex w-fit items-center gap-1 underline-offset-4 transition-[color,text-decoration-color] hover:text-primary hover:underline active:text-primary active:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('navigation.help')}<ArrowUpRight className="size-3 text-footer-muted opacity-0 transition-[color,opacity,transform] group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" aria-hidden="true" /></Link>
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-footer-muted">{translate('footer.accountTitle')}</h2>
            <nav className="mt-4 grid gap-3 text-sm" aria-label={translate('footer.accountTitle')}>
              <Link href="/login" className="group inline-flex w-fit items-center gap-1 underline-offset-4 transition-[color,text-decoration-color] hover:text-primary hover:underline active:text-primary active:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('navigation.login')}<ArrowUpRight className="size-3 text-footer-muted opacity-0 transition-[color,opacity,transform] group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" aria-hidden="true" /></Link>
              <Link href="/registro" className="group inline-flex w-fit items-center gap-1 underline-offset-4 transition-[color,text-decoration-color] hover:text-primary hover:underline active:text-primary active:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('navigation.register')}<ArrowUpRight className="size-3 text-footer-muted opacity-0 transition-[color,opacity,transform] group-hover:translate-x-0.5 group-hover:text-primary group-hover:opacity-100" aria-hidden="true" /></Link>
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-footer-muted">{translate('footer.contactTitle')}</h2>
            <div className="mt-4 grid gap-3 text-sm text-footer-muted">
              <a href="mailto:info@buscohuella.com" className="inline-flex items-center gap-2 underline-offset-4 transition-[color,text-decoration-color] hover:text-primary hover:underline active:text-primary active:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"><Mail className="size-4 text-accent" aria-hidden="true" />{translate('footer.email')}</a>
              <span className="inline-flex items-center gap-2"><MapPin className="size-4 text-accent" aria-hidden="true" />{translate('footer.location')}</span>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-footer-border pt-5 text-xs text-footer-muted sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>{translate('footer.privacy')}</p>
            <nav className="flex flex-wrap gap-1" aria-label={translate('footer.legalTitle')}>
              <Link href="/legal/privacidad" className="inline-flex min-h-10 items-center rounded-md px-2 font-medium text-footer-foreground underline decoration-footer-muted underline-offset-4 transition-colors hover:bg-footer-foreground/10 hover:text-primary hover:decoration-primary active:bg-footer-foreground/10 active:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('footer.privacyLink')}</Link>
              <Link href="/legal/terminos" className="inline-flex min-h-10 items-center rounded-md px-2 font-medium text-footer-foreground underline decoration-footer-muted underline-offset-4 transition-colors hover:bg-footer-foreground/10 hover:text-primary hover:decoration-primary active:bg-footer-foreground/10 active:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('footer.termsLink')}</Link>
              <Link href="/legal/cookies" className="inline-flex min-h-10 items-center rounded-md px-2 font-medium text-footer-foreground underline decoration-footer-muted underline-offset-4 transition-colors hover:bg-footer-foreground/10 hover:text-primary hover:decoration-primary active:bg-footer-foreground/10 active:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('footer.cookiesLink')}</Link>
            </nav>
          </div>
          <a href="https://buscohuella.com/" className="underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('footer.copyright')}</a>
        </div>
      </PageContainer>
    </footer>
  );
}
