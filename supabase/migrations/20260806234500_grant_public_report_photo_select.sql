-- FP-017A fix: permitir lectura pública de metadatos de fotografías
-- únicamente bajo las políticas RLS existentes.

grant select on table public.report_photos
to anon, authenticated;
