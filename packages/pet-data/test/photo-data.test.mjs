import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildPetPhotoStoragePath,
  normalizePetDataError,
} from '../dist/index.js';

test('construye la ruta privada de una fotografía WebP', () => {
  const result = buildPetPhotoStoragePath({
    ownerId: 'd3b15052-d063-4a51-8600-266abfdd93bd',
    petId: '0dbe6274-e93c-420f-b6ce-7928adfe8e54',
    photoId: '8b40e88b-b707-44ec-a70c-bb554a5ce5a2',
    mimeType: 'image/webp',
  });

  assert.equal(
    result,
    'd3b15052-d063-4a51-8600-266abfdd93bd/0dbe6274-e93c-420f-b6ce-7928adfe8e54/8b40e88b-b707-44ec-a70c-bb554a5ce5a2.webp',
  );
});

test('usa extensión jpg para JPEG', () => {
  const result = buildPetPhotoStoragePath({
    ownerId: 'd3b15052-d063-4a51-8600-266abfdd93bd',
    petId: '0dbe6274-e93c-420f-b6ce-7928adfe8e54',
    photoId: '8b40e88b-b707-44ec-a70c-bb554a5ce5a2',
    mimeType: 'image/jpeg',
  });

  assert.ok(result.endsWith('.jpg'));
});

test('rechaza identificadores inválidos en la ruta', () => {
  assert.throws(() =>
    buildPetPhotoStoragePath({
      ownerId: 'owner',
      petId: '0dbe6274-e93c-420f-b6ce-7928adfe8e54',
      photoId: '8b40e88b-b707-44ec-a70c-bb554a5ce5a2',
      mimeType: 'image/png',
    }),
  );
});

test('normaliza el límite de fotografías', () => {
  const error = normalizePetDataError({
    code: '23514',
    message: 'PET_PHOTO_LIMIT_REACHED',
  });

  assert.equal(error.code, 'PET_PHOTO_LIMIT_REACHED');
});

test('normaliza fotografía no encontrada', () => {
  const error = normalizePetDataError({
    code: 'P0002',
    message: 'PET_PHOTO_NOT_FOUND',
  });

  assert.equal(error.code, 'PET_NOT_FOUND');
});
