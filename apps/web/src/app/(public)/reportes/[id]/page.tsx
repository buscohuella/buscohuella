import type { Metadata } from 'next';
import {
  CalendarClock,
  CircleCheckBig,
  Eye,
  Mail,
  MapPin,
  MessageCircleMore,
  Palette,
  PawPrint,
  Phone,
  Ruler,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getServerTranslator } from '@/features/i18n/server';
import { getCurrentUser } from '@/features/auth/queries/get-current-user';
import { PublicReportGallery } from '@/features/reports/components/public-report-gallery';
import { PublicReportShareButton } from '@/features/reports/components/public-report-share-button';
import { getPublicReport } from '@/features/reports/lib/public-report';
import { getLocalizedPublicReportTitle } from '@/features/reports/lib/public-report-title';

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  'https://buscohuella.es';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    avistamiento?: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { translate } =
    await getServerTranslator();

  try {
    const report =
      await getPublicReport(id);

    if (!report) {
      return {
        title: translate(
          'publicReport.metadata.notFound',
        ),
        robots: {
          index: false,
          follow: false,
        },
      };
    }

    const description =
      report.description
        .replace(/\s+/g, ' ')
        .slice(0, 155);
    const primaryPhoto =
      report.photos.find(
        (photo) => photo.isPrimary,
      ) ?? report.photos[0];

    return {
      title: `${report.title} | BuscoHuella`,
      description,
      alternates: {
        canonical:
          `${APP_URL}/reportes/${id}`,
      },
      openGraph: {
        type: 'article',
        title: report.title,
        description,
        url: `${APP_URL}/reportes/${id}`,
        siteName: 'BuscoHuella',
        publishedTime:
          report.publishedAt,
        modifiedTime:
          report.updatedAt,
        images: primaryPhoto
          ? [
              {
                url:
                  primaryPhoto.signedUrl,
                alt:
                  primaryPhoto.altText ??
                  report.title,
              },
            ]
          : undefined,
      },
      twitter: {
        card: primaryPhoto
          ? 'summary_large_image'
          : 'summary',
        title: report.title,
        description,
        images: primaryPhoto
          ? [primaryPhoto.signedUrl]
          : undefined,
      },
    };
  } catch {
    return {
      title: translate(
        'publicReport.metadata.notFound',
      ),
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function PublicReportPage({
  params,
  searchParams,
}: PageProps) {
  const [
    { id },
    query,
    { locale, translate },
    user,
  ] = await Promise.all([
    params,
    searchParams,
    getServerTranslator(),
    getCurrentUser(),
  ]);
  const report =
    await getPublicReport(id);

  if (!report) {
    notFound();
  }

  const formatter =
    new Intl.DateTimeFormat(
      locale === 'ca'
        ? 'ca-ES'
        : 'es-ES',
      {
        dateStyle: 'long',
        timeStyle: 'short',
      },
    );

  const petTitle =
    report.petName ??
    translate(
      'publicReport.animalFallback',
    );

  const displayTitle =
    getLocalizedPublicReportTitle({
      rawTitle: report.title,
      reportType: report.reportType,
      petName: report.petName,
      translate,
    });

  return (
    <PageContainer className="space-y-6 py-6 sm:py-10">
      <Link
        href="/reportes"
        className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary-soft"
      >
        {translate(
          'publicReport.back',
        )}
      </Link>

      {query.avistamiento === 'creado' ? (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary-soft/40 p-4"
        >
          <CircleCheckBig
            className="mt-0.5 size-5 shrink-0 text-primary"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold text-foreground">
              {translate(
                'publicReport.sighting.successTitle',
              )}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {translate(
                'publicReport.sighting.successDescription',
              )}
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <main className="space-y-6">
          <PublicReportGallery
            photos={report.photos}
            fallbackAlt={translate(
              'publicReport.galleryAlt',
              { name: petTitle },
            )}
          />

          <header>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
                {translate(
                  `publicReport.type.${report.reportType}`,
                )}
              </span>
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                {translate(
                  'publicReport.active',
                )}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {displayTitle}
            </h1>
            <p className="mt-3 whitespace-pre-wrap text-lg leading-8 text-muted-foreground">
              {report.description}
            </p>
          </header>

          <Card>
            <CardHeader>
              <CardTitle>
                {translate(
                  'publicReport.details.title',
                )}
              </CardTitle>
              <CardDescription>
                {translate(
                  'publicReport.details.description',
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-5 sm:grid-cols-2">
                <Detail
                  icon={<PawPrint />}
                  label={translate(
                    'publicReport.details.name',
                  )}
                  value={petTitle}
                />
                <Detail
                  icon={<MapPin />}
                  label={translate(
                    'publicReport.details.zone',
                  )}
                  value={
                    report.municipalityName ??
                    translate(
                      'publicReport.details.unknown',
                    )
                  }
                />
                <Detail
                  icon={<CalendarClock />}
                  label={translate(
                    'publicReport.details.when',
                  )}
                  value={
                    report.incidentAt
                      ? formatter.format(
                          new Date(
                            report.incidentAt,
                          ),
                        )
                      : translate(
                          'publicReport.details.approximateTime',
                        )
                  }
                />
                {report.petBreed ? (
                  <Detail
                    icon={<PawPrint />}
                    label={translate(
                      'publicReport.details.breed',
                    )}
                    value={report.petBreed}
                  />
                ) : null}
                {report.petSize ? (
                  <Detail
                    icon={<Ruler />}
                    label={translate(
                      'publicReport.details.size',
                    )}
                    value={translate(
                      `publicReport.petSize.${report.petSize}`,
                    )}
                  />
                ) : null}
                {report.petPrimaryColor ? (
                  <Detail
                    icon={<Palette />}
                    label={translate(
                      'publicReport.details.color',
                    )}
                    value={
                      report.petPrimaryColor
                    }
                  />
                ) : null}
              </dl>
            </CardContent>
          </Card>

          <div className="flex items-start gap-3 rounded-xl border border-primary/25 bg-primary-soft/30 p-4">
            <ShieldCheck
              className="mt-0.5 size-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold">
                {translate(
                  'publicReport.privacy.title',
                )}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {translate(
                  'publicReport.privacy.description',
                )}
              </p>
            </div>
          </div>
        </main>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Card elevated>
            <CardHeader>
              <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
                <Eye
                  className="size-6"
                  aria-hidden="true"
                />
              </span>
              <CardTitle>
                {translate(
                  'publicReport.sighting.title',
                )}
              </CardTitle>
              <CardDescription>
                {translate(
                  'publicReport.sighting.description',
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                href={
                  user
                    ? `/reportes/${id}/avistamiento`
                    : `/login?next=${encodeURIComponent(
                        `/reportes/${id}/avistamiento`,
                      )}`
                }
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-danger px-5 font-semibold text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
              >
                <MessageCircleMore
                  className="size-5"
                  aria-hidden="true"
                />
                {translate(
                  'publicReport.sighting.button',
                )}
              </Link>

              <PublicReportShareButton
                title={displayTitle}
              />
            </CardContent>
          </Card>

          <ContactCard
            phone={report.publicPhone}
            email={report.publicEmail}
            translate={translate}
          />
        </aside>
      </div>
    </PageContainer>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary [&>svg]:size-5">
        {icon}
      </span>
      <div>
        <dt className="text-sm font-semibold">
          {label}
        </dt>
        <dd className="mt-1 text-sm text-muted-foreground">
          {value}
        </dd>
      </div>
    </div>
  );
}

function ContactCard({
  phone,
  email,
  translate,
}: {
  phone: string | null;
  email: string | null;
  translate: (
    key: string,
    values?: Record<
      string,
      string | number | boolean
    >,
  ) => string;
}) {
  if (!phone && !email) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {translate(
              'publicReport.contact.platformTitle',
            )}
          </CardTitle>
          <CardDescription>
            {translate(
              'publicReport.contact.platformDescription',
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {translate(
            'publicReport.contact.title',
          )}
        </CardTitle>
        <CardDescription>
          {translate(
            'publicReport.contact.description',
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="flex min-h-11 items-center gap-3 rounded-xl border border-border px-4 font-semibold hover:bg-surface-elevated"
          >
            <Phone
              className="size-5 text-primary"
              aria-hidden="true"
            />
            {phone}
          </a>
        ) : null}
        {email ? (
          <a
            href={`mailto:${email}`}
            className="flex min-h-11 items-center gap-3 rounded-xl border border-border px-4 font-semibold hover:bg-surface-elevated"
          >
            <Mail
              className="size-5 text-primary"
              aria-hidden="true"
            />
            {email}
          </a>
        ) : null}
      </CardContent>
    </Card>
  );
}
