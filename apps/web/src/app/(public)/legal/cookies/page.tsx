import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal/legal-page';
import { getServerTranslator } from '@/features/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { translate } = await getServerTranslator();
  return { title: translate('common.legal.cookies.title'), description: translate('common.legal.cookies.intro') };
}

export default function CookiesPage() {
  return <LegalPage document="cookies" />;
}
