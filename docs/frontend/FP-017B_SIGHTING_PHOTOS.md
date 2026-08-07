# FP-017B — Fotografías de avistamientos

- Paso opcional después de crear el avistamiento.
- Hasta 5 imágenes.
- JPG/PNG/WebP, entrada máxima de 8 MB.
- Reutiliza el procesado existente y guarda WebP optimizado.
- Bucket privado `sighting-photos`.
- Lectura: autor del avistamiento o propietario del aviso.
- Escritura/eliminación: únicamente autor del avistamiento.
- Las fotografías no aparecen en la ficha pública.
- FP-017C mostrará estas imágenes en la bandeja del propietario.

La migración ya está aplicada en Supabase.
