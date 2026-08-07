# FP-012 — Fotografías de avisos

Las fotografías seleccionadas desde la ficha de una mascota se copian al
borrador del aviso cuando la persona marca “Usar las fotos de la ficha”. La
copia utiliza el bucket y los metadatos propios de `report_photos`, por lo que
las fotografías del aviso pueden gestionarse de forma independiente sin
modificar la galería original de la mascota.

1. Extraer en la raíz del repositorio.
2. Ejecutar `scripts/apply-fp012-report-photos.ps1`.
3. Aplicar `supabase/migrations/20260806180000_report_photos_storage.sql`
   mediante el flujo habitual de migraciones.
4. Validar typecheck, lint y build.
5. Abrir `/mis-reportes/<REPORT_ID>/fotos`.
