import {
  Bell,
  ChevronRight,
  CircleUserRound,
  Dog,
  Home,
  Map,
  MessageCircle,
  PawPrint,
  Plus,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const navigationItems = [
  { label: 'Inicio', icon: Home, active: true },
  { label: 'Mapa', icon: Map },
  { label: 'Reportar', icon: Plus, primary: true },
  { label: 'Mensajes', icon: MessageCircle },
  { label: 'Perfil', icon: CircleUserRound },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <header className="border-b border-border-soft bg-surface-elevated">
        <div className="mx-auto flex min-h-18 w-full max-w-6xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <span
              className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary"
              aria-hidden="true"
            >
              <PawPrint className="size-6" />
            </span>

            <div>
              <p className="text-sm text-muted-foreground">Sistema visual</p>
              <h1 className="text-xl font-bold tracking-tight">BuscoHuella</h1>
            </div>
          </div>

          <Button variant="ghost" size="sm" aria-label="Ver notificaciones">
            <Bell className="size-5" />
          </Button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section aria-labelledby="welcome-title">
            <p className="mb-2 text-sm font-semibold text-primary">
              Primera validación visual
            </p>

            <h2
              id="welcome-title"
              className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Una aplicación clara, cercana y preparada para ayudar.
            </h2>

            <p className="mt-4 max-w-2xl text-muted-foreground">
              Esta pantalla nos permite comprobar colores, jerarquías, componentes y
              accesibilidad antes de construir los flujos reales.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg">
                <Plus className="size-5" />
                Reportar una mascota
              </Button>

              <Button variant="secondary" size="lg">
                Explorar el mapa
              </Button>
            </div>
          </section>

          <section className="space-y-4" aria-labelledby="search-title">
            <div>
              <h2 id="search-title" className="text-2xl font-bold tracking-tight">
                Buscar cerca de ti
              </h2>
              <p className="text-muted-foreground">
                Campos táctiles, legibles y con estados accesibles.
              </p>
            </div>

            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-subtle-foreground"
                aria-hidden="true"
              />
              <Input
                className="pl-12"
                placeholder="Buscar mascotas, reportes o zonas..."
                aria-label="Buscar mascotas, reportes o zonas"
              />
            </div>
          </section>

          <section className="space-y-4" aria-labelledby="cards-title">
            <div>
              <h2 id="cards-title" className="text-2xl font-bold tracking-tight">
                Componentes principales
              </h2>
              <p className="text-muted-foreground">
                Tarjetas reutilizables para mascotas, alertas y acciones.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card elevated>
                <CardHeader>
                  <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Dog className="size-6" aria-hidden="true" />
                  </div>

                  <CardTitle>Mis mascotas</CardTitle>
                  <CardDescription>
                    Registra a los miembros de tu familia animal para protegerlos.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="text-sm font-medium text-muted-foreground">
                    Todavía no has añadido ninguna mascota.
                  </p>
                </CardContent>

                <CardFooter>
                  <Button fullWidth>
                    Añadir mascota
                    <ChevronRight className="size-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-accent-soft text-accent-hover">
                    <Bell className="size-6" aria-hidden="true" />
                  </div>

                  <CardTitle>Alertas próximas</CardTitle>
                  <CardDescription>
                    Recibe información importante sobre casos cercanos.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="rounded-lg border border-border-soft bg-surface p-4">
                    <p className="font-semibold">Sin alertas activas</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Te avisaremos cuando haya novedades en tu zona.
                    </p>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button variant="secondary" fullWidth>
                    Configurar alertas
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </section>

          <section className="space-y-4" aria-labelledby="states-title">
            <div>
              <h2 id="states-title" className="text-2xl font-bold tracking-tight">
                Estados de los controles
              </h2>
              <p className="text-muted-foreground">
                Variantes coherentes para acciones normales, secundarias y peligrosas.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button>Acción principal</Button>
              <Button variant="secondary">Secundaria</Button>
              <Button variant="ghost">Acción discreta</Button>
              <Button variant="danger">Eliminar</Button>
              <Button disabled>Desactivado</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Campo normal" />
              <Input
                hasError
                placeholder="Campo con error"
                aria-describedby="example-error"
              />
            </div>

            <p id="example-error" className="text-sm font-medium text-danger">
              Ejemplo de mensaje de error claro y comprensible.
            </p>
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start" aria-labelledby="mobile-preview-title">
          <Card elevated className="overflow-hidden">
            <CardHeader>
              <CardTitle id="mobile-preview-title">Vista móvil conceptual</CardTitle>
              <CardDescription>
                Referencia para la futura navegación de la aplicación.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="rounded-xl border border-border-soft bg-surface p-4">
                <div className="flex min-h-64 flex-col items-center justify-center text-center">
                  <span className="mb-4 flex size-20 items-center justify-center rounded-full bg-primary-soft text-primary">
                    <PawPrint className="size-10" aria-hidden="true" />
                  </span>

                  <h3 className="text-xl font-bold">Tu familia animal</h3>
                  <p className="mt-2 max-w-60 text-sm text-muted-foreground">
                    Registra tus mascotas para tener preparada su información.
                  </p>

                  <Button className="mt-5">Añadir mascota</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <nav
        className="fixed right-0 bottom-0 left-0 z-50 border-t border-border-soft bg-surface-elevated/95 px-3 pb-3 shadow-[var(--shadow-lg)] backdrop-blur lg:hidden"
        aria-label="Navegación principal móvil"
      >
        <ul className="mx-auto grid max-w-md grid-cols-5 items-end">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.label} className="flex justify-center">
                <button
                  type="button"
                  aria-label={item.label}
                  aria-current={item.active ? 'page' : undefined}
                  className={
                    item.primary
                      ? '-mt-7 flex size-16 items-center justify-center rounded-full border-4 border-white bg-primary text-white shadow-[var(--shadow-md)]'
                      : 'flex min-h-16 min-w-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium text-muted-foreground hover:bg-surface hover:text-primary'
                  }
                >
                  <Icon className={item.primary ? 'size-7' : 'size-5'} />
                  {!item.primary && <span>{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </main>
  );
}
