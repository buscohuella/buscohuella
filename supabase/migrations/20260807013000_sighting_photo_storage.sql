-- FP-017B — fotografías privadas de avistamientos.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sighting-photos','sighting-photos',false,8388608,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update
set public=false, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

grant select, insert, update, delete on table public.sighting_photos to authenticated;

drop policy if exists "sighting photos author insert" on storage.objects;
create policy "sighting photos author insert" on storage.objects for insert to authenticated
with check (bucket_id='sighting-photos' and (storage.foldername(name))[1]=auth.uid()::text and array_length(storage.foldername(name),1)=3 and exists (select 1 from public.sightings s where s.id::text=(storage.foldername(name))[2] and s.created_by=auth.uid()));

drop policy if exists "sighting photos author or report owner select" on storage.objects;
create policy "sighting photos author or report owner select" on storage.objects for select to authenticated
using (bucket_id='sighting-photos' and array_length(storage.foldername(name),1)=3 and exists (select 1 from public.sightings s join public.reports r on r.id=s.report_id where s.id::text=(storage.foldername(name))[2] and (s.created_by=auth.uid() or r.created_by=auth.uid())));

drop policy if exists "sighting photos author delete" on storage.objects;
create policy "sighting photos author delete" on storage.objects for delete to authenticated
using (bucket_id='sighting-photos' and (storage.foldername(name))[1]=auth.uid()::text and array_length(storage.foldername(name),1)=3 and exists (select 1 from public.sightings s where s.id::text=(storage.foldername(name))[2] and s.created_by=auth.uid()));
