---
id: DESIGN_SYSTEM_ACCESSIBILITY_CHECKLIST
title: Checklist de accesibilidad del Design System
version: 0.1.0
status: Active
owner: Accessibility, UX & Frontend
last_reviewed: 2026-08-05
---

# Checklist de accesibilidad del Design System

## Semántica

- [ ] Elemento HTML correcto.
- [ ] Nombre accesible.
- [ ] Descripción cuando aporta contexto.
- [ ] Estados ARIA sincronizados.
- [ ] No existe ARIA redundante o inválida.

## Teclado

- [ ] Todo es operable.
- [ ] Orden lógico.
- [ ] Foco visible.
- [ ] No hay trampas.
- [ ] Escape cuando procede.
- [ ] El foco vuelve al origen.
- [ ] No depende de arrastrar.

## Visual

- [ ] Contraste AA.
- [ ] Zoom 200 %.
- [ ] Reflow a 320 CSS px.
- [ ] No depende del color.
- [ ] Tema oscuro validado.
- [ ] Texto sobre imagen legible.
- [ ] Estados distinguibles.

## Táctil y motor

- [ ] Objetivo mínimo.
- [ ] Separación.
- [ ] Una mano.
- [ ] No exige precisión extrema.
- [ ] Alternativa a gestos complejos.

## Contenido e i18n

- [ ] Texto largo.
- [ ] Plurales.
- [ ] Variables.
- [ ] Idiomas soportados.
- [ ] Sin concatenación frágil.
- [ ] Mensajes claros.
- [ ] RTL no bloqueado estructuralmente.

## Movimiento

- [ ] Respeta reducción.
- [ ] No destella.
- [ ] No desplaza foco inesperadamente.
- [ ] No hay temporizadores críticos.

## Estados

- [ ] Loading.
- [ ] Error.
- [ ] Vacío.
- [ ] Disabled.
- [ ] Read-only.
- [ ] Success.
- [ ] Offline o reintento cuando proceda.