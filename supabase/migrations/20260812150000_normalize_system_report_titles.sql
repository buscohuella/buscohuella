-- Los títulos generados no deben depender del idioma de la interfaz.
-- Conservamos los títulos personalizados y normalizamos únicamente los automáticos.
update public.reports as reports
set title = pets.name,
    updated_at = now()
from public.pets as pets
where reports.title_source = 'SYSTEM'
  and reports.report_type = 'LOST_PET'
  and reports.pet_id = pets.id
  and reports.title is distinct from pets.name;

comment on column public.reports.title is
  'Texto escrito por el usuario o nombre de mascota para títulos generados por el sistema; nunca se traduce automáticamente.';
