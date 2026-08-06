# FP-016 — Página pública del aviso

## Rutas

- `/reportes`
- `/reportes/[id]`

Solo aparecen avisos `ACTIVE` con `published_at`.

No se exponen propietario, ubicación exacta, domicilio, notas privadas,
microchip, historial interno ni fotos de avisos no activos.

El contacto respeta `contact_mode`. Las fotografías continúan en un
bucket privado y se sirven mediante URLs firmadas temporales.

El detalle incluye SEO dinámico, canonical, Open Graph, Twitter, galería,
compartir y el CTA preparado para FP-017.
