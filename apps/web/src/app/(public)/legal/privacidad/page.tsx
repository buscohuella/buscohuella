import type { Metadata } from 'next';

import { LegalPage } from '@/components/legal/legal-page';
import { getServerTranslator } from '@/features/i18n/server';

export async function generateMetadata(): Promise<Metadata> {
  const { translate } = await getServerTranslator();
  return { title: translate('legal.privacy.title'), description: translate('legal.privacy.intro') };
}

export default function PrivacyPage() {
  return <LegalPage document="privacy" />;
}
