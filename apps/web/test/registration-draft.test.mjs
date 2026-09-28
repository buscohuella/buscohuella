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

const emailPolicyUrl = toDataUrl(
  transpile('../src/features/auth/lib/email-policy.ts'),
);
const safeRedirectUrl = toDataUrl(
  transpile('../src/features/auth/lib/safe-redirect.ts'),
);
const registrationDraftSource = transpile(
  '../src/features/auth/lib/registration-draft.ts',
)
  .replace("'./email-policy'", `'${emailPolicyUrl}'`)
  .replace("'./safe-redirect'", `'${safeRedirectUrl}'`);

const {
  buildRegistrationEditPath,
  createRegistrationDraft,
  parseRegistrationDraft,
  registrationDraftMaxAgeMs,
} = await import(toDataUrl(registrationDraftSource));

test('crea un borrador temporal normalizado sin contraseñas', () => {
  const draft = createRegistrationDraft(
    {
      fullName: '  Ada Lovelace  ',
      email: '  ADA@EXAMPLE.COM  ',
      next: '/mis-reportes/nuevo',
      password: 'no-debe-guardarse',
    },
    1_000,
  );

  assert.deepEqual(draft, {
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    next: '/mis-reportes/nuevo',
    createdAt: 1_000,
  });
  assert.equal('password' in draft, false);
});

test('descarta borradores caducados, futuros o malformados', () => {
  const serializedDraft = JSON.stringify({
    fullName: 'Ada Lovelace',
    email: 'ada@example.com',
    next: '/mis-reportes/nuevo',
    createdAt: 1_000,
  });

  assert.ok(
    parseRegistrationDraft(
      serializedDraft,
      1_000 + registrationDraftMaxAgeMs,
    ),
  );
  assert.equal(
    parseRegistrationDraft(
      serializedDraft,
      1_001 + registrationDraftMaxAgeMs,
    ),
    null,
  );
  assert.equal(parseRegistrationDraft(serializedDraft, 999), null);
  assert.equal(parseRegistrationDraft('{invalid', 1_000), null);
});

test('sanea next al restaurar el borrador y construir Cambiar correo', () => {
  for (const unsafeNext of [
    'https://evil.example/path',
    '//evil.example',
    '/\\evil.example',
  ]) {
    const draft = createRegistrationDraft({
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      next: unsafeNext,
    });

    assert.ok(draft);
    assert.equal(draft.next, null);
    assert.equal(
      buildRegistrationEditPath(unsafeNext),
      '/registro?edit=1',
    );
  }

  assert.equal(
    buildRegistrationEditPath('/mis-reportes/nuevo'),
    '/registro?edit=1&next=%2Fmis-reportes%2Fnuevo',
  );
});
