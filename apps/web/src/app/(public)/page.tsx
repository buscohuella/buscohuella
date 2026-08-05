import {
  ArrowRight,
  Map,
  PawPrint,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getCurrentUser } from '@/features/auth/queries/get-current-user';

const actions = [
  {
    title: 'Explorar el mapa',
    description:
      'Consulta casos y avistamientos cercanos sin iniciar sesión.',
    href: '/mapa',
    icon: Map,
  },
  {
    title: 'Consultar reportes',
    description:
      'Busca pérdidas, hallazgos y avisos públicos.',
    href: '/reportes',
    icon: Search,
  },
];

export default async function PublicHomePage() {
  const user = await getCurrentUser();

  if (user) {
    redirect('/inicio');
  }

  return (
    <PageContainer className="space-y-10 py-10 sm:py-14">
      <section className="rounded-xl border border-border-soft bg-primary-soft p-6 sm:p-10">
        <span className="flex size-14 items-center justify-center rounded-xl bg-surface-elevated text-primary shadow-[var(--shadow-sm)]">
          <PawPrint
            className="size-7"
            aria-hidden="true"
          />
        </span>
        <p className="mt-6 text-sm font-semibold text-primary">
          Encuentra. Protege. Conecta.
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Ayuda a reunir mascotas perdidas con sus
          familias.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
          Explora información pública sin cuenta. Para
          gestionar mascotas, alertas y reportes personales
          podrás registrarte gratuitamente.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/mapa"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-primary px-6 text-lg font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          >
            Explorar sin cuenta
            <ArrowRight
              className="size-5"
              aria-hidden="true"
            />
          </Link>
          <Link
            href="/registro"
            className="inline-flex min-h-14 items-center justify-center rounded-full border border-border bg-surface-elevated px-6 text-lg font-semibold text-foreground hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          >
            Crear una cuenta
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight">
          Puedes ayudar sin registrarte
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                href={action.href}
                className="rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
              >
                <Card className="h-full">
                  <CardHeader>
                    <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                      <Icon
                        className="size-6"
                        aria-hidden="true"
                      />
                    </span>
                    <CardTitle>
                      {action.title}
                    </CardTitle>
                    <CardDescription>
                      {action.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </PageContainer>
  );
}
