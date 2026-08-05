import assert from 'node:assert/strict';
import test from 'node:test';

import {
  fromGeographyPoint,
  mapCreateReportToInsert,
  mapCreateSightingToInsert,
  mapPublicReportRow,
  mapReportEventRow,
  mapReportPhotoRow,
  mapReportRow,
  mapUpdateReportToUpdate,
  normalizeReportDataError,
  toGeographyPoint,
} from '../dist/index.js';

const reportRow = {
  archived_at: null,
  closed_at: null,
  closure_reason: null,
  contact_mode: 'PLATFORM_ONLY',
  created_at: '2026-08-05T10:00:00.000Z',
  created_by: '11111111-1111-4111-8111-111111111111',
  description: 'Perra con collar rojo',
  exact_location: {
    type: 'Point',
    coordinates: [2.1094, 41.5433],
  },
  id: '22222222-2222-4222-8222-222222222222',
  incident_at: '2026-08-04T12:00:00.000Z',
  location_is_sensitive: false,
  municipality_name: 'Sabadell',
  pet_id: '33333333-3333-4333-8333-333333333333',
  public_email: null,
  public_location: 'SRID=4326;POINT(2.11 41.544)',
  public_location_precision: 'APPROXIMATE_500M',
  public_phone: null,
  published_at: '2026-08-05T10:00:00.000Z',
  report_type: 'LOST_PET',
  resolution_notes: null,
  resolution_type: null,
  resolved_at: null,
  species_id: 1,
  status: 'ACTIVE',
  title: 'Luna se ha perdido',
  updated_at: '2026-08-05T10:00:00.000Z',
};

test('serializa un punto como EWKT', () => {
  assert.equal(
    toGeographyPoint({ latitude: 41.5433, longitude: 2.1094 }),
    'SRID=4326;POINT(2.1094 41.5433)',
  );
});

test('mapea geografía desde GeoJSON', () => {
  assert.deepEqual(
    fromGeographyPoint({
      type: 'Point',
      coordinates: [2.1094, 41.5433],
    }),
    { longitude: 2.1094, latitude: 41.5433 },
  );
});

test('mapea geografía desde EWKT', () => {
  assert.deepEqual(
    fromGeographyPoint('SRID=4326;POINT(2.11 41.544)'),
    { longitude: 2.11, latitude: 41.544 },
  );
});

test('mapea una fila de reporte al dominio', () => {
  const report = mapReportRow(reportRow);

  assert.equal(report.reportType, 'LOST_PET');
  assert.deepEqual(report.exactLocation, {
    longitude: 2.1094,
    latitude: 41.5433,
  });
  assert.deepEqual(report.publicLocation, {
    longitude: 2.11,
    latitude: 41.544,
  });
});

test('convierte creación de reporte a insert', () => {
  const insert = mapCreateReportToInsert(
    '11111111-1111-4111-8111-111111111111',
    {
      reportType: 'FOUND_ANIMAL',
      speciesId: 1,
      status: 'DRAFT',
      publicLocationPrecision: 'APPROXIMATE_500M',
      locationIsSensitive: false,
      contactMode: 'PLATFORM_ONLY',
      title: null,
      description: null,
      incidentAt: null,
      exactLocation: null,
      publicLocation: null,
      municipalityName: null,
      publicPhone: null,
      publicEmail: null,
      resolutionType: null,
      resolutionNotes: null,
      closureReason: null,
    },
  );

  assert.equal(insert.report_type, 'FOUND_ANIMAL');
  assert.equal(insert.created_by, '11111111-1111-4111-8111-111111111111');
  assert.equal(insert.exact_location, null);
});

test('una actualización incluye solo campos presentes', () => {
  const update = mapUpdateReportToUpdate({
    title: 'Nuevo título',
    publicLocation: null,
  });

  assert.deepEqual(update, {
    title: 'Nuevo título',
    public_location: null,
  });
});

test('convierte un avistamiento a insert', () => {
  const insert = mapCreateSightingToInsert(
    '11111111-1111-4111-8111-111111111111',
    {
      reportId: '22222222-2222-4222-8222-222222222222',
      observedAt: '2026-08-04T12:00:00.000Z',
      exactLocation: { latitude: 41.54, longitude: 2.1 },
      publicLocation: { latitude: 41.541, longitude: 2.101 },
      publicLocationPrecision: 'APPROXIMATE_500M',
      notes: null,
      confidence: 'LIKELY',
      reviewStatus: 'PENDING',
    },
  );

  assert.equal(insert.confidence, 'LIKELY');
  assert.equal(
    insert.exact_location,
    'SRID=4326;POINT(2.1 41.54)',
  );
});

test('mapea metadatos de fotografía', () => {
  const photo = mapReportPhotoRow({
    alt_text: 'Luna de perfil',
    created_at: '2026-08-05T10:00:00.000Z',
    file_size_bytes: 120000,
    height: 800,
    id: '44444444-4444-4444-8444-444444444444',
    is_primary: true,
    mime_type: 'image/webp',
    position: 0,
    report_id: '22222222-2222-4222-8222-222222222222',
    storage_path: 'owner/report/photo.webp',
    updated_at: '2026-08-05T10:00:00.000Z',
    width: 1200,
  });

  assert.equal(photo.isPrimary, true);
  assert.equal(photo.mimeType, 'image/webp');
});

test('mapea evento auditable', () => {
  const event = mapReportEventRow({
    actor_id: null,
    created_at: '2026-08-05T10:00:00.000Z',
    event_type: 'PUBLISHED',
    from_status: 'DRAFT',
    id: 1,
    metadata: { source: 'web' },
    report_id: '22222222-2222-4222-8222-222222222222',
    to_status: 'ACTIVE',
  });

  assert.equal(event.eventType, 'PUBLISHED');
  assert.deepEqual(event.metadata, { source: 'web' });
});

test('mapea proyección pública sin ubicación exacta', () => {
  const report = mapPublicReportRow({
    contact_mode: 'PLATFORM_ONLY',
    description: 'Perra con collar rojo',
    id: '22222222-2222-4222-8222-222222222222',
    incident_at: '2026-08-04T12:00:00.000Z',
    latitude: 41.544,
    longitude: 2.11,
    municipality_name: 'Sabadell',
    primary_photo_id: null,
    public_email: null,
    public_location_precision: 'APPROXIMATE_500M',
    public_phone: null,
    published_at: '2026-08-05T10:00:00.000Z',
    report_type: 'LOST_PET',
    species_id: 1,
    title: 'Luna se ha perdido',
    updated_at: '2026-08-05T10:00:00.000Z',
  });

  assert.equal('exactLocation' in report, false);
  assert.equal(report.latitude, 41.544);
});

test('normaliza reporte duplicado abierto', () => {
  const error = normalizeReportDataError({
    code: '23505',
    message:
      'duplicate key value violates unique constraint "reports_one_open_lost_pet_idx"',
    details: 'Key (pet_id) already exists.',
  });

  assert.equal(error.code, 'REPORT_OPEN_LOST_DUPLICATE');
});

test('normaliza transición inválida', () => {
  const error = normalizeReportDataError({
    code: '22023',
    message: 'REPORT_STATUS_TRANSITION_INVALID',
  });

  assert.equal(error.code, 'REPORT_TRANSITION_INVALID');
});

test('normaliza acceso denegado', () => {
  const error = normalizeReportDataError({
    code: '42501',
    message: 'new row violates row-level security policy',
  });

  assert.equal(error.code, 'REPORT_FORBIDDEN');
});
