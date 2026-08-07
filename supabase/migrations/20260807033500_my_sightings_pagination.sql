create or replace function public.get_my_sightings_page(
  target_status text default 'ALL',
  target_page integer default 1,
  target_page_size integer default 20
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
  created_at timestamptz,
  updated_at timestamptz,
  photo_count bigint,
  report_resolved_at timestamptz,
  report_closed_at timestamptz,
  total_count bigint
)
language plpgsql
stable
security definer
set search_path = public, pg_temp
as $$
declare
  normalized_status text := upper(coalesce(target_status, 'ALL'));
  normalized_page integer := greatest(coalesce(target_page, 1), 1);
  normalized_page_size integer := least(greatest(coalesce(target_page_size, 20), 1), 50);
begin
  if normalized_status not in ('ALL','PENDING','ACCEPTED','REJECTED','FLAGGED') then
    raise exception 'MY_SIGHTINGS_STATUS_INVALID' using errcode = '22023';
  end if;

  return query
  with base as (
    select
      s.id,
      s.report_id,
      r.title as report_title,
      p.name as pet_name,
      r.status as report_status,
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
      )::bigint as photo_count,
      r.resolved_at as report_resolved_at,
      r.closed_at as report_closed_at
    from public.sightings s
    join public.reports r on r.id = s.report_id
    left join public.pets p on p.id = r.pet_id
    where s.created_by = auth.uid()
      and (normalized_status = 'ALL' or s.review_status = normalized_status)
  ), counted as (
    select base.*, count(*) over() as total_count
    from base
  )
  select
    counted.id,
    counted.report_id,
    counted.report_title,
    counted.pet_name,
    counted.report_status,
    counted.observed_at,
    counted.notes,
    counted.confidence,
    counted.review_status,
    counted.location_label,
    counted.location_source,
    counted.created_at,
    counted.updated_at,
    counted.photo_count,
    counted.report_resolved_at,
    counted.report_closed_at,
    counted.total_count
  from counted
  order by counted.created_at desc
  limit normalized_page_size
  offset (normalized_page - 1) * normalized_page_size;
end;
$$;

revoke all on function public.get_my_sightings_page(text, integer, integer) from public;
grant execute on function public.get_my_sightings_page(text, integer, integer) to authenticated;
