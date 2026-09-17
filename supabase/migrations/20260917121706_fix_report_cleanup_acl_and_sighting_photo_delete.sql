-- P0-DATA-001 follow-up: repair the private finalizer ACL after ownership
-- transfer and restore the sighting author's pre-archive metadata DELETE.

-- The previous migration transferred ownership before applying these ACL
-- changes. Supabase's restricted postgres role is not a superuser, so assume
-- the NOLOGIN owner only for the privilege repair and restore SET afterwards.
grant buscohuella_report_cleanup_executor
  to current_user
  with set true;

set role buscohuella_report_cleanup_executor;

revoke all privileges on function
  private.finalize_archived_report_deletion(uuid, uuid)
  from public, anon, authenticated;
grant execute on function
  private.finalize_archived_report_deletion(uuid, uuid)
  to buscohuella_report_cleanup_backend;

reset role;

revoke buscohuella_report_cleanup_executor
  from current_user
  granted by current_user;

revoke all on schema private from public, anon, authenticated;

-- The caller may only learn whether they authored the sighting and whether
-- its report is not archived. Running as the function owner avoids requiring
-- broader SELECT visibility on reports for sighting contributors.
create or replace function public.can_delete_sighting_photo_metadata(
  target_sighting_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $function$
  select exists (
    select 1
    from public.sightings s
    join public.reports r on r.id = s.report_id
    where s.id = target_sighting_id
      and s.created_by = (select auth.uid())
      and r.status <> 'ARCHIVED'
  );
$function$;

revoke all privileges on function
  public.can_delete_sighting_photo_metadata(uuid)
  from public, anon, authenticated, service_role;
grant execute on function
  public.can_delete_sighting_photo_metadata(uuid)
  to authenticated;

drop policy if exists sighting_photos_delete_author
on public.sighting_photos;

create policy sighting_photos_delete_author
on public.sighting_photos
for delete
to authenticated
using (
  public.can_delete_sighting_photo_metadata(
    sighting_photos.sighting_id
  )
);
