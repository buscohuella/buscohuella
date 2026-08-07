-- FP-017B fix: storage.foldername() returns directories only.
-- For user/sighting/photo.webp the folder depth is 2, not 3.

drop policy if exists "sighting photos author insert" on storage.objects;
create policy "sighting photos author insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'sighting-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and array_length(storage.foldername(name), 1) = 2
  and exists (
    select 1
    from public.sightings s
    where s.id::text = (storage.foldername(name))[2]
      and s.created_by = auth.uid()
  )
);

drop policy if exists "sighting photos author or report owner select" on storage.objects;
create policy "sighting photos author or report owner select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'sighting-photos'
  and array_length(storage.foldername(name), 1) = 2
  and exists (
    select 1
    from public.sightings s
    join public.reports r on r.id = s.report_id
    where s.id::text = (storage.foldername(name))[2]
      and (
        s.created_by = auth.uid()
        or r.created_by = auth.uid()
      )
  )
);

drop policy if exists "sighting photos author delete" on storage.objects;
create policy "sighting photos author delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'sighting-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and array_length(storage.foldername(name), 1) = 2
  and exists (
    select 1
    from public.sightings s
    where s.id::text = (storage.foldername(name))[2]
      and s.created_by = auth.uid()
  )
);
