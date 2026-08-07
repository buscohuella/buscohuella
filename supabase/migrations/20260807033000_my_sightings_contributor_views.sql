create or replace function public.get_my_sightings()
returns table (
  id uuid,
  report_id uuid,
  report_title text,
  pet_name text,
  report_status text,
  observed_at timestamptz,
  notes text,
  confidence text,
  review_status text,
  location_label text,
  location_source text,
  created_at timestamptz,
  updated_at timestamptz,
  photo_count bigint,
  report_resolved_at timestamptz,
  report_closed_at timestamptz
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select
    s.id,
    s.report_id,
    r.title,
    p.name,
    r.status,
    s.observed_at,
    s.notes,
    s.confidence,
    s.review_status,
    s.location_label,
    s.location_source,
    s.created_at,
    s.updated_at,
    (
      select count(*)
      from public.sighting_photos sp
      where sp.sighting_id = s.id
    ) as photo_count,
    r.resolved_at,
    r.closed_at
  from public.sightings s
  join public.reports r on r.id = s.report_id
  left join public.pets p on p.id = r.pet_id
  where s.created_by = auth.uid()
  order by s.created_at desc;
$$;

revoke all on function public.get_my_sightings() from public;
grant execute on function public.get_my_sightings() to authenticated;

create or replace function public.get_my_sighting(
  target_sighting_id uuid
)
returns table (
  id uuid,
  report_id uuid,
  report_title text,
  pet_name text,
  report_status text,
  observed_at timestamptz,
  notes text,
  confidence text,
  review_status text,
  location_label text,
  location_source text,
  exact_latitude double precision,
  exact_longitude double precision,
  created_at timestamptz,
  updated_at timestamptz,
  photo_count bigint,
  report_resolved_at timestamptz,
  report_closed_at timestamptz,
  last_reviewed_at timestamptz
)
language sql
stable
security definer
set search_path = public, extensions, pg_temp
as $$
  select
    s.id,
    s.report_id,
    r.title,
    p.name,
    r.status,
    s.observed_at,
    s.notes,
    s.confidence,
    s.review_status,
    s.location_label,
    s.location_source,
    case when s.exact_location is not null
      then extensions.st_y(s.exact_location::extensions.geometry)
    end,
    case when s.exact_location is not null
      then extensions.st_x(s.exact_location::extensions.geometry)
    end,
    s.created_at,
    s.updated_at,
    (
      select count(*)
      from public.sighting_photos sp
      where sp.sighting_id = s.id
    ) as photo_count,
    r.resolved_at,
    r.closed_at,
    (
      select max(re.created_at)
      from public.report_events re
      where re.report_id = s.report_id
        and re.event_type = 'SIGHTING_REVIEWED'
        and re.metadata ->> 'sighting_id' = s.id::text
    ) as last_reviewed_at
  from public.sightings s
  join public.reports r on r.id = s.report_id
  left join public.pets p on p.id = r.pet_id
  where s.id = target_sighting_id
    and s.created_by = auth.uid();
$$;

revoke all on function public.get_my_sighting(uuid) from public;
grant execute on function public.get_my_sighting(uuid) to authenticated;
