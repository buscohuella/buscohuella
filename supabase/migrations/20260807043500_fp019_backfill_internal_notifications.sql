with created_events as (
  select distinct on ((re.metadata ->> 'sighting_id'))
    re.id, re.report_id, re.actor_id, re.created_at,
    (re.metadata ->> 'sighting_id')::uuid as sighting_id,
    re.metadata
  from public.report_events re
  where re.event_type = 'SIGHTING_CREATED'
    and nullif(re.metadata ->> 'sighting_id', '') is not null
  order by (re.metadata ->> 'sighting_id'), re.created_at asc, re.id asc
)
insert into public.notifications (
  recipient_id, kind, report_id, sighting_id, actor_id,
  source_event_id, metadata, created_at
)
select
  r.created_by, 'NEW_SIGHTING', ce.report_id, ce.sighting_id,
  coalesce(ce.actor_id, s.created_by), ce.id,
  jsonb_build_object('confidence', ce.metadata ->> 'confidence'),
  ce.created_at
from created_events ce
join public.sightings s on s.id = ce.sighting_id and s.report_id = ce.report_id
join public.reports r on r.id = ce.report_id
where r.created_by <> s.created_by
on conflict do nothing;

with review_events as (
  select distinct on (
    re.metadata ->> 'sighting_id',
    re.metadata ->> 'review_status',
    re.created_at
  )
    re.id, re.report_id, re.actor_id, re.created_at,
    (re.metadata ->> 'sighting_id')::uuid as sighting_id,
    re.metadata ->> 'review_status' as review_status
  from public.report_events re
  where re.event_type = 'SIGHTING_REVIEWED'
    and nullif(re.metadata ->> 'sighting_id', '') is not null
  order by
    re.metadata ->> 'sighting_id',
    re.metadata ->> 'review_status',
    re.created_at,
    re.id
)
insert into public.notifications (
  recipient_id, kind, report_id, sighting_id, actor_id,
  source_event_id, metadata, created_at
)
select
  s.created_by, 'SIGHTING_REVIEWED', re.report_id, re.sighting_id,
  coalesce(re.actor_id, r.created_by), re.id,
  jsonb_build_object('review_status', re.review_status),
  re.created_at
from review_events re
join public.sightings s on s.id = re.sighting_id and s.report_id = re.report_id
join public.reports r on r.id = re.report_id
where s.created_by <> coalesce(re.actor_id, r.created_by)
on conflict do nothing;

with lifecycle_events as (
  select distinct on (re.report_id, re.event_type, re.created_at)
    re.id, re.report_id, re.actor_id, re.event_type, re.created_at
  from public.report_events re
  where re.event_type in ('PAUSED','REACTIVATED','RESOLVED','CLOSED','ARCHIVED')
  order by re.report_id, re.event_type, re.created_at, re.id
), contributors as (
  select distinct on (s.report_id, s.created_by)
    s.report_id, s.created_by, s.id as sighting_id
  from public.sightings s
  join public.reports r on r.id = s.report_id
  where s.created_by <> r.created_by
  order by s.report_id, s.created_by, s.created_at desc
)
insert into public.notifications (
  recipient_id, kind, report_id, sighting_id, actor_id,
  source_event_id, metadata, created_at
)
select
  c.created_by,
  case le.event_type
    when 'PAUSED' then 'REPORT_PAUSED'
    when 'REACTIVATED' then 'REPORT_REACTIVATED'
    when 'RESOLVED' then 'REPORT_RESOLVED'
    when 'CLOSED' then 'REPORT_CLOSED'
    when 'ARCHIVED' then 'REPORT_ARCHIVED'
  end,
  le.report_id, c.sighting_id, le.actor_id, le.id, '{}'::jsonb,
  le.created_at
from lifecycle_events le
join contributors c on c.report_id = le.report_id
on conflict do nothing;
