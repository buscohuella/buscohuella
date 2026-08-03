import { z } from 'zod';

import {
  BIRTH_DATE_PRECISIONS,
  BREED_KNOWLEDGE_VALUES,
  DEFAULT_PET_VALUES,
  PET_LIMITS,
  PET_PHOTO_MIME_TYPES,
  PET_PHOTO_VISIBILITIES,
  PET_SEXES,
  PET_SIZES,
  PET_SPECIES_CATEGORIES,
  PET_STATUSES,
  PET_VISIBILITIES,
} from './constants.js';

const nullableTrimmedString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .nullable()
    .optional()
    .transform((value) => (value === '' ? null : value));

const nullablePositiveInteger = z
  .number()
  .int()
  .positive()
  .nullable()
  .optional();

export const petStatusSchema = z.enum(PET_STATUSES);
export const petVisibilitySchema = z.enum(PET_VISIBILITIES);
export const petSexSchema = z.enum(PET_SEXES);
export const petSizeSchema = z.enum(PET_SIZES);
export const birthDatePrecisionSchema = z.enum(BIRTH_DATE_PRECISIONS);
export const breedKnowledgeSchema = z.enum(BREED_KNOWLEDGE_VALUES);
export const petPhotoVisibilitySchema = z.enum(PET_PHOTO_VISIBILITIES);
export const petPhotoMimeTypeSchema = z.enum(PET_PHOTO_MIME_TYPES);
export const petSpeciesCategorySchema = z.enum(PET_SPECIES_CATEGORIES);

export const microchipSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, '').toUpperCase())
  .pipe(
    z
      .string()
      .min(PET_LIMITS.microchipMinLength)
      .max(PET_LIMITS.microchipMaxLength)
      .regex(/^[A-Z0-9]+$/),
  );

const petInputShape = {
  speciesId: z.number().int().positive(),
  name: z
    .string()
    .trim()
    .min(PET_LIMITS.nameMinLength)
    .max(PET_LIMITS.nameMaxLength),
  breed: nullableTrimmedString(PET_LIMITS.breedMaxLength),
  breedKnowledge: breedKnowledgeSchema.default(
    DEFAULT_PET_VALUES.breedKnowledge,
  ),
  primaryBreedId: nullablePositiveInteger.default(
    DEFAULT_PET_VALUES.primaryBreedId,
  ),
  secondaryBreedId: nullablePositiveInteger.default(
    DEFAULT_PET_VALUES.secondaryBreedId,
  ),
  isMixedBreed: z.boolean().default(DEFAULT_PET_VALUES.isMixedBreed),
  sex: petSexSchema.default(DEFAULT_PET_VALUES.sex),
  birthDate: z.iso.date().nullable().optional(),
  birthDatePrecision: birthDatePrecisionSchema.default(
    DEFAULT_PET_VALUES.birthDatePrecision,
  ),
  size: petSizeSchema.default(DEFAULT_PET_VALUES.size),
  weightKg: z.number().positive().max(9_999.99).nullable().optional(),
  primaryColor: nullableTrimmedString(PET_LIMITS.colorMaxLength),
  secondaryColors: z
    .array(z.string().trim().min(1).max(PET_LIMITS.colorMaxLength))
    .max(PET_LIMITS.secondaryColorsMaxCount)
    .default([]),
  description: nullableTrimmedString(PET_LIMITS.descriptionMaxLength),
  distinctiveFeatures: nullableTrimmedString(
    PET_LIMITS.distinctiveFeaturesMaxLength,
  ),
  hasMicrochip: z.boolean().default(DEFAULT_PET_VALUES.hasMicrochip),
  microchipNumber: z.union([microchipSchema, z.null()]).optional(),
  identificationNotes: nullableTrimmedString(
    PET_LIMITS.identificationNotesMaxLength,
  ),
  privateNotes: nullableTrimmedString(PET_LIMITS.privateNotesMaxLength),
  visibility: petVisibilitySchema.default(DEFAULT_PET_VALUES.visibility),
};

