import { CircleUserRound, EyeOff, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentUser } from '@/features/auth/queries/get-current-user';
import { ProfileForm } from '@/features/profile/components/profile-form';
import { getProfile } from '@/features/profile/queries/get-profile';

export default async function ProfilePage() {
  const [user, profile] = await Promise.all([
    getCurrentUser(),
    getProfile(),
  ]);

  if (!user) {
    redirect('/login');
  }

  if (!profile) {
    throw new Error('No se ha podido cargar el perfil del usuario.');
  }

  return (
    <PageContainer className="space-y-6">
      <Card elevated>
        <CardHeader>
          <span className="mb-4 flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <CircleUserRound className="size-7" aria-hidden="true" />
          </span>
          <CardTitle>Mi perfil</CardTitle>
          <CardDescription>
            Gestiona tu identidad de cuenta y decide qué información deseas
            mostrar públicamente.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProfileForm profile={profile} email={user.email} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <ShieldCheck className="mb-3 size-8 text-primary" aria-hidden="true" />
            <CardTitle>Privacidad por defecto</CardTitle>
            <CardDescription>
              Tu perfil comienza siendo privado. Activarlo no publica correo,
              teléfono, dirección ni identificadores internos.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <EyeOff className="mb-3 size-8 text-primary" aria-hidden="true" />
            <CardTitle>Contacto seguro</CardTitle>
            <CardDescription>
              Los avisos relacionados con mascotas utilizarán canales
              contextuales y no dependerán de exponer tu perfil.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </PageContainer>
  );
}
