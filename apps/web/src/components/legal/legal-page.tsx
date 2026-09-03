import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageContainer } from '@/components/layout/page-container';
import { getServerTranslator } from '@/features/i18n/server';
import { ArrowUpRight, CheckCircle2, ClipboardList, Database, Eye, FileCheck2, LockKeyhole, Mail, Scale, ShieldCheck, UsersRound } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { PrintButton } from './print-button';

type LegalDocument = 'privacy' | 'terms' | 'cookies';

const sections = {
  privacy: ['scope', 'data', 'purposes', 'sharing', 'rights', 'contact'],
  terms: ['scope', 'service', 'accounts', 'content', 'responsibilities', 'contact'],
  cookies: ['scope', 'necessary', 'preferences', 'thirdParties', 'control', 'contact'],
} as const;

const sectionIcons: Record<string, LucideIcon> = {
  scope: FileCheck2,
  data: Database,
  purposes: ShieldCheck,
  sharing: UsersRound,
  rights: Scale,
  contact: Mail,
  service: Eye,
  accounts: LockKeyhole,
  content: FileCheck2,
  responsibilities: ShieldCheck,
  necessary: LockKeyhole,
  preferences: Eye,
  thirdParties: UsersRound,
  control: Scale,
};

export async function LegalPage({ document }: { document: LegalDocument }) {
  const { translate } = await getServerTranslator();
  const prefix = `common.legal.${document}`;
  const documentLinks: Array<{ key: LegalDocument; href: string }> = [
    { key: 'privacy', href: '/legal/privacidad' },
    { key: 'cookies', href: '/legal/cookies' },
    { key: 'terms', href: '/legal/terminos' },
  ];

  return (
    <div className="bg-[#f8f7ff]">
      <PageContainer className="py-6 sm:py-8">
      <Breadcrumbs
        label={translate('common.navigation.publicLabel')}
        items={[
          { href: '/', label: translate('common.navigation.home') },
          { label: translate(`${prefix}.title`) },
        ]}
      />
      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1" aria-label={translate('common.legal.documentNavigation')}>
        {documentLinks.map(({ key, href }) => (
          <Link key={key} href={href} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft ${key === document ? 'border-primary bg-primary !text-white shadow-sm hover:bg-primary-container' : 'border-border-soft bg-white text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-primary'}`}>
            {translate(`common.legal.${key}.title`)}
          </Link>
        ))}
      </nav>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article className="rounded-3xl border border-border-soft bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04)] sm:p-10">
          <header className="border-b border-border-soft pb-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{translate('common.legal.eyebrow')}</p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.025em] text-foreground sm:text-4xl">{translate(`${prefix}.title`)}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{translate(`${prefix}.intro`)}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3"><p className="text-sm text-muted-foreground">{translate('common.legal.lastUpdated')}</p><PrintButton label={translate('legal.print')} /></div>
          </header>

          <section className="mt-8 rounded-2xl bg-[#e9edff] p-5 sm:p-6" aria-labelledby="legal-summary-title">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-primary text-white"><ShieldCheck className="size-5" aria-hidden="true" /></span>
              <div><h2 id="legal-summary-title" className="text-base font-bold">{translate(`legal.${document}.summaryTitle`)}</h2><p className="text-sm text-muted-foreground">{translate(`legal.${document}.summaryBody`)}</p></div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {['privacy', 'clarity', 'control'].map((item) => (
                <div key={item} className="rounded-xl bg-white p-4">
                  <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold">{translate(`legal.${document}.summary.${item}.title`)}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{translate(`legal.${document}.summary.${item}.body`)}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-10 space-y-4">
            {sections[document].map((section, index) => {
              const SectionIcon = sectionIcons[section] ?? FileCheck2;
              return (
                <section id={`legal-${section}`} key={section} className="scroll-mt-24 rounded-2xl bg-[#f6f7ff] p-5 sm:p-6">
                  <div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-fixed text-on-primary-fixed"><span className="text-xs font-bold">{String(index + 1).padStart(2, '0')}</span></span><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-primary"><SectionIcon className="size-4" aria-hidden="true" /></span><h2 className="text-xl font-bold tracking-tight">{translate(`${prefix}.sections.${section}.title`)}</h2></div>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">{translate(`${prefix}.sections.${section}.body`)}</p>
                </section>
              );
            })}
          </div>
        </article>

        <aside className="hidden space-y-4 lg:block">
          <div className="sticky top-24 space-y-4">
            <nav className="rounded-2xl border border-border-soft bg-white p-5 shadow-sm" aria-label={translate('common.legal.indexTitle')}>
              <div className="flex items-center justify-between"><h2 className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{translate('common.legal.indexTitle')}</h2><ClipboardList className="size-4 text-primary" aria-hidden="true" /></div>
              <ol className="mt-4 grid gap-3 text-sm">
                {sections[document].map((section, index) => <li key={section}><a className="group flex items-start gap-2 rounded-md text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft" href={`#legal-${section}`}><span className="text-xs text-primary">{index + 1}.</span><span>{translate(`${prefix}.sections.${section}.title`)}<ArrowUpRight className="ml-1 inline size-3 opacity-0 transition-[opacity,transform] group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" /></span></a></li>)}
              </ol>
            </nav>
            <div className="rounded-2xl border border-primary/10 bg-[#e9edff] p-5"><h2 className="text-sm font-bold">{translate('common.legal.contactCardTitle')}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{translate('common.legal.contactCardBody')}</p><a className="mt-4 inline-flex rounded-lg bg-white px-3 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white" href="mailto:info@buscohuella.com">info@buscohuella.com</a></div>
          </div>
        </aside>
      </div>
      </PageContainer>
    </div>
  );
}
