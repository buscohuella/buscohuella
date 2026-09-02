-- Archived reports are user-owned test/history data and may be permanently
-- removed after the explicit confirmation in the application.
create policy sightings_delete_archived_owner
on public.sightings
for delete
to authenticated
using (
  exists (
    select 1
    from public.reports
    where reports.id = sightings.report_id
      and reports.created_by = (select auth.uid())
      and reports.status = 'ARCHIVED'
  )
);

grant delete on table public.sightings to authenticated;
