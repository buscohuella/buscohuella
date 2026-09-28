import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

function transpile(relativePath) {
  return ts.transpileModule(
    readFileSync(new URL(relativePath, import.meta.url), 'utf8'),
    {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
}

function toDataUrl(source) {
  return `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
}

const safeRedirectUrl = toDataUrl(
  transpile('../src/features/auth/lib/safe-redirect.ts'),
);
const privateRouteSource = transpile(
  '../src/features/auth/lib/private-route.ts',
).replace("'./safe-redirect'", `'${safeRedirectUrl}'`);

const {
  getPostLoginRedirectPath,
  getSafeInternalPath,
} = await import(safeRedirectUrl);
const {
  getPrivateRouteLoginRedirect,
  isPrivatePathname,
} = await import(toDataUrl(privateRouteSource));

const failClosedSafeRedirectUrl = toDataUrl(
  'export function getSafeInternalPath() { return null; }',
);
const failClosedPrivateRouteSource = transpile(
  '../src/features/auth/lib/private-route.ts',
).replace("'./safe-redirect'", `'${failClosedSafeRedirectUrl}'`);
const {
  getPrivateRouteLoginRedirect: getFailClosedPrivateRouteLoginRedirect,
} = await import(toDataUrl(failClosedPrivateRouteSource));

test('redirige una ruta privada al login conservando el destino', () => {
  const redirectUrl = getPrivateRouteLoginRedirect(
    new URL('https://buscohuella.es/mis-reportes/nuevo'),
    false,
  );

  assert.ok(redirectUrl);
  assert.equal(
    redirectUrl.href,
    'https://buscohuella.es/login?next=%2Fmis-reportes%2Fnuevo',
  );
});

test('conserva la query string interna solicitada', () => {
  const redirectUrl = getPrivateRouteLoginRedirect(
    new URL('https://buscohuella.es/mis-reportes?foo=bar&view=map'),
    false,
  );

  assert.ok(redirectUrl);
  assert.equal(
    redirectUrl.searchParams.get('next'),
    '/mis-reportes?foo=bar&view=map',
  );
});

test('mantiene cerrada una ruta privada si no puede validar el destino', () => {
  const redirectUrl = getFailClosedPrivateRouteLoginRedirect(
    new URL('https://buscohuella.es/mis-reportes/nuevo'),
    false,
  );

  assert.ok(redirectUrl);
  assert.equal(redirectUrl.href, 'https://buscohuella.es/login');
  assert.equal(redirectUrl.searchParams.has('next'), false);
});

test('rechaza next externos, protocol-relative y con backslashes', () => {
  for (const unsafeNext of [
    'https://evil.example/path',
    '//evil.example/path',
    '/\\evil.example/path',
  ]) {
    assert.equal(getSafeInternalPath(unsafeNext), null);
    assert.equal(
      getPostLoginRedirectPath(unsafeNext),
      '/inicio?login=success',
    );
  }

  assert.equal(
    getPostLoginRedirectPath('/mis-reportes/nuevo'),
    '/mis-reportes/nuevo',
  );
});

test('no crea loops ni protege rutas públicas o de autenticación', () => {
  for (const pathname of [
    '/',
    '/login',
    '/registro',
    '/recuperar-contrasena',
    '/auth/confirm',
    '/avisos',
    '/reportes/123',
  ]) {
    assert.equal(isPrivatePathname(pathname), false);
    assert.equal(
      getPrivateRouteLoginRedirect(
        new URL(pathname, 'https://buscohuella.es'),
        false,
      ),
      null,
    );
  }
});

test('reconoce las rutas privadas reales y deja pasar al usuario autenticado', () => {
  for (const pathname of [
    '/inicio',
    '/mis-reportes/nuevo',
    '/perfil/datos',
    '/reportes/123/avistamiento',
    '/reportes/123/avistamiento/456/fotos',
  ]) {
    assert.equal(isPrivatePathname(pathname), true);
    assert.equal(
      getPrivateRouteLoginRedirect(
        new URL(pathname, 'https://buscohuella.es'),
        true,
      ),
      null,
    );
  }
});

test('loginAction y el proxy usan los helpers seguros centralizados', () => {
  const loginActionSource = readFileSync(
    new URL('../src/features/auth/actions/login.ts', import.meta.url),
    'utf8',
  );
  const proxySource = readFileSync(
    new URL('../src/services/supabase/proxy.ts', import.meta.url),
    'utf8',
  );

  assert.match(loginActionSource, /getPostLoginRedirectPath/);
  assert.match(proxySource, /getPrivateRouteLoginRedirect/);
  assert.match(proxySource, /Boolean\(data\?\.claims\?\.sub\)/);
  assert.match(proxySource, /authResponse\.cookies\.getAll\(\)/);
});
