-- FP-017C — evento de revisión de avistamiento.

alter table public.report_events
drop constraint if exists
  report_events_type_check;

alter table public.report_events
add constraint
  report_events_type_check
check (
  event_type = any (
    array[
      'CREATED'::text,
      'PUBLISHED'::text,
      'PAUSED'::text,
      'REACTIVATED'::text,
      'UPDATED'::text,
      'SIGHTING_CREATED'::text,
      'SIGHTING_REVIEWED'::text,
      'RESOLVED'::text,
      'CLOSED'::text,
      'ARCHIVED'::text
    ]
  )
);
