# FP-018.1 — Timeline completo del colaborador

## Objetivo

Mostrar al autor de un avistamiento una secuencia fiable de lo que ha ocurrido
después de enviar su aportación.

## Fuente de verdad

El timeline se deriva de `report_events`.

No se guardan frases de interfaz como datos de negocio.

## Eventos visibles

Relacionados directamente con el avistamiento:

- `SIGHTING_CREATED`;
- `SIGHTING_REVIEWED`.

Cuando `SIGHTING_REVIEWED` tiene estado:

- `ACCEPTED`;
- `REJECTED`;
- `FLAGGED`;

la interfaz muestra una descripción específica.

Cambios posteriores relevantes del aviso:

- `PAUSED`;
- `REACTIVATED`;
- `RESOLVED`;
- `CLOSED`;
- `ARCHIVED`.

Solo se consideran eventos del aviso posteriores a la creación del
avistamiento.

## Seguridad

`get_my_sighting_timeline()` verifica que `sightings.created_by = auth.uid()`.

Un colaborador no puede consultar el timeline de avistamientos realizados por
otros usuarios.

## Normalización

Los eventos históricos duplicados de ciclo de vida se deduplican por tipo y
timestamp.

Los eventos `SIGHTING_CREATED` antiguos duplicados se condensan en una única
entrada usando la primera fecha registrada.

## Reputación futura

Estos eventos son hechos auditables y podrán convertirse en entradas del
futuro motor de reputación/puntos mediante reglas versionadas.

El timeline no calcula puntos ni reputación.

## Próximo bloque

FP-019 — centro de notificaciones internas.
