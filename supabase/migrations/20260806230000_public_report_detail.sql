-- FP-016: detalle público seguro de avisos activos.

create or replace function public.get_public_report(target_report_id uuid)
returns table (
  id uuid,
  report_type text,
  species_id smallint,
  title text,
  description text,
  incident_at timestamptz,
  municipality_name text,
  public_location_precision text,
  latitude double precision,
  longitude double precision,
  contact_mode text,
  public_phone text,
  public_email text,
  pet_name text,
  pet_breed text,
  pet_sex text,
  pet_size text,
  pet_primary_color text,
  published_at timestamptz,
  updated_at timestamptz,
  photos jsonb
)
language sql
stable
security definer
set search_path = public, extensions, pg_temp
as $$
  select
    reports.id,
    reports.report_type,
    reports.species_id,
    reports.title,
    reports.description,
    reports.incident_at,
    reports.municipality_name,
    reports.public_location_precision,
    case
      when reports.public_location is null then null
      else extensions.st_y(reports.public_location::extensions.geometry)
    end,
    case
      when reports.public_location is null then null
      else extensions.st_x(reports.public_location::extensions.geometry)
    end,
    reports.contact_mode,
    case when reports.contact_mode = 'PUBLIC_PHONE' then reports.public_phone else null end,
    case when reports.contact_mode = 'PUBLIC_EMAIL' then reports.public_email else null end,
    pets.name,
    pets.breed,
    pets.sex,
    pets.size,
    pets.primary_color,
    reports.published_at,
    reports.updated_at,
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', report_photos.id,
            'storage_path', report_photos.storage_path,
            'position', report_photos.position,
            'is_primary', report_photos.is_primary,
            'alt_text', report_photos.alt_text,
            'width', report_photos.width,
            'height', report_photos.height
          )
          order by report_photos.position, report_photos.created_at
        )
        from public.report_photos
        where report_photos.report_id = reports.id
      ),
      '[]'::jsonb
    )
  from public.reports
  left join public.pets on pets.id = reports.pet_id
  where reports.id = target_report_id
    and reports.status = 'ACTIVE'
    and reports.published_at is not null;
$$;

revoke all on function public.get_public_report(uuid) from public;
grant execute on function public.get_public_report(uuid) to anon, authenticated;

drop policy if exists "report_photos_select_public_active"
on public.report_photos;

create policy "report_photos_select_public_active"
on public.report_photos
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.reports r
    where r.id = report_photos.report_id
      and r.status = 'ACTIVE'
      and r.published_at is not null
  )
);

drop policy if exists "report photos public active select"
on storage.objects;

create policy "report photos public active select"
on storage.objects
for select
to anon, authenticated
using (
  bucket_id = 'report-photos'
  and exists (
    select 1
    from public.reports r
    where r.id::text = (storage.foldername(name))[2]
      and r.status = 'ACTIVE'
      and r.published_at is not null
  )
);
