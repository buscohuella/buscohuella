-- FP-010 — Dominio y base de datos de reportes
-- Crea el núcleo privado y seguro para:
--   - mascotas perdidas;
--   - animales encontrados;
--   - fotografías de reporte;
--   - avistamientos;
--   - eventos auditables.
--
-- La exposición pública se realiza únicamente mediante una función segura.

create schema if not exists extensions;

create extension if not exists postgis
  with schema extensions;

-- ---------------------------------------------------------------------------
-- REPORTS
-- ---------------------------------------------------------------------------

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null
    references public.profiles(id)
    on delete restrict,
  report_type text not null,
  pet_id uuid
    references public.pets(id)
    on delete restrict,
  species_id smallint not null
    references public.pet_species(id)
    on delete restrict,

  status text not null default 'DRAFT',
  title text,
  description text,
  incident_at timestamptz,

  exact_location extensions.geography(Point, 4326),
  public_location extensions.geography(Point, 4326),
  public_location_precision text not null default 'APPROXIMATE_500M',
  municipality_name text,
  location_is_sensitive boolean not null default false,

  contact_mode text not null default 'PLATFORM_ONLY',
  public_phone text,
  public_email text,

  resolution_type text,
  resolution_notes text,
  closure_reason text,

  published_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  archived_at timestamptz,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint reports_type_check
    check (report_type in ('LOST_PET', 'FOUND_ANIMAL')),

  constraint reports_status_check
    check (
      status in (
        'DRAFT',
        'ACTIVE',
        'PAUSED',
        'RESOLVED',
        'CLOSED',
        'ARCHIVED'
      )
    ),

  constraint reports_title_length_check
    check (title is null or char_length(btrim(title)) between 1 and 120),

  constraint reports_description_length_check
    check (
      description is null
      or char_length(btrim(description)) between 1 and 4000
    ),

  constraint reports_municipality_length_check
    check (
      municipality_name is null
      or char_length(btrim(municipality_name)) between 1 and 160
    ),

  constraint reports_public_location_precision_check
    check (
      public_location_precision in (
        'EXACT_AREA',
        'APPROXIMATE_100M',
        'APPROXIMATE_500M',
        'APPROXIMATE_1KM',
        'MUNICIPALITY_ONLY',
        'HIDDEN'
      )
    ),

  constraint reports_contact_mode_check
    check (
      contact_mode in (
        'PLATFORM_ONLY',
        'PUBLIC_PHONE',
        'PUBLIC_EMAIL',
        'HIDDEN'
      )
    ),

  constraint reports_resolution_type_check
    check (
      resolution_type is null
      or resolution_type in (
        'REUNITED',
        'OWNER_LOCATED',
        'TRANSFERRED_TO_AUTHORITY',
        'TRANSFERRED_TO_SHELTER',
        'SAFE_WITH_FINDER',
        'OTHER'
      )
    ),

  constraint reports_resolution_notes_length_check
    check (
      resolution_notes is null
      or char_length(btrim(resolution_notes)) between 1 and 2000
    ),

  constraint reports_closure_reason_length_check
    check (
      closure_reason is null
      or char_length(btrim(closure_reason)) between 1 and 1000
    ),

  constraint reports_public_phone_length_check
    check (
      public_phone is null
      or char_length(btrim(public_phone)) between 6 and 40
    ),

  constraint reports_public_email_length_check
    check (
      public_email is null
      or char_length(btrim(public_email)) between 3 and 320
    )
);

comment on table public.reports is
  'Incidencias temporales de mascotas perdidas y animales encontrados.';

comment on column public.reports.exact_location is
  'Ubicación privada. No debe exponerse en proyecciones públicas.';

comment on column public.reports.public_location is
  'Ubicación degradada o protegida para mapa y listados públicos.';

-- ---------------------------------------------------------------------------
-- REPORT PHOTOS
-- ---------------------------------------------------------------------------

