create policy pets_delete_archived_own
on public.pets
for delete
to authenticated
using ((select auth.uid()) = owner_id and status = 'ARCHIVED');

grant delete on public.pets to authenticated;
