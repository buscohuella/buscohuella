import {
  Eye,
  MapPinned,
  Search,
  Send,
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

const sections = [
  {
    href: '/reportes',
    key: 'explore',
    icon: Search,
  },
  {
    href: '/mis-reportes',
    key: 'mine',
    icon: MapPinned,
  },
  {
    href: '/avistamientos',
    key: 'received',
    icon: Eye,
  },
  {
    href: '/mis-avistamientos',
    key: 'reported',
    icon: Send,
  },
] as const;

export default async function NoticesHubPage() {
  const { translate } =
    await getServerTranslator();

  return (
    <PageContainer className="space-y-7">
      <header>
        <p className="text-sm font-semibold text-primary">
          {translate(
            'noticesHub.eyebrow',
          )}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {translate(
            'noticesHub.title',
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {translate(
            'noticesHub.description',
          )}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {sections.map(
          ({ href, key, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
            >
              <Card className="h-full transition-transform group-hover:-translate-y-0.5">
                <CardHeader>
                  <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <Icon
                      className="size-6"
                      aria-hidden="true"
                    />
                  </span>
                  <CardTitle>
                    {translate(
                      `noticesHub.sections.${key}.title`,
                    )}
                  </CardTitle>
                  <CardDescription>
                    {translate(
                      `noticesHub.sections.${key}.description`,
                    )}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <span className="text-sm font-semibold text-primary">
                    {translate(
                      `noticesHub.sections.${key}.action`,
                    )}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ),
        )}
      </div>

      <aside className="rounded-xl border border-border bg-surface p-4">
        <p className="font-semibold">
          {translate(
            'noticesHub.nearby.title',
          )}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {translate(
            'noticesHub.nearby.description',
          )}
        </p>
      </aside>
    </PageContainer>
  );
}
