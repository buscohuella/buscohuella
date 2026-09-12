-- P0-DATA-002 — Storage debe limpiarse antes de borrar la fila de la mascota.
-- La política anterior solo permitía DELETE para mascotas ACTIVE, mientras que
-- el borrado físico de pets exige ARCHIVED. Este helper conserva ownership y
-- limita la limpieza a los dos estados que permiten gestionar/eliminar fotos.

create or replace function public.user_can_delete_pet_photo_for_storage(
  target_pet_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    (select auth.uid()) is not null
    and exists (
      select 1
      from public.pets
      where public.pets.id = target_pet_id
        and public.pets.owner_id = (select auth.uid())
        and public.pets.status in ('ACTIVE', 'ARCHIVED')
    );
$$;

revoke all on function public.user_can_delete_pet_photo_for_storage(uuid)
  from public, anon;
grant execute on function public.user_can_delete_pet_photo_for_storage(uuid)
  to authenticated;

drop policy if exists pet_photos_storage_delete_own
  on storage.objects;

create policy pet_photos_storage_delete_own
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'pet-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and array_length(storage.foldername(name), 1) = 2
  and public.user_can_delete_pet_photo_for_storage(
    ((storage.foldername(name))[2])::uuid
  )
);
