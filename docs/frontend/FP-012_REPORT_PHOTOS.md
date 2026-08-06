# FP-012 — Fotografías de avisos

1. Extraer en la raíz del repositorio.
2. Ejecutar `scripts/apply-fp012-report-photos.ps1`.
3. Aplicar `supabase/migrations/20260806180000_report_photos_storage.sql`
   mediante el flujo habitual de migraciones.
4. Validar typecheck, lint y build.
5. Abrir `/mis-reportes/<REPORT_ID>/fotos`.
