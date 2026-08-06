-- FP-013 fix: alinear la validación de publicación con momentos
-- aproximados y ubicaciones manuales sin coordenadas inventadas.

create or replace function public.validate_report_write()
returns trigger
language plpgsql
set search_path = public, extensions, pg_temp
as $$
declare
  linked_pet public.pets%rowtype;
  allowed_transition boolean;
  has_manual_location boolean;
begin
  if tg_op = 'INSERT' then
    if new.created_by is distinct from (select auth.uid()) then
      raise exception 'REPORT_OWNER_INVALID'
        using errcode = '42501';
    end if;
  else
    if new.created_by is distinct from old.created_by then
      raise exception 'REPORT_OWNER_IMMUTABLE'
        using errcode = '42501';
    end if;

    if old.status <> 'DRAFT'
       and (
         new.report_type is distinct from old.report_type
         or new.pet_id is distinct from old.pet_id
         or new.species_id is distinct from old.species_id
       ) then
      raise exception 'REPORT_IDENTITY_IMMUTABLE_AFTER_PUBLICATION'
        using errcode = '22023';
    end if;

    if new.status is distinct from old.status then
      allowed_transition := (
        (old.status = 'DRAFT' and new.status in ('ACTIVE', 'CLOSED'))
        or (old.status = 'ACTIVE' and new.status in ('PAUSED', 'RESOLVED', 'CLOSED'))
        or (old.status = 'PAUSED' and new.status in ('ACTIVE', 'RESOLVED', 'CLOSED'))
        or (old.status in ('RESOLVED', 'CLOSED') and new.status = 'ARCHIVED')
      );

      if not allowed_transition then
        raise exception 'REPORT_STATUS_TRANSITION_INVALID: % -> %',
          old.status,
          new.status
          using errcode = '22023';
      end if;
    end if;
  end if;

  if new.report_type = 'LOST_PET' then
    if new.pet_id is null then
      raise exception 'LOST_REPORT_REQUIRES_PET'
        using errcode = '23514';
    end if;

    select *
    into linked_pet
    from public.pets
    where id = new.pet_id;

    if not found then
      raise exception 'REPORT_PET_NOT_FOUND'
        using errcode = '23503';
    end if;

    if linked_pet.owner_id is distinct from new.created_by then
      raise exception 'REPORT_PET_NOT_OWNED'
        using errcode = '42501';
    end if;

    if linked_pet.status <> 'ACTIVE' then
      raise exception 'REPORT_PET_NOT_ACTIVE'
        using errcode = '23514';
    end if;

    if linked_pet.species_id is distinct from new.species_id then
      raise exception 'REPORT_SPECIES_MISMATCH'
        using errcode = '23514';
    end if;
  elsif new.report_type = 'FOUND_ANIMAL' and new.pet_id is not null then
    raise exception 'FOUND_REPORT_MUST_NOT_REFERENCE_PET'
      using errcode = '23514';
  end if;

  if new.incident_at is not null and new.incident_at > now() then
    raise exception 'REPORT_INCIDENT_IN_FUTURE'
      using errcode = '22007';
  end if;

  if new.contact_mode = 'PUBLIC_PHONE' then
    if new.public_phone is null or btrim(new.public_phone) = '' then
      raise exception 'REPORT_PUBLIC_PHONE_REQUIRED'
        using errcode = '23514';
    end if;
  elsif new.public_phone is not null then
    raise exception 'REPORT_PUBLIC_PHONE_NOT_ALLOWED'
      using errcode = '23514';
  end if;

  if new.contact_mode = 'PUBLIC_EMAIL' then
    if new.public_email is null or btrim(new.public_email) = '' then
      raise exception 'REPORT_PUBLIC_EMAIL_REQUIRED'
        using errcode = '23514';
    end if;
  elsif new.public_email is not null then
    raise exception 'REPORT_PUBLIC_EMAIL_NOT_ALLOWED'
      using errcode = '23514';
  end if;

  if new.public_location_precision = 'HIDDEN' then
    new.public_location := null;
  end if;

  has_manual_location := (
    new.public_location_precision = 'MUNICIPALITY_ONLY'
    and new.municipality_name is not null
    and btrim(new.municipality_name) <> ''
  );

  if new.status in ('ACTIVE', 'PAUSED', 'RESOLVED') then
    if new.title is null or btrim(new.title) = '' then
      raise exception 'REPORT_TITLE_REQUIRED'
        using errcode = '23514';
    end if;

    if new.description is null or btrim(new.description) = '' then
      raise exception 'REPORT_DESCRIPTION_REQUIRED'
        using errcode = '23514';
    end if;

    -- incident_at puede ser null cuando el usuario solo recuerda
    -- RECENT, TODAY o YESTERDAY. No se inventa una hora exacta.

    if not has_manual_location then
      if new.exact_location is null then
        raise exception 'REPORT_EXACT_LOCATION_REQUIRED'
          using errcode = '23514';
      end if;

      if new.public_location_precision <> 'HIDDEN'
         and new.public_location is null then
        raise exception 'REPORT_PUBLIC_LOCATION_REQUIRED'
          using errcode = '23514';
      end if;
    end if;
  end if;

  if tg_op = 'INSERT' then
    if new.status = 'ACTIVE' and new.published_at is null then
      new.published_at := timezone('utc', now());
    end if;
  elsif new.status is distinct from old.status then
    if new.status = 'ACTIVE' and new.published_at is null then
      new.published_at := timezone('utc', now());
    elsif new.status = 'RESOLVED' then
      if new.resolution_type is null then
        raise exception 'REPORT_RESOLUTION_REQUIRED'
          using errcode = '23514';
      end if;

      new.resolved_at := coalesce(
        new.resolved_at,
        timezone('utc', now())
      );
    elsif new.status = 'CLOSED' then
      if new.closure_reason is null
         or btrim(new.closure_reason) = '' then
        raise exception 'REPORT_CLOSURE_REASON_REQUIRED'
          using errcode = '23514';
      end if;

      new.closed_at := coalesce(
        new.closed_at,
        timezone('utc', now())
      );
    elsif new.status = 'ARCHIVED' then
      new.archived_at := coalesce(
        new.archived_at,
        timezone('utc', now())
      );
    end if;
  end if;

  if new.status <> 'RESOLVED'
     and (
       new.resolution_type is not null
       or new.resolved_at is not null
     ) then
    raise exception 'REPORT_RESOLUTION_STATE_INVALID'
      using errcode = '23514';
  end if;

  if new.status <> 'CLOSED'
     and (
       new.closure_reason is not null
       or new.closed_at is not null
     ) then
    raise exception 'REPORT_CLOSURE_STATE_INVALID'
      using errcode = '23514';
  end if;

  return new;
end;
$$;
