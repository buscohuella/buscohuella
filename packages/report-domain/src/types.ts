import type {
  REPORT_CONTACT_MODES,
  REPORT_EVENT_TYPES,
  REPORT_LOCATION_PRECISIONS,
  REPORT_PHOTO_MIME_TYPES,
  REPORT_RESOLUTION_TYPES,
  REPORT_STATUSES,
  REPORT_TYPES,
  SIGHTING_CONFIDENCE_VALUES,
  SIGHTING_REVIEW_STATUSES,
} from './constants.js';

export type ReportType = (typeof REPORT_TYPES)[number];
export type ReportStatus = (typeof REPORT_STATUSES)[number];
export type ReportResolutionType =
  (typeof REPORT_RESOLUTION_TYPES)[number];
export type ReportLocationPrecision =
  (typeof REPORT_LOCATION_PRECISIONS)[number];
export type ReportContactMode =
  (typeof REPORT_CONTACT_MODES)[number];
export type SightingConfidence =
  (typeof SIGHTING_CONFIDENCE_VALUES)[number];
export type SightingReviewStatus =
  (typeof SIGHTING_REVIEW_STATUSES)[number];
export type ReportEventType =
  (typeof REPORT_EVENT_TYPES)[number];
export type ReportPhotoMimeType =
  (typeof REPORT_PHOTO_MIME_TYPES)[number];

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface Report {
  id: string;
  createdBy: string;
  reportType: ReportType;
  petId: string | null;
  speciesId: number;
  status: ReportStatus;
  title: string | null;
  description: string | null;
  incidentAt: string | null;
  exactLocation: GeoPoint | null;
  publicLocation: GeoPoint | null;
  publicLocationPrecision: ReportLocationPrecision;
  municipalityName: string | null;
  locationIsSensitive: boolean;
  contactMode: ReportContactMode;
  publicPhone: string | null;
  publicEmail: string | null;
  resolutionType: ReportResolutionType | null;
  resolutionNotes: string | null;
  closureReason: string | null;
  publishedAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportPhoto {
  id: string;
  reportId: string;
  storagePath: string;
  position: number;
  isPrimary: boolean;
  altText: string | null;
  mimeType: ReportPhotoMimeType | null;
  fileSizeBytes: number | null;
  width: number | null;
  height: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Sighting {
  id: string;
  reportId: string;
  createdBy: string;
  observedAt: string;
  exactLocation: GeoPoint;
  publicLocation: GeoPoint | null;
  publicLocationPrecision: ReportLocationPrecision;
  notes: string | null;
  confidence: SightingConfidence;
  reviewStatus: SightingReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ReportEvent {
  id: number;
  reportId: string;
  actorId: string | null;
  eventType: ReportEventType;
  fromStatus: ReportStatus | null;
  toStatus: ReportStatus | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PublicReport {
  id: string;
  reportType: ReportType;
  speciesId: number;
  title: string;
  description: string;
  incidentAt: string;
  municipalityName: string | null;
  publicLocationPrecision: ReportLocationPrecision;
  latitude: number | null;
  longitude: number | null;
  contactMode: ReportContactMode;
  publicPhone: string | null;
  publicEmail: string | null;
  primaryPhotoId: string | null;
  publishedAt: string;
  updatedAt: string;
}
