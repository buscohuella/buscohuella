import {
  Bell,
  Map,
  PawPrint,
  Plus,
  ScrollText,
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
import { AuthNotice } from '@/features/auth/components/auth-notice';

interface PrivateHomePageProps {
  searchParams: Promise<{
    login?: string;
    account_confirmed?: string;
  }>;
}

const shortcuts = [
  {
    title: 'Explorar el mapa',
    description:
      'Consulta los casos y avistamientos próximos.',
    icon: Map,
  },
  {
    title: 'Mis avisos',
    description:
      'Gestiona pérdidas, hallazgos y avistamientos.',
    icon: ScrollText,
  },
  {
    title: 'Mis mascotas',
    description:
      'Prepara la información de tu familia animal.',
    icon: PawPrint,
  },
];

export default async function PrivateHomePage({
  searchParams,
}: PrivateHomePageProps) {
  const params = await searchParams;

  const notice =
    params.account_confirmed === '1'
      ? 'Cuenta confirmada correctamente. Bienvenido a BuscoHuella.'
      : params.login === 'success'
        ? 'Sesión iniciada correctamente.'
        : undefined;

  return (
    <PageContainer className="space-y-8">
      <AuthNotice message={notice} />

      <section className="rounded-xl border border-border-soft bg-primary-soft p-6 sm:p-8">
        <p className="text-sm font-semibold text-primary">
          Área personal
        </p>

        <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Todo preparado para proteger a tu familia animal.
        </h2>

        <p className="mt-4 max-w-2xl text-muted-foreground">
          Desde aquí gestionarás mascotas, avisos, alertas y datos personales.
        </p>

        <div className="mt-6">
          <Link
            href="/mis-reportes/nuevo"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          >
            <Plus
              className="size-5"
              aria-hidden="true"
            />
            Crear aviso
          </Link>
        </div>
      </section>

      <section aria-labelledby="private-shortcuts-title">
        <h2
          id="private-shortcuts-title"
          className="text-2xl font-bold tracking-tight"
        >
          Accesos principales
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;

            return (
              <Card key={shortcut.title}>
                <CardHeader>
                  <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon
                      className="size-6"
                      aria-hidden="true"
                    />
                  </span>
                  <CardTitle>
                    {shortcut.title}
                  </CardTitle>
                  <CardDescription>
                    {shortcut.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <Card elevated>
        <CardHeader>
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent-hover">
            <Bell
              className="size-6"
              aria-hidden="true"
            />
          </span>
          <CardTitle>
            Actividad reciente
          </CardTitle>
          <CardDescription>
            Aquí aparecerán alertas y actualizaciones de tus casos.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg border border-border-soft bg-surface p-5 text-center">
            <p className="font-semibold">
              Todavía no hay actividad
            </p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
