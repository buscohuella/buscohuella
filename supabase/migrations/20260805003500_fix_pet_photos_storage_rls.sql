-- FP-009 — Corregir RLS de Storage para fotografías de mascotas
-- La API de Storage inserta el objeto y devuelve sus metadatos.
-- INSERT y SELECT deben cubrir exactamente el objeto recién creado.

drop policy if exists pet_photos_storage_select_own
  on storage.objects;

drop policy if exists pet_photos_storage_insert_own
  on storage.objects;

drop policy if exists pet_photos_storage_update_own
  on storage.objects;

drop policy if exists pet_photos_storage_delete_own
  on storage.objects;

create policy pet_photos_storage_select_own
on storage.objects
for select
to authenticated
using (
  bucket_id = 'pet-photos'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and array_length(storage.foldername(name), 1) = 2
  and exists (
    select 1
    from public.pets
    where pets.id::text = (storage.foldername(name))[2]
      and pets.owner_id = (select auth.uid())
  )
);

create policy pet_photos_storage_insert_own
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'pet-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and array_length(storage.foldername(name), 1) = 2
  and exists (
    select 1
    from public.pets
    where pets.id::text = (storage.foldername(name))[2]
      and pets.owner_id = (select auth.uid())
      and pets.status = 'ACTIVE'
  )
);

create policy pet_photos_storage_update_own
on storage.objects
for update
to authenticated
using (
  bucket_id = 'pet-photos'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.pets
    where pets.id::text = (storage.foldername(name))[2]
      and pets.owner_id = (select auth.uid())
  )
)
with check (
  bucket_id = 'pet-photos'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and array_length(storage.foldername(name), 1) = 2
  and exists (
    select 1
    from public.pets
    where pets.id::text = (storage.foldername(name))[2]
      and pets.owner_id = (select auth.uid())
      and pets.status = 'ACTIVE'
  )
);

create policy pet_photos_storage_delete_own
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'pet-photos'
  and owner_id = (select auth.uid())::text
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (
    select 1
    from public.pets
    where pets.id::text = (storage.foldername(name))[2]
      and pets.owner_id = (select auth.uid())
  )
);
