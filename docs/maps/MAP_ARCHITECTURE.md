---
id: MAP_ARCHITECTURE
title: Arquitectura de mapas
version: 1.0.0
status: Proposed
owner: Maps, Product, Engineering & Accessibility
last_reviewed: 2026-08-05
depends_on:
  - ARCHITECTURE_PRINCIPLES
  - FD-001
  - REPORT_PRIVACY
---

# Arquitectura de mapas

## 1. Propósito

El mapa es una representación de casos y contexto territorial, no la fuente
única de verdad ni la única interfaz.

## 2. Capas

```text
cartografía base
límites administrativos
zonas operativas
lugares y vías
reportes
avistamientos
coberturas
malla técnica
riesgos y zonas sensibles
```

Las capas técnicas pueden permanecer invisibles para el usuario.

## 3. Contratos propios

La aplicación no consumirá directamente un proveedor desde todos los
componentes. Se definirán contratos para:

- renderizado;
- geocodificación;
- geocodificación inversa;
- búsqueda de lugares;
- cálculo de distancias;
- ajuste a vías;
- límites;
- estilos;
- atribución.

## 4. Modelo de ubicación de reporte

```text
exact_location
public_location
public_precision
territorial_snapshot
grid_cell
nearby_places
routing_snapshot
```

La ubicación exacta nunca se deriva de nuevo desde el texto público.

## 5. Selección de ubicación

El usuario podrá:

- usar posición actual;
- buscar dirección o lugar;
- mover un marcador;
- elegir en listado;
- confirmar contexto territorial;
- corregir una descripción.

La interfaz nunca obligará a precisión falsa.

## 6. Accesibilidad

El mapa tendrá siempre alternativa equivalente:

- lista de resultados;
- búsqueda textual;
- filtros;
- distancia;
- municipio/zona;
- fecha;
- acciones;
- indicación de ubicación aproximada.

## 7. Tema

Se contemplarán:

- estilo claro;
- estilo oscuro;
- contraste de marcadores;
- formas e iconos además del color;
- foco visible;
- reducción de movimiento.

## 8. Rendimiento

- clustering;
- carga por viewport;
- paginación textual;
- consultas por celdas;
- caché de datos estables;
- límites de resultados;
- generalización de polígonos.

## 9. Privacidad

No se colocará públicamente un marcador exacto cuando pueda revelar:

- domicilio;
- ubicación de animal robado;
- colonia sensible;
- refugio temporal;
- persona vulnerable;
- infraestructura restringida.

## 10. Modelo unificado

La definición canónica de una ubicación se mantiene en:

- `docs/architecture/LOCATION_MODEL.md`.

El mapa consume una representación de `Location`; no define por sí solo la
identidad, privacidad o contexto territorial de la ubicación.

## 11. Notificaciones geográficas

La selección de audiencias se documenta en:

- `docs/notifications/GEOGRAPHIC_NOTIFICATIONS.md`.

Las alertas combinan proximidad, malla, territorios y preferencias y no se
detienen automáticamente en una frontera municipal.
