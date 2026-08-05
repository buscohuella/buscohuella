---
id: FD-003
title: Design System
version: 0.1.0
status: In Progress
owner: Product, Design, Frontend & Accessibility
last_reviewed: 2026-08-05
depends_on:
  - ARCHITECTURE_PRINCIPLES
  - FD-002
  - FP-006
---

# FD-003 — Design System

## Objetivo

Crear un sistema de diseño funcional, inclusivo y multiplataforma que permita
construir web, futura aplicación móvil e intranets profesionales sin repetir
decisiones visuales, de interacción o accesibilidad.

El Design System no es una colección de pantallas ni una guía de marca.
Define contratos estables:

```text
principios
→ tokens
→ temas
→ primitivas
→ componentes
→ patrones
→ flujos
→ validación
```

## Estado actual

**Estado:** `In Progress`

La web ya dispone de una base útil:

- tokens semánticos iniciales en `globals.css`;
- foco visible global;
- reducción de movimiento;
- botones con tamaños táctiles;
- inputs con estado de error;
- componentes reutilizables.

Todavía falta formalizar:

- escala completa de tokens;
- tema oscuro y preferencia del sistema;
- tipografía;
- espaciado y densidad;
- estados coherentes;
- contratos de componentes;
- patrones de formularios;
- patrones geográficos;
- documentación y pruebas visuales;
- estrategia compartida web/móvil.

## Principios

1. Semántica antes que color literal.
2. Accesibilidad incluida en el componente.
3. La interfaz no depende solo del color, icono, sonido, gesto o mapa.
4. Los componentes admiten textos traducidos de distinta longitud.
5. Web y móvil comparten lenguaje y contratos, no necesariamente el mismo código visual.
6. La personalización no rompe contraste, foco ni legibilidad.
7. Los patrones urgentes reducen carga cognitiva.
8. Los estados son explícitos y consistentes.
9. Se evita crear componentes de una sola pantalla cuando existe un patrón común.
10. El sistema evoluciona con versiones y migraciones controladas.

## Entregas

### Entrega 1 — Definición y auditoría

- [x] Foundation Pack.
- [x] arquitectura documental;
- [x] inventario inicial de deuda;
- [x] principios;
- [x] taxonomía de tokens;
- [x] contrato de estados;
- [x] estándares de componentes;
- [x] formularios;
- [x] patrones de mapa;
- [x] checklist de accesibilidad;
- [x] ADR iniciales.

### Entrega 2 — Tokens y temas web

- [x] tokens primitivos;
- [x] tokens semánticos;
- [x] tema claro;
- [x] tema oscuro;
- [x] detección inicial del tema del dispositivo;
- [x] persistencia;
- [x] evitar parpadeo inicial;
- [ ] contraste validado;
- [x] movimiento y elevación;
- [x] actualización inicial de Button e Input.

### Entrega 3 — Primitivas web

- [ ] Button;
- [x] IconButton;
- [ ] Input;
- [x] Textarea;
- [x] Select;
- [x] Checkbox;
- [x] Radio;
- [x] Switch;
- [x] Field;
- [x] Alert;
- [x] Dialog;
- [x] Sheet;
- [x] Card;
- [x] Badge;
- [x] Skeleton;
- [x] Spinner;
- [x] Progress;
- [x] LiveRegion;
- [x] FormErrorSummary;
- [x] ErrorState.

### Entrega 4 — Patrones

- [ ] formularios por pasos;
- [ ] confirmación y resumen;
- [x] estados vacíos;
- [x] carga y error;
- [x] acciones destructivas mediante ConfirmationDialog compatible;
- [ ] galería;
- [ ] búsqueda;
- [ ] filtros;
- [ ] mapa y lista equivalente;
- [ ] avisos urgentes;
- [ ] navegación responsive.

### Entrega 5 — Calidad

- [ ] catálogo o entorno de demostración;
- [ ] pruebas de teclado;
- [ ] lector de pantalla básico;
- [ ] contraste;
- [ ] zoom 200 %;
- [ ] temas;
- [ ] reducción de movimiento;
- [ ] textos largos;
- [ ] viewport móvil;
- [ ] documentación de migración;
- [ ] build y tests.

## Dependencia de FP-011

FP-011 puede continuar con dominio y datos, pero su interfaz final debe usar:

- tokens semánticos;
- infraestructura de temas;
- componentes base validados;
- patrones de formulario accesibles;
- textos traducibles.