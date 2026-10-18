import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

async function importTypeScript(relativePath) {
  const source = await readFile(new URL(relativePath, import.meta.url), 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  return import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
}

const draftInput = await importTypeScript('../src/features/reports/lib/report-draft-input.ts');
const foundDetails = await importTypeScript('../src/features/reports/lib/found-report-details.ts');
const publishReadiness = await importTypeScript(
  '../src/features/reports/lib/report-publish-readiness.ts',
);

function collectKeyPaths(value, prefix = '') {
  return Object.entries(value).flatMap(([key, nested]) => {
    const path = prefix ? `${prefix}.${key}` : key;

    return nested && typeof nested === 'object' ? collectKeyPaths(nested, path) : [path];
  });
}

test('protege la ubicación exacta y conserva una proyección pública aproximada', () => {
  const location = draftInput.parseReportDraftLocation({
    source: 'GPS',
    exactLatitude: 41.54331,
    exactLongitude: 2.10942,
    publicLatitude: 41.543,
    publicLongitude: 2.109,
    placeLabel: 'Parc Catalunya',
    municipalityName: 'Sabadell',
  });

  assert.deepEqual(location, {
    exactLocation: { latitude: 41.54331, longitude: 2.10942 },
    publicLocation: { latitude: 41.543, longitude: 2.109 },
    municipalityName: 'Sabadell',
    publicLocationPrecision: 'APPROXIMATE_500M',
  });
});

test('rechaza coordenadas parciales antes de crear el borrador', () => {
  const location = draftInput.parseReportDraftLocation({
    source: 'GPS',
    exactLatitude: 41.54331,
    exactLongitude: null,
    publicLatitude: 41.543,
    publicLongitude: 2.109,
    placeLabel: '',
    municipalityName: '',
  });

  assert.equal(location, null);
});

test('valida el momento del hallazgo y conserva una fecha exacta válida', () => {
  assert.equal(draftInput.isReportIncidentMoment('TODAY'), true);
  assert.equal(draftInput.isReportIncidentMoment('INVALID'), false);
  assert.equal(
    draftInput.resolveIncidentAt('CUSTOM', '2025-10-18T10:30:00.000Z'),
    '2025-10-18T10:30:00.000Z',
  );
});

test('incorpora al texto público si el animal está bajo cuidado o localizado', () => {
  const inCare = foundDetails.composeFoundAnimalDescription({
    description: 'Perro mediano con collar rojo.',
    careStatus: 'IN_CARE',
    careHeading: 'Situación actual:',
    momentHeading: 'Momento indicado:',
    momentLabel: 'Hoy',
    inCareLabel: 'Está a salvo conmigo.',
    locatedLabel: 'Sigue localizado.',
  });
  const located = foundDetails.composeFoundAnimalDescription({
    description: 'Gato negro junto a la estación.',
    careStatus: 'LOCATED',
    careHeading: 'Situación actual:',
    momentHeading: 'Momento indicado:',
    momentLabel: 'Ayer',
    inCareLabel: 'Está a salvo conmigo.',
    locatedLabel: 'Sigue localizado.',
  });

  assert.match(inCare, /Está a salvo conmigo\./);
  assert.match(located, /Sigue localizado\./);
  assert.match(inCare, /Momento indicado:\n• Hoy/);
});

test('genera una descripción publicable aunque el texto libre sea opcional', () => {
  const description = foundDetails.composeFoundAnimalDescription({
    description: '',
    careStatus: 'IN_CARE',
    careHeading: 'Situación actual:',
    momentHeading: 'Momento indicado:',
    momentLabel: 'Ahora mismo',
    inCareLabel: 'Está a salvo conmigo.',
    locatedLabel: 'Sigue localizado.',
  });

  assert.match(description, /^Momento indicado:/);
  assert.ok(description.length >= 10);
});

test('permite publicar FOUND_ANIMAL sin pet_id y con fotos opcionales', () => {
  const readiness = publishReadiness.getReportPublishReadiness({
    reportType: 'FOUND_ANIMAL',
    petId: null,
    speciesId: 1,
    title: 'Perro encontrado en Sabadell',
    description: 'Perro mediano con collar rojo y buen estado general.',
    hasLocation: true,
  });

  assert.equal(readiness.hasAnimalIdentity, true);
  assert.equal(readiness.canPublish, true);
  assert.equal('photoCount' in readiness, false);
});

test('mantiene LOST_PET bloqueado cuando falta la mascota registrada', () => {
  const readiness = publishReadiness.getReportPublishReadiness({
    reportType: 'LOST_PET',
    petId: null,
    speciesId: 1,
    title: 'Luna',
    description: 'Se perdió cerca del parque y lleva collar rojo.',
    hasLocation: true,
  });

  assert.equal(readiness.hasAnimalIdentity, false);
  assert.equal(readiness.canPublish, false);
});

test('Crear aviso habilita FOUND_ANIMAL sin habilitar tipos fuera de alcance', async () => {
  const source = await readFile(
    new URL('../src/app/(private)/mis-reportes/nuevo/page.tsx', import.meta.url),
    'utf8',
  );

  assert.match(source, /href="\/mis-reportes\/nuevo\/encontrado"/);
  assert.match(source, /reports\.create\.sightingTitle/);
  assert.match(source, /<UnavailableType[\s\S]*reports\.create\.sightingTitle/);
});

test('mantiene paridad de claves FOUND_ANIMAL entre español y catalán', async () => {
  const [es, ca] = await Promise.all(
    ['es', 'ca'].map(async (locale) =>
      JSON.parse(
        await readFile(
          new URL(`../src/features/i18n/locales/${locale}/reports.json`, import.meta.url),
          'utf8',
        ),
      ),
    ),
  );

  assert.deepEqual(collectKeyPaths(es.found).sort(), collectKeyPaths(ca.found).sort());
});

test('los errores del formulario FOUND_ANIMAL se anuncian y enfocan', async () => {
  const source = await readFile(
    new URL('../src/features/reports/components/found-report-quick-form.tsx', import.meta.url),
    'utf8',
  );

  assert.match(source, /aria-invalid=/);
  assert.match(source, /role="alert"/);
  assert.match(source, /locationSectionRef\.current\?\.focus/);
});

test('FOUND_ANIMAL usa dos pantallas sin revisión separada', async () => {
  const [page, quickForm, photosPage] = await Promise.all([
    readFile(
      new URL('../src/app/(private)/mis-reportes/nuevo/encontrado/page.tsx', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL('../src/features/reports/components/found-report-quick-form.tsx', import.meta.url),
      'utf8',
    ),
    readFile(
      new URL('../src/app/(private)/mis-reportes/[id]/fotos/page.tsx', import.meta.url),
      'utf8',
    ),
  ]);

  assert.match(page, /FoundReportQuickForm/);
  assert.doesNotMatch(page, /\/cuando|\/revision|\/descripcion/);
  assert.match(quickForm, /name="speciesId"/);
  assert.match(quickForm, /name="description"/);
  assert.match(quickForm, /createFoundReportDraftAction/);
  assert.match(quickForm, /\/fotos/);
  assert.match(photosPage, /confirmationMode="implicit"/);
});

test('FOUND_ANIMAL permite la confirmacion implicita al publicar', async () => {
  const source = await readFile(
    new URL('../src/features/reports/actions/publish-report.ts', import.meta.url),
    'utf8',
  );

  assert.match(source, /confirmationValue === 'on'/);
  assert.match(source, /confirmationValue === 'true'/);
});