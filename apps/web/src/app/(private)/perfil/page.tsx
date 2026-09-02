import { EyeOff, ShieldCheck, UserRound } from 'lucide-react';
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
  { href: '/perfil/datos', key: 'data', icon: UserRound },
  { href: '/perfil/privacidad', key: 'privacy', icon: ShieldCheck },
  { href: '/perfil/contacto', key: 'contact', icon: EyeOff },
] as const;

export default async function ProfileHubPage() {
  const { translate } = await getServerTranslator();

  return (
    <PageContainer className="space-y-7">
      <header className="max-w-3xl space-y-2">
        <p className="text-sm font-semibold text-primary">
          {translate('profile.page.eyebrow')}
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {translate('profile.page.title')}
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          {translate('profile.page.description')}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {sections.map(({ href, key, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          >
            <Card className="h-full transition-transform group-hover:-translate-y-0.5">
              <CardHeader>
                <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <CardTitle>
                  {translate(`profile.hub.sections.${key}.title`)}
                </CardTitle>
                <CardDescription>
                  {translate(`profile.hub.sections.${key}.description`)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-semibold text-primary">
                  {translate(`profile.hub.sections.${key}.action`)}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}
