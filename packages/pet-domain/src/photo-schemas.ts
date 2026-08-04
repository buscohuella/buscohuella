import { z } from 'zod';

import {
  PET_LIMITS,
  PET_PHOTO_MIME_TYPES,
  PET_PHOTO_VISIBILITIES,
} from './constants.js';

export const createPetPhotoMetadataSchema = z.object({
  id: z.uuid(),
  petId: z.uuid(),
  storagePath: z.string().trim().min(1).max(500),
  position: z.number().int().min(0).max(9).default(0),
  isPrimary: z.boolean().default(false),
  visibility: z.enum(PET_PHOTO_VISIBILITIES).default('PRIVATE'),
  altText: z
    .string()
    .trim()
    .max(PET_LIMITS.photoAltTextMaxLength)
    .nullable()
    .optional()
    .transform((value) => (value === '' ? null : value)),
  mimeType: z.enum(PET_PHOTO_MIME_TYPES),
  fileSizeBytes: z
    .number()
    .int()
    .positive()
    .max(PET_LIMITS.photoMaxSizeBytes),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const updatePetPhotoSchema = z.object({
  altText: z
    .string()
    .trim()
    .max(PET_LIMITS.photoAltTextMaxLength)
    .nullable()
    .optional()
    .transform((value) => (value === '' ? null : value)),
  visibility: z.enum(PET_PHOTO_VISIBILITIES).optional(),
});

export const reorderPetPhotosSchema = z.object({
  petId: z.uuid(),
  photoIds: z
    .array(z.uuid())
    .min(1)
    .max(PET_LIMITS.photosMaxCount)
    .refine(
      (ids) => new Set(ids).size === ids.length,
      'PET_PHOTO_ORDER_DUPLICATE',
    ),
});

export type CreatePetPhotoMetadataData = z.output<
  typeof createPetPhotoMetadataSchema
>;
export type UpdatePetPhotoData = z.output<
  typeof updatePetPhotoSchema
>;
export type ReorderPetPhotosData = z.output<
  typeof reorderPetPhotosSchema
>;
