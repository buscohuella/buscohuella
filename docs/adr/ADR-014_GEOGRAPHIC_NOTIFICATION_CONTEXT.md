# ADR-014 — Alertas geográficas por proximidad y contexto

- **Estado:** Accepted
- **Fecha:** 2026-08-05

## Contexto

Las fronteras administrativas no representan bien la distancia real ni el
movimiento de los animales. Un sistema basado solo en municipio omitiría
personas cercanas y generaría asignaciones rígidas.

## Decisión

Las audiencias geográficas combinarán distancia, malla, territorios, zonas
operativas, preferencias y reglas de privacidad.

## Consecuencias

- alertas transfronterizas relevantes;
- expansión progresiva;
- necesidad de deduplicación y control de fatiga;
- mayor trazabilidad de reglas.