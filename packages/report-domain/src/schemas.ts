import { z } from 'zod';

import {
  DEFAULT_REPORT_VALUES,
  DEFAULT_SIGHTING_VALUES,
  REPORT_CONTACT_MODES,
  REPORT_LIMITS,
  REPORT_LOCATION_PRECISIONS,
  REPORT_PHOTO_MIME_TYPES,
  REPORT_RESOLUTION_TYPES,
  REPORT_STATUSES,
  REPORT_TYPES,
  SIGHTING_CONFIDENCE_VALUES,
  SIGHTING_REVIEW_STATUSES,
} from './constants.js';

const nullableTrimmedString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .nullable()
    .optional()
    .transform((value) => (value === '' ? null : value));

const requiredTrimmedString = (
  minLength: number,
  maxLength: number,
) => z.string().trim().min(minLength).max(maxLength);

export const reportTypeSchema = z.enum(REPORT_TYPES);
export const reportStatusSchema = z.enum(REPORT_STATUSES);
export const reportResolutionTypeSchema = z.enum(
  REPORT_RESOLUTION_TYPES,
);
export const reportLocationPrecisionSchema = z.enum(
  REPORT_LOCATION_PRECISIONS,
);
export const reportContactModeSchema = z.enum(REPORT_CONTACT_MODES);
export const sightingConfidenceSchema = z.enum(
  SIGHTING_CONFIDENCE_VALUES,
);
export const sightingReviewStatusSchema = z.enum(
  SIGHTING_REVIEW_STATUSES,
);
export const reportPhotoMimeTypeSchema = z.enum(
  REPORT_PHOTO_MIME_TYPES,
);

export const geoPointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const reportInputShape = {
  reportType: reportTypeSchema,
  petId: z.uuid().nullable().optional(),
  speciesId: z.number().int().positive(),
  status: reportStatusSchema.default(DEFAULT_REPORT_VALUES.status),
  title: nullableTrimmedString(REPORT_LIMITS.titleMaxLength),
  titleSource: z.enum(['SYSTEM', 'CUSTOM']).default('CUSTOM'),
  description: nullableTrimmedString(
    REPORT_LIMITS.descriptionMaxLength,
  ),
  incidentAt: z.iso.datetime({ offset: true }).nullable().optional(),
  exactLocation: geoPointSchema.nullable().optional(),
  publicLocation: geoPointSchema.nullable().optional(),
  publicLocationPrecision: reportLocationPrecisionSchema.default(
    DEFAULT_REPORT_VALUES.publicLocationPrecision,
  ),
  municipalityName: nullableTrimmedString(
    REPORT_LIMITS.municipalityMaxLength,
  ),
  locationIsSensitive: z
    .boolean()
    .default(DEFAULT_REPORT_VALUES.locationIsSensitive),
  contactMode: reportContactModeSchema.default(
    DEFAULT_REPORT_VALUES.contactMode,
  ),
  publicPhone: nullableTrimmedString(
    REPORT_LIMITS.publicPhoneMaxLength,
  ),
  publicEmail: z
    .email()
    .max(REPORT_LIMITS.publicEmailMaxLength)
    .nullable()
    .optional(),
  resolutionType: reportResolutionTypeSchema.nullable().optional(),
  resolutionNotes: nullableTrimmedString(
    REPORT_LIMITS.resolutionNotesMaxLength,
  ),
  closureReason: nullableTrimmedString(
    REPORT_LIMITS.closureReasonMaxLength,
  ),
};

type ReportCrossValidationInput = {
  reportType?: (typeof REPORT_TYPES)[number] | undefined;
  petId?: string | null | undefined;
  status?: (typeof REPORT_STATUSES)[number] | undefined;
  title?: string | null | undefined;
  description?: string | null | undefined;
  incidentAt?: string | null | undefined;
  exactLocation?: z.infer<typeof geoPointSchema> | null | undefined;
  publicLocation?: z.infer<typeof geoPointSchema> | null | undefined;
  publicLocationPrecision?:
    | (typeof REPORT_LOCATION_PRECISIONS)[number]
    | undefined;
  contactMode?: (typeof REPORT_CONTACT_MODES)[number] | undefined;
  publicPhone?: string | null | undefined;
  publicEmail?: string | null | undefined;
  resolutionType?:
    | (typeof REPORT_RESOLUTION_TYPES)[number]
    | null
    | undefined;
  resolutionNotes?: string | null | undefined;
  closureReason?: string | null | undefined;
};

