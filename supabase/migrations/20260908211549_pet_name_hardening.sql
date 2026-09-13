-- PET-NAME-HARDENING-01 — Align the DB length invariant with the domain contract.
-- Unicode letter/number validation remains in pet-domain; PostgreSQL regex
-- semantics are not used here to avoid an approximation of the application rule.

do $$
declare
  incompatible_count bigint;
begin
  select count(*)
    into incompatible_count
  from public.pets
  where char_length(trim(name)) not between 1 and 30;

  if incompatible_count > 0 then
    raise exception
      'PET_NAME_CONSTRAINT_ABORTED: % incompatible rows exist',
      incompatible_count;
  end if;
end;
$$;

alter table public.pets
  drop constraint pets_name_length,
  add constraint pets_name_length
    check (char_length(trim(name)) between 1 and 30);
