import {
  Archive,
  BellRing,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flag,
  PauseCircle,
  PawPrint,
  PlayCircle,
  Send,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';

import { PageContainer } from '@/components/layout/page-container';
import {
  Card,
CardDescription,
CardHeader,
CardTitle,
} from '@/components/ui/card';
import { getServerTranslator } from '@/features/i18n/server';
import {
  markAllNotificationsReadAction,
  openNotificationAction,
} from '@/features/notifications/actions/notification-actions';
import {
  getUnreadNotificationCount,
  listMyNotificationsPage,
  notificationHref,
  notificationReviewStatus,
  type InternalNotification,
} from '@/features/notifications/lib/notifications';

const PAGE_SIZE = 10;

const FILTERS = [
  'ALL',
  'UNREAD',
  'READ',
] as const;

type Filter =
  typeof FILTERS[number];

type SearchParams = {
  estado?: string;
  pagina?: string;
};

function filterValue(
  raw: string | undefined,
): Filter {
  const value =
    raw?.toUpperCase();

  return FILTERS.includes(
    value as Filter,
  )
    ? (value as Filter)
    : 'ALL';
}

function pageValue(
  raw: string | undefined,
) {
  const value =
    Number(raw);

  return (
    Number.isInteger(value) &&
    value > 0
  )
    ? value
    : 1;
}

function hrefFor(
  filter: Filter,
  page = 1,
) {
  const params =
    new URLSearchParams();

  if (filter !== 'ALL') {
    params.set(
      'estado',
      filter.toLowerCase(),
    );
  }

  if (page > 1) {
    params.set(
      'pagina',
      String(page),
    );
  }

  const query =
    params.toString();

  return query
    ? `/notificaciones?${query}`
    : '/notificaciones';
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const raw =
    await searchParams;
  const filter =
    filterValue(raw.estado);
  const page =
    pageValue(raw.pagina);

  const [
    result,
    unreadCount,
    { locale, translate },
  ] = await Promise.all([
    listMyNotificationsPage({
      filter,
      page,
      pageSize: PAGE_SIZE,
    }),
    getUnreadNotificationCount(),
    getServerTranslator(),
  ]);

  const formatter =
    new Intl.DateTimeFormat(
      locale === 'ca'
        ? 'ca-ES'
        : 'es-ES',
      {
        dateStyle: 'medium',
        timeStyle: 'short',
      },
    );

  const totalPages =
    Math.max(
      Math.ceil(
        result.total /
          result.pageSize,
      ),
      1,
    );

  return (
    <PageContainer className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">
            {translate(
              'notifications.eyebrow',
            )}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            {translate(
              'notifications.title',
            )}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {translate(
              'notifications.description',
            )}
          </p>
        </div>

        {unreadCount > 0 ? (
          <form
            action={
              markAllNotificationsReadAction
            }
          >
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated"
            >
              <CheckCheck
                className="size-4"
                aria-hidden="true"
              />
              {translate(
                'notifications.markAllRead',
              )}
            </button>
          </form>
        ) : null}
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card
          elevated={
            unreadCount > 0
          }
        >
          <CardHeader>
            <CardDescription>
              {translate(
                'notifications.unread',
              )}
            </CardDescription>
            <CardTitle className="text-3xl">
              {unreadCount}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>
              {translate(
                'notifications.filtered',
              )}
            </CardDescription>
            <CardTitle className="text-3xl">
              {result.total}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <nav
        className="flex flex-wrap gap-2"
        aria-label={translate(
          'notifications.filtersLabel',
        )}
      >
        {FILTERS.map(
          (value) => (
            <Link
              key={value}
              href={hrefFor(
                value,
              )}
              aria-current={
                value === filter
                  ? 'page'
                  : undefined
              }
              className={
                value === filter
                  ? 'inline-flex min-h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground'
                  : 'inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated'
              }
            >
              {translate(
                `notifications.filters.${value}`,
              )}
            </Link>
          ),
        )}
      </nav>

      {result.notifications.length ===
      0 ? (
        <Card>
          <CardHeader>
            <div className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary">
              <BellRing
                className="size-5"
                aria-hidden="true"
              />
            </div>
            <CardTitle className="pt-2">
              {translate(
                'notifications.empty.title',
              )}
            </CardTitle>
            <CardDescription>
              {translate(
                'notifications.empty.description',
              )}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-3">
          {result.notifications.map(
            (notification) => (
              <NotificationRow
                key={
                  notification.id
                }
                notification={
                  notification
                }
                date={formatter.format(
                  new Date(
                    notification.createdAt,
                  ),
                )}
                translate={
                  translate
                }
              />
            ),
          )}
        </div>
      )}

      {totalPages > 1 ? (
        <nav
          className="flex items-center justify-between gap-4"
          aria-label={translate(
            'notifications.pagination.label',
          )}
        >
          {page > 1 ? (
            <Link
              href={hrefFor(
                filter,
                page - 1,
              )}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated"
            >
              <ChevronLeft
                className="size-4"
                aria-hidden="true"
              />
              {translate(
                'notifications.pagination.previous',
              )}
            </Link>
          ) : (
            <span />
          )}

          <span className="text-sm text-muted-foreground">
            {translate(
              'notifications.pagination.page',
              {
                page,
                total:
                  totalPages,
              },
            )}
          </span>

          {page < totalPages ? (
            <Link
              href={hrefFor(
                filter,
                page + 1,
              )}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-semibold hover:bg-surface-elevated"
            >
              {translate(
                'notifications.pagination.next',
              )}
              <ChevronRight
                className="size-4"
                aria-hidden="true"
              />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </PageContainer>
  );
}

type Translator = (
  key: string,
  values?: Record<
    string,
    string | number | boolean
  >,
) => string;

function NotificationRow({
  notification,
  date,
  translate,
}: {
  notification:
    InternalNotification;
  date: string;
  translate: Translator;
}) {
  const href =
    notificationHref(
      notification,
    );

  const subject =
    notification.petName ??
    notification.reportTitle ??
    translate(
      'notifications.genericReport',
    );

  const actor =
    notification.actorAlias ??
    translate(
      'notifications.someone',
    );

  const {
    title,
    description,
  } = notificationText(
    notification,
    translate,
    {
      subject,
      actor,
    },
  );

  return (
    <form
      action={
        openNotificationAction
      }
    >
      <input
        type="hidden"
        name="notificationId"
        value={notification.id}
      />
      <input
        type="hidden"
        name="href"
        value={href}
      />

      <button
        type="submit"
        className={
          notification.readAt
            ? 'flex w-full gap-4 rounded-2xl border border-border bg-surface p-4 text-left transition hover:bg-surface-elevated'
            : 'flex w-full gap-4 rounded-2xl border border-primary/30 bg-primary-soft/20 p-4 text-left transition hover:bg-primary-soft/35'
        }
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
          {renderNotificationIcon(
            notification,
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold">
              {title}
            </span>
            {!notification.readAt ? (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {translate(
                  'notifications.new',
                )}
              </span>
            ) : null}
          </span>

          <span className="mt-1 block text-sm text-muted-foreground">
            {description}
          </span>

          <span className="mt-2 block text-xs text-muted-foreground">
            {date}
          </span>
        </span>
      </button>
    </form>
  );
}

function notificationText(
  notification:
    InternalNotification,
  translate: Translator,
  values: {
    subject: string;
    actor: string;
  },
) {
  if (
    notification.kind ===
    'SIGHTING_REVIEWED'
  ) {
    const status =
      notificationReviewStatus(
        notification.metadata,
      );

    if (
      status === 'REJECTED' ||
      status === 'FLAGGED' ||
      status === 'ACCEPTED'
    ) {
      return {
        title: translate(
          `notifications.items.SIGHTING_REVIEWED.${status}.title`,
        ),
        description:
          translate(
            `notifications.items.SIGHTING_REVIEWED.${status}.description`,
            values,
          ),
      };
    }
  }

  return {
    title: translate(
      `notifications.items.${notification.kind}.title`,
    ),
    description:
      translate(
        `notifications.items.${notification.kind}.description`,
        values,
      ),
  };
}

function renderNotificationIcon(
  notification:
    InternalNotification,
) {
  const props = {
    className: 'size-5',
    'aria-hidden': true,
  } as const;

  if (
    notification.kind ===
    'NEW_SIGHTING'
  ) {
    return <Eye {...props} />;
  }

  if (
    notification.kind ===
    'SIGHTING_REVIEWED'
  ) {
    const status =
      notificationReviewStatus(
        notification.metadata,
      );

    if (
      status === 'REJECTED'
    ) {
      return (
        <XCircle
          {...props}
        />
      );
    }

    if (
      status === 'FLAGGED'
    ) {
      return (
        <Flag {...props} />
      );
    }

    return (
      <CheckCheck
        {...props}
      />
    );
  }

  if (
    notification.kind ===
    'REPORT_PAUSED'
  ) {
    return (
      <PauseCircle
        {...props}
      />
    );
  }

  if (
    notification.kind ===
    'REPORT_REACTIVATED'
  ) {
    return (
      <PlayCircle
        {...props}
      />
    );
  }

  if (
    notification.kind ===
    'REPORT_ARCHIVED'
  ) {
    return (
      <Archive
        {...props}
      />
    );
  }

  if (
    notification.kind ===
    'REPORT_RESOLVED'
  ) {
    return (
      <PawPrint
        {...props}
      />
    );
  }

  return <Send {...props} />;
}
