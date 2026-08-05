# ADR-009 — Separar ubicación exacta y ubicación pública

- **Estado:** Accepted
- **Fecha:** 2026-08-05

## Contexto

Una posición exacta mejora operaciones, pero puede revelar domicilios, animales
vulnerables o lugares sensibles.

## Decisión

Cada caso mantendrá una ubicación exacta privada y una representación pública
independiente con precisión explícita.

## Consecuencias

- privacidad por defecto;
- más control;
- necesidad de generar y validar la ubicación pública;
- imposibilidad de asumir que un marcador público es exacto.