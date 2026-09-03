import Image from 'next/image';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import { getServerTranslator } from '@/features/i18n/server';

export async function PublicFooter() {
  const { translate } = await getServerTranslator();

  return (
    <footer className="mt-16 border-t border-border-soft bg-surface-elevated">
      <PageContainer className="py-10 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
              <Image src="/brand/mark.png" alt="" width={36} height={36} className="size-9 object-contain" />
              <span className="text-lg font-bold tracking-tight">BuscoHuella</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{translate('common.footer.description')}</p>
          </div>

          <div>
            <h2 className="text-sm font-bold">{translate('common.footer.exploreTitle')}</h2>
            <nav className="mt-3 grid gap-2 text-sm" aria-label={translate('common.footer.exploreTitle')}>
              <Link href="/explorar-avisos" className="w-fit text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('common.navigation.reports')}</Link>
              <Link href="/mapa" className="w-fit text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('common.navigation.map')}</Link>
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-bold">{translate('common.footer.accountTitle')}</h2>
            <nav className="mt-3 grid gap-2 text-sm" aria-label={translate('common.footer.accountTitle')}>
              <Link href="/login" className="w-fit text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('common.navigation.login')}</Link>
              <Link href="/registro" className="w-fit text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">{translate('common.navigation.register')}</Link>
            </nav>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-border-soft pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>{translate('common.footer.privacy')}</p>
          <p>{translate('common.footer.copyright')}</p>
        </div>
      </PageContainer>
    </footer>
  );
}
