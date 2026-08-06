-- FP-017A fix: permitir ubicaciones manuales sin coordenadas públicas inventadas.

create or replace function public.validate_sighting_write()
returns trigger
language plpgsql
set search_path to 'public', 'pg_temp'
as $function$
begin
  if tg_op = 'INSERT' then
    if new.created_by is distinct from (select auth.uid()) then
      raise exception 'SIGHTING_OWNER_INVALID'
        using errcode = '42501';
    end if;

    if not public.report_accepts_sightings(new.report_id) then
      raise exception 'REPORT_NOT_ACCEPTING_SIGHTINGS'
        using errcode = '23514';
    end if;
  else
    if new.created_by is distinct from old.created_by then
      raise exception 'SIGHTING_OWNER_IMMUTABLE'
        using errcode = '42501';
    end if;

    if new.report_id is distinct from old.report_id then
      raise exception 'SIGHTING_REPORT_IMMUTABLE'
        using errcode = '22023';
    end if;
  end if;

  if new.observed_at > now() then
    raise exception 'SIGHTING_OBSERVED_IN_FUTURE'
      using errcode = '22007';
  end if;

  if new.location_source = 'MANUAL' then
    new.public_location := null;
    new.public_location_precision := 'MUNICIPALITY_ONLY';
  elsif new.public_location_precision = 'HIDDEN' then
    new.public_location := null;
  elsif new.public_location is null then
    raise exception 'SIGHTING_PUBLIC_LOCATION_REQUIRED'
      using errcode = '23514';
  end if;

  return new;
end;
$function$;