create table public.report_photos (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null
    references public.reports(id)
    on delete cascade,
  storage_path text not null,
  position smallint not null default 0,
  is_primary boolean not null default false,
  alt_text text,
  mime_type text,
  file_size_bytes integer,
  width integer,
  height integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint report_photos_storage_path_not_blank
    check (char_length(btrim(storage_path)) between 1 and 500),

  constraint report_photos_position_check
    check (position between 0 and 9),

  constraint report_photos_alt_text_length_check
    check (alt_text is null or char_length(alt_text) <= 300),

  constraint report_photos_mime_type_check
    check (
      mime_type is null
      or mime_type in ('image/jpeg', 'image/png', 'image/webp')
    ),

  constraint report_photos_file_size_check
    check (
      file_size_bytes is null
      or file_size_bytes between 1 and 8388608
    ),

  constraint report_photos_dimensions_check
    check (
      (width is null and height is null)
      or (
        width between 1 and 10000
        and height between 1 and 10000
      )
    )
);

-- ---------------------------------------------------------------------------
-- SIGHTINGS
-- ---------------------------------------------------------------------------

create table public.sightings (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null
    references public.reports(id)
    on delete restrict,
  created_by uuid not null
    references public.profiles(id)
    on delete restrict,

  observed_at timestamptz not null,
  exact_location extensions.geography(Point, 4326) not null,
  public_location extensions.geography(Point, 4326),
  public_location_precision text not null default 'APPROXIMATE_500M',
  notes text,
  confidence text not null default 'UNSURE',
  review_status text not null default 'PENDING',

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint sightings_public_location_precision_check
    check (
      public_location_precision in (
        'EXACT_AREA',
        'APPROXIMATE_100M',
        'APPROXIMATE_500M',
        'APPROXIMATE_1KM',
        'MUNICIPALITY_ONLY',
        'HIDDEN'
      )
    ),

  constraint sightings_notes_length_check
    check (
      notes is null
      or char_length(btrim(notes)) between 1 and 2000
    ),

  constraint sightings_confidence_check
    check (confidence in ('UNSURE', 'POSSIBLE', 'LIKELY', 'CERTAIN')),

  constraint sightings_review_status_check
    check (
      review_status in (
        'PENDING',
        'ACCEPTED',
        'REJECTED',
        'FLAGGED'
      )
    )
);

create table public.sighting_photos (
  id uuid primary key default gen_random_uuid(),
  sighting_id uuid not null
    references public.sightings(id)
    on delete cascade,
  storage_path text not null,
  position smallint not null default 0,
  alt_text text,
  mime_type text,
  file_size_bytes integer,
  width integer,
  height integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint sighting_photos_storage_path_not_blank
    check (char_length(btrim(storage_path)) between 1 and 500),

  constraint sighting_photos_position_check
    check (position between 0 and 4),

  constraint sighting_photos_alt_text_length_check
    check (alt_text is null or char_length(alt_text) <= 300),

  constraint sighting_photos_mime_type_check
    check (
      mime_type is null
      or mime_type in ('image/jpeg', 'image/png', 'image/webp')
    ),

  constraint sighting_photos_file_size_check
    check (
      file_size_bytes is null
      or file_size_bytes between 1 and 8388608
    ),

  constraint sighting_photos_dimensions_check
    check (
      (width is null and height is null)
      or (
        width between 1 and 10000
        and height between 1 and 10000
      )
    )
);

-- ---------------------------------------------------------------------------
-- IMMUTABLE AUDIT EVENTS
-- ---------------------------------------------------------------------------

create table public.report_events (
  id bigint generated always as identity primary key,
  report_id uuid not null
    references public.reports(id)
    on delete restrict,
  actor_id uuid
    references public.profiles(id)
    on delete set null,
  event_type text not null,
  from_status text,
  to_status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),

  constraint report_events_type_check
    check (
      event_type in (
        'CREATED',
        'PUBLISHED',
        'PAUSED',
        'REACTIVATED',
        'UPDATED',
        'SIGHTING_CREATED',
        'RESOLVED',
        'CLOSED',
        'ARCHIVED'
      )
    ),

  constraint report_events_metadata_object_check
    check (jsonb_typeof(metadata) = 'object')
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------

create index reports_created_by_status_updated_idx
  on public.reports(created_by, status, updated_at desc);

create index reports_type_status_incident_idx
  on public.reports(report_type, status, incident_at desc);

create index reports_species_status_idx
  on public.reports(species_id, status);

create index reports_public_location_gist_idx
  on public.reports
  using gist(public_location);

create index reports_exact_location_gist_idx
  on public.reports
  using gist(exact_location);

create unique index reports_one_open_lost_pet_idx
  on public.reports(pet_id)
  where report_type = 'LOST_PET'
    and pet_id is not null
    and status in ('DRAFT', 'ACTIVE', 'PAUSED');