type PetInputForCrossValidation = {
  birthDate?: string | null | undefined;
  birthDatePrecision?:
    | (typeof BIRTH_DATE_PRECISIONS)[number]
    | undefined;
  hasMicrochip?: boolean | undefined;
  microchipNumber?: string | null | undefined;
  breedKnowledge?:
    | (typeof BREED_KNOWLEDGE_VALUES)[number]
    | undefined;
  primaryBreedId?: number | null | undefined;
  secondaryBreedId?: number | null | undefined;
  isMixedBreed?: boolean | undefined;
};

const validatePetInputConsistency = (
  value: PetInputForCrossValidation,
  context: z.RefinementCtx,
) => {
  const today = new Date().toISOString().slice(0, 10);

  if (value.birthDate && value.birthDate > today) {
    context.addIssue({
      code: 'custom',
      path: ['birthDate'],
      message: 'PET_BIRTH_DATE_FUTURE',
    });
  }

  if (
    value.birthDatePrecision === 'UNKNOWN' &&
    value.birthDate !== null &&
    value.birthDate !== undefined
  ) {
    context.addIssue({
      code: 'custom',
      path: ['birthDatePrecision'],
      message: 'PET_BIRTH_DATE_PRECISION_INVALID',
    });
  }

  if (
    value.birthDatePrecision !== undefined &&
    value.birthDatePrecision !== 'UNKNOWN' &&
    (value.birthDate === null || value.birthDate === undefined)
  ) {
    context.addIssue({
      code: 'custom',
      path: ['birthDate'],
      message: 'PET_BIRTH_DATE_REQUIRED',
    });
  }

  if (value.hasMicrochip === false && value.microchipNumber) {
    context.addIssue({
      code: 'custom',
      path: ['microchipNumber'],
      message: 'PET_MICROCHIP_WITHOUT_FLAG',
    });
  }

  if (value.breedKnowledge === 'KNOWN' && !value.primaryBreedId) {
    context.addIssue({
      code: 'custom',
      path: ['primaryBreedId'],
      message: 'PET_PRIMARY_BREED_REQUIRED',
    });
  }

  if (
    value.breedKnowledge !== undefined &&
    value.breedKnowledge !== 'KNOWN' &&
    (value.primaryBreedId || value.secondaryBreedId)
  ) {
    context.addIssue({
      code: 'custom',
      path: ['breedKnowledge'],
      message: 'PET_BREED_IDS_NOT_ALLOWED',
    });
  }

  if (value.secondaryBreedId && value.isMixedBreed !== true) {
    context.addIssue({
      code: 'custom',
      path: ['secondaryBreedId'],
      message: 'PET_SECONDARY_BREED_REQUIRES_MIXED',
    });
  }

  if (
    value.primaryBreedId &&
    value.secondaryBreedId &&
    value.primaryBreedId === value.secondaryBreedId
  ) {
    context.addIssue({
      code: 'custom',
      path: ['secondaryBreedId'],
      message: 'PET_BREEDS_MUST_DIFFER',
    });
  }

  if (
    value.breedKnowledge === 'MIXED_UNKNOWN' &&
    value.isMixedBreed !== true
  ) {
    context.addIssue({
      code: 'custom',
      path: ['isMixedBreed'],
      message: 'PET_MIXED_UNKNOWN_REQUIRES_MIXED',
    });
  }
};

const createPetBaseSchema = z.object(petInputShape);
const updatePetBaseSchema = createPetBaseSchema.partial();

export const createPetSchema = createPetBaseSchema.superRefine(
  validatePetInputConsistency,
);

export const updatePetSchema = updatePetBaseSchema.superRefine(
  validatePetInputConsistency,
);

export const petPhotoInputSchema = z.object({
  petId: z.uuid(),
  position: z.number().int().nonnegative().default(0),
  isPrimary: z.boolean().default(false),
  visibility: petPhotoVisibilitySchema.default('PRIVATE'),
  altText: nullableTrimmedString(PET_LIMITS.photoAltTextMaxLength),
  mimeType: petPhotoMimeTypeSchema,
  fileSizeBytes: z
    .number()
    .int()
    .positive()
    .max(PET_LIMITS.photoMaxSizeBytes),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export type CreatePetData = z.output<typeof createPetSchema>;
export type CreatePetRawInput = z.input<typeof createPetSchema>;
export type UpdatePetData = z.output<typeof updatePetSchema>;
export type PetPhotoInput = z.output<typeof petPhotoInputSchema>;
