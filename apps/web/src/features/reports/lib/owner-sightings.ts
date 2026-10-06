import type { Database as ReportDatabase } from '@buscohuella/report-data';
import type { SupabaseClient } from '@supabase/supabase-js';

import type { ReportDatabaseWithSightingPhotos } from '@/features/reports/lib/sighting-photo-database';
import { createClient } from '@/services/supabase/server';

const SIGHTING_PHOTOS_BUCKET = 'sighting-photos';

export type OwnerSighting = {
  id: string;
  reportId: string;
  reportTitle: string;
  petName: string | null;
  observedAt: string;
  notes: string | null;
  confidence: 'UNSURE' | 'POSSIBLE' | 'LIKELY' | 'CERTAIN';
  reviewStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'FLAGGED';
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
  archivedAt?: string | null;
};

export type OwnerSightingPhoto = {
  id: string;
  altText: string | null;
  position: number;
  signedUrl: string;
};

export type OwnerSightingFilters = {
  status?: 'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'FLAGGED';
  archive?: 'ACTIVE' | 'ARCHIVED' | 'ALL';
  hasPhotos?: boolean | null;
  sort?: 'RECENT' | 'OLDEST' | 'CONFIDENCE' | 'PHOTOS';
  page?: number;
  pageSize?: number;
};

export type OwnerSightingsSummary = {
  total: number;
  active: number;
  archived: number;
  pending: number;
  accepted: number;
  rejected: number;
  flagged: number;
  withPhotos: number;
};

type OwnerSightingRow =
  ReportDatabase['public']['Functions']['get_owned_sightings']['Returns'][number];

type OwnerSightingPageRow =
  ReportDatabase['public']['Functions']['get_owned_sightings_page']['Returns'][number];

function getClient(supabase: Awaited<ReturnType<typeof createClient>>) {
  return supabase as unknown as SupabaseClient<ReportDatabase>;
}

function mapRow(row: OwnerSightingRow | OwnerSightingPageRow): OwnerSighting {
  return {
    id: row.id,
    reportId: row.report_id,
    reportTitle: row.report_title,
    petName: row.pet_name,
    observedAt: row.observed_at,
    notes: row.notes,
    confidence: row.confidence as OwnerSighting['confidence'],
    reviewStatus: row.review_status as OwnerSighting['reviewStatus'],
    locationLabel: row.location_label,
    locationSource: row.location_source as OwnerSighting['locationSource'],
    publicLocationPrecision: row.public_location_precision,
    exactLatitude: row.exact_latitude,
    exactLongitude: row.exact_longitude,
    publicLatitude: row.public_latitude,
    publicLongitude: row.public_longitude,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    photoCount: Number(row.photo_count),
    archivedAt: 'archived_at' in row ? row.archived_at : null,
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

  const client = getClient(supabase);
  const { data, error } = await client.rpc('get_owned_sightings');

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapRow);
}

export async function listOwnedSightingsPage(filters: OwnerSightingFilters) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      sightings: [] as OwnerSighting[],
      total: 0,
      page: 1,
      pageSize: 20,
    };
  }

  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = Math.min(Math.max(filters.pageSize ?? 20, 1), 50);

  const client = getClient(supabase);
  const { data, error } = await client.rpc('get_owned_sightings_page', {
    target_status: filters.status ?? 'ALL',
    target_archive: filters.archive ?? 'ACTIVE',
    ...(filters.hasPhotos !== null && filters.hasPhotos !== undefined
      ? {
          target_has_photos: filters.hasPhotos,
        }
      : {}),
    target_sort: filters.sort ?? 'RECENT',
    target_page: page,
    target_page_size: pageSize,
  });

  if (error) {
    throw error;
  }

  const rows = data ?? [];

  return {
    sightings: rows.map(mapRow),
    total: rows.length > 0 ? Number(rows[0].total_count ?? 0) : 0,
    page,
    pageSize,
  };
}

export async function getOwnedSightingsSummary(): Promise<OwnerSightingsSummary> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      total: 0,
      active: 0,
      archived: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      flagged: 0,
      withPhotos: 0,
    };
  }

  const client = getClient(supabase);
  const { data, error } = await client.rpc('get_owned_sightings_summary');

  if (error) {
    throw error;
  }

  const row = data?.[0];

  if (!row) {
    return {
      total: 0,
      active: 0,
      archived: 0,
      pending: 0,
      accepted: 0,
      rejected: 0,
      flagged: 0,
      withPhotos: 0,
    };
  }

  return {
    total: Number(row.total),
    active: Number(row.active),
    archived: Number(row.archived),
    pending: Number(row.pending),
    accepted: Number(row.accepted),
    rejected: Number(row.rejected),
    flagged: Number(row.flagged),
    withPhotos: Number(row.with_photos),
  };
}

export async function getOwnedSighting(sightingId: string) {
  const sightings = await listOwnedSightings();

  return sightings.find((sighting) => sighting.id === sightingId) ?? null;
}

export async function getOwnedSightingArchiveState(sightingId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const client = getClient(supabase);
  const { data, error } = await client.rpc('get_owned_sighting_archive_state', {
    target_sighting_id: sightingId,
  });

  if (error) {
    throw error;
  }

  return data === true;
}

export async function getOwnedSightingPhotos(sightingId: string): Promise<OwnerSightingPhoto[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const client = supabase as unknown as SupabaseClient<ReportDatabaseWithSightingPhotos>;

  const { data: photos, error } = await client
    .from('sighting_photos')
    .select('id, storage_path, alt_text, position')
    .eq('sighting_id', sightingId)
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

  const { data: signed, error: signError } = await supabase.storage
    .from(SIGHTING_PHOTOS_BUCKET)
    .createSignedUrls(
      photos.map((photo) => photo.storage_path),
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
      signedUrl: signed[index]?.signedUrl ?? '',
    }))
    .filter((photo) => photo.signedUrl.length > 0);
}
