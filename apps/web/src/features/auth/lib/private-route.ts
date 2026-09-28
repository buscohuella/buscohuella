import { getSafeInternalPath } from './safe-redirect';

const PRIVATE_ROUTE_PREFIXES = [
  '/inicio',
  '/avistamientos',
  '/mis-avisos',
  '/mis-avistamientos',
  '/mis-mascotas',
  '/mis-reportes',
  '/notificaciones',
  '/perfil',
] as const;

function matchesRoutePrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isPrivatePathname(pathname: string) {
  if (
    PRIVATE_ROUTE_PREFIXES.some((prefix) =>
      matchesRoutePrefix(pathname, prefix),
    )
  ) {
    return true;
  }

  return /^\/reportes\/[^/]+\/avistamiento(?:\/|$)/.test(pathname);
}

export function getPrivateRouteLoginRedirect(
  requestUrl: URL,
  isAuthenticated: boolean,
) {
  if (isAuthenticated || !isPrivatePathname(requestUrl.pathname)) {
    return null;
  }

  const requestedPath = getSafeInternalPath(
    `${requestUrl.pathname}${requestUrl.search}`,
  );

  const loginUrl = new URL('/login', requestUrl.origin);

  if (requestedPath) {
    loginUrl.searchParams.set('next', requestedPath);
  }

  return loginUrl;
}
