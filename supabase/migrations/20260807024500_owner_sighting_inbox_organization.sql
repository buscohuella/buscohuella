create table if not exists public.sighting_owner_states (
  sighting_id uuid primary key references public.sightings(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  archived_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.sighting_owner_states enable row level security;
revoke all on table public.sighting_owner_states from anon, authenticated;

create index if not exists sighting_owner_states_owner_archived_idx
on public.sighting_owner_states(owner_id, archived_at);

create or replace function public.set_owned_sighting_archived(
  target_sighting_id uuid,
  target_archived boolean
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  target_owner uuid;
  target_status text;
begin
  if auth.uid() is null then
    raise exception 'SIGHTING_ARCHIVE_AUTH_REQUIRED' using errcode = '42501';
  end if;

  select r.created_by, s.review_status
  into target_owner, target_status
  from public.sightings s
  join public.reports r on r.id = s.report_id
  where s.id = target_sighting_id;

  if target_owner is null then
    raise exception 'SIGHTING_NOT_FOUND' using errcode = 'P0002';
  end if;

  if target_owner <> auth.uid() then
    raise exception 'SIGHTING_ARCHIVE_FORBIDDEN' using errcode = '42501';
  end if;

  if target_archived and target_status not in ('ACCEPTED', 'REJECTED') then
    raise exception 'SIGHTING_ARCHIVE_REVIEW_REQUIRED' using errcode = '23514';
  end if;

  insert into public.sighting_owner_states (
    sighting_id, owner_id, archived_at, updated_at
  ) values (
    target_sighting_id,
    auth.uid(),
    case when target_archived then timezone('utc', now()) else null end,
    timezone('utc', now())
  )
  on conflict (sighting_id) do update
  set
    owner_id = excluded.owner_id,
    archived_at = excluded.archived_at,
    updated_at = timezone('utc', now());

  return true;
end;
$$;

revoke all on function public.set_owned_sighting_archived(uuid, boolean) from public;
grant execute on function public.set_owned_sighting_archived(uuid, boolean) to authenticated;

create or replace function public.get_owned_sighting_archive_state(
  target_sighting_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select coalesce(sos.archived_at is not null, false)
  from public.sightings s
  join public.reports r on r.id = s.report_id
  left join public.sighting_owner_states sos
    on sos.sighting_id = s.id
    and sos.owner_id = r.created_by
  where s.id = target_sighting_id
    and r.created_by = auth.uid();
$$;

revoke all on function public.get_owned_sighting_archive_state(uuid) from public;
grant execute on function public.get_owned_sighting_archive_state(uuid) to authenticated;

create or replace function public.get_owned_sightings_summary()
returns table (
  total bigint,
  active bigint,
  archived bigint,
  pending bigint,
  accepted bigint,
  rejected bigint,
  flagged bigint,
  with_photos bigint
)
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  with owned as (
    select
      s.id,
      s.review_status,
      sos.archived_at,
      exists (
        select 1
        from public.sighting_photos sp
        where sp.sighting_id = s.id
      ) as has_photos
    from public.sightings s
    join public.reports r on r.id = s.report_id
    left join public.sighting_owner_states sos
      on sos.sighting_id = s.id
      and sos.owner_id = r.created_by
    where r.created_by = auth.uid()
  )
  select
    count(*),
    count(*) filter (where archived_at is null),
    count(*) filter (where archived_at is not null),
    count(*) filter (where review_status = 'PENDING' and archived_at is null),
    count(*) filter (where review_status = 'ACCEPTED' and archived_at is null),
    count(*) filter (where review_status = 'REJECTED' and archived_at is null),
    count(*) filter (where review_status = 'FLAGGED' and archived_at is null),
    count(*) filter (where has_photos)
  from owned;
$$;

revoke all on function public.get_owned_sightings_summary() from public;
grant execute on function public.get_owned_sightings_summary() to authenticated;

create or replace function public.get_owned_sightings_page(
  target_status text default 'ALL',
  target_archive text default 'ACTIVE',
  target_has_photos boolean default null,
  target_sort text default 'RECENT',
  target_page integer default 1,
  target_page_size integer default 20
)
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
  photo_count bigint,
  archived_at timestamptz,
  total_count bigint
)
language plpgsql
stable
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  normalized_status text := upper(coalesce(target_status, 'ALL'));
  normalized_archive text := upper(coalesce(target_archive, 'ACTIVE'));
  normalized_sort text := upper(coalesce(target_sort, 'RECENT'));
  normalized_page integer := greatest(coalesce(target_page, 1), 1);
  normalized_page_size integer := least(greatest(coalesce(target_page_size, 20), 1), 50);
begin
  if normalized_status not in ('ALL','PENDING','ACCEPTED','REJECTED','FLAGGED') then
    raise exception 'SIGHTING_FILTER_STATUS_INVALID' using errcode = '22023';
  end if;
  if normalized_archive not in ('ACTIVE','ARCHIVED','ALL') then
    raise exception 'SIGHTING_FILTER_ARCHIVE_INVALID' using errcode = '22023';
  end if;
  if normalized_sort not in ('RECENT','OLDEST','CONFIDENCE','PHOTOS') then
    raise exception 'SIGHTING_FILTER_SORT_INVALID' using errcode = '22023';
  end if;

  return query
  with base as (
    select
      s.id,
      s.report_id,
      r.title as report_title,
      p.name as pet_name,
      s.observed_at,
      s.notes,
      s.confidence,
      s.review_status,
      s.location_label,
      s.location_source,
      s.public_location_precision,
      case when s.exact_location is not null
        then extensions.st_y(s.exact_location::extensions.geometry)
      end as exact_latitude,
      case when s.exact_location is not null
        then extensions.st_x(s.exact_location::extensions.geometry)
      end as exact_longitude,
      case when s.public_location is not null
        then extensions.st_y(s.public_location::extensions.geometry)
      end as public_latitude,
      case when s.public_location is not null
        then extensions.st_x(s.public_location::extensions.geometry)
      end as public_longitude,
      s.created_at,
      s.updated_at,
      coalesce(pc.photo_count, 0)::bigint as photo_count,
      sos.archived_at,
      case s.confidence
        when 'CERTAIN' then 4
        when 'LIKELY' then 3
        when 'POSSIBLE' then 2
        else 1
      end as confidence_rank
    from public.sightings s
    join public.reports r on r.id = s.report_id
    left join public.pets p on p.id = r.pet_id
    left join public.sighting_owner_states sos
      on sos.sighting_id = s.id
      and sos.owner_id = r.created_by
    left join lateral (
      select count(*) as photo_count
      from public.sighting_photos sp
      where sp.sighting_id = s.id
    ) pc on true
    where r.created_by = auth.uid()
      and (normalized_status = 'ALL' or s.review_status = normalized_status)
      and (
        normalized_archive = 'ALL'
        or (normalized_archive = 'ACTIVE' and sos.archived_at is null)
        or (normalized_archive = 'ARCHIVED' and sos.archived_at is not null)
      )
      and (
        target_has_photos is null
        or (target_has_photos and coalesce(pc.photo_count, 0) > 0)
        or (not target_has_photos and coalesce(pc.photo_count, 0) = 0)
      )
  ), counted as (
    select base.*, count(*) over() as total_count
    from base
  )
  select
    counted.id,
    counted.report_id,
    counted.report_title,
    counted.pet_name,
    counted.observed_at,
    counted.notes,
    counted.confidence,
    counted.review_status,
    counted.location_label,
    counted.location_source,
    counted.public_location_precision,
    counted.exact_latitude,
    counted.exact_longitude,
    counted.public_latitude,
    counted.public_longitude,
    counted.created_at,
    counted.updated_at,
    counted.photo_count,
    counted.archived_at,
    counted.total_count
  from counted
  order by
    case when normalized_sort = 'RECENT' then counted.observed_at end desc,
    case when normalized_sort = 'OLDEST' then counted.observed_at end asc,
    case when normalized_sort = 'CONFIDENCE' then counted.confidence_rank end desc,
    case when normalized_sort = 'PHOTOS' then counted.photo_count end desc,
    counted.observed_at desc,
    counted.created_at desc
  limit normalized_page_size
  offset (normalized_page - 1) * normalized_page_size;
end;
$$;

revoke all on function public.get_owned_sightings_page(text, text, boolean, text, integer, integer) from public;
grant execute on function public.get_owned_sightings_page(text, text, boolean, text, integer, integer) to authenticated;
