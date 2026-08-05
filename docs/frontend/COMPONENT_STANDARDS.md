---
id: COMPONENT_STANDARDS
title: Estándares de componentes
version: 0.1.0
status: Proposed
owner: Frontend, Design & Accessibility
last_reviewed: 2026-08-05
---

# Estándares de componentes

## Contrato mínimo

Todo componente interactivo documenta:

- propósito;
- semántica HTML;
- propiedades;
- variantes;
- tamaños;
- estados;
- teclado;
- foco;
- lector de pantalla;
- tema;
- responsive;
- contenido;
- errores;
- ejemplos correctos e incorrectos.

## Button

- usa `<button>`;
- `type="button"` por defecto;
- loading conserva contexto;
- icon-only exige nombre accesible;
- peligro no se expresa solo por rojo;
- disabled y loading son distintos;
- no cambia de ancho bruscamente al cargar.

## Field

El patrón `Field` relaciona:

- label;
- control;
- descripción;
- error;
- requisito;
- contador cuando proceda.

El placeholder no sustituye la etiqueta.

## Dialog

- nombre accesible;
- descripción cuando ayuda;
- foco inicial razonable;
- foco atrapado;
- Escape;
- devolución de foco;
- cierre exterior solo cuando no cause pérdida crítica;
- confirmación para acciones destructivas.

## Alert y LiveRegion

- errores urgentes: `role="alert"` cuando proceda;
- estados informativos: `aria-live="polite"`;
- no anunciar cada pulsación;
- mensajes persistentes el tiempo necesario.

## Card

Una tarjeta no convierte toda su superficie en botón si contiene acciones
internas. La jerarquía de enlaces debe ser válida y operable.

## Componentes geográficos

- marcador con forma/icono;
- etiqueta accesible;
- alternativa en lista;
- selección sincronizada;
- no depender de hover;
- controles grandes;
- descripción de precisión.