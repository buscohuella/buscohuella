import assert from 'node:assert/strict';
import test from 'node:test';

import {
  mapCreatePetToInsert,
  mapPetBreedRow,
  mapPetRow,
  mapUpdatePetToUpdate,
} from '../dist/index.js';

test('mapea una raza desde snake_case', () => {
  const result = mapPetBreedRow({
    id: 10,
    species_id: 1,
    code: 'GERMAN_SHEPHERD',
    canonical_name: 'Pastor alemán',
    aliases: ['pastor aleman'],
    sort_order: 10,
    is_enabled: true,
    mvp_enabled: true,
    created_at: '2026-08-03T00:00:00Z',
    updated_at: '2026-08-03T00:00:00Z',
  });

  assert.equal(result.canonicalName, 'Pastor alemán');
  assert.equal(result.speciesId, 1);
});

test('mapea los campos normalizados de una mascota', () => {
  const result = mapPetRow({
    id: '1',
    owner_id: '2',
    species_id: 1,
    name: 'Nala',
    breed: 'Pastor alemán',
    breed_knowledge: 'KNOWN',
    primary_breed_id: 10,
    secondary_breed_id: null,
    is_mixed_breed: false,
    sex: 'FEMALE',
    birth_date: null,
    birth_date_precision: 'UNKNOWN',
    size: 'MEDIUM',
    weight_kg: null,
    primary_color: null,
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
    created_at: '2026-08-03T00:00:00Z',
    updated_at: '2026-08-03T00:00:00Z',
  });

  assert.equal(result.breedKnowledge, 'KNOWN');
  assert.equal(result.primaryBreedId, 10);
});

test('convierte creación con catálogo a insert', () => {
  const result = mapCreatePetToInsert('owner', {
    speciesId: 1,
    name: 'Nala',
    breed: 'Pastor alemán',
    breedKnowledge: 'KNOWN',
    primaryBreedId: 10,
    secondaryBreedId: null,
    isMixedBreed: false,
    sex: 'UNKNOWN',
    birthDate: null,
    birthDatePrecision: 'UNKNOWN',
    size: 'UNKNOWN',
    weightKg: null,
    primaryColor: null,
    secondaryColors: [],
    description: null,
    distinctiveFeatures: null,
    hasMicrochip: false,
    microchipNumber: null,
    identificationNotes: null,
    privateNotes: null,
    visibility: 'PUBLIC_WHEN_REPORTED',
  });

  assert.equal(result.breed_knowledge, 'KNOWN');
  assert.equal(result.primary_breed_id, 10);
});

test('una actualización incluye solo campos presentes', () => {
  const result = mapUpdatePetToUpdate({
    breedKnowledge: 'MIXED_UNKNOWN',
    primaryBreedId: null,
    secondaryBreedId: null,
    isMixedBreed: true,
  });

  assert.deepEqual(result, {
    breed_knowledge: 'MIXED_UNKNOWN',
    primary_breed_id: null,
    secondary_breed_id: null,
    is_mixed_breed: true,
  });
});
