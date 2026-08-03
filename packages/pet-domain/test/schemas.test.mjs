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

test('crea una mascota mínima con raza desconocida', () => {
  const result = createPetSchema.parse(basePet);

  assert.equal(result.breedKnowledge, 'UNKNOWN');
  assert.equal(result.primaryBreedId, null);
  assert.equal(result.secondaryBreedId, null);
  assert.equal(result.isMixedBreed, false);
  assert.equal(result.visibility, 'PUBLIC_WHEN_REPORTED');
});

test('acepta una raza principal conocida', () => {
  const result = createPetSchema.parse({
    ...basePet,
    breedKnowledge: 'KNOWN',
    primaryBreedId: 10,
  });

  assert.equal(result.primaryBreedId, 10);
});

test('acepta dos razas distintas en una mezcla', () => {
  const result = createPetSchema.parse({
    ...basePet,
    breedKnowledge: 'KNOWN',
    primaryBreedId: 10,
    secondaryBreedId: 20,
    isMixedBreed: true,
  });

  assert.equal(result.secondaryBreedId, 20);
});

test('rechaza raza conocida sin raza principal', () => {
  const result = createPetSchema.safeParse({
    ...basePet,
    breedKnowledge: 'KNOWN',
  });

  assert.equal(result.success, false);
  assert.ok(
    result.error.issues.some(
      (issue) => issue.message === 'PET_PRIMARY_BREED_REQUIRED',
    ),
  );
});

test('rechaza segunda raza si no es mezcla', () => {
  const result = createPetSchema.safeParse({
    ...basePet,
    breedKnowledge: 'KNOWN',
    primaryBreedId: 10,
    secondaryBreedId: 20,
  });

  assert.equal(result.success, false);
});

test('rechaza dos razas iguales', () => {
  const result = createPetSchema.safeParse({
    ...basePet,
    breedKnowledge: 'KNOWN',
    primaryBreedId: 10,
    secondaryBreedId: 10,
    isMixedBreed: true,
  });

  assert.equal(result.success, false);
});

test('acepta mezcla de razas desconocidas', () => {
  const result = createPetSchema.parse({
    ...basePet,
    breedKnowledge: 'MIXED_UNKNOWN',
    isMixedBreed: true,
  });

  assert.equal(result.primaryBreedId, null);
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
});
