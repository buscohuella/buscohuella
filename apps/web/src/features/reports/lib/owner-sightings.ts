import type {
  Database as ReportDatabase,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';

import type {
  ReportDatabaseWithSightingPhotos,
} from '@/features/reports/lib/sighting-photo-database';
import { createClient } from '@/services/supabase/server';

const SIGHTING_PHOTOS_BUCKET =
  'sighting-photos';

export type OwnerSighting = {
  id: string;
  reportId: string;
  reportTitle: string;
  petName: string | null;
  observedAt: string;
  notes: string | null;
  confidence:
    | 'UNSURE'
    | 'POSSIBLE'
    | 'LIKELY'
    | 'CERTAIN';
  reviewStatus:
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'FLAGGED';
  locationLabel: string | null;
  locationSource: 'GPS' | 'MANUAL';
  publicLocationPrecision: string;
  exactLatitude: number | null;
  exactLongitude: number | null;
  publicLatitude: number | null;
  publicLongitude: number | null;
  createdAt: string;
  updatedAt: string;
  photoCount: number;
};

export type OwnerSightingPhoto = {
  id: string;
  altText: string | null;
  position: number;
  signedUrl: string;
};

type OwnerSightingRpcRow = {
  id: string;
  report_id: string;
  report_title: string;
  pet_name: string | null;
  observed_at: string;
  notes: string | null;
  confidence: string;
  review_status: string;
  location_label: string | null;
  location_source: string;
  public_location_precision: string;
  exact_latitude: number | null;
  exact_longitude: number | null;
  public_latitude: number | null;
  public_longitude: number | null;
  created_at: string;
  updated_at: string;
  photo_count: number | string;
};

type OwnerSightingsRpcResult = {
  data: OwnerSightingRpcRow[] | null;
  error: {
    code?: string;
    message?: string;
    details?: string;
    hint?: string;
  } | null;
};

function getOwnedSightingsRpc(
  client: SupabaseClient<ReportDatabase>,
) {
  return client.rpc.bind(
    client,
  ) as unknown as (
    name: 'get_owned_sightings',
  ) => Promise<OwnerSightingsRpcResult>;
}

function mapRow(
  row: OwnerSightingRpcRow,
): OwnerSighting {
  return {
    id: row.id,
    reportId: row.report_id,
    reportTitle: row.report_title,
    petName: row.pet_name,
    observedAt: row.observed_at,
    notes: row.notes,
    confidence:
      row.confidence as OwnerSighting['confidence'],
    reviewStatus:
      row.review_status as OwnerSighting['reviewStatus'],
    locationLabel: row.location_label,
    locationSource:
      row.location_source as OwnerSighting['locationSource'],
    publicLocationPrecision:
      row.public_location_precision,
    exactLatitude: row.exact_latitude,
    exactLongitude: row.exact_longitude,
    publicLatitude: row.public_latitude,
    publicLongitude: row.public_longitude,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    photoCount: Number(row.photo_count),
  };
}

export async function listOwnedSightings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const client =
    supabase as unknown as
      SupabaseClient<ReportDatabase>;
  const rpc =
    getOwnedSightingsRpc(client);

  const { data, error } =
    await rpc('get_owned_sightings');

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapRow);
}

export async function getOwnedSighting(
  sightingId: string,
) {
  const sightings =
    await listOwnedSightings();

  return (
    sightings.find(
      (sighting) =>
        sighting.id === sightingId,
    ) ?? null
  );
}

export async function getOwnedSightingPhotos(
  sightingId: string,
): Promise<OwnerSightingPhoto[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const client =
    supabase as unknown as
      SupabaseClient<ReportDatabaseWithSightingPhotos>;

  const { data: photos, error } =
    await client
      .from('sighting_photos')
      .select(
        'id, storage_path, alt_text, position',
      )
      .eq(
        'sighting_id',
        sightingId,
      )
      .order('position', {
        ascending: true,
      })
      .order('created_at', {
        ascending: true,
      });

  if (error) {
    throw error;
  }

  if (!photos?.length) {
    return [];
  }

  const {
    data: signed,
    error: signError,
  } = await supabase.storage
    .from(SIGHTING_PHOTOS_BUCKET)
    .createSignedUrls(
      photos.map(
        (photo) =>
          photo.storage_path,
      ),
      900,
    );

  if (signError) {
    throw signError;
  }

  return photos
    .map((photo, index) => ({
      id: photo.id,
      altText: photo.alt_text,
      position: photo.position,
      signedUrl:
        signed[index]?.signedUrl ?? '',
    }))
    .filter(
      (photo) =>
        photo.signedUrl.length > 0,
    );
}
