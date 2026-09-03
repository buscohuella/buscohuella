import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageContainer } from '@/components/layout/page-container';
import { getServerTranslator } from '@/features/i18n/server';

type LegalDocument = 'privacy' | 'terms' | 'cookies';

const sections = {
  privacy: ['scope', 'data', 'purposes', 'sharing', 'rights', 'contact'],
  terms: ['scope', 'service', 'accounts', 'content', 'responsibilities', 'contact'],
  cookies: ['scope', 'necessary', 'preferences', 'thirdParties', 'control', 'contact'],
} as const;

export async function LegalPage({ document }: { document: LegalDocument }) {
  const { translate } = await getServerTranslator();
  const prefix = `legal.${document}`;

  return (
    <PageContainer className="py-8 sm:py-12">
      <Breadcrumbs
        label={translate('common.navigation.publicLabel')}
        items={[
          { href: '/', label: translate('common.navigation.home') },
          { label: translate(`${prefix}.title`) },
        ]}
      />
      <article className="mx-auto mt-8 max-w-4xl rounded-3xl border border-border-soft bg-surface-elevated p-6 shadow-sm sm:p-10">
        <header className="border-b border-border-soft pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
            {translate('legal.eyebrow')}
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {translate(`${prefix}.title`)}
          </h1>
          <p className="mt-4 text-muted-foreground">
            {translate(`${prefix}.intro`)}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {translate('legal.lastUpdated')}
          </p>
        </header>
        <div className="prose prose-slate mt-8 max-w-none dark:prose-invert">
          {sections[document].map((section, index) => (
            <section key={section} className={index === 0 ? '' : 'mt-8'}>
              <h2>{translate(`${prefix}.sections.${section}.title`)}</h2>
              <p>{translate(`${prefix}.sections.${section}.body`)}</p>
            </section>
          ))}
        </div>
      </article>
    </PageContainer>
  );
}