create index report_photos_report_position_idx
  on public.report_photos(report_id, position);

create unique index report_photos_storage_path_key
  on public.report_photos(storage_path);

create unique index report_photos_one_primary_idx
  on public.report_photos(report_id)
  where is_primary = true;

create index sightings_report_observed_idx
  on public.sightings(report_id, observed_at desc);

create index sightings_created_by_created_idx
  on public.sightings(created_by, created_at desc);

create index sightings_public_location_gist_idx
  on public.sightings
  using gist(public_location);

create index sightings_exact_location_gist_idx
  on public.sightings
  using gist(exact_location);

create index sighting_photos_sighting_position_idx
  on public.sighting_photos(sighting_id, position);

create unique index sighting_photos_storage_path_key
  on public.sighting_photos(storage_path);

create index report_events_report_created_idx
  on public.report_events(report_id, created_at desc);

-- ---------------------------------------------------------------------------
-- SECURITY-DEFINER HELPERS
-- ---------------------------------------------------------------------------

create or replace function public.owns_report(target_report_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.reports
    where id = target_report_id
      and created_by = (select auth.uid())
  );
$$;

revoke all on function public.owns_report(uuid) from public;
grant execute on function public.owns_report(uuid) to authenticated;

create or replace function public.report_accepts_sightings(
  target_report_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.reports
    where id = target_report_id
      and status = 'ACTIVE'
      and published_at is not null
  );
$$;

revoke all on function public.report_accepts_sightings(uuid) from public;
grant execute on function public.report_accepts_sightings(uuid)
  to authenticated;

-- ---------------------------------------------------------------------------
-- REPORT VALIDATION AND LIFECYCLE
-- ---------------------------------------------------------------------------

create or replace function public.validate_report_write()
returns trigger
language plpgsql
security invoker
set search_path = public, extensions, pg_temp
as $$
declare
  linked_pet public.pets%rowtype;
  allowed_transition boolean;
