-- FP-013: publicación atómica de borradores propios.

create or replace function public.publish_report_draft(
  target_report_id uuid
)
returns public.reports
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $$
declare
  target public.reports;
  published public.reports;
begin
  select r.*
  into target
  from public.reports r
  where r.id = target_report_id
    and r.created_by = auth.uid()
  for update;

  if target.id is null then
    raise exception 'REPORT_NOT_FOUND';
  end if;

  if target.status <> 'DRAFT' then
    raise exception 'REPORT_NOT_DRAFT';
  end if;

  if target.title is null
    or char_length(btrim(target.title)) < 1 then
    raise exception 'REPORT_TITLE_REQUIRED';
  end if;

  if target.description is null
    or char_length(btrim(target.description)) < 10 then
    raise exception 'REPORT_DESCRIPTION_REQUIRED';
  end if;

  if target.report_type = 'LOST_PET'
    and target.pet_id is null then
    raise exception 'REPORT_PET_REQUIRED';
  end if;

  if target.public_location is null
    and (
      target.municipality_name is null
      or char_length(btrim(target.municipality_name)) < 1
    ) then
    raise exception 'REPORT_LOCATION_REQUIRED';
  end if;

  update public.reports
  set
    status = 'ACTIVE',
    published_at = timezone('utc', now()),
    updated_at = timezone('utc', now())
  where id = target_report_id
    and created_by = auth.uid()
    and status = 'DRAFT'
  returning *
  into published;

  if published.id is null then
    raise exception 'REPORT_PUBLISH_CONFLICT';
  end if;

  insert into public.report_events (
    report_id,
    actor_id,
    event_type,
    from_status,
    to_status,
    metadata
  )
  values (
    published.id,
    auth.uid(),
    'PUBLISHED',
    'DRAFT',
    'ACTIVE',
    jsonb_build_object(
      'published_at',
      published.published_at
    )
  );

  return published;
end;
$$;

revoke all on function
  public.publish_report_draft(uuid)
from public;

grant execute on function
  public.publish_report_draft(uuid)
to authenticated;
