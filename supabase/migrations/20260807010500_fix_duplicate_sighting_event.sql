-- FP-017A: evitar eventos duplicados al crear un avistamiento.
-- El trigger sightings_audit_created es la única fuente de SIGHTING_CREATED.

create or replace function public.create_report_sighting(
  target_report_id uuid,
  target_observed_at timestamptz,
  target_confidence text,
  target_notes text default null,
  target_location_source text default 'GPS',
  target_latitude double precision default null,
  target_longitude double precision default null,
  target_location_label text default null
)
returns public.sightings
language plpgsql
security definer
set search_path = public, extensions, pg_temp
as $function$
declare
  target_report public.reports;
  created_sighting public.sightings;
  exact_point extensions.geography;
  approximate_point extensions.geography;
  normalized_notes text := nullif(btrim(coalesce(target_notes, '')), '');
  normalized_label text := nullif(btrim(coalesce(target_location_label, '')), '');
begin
  if auth.uid() is null then raise exception 'SIGHTING_AUTH_REQUIRED' using errcode = '42501'; end if;
  select * into target_report from public.reports where id = target_report_id and status = 'ACTIVE' and published_at is not null;
  if target_report.id is null then raise exception 'SIGHTING_REPORT_NOT_AVAILABLE' using errcode = '23503'; end if;
  if target_observed_at is null or target_observed_at > now() then raise exception 'SIGHTING_TIME_INVALID' using errcode = '22007'; end if;
  if target_confidence not in ('CERTAIN','LIKELY','UNSURE') then raise exception 'SIGHTING_CONFIDENCE_INVALID' using errcode = '23514'; end if;
  if normalized_notes is not null and char_length(normalized_notes) > 1000 then raise exception 'SIGHTING_NOTES_TOO_LONG' using errcode = '22001'; end if;
  if target_location_source = 'GPS' then
    if target_latitude is null or target_longitude is null or target_latitude not between -90 and 90 or target_longitude not between -180 and 180 then raise exception 'SIGHTING_COORDINATES_INVALID' using errcode = '22023'; end if;
    exact_point := extensions.st_setsrid(extensions.st_makepoint(target_longitude,target_latitude),4326)::extensions.geography;
    approximate_point := extensions.st_setsrid(extensions.st_makepoint(round(target_longitude::numeric,3)::double precision,round(target_latitude::numeric,3)::double precision),4326)::extensions.geography;
  elsif target_location_source = 'MANUAL' then
    if normalized_label is null then raise exception 'SIGHTING_LOCATION_LABEL_REQUIRED' using errcode = '23514'; end if;
  else
    raise exception 'SIGHTING_LOCATION_SOURCE_INVALID' using errcode = '23514';
  end if;
  insert into public.sightings (report_id,created_by,observed_at,exact_location,public_location,public_location_precision,location_label,location_source,notes,confidence,review_status)
  values (target_report_id,auth.uid(),target_observed_at,exact_point,approximate_point,case when target_location_source='GPS' then 'APPROXIMATE_500M' else 'MUNICIPALITY_ONLY' end,normalized_label,target_location_source,normalized_notes,target_confidence,'PENDING')
  returning * into created_sighting;
  return created_sighting;
end;
$function$;
