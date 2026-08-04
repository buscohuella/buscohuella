-- FP-009 — Corregir cambio de fotografía principal
-- La versión anterior actualizaba todas las fotos en una única sentencia.
-- El trigger BEFORE UPDATE intentaba volver a modificar filas ya afectadas
-- por esa misma sentencia, provocando:
-- "tuple to be updated was already modified by an operation triggered by the current command".

create or replace function public.set_pet_primary_photo(
  target_photo_id uuid
)
returns public.pet_photos
language plpgsql
security invoker
set search_path = public
as $$
declare
  target_photo public.pet_photos;
begin
  select *
    into target_photo
  from public.pet_photos
  where id = target_photo_id;

  if target_photo.id is null then
    raise exception 'PET_PHOTO_NOT_FOUND'
      using errcode = 'P0002';
  end if;

  -- Primera sentencia: desmarcar portada anterior.
  -- El trigger no entra en la rama new.is_primary = true.
  update public.pet_photos
  set is_primary = false
  where pet_id = target_photo.pet_id
    and is_primary = true
    and id <> target_photo_id;

  -- Segunda sentencia: marcar únicamente la foto solicitada.
  -- El trigger puede asegurar la unicidad sin colisionar con una
  -- actualización múltiple en curso.
  update public.pet_photos
  set is_primary = true
  where id = target_photo_id;

  select *
    into target_photo
  from public.pet_photos
  where id = target_photo_id;

  return target_photo;
end;
$$;

grant execute on function public.set_pet_primary_photo(uuid)
  to authenticated;

revoke execute on function public.set_pet_primary_photo(uuid)
  from anon;
