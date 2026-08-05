# ADR-015 — Tokens semánticos como contrato visual

- **Estado:** Accepted
- **Fecha:** 2026-08-05

## Contexto

Los colores y medidas literales dentro de componentes dificultan temas,
accesibilidad, consistencia y reutilización móvil.

## Decisión

BuscoHuella utilizará tokens en tres niveles:

- primitivos;
- semánticos;
- específicos de componente solo cuando sean necesarios.

Los componentes consumirán principalmente tokens semánticos.

## Consecuencias

- temas intercambiables;
- auditoría más sencilla;
- menor libertad local arbitraria;
- necesidad de gobernanza y migración de estilos existentes.