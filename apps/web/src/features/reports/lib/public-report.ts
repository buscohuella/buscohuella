import type {
  Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';

import { createClient } from '@/services/supabase/server';

const REPORT_PHOTOS_BUCKET =
  'report-photos';

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
  reportType:
    | 'LOST_PET'
    | 'FOUND_ANIMAL';
  speciesId: number;
  title: string;
  description: string;
  incidentAt: string | null;
  municipalityName: string | null;
  latitude: number | null;
  longitude: number | null;
  contactMode:
    | 'PLATFORM_ONLY'
    | 'PUBLIC_PHONE'
    | 'PUBLIC_EMAIL';
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

type RawPublicReport = {
  id: string;
  report_type: string;
  species_id: number;
  title: string;
  description: string;
  incident_at: string | null;
  municipality_name: string | null;
  latitude: number | null;
  longitude: number | null;
  contact_mode: string;
  public_phone: string | null;
  public_email: string | null;
  pet_name: string | null;
  pet_breed: string | null;
  pet_sex: string | null;
  pet_size: string | null;
  pet_primary_color: string | null;
  published_at: string;
  updated_at: string;
  photos: RawPhoto[] | null;
};

type PublicReportRpcResult = {
  data: RawPublicReport[] | null;
  error: {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  } | null;
};

type SignedUrlResult = {
  error: string | null;
  path: string | null;
  signedUrl: string | null;
};

function getPublicReportRpc(
  client: SupabaseClient<ReportDatabase>,
) {
  return client.rpc.bind(
    client,
  ) as unknown as (
    functionName: 'get_public_report',
    args: {
      target_report_id: string;
    },
  ) => Promise<PublicReportRpcResult>;
}

export async function getPublicReport(
  reportId: string,
): Promise<PublicReportDetail | null> {
  const supabase = await createClient();
  const reportClient =
    supabase as unknown as
      SupabaseClient<ReportDatabase>;
  const rpc =
    getPublicReportRpc(reportClient);

  const { data, error } = await rpc(
    'get_public_report',
    {
      target_report_id: reportId,
    },
  );

  if (error) {
    throw error;
  }

  const report = data?.[0];

  if (!report) {
    return null;
  }

  const rawPhotos = Array.isArray(
    report.photos,
  )
    ? report.photos
    : [];

  let signedUrls: SignedUrlResult[] = [];

  if (rawPhotos.length > 0) {
    const {
      data: signed,
      error: signError,
    } = await supabase.storage
      .from(REPORT_PHOTOS_BUCKET)
      .createSignedUrls(
        rawPhotos.map(
          (photo) =>
            photo.storage_path,
        ),
        900,
      );

    if (signError) {
      throw signError;
    }

    signedUrls = signed;
  }

  return {
    id: report.id,
    reportType:
      report.report_type as
        | 'LOST_PET'
        | 'FOUND_ANIMAL',
    speciesId: report.species_id,
    title: report.title,
    description: report.description,
    incidentAt: report.incident_at,
    municipalityName:
      report.municipality_name,
    latitude: report.latitude,
    longitude: report.longitude,
    contactMode:
      report.contact_mode as
        | 'PLATFORM_ONLY'
        | 'PUBLIC_PHONE'
        | 'PUBLIC_EMAIL',
    publicPhone: report.public_phone,
    publicEmail: report.public_email,
    petName: report.pet_name,
    petBreed: report.pet_breed,
    petSex: report.pet_sex,
    petSize: report.pet_size,
    petPrimaryColor:
      report.pet_primary_color,
    publishedAt: report.published_at,
    updatedAt: report.updated_at,
    photos: rawPhotos
      .map((photo, index) => ({
        id: photo.id,
        storagePath:
          photo.storage_path,
        position: photo.position,
        isPrimary:
          photo.is_primary,
        altText: photo.alt_text,
        width: photo.width,
        height: photo.height,
        signedUrl:
          signedUrls[index]
            ?.signedUrl ?? '',
      }))
      .filter(
        (photo) =>
          photo.signedUrl.length > 0,
      ),
  };
}
