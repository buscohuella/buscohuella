import type { Metadata } from 'next';
import { CalendarDays, MapPin, PawPrint, ShieldCheck } from 'lucide-react';
import { notFound } from 'next/navigation';

import { PageContainer } from '@/components/layout/page-container';
import { getServerTranslator } from '@/features/i18n/server';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getPublicProfile } from '@/features/profile/queries/get-public-profile';

interface PublicProfilePageProps {
  params: Promise<{
    alias: string;
  }>;
}

export async function generateMetadata({
  params,
}: PublicProfilePageProps): Promise<Metadata> {
  const { alias } = await params;
  const profile = await getPublicProfile(alias);

  if (!profile) {
    return {
      title: 'Perfil no disponible | BuscoHuella',
    };
  }

  return {
    title: `${profile.publicAlias} | BuscoHuella`,
    description:
      profile.bio ||
      `Perfil público de ${profile.publicAlias} en BuscoHuella.`,
  };
}

export default async function PublicProfilePage({
  params,
}: PublicProfilePageProps) {
  const { locale, translate } = await getServerTranslator();
  const { alias } = await params;
  const profile = await getPublicProfile(alias);

  if (!profile) {
    notFound();
  }

  const memberSince = new Intl.DateTimeFormat(locale === 'ca' ? 'ca-ES' : 'es-ES', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(profile.createdAt));

  return (
    <PageContainer className="py-10 sm:py-14">
      <Card elevated className="mx-auto max-w-3xl">
        <CardHeader className="items-center text-center">
          {profile.avatarUrl ? (
            <div
              role="img"
              aria-label={translate('profile.public.avatarAlt', { alias: profile.publicAlias })}
              className="size-20 rounded-full border border-border bg-cover bg-center"
              style={{ backgroundImage: `url(${profile.avatarUrl})` }}
            />
          ) : (
            <span
              className="flex size-20 items-center justify-center rounded-full bg-primary-soft text-primary"
              aria-hidden="true"
            >
              <PawPrint className="size-10" />
            </span>
          )}

          <CardTitle className="mt-4 text-3xl">
            @{profile.publicAlias}
          </CardTitle>

          <CardDescription>
            {translate('profile.public.community')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {profile.bio ? (
            <p className="text-center text-lg leading-8 text-muted-foreground">
              {profile.bio}
            </p>
          ) : (
            <p className="text-center text-muted-foreground">
              {translate('profile.public.noBio')}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border-soft bg-surface p-4">
              <div className="flex items-center gap-3">
                <MapPin className="size-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold">{translate('profile.public.zone')}</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.municipality || translate('profile.public.unknownZone')}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border-soft bg-surface p-4">
              <div className="flex items-center gap-3">
                <CalendarDays
                  className="size-5 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold">{translate('profile.public.memberSince')}</p>
                  <p className="text-sm text-muted-foreground">
                    {memberSince}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary-soft p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground">
                {translate('profile.public.privacy')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
