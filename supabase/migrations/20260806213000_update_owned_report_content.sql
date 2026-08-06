-- FP-015A: edición segura de contenido y contacto de avisos publicados.

create or replace function public.update_owned_report_content(
  target_report_id uuid,
  target_title text,
  target_description text,
  target_municipality_name text,
  target_contact_mode text,
  target_public_phone text default null,
  target_public_email text default null
)
returns public.reports
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  current_report public.reports;
  updated_report public.reports;
  normalized_title text := btrim(coalesce(target_title, ''));
  normalized_description text := btrim(coalesce(target_description, ''));
  normalized_municipality text := nullif(btrim(coalesce(target_municipality_name, '')), '');
  normalized_phone text := nullif(btrim(coalesce(target_public_phone, '')), '');
  normalized_email text := nullif(lower(btrim(coalesce(target_public_email, ''))), '');
  changed_fields jsonb := '[]'::jsonb;
begin
  select r.*
  into current_report
  from public.reports r
  where r.id = target_report_id
    and r.created_by = auth.uid()
  for update;

  if current_report.id is null then
    raise exception 'REPORT_NOT_FOUND';
  end if;

  if current_report.status not in ('ACTIVE', 'PAUSED') then
    raise exception 'REPORT_EDIT_STATE_INVALID';
  end if;

  if char_length(normalized_title) < 3
     or char_length(normalized_title) > 120 then
    raise exception 'REPORT_TITLE_INVALID';
  end if;

  if char_length(normalized_description) < 10
     or char_length(normalized_description) > 2000 then
    raise exception 'REPORT_DESCRIPTION_INVALID';
  end if;

  if normalized_municipality is null then
    raise exception 'REPORT_LOCATION_REQUIRED';
  end if;

  if target_contact_mode not in (
    'PLATFORM_ONLY',
    'PUBLIC_PHONE',
    'PUBLIC_EMAIL'
  ) then
    raise exception 'REPORT_CONTACT_MODE_INVALID';
  end if;

  if target_contact_mode = 'PUBLIC_PHONE'
     and normalized_phone is null then
    raise exception 'REPORT_PUBLIC_PHONE_REQUIRED';
  end if;

  if target_contact_mode = 'PUBLIC_EMAIL'
     and (
       normalized_email is null
       or normalized_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
     ) then
    raise exception 'REPORT_PUBLIC_EMAIL_REQUIRED';
  end if;

  if current_report.title is distinct from normalized_title then
    changed_fields := changed_fields || '"title"'::jsonb;
  end if;

  if current_report.description is distinct from normalized_description then
    changed_fields := changed_fields || '"description"'::jsonb;
  end if;

  if current_report.municipality_name is distinct from normalized_municipality then
    changed_fields := changed_fields || '"municipality_name"'::jsonb;
  end if;

  if current_report.contact_mode is distinct from target_contact_mode then
    changed_fields := changed_fields || '"contact_mode"'::jsonb;
  end if;

  if current_report.public_phone is distinct from (
    case when target_contact_mode = 'PUBLIC_PHONE'
      then normalized_phone else null end
  ) then
    changed_fields := changed_fields || '"public_phone"'::jsonb;
  end if;

  if current_report.public_email is distinct from (
    case when target_contact_mode = 'PUBLIC_EMAIL'
      then normalized_email else null end
  ) then
    changed_fields := changed_fields || '"public_email"'::jsonb;
  end if;

  update public.reports
  set
    title = normalized_title,
    description = normalized_description,
    municipality_name = normalized_municipality,
    contact_mode = target_contact_mode,
    public_phone = case
      when target_contact_mode = 'PUBLIC_PHONE'
      then normalized_phone
      else null
    end,
    public_email = case
      when target_contact_mode = 'PUBLIC_EMAIL'
      then normalized_email
      else null
    end,
    updated_at = timezone('utc', now())
  where id = target_report_id
  returning *
  into updated_report;

  if jsonb_array_length(changed_fields) > 0 then
    insert into public.report_events (
      report_id,
      actor_id,
      event_type,
      from_status,
      to_status,
      metadata
    )
    values (
      updated_report.id,
      auth.uid(),
      'UPDATED',
      current_report.status,
      updated_report.status,
      jsonb_build_object(
        'changed_fields',
        changed_fields
      )
    );
  end if;

  return updated_report;
end;
$$;

revoke all on function
  public.update_owned_report_content(
    uuid,
    text,
    text,
    text,
    text,
    text,
    text
  )
from public;

grant execute on function
  public.update_owned_report_content(
    uuid,
    text,
    text,
    text,
    text,
    text,
    text
  )
to authenticated;
