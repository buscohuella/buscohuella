# FP-018 — Mis avistamientos

## Objetivo

Dar a la persona colaboradora un espacio donde consultar las aportaciones que
ha realizado y conocer su evolución.

## Rutas

- `/mis-avistamientos`
- `/mis-avistamientos/[id]`

## Listado

Incluye:

- aviso relacionado;
- fecha del avistamiento;
- ubicación enviada;
- número de fotografías;
- estado de revisión;
- estado cerrado/resuelto del aviso;
- filtros por estado;
- paginación de 20 registros.

## Detalle

El colaborador puede consultar:

- sus datos enviados;
- su comentario;
- su ubicación;
- sus fotografías;
- si el propietario lo ha revisado;
- si el aviso continúa activo o ha finalizado;
- hitos básicos: enviado, revisado y caso cerrado.

Puede volver a gestionar sus fotografías mientras el caso siga abierto.

## Privacidad

No se muestra:

- identidad del propietario;
- teléfono/correo privado;
- información interna de gestión;
- ubicación privada del propietario.

Las RPCs solo devuelven avistamientos cuyo `created_by` coincide con
`auth.uid()`.

## FP-018.1

La siguiente entrega ampliará el seguimiento básico a un timeline completo
basado en eventos persistentes e idempotentes.