begin
  if tg_op = 'INSERT' then
    if new.created_by is distinct from (select auth.uid()) then
      raise exception 'REPORT_OWNER_INVALID'
        using errcode = '42501';
    end if;
  else
    if new.created_by is distinct from old.created_by then
      raise exception 'REPORT_OWNER_IMMUTABLE'
        using errcode = '42501';
    end if;

    if old.status <> 'DRAFT'
       and (
         new.report_type is distinct from old.report_type
         or new.pet_id is distinct from old.pet_id
         or new.species_id is distinct from old.species_id
       ) then
      raise exception 'REPORT_IDENTITY_IMMUTABLE_AFTER_PUBLICATION'
        using errcode = '22023';
    end if;

    if new.status is distinct from old.status then
      allowed_transition := (
        (old.status = 'DRAFT' and new.status in ('ACTIVE', 'CLOSED'))
        or (old.status = 'ACTIVE' and new.status in ('PAUSED', 'RESOLVED', 'CLOSED'))
        or (old.status = 'PAUSED' and new.status in ('ACTIVE', 'RESOLVED', 'CLOSED'))
        or (old.status in ('RESOLVED', 'CLOSED') and new.status = 'ARCHIVED')
      );

      if not allowed_transition then
        raise exception 'REPORT_STATUS_TRANSITION_INVALID: % -> %',
          old.status,
          new.status
          using errcode = '22023';
      end if;
    end if;
  end if;

  if new.report_type = 'LOST_PET' then
    if new.pet_id is null then
      raise exception 'LOST_REPORT_REQUIRES_PET'
        using errcode = '23514';
    end if;

    select *
    into linked_pet
    from public.pets
    where id = new.pet_id;

    if not found then
      raise exception 'REPORT_PET_NOT_FOUND'
        using errcode = '23503';
    end if;

    if linked_pet.owner_id is distinct from new.created_by then
      raise exception 'REPORT_PET_NOT_OWNED'
        using errcode = '42501';
    end if;

    if linked_pet.status <> 'ACTIVE' then
      raise exception 'REPORT_PET_NOT_ACTIVE'
        using errcode = '23514';
    end if;

    if linked_pet.species_id is distinct from new.species_id then
      raise exception 'REPORT_SPECIES_MISMATCH'
        using errcode = '23514';
    end if;
  elsif new.report_type = 'FOUND_ANIMAL' and new.pet_id is not null then
    raise exception 'FOUND_REPORT_MUST_NOT_REFERENCE_PET'
      using errcode = '23514';
  end if;

  if new.incident_at is not null and new.incident_at > now() then
    raise exception 'REPORT_INCIDENT_IN_FUTURE'
      using errcode = '22007';
  end if;

  if new.contact_mode = 'PUBLIC_PHONE' then
    if new.public_phone is null or btrim(new.public_phone) = '' then
      raise exception 'REPORT_PUBLIC_PHONE_REQUIRED'
        using errcode = '23514';
    end if;
  elsif new.public_phone is not null then
    raise exception 'REPORT_PUBLIC_PHONE_NOT_ALLOWED'
      using errcode = '23514';
  end if;

  if new.contact_mode = 'PUBLIC_EMAIL' then
    if new.public_email is null or btrim(new.public_email) = '' then
      raise exception 'REPORT_PUBLIC_EMAIL_REQUIRED'
        using errcode = '23514';
    end if;
  elsif new.public_email is not null then
    raise exception 'REPORT_PUBLIC_EMAIL_NOT_ALLOWED'
      using errcode = '23514';
  end if;

  if new.public_location_precision = 'HIDDEN' then
    new.public_location := null;
  end if;

  if new.status in ('ACTIVE', 'PAUSED', 'RESOLVED') then
    if new.title is null or btrim(new.title) = '' then
      raise exception 'REPORT_TITLE_REQUIRED'
        using errcode = '23514';
    end if;

    if new.description is null or btrim(new.description) = '' then
      raise exception 'REPORT_DESCRIPTION_REQUIRED'
        using errcode = '23514';
    end if;

    if new.incident_at is null then
      raise exception 'REPORT_INCIDENT_REQUIRED'
        using errcode = '23514';
    end if;

    if new.exact_location is null then
      raise exception 'REPORT_EXACT_LOCATION_REQUIRED'
        using errcode = '23514';
    end if;

    if new.public_location_precision <> 'HIDDEN'
       and new.public_location is null then
      raise exception 'REPORT_PUBLIC_LOCATION_REQUIRED'
        using errcode = '23514';
    end if;
  end if;

  if tg_op = 'INSERT' then
    if new.status = 'ACTIVE' and new.published_at is null then
      new.published_at := timezone('utc', now());
    end if;
  elsif new.status is distinct from old.status then
    if new.status = 'ACTIVE' and new.published_at is null then
      new.published_at := timezone('utc', now());
    elsif new.status = 'RESOLVED' then
      if new.resolution_type is null then
        raise exception 'REPORT_RESOLUTION_REQUIRED'
          using errcode = '23514';
      end if;

      new.resolved_at := coalesce(
        new.resolved_at,
        timezone('utc', now())
      );
    elsif new.status = 'CLOSED' then
      if new.closure_reason is null
         or btrim(new.closure_reason) = '' then
        raise exception 'REPORT_CLOSURE_REASON_REQUIRED'
          using errcode = '23514';
      end if;

      new.closed_at := coalesce(
        new.closed_at,
        timezone('utc', now())
      );
    elsif new.status = 'ARCHIVED' then
      new.archived_at := coalesce(
        new.archived_at,
        timezone('utc', now())
      );
    end if;
  end if;

  if new.status <> 'RESOLVED'
     and (
       new.resolution_type is not null
       or new.resolved_at is not null
     ) then
    raise exception 'REPORT_RESOLUTION_STATE_INVALID'
      using errcode = '23514';
  end if;

  if new.status <> 'CLOSED'
     and (
       new.closure_reason is not null
       or new.closed_at is not null
     ) then
    raise exception 'REPORT_CLOSURE_STATE_INVALID'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger reports_validate_write
before insert or update on public.reports
for each row
execute function public.validate_report_write();

create trigger reports_set_updated_at
before update on public.reports
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- SIGHTING VALIDATION
-- ---------------------------------------------------------------------------

