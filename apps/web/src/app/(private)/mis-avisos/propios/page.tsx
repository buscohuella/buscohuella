import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { getServerTranslator } from '@/features/i18n/server';
import { MyReportsPage } from '../../mis-reportes/page';

export default async function OwnNoticesPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { translate } = await getServerTranslator();
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Breadcrumbs
          label={translate('noticesHub.breadcrumbs.label')}
          items={[
            { href: '/', label: translate('noticesHub.breadcrumbs.home') },
            { href: '/mis-avisos', label: translate('noticesHub.breadcrumbs.private') },
            { label: translate('noticesHub.breadcrumbs.own') },
          ]}
        />
      </div>
      <MyReportsPage searchParams={searchParams} />
    </>
  );
}
