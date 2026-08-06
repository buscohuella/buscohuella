-- FP-012: almacenamiento privado y operaciones de fotografías de avisos.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'report-photos',
  'report-photos',
  false,
  8388608,
  array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists
  "report photos owner select"
on storage.objects;

create policy
  "report photos owner select"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'report-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.reports r
    where r.id::text = (storage.foldername(name))[2]
      and r.created_by = auth.uid()
  )
);

drop policy if exists
  "report photos owner insert"
on storage.objects;

create policy
  "report photos owner insert"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'report-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.reports r
    where r.id::text = (storage.foldername(name))[2]
      and r.created_by = auth.uid()
      and r.status = 'DRAFT'
  )
);

drop policy if exists
  "report photos owner delete"
on storage.objects;

create policy
  "report photos owner delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'report-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1
    from public.reports r
    where r.id::text = (storage.foldername(name))[2]
      and r.created_by = auth.uid()
      and r.status = 'DRAFT'
  )
);

create or replace function public.set_report_primary_photo(
  target_photo_id uuid
)
returns public.report_photos
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.report_photos;
begin
  select rp.*
  into target
  from public.report_photos rp
  join public.reports r
    on r.id = rp.report_id
  where rp.id = target_photo_id
    and r.created_by = auth.uid()
    and r.status = 'DRAFT';

  if target.id is null then
    raise exception 'REPORT_PHOTO_NOT_FOUND';
  end if;

  update public.report_photos
  set is_primary = false
  where report_id = target.report_id;

  update public.report_photos
  set is_primary = true
  where id = target_photo_id
  returning * into target;

  return target;
end;
$$;

revoke all on function
  public.set_report_primary_photo(uuid)
from public;

grant execute on function
  public.set_report_primary_photo(uuid)
to authenticated;

create or replace function public.reorder_report_photos(
  target_report_id uuid,
  ordered_photo_ids uuid[]
)
returns setof public.report_photos
language plpgsql
security definer
set search_path = public
as $$
declare
  expected_count integer;
  supplied_count integer;
begin
  if not exists (
    select 1
    from public.reports r
    where r.id = target_report_id
      and r.created_by = auth.uid()
      and r.status = 'DRAFT'
  ) then
    raise exception 'REPORT_FORBIDDEN';
  end if;

  select count(*)
  into expected_count
  from public.report_photos
  where report_id = target_report_id;

  supplied_count :=
    coalesce(array_length(ordered_photo_ids, 1), 0);

  if expected_count <> supplied_count then
    raise exception 'REPORT_PHOTO_ORDER_MISMATCH';
  end if;

  if exists (
    select 1
    from unnest(ordered_photo_ids) photo_id
    left join public.report_photos rp
      on rp.id = photo_id
      and rp.report_id = target_report_id
    where rp.id is null
  ) then
    raise exception 'REPORT_PHOTO_ORDER_MISMATCH';
  end if;

  update public.report_photos rp
  set position = ordered.ordinality - 1
  from unnest(ordered_photo_ids)
    with ordinality as ordered(photo_id, ordinality)
  where rp.id = ordered.photo_id
    and rp.report_id = target_report_id;

  return query
  select *
  from public.report_photos
  where report_id = target_report_id
  order by position, created_at;
end;
$$;

revoke all on function
  public.reorder_report_photos(uuid, uuid[])
from public;

grant execute on function
  public.reorder_report_photos(uuid, uuid[])
to authenticated;
