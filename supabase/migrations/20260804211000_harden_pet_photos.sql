-- FP-009 — Endurecimiento de fotografías de mascotas
-- Límites, portada automática y operaciones consistentes.

alter table public.pet_photos
  add constraint pet_photos_position_mvp_range
    check (position between 0 and 9),
  add constraint pet_photos_file_size_mvp_limit
    check (
      file_size_bytes is null
      or file_size_bytes between 1 and 8388608
    );

create or replace function public.prepare_pet_photo_write()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  photo_count integer;
begin
  if tg_op = 'INSERT' then
    select count(*)
      into photo_count
    from public.pet_photos
    where pet_id = new.pet_id;

    if photo_count >= 10 then
      raise exception 'PET_PHOTO_LIMIT_REACHED'
        using errcode = '23514';
    end if;

    if photo_count = 0 then
      new.is_primary := true;
      new.position := 0;
    elsif new.position > photo_count then
      new.position := photo_count;
    end if;
  end if;

  if new.is_primary then
    update public.pet_photos
    set is_primary = false
    where pet_id = new.pet_id
      and id is distinct from new.id
      and is_primary = true;
  end if;

  return new;
end;
$$;

drop trigger if exists pet_photos_prepare_write
  on public.pet_photos;

create trigger pet_photos_prepare_write
before insert or update of pet_id, position, is_primary
on public.pet_photos
for each row
execute function public.prepare_pet_photo_write();

create or replace function public.repair_pet_photo_collection(
  target_pet_id uuid
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  first_photo_id uuid;
begin
  with ordered as (
    select
      id,
      row_number() over (
        order by position asc, created_at asc, id asc
      ) - 1 as new_position
    from public.pet_photos
    where pet_id = target_pet_id
  )
  update public.pet_photos as photos
  set position = ordered.new_position
  from ordered
  where photos.id = ordered.id
    and photos.position is distinct from ordered.new_position;

  if not exists (
    select 1
    from public.pet_photos
    where pet_id = target_pet_id
      and is_primary = true
  ) then
    select id
      into first_photo_id
    from public.pet_photos
    where pet_id = target_pet_id
    order by position asc, created_at asc, id asc
    limit 1;

    if first_photo_id is not null then
      update public.pet_photos
      set is_primary = true
      where id = first_photo_id;
    end if;
  end if;
end;
$$;

create or replace function public.repair_pet_photos_after_delete()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  perform public.repair_pet_photo_collection(old.pet_id);
  return old;
end;
$$;

drop trigger if exists pet_photos_repair_after_delete
  on public.pet_photos;

create trigger pet_photos_repair_after_delete
after delete on public.pet_photos
for each row
execute function public.repair_pet_photos_after_delete();

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

  update public.pet_photos
  set is_primary = (id = target_photo_id)
  where pet_id = target_photo.pet_id;

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

-- Las políticas RLS existentes siguen aplicándose dentro de las funciones
-- SECURITY INVOKER. El usuario solo puede actuar sobre fotografías de sus
-- propias mascotas.
