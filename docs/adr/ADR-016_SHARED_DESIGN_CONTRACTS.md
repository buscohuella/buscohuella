# ADR-016 — Compartir contratos, no renderizado web y móvil

- **Estado:** Accepted
- **Fecha:** 2026-08-05

## Contexto

Web y React Native tienen primitivas, interacción y capacidades diferentes.
Forzar el mismo componente visual puede aumentar complejidad y reducir calidad.

## Decisión

Web y móvil compartirán:

- nombres;
- tokens;
- variantes;
- estados;
- reglas;
- contenido;
- accesibilidad esperada;
- documentación.

Cada plataforma podrá mantener su implementación de renderizado.

## Consecuencias

- coherencia sin acoplamiento artificial;
- cierto trabajo duplicado de implementación;
- necesidad de pruebas por plataforma;
- posibilidad de compartir lógica y tipos cuando aporte valor.