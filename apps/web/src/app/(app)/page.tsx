import {
  ArrowRight,
  Bell,
  Map,
  PawPrint,
  Plus,
  ScrollText,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageContainer } from '@/components/layout/page-container';

const shortcuts = [
  {
    title: 'Explorar el mapa',
    description: 'Consulta los casos y avistamientos próximos.',
    icon: Map,
  },
  {
    title: 'Ver reportes',
    description: 'Revisa pérdidas, hallazgos y avistamientos.',
    icon: ScrollText,
  },
  {
    title: 'Mis mascotas',
    description: 'Prepara la información de tu familia animal.',
    icon: PawPrint,
  },
];

export default function DashboardPage() {
  return (
    <PageContainer className="space-y-8">
      <section className="rounded-xl border border-border-soft bg-primary-soft p-6 sm:p-8">
        <p className="text-sm font-semibold text-primary">Inicio</p>
        <h2 className="mt-2 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
          Todo preparado para proteger a tu familia animal.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Esta es la estructura inicial de la aplicación. Los datos reales se
          conectarán en los siguientes Feature Packs.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg">
            <Plus className="size-5" aria-hidden="true" />
            Crear reporte
          </Button>
          <Button variant="secondary" size="lg">
            Abrir mapa
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </section>

      <section aria-labelledby="shortcuts-title">
        <div>
          <h2 id="shortcuts-title" className="text-2xl font-bold tracking-tight">
            Accesos principales
          </h2>
          <p className="mt-1 text-muted-foreground">
            Las áreas centrales del MVP de BuscoHuella.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {shortcuts.map((shortcut) => {
            const Icon = shortcut.icon;

            return (
              <Card key={shortcut.title}>
                <CardHeader>
                  <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <CardTitle>{shortcut.title}</CardTitle>
                  <CardDescription>{shortcut.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="activity-title">
        <Card elevated>
          <CardHeader>
            <span className="mb-3 flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent-hover">
              <Bell className="size-6" aria-hidden="true" />
            </span>
            <CardTitle id="activity-title">Actividad reciente</CardTitle>
            <CardDescription>
              Aquí aparecerán alertas, novedades y actualizaciones de tus casos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border-soft bg-surface p-5 text-center">
              <p className="font-semibold">Todavía no hay actividad</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Los datos reales llegarán cuando conectemos autenticación y Supabase.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </PageContainer>
  );
}
