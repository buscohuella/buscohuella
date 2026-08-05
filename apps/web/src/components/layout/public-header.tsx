import {
  CircleUserRound,
  Map,
  PawPrint,
  ScrollText,
} from 'lucide-react';
import Link from 'next/link';

import { ThemeToggle } from '@/components/ui/theme-toggle';
import type { AuthUser } from '@/features/auth/types/auth-user';

export function PublicHeader({
  user,
}: {
  user: AuthUser | null;
}) {
  const linkClass =
    'flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-muted-foreground hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft';

  return (
    <header className="sticky top-0 z-40 border-b border-border-soft bg-surface-elevated/95 backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
          aria-label="BuscoHuella, inicio público"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary">
            <PawPrint
              className="size-5"
              aria-hidden="true"
            />
          </span>
          <span className="hidden text-lg font-bold sm:inline">
            BuscoHuella
          </span>
        </Link>

        <nav
          className="hidden items-center md:flex"
          aria-label="Navegación pública"
        >
          <Link href="/mapa" className={linkClass}>
            <Map className="size-4" aria-hidden="true" />
            Mapa
          </Link>
          <Link href="/reportes" className={linkClass}>
            <ScrollText
              className="size-4"
              aria-hidden="true"
            />
            Reportes
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />

          {user ? (
            <Link
              href="/perfil"
              className="flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface-elevated px-4 text-sm font-semibold hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
              aria-label={`Abrir el perfil de ${user.fullName}`}
              title="Mi perfil"
            >
              <CircleUserRound
                className="size-4"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">
                {user.fullName}
              </span>
              <span className="sm:hidden">
                Mi perfil
              </span>
            </Link>
          ) : (
            <>
              <Link href="/login" className={linkClass}>
                Entrar
              </Link>
              <Link
                href="/registro"
                className="flex min-h-11 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-focus-soft"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>

      <nav className="grid grid-cols-2 border-t border-border-soft px-3 md:hidden">
        <Link href="/mapa" className={linkClass}>
          <Map className="size-4" aria-hidden="true" />
          Mapa
        </Link>
        <Link href="/reportes" className={linkClass}>
          <ScrollText
            className="size-4"
            aria-hidden="true"
          />
          Reportes
        </Link>
      </nav>
    </header>
  );
}
