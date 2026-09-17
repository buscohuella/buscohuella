-- P0-DATA-001: authorize narrowly scoped archived-report photo cleanup and
-- prevent new sighting photos once the parent report stops accepting sightings.

create or replace function public.can_manage_sighting_photo_storage(
  target_sighting_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.sightings s
    join public.reports r on r.id = s.report_id
    where s.id = target_sighting_id
      and s.created_by = (select auth.uid())
      and r.status = 'ACTIVE'
      and r.published_at is not null
  );
$$;

revoke all on function public.can_manage_sighting_photo_storage(uuid)
from public, anon, authenticated;
grant execute on function public.can_manage_sighting_photo_storage(uuid)
to authenticated;

drop policy if exists sighting_photos_insert_author
on public.sighting_photos;

create policy sighting_photos_insert_author
on public.sighting_photos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.sightings s
    where s.id = sighting_photos.sighting_id
      and s.created_by = (select auth.uid())
      and public.report_accepts_sightings(s.report_id)
  )
);

drop policy if exists sighting_photos_update_author
on public.sighting_photos;

create policy sighting_photos_update_author
on public.sighting_photos
for update
to authenticated
using (
  exists (
    select 1
    from public.sightings s
    where s.id = sighting_photos.sighting_id
      and s.created_by = (select auth.uid())
      and public.report_accepts_sightings(s.report_id)
  )
)
with check (
  exists (
    select 1
    from public.sightings s
    where s.id = sighting_photos.sighting_id
      and s.created_by = (select auth.uid())
      and public.report_accepts_sightings(s.report_id)
  )
);

drop policy if exists "sighting photos author insert"
on storage.objects;

create policy "sighting photos author insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'sighting-photos'
  and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and array_length(storage.foldername(name), 1) = 2
  and public.can_manage_sighting_photo_storage(
    ((storage.foldername(name))[2])::uuid
  )
);

-- The path owner must be the actual sighting author. Authors retain their
-- original delete permission; only the report owner gains archived cleanup.
create or replace function public.can_delete_sighting_photo_storage(
  target_sighting_id uuid,
  target_storage_owner_id text
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.sightings s
    join public.reports r on r.id = s.report_id
    where s.id = target_sighting_id
      and s.created_by::text = target_storage_owner_id
      and (
        s.created_by = (select auth.uid())
        or (
          r.created_by = (select auth.uid())
          and r.status = 'ARCHIVED'
        )
      )
  );
$$;

revoke all on function public.can_delete_sighting_photo_storage(uuid, text)
from public, anon, authenticated;
grant execute on function public.can_delete_sighting_photo_storage(uuid, text)
to authenticated;

drop policy if exists "sighting photos author delete"
on storage.objects;
drop policy if exists "sighting photos authorized delete"
on storage.objects;

create policy "sighting photos authorized delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'sighting-photos'
  and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.webp$'
  and array_length(storage.foldername(name), 1) = 2
  and public.can_delete_sighting_photo_storage(
    ((storage.foldername(name))[2])::uuid,
    (storage.foldername(name))[1]
  )
);

-- Preserve the existing report-photo DELETE states and add only ARCHIVED for
-- permanent cleanup. The helper binds both path segments to the owned report.
create or replace function public.can_delete_report_photo_storage(
  target_report_id uuid,
  target_storage_owner_id text
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.reports r
    where r.id = target_report_id
      and r.created_by = (select auth.uid())
      and r.created_by::text = target_storage_owner_id
      and r.status in ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED')
  );
$$;

revoke all on function public.can_delete_report_photo_storage(uuid, text)
from public, anon, authenticated;
grant execute on function public.can_delete_report_photo_storage(uuid, text)
to authenticated;

drop policy if exists "report photos owner delete"
on storage.objects;

create policy "report photos owner delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'report-photos'
  and name ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(webp|jpg|png)$'
  and array_length(storage.foldername(name), 1) = 2
  and public.can_delete_report_photo_storage(
    ((storage.foldername(name))[2])::uuid,
    (storage.foldername(name))[1]
  )
);

-- The browser and ordinary Server Actions share the authenticated role. Move
-- the destructive database phase behind a separate PostgreSQL identity whose
-- only callable capability is the private finalizer below.
do $roles$
begin
  if not exists (
    select 1 from pg_catalog.pg_roles
    where rolname = 'buscohuella_report_cleanup_backend'
  ) then
    create role buscohuella_report_cleanup_backend;
  end if;

  if not exists (
    select 1 from pg_catalog.pg_roles
    where rolname = 'buscohuella_report_cleanup_executor'
  ) then
    create role buscohuella_report_cleanup_executor;
  end if;
