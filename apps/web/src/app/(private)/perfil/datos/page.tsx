import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageContainer } from '@/components/layout/page-container';
import { AuthNotice } from '@/features/auth/components/auth-notice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentUser } from '@/features/auth/queries/get-current-user';
import { getServerTranslator } from '@/features/i18n/server';
import { ProfileForm } from '@/features/profile/components/profile-form';
import { getProfile } from '@/features/profile/queries/get-profile';

export default async function ProfileDataPage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const [{ setup }, user, profile, { translate }] = await Promise.all([
    searchParams,
    getCurrentUser(),
    getProfile(),
    getServerTranslator(),
  ]);

  if (!user) redirect('/login');
  if (!profile) throw new Error(translate('profile.page.loadError'));

  return (
    <>
      <PageContainer className="pb-0">
        <Breadcrumbs
          label={translate('profile.page.breadcrumbLabel')}
          items={[
            { href: '/inicio', label: translate('profile.page.home') },
            { href: '/perfil', label: translate('profile.page.title') },
            { label: translate('profile.hub.sections.data.title') },
          ]}
        />
      </PageContainer>
      <PageContainer className="space-y-6 pt-2">
        <Link href="/perfil" className="inline-flex min-h-10 items-center rounded-sm font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft">
          <span aria-hidden="true">←</span>
          <span className="ml-2">{translate('profile.page.back')}</span>
        </Link>
        <AuthNotice
          message={setup === '1' ? translate('profile.page.completeProfile') : undefined}
          tone="info"
        />
        <header className="max-w-3xl space-y-2">
          <p className="text-sm font-semibold text-primary">{translate('profile.page.eyebrow')}</p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {translate('profile.hub.sections.data.title')}
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            {translate('profile.hub.sections.data.description')}
          </p>
        </header>
        <Card elevated>
          <CardHeader>
            <span className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <CircleUserRound className="size-7" aria-hidden="true" />
            </span>
            <CardTitle>{translate('profile.page.publicTitle')}</CardTitle>
            <CardDescription>{translate('profile.page.publicDescription')}</CardDescription>
          </CardHeader>
          <CardContent><ProfileForm profile={profile} email={user.email} /></CardContent>
        </Card>
      </PageContainer>
    </>
  );
}
