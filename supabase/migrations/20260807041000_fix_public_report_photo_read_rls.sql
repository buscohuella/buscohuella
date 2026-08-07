create or replace function public.is_public_active_report(
  target_report_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.reports r
    where r.id = target_report_id
      and r.status = 'ACTIVE'
      and r.published_at is not null
  );
$$;

revoke all on function public.is_public_active_report(uuid)
from public;

grant execute on function public.is_public_active_report(uuid)
to anon, authenticated;

drop policy if exists report_photos_select_public_active
on public.report_photos;

create policy report_photos_select_public_active
on public.report_photos
for select
to anon, authenticated
using (
  public.is_public_active_report(report_id)
);

drop policy if exists "report photos public active select"
on storage.objects;

create policy "report photos public active select"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'report-photos'
  and array_length(
    storage.foldername(name),
    1
  ) = 2
  and public.is_public_active_report(
    ((storage.foldername(name))[2])::uuid
  )
);
