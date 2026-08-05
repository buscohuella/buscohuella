---
id: GEOSPATIAL_GRID_STRATEGY
title: Estrategia de malla geoespacial
version: 0.1.0
status: Proposed
owner: Maps, Data & Engineering
last_reviewed: 2026-08-05
---

# Estrategia de malla geoespacial

## Propósito

La malla divide el territorio en celdas estables para proximidad, búsqueda,
notificaciones, densidad, privacidad y cobertura.

No sustituye polígonos administrativos ni lugares.

## Usos

- alertas cercanas;
- ampliación progresiva de búsqueda;
- celdas vecinas;
- zonas limítrofes;
- agregaciones;
- caché;
- heatmaps;
- cobertura parcial;
- anonimización;
- consultas escalables.

## Resoluciones

Se utilizarán diferentes resoluciones:

- alta: entorno urbano y proximidad;
- media: cobertura local;
- baja: agregación regional.

La resolución concreta se decidirá tras pruebas con Sabadell.

## Tecnología

Se evaluará H3 o una alternativa equivalente según:

- soporte PostGIS;
- ecosistema web/móvil;
- estabilidad de IDs;
- consultas de vecinos;
- licencias;
- coste operativo;
- portabilidad.

La ADR no fija todavía una librería definitiva.

## Privacidad

La celda pública puede ser menos precisa que la celda privada. No se publicará
el identificador cuando permita reconstruir una ubicación sensible.

## Límites

Una alerta no se corta en el límite de un municipio. Se expande por distancia,
vecindad de celdas y reglas operativas.