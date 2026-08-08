create or replace function public.manage_report_lifecycle(
  target_report_id uuid,
  target_action text,
  target_resolution_type text default null,
  target_notes text default null
)
returns public.reports
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $function$
declare
  current_report public.reports;
  updated_report public.reports;
  next_status text;
  event_name text;
begin
  select r.* into current_report from public.reports r
  where r.id = target_report_id and r.created_by = auth.uid() for update;
  if current_report.id is null then raise exception 'REPORT_NOT_FOUND'; end if;

  case target_action
    when 'PAUSE' then
      if current_report.status <> 'ACTIVE' then raise exception 'REPORT_ACTION_INVALID'; end if;
      next_status := 'PAUSED'; event_name := 'PAUSED';
    when 'REACTIVATE' then
      if current_report.status <> 'PAUSED' then raise exception 'REPORT_ACTION_INVALID'; end if;
      next_status := 'ACTIVE'; event_name := 'REACTIVATED';
    when 'RESOLVE' then
      if current_report.status not in ('ACTIVE','PAUSED') then raise exception 'REPORT_ACTION_INVALID'; end if;
      if target_resolution_type is null then raise exception 'REPORT_RESOLUTION_REQUIRED'; end if;
      next_status := 'RESOLVED'; event_name := 'RESOLVED';
    when 'CLOSE' then
      if current_report.status not in ('ACTIVE','PAUSED','DRAFT') then raise exception 'REPORT_ACTION_INVALID'; end if;
      if target_notes is null or btrim(target_notes) = '' then raise exception 'REPORT_CLOSURE_REASON_REQUIRED'; end if;
      next_status := 'CLOSED'; event_name := 'CLOSED';
    when 'ARCHIVE' then
      if current_report.status not in ('RESOLVED','CLOSED') then raise exception 'REPORT_ACTION_INVALID'; end if;
      next_status := 'ARCHIVED'; event_name := 'ARCHIVED';
    else raise exception 'REPORT_ACTION_UNKNOWN';
  end case;

  update public.reports set
    status = next_status,
    resolution_type = case when target_action = 'RESOLVE' then target_resolution_type when target_action = 'ARCHIVE' then null else resolution_type end,
    resolution_notes = case when target_action = 'RESOLVE' then nullif(btrim(target_notes), '') when target_action = 'ARCHIVE' then null else resolution_notes end,
    resolved_at = case when target_action = 'ARCHIVE' then null else resolved_at end,
    closure_reason = case when target_action = 'CLOSE' then btrim(target_notes) when target_action = 'ARCHIVE' then null else closure_reason end,
    closed_at = case when target_action = 'ARCHIVE' then null else closed_at end,
    updated_at = timezone('utc', now())
  where id = target_report_id returning * into updated_report;

  insert into public.report_events (report_id, actor_id, event_type, from_status, to_status, metadata)
  values (updated_report.id, auth.uid(), event_name, current_report.status, updated_report.status,
    jsonb_strip_nulls(jsonb_build_object('resolution_type', target_resolution_type, 'notes', nullif(btrim(target_notes), ''))));
  return updated_report;
end;
$function$;

revoke all on function public.manage_report_lifecycle(uuid, text, text, text) from public;
grant execute on function public.manage_report_lifecycle(uuid, text, text, text) to authenticated;
