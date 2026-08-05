# ADR-017 — Activar Design System antes de finalizar FP-011

- **Estado:** Accepted
- **Fecha:** 2026-08-05

## Contexto

FP-011 introduce formularios urgentes, ubicación, privacidad y publicación.
Construirlo antes de tokens, temas y patrones accesibles generaría deuda en los
flujos posteriores.

## Decisión

FD-003 se activa antes de finalizar la interfaz de FP-011. No bloquea dominio
ni datos, pero sí establece los componentes y patrones utilizados por la UI.

## Consecuencias

- breve inversión inicial;
- mayor coherencia;
- menos refactor posterior;
- FP-011 servirá como primer consumidor real del sistema.