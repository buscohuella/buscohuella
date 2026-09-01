-- Distingue títulos generados por BuscoHuella de títulos escritos por el propietario.
alter table public.reports
  add column if not exists title_source text not null default 'CUSTOM';

alter table public.reports
  drop constraint if exists reports_title_source_check;

alter table public.reports
  add constraint reports_title_source_check
  check (title_source in ('SYSTEM', 'CUSTOM'));

comment on column public.reports.title_source is
  'SYSTEM para títulos generados por BuscoHuella; CUSTOM para títulos escritos por el propietario.';

-- Backfill conservador de los avisos perdidos generados por la aplicación.
update public.reports r
set title_source = 'SYSTEM'
from public.pets p
where r.pet_id = p.id
  and r.report_type = 'LOST_PET'
  and r.title in (p.name || ' se ha perdido', p.name || ' s''ha perdut');

-- Si un propietario modifica el título, deja de ser un título del sistema.
create or replace function public.mark_custom_report_title()
returns trigger
language plpgsql
security invoker
set search_path = public, pg_temp
as $$
begin
  if tg_op = 'UPDATE' and new.title is distinct from old.title then
    new.title_source := 'CUSTOM';
  end if;
  return new;
end;
$$;

drop trigger if exists reports_mark_custom_title on public.reports;
create trigger reports_mark_custom_title
before update of title on public.reports
for each row execute function public.mark_custom_report_title();

revoke all on function public.mark_custom_report_title() from public;
