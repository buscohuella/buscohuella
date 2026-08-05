---
id: FOUNDATION_PACKS
title: Foundation Packs
version: 1.1.0
status: Active
owner: Product & Engineering
last_reviewed: 2026-08-06
---

# Foundation Packs

## Propósito

Un Foundation Pack define una capacidad transversal que soporta varios
Feature Packs, aplicaciones o fases del producto.

```text
Foundation Pack
→ capacidad transversal y reutilizable

Feature Pack
→ entrega funcional verificable
```

## Estados

- `Planned`;
- `Ready`;
- `In Progress`;
- `Completed`;
- `Evolving`;
- `Deferred`.

`Evolving` significa que la base está operativa, pero continuará ampliándose.

## Catálogo canónico

### FD-001 — Arquitectura territorial y geoespacial

**Estado:** `In Progress`

La arquitectura documental está definida, pero sus contratos mínimos todavía
deben implementarse en datos y servicios antes de considerarla operativa.

Incluye territorios, jerarquías, límites, lugares, direcciones, malla,
proximidad, privacidad, jurisdicciones, routing, coberturas, España como
primera configuración y expansión internacional.

### FD-002 — i18n, accesibilidad y temas

**Estado:** `In Progress`

Incluye infraestructura i18n, namespaces, claves, formatos regionales,
español y catalán, preparación de otros idiomas, teclado, lectores de
pantalla, diseño inclusivo, tokens semánticos y temas.

### FD-003 — Design System

**Estado:** `In Progress`

Incluye tokens, temas, tipografía, espaciado, movimiento, foco, componentes,
formularios, mapas, patrones responsive y contratos compartidos web/móvil.

Estado operativo:

- Entregas 1, 2 y 3 completadas;
- Auth migrado;
- siguiente: i18n mínimo y Perfil;
- pendiente: catálogo, migraciones restantes y auditoría final.

### FD-004 — Identidad, organizaciones, roles y permisos

**Estado:** `Planned`

Incluye organizaciones, membresías, roles, capacidades, asignaciones,
verificación, permisos profesionales y auditoría.

Preparará intranets de protectoras, veterinarios, policías,
administraciones y equipo interno.

### FD-005 — Observabilidad y operaciones

**Estado:** `Planned`

Incluye:

- gestión de errores;
- logs estructurados;
- sanitización;
- códigos de incidencia;
- correlación;
- error boundaries;
- métricas y trazas;
- alertas;
- salud del sistema;
- respuesta a incidentes;
- consulta administrativa;
- retención y privacidad.

La primera entrega se activará antes de finalizar los flujos críticos de
FP-011. No se implementa durante el cierre de FD-003.

### FD-006 — Eventos y notificaciones

**Estado:** `Planned`

Incluye eventos de dominio, preferencias, correo, push, colas, reintentos,
límites, contexto geográfico y privacidad.

## Corrección de numeración

La versión anterior contenía dos capacidades diferentes con el identificador
`FD-003`. Desde esta versión, el catálogo canónico utiliza identificadores
únicos:

```text
FD-003 → Design System
FD-004 → Identidad, organizaciones, roles y permisos
FD-005 → Observabilidad y operaciones
FD-006 → Eventos y notificaciones
```

## Regla de dependencia

Los Feature Packs declaran únicamente los Foundation Packs que necesitan.

Una idea transversal nueva se clasifica así:

```text
bloquea el trabajo actual
→ se incorpora ahora

debe existir antes del siguiente flujo crítico
→ se programa como próximo

mejora futura
→ se registra en backlog
```
