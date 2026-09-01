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
    <PageContainer className="space-y-6">
      <AuthNotice
        message={
          setup === '1'
            ? translate('profile.page.completeProfile')
            : undefined
        }
        tone="info"
      />
      <Card elevated>
        <CardHeader>
          <span className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <CircleUserRound
              className="size-7"
              aria-hidden="true"
            />
          </span>
          <CardTitle>
            {translate('profile.page.title')}
          </CardTitle>
          <CardDescription>
            {translate(
              'profile.page.description',
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
    </PageContainer>
  );
}
