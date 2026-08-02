import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PET_LIMITS,
  createPetSchema,
  microchipSchema,
  petPhotoInputSchema,
} from '../dist/index.js';

const basePet = {
  speciesId: 1,
  name: 'Nala',
};

test('crea una mascota mínima con valores por defecto', () => {
  const result = createPetSchema.parse(basePet);

  assert.equal(result.name, 'Nala');
  assert.equal(result.sex, 'UNKNOWN');
  assert.equal(result.size, 'UNKNOWN');
  assert.equal(result.status, undefined);
  assert.equal(result.visibility, 'PUBLIC_WHEN_REPORTED');
  assert.deepEqual(result.secondaryColors, []);
});

test('normaliza el microchip', () => {
  const result = microchipSchema.parse(' 941-000 027 123 456 ');

  assert.equal(result, '941000027123456');
});

test('rechaza una fecha de nacimiento futura', () => {
  const result = createPetSchema.safeParse({
    ...basePet,
    birthDate: '2999-01-01',
    birthDatePrecision: 'EXACT',
  });

  assert.equal(result.success, false);
  assert.ok(
    result.error.issues.some(
      (issue) => issue.message === 'PET_BIRTH_DATE_FUTURE',
    ),
  );
});

test('rechaza una precisión exacta sin fecha', () => {
  const result = createPetSchema.safeParse({
    ...basePet,
    birthDatePrecision: 'EXACT',
  });

  assert.equal(result.success, false);
  assert.ok(
    result.error.issues.some(
      (issue) => issue.message === 'PET_BIRTH_DATE_REQUIRED',
    ),
  );
});

test('rechaza un microchip si hasMicrochip es false', () => {
  const result = createPetSchema.safeParse({
    ...basePet,
    hasMicrochip: false,
    microchipNumber: '941000027123456',
  });

  assert.equal(result.success, false);
  assert.ok(
    result.error.issues.some(
      (issue) => issue.message === 'PET_MICROCHIP_WITHOUT_FLAG',
    ),
  );
});

test('acepta metadatos válidos de fotografía', () => {
  const result = petPhotoInputSchema.parse({
    petId: '4b7dbf4e-df4a-4b8e-a08e-c84f7fd18a18',
    mimeType: 'image/webp',
    fileSizeBytes: PET_LIMITS.photoMaxSizeBytes,
    width: 1600,
    height: 1200,
  });

  assert.equal(result.visibility, 'PRIVATE');
  assert.equal(result.position, 0);
  assert.equal(result.isPrimary, false);
});

test('rechaza una fotografía superior al límite', () => {
  const result = petPhotoInputSchema.safeParse({
    petId: '4b7dbf4e-df4a-4b8e-a08e-c84f7fd18a18',
    mimeType: 'image/jpeg',
    fileSizeBytes: PET_LIMITS.photoMaxSizeBytes + 1,
    width: 1600,
    height: 1200,
  });

  assert.equal(result.success, false);
});
