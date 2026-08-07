import type {
  Database as ReportDatabase,
  Json,
} from '@buscohuella/report-data';
import type {
  SupabaseClient,
} from '@supabase/supabase-js';

import { createClient } from '@/services/supabase/server';

export type NotificationKind =
  | 'NEW_SIGHTING'
  | 'SIGHTING_REVIEWED'
  | 'REPORT_PAUSED'
  | 'REPORT_REACTIVATED'
  | 'REPORT_RESOLVED'
  | 'REPORT_CLOSED'
  | 'REPORT_ARCHIVED';

export type InternalNotification = {
  id: string;
  kind: NotificationKind;
  reportId: string | null;
  sightingId: string | null;
  metadata: Json;
  readAt: string | null;
  createdAt: string;
  reportTitle: string | null;
  petName: string | null;
  actorAlias: string | null;
};

type NotificationRow = {
  id: string;
  kind: string;
  report_id: string | null;
  sighting_id: string | null;
  metadata: Json;
  read_at: string | null;
  created_at: string;
  report_title: string | null;
  pet_name: string | null;
  actor_alias: string | null;
  total_count: number | string;
};

type RpcError = {
  code?: string;
  message?: string;
};

type PageResult = {
  data: NotificationRow[] | null;
  error: RpcError | null;
};

type CountResult = {
  data: number | string | null;
  error: RpcError | null;
};

function clientForRpc(
  client: Awaited<
    ReturnType<typeof createClient>
  >,
) {
  return client as unknown as
    SupabaseClient<ReportDatabase>;
}

export async function listMyNotificationsPage({
  filter = 'ALL',
  page = 1,
  pageSize = 20,
}: {
  filter?: 'ALL' | 'UNREAD' | 'READ';
  page?: number;
  pageSize?: number;
}) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const normalizedPage =
    Math.max(page, 1);
  const normalizedPageSize =
    Math.min(
      Math.max(pageSize, 1),
      50,
    );

  if (!user) {
    return {
      notifications:
        [] as InternalNotification[],
      total: 0,
      page: normalizedPage,
      pageSize:
        normalizedPageSize,
    };
  }

  const client =
    clientForRpc(supabase);
  const rpc =
    client.rpc.bind(
      client,
    ) as unknown as (
      name:
        'get_my_notifications_page',
      args: {
        target_filter: string;
        target_page: number;
        target_page_size: number;
      },
    ) => Promise<PageResult>;

  const { data, error } =
    await rpc(
      'get_my_notifications_page',
      {
        target_filter: filter,
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
    notifications:
      rows.map(
        (row): InternalNotification => ({
          id: row.id,
          kind:
            row.kind as NotificationKind,
          reportId:
            row.report_id,
          sightingId:
            row.sighting_id,
          metadata:
            row.metadata,
          readAt:
            row.read_at,
          createdAt:
            row.created_at,
          reportTitle:
            row.report_title,
          petName:
            row.pet_name,
          actorAlias:
            row.actor_alias,
        }),
      ),
    total:
      rows.length > 0
        ? Number(
            rows[0].total_count,
          )
        : 0,
    page: normalizedPage,
    pageSize:
      normalizedPageSize,
  };
}

export async function getUnreadNotificationCount() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return 0;
  }

  const client =
    clientForRpc(supabase);
  const rpc =
    client.rpc.bind(
      client,
    ) as unknown as (
      name:
        'get_unread_notification_count',
    ) => Promise<CountResult>;

  const { data, error } =
    await rpc(
      'get_unread_notification_count',
    );

  if (error) {
    throw error;
  }

  return Number(data ?? 0);
}

export function notificationHref(
  notification: InternalNotification,
) {
  if (
    notification.kind ===
      'NEW_SIGHTING' &&
    notification.sightingId
  ) {
    return `/avistamientos/${notification.sightingId}`;
  }

  if (
    notification.sightingId &&
    notification.kind !==
      'NEW_SIGHTING'
  ) {
    return `/mis-avistamientos/${notification.sightingId}`;
  }

  if (notification.reportId) {
    return `/reportes/${notification.reportId}`;
  }

  return '/notificaciones';
}

export function notificationReviewStatus(
  metadata: Json,
) {
  if (
    !metadata ||
    Array.isArray(metadata) ||
    typeof metadata !== 'object'
  ) {
    return null;
  }

  const status =
    metadata.review_status;

  return typeof status === 'string'
    ? status
    : null;
}
