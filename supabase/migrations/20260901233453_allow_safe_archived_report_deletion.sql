-- Only archived reports can be physically removed by their owner.
-- Published history with sightings is protected by the server action and the
-- restrictive sightings foreign key; this policy is an additional database
-- guard, not a replacement for the confirmation flow.
create policy reports_delete_archived_owner
on public.reports
for delete
to authenticated
using (
  created_by = (select auth.uid())
  and status = 'ARCHIVED'
);

create policy report_events_delete_archived_owner
on public.report_events
for delete
to authenticated
using (
  exists (
    select 1
    from public.reports
    where reports.id = report_events.report_id
      and reports.created_by = (select auth.uid())
      and reports.status = 'ARCHIVED'
  )
);

grant delete on table public.reports to authenticated;
grant delete on table public.report_events to authenticated;
