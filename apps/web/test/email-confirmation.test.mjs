import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(
  new URL('../src/features/auth/lib/email-confirmation.ts', import.meta.url),
  'utf8',
);

const safeRedirectSource = readFileSync(
  new URL('../src/features/auth/lib/safe-redirect.ts', import.meta.url),
  'utf8',
);

const safeRedirectTranspiled = ts.transpileModule(safeRedirectSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;

const safeRedirectUrl = `data:text/javascript;base64,${Buffer.from(
  safeRedirectTranspiled,
).toString('base64')}`;

const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText.replace("'./safe-redirect'", `'${safeRedirectUrl}'`);

const {
  buildEmailConfirmationRedirectUrl,
  getEmailConfirmationErrorPath,
  getEmailConfirmationAttempt,
  getSafeEmailConfirmationNextPath,
  isPasswordRecoveryConfirmation,
  verifyEmailConfirmationAttempt,
} = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`
);

const { getSafeInternalPath } = await import(safeRedirectUrl);

test('acepta el code que entrega el flujo PKCE de confirmación', () => {
  const attempt = getEmailConfirmationAttempt(
    new URLSearchParams({ code: 'auth-code' }),
  );

  assert.deepEqual(attempt, {
    method: 'pkce',
    code: 'auth-code',
  });

  assert.equal(
    getSafeEmailConfirmationNextPath(null, attempt),
    '/inicio?account_confirmed=1',
  );
});

test('confirma PKCE solo cuando exchangeCodeForSession termina sin error', async () => {
  const calls = [];
  const attempt = getEmailConfirmationAttempt(
    new URLSearchParams({ code: 'auth-code' }),
  );

  assert.ok(attempt);

  const succeeded = await verifyEmailConfirmationAttempt(
    attempt,
    {
      async exchangeCodeForSession(code) {
        calls.push(['exchange', code]);
        return { error: null };
      },
      async verifyOtp(params) {
        calls.push(['verify', params]);
        return { error: null };
      },
    },
  );

  assert.equal(succeeded, true);
  assert.deepEqual(calls, [['exchange', 'auth-code']]);
});

test('reconoce recovery en el flujo PKCE cuando lleva el marcador recovery', () => {
  const searchParams = new URLSearchParams({
    code: 'recovery-code',
    flow: 'recovery',
    next: '/nueva-contrasena',
  });

  const attempt = getEmailConfirmationAttempt(searchParams);

  assert.ok(attempt);

  assert.equal(
    isPasswordRecoveryConfirmation(searchParams, attempt),
    true,
  );

  assert.equal(
    getSafeEmailConfirmationNextPath(
      searchParams.get('next'),
      attempt,
    ),
    '/nueva-contrasena',
  );
});

test('construye emailRedirectTo con locale y conserva un next interno seguro', () => {
  const redirectUrl = new URL(
    buildEmailConfirmationRedirectUrl({
      origin: 'https://buscohuella.es',
      locale: 'ca',
      next: '/mis-reportes/nuevo',
    }),
  );

  assert.equal(redirectUrl.origin, 'https://buscohuella.es');
  assert.equal(redirectUrl.pathname, '/auth/confirm');
  assert.equal(redirectUrl.searchParams.get('locale'), 'ca');

  assert.equal(
    redirectUrl.searchParams.get('next'),
    '/mis-reportes/nuevo',
  );
});

test('omite next cuando emailRedirectTo recibe un destino inseguro', () => {
  for (const next of [
    'https://evil.example/path',
    '//evil.example',
    '/\\evil.example',
  ]) {
    const redirectUrl = new URL(
      buildEmailConfirmationRedirectUrl({
        origin: 'https://buscohuella.es',
        locale: 'es',
        next,
      }),
    );

    assert.equal(redirectUrl.searchParams.get('locale'), 'es');
    assert.equal(redirectUrl.searchParams.has('next'), false);
    assert.equal(getSafeInternalPath(next), null);
  }
});

test('mantiene compatibilidad con token_hash y type válidos', () => {
  const attempt = getEmailConfirmationAttempt(
    new URLSearchParams({
      token_hash: 'hashed-token',
      type: 'email',
    }),
  );

  assert.deepEqual(attempt, {
    method: 'token_hash',
    tokenHash: 'hashed-token',
    type: 'email',
  });
});

test('confirma token_hash con verifyOtp y devuelve una URL de éxito sin auth_error', async () => {
  const calls = [];
  const searchParams = new URLSearchParams({
    token_hash: 'hashed-token',
    type: 'email',
  });
  const attempt = getEmailConfirmationAttempt(searchParams);

  assert.ok(attempt);

  const succeeded = await verifyEmailConfirmationAttempt(
    attempt,
    {
      async exchangeCodeForSession(code) {
        calls.push(['exchange', code]);
        return { error: null };
      },
      async verifyOtp(params) {
        calls.push(['verify', params]);
        return { error: null };
      },
    },
  );

  const nextPath = getSafeEmailConfirmationNextPath(
    searchParams.get('next'),
    attempt,
  );

  assert.equal(succeeded, true);
  assert.deepEqual(calls, [
    [
      'verify',
      { type: 'email', token_hash: 'hashed-token' },
    ],
  ]);
  assert.equal(nextPath, '/inicio?account_confirmed=1');
  assert.equal(nextPath.includes('auth_error'), false);
});

test('una confirmación inválida o caducada conserva un estado de error', async () => {
  const searchParams = new URLSearchParams({
    token_hash: 'expired-token',
    type: 'email',
  });
  const attempt = getEmailConfirmationAttempt(searchParams);

  assert.ok(attempt);

  const succeeded = await verifyEmailConfirmationAttempt(
    attempt,
    {
      async exchangeCodeForSession() {
        return { error: new Error('expired') };
      },
      async verifyOtp() {
        return { error: new Error('expired') };
      },
    },
  );

  assert.equal(succeeded, false);
  assert.equal(
    getEmailConfirmationErrorPath(searchParams),
    '/login?auth_error=confirmation',
  );
});

test('rechaza parámetros incompletos o tipos OTP no permitidos', () => {
  assert.equal(
    getEmailConfirmationAttempt(new URLSearchParams()),
    null,
  );

  assert.equal(
    getEmailConfirmationAttempt(
      new URLSearchParams({ code: '' }),
    ),
    null,
  );

  assert.equal(
    getEmailConfirmationAttempt(
      new URLSearchParams({
        token_hash: 'hash',
        type: 'invalid',
      }),
    ),
    null,
  );
});

test('conserva recovery y bloquea redirecciones externas', () => {
  const recoveryAttempt = getEmailConfirmationAttempt(
    new URLSearchParams({
      token_hash: 'hash',
      type: 'recovery',
    }),
  );

  assert.ok(recoveryAttempt);

  assert.equal(
    getSafeEmailConfirmationNextPath(
      null,
      recoveryAttempt,
    ),
    '/nueva-contrasena',
  );

  assert.equal(
    getSafeEmailConfirmationNextPath(
      '//evil.example',
      recoveryAttempt,
    ),
    '/nueva-contrasena',
  );

  assert.equal(
    getSafeEmailConfirmationNextPath(
      '/\\evil.example',
      recoveryAttempt,
    ),
    '/nueva-contrasena',
  );

  assert.equal(
    getSafeEmailConfirmationNextPath(
      'https://evil.example/path',
      recoveryAttempt,
    ),
    '/nueva-contrasena',
  );

  assert.equal(
    getSafeEmailConfirmationNextPath(
      '/perfil',
      recoveryAttempt,
    ),
    '/perfil',
  );

  assert.equal(
    getSafeEmailConfirmationNextPath(
      '/inicio?foo=1#pet-species',
      recoveryAttempt,
    ),
    '/inicio?foo=1#pet-species',
  );

  assert.equal(
    getEmailConfirmationErrorPath(
      new URLSearchParams({ flow: 'recovery' }),
    ),
    '/recuperar-contrasena?recovery_expired=1',
  );
});

test('conserva el destino interno tras una confirmación de registro', () => {
  const signupAttempt = getEmailConfirmationAttempt(
    new URLSearchParams({
      code: 'auth-code',
    }),
  );

  assert.ok(signupAttempt);

  assert.equal(
    getSafeEmailConfirmationNextPath(
      '/mis-reportes/nuevo',
      signupAttempt,
    ),
    '/mis-reportes/nuevo',
  );
});
