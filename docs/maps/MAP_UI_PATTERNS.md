---
id: MAP_UI_PATTERNS
title: Patrones de interfaz geográfica
version: 0.1.0
status: Proposed
owner: Maps, UX, Frontend & Accessibility
last_reviewed: 2026-08-05
depends_on:
  - MAP_ARCHITECTURE
  - LOCATION_MODEL
  - FD-003
---

# Patrones de interfaz geográfica

## Mapa + lista

Mapa y lista son vistas equivalentes del mismo conjunto.

- filtros compartidos;
- selección sincronizada;
- foco preservado;
- orden textual;
- resultados paginables;
- mapa opcional.

## Selector de ubicación

Debe permitir:

- geolocalización;
- búsqueda;
- mover marcador;
- controles de teclado alternativos;
- confirmar descripción;
- ajustar precisión pública;
- indicar ubicación desconocida o aproximada.

## Marcadores

Los marcadores distinguen:

- tipo;
- estado;
- selección;
- prioridad;
- agrupación.

Usan forma, icono y texto además de color.

## Clusters

- anuncian cantidad;
- permiten ampliar;
- no ocultan alternativa textual;
- mantienen contexto al abrirse;
- no simulan precisión inexistente.

## Privacidad

La interfaz diferencia claramente:

- ubicación exacta privada;
- vista pública aproximada;
- texto visible;
- radio o nivel de precisión.

## Estados

- cargando;
- permiso denegado;
- ubicación no disponible;
- sin resultados;
- error del proveedor;
- offline;
- datos parciales;
- demasiados resultados.

Cada estado mantiene una acción útil.