const validateReportConsistency = (
  value: ReportCrossValidationInput,
  context: z.RefinementCtx,
) => {
  if (value.reportType === 'LOST_PET' && !value.petId) {
    context.addIssue({
      code: 'custom',
      path: ['petId'],
      message: 'LOST_REPORT_REQUIRES_PET',
    });
  }

  if (value.reportType === 'FOUND_ANIMAL' && value.petId) {
    context.addIssue({
      code: 'custom',
      path: ['petId'],
      message: 'FOUND_REPORT_MUST_NOT_REFERENCE_PET',
    });
  }

  if (
    value.incidentAt &&
    new Date(value.incidentAt).getTime() > Date.now()
  ) {
    context.addIssue({
      code: 'custom',
      path: ['incidentAt'],
      message: 'REPORT_INCIDENT_IN_FUTURE',
    });
  }

  if (
    value.contactMode === 'PUBLIC_PHONE' &&
    (!value.publicPhone ||
      value.publicPhone.length < REPORT_LIMITS.publicPhoneMinLength)
  ) {
    context.addIssue({
      code: 'custom',
      path: ['publicPhone'],
      message: 'REPORT_PUBLIC_PHONE_REQUIRED',
    });
  }

  if (
    value.contactMode !== undefined &&
    value.contactMode !== 'PUBLIC_PHONE' &&
    value.publicPhone
  ) {
    context.addIssue({
      code: 'custom',
      path: ['publicPhone'],
      message: 'REPORT_PUBLIC_PHONE_NOT_ALLOWED',
    });
  }

  if (value.contactMode === 'PUBLIC_EMAIL' && !value.publicEmail) {
    context.addIssue({
      code: 'custom',
      path: ['publicEmail'],
      message: 'REPORT_PUBLIC_EMAIL_REQUIRED',
    });
  }

  if (
    value.contactMode !== undefined &&
    value.contactMode !== 'PUBLIC_EMAIL' &&
    value.publicEmail
  ) {
    context.addIssue({
      code: 'custom',
      path: ['publicEmail'],
      message: 'REPORT_PUBLIC_EMAIL_NOT_ALLOWED',
    });
  }

  if (
    value.publicLocationPrecision === 'HIDDEN' &&
    value.publicLocation
  ) {
    context.addIssue({
      code: 'custom',
      path: ['publicLocation'],
      message: 'REPORT_PUBLIC_LOCATION_NOT_ALLOWED',
    });
  }

  if (
    value.status &&
    ['ACTIVE', 'PAUSED', 'RESOLVED'].includes(value.status)
  ) {
    if (!value.title) {
      context.addIssue({
        code: 'custom',
        path: ['title'],
        message: 'REPORT_TITLE_REQUIRED',
      });
    }

    if (!value.description) {
      context.addIssue({
        code: 'custom',
        path: ['description'],
        message: 'REPORT_DESCRIPTION_REQUIRED',
      });
    }

    if (!value.incidentAt) {
      context.addIssue({
        code: 'custom',
        path: ['incidentAt'],
        message: 'REPORT_INCIDENT_REQUIRED',
      });
    }

    if (!value.exactLocation) {
      context.addIssue({
        code: 'custom',
        path: ['exactLocation'],
        message: 'REPORT_EXACT_LOCATION_REQUIRED',
      });
    }

    if (
      value.publicLocationPrecision !== 'HIDDEN' &&
      !value.publicLocation
    ) {
      context.addIssue({
        code: 'custom',
        path: ['publicLocation'],
        message: 'REPORT_PUBLIC_LOCATION_REQUIRED',
      });
    }
  }

  if (value.status === 'RESOLVED' && !value.resolutionType) {
    context.addIssue({
      code: 'custom',
      path: ['resolutionType'],
      message: 'REPORT_RESOLUTION_REQUIRED',
    });
  }

  if (
    value.status !== undefined &&
    value.status !== 'RESOLVED' &&
    (value.resolutionType || value.resolutionNotes)
  ) {
    context.addIssue({
      code: 'custom',
      path: ['resolutionType'],
      message: 'REPORT_RESOLUTION_STATE_INVALID',
    });
  }

  if (value.status === 'CLOSED' && !value.closureReason) {
    context.addIssue({
      code: 'custom',
      path: ['closureReason'],
      message: 'REPORT_CLOSURE_REASON_REQUIRED',
    });
  }

  if (
    value.status !== undefined &&
    value.status !== 'CLOSED' &&
    value.closureReason
  ) {
    context.addIssue({
      code: 'custom',
      path: ['closureReason'],
      message: 'REPORT_CLOSURE_STATE_INVALID',
    });
  }
};

const createReportBaseSchema = z.object(reportInputShape);

export const createReportSchema =
  createReportBaseSchema.superRefine(validateReportConsistency);

export const updateReportSchema = createReportBaseSchema
  .partial()
  .superRefine(validateReportConsistency);

export const publishReportSchema = z
  .object({
    title: requiredTrimmedString(
      REPORT_LIMITS.titleMinLength,
      REPORT_LIMITS.titleMaxLength,
    ),
    description: requiredTrimmedString(
      REPORT_LIMITS.descriptionMinLength,
      REPORT_LIMITS.descriptionMaxLength,
    ),
    incidentAt: z.iso.datetime({ offset: true }),
    exactLocation: geoPointSchema,
    publicLocation: geoPointSchema.nullable().optional(),
    publicLocationPrecision: reportLocationPrecisionSchema,
    contactMode: reportContactModeSchema,
    publicPhone: nullableTrimmedString(
      REPORT_LIMITS.publicPhoneMaxLength,
    ),
    publicEmail: z
      .email()
      .max(REPORT_LIMITS.publicEmailMaxLength)
      .nullable()
      .optional(),
  })
  .superRefine((value, context) => {
    validateReportConsistency(
      {
        ...value,
        status: 'ACTIVE',
      },
      context,
    );
  });