create or replace function public.validate_sighting_write()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'INSERT' then
    if new.created_by is distinct from (select auth.uid()) then
      raise exception 'SIGHTING_OWNER_INVALID'
        using errcode = '42501';
    end if;

    if not public.report_accepts_sightings(new.report_id) then
      raise exception 'REPORT_NOT_ACCEPTING_SIGHTINGS'
        using errcode = '23514';
    end if;
  else
    if new.created_by is distinct from old.created_by then
      raise exception 'SIGHTING_OWNER_IMMUTABLE'
        using errcode = '42501';
    end if;

    if new.report_id is distinct from old.report_id then
      raise exception 'SIGHTING_REPORT_IMMUTABLE'
        using errcode = '22023';
    end if;
  end if;

  if new.observed_at > now() then
    raise exception 'SIGHTING_OBSERVED_IN_FUTURE'
      using errcode = '22007';
  end if;

  if new.public_location_precision = 'HIDDEN' then
    new.public_location := null;
  elsif new.public_location is null then
    raise exception 'SIGHTING_PUBLIC_LOCATION_REQUIRED'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger sightings_validate_write
before insert or update on public.sightings
for each row
execute function public.validate_sighting_write();

create trigger sightings_set_updated_at
before update on public.sightings
for each row
execute function public.set_updated_at();

create trigger report_photos_set_updated_at
before update on public.report_photos
for each row
execute function public.set_updated_at();

create trigger sighting_photos_set_updated_at
before update on public.sighting_photos
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- AUDIT EVENTS
-- ---------------------------------------------------------------------------

create or replace function public.audit_report_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  audit_event_type text;
begin
  if tg_op = 'INSERT' then
    audit_event_type := case
      when new.status = 'ACTIVE' then 'PUBLISHED'
      else 'CREATED'
    end;

    insert into public.report_events (
      report_id,
      actor_id,
      event_type,
      from_status,
      to_status,
      metadata
    )
    values (
      new.id,
      new.created_by,
      audit_event_type,
      null,
      new.status,
      jsonb_build_object('report_type', new.report_type)
    );

    return new;
  end if;

  if new.status is distinct from old.status then
    audit_event_type := case new.status
      when 'ACTIVE' then
        case
          when old.status = 'PAUSED' then 'REACTIVATED'
          else 'PUBLISHED'
        end
      when 'PAUSED' then 'PAUSED'
      when 'RESOLVED' then 'RESOLVED'
      when 'CLOSED' then 'CLOSED'
      when 'ARCHIVED' then 'ARCHIVED'
      else 'UPDATED'
    end;
  else
    audit_event_type := 'UPDATED';
  end if;

  insert into public.report_events (
    report_id,
    actor_id,
    event_type,
    from_status,
    to_status,
    metadata
  )
  values (
    new.id,
    (select auth.uid()),
    audit_event_type,
    old.status,
    new.status,
    '{}'::jsonb
  );

  return new;
end;
$$;

create trigger reports_audit_change
after insert or update on public.reports
for each row
execute function public.audit_report_change();

create or replace function public.audit_sighting_created()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.report_events (
    report_id,
    actor_id,
    event_type,
    from_status,
    to_status,
    metadata
  )
  values (
    new.report_id,
    new.created_by,
    'SIGHTING_CREATED',
    null,
    null,
    jsonb_build_object('sighting_id', new.id)
  );

  return new;
end;
$$;

create trigger sightings_audit_created
after insert on public.sightings
for each row
execute function public.audit_sighting_created();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.reports enable row level security;
alter table public.report_photos enable row level security;
alter table public.sightings enable row level security;
alter table public.sighting_photos enable row level security;
alter table public.report_events enable row level security;

create policy reports_select_own
on public.reports
for select
to authenticated
using (created_by = (select auth.uid()));

create policy reports_insert_own
on public.reports
for insert
to authenticated
with check (created_by = (select auth.uid()));

create policy reports_update_own
on public.reports
for update
to authenticated
using (created_by = (select auth.uid()))
with check (created_by = (select auth.uid()));

create policy report_photos_select_owner
on public.report_photos
for select
to authenticated
using (public.owns_report(report_id));

create policy report_photos_insert_owner
on public.report_photos
for insert
to authenticated
with check (public.owns_report(report_id));

create policy report_photos_update_owner
on public.report_photos
for update
to authenticated
using (public.owns_report(report_id))
with check (public.owns_report(report_id));

create policy report_photos_delete_owner
on public.report_photos
for delete
to authenticated
using (public.owns_report(report_id));

create policy sightings_select_author_or_report_owner
on public.sightings
for select
to authenticated
using (
  created_by = (select auth.uid())
  or public.owns_report(report_id)
);

create policy sightings_insert_authenticated
on public.sightings
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and public.report_accepts_sightings(report_id)
);

