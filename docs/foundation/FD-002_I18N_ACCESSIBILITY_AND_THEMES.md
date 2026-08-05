---
id: FD-002
title: i18n, accesibilidad y temas
version: 0.1.0
status: In Progress
owner: Product, Frontend, UX & Accessibility
last_reviewed: 2026-08-05
---

# FD-002 — i18n, accesibilidad y temas

## Objetivo

Activar antes de FP-011 la infraestructura mínima para que las nuevas
pantallas nazcan traducibles, accesibles y compatibles con temas.

## Alcance inmediato

### i18n

- librería y arquitectura;
- namespaces;
- `es` como idioma por defecto;
- `ca` operativo;
- preparación de `eu`, `gl`, `en`;
- detección y persistencia;
- `Intl` para fecha, hora, distancia y número;
- errores traducibles;
- metadatos y formularios.

### Accesibilidad

- skip link;
- estructura semántica;
- foco visible;
- navegación por teclado;
- formularios accesibles;
- mensajes con `aria-live`;
- diálogos;
- reducción de movimiento;
- zoom y reflow;
- alternativa textual al mapa;
- checklist por Feature Pack.

### Temas

- tokens semánticos;
- `light` y `dark`;
- persistencia;
- evitar parpadeo inicial;
- contraste en ambos temas;
- mapas y marcadores tematizables.

## Entregas

### Entrega 1 — Auditoría de base

- [ ] inventario de textos;
- [ ] inventario de colores rígidos;
- [ ] componentes críticos;
- [ ] navegación y formularios;
- [ ] riesgos antes de FP-011.

### Entrega 2 — Infraestructura

- [ ] librería i18n;
- [ ] diccionarios `es` y `ca`;
- [ ] namespaces;
- [ ] proveedor de idioma;
- [ ] selector;
- [ ] persistencia;
- [ ] tokens y proveedor de tema.

### Entrega 3 — Componentes base

- [ ] botones;
- [ ] inputs;
- [ ] selects;
- [ ] combobox;
- [ ] diálogos;
- [ ] alertas;
- [ ] navegación;
- [ ] estados de carga;
- [ ] mensajes de error.

### Entrega 4 — Validación

- [ ] teclado;
- [ ] NVDA básico;
- [ ] zoom 200 %;
- [ ] viewport móvil;
- [ ] contraste;
- [ ] tema oscuro;
- [ ] cambio de idioma;
- [ ] build y tests.

## Regla para FP-011

FP-011 no comienza su interfaz final hasta que la Entrega 2 esté operativa.

## Diseño inclusivo

FD-002 incorpora `docs/ux/INCLUSIVE_DESIGN.md`.

Además de WCAG 2.2 AA, los flujos visibles contemplarán estrés, dislexia, TDAH,
personas mayores, baja alfabetización digital, una sola mano, conexión lenta,
móviles antiguos y contextos de uso en calle.