export const resolveReportSchema = z.object({
  resolutionType: reportResolutionTypeSchema,
  resolutionNotes: nullableTrimmedString(
    REPORT_LIMITS.resolutionNotesMaxLength,
  ),
});

export const closeReportSchema = z.object({
  closureReason: requiredTrimmedString(
    1,
    REPORT_LIMITS.closureReasonMaxLength,
  ),
});

export const createSightingSchema = z
  .object({
    reportId: z.uuid(),
    observedAt: z.iso.datetime({ offset: true }),
    exactLocation: geoPointSchema,
    publicLocation: geoPointSchema.nullable().optional(),
    publicLocationPrecision: reportLocationPrecisionSchema.default(
      DEFAULT_SIGHTING_VALUES.publicLocationPrecision,
    ),
    notes: nullableTrimmedString(
      REPORT_LIMITS.sightingNotesMaxLength,
    ),
    confidence: sightingConfidenceSchema.default(
      DEFAULT_SIGHTING_VALUES.confidence,
    ),
    reviewStatus: sightingReviewStatusSchema.default(
      DEFAULT_SIGHTING_VALUES.reviewStatus,
    ),
  })
  .superRefine((value, context) => {
    if (new Date(value.observedAt).getTime() > Date.now()) {
      context.addIssue({
        code: 'custom',
        path: ['observedAt'],
        message: 'SIGHTING_OBSERVED_IN_FUTURE',
      });
    }

    if (
      value.publicLocationPrecision === 'HIDDEN' &&
      value.publicLocation
    ) {
      context.addIssue({
        code: 'custom',
        path: ['publicLocation'],
        message: 'SIGHTING_PUBLIC_LOCATION_NOT_ALLOWED',
      });
    }

    if (
      value.publicLocationPrecision !== 'HIDDEN' &&
      !value.publicLocation
    ) {
      context.addIssue({
        code: 'custom',
        path: ['publicLocation'],
        message: 'SIGHTING_PUBLIC_LOCATION_REQUIRED',
      });
    }
  });

export const reportPhotoInputSchema = z.object({
  reportId: z.uuid(),
  position: z
    .number()
    .int()
    .min(0)
    .max(REPORT_LIMITS.reportPhotosMaxCount - 1),
  isPrimary: z.boolean().default(false),
  altText: nullableTrimmedString(
    REPORT_LIMITS.photoAltTextMaxLength,
  ),
  mimeType: reportPhotoMimeTypeSchema,
  fileSizeBytes: z
    .number()
    .int()
    .positive()
    .max(REPORT_LIMITS.photoMaxSizeBytes),
  width: z
    .number()
    .int()
    .positive()
    .max(REPORT_LIMITS.imageMaxDimension),
  height: z
    .number()
    .int()
    .positive()
    .max(REPORT_LIMITS.imageMaxDimension),
}).superRefine((value, context) => {
  if (value.width * value.height > REPORT_LIMITS.imageMaxPixels) {
    context.addIssue({
      code: 'custom',
      path: ['width'],
      message: 'REPORT_PHOTO_PIXEL_LIMIT_EXCEEDED',
    });
  }
});

export const reorderReportPhotosSchema = z
  .object({
    reportId: z.uuid(),
    photoIds: z
      .array(z.uuid())
      .min(1)
      .max(REPORT_LIMITS.reportPhotosMaxCount),
  })
  .superRefine((value, context) => {
    if (new Set(value.photoIds).size !== value.photoIds.length) {
      context.addIssue({
        code: 'custom',
        path: ['photoIds'],
        message: 'REPORT_PHOTO_IDS_DUPLICATED',
      });
    }
  });

export type CreateReportInput = z.input<typeof createReportSchema>;
export type CreateReportData = z.output<typeof createReportSchema>;
export type UpdateReportInput = z.input<typeof updateReportSchema>;
export type UpdateReportData = z.output<typeof updateReportSchema>;
export type PublishReportInput = z.input<typeof publishReportSchema>;
export type PublishReportData = z.output<typeof publishReportSchema>;
export type ResolveReportInput = z.input<typeof resolveReportSchema>;
export type ResolveReportData = z.output<typeof resolveReportSchema>;
export type CloseReportInput = z.input<typeof closeReportSchema>;
export type CloseReportData = z.output<typeof closeReportSchema>;
export type CreateSightingInput = z.input<typeof createSightingSchema>;
export type CreateSightingData = z.output<typeof createSightingSchema>;
export type ReportPhotoInput = z.output<typeof reportPhotoInputSchema>;
export type ReorderReportPhotosInput = z.output<
  typeof reorderReportPhotosSchema
>;
