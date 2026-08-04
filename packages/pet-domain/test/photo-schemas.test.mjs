import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PET_LIMITS,
  createPetPhotoMetadataSchema,
  reorderPetPhotosSchema,
  updatePetPhotoSchema,
} from '../dist/index.js';

const validPhoto = {
  id: '8b40e88b-b707-44ec-a70c-bb554a5ce5a2',
  petId: '0dbe6274-e93c-420f-b6ce-7928adfe8e54',
  storagePath:
    'd3b15052-d063-4a51-8600-266abfdd93bd/0dbe6274-e93c-420f-b6ce-7928adfe8e54/8b40e88b-b707-44ec-a70c-bb554a5ce5a2.webp',
  mimeType: 'image/webp',
  fileSizeBytes: 1024,
  width: 1200,
  height: 900,
};

test('acepta metadatos válidos de fotografía', () => {
  const result = createPetPhotoMetadataSchema.parse(validPhoto);
  assert.equal(result.position, 0);
  assert.equal(result.visibility, 'PRIVATE');
});

test('rechaza una posición fuera del MVP', () => {
  const result = createPetPhotoMetadataSchema.safeParse({
    ...validPhoto,
    position: 10,
  });
  assert.equal(result.success, false);
});

test('rechaza una fotografía superior a 8 MB', () => {
  const result = createPetPhotoMetadataSchema.safeParse({
    ...validPhoto,
    fileSizeBytes: PET_LIMITS.photoMaxSizeBytes + 1,
  });
  assert.equal(result.success, false);
});

test('normaliza texto alternativo vacío', () => {
  const result = updatePetPhotoSchema.parse({ altText: '   ' });
  assert.equal(result.altText, null);
});

test('rechaza IDs repetidos al reordenar', () => {
  const id = '8b40e88b-b707-44ec-a70c-bb554a5ce5a2';
  const result = reorderPetPhotosSchema.safeParse({
    petId: validPhoto.petId,
    photoIds: [id, id],
  });
  assert.equal(result.success, false);
});
