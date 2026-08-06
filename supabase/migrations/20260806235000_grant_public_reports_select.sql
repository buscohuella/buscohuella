-- FP-017A fix: permitir que las políticas públicas de fotografías
-- consulten la tabla reports manteniendo RLS activa.

grant select on table public.reports
to anon, authenticated;
