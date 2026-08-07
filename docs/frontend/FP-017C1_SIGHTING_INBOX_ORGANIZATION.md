# FP-017C.1 — Organización de la bandeja de avistamientos

## Objetivo

Evitar que la bandeja del propietario crezca indefinidamente y permitir gestionar
decenas o cientos de avistamientos sin eliminar evidencia.

## Incluye

- filtros por estado;
- vista de activos, archivados o todos;
- filtro de avistamientos con fotografía;
- orden por fecha, confianza o número de fotos;
- paginación de 20 elementos;
- resumen de activos, nuevos, marcados y archivados;
- archivado y restauración.

## Archivado

Archivar no elimina el avistamiento, las fotos, la ubicación ni los eventos.

Solo se puede archivar cuando el avistamiento está:

- `ACCEPTED`;
- `REJECTED`.

No se archivan directamente:

- `PENDING`, porque requiere revisión;
- `FLAGGED`, porque requiere atención.

El estado de archivado se guarda en `sighting_owner_states`, separado del
contenido original enviado por el colaborador.

## Seguridad

Las operaciones se realizan mediante RPCs `SECURITY DEFINER` que verifican que
el usuario autenticado sea propietario del aviso correspondiente.

La tabla de estado no expone acceso directo a `authenticated`.

## Escalabilidad

La consulta de bandeja pagina en servidor y permite un máximo de 50 registros
por petición. La UI utiliza 20 por página.

## Próximo paso

FP-018 — `Mis avistamientos` para la persona colaboradora.
