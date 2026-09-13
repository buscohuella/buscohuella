import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PET_LIMITS,
  createPetSchema,
  getUnicodeCodePointLength,
  microchipSchema,
  petPhotoInputSchema,
  parseOptionalWeight,
  isPetWeightValid,
  updatePetSchema,
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

test('normaliza nombres y conserva la capitalización', () => {
  const cases = [
    ['Luna Test', 'Luna Test'],
    ['  Luna Test  ', 'Luna Test'],
    ['Luna     Test', 'Luna Test'],
    ['LUNA TEST', 'LUNA TEST'],
    ['Ñu', 'Ñu'],
    ['Étoile', 'Étoile'],
    ['Àlex', 'Àlex'],
    ['K9', 'K9'],
    ['R2-D2', 'R2-D2'],
    ['L.A', 'L.A'],
    ["D'Artagnan", "D'Artagnan"],
    ['123456', '123456'],
  ];

  for (const [input, expected] of cases) {
    assert.equal(createPetSchema.parse({ ...basePet, name: input }).name, expected);
    assert.equal(updatePetSchema.parse({ name: input }).name, expected);
  }
});

test('aplica el límite de 30 caracteres al nombre normalizado', () => {
  const accepted = 'A'.repeat(30);
  const rejected = 'A'.repeat(31);

  assert.equal(createPetSchema.safeParse({ ...basePet, name: accepted }).success, true);
  assert.equal(createPetSchema.safeParse({ ...basePet, name: rejected }).success, false);
  assert.equal(updatePetSchema.safeParse({ name: accepted }).success, true);
  assert.equal(updatePetSchema.safeParse({ name: rejected }).success, false);
});

test('cuenta nombres Unicode por code points, no por unidades UTF-16', () => {
  const astralLetter = '𐐀';
  const thirtyAstralLetters = astralLetter.repeat(30);
  const thirtyOneAstralLetters = astralLetter.repeat(31);

  assert.equal(getUnicodeCodePointLength(thirtyAstralLetters), 30);
  assert.equal(getUnicodeCodePointLength(thirtyOneAstralLetters), 31);
  assert.equal(
    createPetSchema.safeParse({ ...basePet, name: thirtyAstralLetters }).success,
    true,
  );
  assert.equal(
    createPetSchema.safeParse({ ...basePet, name: thirtyOneAstralLetters }).success,
    false,
  );
  assert.equal(getUnicodeCodePointLength(`A${astralLetter}ÑÉÀ`), 5);
  assert.equal(
    createPetSchema.parse({ ...basePet, name: `A${astralLetter}ÑÉÀ` }).name,
    `A${astralLetter}ÑÉÀ`,
  );
});

test('rechaza nombres sin letras ni números', () => {
  for (const name of ['', '   ', '---', '...', "'''", '!!!@@@', '🐶🐶🐶']) {
    assert.equal(createPetSchema.safeParse({ ...basePet, name }).success, false);
    assert.equal(updatePetSchema.safeParse({ name }).success, false);
  }
});

test('rechaza emojis y símbolos no permitidos', () => {
  for (const name of ['Luna 🐶', 'Luna@', '#Luna', 'Luna€']) {
    assert.equal(createPetSchema.safeParse({ ...basePet, name }).success, false);
    assert.equal(updatePetSchema.safeParse({ name }).success, false);
  }
});

test('rechaza crear una mascota con microchip marcado sin número', () => {
  const result = createPetSchema.safeParse({
    ...basePet,
    hasMicrochip: true,
  });

  assert.equal(result.success, false);
  assert.ok(
    result.error.issues.some(
      (issue) => issue.message === 'PET_MICROCHIP_REQUIRED',
    ),
  );
});

test('rechaza editar una mascota con microchip marcado sin número', () => {
  const result = updatePetSchema.safeParse({
    hasMicrochip: true,
  });

  assert.equal(result.success, false);
  assert.ok(
    result.error.issues.some(
      (issue) => issue.message === 'PET_MICROCHIP_REQUIRED',
    ),
  );
});

test('permite una mascota sin microchip y un número válido', () => {
  assert.equal(
    createPetSchema.safeParse({
      ...basePet,
      hasMicrochip: false,
    }).success,
    true,
  );

  assert.equal(
    updatePetSchema.parse({
      hasMicrochip: true,
      microchipNumber: ' 941-000 027 123 456 ',
    }).microchipNumber,
    '941000027123456',
  );
});

test('rechaza una fecha de nacimiento futura', () => {
  const result = createPetSchema.safeParse({
    ...basePet,
    birthDate: '2999-01-01',
    birthDatePrecision: 'EXACT',
  });

  assert.equal(result.success, false);
});

test('permite omitir el peso', () => {
  assert.equal(createPetSchema.safeParse(basePet).success, true);
});

test('rechaza peso cero y negativo', () => {
  assert.equal(
    createPetSchema.safeParse({ ...basePet, weightKg: 0 }).success,
    false,
  );
  assert.equal(
    createPetSchema.safeParse({ ...basePet, weightKg: -5 }).success,
    false,
  );
});

test('permite un peso decimal válido y el límite máximo exacto', () => {
  assert.equal(
    createPetSchema.safeParse({ ...basePet, weightKg: 2.5 }).success,
    true,
  );
  assert.equal(
    createPetSchema.safeParse({ ...basePet, weightKg: 200 }).success,
    true,
  );
});

test('rechaza un peso superior al límite máximo', () => {
  const result = createPetSchema.safeParse({
    ...basePet,
    weightKg: 200.01,
  });

  assert.equal(result.success, false);
  assert.ok(
    result.error.issues.some(
      (issue) => issue.message === 'PET_WEIGHT_TOO_HIGH',
    ),
  );
});

test('parsea pesos de FormData sin convertir inválidos en vacío', () => {
  assert.equal(parseOptionalWeight(''), null);
  assert.equal(parseOptionalWeight('  '), null);
  assert.equal(parseOptionalWeight('-5'), -5);
  assert.equal(parseOptionalWeight('9999'), 9999);
  assert.equal(parseOptionalWeight('2,5'), 2.5);
  assert.equal(parseOptionalWeight('2.5'), 2.5);
  assert.equal(parseOptionalWeight('200'), 200);
  assert.equal(parseOptionalWeight('200.01'), 200.01);
  assert.equal(Number.isNaN(parseOptionalWeight('2,5.1')), true);
});

test('valida el rango de peso antes de persistir', () => {
  assert.equal(isPetWeightValid(-5), false);
  assert.equal(isPetWeightValid(9999), false);
  assert.equal(isPetWeightValid(200), true);
  assert.equal(isPetWeightValid(200.01), false);
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
