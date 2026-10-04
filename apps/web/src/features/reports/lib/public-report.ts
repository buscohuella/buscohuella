import type { Database as ReportDatabase } from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';

import { createClient } from '@/services/supabase/server';

const REPORT_PHOTOS_BUCKET = 'report-photos';

export type PublicReportPhoto = {
  id: string;
  storagePath: string;
  position: number;
  isPrimary: boolean;
  altText: string | null;
  width: number | null;
  height: number | null;
  signedUrl: string;
};

export type PublicReportDetail = {
  id: string;
  reportType: 'LOST_PET' | 'FOUND_ANIMAL';
  speciesId: number;
  title: string;
  description: string;
  incidentAt: string | null;
  municipalityName: string | null;
  latitude: number | null;
  longitude: number | null;
  contactMode: 'PLATFORM_ONLY' | 'PUBLIC_PHONE' | 'PUBLIC_EMAIL';
  publicPhone: string | null;
  publicEmail: string | null;
  petName: string | null;
  petBreed: string | null;
  petSex: string | null;
  petSize: string | null;
  petPrimaryColor: string | null;
  publishedAt: string;
  updatedAt: string;
  photos: PublicReportPhoto[];
};

type RawPhoto = {
  id: string;
  storage_path: string;
  position: number;
  is_primary: boolean;
  alt_text: string | null;
  width: number | null;
  height: number | null;
};

type SignedUrlResult = {
  error: string | null;
  path: string | null;
  signedUrl: string | null;
};

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string';
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || typeof value === 'number';
}

function isRawPhoto(value: unknown): value is RawPhoto {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const photo = value as Record<string, unknown>;

  return (
    typeof photo.id === 'string' &&
    typeof photo.storage_path === 'string' &&
    typeof photo.position === 'number' &&
    typeof photo.is_primary === 'boolean' &&
    isNullableString(photo.alt_text) &&
    isNullableNumber(photo.width) &&
    isNullableNumber(photo.height)
  );
}

function parseRawPhotos(value: unknown): RawPhoto[] {
  if (!Array.isArray(value) || !value.every(isRawPhoto)) {
    throw new Error('Invalid public report photos payload');
  }

  return value;
}

export async function getPublicReport(reportId: string): Promise<PublicReportDetail | null> {
  const supabase = await createClient();
  const reportClient = supabase as unknown as SupabaseClient<ReportDatabase>;
  const { data, error } = await reportClient.rpc('get_public_report', {
    target_report_id: reportId,
  });

  if (error) {
    throw error;
  }

  const report = data?.[0];

  if (!report) {
    return null;
  }

  const rawPhotos = parseRawPhotos(report.photos);

  let signedUrls: SignedUrlResult[] = [];

  if (rawPhotos.length > 0) {
    const { data: signed, error: signError } = await supabase.storage
      .from(REPORT_PHOTOS_BUCKET)
      .createSignedUrls(
        rawPhotos.map((photo) => photo.storage_path),
        900,
      );

    if (signError) {
      throw signError;
    }

    signedUrls = signed;
  }

  return {
    id: report.id,
    reportType: report.report_type as 'LOST_PET' | 'FOUND_ANIMAL',
    speciesId: report.species_id,
    title: report.title,
    description: report.description,
    incidentAt: report.incident_at,
    municipalityName: report.municipality_name,
    latitude: report.latitude,
    longitude: report.longitude,
    contactMode: report.contact_mode as 'PLATFORM_ONLY' | 'PUBLIC_PHONE' | 'PUBLIC_EMAIL',
    publicPhone: report.public_phone,
    publicEmail: report.public_email,
    petName: report.pet_name,
    petBreed: report.pet_breed,
    petSex: report.pet_sex,
    petSize: report.pet_size,
    petPrimaryColor: report.pet_primary_color,
    publishedAt: report.published_at,
    updatedAt: report.updated_at,
    photos: rawPhotos
      .map((photo, index) => ({
        id: photo.id,
        storagePath: photo.storage_path,
        position: photo.position,
        isPrimary: photo.is_primary,
        altText: photo.alt_text,
        width: photo.width,
        height: photo.height,
        signedUrl: signedUrls[index]?.signedUrl ?? '',
      }))
      .filter((photo) => photo.signedUrl.length > 0),
  };
}
