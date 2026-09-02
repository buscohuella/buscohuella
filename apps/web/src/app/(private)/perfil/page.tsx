import {
  CircleUserRound,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { redirect } from 'next/navigation';

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

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ setup?: string }>;
}) {
  const [{ setup }, user, profile, { translate }] =
    await Promise.all([
      searchParams,
      getCurrentUser(),
      getProfile(),
      getServerTranslator(),
    ]);

  if (!user) {
    redirect('/login');
  }

  if (!profile) {
    throw new Error(
      translate('profile.page.loadError'),
    );
  }

  return (
    <PageContainer className="space-y-8">
      <AuthNotice
        message={
          setup === '1'
            ? translate('profile.page.completeProfile')
            : undefined
        }
        tone="info"
      />

      <header className="max-w-3xl space-y-2">
        <p className="text-sm font-semibold text-primary">
          {translate('profile.page.eyebrow')}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {translate('profile.page.title')}
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          {translate('profile.page.description')}
        </p>
      </header>

      <nav
        aria-label={translate('profile.page.sectionNavigation')}
        className="flex flex-wrap gap-2 border-b border-border pb-4"
      >
        <a
          href="#perfil-publico"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {translate('profile.page.publicTitle')}
        </a>
        <a
          href="#privacidad-contacto"
          className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {translate('profile.page.protectionTitle')}
        </a>
      </nav>

      <Card elevated id="perfil-publico" className="scroll-mt-6">
        <CardHeader>
          <span className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <CircleUserRound
              className="size-7"
              aria-hidden="true"
            />
          </span>
          <CardTitle>
            {translate('profile.page.publicTitle')}
          </CardTitle>
          <CardDescription>
            {translate(
              'profile.page.publicDescription',
            )}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProfileForm
            profile={profile}
            email={user.email}
          />
        </CardContent>
      </Card>

      <section
        id="privacidad-contacto"
        aria-labelledby="privacidad-contacto-title"
        className="scroll-mt-6 space-y-4"
      >
        <div>
          <h2
            id="privacidad-contacto-title"
            className="text-2xl font-semibold tracking-tight"
          >
            {translate('profile.page.protectionTitle')}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {translate('profile.page.protectionDescription')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <ShieldCheck
                className="mb-3 size-8 text-primary"
                aria-hidden="true"
              />
              <CardTitle>
                {translate(
                  'profile.page.privacyTitle',
                )}
              </CardTitle>
              <CardDescription>
                {translate(
                  'profile.page.privacyDescription',
                )}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <EyeOff
                className="mb-3 size-8 text-primary"
                aria-hidden="true"
              />
              <CardTitle>
                {translate(
                  'profile.page.contactTitle',
                )}
              </CardTitle>
              <CardDescription>
                {translate(
                  'profile.page.contactDescription',
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </PageContainer>
  );
}
