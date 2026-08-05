---
id: DESIGN_SYSTEM_AUDIT_2026_08
title: Auditoría inicial del Design System
version: 1.0.0
status: Completed
owner: Frontend, Design & Accessibility
last_reviewed: 2026-08-05
---

# Auditoría inicial del Design System

## Fortalezas existentes

- tokens semánticos iniciales;
- foco global visible;
- reducción de movimiento;
- colores de estado;
- radios y sombras;
- botones reutilizables;
- tamaños táctiles de 40, 48 y 56 px;
- inputs de 48 px;
- `aria-invalid` en inputs;
- TypeScript estricto y componentes con `forwardRef`.

## Riesgos

### Temas

- solo existe tema claro;
- no hay preferencia `system`;
- no hay persistencia;
- no se ha validado contraste oscuro.

### Tokens

- escala incompleta;
- falta tipografía;
- falta espaciado formal;
- falta z-index;
- falta movimiento;
- falta densidad;
- existen valores literales como `text-white`;
- algunos estados usan opacidad en vez de token.

### Componentes

- falta estado loading formal en Button;
- foco local y foco global pueden solaparse;
- Input expone `hasError`, pero no relaciona por sí solo descripción y mensaje;
- no existe primitiva `Field`;
- no hay contrato formal de IconButton;
- faltan Dialog, Alert y LiveRegion estandarizados;
- no existe catálogo visible de componentes.

### Multiplataforma

- tokens solo expresados como CSS;
- no hay fuente exportable para móvil;
- no existe estrategia de versiones.

## Prioridad inmediata

1. formalizar tokens;
2. implementar temas;
3. crear `Field`, `Alert` y `LiveRegion`;
4. reforzar Button/Input;
5. validar componentes consumidos por FP-011;
6. crear entorno de demostración.