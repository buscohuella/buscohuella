-- P0-DATA-001 follow-up: keep contributor Storage DELETE aligned with the
-- metadata policy while preserving archived cleanup for the report owner.

create or replace function public.can_delete_sighting_photo_storage(
  target_sighting_id uuid,
  target_storage_owner_id text
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
      and s.created_by::text = target_storage_owner_id
      and (
        (
          s.created_by = (select auth.uid())
          and r.status <> 'ARCHIVED'
        )
        or (
          r.created_by = (select auth.uid())
          and r.status = 'ARCHIVED'
        )
      )
  );
$function$;

revoke all privileges on function
  public.can_delete_sighting_photo_storage(uuid, text)
  from public, anon, authenticated, service_role;
grant execute on function
  public.can_delete_sighting_photo_storage(uuid, text)
  to authenticated;
