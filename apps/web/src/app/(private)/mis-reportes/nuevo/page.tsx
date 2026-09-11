import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Eye,
  Search,
  Siren,
  TriangleAlert,
} from 'lucide-react';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getServerTranslator } from '@/features/i18n/server';

export default async function NewReportPage() {
  const { translate } =
    await getServerTranslator();

  return (
    <PageContainer className="space-y-6">
      <Link
        href="/mis-reportes"
        className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
      >
        <ArrowLeft
          className="size-4"
          aria-hidden="true"
        />
        {translate(
          'reports.create.back',
        )}
      </Link>

      <header>
        <p className="text-sm font-semibold text-primary">
          {translate(
            'reports.create.eyebrow',
          )}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate(
            'reports.create.title',
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate(
            'reports.create.description',
          )}
        </p>
      </header>

      <section
        aria-labelledby="available-report-types"
        className="space-y-3"
      >
        <h2
          id="available-report-types"
          className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground"
        >
          {translate('reports.create.availableTitle')}
        </h2>
        <AvailableType
          href="/mis-reportes/nuevo/perdida"
          icon={<TriangleAlert />}
          title={translate(
            'reports.create.lostTitle',
          )}
          description={translate(
            'reports.create.lostDescription',
          )}
          action={translate(
            'reports.create.lostAction',
          )}
          flow={translate(
            'reports.create.lostFlow',
          )}
        />
      </section>

      <section
        aria-labelledby="upcoming-report-types"
        className="space-y-3"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="upcoming-report-types"
            className="text-sm font-semibold uppercase tracking-[0.12em] text-muted-foreground"
          >
            {translate('reports.create.upcomingTitle')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {translate('reports.create.upcomingDescription')}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <UnavailableType
            icon={<Search />}
            title={translate(
              'reports.create.foundTitle',
            )}
            description={translate(
              'reports.create.foundDescription',
            )}
            status={translate(
              'reports.create.comingSoon',
            )}
          />

          <UnavailableType
            icon={<Eye />}
            title={translate(
              'reports.create.sightingTitle',
            )}
            description={translate(
              'reports.create.sightingDescription',
            )}
            status={translate(
              'reports.create.comingSoon',
            )}
          />

          <UnavailableType
            icon={<AlertTriangle />}
            title={translate(
              'reports.create.incidentTitle',
            )}
            description={translate(
              'reports.create.incidentDescription',
            )}
            status={translate(
              'reports.create.comingSoon',
            )}
          />

          <UnavailableType
            icon={<Siren />}
            title={translate(
              'reports.create.sosTitle',
            )}
            description={translate(
              'reports.create.sosDescription',
            )}
            status={translate(
              'reports.create.comingSoon',
            )}
          />
        </div>
      </section>
    </PageContainer>
  );
}

function AvailableType({
  href,
  icon,
  title,
  description,
  action,
  flow,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  flow: string;
}) {
  return (
    <Card
      elevated
      className="h-full border-primary/35 bg-primary-soft/35 shadow-[var(--shadow-md)] transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-[var(--shadow-lg)]"
    >
      <CardHeader className="p-6 sm:p-8">
        <span className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-danger-soft text-danger [&>svg]:size-7">
          {icon}
        </span>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
        <p className="pt-3 text-sm font-medium text-primary">
          {flow}
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
        <Link
          href={href}
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-[var(--shadow-sm)] hover:bg-primary-hover hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
        >
          {action}
          <ArrowRight
            className="size-5"
            aria-hidden="true"
          />
        </Link>
      </CardContent>
    </Card>
  );
}

function UnavailableType({
  icon,
  title,
  description,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
}) {
  return (
    <Card
      className="h-full border-dashed bg-surface/70"
      aria-disabled="true"
    >
      <CardHeader className="p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-surface text-muted-foreground [&>svg]:size-5">
            {icon}
          </span>
          <span className="rounded-full border border-border-soft bg-surface px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {status}
          </span>
        </div>
        <CardTitle className="pt-2 text-base">
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
