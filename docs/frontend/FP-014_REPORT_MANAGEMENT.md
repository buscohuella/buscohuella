# FP-014 — Detalle privado y ciclo de vida

## Rutas

- `/mis-reportes/[id]`

## Acciones

- ACTIVE → PAUSED
- PAUSED → ACTIVE
- ACTIVE/PAUSED → RESOLVED
- ACTIVE/PAUSED → CLOSED
- RESOLVED/CLOSED → ARCHIVED

Todas las transiciones se realizan mediante una función SQL atómica y
registran un evento en `report_events`.

La eliminación física no se permite para avisos publicados con historial. Un propietario puede eliminar definitivamente un aviso archivado que no tenga avistamientos asociados, después de una confirmación explícita. Los avisos archivados con avistamientos se conservan para no perder la trazabilidad.
