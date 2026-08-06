# FP-015B — Fotografías de avisos publicados

Permite gestionar fotografías en avisos `DRAFT`, `ACTIVE` y `PAUSED`.

Incluye:

- subida segura y optimización WEBP;
- eliminación;
- elección de fotografía principal;
- reordenación accesible;
- políticas privadas de Storage por propietario;
- evento `UPDATED` para cambios en avisos publicados;
- acceso desde el detalle privado;
- conservación del flujo de publicación para borradores.

No se permite modificar fotografías de avisos `RESOLVED`, `CLOSED` o
`ARCHIVED`.

El componente `report-card-description.tsx` separa visualmente el resumen
de los detalles importantes. Su integración completa en la tarjeta se hará
junto con la siguiente revisión visual del listado para no sobrescribir
cambios locales no versionados.
