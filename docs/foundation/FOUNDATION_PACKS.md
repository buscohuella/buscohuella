---
id: FOUNDATION_PACKS
title: Foundation Packs
version: 1.0.0
status: Active
owner: Product & Engineering
last_reviewed: 2026-08-05
---

# Foundation Packs

## Propósito

Un Foundation Pack define una capacidad transversal que soporta varios
Feature Packs, aplicaciones o fases del producto.

No representa necesariamente una función visible para el usuario.

## Diferencia frente a un Feature Pack

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

`Evolving` significa que la base está operativa, pero se seguirá ampliando.

## Catálogo inicial

### FD-001 — Arquitectura territorial y geoespacial

**Estado:** `In Progress`

Incluye:

- territorios;
- jerarquías;
- límites;
- lugares;
- direcciones;
- malla;
- proximidad;
- privacidad;
- jurisdicciones;
- routing;
- cobertura profesional;
- España como primera configuración;
- expansión internacional.

### FD-002 — i18n, accesibilidad y temas

**Estado:** `In Progress`

Incluye:

- infraestructura i18n;
- namespaces;
- claves;
- formatos regionales;
- español y catalán;
- componentes accesibles;
- formularios;
- teclado;
- lectores de pantalla;
- tokens semánticos;
- tema claro, oscuro y sistema.

### FD-003 — Identidad, roles y permisos

**Estado:** `Planned`

Incluye:

- organizaciones;
- membresías;
- roles;
- capacidades;
- asignaciones;
- verificación;
- permisos profesionales;
- auditoría.

### FD-004 — Eventos y notificaciones

**Estado:** `Planned`

Incluye:

- eventos de dominio;
- preferencias;
- correo;
- push;
- colas;
- reintentos;
- límites;
- privacidad.

### FD-005 — Observabilidad y operaciones

**Estado:** `Planned`

Incluye:

- logs;
- métricas;
- trazas;
- alertas;
- auditoría operativa;
- salud del sistema;
- respuesta a incidentes.

## Regla de dependencia

Los Feature Packs declaran únicamente los Foundation Packs que realmente
necesitan. No se bloquea el MVP por capacidades futuras que no sean necesarias.