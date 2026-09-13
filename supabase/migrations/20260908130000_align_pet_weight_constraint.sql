-- PET-WEIGHT-DB-01 — Align the database contract for pet weight with the MVP limit.

do $$
declare
  incompatible_count bigint;
begin
  select count(*)
    into incompatible_count
  from public.pets
  where weight_kg is not null
    and (weight_kg <= 0 or weight_kg > 200);

  if incompatible_count > 0 then
    raise exception
      'PET_WEIGHT_CONSTRAINT_ABORTED: % incompatible rows exist',
      incompatible_count;
  end if;
end;
$$;

alter table public.pets
  drop constraint pets_weight_valid,
  add constraint pets_weight_mvp_valid
    check (
      weight_kg is null
      or (weight_kg > 0 and weight_kg <= 200)
    );
