---
id: FD-003
title: Design System
version: 0.2.0
status: In Progress
owner: Product, Design, Frontend & Accessibility
last_reviewed: 2026-08-06
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

El Design System define contratos estables:

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

### Completado

- documentación, auditoría y ADR iniciales;
- tokens primitivos y semánticos;
- temas claro y oscuro;
- detección inicial del tema del dispositivo;
- persistencia y prevención del parpadeo inicial;
- primitivas accesibles;
- migración completa de autenticación;
- selector de tema en navegación pública y pantallas de acceso;
- validación robusta de correo;
- requisitos de contraseña en tiempo real;
- resumen accesible de errores;
- flujos reales de registro, confirmación, recuperación y cambio de contraseña;
- typecheck, lint, build y pruebas manuales.

### Pendiente para cierre

- infraestructura i18n mínima real;
- migración de Perfil;
- migración de Mascotas;
- patrones de galería, búsqueda, filtros y mapa/lista;
- catálogo interno del Design System;
- auditoría final de accesibilidad y calidad;
- documentación final de migración.

## Principios

1. Semántica antes que color literal.
2. Accesibilidad incluida en el componente.
3. La interfaz no depende solo del color, icono, sonido, gesto o mapa.
4. Los componentes admiten textos traducidos de distinta longitud.
5. Web y móvil comparten lenguaje y contratos, no necesariamente el mismo código visual.
6. La personalización no rompe contraste, foco ni legibilidad.
7. Los patrones urgentes reducen carga cognitiva.
8. Los estados son explícitos y consistentes.
9. No se recrea manualmente un patrón que ya exista en el Design System.
10. El sistema evoluciona con versiones y migraciones controladas.

## Entregas

### Entrega 1 — Definición y auditoría

**Estado:** `Completed`

- [x] Foundation Pack;
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

**Estado:** `Completed`

- [x] tokens primitivos;
- [x] tokens semánticos;
- [x] tema claro;
- [x] tema oscuro;
- [x] detección inicial del tema del dispositivo;
- [x] persistencia;
- [x] evitar parpadeo inicial;
- [x] movimiento y elevación;
- [x] Button e Input;
- [ ] contraste final auditado en todas las pantallas.

### Entrega 3 — Primitivas web

**Estado:** `Completed`

Commit principal:

```text
a338982 — feat(design-system): completar primitivas accesibles
```

- [x] Button;
- [x] IconButton;
- [x] Input;
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

### Entrega 4 — Patrones y migración

**Estado:** `In Progress`

#### Completado

- [x] autenticación completa;
- [x] confirmaciones y acciones destructivas;
- [x] estados vacíos;
- [x] carga y error;
- [x] formularios con resumen accesible;
- [x] tema público y de acceso;
- [x] validaciones de correo y contraseña.

Commits de referencia:

```text
8bd8dd6 — refactor(auth): migrar login al design system
f88c049 — refactor(auth): mejorar registro y experiencia publica
```

#### Siguiente

- [ ] infraestructura i18n mínima;
- [ ] Perfil;
- [ ] Mascotas;
- [ ] galería;
- [ ] búsqueda;
- [ ] filtros;
- [ ] mapa y lista equivalente;
- [ ] avisos urgentes;
- [ ] navegación responsive final.

### Entrega 5 — Calidad y cierre

**Estado:** `Planned`

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
- [ ] build y tests;
- [ ] actualización final de roadmap y Notion.

## Regla transversal

Cada pantalla migrada debe revisar conjuntamente:

```text
Design System
i18n
accesibilidad
seguridad y privacidad
validación y UX
gestión visible de errores
temas y responsive
documentación
```

## Dependencia de FP-011

FP-011 puede continuar con dominio y datos, pero su interfaz final debe usar:

- tokens semánticos;
- infraestructura de temas;
- componentes base validados;
- patrones de formulario accesibles;
- textos traducibles;
- ubicación pública protegida;
- gestión de errores compatible con FD-005.
