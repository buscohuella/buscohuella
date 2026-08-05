-- FP-009 — Reordenado atómico y accesible de fotografías
-- La portada es independiente de la posición.
-- La operación valida el conjunto completo y actualiza todas las posiciones
-- dentro de una única transacción.

drop trigger if exists pet_photos_prepare_write
  on public.pet_photos;

create trigger pet_photos_prepare_write
before insert or update of pet_id, is_primary
on public.pet_photos
for each row
execute function public.prepare_pet_photo_write();

create or replace function public.reorder_pet_photos(
  target_pet_id uuid,
  ordered_photo_ids uuid[]
)
returns setof public.pet_photos
language plpgsql
security invoker
set search_path = public
as $$
declare
  current_count integer;
  supplied_count integer;
  distinct_count integer;
begin
  if target_pet_id is null then
    raise exception 'PET_ID_REQUIRED'
      using errcode = '22023';
  end if;

  supplied_count := coalesce(array_length(ordered_photo_ids, 1), 0);

  if supplied_count = 0 or supplied_count > 10 then
    raise exception 'PET_PHOTO_ORDER_INVALID'
      using errcode = '22023';
  end if;

  select count(distinct photo_id)
    into distinct_count
  from unnest(ordered_photo_ids) as photo_id;

  if distinct_count <> supplied_count then
    raise exception 'PET_PHOTO_ORDER_DUPLICATE'
      using errcode = '22023';
  end if;

  select count(*)
    into current_count
  from public.pet_photos
  where pet_id = target_pet_id;

  if current_count <> supplied_count then
    raise exception 'PET_PHOTO_ORDER_MISMATCH'
      using errcode = '42501';
  end if;

  if exists (
    select 1
    from unnest(ordered_photo_ids) as ordered(photo_id)
    left join public.pet_photos
      on pet_photos.id = ordered.photo_id
     and pet_photos.pet_id = target_pet_id
    where pet_photos.id is null
  ) then
    raise exception 'PET_PHOTO_ORDER_MISMATCH'
      using errcode = '42501';
  end if;

  with requested_order as (
    select
      photo_id,
      ordinality - 1 as new_position
    from unnest(ordered_photo_ids)
      with ordinality as ordered(photo_id, ordinality)
  )
  update public.pet_photos as photos
  set position = requested_order.new_position
  from requested_order
  where photos.id = requested_order.photo_id
    and photos.pet_id = target_pet_id
    and photos.position is distinct from requested_order.new_position;

  return query
  select *
  from public.pet_photos
  where pet_id = target_pet_id
  order by position asc, created_at asc, id asc;
end;
$$;

grant execute on function public.reorder_pet_photos(uuid, uuid[])
  to authenticated;

revoke execute on function public.reorder_pet_photos(uuid, uuid[])
  from anon;
