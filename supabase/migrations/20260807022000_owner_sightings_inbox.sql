-- FP-017C — bandeja global de avistamientos del propietario.

create or replace function
  public.get_owned_sightings()
returns table (
  id uuid,
  report_id uuid,
  report_title text,
  pet_name text,
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
    r.title,
    p.name,
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
  left join public.pets p
    on p.id = r.pet_id
  where r.created_by = auth.uid()
  order by
    case s.review_status
      when 'PENDING' then 0
      else 1
    end,
    s.observed_at desc,
    s.created_at desc;
$$;

revoke all on function
  public.get_owned_sightings()
from public;

grant execute on function
  public.get_owned_sightings()
to authenticated;
