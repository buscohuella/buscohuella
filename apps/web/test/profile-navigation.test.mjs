import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const profilePageUrls = [
  '../src/app/(private)/perfil/datos/page.tsx',
  '../src/app/(private)/perfil/privacidad/page.tsx',
  '../src/app/(private)/perfil/accesibilidad/page.tsx',
  '../src/app/(private)/perfil/contacto/page.tsx',
];

const [backLinkSource, spanish, catalan, ...profilePages] = await Promise.all([
  readFile(new URL('../src/features/profile/components/profile-back-link.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/features/i18n/locales/es/profile.json', import.meta.url), 'utf8'),
  readFile(new URL('../src/features/i18n/locales/ca/profile.json', import.meta.url), 'utf8'),
  ...profilePageUrls.map((url) => readFile(new URL(url, import.meta.url), 'utf8')),
]);

test('todas las subpáginas de perfil conservan breadcrumbs y muestran el enlace común', () => {
  for (const pageSource of profilePages) {
    assert.match(pageSource, /<Breadcrumbs/);
    assert.match(pageSource, /<ProfileBackLink label=\{translate\('profile\.page\.backToProfile'\)\} \/>/);
  }
});

test('el enlace común vuelve al perfil y ofrece foco y objetivo táctil accesibles', () => {
  assert.match(backLinkSource, /href="\/perfil"/);
  assert.match(backLinkSource, /min-h-11/);
  assert.match(backLinkSource, /focus-visible:outline-none/);
  assert.match(backLinkSource, /focus-visible:ring-4/);
  assert.match(backLinkSource, /<ArrowLeft[^>]*aria-hidden="true"/s);
  assert.match(backLinkSource, /\{label\}/);
});

test('la etiqueta visible procede de i18n en español y catalán', () => {
  assert.equal(JSON.parse(spanish).page.backToProfile, 'Volver a Mi perfil');
  assert.equal(JSON.parse(catalan).page.backToProfile, 'Torna al meu perfil');
});
