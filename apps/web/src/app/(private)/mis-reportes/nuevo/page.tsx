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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
        />

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
    </PageContainer>
  );
}

function AvailableType({
  href,
  icon,
  title,
  description,
  action,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
}) {
  return (
    <Card
      elevated
      className="h-full transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-md)]"
    >
      <CardHeader>
        <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-danger/10 text-danger [&>svg]:size-6">
          {icon}
        </span>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href={href}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
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
    <Card className="h-full opacity-80">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <span className="flex size-12 items-center justify-center rounded-xl bg-surface text-muted-foreground [&>svg]:size-6">
            {icon}
          </span>
          <span className="rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            {status}
          </span>
        </div>
        <CardTitle className="pt-2">
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
