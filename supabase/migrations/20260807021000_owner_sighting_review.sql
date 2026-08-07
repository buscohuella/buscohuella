-- FP-017C — bandeja y revisión segura de avistamientos del propietario.

create or replace function public.get_owned_report_sightings(
  target_report_id uuid
)
returns table (
  id uuid,
  report_id uuid,
  observed_at timestamptz,
  notes text,
  confidence text,
  review_status text,
  location_label text,
  location_source text,
  public_location_precision text,
  exact_latitude double precision,
  exact_longitude double precision,
  public_latitude double precision,
  public_longitude double precision,
  created_at timestamptz,
  updated_at timestamptz,
  photo_count bigint
)
language sql
stable
security definer
set search_path = public, extensions, pg_temp
as $$
  select
    s.id,
    s.report_id,
    s.observed_at,
    s.notes,
    s.confidence,
    s.review_status,
    s.location_label,
    s.location_source,
    s.public_location_precision,
    case when s.exact_location is not null
      then extensions.st_y(
        s.exact_location::extensions.geometry
      )
    end,
    case when s.exact_location is not null
      then extensions.st_x(
        s.exact_location::extensions.geometry
      )
    end,
    case when s.public_location is not null
      then extensions.st_y(
        s.public_location::extensions.geometry
      )
    end,
    case when s.public_location is not null
      then extensions.st_x(
        s.public_location::extensions.geometry
      )
    end,
    s.created_at,
    s.updated_at,
    (
      select count(*)
      from public.sighting_photos sp
      where sp.sighting_id = s.id
    )
  from public.sightings s
  join public.reports r
    on r.id = s.report_id
  where s.report_id = target_report_id
    and r.created_by = auth.uid()
  order by
    s.observed_at desc,
    s.created_at desc;
$$;

revoke all on function
  public.get_owned_report_sightings(uuid)
from public;

grant execute on function
  public.get_owned_report_sightings(uuid)
to authenticated;

create or replace function
  public.review_owned_report_sighting(
    target_sighting_id uuid,
    target_status text
  )
returns public.sightings
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_sighting public.sightings;
  target_report public.reports;
begin
  if auth.uid() is null then
    raise exception
      'SIGHTING_REVIEW_AUTH_REQUIRED'
      using errcode = '42501';
  end if;

  if target_status not in (
    'ACCEPTED',
    'REJECTED',
    'FLAGGED'
  ) then
    raise exception
      'SIGHTING_REVIEW_STATUS_INVALID'
      using errcode = '23514';
  end if;

  select s.*
  into target_sighting
  from public.sightings s
  where s.id = target_sighting_id;

  if target_sighting.id is null then
    raise exception
      'SIGHTING_NOT_FOUND'
      using errcode = 'P0002';
  end if;

  select r.*
  into target_report
  from public.reports r
  where
    r.id = target_sighting.report_id
    and r.created_by = auth.uid();

  if target_report.id is null then
    raise exception
      'SIGHTING_REVIEW_FORBIDDEN'
      using errcode = '42501';
  end if;

  update public.sightings
  set
    review_status = target_status,
    updated_at = timezone(
      'utc',
      now()
    )
  where id = target_sighting_id
  returning *
  into target_sighting;

  insert into public.report_events (
    report_id,
    actor_id,
    event_type,
    from_status,
    to_status,
    metadata
  )
  values (
    target_report.id,
    auth.uid(),
    'SIGHTING_REVIEWED',
    target_report.status,
    target_report.status,
    jsonb_build_object(
      'sighting_id',
      target_sighting_id,
      'review_status',
      target_status
    )
  );

  return target_sighting;
end;
$$;

revoke all on function
  public.review_owned_report_sighting(
    uuid,
    text
  )
from public;

grant execute on function
  public.review_owned_report_sighting(
    uuid,
    text
  )
to authenticated;
