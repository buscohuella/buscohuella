create or replace function public.get_my_sighting_timeline(
  target_sighting_id uuid
)
returns table (
  event_key text,
  event_type text,
  review_status text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  with own_sighting as (
    select s.id, s.report_id, s.created_at
    from public.sightings s
    where s.id = target_sighting_id
      and s.created_by = auth.uid()
  ),
  sighting_created as (
    select
      'sighting_created'::text as event_key,
      'SIGHTING_CREATED'::text as event_type,
      null::text as review_status,
      min(re.created_at) as created_at
    from own_sighting os
    join public.report_events re
      on re.report_id = os.report_id
    where re.event_type = 'SIGHTING_CREATED'
      and re.metadata ->> 'sighting_id' = os.id::text
  ),
  reviews as (
    select
      'sighting_reviewed:' || re.id::text as event_key,
      re.event_type,
      re.metadata ->> 'review_status' as review_status,
      re.created_at
    from own_sighting os
    join public.report_events re
      on re.report_id = os.report_id
    where re.event_type = 'SIGHTING_REVIEWED'
      and re.metadata ->> 'sighting_id' = os.id::text
  ),
  report_events_dedup as (
    select distinct on (
      re.event_type,
      re.created_at
    )
      'report:' ||
        re.event_type ||
        ':' ||
        re.created_at::text as event_key,
      re.event_type,
      null::text as review_status,
      re.created_at
    from own_sighting os
    join public.report_events re
      on re.report_id = os.report_id
    where re.event_type in (
      'PAUSED',
      'REACTIVATED',
      'RESOLVED',
      'CLOSED',
      'ARCHIVED'
    )
      and re.created_at >= os.created_at
    order by
      re.event_type,
      re.created_at,
      re.id
  )
  select *
  from sighting_created
  where created_at is not null

  union all

  select *
  from reviews

  union all

  select *
  from report_events_dedup

  order by created_at asc;
$$;

revoke all on function
  public.get_my_sighting_timeline(uuid)
from public;

grant execute on function
  public.get_my_sighting_timeline(uuid)
to authenticated;
