import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PetPhotoRepository,
  buildPetPhotoStoragePath,
  normalizePetDataError,
} from '../dist/index.js';

const ownerId = 'd3b15052-d063-4a51-8600-266abfdd93bd';
const petId = '0dbe6274-e93c-420f-b6ce-7928adfe8e54';
const photoId = '8b40e88b-b707-44ec-a70c-bb554a5ce5a2';

test('construye la ruta privada de una fotografía WebP', () => {
  const result = buildPetPhotoStoragePath({
    ownerId,
    petId,
    photoId,
    mimeType: 'image/webp',
  });

  assert.equal(
    result,
    `${ownerId}/${petId}/${photoId}.webp`,
  );
});

test('usa extensión jpg para JPEG', () => {
  const result = buildPetPhotoStoragePath({
    ownerId,
    petId,
    photoId,
    mimeType: 'image/jpeg',
  });

  assert.ok(result.endsWith('.jpg'));
});

test('rechaza identificadores inválidos en la ruta', () => {
  assert.throws(() =>
    buildPetPhotoStoragePath({
      ownerId: 'owner',
      petId,
      photoId,
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

function createUploadClient({
  uploadError = null,
  metadataError = null,
} = {}) {
  const calls = {
    upload: [],
    insert: [],
    remove: [],
  };

  const storageBucket = {
    async upload(path, bytes, options) {
      calls.upload.push({ path, bytes, options });
      return { error: uploadError };
    },
    async remove(paths) {
      calls.remove.push(paths);
      return { error: null };
    },
  };

  const metadataQuery = {
    insert(value) {
      calls.insert.push(value);
      return this;
    },
    select() {
      return this;
    },
    async single() {
      return {
        data: metadataError
          ? null
          : {
              id: photoId,
              pet_id: petId,
              storage_path: `${ownerId}/${petId}/${photoId}.webp`,
              position: 0,
              is_primary: true,
              visibility: 'PRIVATE',
              alt_text: null,
              mime_type: 'image/webp',
              file_size_bytes: 100,
              width: 800,
              height: 600,
              created_at: '2026-08-05T00:00:00.000Z',
              updated_at: '2026-08-05T00:00:00.000Z',
            },
        error: metadataError,
      };
    },
  };

  return {
    calls,
    client: {
      storage: {
        from() {
          return storageBucket;
        },
      },
      from(table) {
        assert.equal(table, 'pet_photos');
        return metadataQuery;
      },
    },
  };
}

const validUpload = {
  ownerId,
  petId,
  photoId,
  mimeType: 'image/webp',
  bytes: new Uint8Array([82, 73, 70, 70]).buffer,
  fileSizeBytes: 100,
  width: 800,
  height: 600,
  altText: null,
  position: 0,
};

test('elimina de Storage el objeto si falla la creación de metadatos', async () => {
  const { client, calls } = createUploadClient({
    metadataError: {
      code: '23514',
      message: 'FORCED_METADATA_FAILURE',
    },
  });
  const repository = new PetPhotoRepository(client);

  await assert.rejects(() => repository.uploadPhoto(validUpload));

  assert.equal(calls.upload.length, 1);
  assert.equal(calls.insert.length, 1);
  assert.deepEqual(calls.remove, [
    [`${ownerId}/${petId}/${photoId}.webp`],
  ]);
});

test('si falla Storage no inserta metadatos ni ejecuta compensación', async () => {
  const { client, calls } = createUploadClient({
    uploadError: {
      message: 'FORCED_STORAGE_FAILURE',
    },
  });
  const repository = new PetPhotoRepository(client);

  await assert.rejects(() => repository.uploadPhoto(validUpload));

  assert.equal(calls.upload.length, 1);
  assert.equal(calls.insert.length, 0);
  assert.equal(calls.remove.length, 0);
});
