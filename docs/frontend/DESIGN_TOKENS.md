---
id: DESIGN_TOKENS
title: Tokens de diseño
version: 0.1.0
status: Proposed
owner: Design & Frontend
last_reviewed: 2026-08-05
---

# Tokens de diseño

## 1. Niveles

### Primitivos

Valores sin intención de producto:

```text
color.green.700
space.4
radius.3
font.size.2
duration.fast
```

### Semánticos

Expresan propósito:

```text
color.action.primary
color.surface.base
color.text.muted
color.status.danger
color.focus.ring
```

### De componente

Solo cuando un componente necesita contrato estable:

```text
button.primary.background
map.marker.lost.background
dialog.backdrop
```

## 2. Familias

- color;
- tipografía;
- espaciado;
- tamaño;
- radio;
- borde;
- sombra/elevación;
- opacidad;
- movimiento;
- z-index;
- densidad;
- iconografía.

## 3. Color

Se separan:

- marca;
- superficies;
- texto;
- bordes;
- acciones;
- estados;
- mapas;
- datos.

Los estados no dependen solo de color.

## 4. Tipografía

La escala debe definir:

- familia;
- tamaño;
- altura de línea;
- peso;
- tracking;
- longitud recomendada.

Roles:

- display;
- heading;
- title;
- body;
- label;
- helper;
- caption;
- code.

## 5. Espaciado

Se utilizará una escala limitada basada en múltiplos coherentes. No se
introducen valores arbitrarios sin justificar.

## 6. Tamaño táctil

- mínimo general: 44 × 44 CSS px;
- objetivo preferente móvil: 48 × 48;
- separación suficiente entre acciones peligrosas.

## 7. Movimiento

Tokens:

- instant;
- fast;
- normal;
- slow;
- easing standard;
- easing enter;
- easing exit.

Con reducción de movimiento, las transiciones no esenciales desaparecen.

## 8. Z-index

Capas nombradas:

```text
base
sticky
dropdown
popover
overlay
dialog
toast
critical
```

No se usan números arbitrarios dentro de componentes.

## 9. Temas

Los temas sustituyen valores semánticos, no la estructura del componente:

- light;
- dark;
- system;
- high-contrast futuro si existe evidencia.

## 10. Web y móvil

Los tokens tendrán una fuente canónica exportable. Cada plataforma adapta:

- unidades;
- tipografía;
- sombras;
- interacción;
- capacidades del sistema.