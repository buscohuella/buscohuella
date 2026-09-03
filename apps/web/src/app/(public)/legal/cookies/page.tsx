import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal/legal-page';
import { getServerTranslator } from '@/features/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { translate } = await getServerTranslator();
  return { title: translate('legal.cookies.title'), description: translate('legal.cookies.intro') };
}

export default function CookiesPage() {
  return <LegalPage document="cookies" />;
}
