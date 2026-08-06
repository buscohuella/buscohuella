import type { Json } from '@buscohuella/report-data';

type EventItem = {
  id: number;
  event_type: string;
  metadata: Json;
  created_at: string;
};
type Translator = (key: string, values?: Record<string, string | number | boolean>) => string;

function isPhotoUpdate(metadata: Json) {
  if (!metadata || Array.isArray(metadata) || typeof metadata !== 'object') return false;
  const fields = metadata.changed_fields;
  return Array.isArray(fields) && fields.includes('photos');
}

export function CompactReportHistory({ events, translate, formatDate }: { events: EventItem[]; translate: Translator; formatDate: (value: string) => string }) {
  const compact: Array<{ id: string; type: string; createdAt: string; count: number }> = [];
  for (const event of events) {
    const type = event.event_type === 'UPDATED' && isPhotoUpdate(event.metadata) ? 'PHOTOS_UPDATED' : event.event_type;
    const previous = compact.at(-1);
    if (previous && type === 'PHOTOS_UPDATED' && previous.type === type) previous.count += 1;
    else compact.push({ id: String(event.id), type, createdAt: event.created_at, count: 1 });
    if (compact.length >= 6) break;
  }
  return <>{compact.length > 0 ? <ol className="relative border-l border-border-soft pl-6">{compact.map((event) => <li key={event.id} className="relative pb-5 last:pb-0"><span className="absolute -left-[1.82rem] top-1 size-3 rounded-full border-2 border-background bg-primary" /><p className="font-semibold">{event.type === 'PHOTOS_UPDATED' ? translate('reportVisual.photosUpdated') : translate(`reports.detail.events.${event.type}`)}</p>{event.count > 1 ? <p className="text-sm text-muted-foreground">{translate('reportVisual.changes', { count: event.count })}</p> : null}<p className="mt-1 text-sm text-muted-foreground">{formatDate(event.createdAt)}</p></li>)}</ol> : <p className="text-sm text-muted-foreground">{translate('reports.detail.historyEmpty')}</p>}<p className="mt-5 border-t border-border-soft pt-4 text-xs text-muted-foreground">{translate('reportVisual.historyMore')}</p></>;
}
