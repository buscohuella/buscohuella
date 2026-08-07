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

const BUCKET = 'sighting-photos';

export type MySighting = {
  id: string;
  reportId: string;
  reportTitle: string;
  petName: string | null;
  reportStatus: string;
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
  createdAt: string;
  updatedAt: string;
  photoCount: number;
  reportResolvedAt: string | null;
  reportClosedAt: string | null;
};

export type MySightingDetail =
  MySighting & {
    exactLatitude: number | null;
    exactLongitude: number | null;
    lastReviewedAt: string | null;
  };

export type MySightingPhoto = {
  id: string;
  signedUrl: string;
  altText: string | null;
  position: number;
};

export type MySightingTimelineEvent = {
  key: string;
  type:
    | 'SIGHTING_CREATED'
    | 'SIGHTING_REVIEWED'
    | 'PAUSED'
    | 'REACTIVATED'
    | 'RESOLVED'
    | 'CLOSED'
    | 'ARCHIVED';
  reviewStatus:
    | 'ACCEPTED'
    | 'REJECTED'
    | 'FLAGGED'
    | null;
  createdAt: string;
};

type RpcError = {
  code?: string;
  message?: string;
};

type ListRow = {
  id: string;
  report_id: string;
  report_title: string;
  pet_name: string | null;
  report_status: string;
  observed_at: string;
  notes: string | null;
  confidence: string;
  review_status: string;
  location_label: string | null;
  location_source: string;
  created_at: string;
  updated_at: string;
  photo_count: number | string;
  report_resolved_at: string | null;
  report_closed_at: string | null;
  total_count?: number | string;
};

type DetailRow = ListRow & {
  exact_latitude: number | null;
  exact_longitude: number | null;
  last_reviewed_at: string | null;
};

type TimelineRow = {
  event_key: string;
  event_type: string;
  review_status: string | null;
  created_at: string;
};

type ListResult = {
  data: ListRow[] | null;
  error: RpcError | null;
};

type DetailResult = {
  data: DetailRow[] | null;
  error: RpcError | null;
};

type TimelineResult = {
  data: TimelineRow[] | null;
  error: RpcError | null;
};

function mapListRow(
  row: ListRow,
): MySighting {
  return {
    id: row.id,
    reportId: row.report_id,
    reportTitle: row.report_title,
    petName: row.pet_name,
    reportStatus: row.report_status,
    observedAt: row.observed_at,
    notes: row.notes,
    confidence:
      row.confidence as MySighting['confidence'],
    reviewStatus:
      row.review_status as MySighting['reviewStatus'],
    locationLabel: row.location_label,
    locationSource:
      row.location_source as MySighting['locationSource'],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    photoCount: Number(row.photo_count),
    reportResolvedAt:
      row.report_resolved_at,
    reportClosedAt:
      row.report_closed_at,
  };
}

export async function listMySightingsPage({
  status = 'ALL',
  page = 1,
  pageSize = 20,
}: {
  status?:
    | 'ALL'
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'FLAGGED';
  page?: number;
  pageSize?: number;
}) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      sightings: [] as MySighting[],
      total: 0,
      page: 1,
      pageSize,
    };
  }

  const client =
    supabase as unknown as
      SupabaseClient<ReportDatabase>;

  const rpc =
    client.rpc.bind(
      client,
    ) as unknown as (
      name:
        'get_my_sightings_page',
      args: {
        target_status: string;
        target_page: number;
        target_page_size: number;
      },
    ) => Promise<ListResult>;

  const normalizedPage =
    Math.max(page, 1);
  const normalizedPageSize =
    Math.min(
      Math.max(pageSize, 1),
      50,
    );

  const { data, error } =
    await rpc(
      'get_my_sightings_page',
      {
        target_status: status,
        target_page:
          normalizedPage,
        target_page_size:
          normalizedPageSize,
      },
    );

  if (error) {
    throw error;
  }

  const rows = data ?? [];

  return {
    sightings:
      rows.map(mapListRow),
    total:
      rows.length > 0
        ? Number(
            rows[0].total_count ??
              0,
          )
        : 0,
    page: normalizedPage,
    pageSize:
      normalizedPageSize,
  };
}

export async function getMySighting(
  sightingId: string,
): Promise<MySightingDetail | null> {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const client =
    supabase as unknown as
      SupabaseClient<ReportDatabase>;

  const rpc =
    client.rpc.bind(
      client,
    ) as unknown as (
      name: 'get_my_sighting',
      args: {
        target_sighting_id: string;
      },
    ) => Promise<DetailResult>;

  const { data, error } =
    await rpc(
      'get_my_sighting',
      {
        target_sighting_id:
          sightingId,
      },
    );

  if (error) {
    throw error;
  }

  const row = data?.[0];

  if (!row) {
    return null;
  }

  return {
    ...mapListRow(row),
    exactLatitude:
      row.exact_latitude,
    exactLongitude:
      row.exact_longitude,
    lastReviewedAt:
      row.last_reviewed_at,
  };
}

export async function getMySightingTimeline(
  sightingId: string,
): Promise<MySightingTimelineEvent[]> {
  const supabase =
    await createClient();

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
    client.rpc.bind(
      client,
    ) as unknown as (
      name:
        'get_my_sighting_timeline',
      args: {
        target_sighting_id: string;
      },
    ) => Promise<TimelineResult>;

  const { data, error } =
    await rpc(
      'get_my_sighting_timeline',
      {
        target_sighting_id:
          sightingId,
      },
    );

  if (error) {
    throw error;
  }

  return (data ?? []).map(
    (row) => ({
      key: row.event_key,
      type:
        row.event_type as MySightingTimelineEvent['type'],
      reviewStatus:
        row.review_status as MySightingTimelineEvent['reviewStatus'],
      createdAt:
        row.created_at,
    }),
  );
}

export async function getMySightingPhotos(
  sightingId: string,
): Promise<MySightingPhoto[]> {
  const supabase =
    await createClient();

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
    .from(BUCKET)
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
      altText:
        photo.alt_text,
      position:
        photo.position,
      signedUrl:
        signed[index]
          ?.signedUrl ?? '',
    }))
    .filter(
      (photo) =>
        photo.signedUrl.length > 0,
    );
}