end
$roles$;

alter role buscohuella_report_cleanup_backend
  with login noinherit;
alter role buscohuella_report_cleanup_backend
  set search_path = pg_catalog;

alter role buscohuella_report_cleanup_executor
  with nologin noinherit;

-- CREATE ROLE defaults the privileged attributes below to false. Do not try
-- to ALTER SUPERUSER/REPLICATION/BYPASSRLS from Supabase's restricted
-- postgres role; instead fail closed if an existing role is unexpectedly
-- privileged.
do $role_safety$
begin
  if not exists (
    select 1
    from pg_catalog.pg_roles
    where rolname = 'buscohuella_report_cleanup_backend'
      and not rolsuper
      and not rolcreatedb
      and not rolcreaterole
      and not rolreplication
      and not rolinherit
      and rolcanlogin
      and not rolbypassrls
  ) then
    raise exception 'REPORT_CLEANUP_BACKEND_ROLE_UNSAFE';
  end if;

  if not exists (
    select 1
    from pg_catalog.pg_roles
    where rolname = 'buscohuella_report_cleanup_executor'
      and not rolsuper
      and not rolcreatedb
      and not rolcreaterole
      and not rolreplication
      and not rolinherit
      and not rolcanlogin
      and not rolbypassrls
  ) then
    raise exception 'REPORT_CLEANUP_EXECUTOR_ROLE_UNSAFE';
  end if;
end
$role_safety$;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private
  to buscohuella_report_cleanup_backend,
     buscohuella_report_cleanup_executor;

do $database_grant$
begin
  execute format(
    'grant connect on database %I to buscohuella_report_cleanup_backend',
    current_database()
  );
end
$database_grant$;

revoke all on all tables in schema public
  from buscohuella_report_cleanup_backend;
revoke all on all sequences in schema public
  from buscohuella_report_cleanup_backend;
revoke all on all functions in schema public
  from buscohuella_report_cleanup_backend;

grant usage on schema public
  to buscohuella_report_cleanup_executor;
grant select on table
  public.reports,
  public.sightings,
  public.report_events
  to buscohuella_report_cleanup_executor;
grant update (id) on table public.reports
  to buscohuella_report_cleanup_executor;
grant delete on table
  public.reports,
  public.sightings,
  public.report_events
  to buscohuella_report_cleanup_executor;

drop policy if exists reports_cleanup_executor_select
on public.reports;
create policy reports_cleanup_executor_select
on public.reports
for select
to buscohuella_report_cleanup_executor
using (true);

drop policy if exists reports_cleanup_executor_lock
on public.reports;
create policy reports_cleanup_executor_lock
on public.reports
for update
to buscohuella_report_cleanup_executor
using (true)
with check (true);

drop policy if exists reports_cleanup_executor_delete
on public.reports;
create policy reports_cleanup_executor_delete
on public.reports
for delete
to buscohuella_report_cleanup_executor
using (status = 'ARCHIVED');

drop policy if exists sightings_cleanup_executor_select
on public.sightings;
create policy sightings_cleanup_executor_select
on public.sightings
for select
to buscohuella_report_cleanup_executor
using (
  exists (
    select 1
    from public.reports r
    where r.id = sightings.report_id
      and r.status = 'ARCHIVED'
  )
);

drop policy if exists sightings_cleanup_executor_delete
on public.sightings;
create policy sightings_cleanup_executor_delete
on public.sightings
for delete
to buscohuella_report_cleanup_executor
using (
  exists (
    select 1
    from public.reports r
    where r.id = sightings.report_id
      and r.status = 'ARCHIVED'
  )
);

drop policy if exists report_events_cleanup_executor_select
on public.report_events;
create policy report_events_cleanup_executor_select
on public.report_events
for select
to buscohuella_report_cleanup_executor
using (
  exists (
    select 1
    from public.reports r
    where r.id = report_events.report_id
      and r.status = 'ARCHIVED'
  )
);

drop policy if exists report_events_cleanup_executor_delete
on public.report_events;
create policy report_events_cleanup_executor_delete
on public.report_events
for delete
to buscohuella_report_cleanup_executor
using (
  exists (
    select 1
    from public.reports r
    where r.id = report_events.report_id
      and r.status = 'ARCHIVED'
  )
);

