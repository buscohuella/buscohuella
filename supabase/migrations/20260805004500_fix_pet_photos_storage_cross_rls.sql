-- FP-009 — Corregir autorización cruzada entre Storage y pets
-- Las políticas de storage.objects no consultan directamente una tabla
-- protegida por RLS. Usan helpers SECURITY DEFINER mínimos y explícitos.

create or replace function public.user_owns_pet_for_storage(
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
    );
$$;

create or replace function public.user_owns_active_pet_for_storage(
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
        and public.pets.status = 'ACTIVE'
    );
$$;

revoke all on function public.user_owns_pet_for_storage(uuid)
  from public;
revoke all on function public.user_owns_active_pet_for_storage(uuid)
  from public;

grant execute on function public.user_owns_pet_for_storage(uuid)
  to authenticated;
grant execute on function public.user_owns_active_pet_for_storage(uuid)
  to authenticated;

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
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and array_length(storage.foldername(name), 1) = 2
  and public.user_owns_pet_for_storage(
    ((storage.foldername(name))[2])::uuid
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
  and public.user_owns_active_pet_for_storage(
    ((storage.foldername(name))[2])::uuid
  )
);

create policy pet_photos_storage_update_own
on storage.objects
for update
to authenticated
using (
  bucket_id = 'pet-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and array_length(storage.foldername(name), 1) = 2
  and public.user_owns_active_pet_for_storage(
    ((storage.foldername(name))[2])::uuid
  )
)
with check (
  bucket_id = 'pet-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and array_length(storage.foldername(name), 1) = 2
  and public.user_owns_active_pet_for_storage(
    ((storage.foldername(name))[2])::uuid
  )
);

create policy pet_photos_storage_delete_own
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'pet-photos'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and array_length(storage.foldername(name), 1) = 2
  and public.user_owns_active_pet_for_storage(
    ((storage.foldername(name))[2])::uuid
  )
);
