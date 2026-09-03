import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal/legal-page';
import { getServerTranslator } from '@/features/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { translate } = await getServerTranslator();
  return { title: translate('legal.terms.title'), description: translate('legal.terms.intro') };
}

export default function TermsPage() {
  return <LegalPage document="terms" />;
}
