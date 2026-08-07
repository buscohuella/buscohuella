-- FP-017B fix: resolver lectura de fotos de avistamientos sin depender
-- de RLS anidada sobre sightings/reports.

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
    where s.id = target_sighting_id
      and s.created_by = auth.uid()
  );
$$;

create or replace function public.can_read_sighting_photo_storage(
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
      and (
        s.created_by = auth.uid()
        or r.created_by = auth.uid()
      )
  );
$$;

revoke all on function public.can_manage_sighting_photo_storage(uuid)
from public;
revoke all on function public.can_read_sighting_photo_storage(uuid)
from public;

grant execute on function public.can_manage_sighting_photo_storage(uuid)
to authenticated;
grant execute on function public.can_read_sighting_photo_storage(uuid)
to authenticated;

drop policy if exists
  "sighting photos author insert"
on storage.objects;

create policy
  "sighting photos author insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'sighting-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and array_length(storage.foldername(name), 1) = 2
  and public.can_manage_sighting_photo_storage(
    ((storage.foldername(name))[2])::uuid
  )
);

drop policy if exists
  "sighting photos author or report owner select"
on storage.objects;

create policy
  "sighting photos author or report owner select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'sighting-photos'
  and array_length(storage.foldername(name), 1) = 2
  and public.can_read_sighting_photo_storage(
    ((storage.foldername(name))[2])::uuid
  )
);

drop policy if exists
  "sighting photos author delete"
on storage.objects;

create policy
  "sighting photos author delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'sighting-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and array_length(storage.foldername(name), 1) = 2
  and public.can_manage_sighting_photo_storage(
    ((storage.foldername(name))[2])::uuid
  )
);
