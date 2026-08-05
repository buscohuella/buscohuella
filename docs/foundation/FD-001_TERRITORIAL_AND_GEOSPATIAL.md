---
id: FD-001
title: Arquitectura territorial y geoespacial
version: 0.1.0
status: In Progress
owner: Product, Engineering, Maps & Security
last_reviewed: 2026-08-05
---

# FD-001 — Arquitectura territorial y geoespacial

## Objetivo

Crear la base para clasificar, proteger, buscar, notificar y enrutar casos
según su posición, sin reducir el territorio a un nombre de municipio.

## España como primera configuración

El piloto comienza en Sabadell y España. Se soportarán sus estructuras
administrativas y fuentes oficiales, sin convertirlas en el modelo universal.

Ejemplo:

```text
España
→ Cataluña
→ Barcelona
→ Vallès Occidental
→ Sabadell
→ distrito
→ sector
→ barrio
```

## Capas simultáneas

Un punto puede pertenecer a múltiples capas:

1. administrativas;
2. operativas;
3. naturales;
4. viales;
5. lugares;
6. técnicas mediante malla;
7. coberturas de organizaciones.

## Entregas

### Entrega 1 — Arquitectura

- [x] principios;
- [x] modelo territorial;
- [x] malla geoespacial;
- [x] lugares y direcciones;
- [x] jurisdicción y routing;
- [x] privacidad;
- [x] ADR fundamentales.

### Entrega 2 — Contratos mínimos para FP-011

- [ ] tipos de ubicación;
- [ ] contrato de geocodificación inversa;
- [ ] snapshot territorial de un reporte;
- [ ] estrategia de precisión pública;
- [ ] validación de coordenadas;
- [ ] proveedor encapsulado.

### Entrega 3 — Base de datos territorial inicial

- [ ] decidir tablas mínimas;
- [ ] migración;
- [ ] índices PostGIS;
- [ ] procedencia y vigencia;
- [ ] RLS;
- [ ] pruebas.

### Entrega 4 — Sabadell piloto

- [ ] importar o enlazar límites;
- [ ] municipios colindantes;
- [ ] barrios/distritos disponibles;
- [ ] lugares críticos;
- [ ] fuentes y licencias;
- [ ] validación manual.

## No objetivos inmediatos

- cargar todas las calles de España en Supabase;
- sustituir un proveedor cartográfico;
- determinar automáticamente responsabilidades legales definitivas;
- construir analítica predictiva;
- crear toda la red de organizaciones.

## Modelo unificado de ubicación

FD-001 adopta `docs/architecture/LOCATION_MODEL.md` como contrato conceptual
para relacionar coordenadas, dirección, lugar, territorios, malla, cobertura,
fuente, confianza y privacidad.

Antes de FP-011 se definirá el contrato mínimo de `LocationSnapshot`.