create or replace function private.finalize_archived_report_deletion(
  target_report_id uuid,
  actor_user_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog
as $function$
declare
  locked_owner_id uuid;
  locked_status text;
  deleted_report_count integer;
begin
  select r.created_by, r.status
  into locked_owner_id, locked_status
  from public.reports r
  where r.id = target_report_id
  for update;

  if not found then
    raise exception 'ARCHIVED_REPORT_NOT_FOUND'
      using errcode = 'P0002';
  end if;

  if locked_owner_id is distinct from actor_user_id then
    raise exception 'ARCHIVED_REPORT_OWNER_MISMATCH'
      using errcode = '42501';
  end if;

  if locked_status is distinct from 'ARCHIVED' then
    raise exception 'REPORT_NOT_ARCHIVED'
      using errcode = '23514';
  end if;

  delete from public.sightings s
  where s.report_id = target_report_id;

  delete from public.report_events e
  where e.report_id = target_report_id;

  delete from public.reports r
  where r.id = target_report_id
    and r.created_by = actor_user_id
    and r.status = 'ARCHIVED';

  get diagnostics deleted_report_count = row_count;

  if deleted_report_count <> 1 then
    raise exception 'ARCHIVED_REPORT_DELETE_INCOMPLETE'
      using errcode = 'P0001';
  end if;

  return true;
end;
$function$;

-- PostgreSQL requires the migration actor to be able to SET ROLE to the new
-- function owner, and the new owner to have CREATE on the target schema.
-- Grant both capabilities only for the ownership transfer, then remove them.
grant create on schema private
  to buscohuella_report_cleanup_executor;
grant buscohuella_report_cleanup_executor
  to current_user;

alter function private.finalize_archived_report_deletion(uuid, uuid)
  owner to buscohuella_report_cleanup_executor;

revoke buscohuella_report_cleanup_executor
  from current_user;
revoke create on schema private
  from buscohuella_report_cleanup_executor;
revoke all on function
  private.finalize_archived_report_deletion(uuid, uuid)
  from public, anon, authenticated;
grant execute on function
  private.finalize_archived_report_deletion(uuid, uuid)
  to buscohuella_report_cleanup_backend;

-- Remove the archived-graph capability from browser JWTs. The draft rollback
-- now uses the same private finalizer, so no legitimate table DELETE is lost.
drop policy if exists reports_delete_archived_owner
on public.reports;
drop policy if exists sightings_delete_archived_owner
on public.sightings;
drop policy if exists report_events_delete_archived_owner
on public.report_events;

revoke delete on table public.reports from authenticated;
revoke delete on table public.sightings from authenticated;
revoke delete on table public.report_events from authenticated;

-- Report photo editing remains available in the same states enforced by the
-- Server Action. ARCHIVED metadata is immutable and is removed only by cascade
-- from the private finalizer.
drop policy if exists report_photos_insert_owner
on public.report_photos;
create policy report_photos_insert_owner
on public.report_photos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.reports r
    where r.id = report_photos.report_id
      and r.created_by = (select auth.uid())
      and r.status in ('DRAFT', 'ACTIVE', 'PAUSED')
  )
);

drop policy if exists report_photos_update_owner
on public.report_photos;
create policy report_photos_update_owner
on public.report_photos
for update
to authenticated
using (
  exists (
    select 1
    from public.reports r
    where r.id = report_photos.report_id
      and r.created_by = (select auth.uid())
      and r.status in ('DRAFT', 'ACTIVE', 'PAUSED')
  )
)
with check (
  exists (
    select 1
    from public.reports r
    where r.id = report_photos.report_id
      and r.created_by = (select auth.uid())
      and r.status in ('DRAFT', 'ACTIVE', 'PAUSED')
  )
);

drop policy if exists report_photos_delete_owner
on public.report_photos;
create policy report_photos_delete_owner
on public.report_photos
for delete
to authenticated
using (
  exists (
    select 1
    from public.reports r
    where r.id = report_photos.report_id
      and r.created_by = (select auth.uid())
      and r.status in ('DRAFT', 'ACTIVE', 'PAUSED')
  )
);

-- Authors retain their previous metadata DELETE outside ARCHIVED. Upload and
-- UPDATE remain stricter: ACTIVE and published through report_accepts_sightings.
drop policy if exists sighting_photos_delete_author
on public.sighting_photos;
create policy sighting_photos_delete_author
on public.sighting_photos
for delete
to authenticated
using (
  exists (
    select 1
    from public.sightings s
    join public.reports r on r.id = s.report_id
    where s.id = sighting_photos.sighting_id
      and s.created_by = (select auth.uid())
      and r.status <> 'ARCHIVED'
  )
);
