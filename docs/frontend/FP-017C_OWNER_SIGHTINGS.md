# FP-017C — Bandeja de avistamientos del propietario

## Rutas

- `/avistamientos`
- `/avistamientos/[id]`

## Bandeja

Muestra todos los avistamientos asociados a avisos propiedad del usuario.

Prioriza `PENDING` y muestra:

- aviso relacionado;
- momento;
- ubicación;
- confianza;
- número de fotografías;
- comentario;
- estado de revisión.

## Estados

La base conserva los valores existentes:

- `PENDING` → Nuevo;
- `ACCEPTED` → Revisado;
- `REJECTED` → Descartado;
- `FLAGGED` → Marcado.

## Seguridad

El propietario no obtiene un `UPDATE` genérico sobre `sightings`.
La revisión se realiza mediante `review_owned_report_sighting`, que únicamente
permite modificar `review_status` cuando el aviso pertenece al usuario.

## Privacidad

El detalle puede mostrar al propietario:

- ubicación exacta GPS;
- referencia manual;
- fotografías privadas.

La identidad del autor del avistamiento no se muestra en esta fase.

## Futuro

Esta bandeja será la fuente de:

- contador de nuevos avistamientos;
- notificación interna;
- push;
- chat contextual;
- mapa de avistamientos.
