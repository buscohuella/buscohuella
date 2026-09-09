-- R1-B.1 / P0-INT-001
-- Establish a single authority for report domain events.
--
-- Creation remains automatically audited through reports_audit_change.
-- Post-creation domain mutations are audited by their explicit RPC producers:
--   - publish_report_draft
--   - manage_report_lifecycle
--   - update_owned_report_content
--   - record_report_photo_update
--
-- This removes duplicate lifecycle/content events and phantom UPDATED events
-- produced by no-op report updates.
--
-- Forward-only migration. No historical report_events are modified.

drop trigger if exists reports_audit_change on public.reports;

create trigger reports_audit_change
after insert on public.reports
for each row
execute function public.audit_report_change();
