import type {
  Json,
} from '@buscohuella/report-data';

type EventItem = {
  id: number;
  event_type: string;
  metadata: Json;
  created_at: string;
};

type Translator = (
  key: string,
  values?: Record<
    string,
    string | number | boolean
  >,
) => string;

type CompactEvent = {
  id: string;
  type: string;
  createdAt: string;
  count: number;
  reviewStatus: string | null;
};

function metadataObject(metadata: Json) {
  if (
    !metadata ||
    Array.isArray(metadata) ||
    typeof metadata !== 'object'
  ) {
    return null;
  }

  return metadata as Record<
    string,
    Json | undefined
  >;
}

function isPhotoUpdate(metadata: Json) {
  const object =
    metadataObject(metadata);

  if (!object) {
    return false;
  }

  const fields =
    object.changed_fields;

  return (
    Array.isArray(fields) &&
    fields.includes('photos')
  );
}

function getReviewStatus(
  metadata: Json,
) {
  const object =
    metadataObject(metadata);

  const value =
    object?.review_status;

  return typeof value === 'string'
    ? value
    : null;
}

function eventLabel(
  event: CompactEvent,
  translate: Translator,
) {
  if (
    event.type ===
    'PHOTOS_UPDATED'
  ) {
    return translate(
      'reportVisual.photosUpdated',
    );
  }

  if (
    event.type ===
      'SIGHTING_REVIEWED' &&
    event.reviewStatus
  ) {
    return translate(
      `reports.detail.sightingReview.${event.reviewStatus}`,
    );
  }

  return translate(
    `reports.detail.events.${event.type}`,
  );
}

export function CompactReportHistory({
  events,
  translate,
  formatDate,
}: {
  events: EventItem[];
  translate: Translator;
  formatDate: (
    value: string,
  ) => string;
}) {
  const compact: CompactEvent[] = [];
  const seen = new Set<string>();

  for (const event of events) {
    const type =
      event.event_type === 'UPDATED' &&
      isPhotoUpdate(event.metadata)
        ? 'PHOTOS_UPDATED'
        : event.event_type;

    const reviewStatus =
      type === 'SIGHTING_REVIEWED'
        ? getReviewStatus(
            event.metadata,
          )
        : null;

    const dedupeKey = [
      type,
      reviewStatus ?? '',
      event.created_at,
    ].join(':');

    if (seen.has(dedupeKey)) {
      continue;
    }

    seen.add(dedupeKey);

    const previous =
      compact.at(-1);

    if (
      previous &&
      type === 'PHOTOS_UPDATED' &&
      previous.type === type
    ) {
      previous.count += 1;
      continue;
    }

    compact.push({
      id: String(event.id),
      type,
      createdAt:
        event.created_at,
      count: 1,
      reviewStatus,
    });

    if (compact.length >= 6) {
      break;
    }
  }

  return (
    <>
      {compact.length > 0 ? (
        <ol className="relative border-l border-border-soft pl-6">
          {compact.map((event) => (
            <li
              key={event.id}
              className="relative pb-5 last:pb-0"
            >
              <span className="absolute -left-[1.82rem] top-1 size-3 rounded-full border-2 border-background bg-primary" />
              <p className="font-semibold">
                {eventLabel(
                  event,
                  translate,
                )}
              </p>
              {event.count > 1 ? (
                <p className="text-sm text-muted-foreground">
                  {translate(
                    'reportVisual.changes',
                    {
                      count:
                        event.count,
                    },
                  )}
                </p>
              ) : null}
              <p className="mt-1 text-sm text-muted-foreground">
                {formatDate(
                  event.createdAt,
                )}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-muted-foreground">
          {translate(
            'reports.detail.historyEmpty',
          )}
        </p>
      )}

      <p className="mt-5 border-t border-border-soft pt-4 text-xs text-muted-foreground">
        {translate(
          'reportVisual.historyMore',
        )}
      </p>
    </>
  );
}
