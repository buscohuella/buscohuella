import type { Metadata } from 'next';

import { AuthCard } from '@/components/auth/auth-card';
import { AuthShell } from '@/components/auth/auth-shell';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata: Metadata = {
  title: 'Crear cuenta | BuscoHuella',
  description: 'Crea una cuenta en BuscoHuella.',
};

export default function RegisterPage() {
  return (
    <AuthShell
      title="Crea tu cuenta"
      description="Registra tus mascotas y participa en búsquedas de forma segura."
    >
      <AuthCard>
        <RegisterForm />
      </AuthCard>
    </AuthShell>
  );
}
