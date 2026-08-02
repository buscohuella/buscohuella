import assert from 'node:assert/strict';
import test from 'node:test';

import {
  mapCreatePetToInsert,
  mapPetRow,
  mapPetSpeciesRow,
  mapUpdatePetToUpdate,
  normalizePetDataError,
} from '../dist/index.js';

test('mapea una especie desde snake_case', () => {
  const result = mapPetSpeciesRow({
    id: 1,
    code: 'DOG',
    category: 'COMPANION',
    sort_order: 10,
    is_enabled: true,
    mvp_enabled: true,
    created_at: '2026-08-02T00:00:00Z',
    updated_at: '2026-08-02T00:00:00Z',
  });

  assert.deepEqual(result, {
    id: 1,
    code: 'DOG',
    category: 'COMPANION',
    sortOrder: 10,
    isEnabled: true,
    mvpEnabled: true,
  });
});

test('mapea una fila de mascota al dominio', () => {
  const result = mapPetRow({
    id: 'pet-1',
    owner_id: 'owner-1',
    species_id: 1,
    name: 'Nala',
    breed: null,
    is_mixed_breed: false,
    sex: 'FEMALE',
    birth_date: null,
    birth_date_precision: 'UNKNOWN',
    size: 'MEDIUM',
    weight_kg: null,
    primary_color: 'Marrón',
    secondary_colors: [],
    description: null,
    distinctive_features: null,
    has_microchip: false,
    microchip_number: null,
    identification_notes: null,
    private_notes: null,
    status: 'ACTIVE',
    visibility: 'PUBLIC_WHEN_REPORTED',
    archived_at: null,
    deceased_at: null,
    created_at: '2026-08-02T00:00:00Z',
    updated_at: '2026-08-02T00:00:00Z',
  });

  assert.equal(result.ownerId, 'owner-1');
  assert.equal(result.speciesId, 1);
  assert.equal(result.primaryColor, 'Marrón');
  assert.equal(result.visibility, 'PUBLIC_WHEN_REPORTED');
});

test('convierte una creación de dominio a insert', () => {
  const result = mapCreatePetToInsert('owner-1', {
    speciesId: 1,
    name: 'Nala',
    isMixedBreed: false,
    sex: 'UNKNOWN',
    birthDatePrecision: 'UNKNOWN',
    size: 'UNKNOWN',
    secondaryColors: [],
    hasMicrochip: false,
    visibility: 'PUBLIC_WHEN_REPORTED',
  });

  assert.equal(result.owner_id, 'owner-1');
  assert.equal(result.species_id, 1);
  assert.equal(result.name, 'Nala');
  assert.equal(result.birth_date, null);
});

test('una actualización no incluye campos ausentes', () => {
  const result = mapUpdatePetToUpdate({
    name: 'Nala II',
    description: null,
  });

  assert.deepEqual(result, {
    name: 'Nala II',
    description: null,
  });
  assert.equal('owner_id' in result, false);
});

test('normaliza una violación única como microchip duplicado', () => {
  const result = normalizePetDataError({
    code: '23505',
    message: 'duplicate key',
  });

  assert.equal(result.code, 'PET_MICROCHIP_DUPLICATE');
});

test('normaliza acceso denegado', () => {
  const result = normalizePetDataError({
    code: '42501',
    message: 'permission denied',
  });

  assert.equal(result.code, 'PET_FORBIDDEN');
});
