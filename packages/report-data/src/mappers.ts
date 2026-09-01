import type {
  CreateReportData,
  CreateSightingData,
  PublicReport,
  Report,
  ReportEvent,
  ReportPhoto,
  ReportPhotoInput,
  UpdateReportData,
} from '@buscohuella/report-domain';

import {
  fromGeographyPoint,
  toGeographyPoint,
} from './geography.js';
import type {
  PublicReportRow,
  ReportEventRow,
  ReportInsert,
  ReportPhotoInsert,
  ReportPhotoRow,
  ReportRow,
  ReportUpdate,
  SightingInsert,
  SightingRow,
} from './rows.js';

export const mapReportRow = (row: ReportRow): Report => ({
  id: row.id,
  createdBy: row.created_by,
  reportType: row.report_type as Report['reportType'],
  petId: row.pet_id,
  speciesId: row.species_id,
  status: row.status as Report['status'],
  title: row.title,
  titleSource: row.title_source,
  description: row.description,
  incidentAt: row.incident_at,
  exactLocation: fromGeographyPoint(row.exact_location),
  publicLocation: fromGeographyPoint(row.public_location),
  publicLocationPrecision:
    row.public_location_precision as Report['publicLocationPrecision'],
  municipalityName: row.municipality_name,
  locationIsSensitive: row.location_is_sensitive,
  contactMode: row.contact_mode as Report['contactMode'],
  publicPhone: row.public_phone,
  publicEmail: row.public_email,
  resolutionType:
    row.resolution_type as Report['resolutionType'],
  resolutionNotes: row.resolution_notes,
  closureReason: row.closure_reason,
  publishedAt: row.published_at,
  resolvedAt: row.resolved_at,
  closedAt: row.closed_at,
  archivedAt: row.archived_at,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapCreateReportToInsert = (
  createdBy: string,
  input: CreateReportData,
): ReportInsert => ({
  created_by: createdBy,
  report_type: input.reportType,
  pet_id: input.petId ?? null,
  species_id: input.speciesId,
  status: input.status,
  title: input.title ?? null,
  title_source: input.titleSource ?? 'CUSTOM',
  description: input.description ?? null,
  incident_at: input.incidentAt ?? null,
  exact_location: toGeographyPoint(input.exactLocation),
  public_location: toGeographyPoint(input.publicLocation),
  public_location_precision: input.publicLocationPrecision,
  municipality_name: input.municipalityName ?? null,
  location_is_sensitive: input.locationIsSensitive,
  contact_mode: input.contactMode,
  public_phone: input.publicPhone ?? null,
  public_email: input.publicEmail ?? null,
  resolution_type: input.resolutionType ?? null,
  resolution_notes: input.resolutionNotes ?? null,
  closure_reason: input.closureReason ?? null,
});

export const mapUpdateReportToUpdate = (
  input: UpdateReportData,
): ReportUpdate => {
  const update: ReportUpdate = {};

  if (input.reportType !== undefined) {
    update.report_type = input.reportType;
  }
  if (input.petId !== undefined) update.pet_id = input.petId;
  if (input.speciesId !== undefined) {
    update.species_id = input.speciesId;
  }
  if (input.status !== undefined) update.status = input.status;
  if (input.title !== undefined) update.title = input.title;
  if (input.description !== undefined) {
    update.description = input.description;
  }
  if (input.incidentAt !== undefined) {
    update.incident_at = input.incidentAt;
  }
  if (input.exactLocation !== undefined) {
    update.exact_location = toGeographyPoint(input.exactLocation);
  }
  if (input.publicLocation !== undefined) {
    update.public_location = toGeographyPoint(input.publicLocation);
  }
  if (input.publicLocationPrecision !== undefined) {
    update.public_location_precision =
      input.publicLocationPrecision;
  }
  if (input.municipalityName !== undefined) {
    update.municipality_name = input.municipalityName;
  }
  if (input.locationIsSensitive !== undefined) {
    update.location_is_sensitive = input.locationIsSensitive;
  }
  if (input.contactMode !== undefined) {
    update.contact_mode = input.contactMode;
  }
  if (input.publicPhone !== undefined) {
    update.public_phone = input.publicPhone;
  }
  if (input.publicEmail !== undefined) {
    update.public_email = input.publicEmail;
  }
  if (input.resolutionType !== undefined) {
    update.resolution_type = input.resolutionType;
  }
  if (input.resolutionNotes !== undefined) {
    update.resolution_notes = input.resolutionNotes;
  }
  if (input.closureReason !== undefined) {
    update.closure_reason = input.closureReason;
  }

  return update;
};

export const mapSightingRow = (
  row: SightingRow,
): import('@buscohuella/report-domain').Sighting => ({
  id: row.id,
  reportId: row.report_id,
  createdBy: row.created_by,
  observedAt: row.observed_at,
  exactLocation:
    fromGeographyPoint(row.exact_location) ?? {
      latitude: 0,
      longitude: 0,
    },
  publicLocation: fromGeographyPoint(row.public_location),
  publicLocationPrecision:
    row.public_location_precision as import('@buscohuella/report-domain').Sighting['publicLocationPrecision'],
  notes: row.notes,
  confidence:
    row.confidence as import('@buscohuella/report-domain').Sighting['confidence'],
  reviewStatus:
    row.review_status as import('@buscohuella/report-domain').Sighting['reviewStatus'],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapCreateSightingToInsert = (
  createdBy: string,
  input: CreateSightingData,
): SightingInsert => ({
  report_id: input.reportId,
  created_by: createdBy,
  observed_at: input.observedAt,
  exact_location: toGeographyPoint(input.exactLocation),
  public_location: toGeographyPoint(input.publicLocation),
  public_location_precision: input.publicLocationPrecision,
  notes: input.notes ?? null,
  confidence: input.confidence,
  review_status: input.reviewStatus,
});

export const mapReportPhotoRow = (
  row: ReportPhotoRow,
): ReportPhoto => ({
  id: row.id,
  reportId: row.report_id,
  storagePath: row.storage_path,
  position: row.position,
  isPrimary: row.is_primary,
  altText: row.alt_text,
  mimeType: row.mime_type as ReportPhoto['mimeType'],
  fileSizeBytes: row.file_size_bytes,
  width: row.width,
  height: row.height,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapReportPhotoToInsert = (
  storagePath: string,
  input: ReportPhotoInput,
): ReportPhotoInsert => ({
  report_id: input.reportId,
  storage_path: storagePath,
  position: input.position,
  is_primary: input.isPrimary,
  alt_text: input.altText ?? null,
  mime_type: input.mimeType,
  file_size_bytes: input.fileSizeBytes,
  width: input.width,
  height: input.height,
});

export const mapReportEventRow = (
  row: ReportEventRow,
): ReportEvent => ({
  id: row.id,
  reportId: row.report_id,
  actorId: row.actor_id,
  eventType: row.event_type as ReportEvent['eventType'],
  fromStatus: row.from_status as ReportEvent['fromStatus'],
  toStatus: row.to_status as ReportEvent['toStatus'],
  metadata:
    typeof row.metadata === 'object' &&
    row.metadata !== null &&
    !Array.isArray(row.metadata)
      ? row.metadata
      : {},
  createdAt: row.created_at,
});

export const mapPublicReportRow = (
  row: PublicReportRow,
): PublicReport => ({
  id: row.id,
  reportType: row.report_type as PublicReport['reportType'],
  speciesId: row.species_id,
  title: row.title,
  description: row.description,
  incidentAt: row.incident_at,
  municipalityName: row.municipality_name,
  publicLocationPrecision:
    row.public_location_precision as PublicReport['publicLocationPrecision'],
  latitude: row.latitude,
  longitude: row.longitude,
  contactMode: row.contact_mode as PublicReport['contactMode'],
  publicPhone: row.public_phone,
  publicEmail: row.public_email,
  primaryPhotoId: row.primary_photo_id,
  publishedAt: row.published_at,
  updatedAt: row.updated_at,
});
