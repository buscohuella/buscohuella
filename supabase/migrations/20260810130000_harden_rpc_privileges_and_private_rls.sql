-- Restrict private tables and RPCs while preserving public report reads.

revoke execute on function public.audit_report_change() from anon, authenticated;
revoke execute on function public.audit_sighting_created() from anon, authenticated;
revoke execute on function public.create_notifications_from_report_event() from anon, authenticated;

revoke execute on function public.can_manage_sighting_photo_storage(uuid) from anon;
revoke execute on function public.can_read_sighting_photo_storage(uuid) from anon;
revoke execute on function public.create_report_sighting(uuid, timestamptz, text, text, text, double precision, double precision, text) from anon;
revoke execute on function public.get_my_notifications_page(text, integer, integer) from anon;
revoke execute on function public.get_my_sighting(uuid) from anon;
revoke execute on function public.get_my_sighting_timeline(uuid) from anon;
revoke execute on function public.get_my_sightings() from anon;
revoke execute on function public.get_my_sightings_page(text, integer, integer) from anon;
revoke execute on function public.get_owned_report_sightings(uuid) from anon;
revoke execute on function public.get_owned_sighting_archive_state(uuid) from anon;
revoke execute on function public.get_owned_sightings() from anon;
revoke execute on function public.get_owned_sightings_page(text, text, boolean, text, integer, integer) from anon;
revoke execute on function public.get_owned_sightings_summary() from anon;
revoke execute on function public.get_unread_notification_count() from anon;
revoke execute on function public.manage_report_lifecycle(uuid, text, text, text) from anon;
revoke execute on function public.mark_all_notifications_read() from anon;
revoke execute on function public.mark_notification_read(uuid) from anon;
revoke execute on function public.owns_report(uuid) from anon;
revoke execute on function public.publish_report_draft(uuid) from anon;
revoke execute on function public.record_report_photo_update(uuid, text) from anon;
revoke execute on function public.reorder_report_photos(uuid, uuid[]) from anon;
revoke execute on function public.review_owned_report_sighting(uuid, text) from anon;
revoke execute on function public.set_owned_sighting_archived(uuid, boolean) from anon;
revoke execute on function public.set_report_primary_photo(uuid) from anon;
revoke execute on function public.update_owned_report_content(uuid, text, text, text, text, text, text) from anon;
revoke execute on function public.user_owns_active_pet_for_storage(uuid) from anon;
revoke execute on function public.user_owns_pet_for_storage(uuid) from anon;

drop policy if exists notifications_select_recipient on public.notifications;
create policy notifications_select_recipient
on public.notifications
for select to authenticated
using (recipient_id = (select auth.uid()));

drop policy if exists sighting_owner_states_select_owner on public.sighting_owner_states;
create policy sighting_owner_states_select_owner
on public.sighting_owner_states
for select to authenticated
using (owner_id = (select auth.uid()));

create index if not exists notifications_recipient_read_created_idx
  on public.notifications (recipient_id, read_at, created_at desc);
create index if not exists notifications_report_id_idx on public.notifications (report_id);
create index if not exists notifications_sighting_id_idx on public.notifications (sighting_id);
create index if not exists notifications_actor_id_idx on public.notifications (actor_id);
create index if not exists notifications_source_event_id_idx on public.notifications (source_event_id);
create index if not exists report_events_report_id_idx on public.report_events (report_id);
create index if not exists report_events_actor_id_idx on public.report_events (actor_id);
