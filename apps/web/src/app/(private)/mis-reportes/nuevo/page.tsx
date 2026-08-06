import {
  ArrowLeft,
  ArrowRight,
  Search,
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

      <div className="grid gap-4 md:grid-cols-2">
        <ReportTypeCard
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
          comingNext={translate(
            'reports.create.comingNext',
          )}
        />

        <ReportTypeCard
          icon={<Search />}
          title={translate(
            'reports.create.foundTitle',
          )}
          description={translate(
            'reports.create.foundDescription',
          )}
          action={translate(
            'reports.create.foundAction',
          )}
          comingNext={translate(
            'reports.create.comingNext',
          )}
        />
      </div>
    </PageContainer>
  );
}

function ReportTypeCard({
  icon,
  title,
  description,
  action,
  comingNext,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  comingNext: string;
}) {
  return (
    <Card elevated className="h-full">
      <CardHeader>
        <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary [&>svg]:size-6">
          {icon}
        </span>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <button
          type="button"
          disabled
          aria-describedby={`${title.replaceAll(' ', '-')}-coming-next`}
          className="inline-flex min-h-12 w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 font-semibold text-muted-foreground opacity-75"
        >
          {action}
          <ArrowRight
            className="size-5"
            aria-hidden="true"
          />
        </button>
        <p
          id={`${title.replaceAll(' ', '-')}-coming-next`}
          className="mt-3 text-sm text-muted-foreground"
        >
          {comingNext}
        </p>
      </CardContent>
    </Card>
  );
}
