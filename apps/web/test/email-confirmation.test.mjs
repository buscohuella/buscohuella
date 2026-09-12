import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const source = readFileSync(
  new URL('../src/features/auth/lib/email-confirmation.ts', import.meta.url),
  'utf8',
);
const transpiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const {
  getEmailConfirmationAttempt,
  getSafeEmailConfirmationNextPath,
} = await import(
  `data:text/javascript;base64,${Buffer.from(transpiled).toString('base64')}`
);

test('acepta el code que entrega el flujo PKCE de confirmación', () => {
  const attempt = getEmailConfirmationAttempt(
    new URLSearchParams({ code: 'auth-code' }),
  );

  assert.deepEqual(attempt, { method: 'pkce', code: 'auth-code' });
  assert.equal(
    getSafeEmailConfirmationNextPath(null, attempt),
    '/inicio?account_confirmed=1',
  );
});

test('mantiene compatibilidad con token_hash y type válidos', () => {
  const attempt = getEmailConfirmationAttempt(
    new URLSearchParams({ token_hash: 'hashed-token', type: 'email' }),
  );

  assert.deepEqual(attempt, {
    method: 'token_hash',
    tokenHash: 'hashed-token',
    type: 'email',
  });
});

test('rechaza parámetros incompletos o tipos OTP no permitidos', () => {
  assert.equal(getEmailConfirmationAttempt(new URLSearchParams()), null);
  assert.equal(
    getEmailConfirmationAttempt(new URLSearchParams({ code: '' })),
    null,
  );
  assert.equal(
    getEmailConfirmationAttempt(
      new URLSearchParams({ token_hash: 'hash', type: 'invalid' }),
    ),
    null,
  );
});

test('conserva recovery y bloquea redirecciones externas', () => {
  const recoveryAttempt = getEmailConfirmationAttempt(
    new URLSearchParams({ token_hash: 'hash', type: 'recovery' }),
  );

  assert.ok(recoveryAttempt);
  assert.equal(
    getSafeEmailConfirmationNextPath(null, recoveryAttempt),
    '/nueva-contrasena',
  );
  assert.equal(
    getSafeEmailConfirmationNextPath('//evil.example', recoveryAttempt),
    '/nueva-contrasena',
  );
  assert.equal(
    getSafeEmailConfirmationNextPath('/\\evil.example', recoveryAttempt),
    '/nueva-contrasena',
  );
  assert.equal(
    getSafeEmailConfirmationNextPath('https://evil.example/path', recoveryAttempt),
    '/nueva-contrasena',
  );
  assert.equal(
    getSafeEmailConfirmationNextPath('/perfil', recoveryAttempt),
    '/perfil',
  );
  assert.equal(
    getSafeEmailConfirmationNextPath('/inicio?foo=1#pet-species', recoveryAttempt),
    '/inicio?foo=1#pet-species',
  );
});
