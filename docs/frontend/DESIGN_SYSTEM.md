---
id: DESIGN_SYSTEM
title: Design System de BuscoHuella
version: 0.1.0
status: Proposed
owner: Design, Frontend & Accessibility
last_reviewed: 2026-08-05
depends_on:
  - FD-003
  - INCLUSIVE_DESIGN
  - I18N_AND_THEME_STRATEGY
---

# Design System de BuscoHuella

## 1. Alcance

El sistema cubre:

- web pública;
- área privada;
- futura aplicación móvil;
- intranets profesionales;
- interfaces administrativas;
- correos y notificaciones cuando proceda.

No obliga a que React y React Native compartan el mismo componente renderizado.
Comparten semántica, nombres, comportamiento y criterios.

## 2. Capas

```text
Brand
→ identidad y expresión

Foundations
→ color, tipografía, espacio, forma, movimiento

Tokens
→ valores nombrados y tematizables

Primitives
→ controles y superficies elementales

Components
→ unidades reutilizables

Patterns
→ soluciones repetibles

Flows
→ secuencias de producto
```

## 3. Nomenclatura

Los nombres describen función, no apariencia.

Correcto:

```text
surface
text-muted
border-danger
action-primary
status-warning
focus-ring
```

Incorrecto:

```text
green-button
gray-text
orange-box
```

## 4. Estados comunes

Todo componente interactivo contempla cuando proceda:

- default;
- hover;
- focus-visible;
- active/pressed;
- disabled;
- loading;
- error;
- success;
- warning;
- selected;
- expanded;
- read-only.

## 5. Variantes

Las variantes expresan jerarquía:

- `primary`;
- `secondary`;
- `tertiary`;
- `ghost`;
- `danger`.

No se crean variantes únicamente para resolver una pantalla concreta.

## 6. Densidad

Se contemplan:

- `comfortable` para ciudadanía y móvil;
- `compact` para intranets y tablas;
- objetivos táctiles mínimos independientes de la densidad visual.

## 7. Contenido

Los componentes deben soportar:

- textos largos;
- pluralización;
- errores;
- descripciones;
- icono opcional;
- idioma RTL futuro;
- zoom;
- nombres accesibles.

## 8. Responsabilidad

El componente garantiza su semántica básica. El flujo garantiza:

- orden;
- contexto;
- mensajes;
- gestión de foco;
- contenido;
- permisos;
- recuperación de errores.

## 9. Gobernanza

Un nuevo componente requiere:

- caso reutilizable;
- estados;
- accesibilidad;
- tema claro y oscuro;
- comportamiento responsive;
- textos;
- documentación;
- pruebas;
- propietario.