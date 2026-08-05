import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ReportDomainError,
  assertReportStatusTransition,
  canTransitionReportStatus,
  closeReportSchema,
  createReportSchema,
  createSightingSchema,
  publishReportSchema,
  reorderReportPhotosSchema,
  reportPhotoInputSchema,
  resolveReportSchema,
} from '../dist/index.js';

const past = '2026-08-04T12:00:00.000Z';
const future = '2099-08-04T12:00:00.000Z';

test('crea un borrador mínimo de mascota perdida', () => {
  const result = createReportSchema.parse({
    reportType: 'LOST_PET',
    petId: '11111111-1111-4111-8111-111111111111',
    speciesId: 1,
  });

  assert.equal(result.status, 'DRAFT');
  assert.equal(result.contactMode, 'PLATFORM_ONLY');
});

test('crea un borrador mínimo de animal encontrado', () => {
  const result = createReportSchema.parse({
    reportType: 'FOUND_ANIMAL',
    speciesId: 1,
  });

  assert.equal(result.petId, undefined);
  assert.equal(result.status, 'DRAFT');
});

test('rechaza una pérdida sin mascota', () => {
  const result = createReportSchema.safeParse({
    reportType: 'LOST_PET',
    speciesId: 1,
  });

  assert.equal(result.success, false);
});

test('rechaza un animal encontrado con mascota asociada', () => {
  const result = createReportSchema.safeParse({
    reportType: 'FOUND_ANIMAL',
    petId: '11111111-1111-4111-8111-111111111111',
    speciesId: 1,
  });

  assert.equal(result.success, false);
});

test('acepta una publicación completa con contacto mediado', () => {
  const result = publishReportSchema.parse({
    title: 'Luna se ha perdido',
    description: 'Perra mediana con collar rojo.',
    incidentAt: past,
    exactLocation: {
      latitude: 41.5433,
      longitude: 2.1094,
    },
    publicLocation: {
      latitude: 41.544,
      longitude: 2.11,
    },
    publicLocationPrecision: 'APPROXIMATE_500M',
    contactMode: 'PLATFORM_ONLY',
  });

  assert.equal(result.contactMode, 'PLATFORM_ONLY');
});

test('rechaza publicación sin ubicación pública cuando no está oculta', () => {
  const result = publishReportSchema.safeParse({
    title: 'Luna se ha perdido',
    description: 'Perra mediana con collar rojo.',
    incidentAt: past,
    exactLocation: {
      latitude: 41.5433,
      longitude: 2.1094,
    },
    publicLocationPrecision: 'APPROXIMATE_500M',
    contactMode: 'PLATFORM_ONLY',
  });

  assert.equal(result.success, false);
});

test('acepta publicación con ubicación pública oculta', () => {
  const result = publishReportSchema.parse({
    title: 'Animal encontrado',
    description: 'Animal localizado en una zona sensible.',
    incidentAt: past,
    exactLocation: {
      latitude: 41.5433,
      longitude: 2.1094,
    },
    publicLocationPrecision: 'HIDDEN',
    contactMode: 'PLATFORM_ONLY',
  });

  assert.equal(result.publicLocation, undefined);
});

test('rechaza fecha de incidente futura', () => {
  const result = createReportSchema.safeParse({
    reportType: 'FOUND_ANIMAL',
    speciesId: 1,
    incidentAt: future,
  });

  assert.equal(result.success, false);
});

test('requiere teléfono cuando el contacto es público por teléfono', () => {
  const result = createReportSchema.safeParse({
    reportType: 'FOUND_ANIMAL',
    speciesId: 1,
    contactMode: 'PUBLIC_PHONE',
  });

  assert.equal(result.success, false);
});

test('normaliza cierre con motivo', () => {
  const result = closeReportSchema.parse({
    closureReason: '  Reporte duplicado  ',
  });

  assert.equal(result.closureReason, 'Reporte duplicado');
});

test('acepta resolución válida', () => {
  const result = resolveReportSchema.parse({
    resolutionType: 'REUNITED',
    resolutionNotes: '  Reunida con su familia  ',
  });

  assert.equal(result.resolutionNotes, 'Reunida con su familia');
});

test('valida transiciones ordinarias', () => {
  assert.equal(canTransitionReportStatus('DRAFT', 'ACTIVE'), true);
  assert.equal(canTransitionReportStatus('ACTIVE', 'PAUSED'), true);
  assert.equal(canTransitionReportStatus('PAUSED', 'ACTIVE'), true);
  assert.equal(canTransitionReportStatus('RESOLVED', 'ARCHIVED'), true);
});

test('rechaza transición inválida', () => {
  assert.throws(
    () => assertReportStatusTransition('ARCHIVED', 'ACTIVE'),
    (error) =>
      error instanceof ReportDomainError &&
      error.code === 'REPORT_STATUS_TRANSITION_INVALID',
  );
});

test('acepta un avistamiento válido', () => {
  const result = createSightingSchema.parse({
    reportId: '11111111-1111-4111-8111-111111111111',
    observedAt: past,
    exactLocation: {
      latitude: 41.54,
      longitude: 2.1,
    },
    publicLocation: {
      latitude: 41.541,
      longitude: 2.101,
    },
  });

  assert.equal(result.confidence, 'UNSURE');
  assert.equal(result.reviewStatus, 'PENDING');
});

test('rechaza avistamiento futuro', () => {
  const result = createSightingSchema.safeParse({
    reportId: '11111111-1111-4111-8111-111111111111',
    observedAt: future,
    exactLocation: {
      latitude: 41.54,
      longitude: 2.1,
    },
    publicLocation: {
      latitude: 41.541,
      longitude: 2.101,
    },
  });

  assert.equal(result.success, false);
});

test('rechaza fotografía que supera el límite de píxeles', () => {
  const result = reportPhotoInputSchema.safeParse({
    reportId: '11111111-1111-4111-8111-111111111111',
    position: 0,
    mimeType: 'image/webp',
    fileSizeBytes: 200_000,
    width: 6_000,
    height: 6_000,
  });

  assert.equal(result.success, false);
});

test('rechaza IDs repetidos al reordenar fotografías', () => {
  const id = '11111111-1111-4111-8111-111111111111';
  const result = reorderReportPhotosSchema.safeParse({
    reportId: '22222222-2222-4222-8222-222222222222',
    photoIds: [id, id],
  });

  assert.equal(result.success, false);
});
