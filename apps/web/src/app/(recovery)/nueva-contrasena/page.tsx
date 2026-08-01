import type { Metadata } from 'next';

import { AuthCard } from '@/components/auth/auth-card';
import { AuthShell } from '@/components/auth/auth-shell';
import { UpdatePasswordForm } from '@/features/auth/components/update-password-form';

export const metadata: Metadata = {
  title: 'Nueva contraseña | BuscoHuella',
  description: 'Crea una nueva contraseña para tu cuenta.',
};

export default function NewPasswordPage() {
  return (
    <AuthShell
      title="Crea una nueva contraseña"
      description="Elige una contraseña nueva para recuperar el acceso."
    >
      <AuthCard>
        <UpdatePasswordForm />
      </AuthCard>
    </AuthShell>
  );
}
