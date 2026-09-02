import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { getServerTranslator } from '@/features/i18n/server';
import { PublicReportsPage } from '../reportes/page';

export default async function ExploreNoticesPage() {
  const { translate } = await getServerTranslator();

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs
          label={translate('noticesHub.breadcrumbs.label')}
          items={[
            { href: '/', label: translate('noticesHub.breadcrumbs.home') },
            {
              href: '/mis-avisos',
              label: translate('noticesHub.breadcrumbs.section'),
            },
            { label: translate('noticesHub.breadcrumbs.explore') },
          ]}
        />
      </div>
      <PublicReportsPage />
    </>
  );
}