create policy sightings_update_author
on public.sightings
for update
to authenticated
using (created_by = (select auth.uid()))
with check (created_by = (select auth.uid()));

create policy sighting_photos_select_author_or_report_owner
on public.sighting_photos
for select
to authenticated
using (
  exists (
    select 1
    from public.sightings
    where sightings.id = sighting_photos.sighting_id
      and (
        sightings.created_by = (select auth.uid())
        or public.owns_report(sightings.report_id)
      )
  )
);

create policy sighting_photos_insert_author
on public.sighting_photos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.sightings
    where sightings.id = sighting_photos.sighting_id
      and sightings.created_by = (select auth.uid())
  )
);

create policy sighting_photos_update_author
on public.sighting_photos
for update
to authenticated
using (
  exists (
    select 1
    from public.sightings
    where sightings.id = sighting_photos.sighting_id
      and sightings.created_by = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.sightings
    where sightings.id = sighting_photos.sighting_id
      and sightings.created_by = (select auth.uid())
  )
);

create policy sighting_photos_delete_author
on public.sighting_photos
for delete
to authenticated
using (
  exists (
    select 1
    from public.sightings
    where sightings.id = sighting_photos.sighting_id
      and sightings.created_by = (select auth.uid())
  )
);

create policy report_events_select_report_owner
on public.report_events
for select
to authenticated
using (public.owns_report(report_id));

-- No INSERT, UPDATE or DELETE policies for report_events.
-- Audit events are created only by controlled triggers.

-- ---------------------------------------------------------------------------
-- SAFE PUBLIC PROJECTION
-- ---------------------------------------------------------------------------

create or replace function public.get_public_reports(
  filter_species_id smallint default null,
  filter_report_type text default null,
  result_limit integer default 100
)
returns table (
  id uuid,
  report_type text,
  species_id smallint,
  title text,
  description text,
  incident_at timestamptz,
  municipality_name text,
  public_location_precision text,
  latitude double precision,
  longitude double precision,
  contact_mode text,
  public_phone text,
  public_email text,
  primary_photo_id uuid,
  published_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public, extensions, pg_temp
as $$
  select
    reports.id,
    reports.report_type,
    reports.species_id,
    reports.title,
    reports.description,
    reports.incident_at,
    reports.municipality_name,
    reports.public_location_precision,
    case
      when reports.public_location is null then null
      else extensions.st_y(
        reports.public_location::extensions.geometry
      )
    end as latitude,
    case
      when reports.public_location is null then null
      else extensions.st_x(
        reports.public_location::extensions.geometry
      )
    end as longitude,
    reports.contact_mode,
    case
      when reports.contact_mode = 'PUBLIC_PHONE'
      then reports.public_phone
      else null
    end as public_phone,
    case
      when reports.contact_mode = 'PUBLIC_EMAIL'
      then reports.public_email
      else null
    end as public_email,
    primary_photo.id as primary_photo_id,
    reports.published_at,
    reports.updated_at
  from public.reports
  left join lateral (
    select report_photos.id
    from public.report_photos
    where report_photos.report_id = reports.id
      and report_photos.is_primary = true
    limit 1
  ) as primary_photo on true
  where reports.status = 'ACTIVE'
    and reports.published_at is not null
    and (
      filter_species_id is null
      or reports.species_id = filter_species_id
    )
    and (
      filter_report_type is null
      or reports.report_type = filter_report_type
    )
  order by reports.published_at desc, reports.id desc
  limit least(greatest(result_limit, 1), 200);
$$;

revoke all on function public.get_public_reports(
  smallint,
  text,
  integer
) from public;

grant execute on function public.get_public_reports(
  smallint,
  text,
  integer
) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- TABLE PRIVILEGES
-- ---------------------------------------------------------------------------

revoke all on table public.reports from anon;
revoke all on table public.report_photos from anon;
revoke all on table public.sightings from anon;
revoke all on table public.sighting_photos from anon;
revoke all on table public.report_events from anon;

grant select, insert, update on table public.reports to authenticated;
grant select, insert, update, delete
  on table public.report_photos to authenticated;
grant select, insert, update on table public.sightings to authenticated;
grant select, insert, update, delete
  on table public.sighting_photos to authenticated;
grant select on table public.report_events to authenticated;

grant usage, select
  on sequence public.report_events_id_seq to authenticated;
