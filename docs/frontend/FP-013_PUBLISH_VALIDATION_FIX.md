# FP-013 — Corrección de validación de publicación

La validación anterior exigía coordenadas exactas y momento exacto para
todos los avisos activos.

La nueva validación distingue:

- GPS: ubicación exacta privada y ubicación pública aproximada.
- Manual: referencia con precisión `MUNICIPALITY_ONLY`, sin inventar
  coordenadas.
- Momento aproximado: permite `incident_at = null` cuando el usuario
  seleccionó `RECENT`, `TODAY` o `YESTERDAY`.

No se modifica la privacidad de los avisos con GPS.
