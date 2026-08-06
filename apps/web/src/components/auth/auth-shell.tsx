import {
  PawPrint,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSelector } from '@/features/i18n/language-selector';

export interface AuthShellProps {
  children: ReactNode;
  title: string;
  description: string;
}

export function AuthShell({
  children,
  title,
  description,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen bg-background lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(420px,560px)]">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 sm:right-6 sm:top-6">
        <LanguageSelector />
        <ThemeToggle />
      </div>

      <section className="hidden bg-primary-soft p-10 lg:flex lg:flex-col lg:justify-between">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          aria-label="BuscoHuella, volver al inicio"
        >
          <span
            className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <PawPrint className="size-7" />
          </span>
          <span className="text-2xl font-bold tracking-tight">
            BuscoHuella
          </span>
        </Link>

        <div className="max-w-xl">
          <span className="mb-6 flex size-14 items-center justify-center rounded-xl bg-surface-elevated text-primary shadow-[var(--shadow-sm)]">
            <ShieldCheck
              className="size-7"
              aria-hidden="true"
            />
          </span>

          <p className="text-sm font-semibold text-primary">
            Encuentra. Protege. Conecta.
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Una cuenta para cuidar mejor de tu familia
            animal.
          </h2>

          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Gestiona tus mascotas, crea reportes y
            participa en búsquedas desde una experiencia
            segura y accesible.
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Proyecto piloto en Sabadell · MVP en desarrollo
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-4 py-20 sm:px-6 lg:px-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft lg:hidden"
            aria-label="BuscoHuella, volver al inicio"
          >
            <span
              className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary"
              aria-hidden="true"
            >
              <PawPrint className="size-6" />
            </span>
            <span className="text-xl font-bold tracking-tight">
              BuscoHuella
            </span>
          </Link>

          <div>
            <p className="text-sm font-semibold text-primary">
              Acceso seguro
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              {title}
            </h1>
            <p className="mt-3 text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="mt-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
