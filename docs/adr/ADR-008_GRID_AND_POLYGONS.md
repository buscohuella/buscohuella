# ADR-008 — Combinar malla geoespacial y polígonos

- **Estado:** Accepted
- **Fecha:** 2026-08-05

## Contexto

Los polígonos describen territorios humanos y administrativos. Una malla
facilita proximidad, vecindad y agregación. Ningún enfoque resuelve ambos
problemas por sí solo.

## Decisión

BuscoHuella combinará:

- polígonos para territorios, límites y coberturas;
- celdas para proximidad, alertas, agregación y escalabilidad.

## Consecuencias

- mayor riqueza territorial;
- consultas escalables;
- soporte de zonas limítrofes;
- necesidad de sincronizar ambas capas;
- la malla permanecerá normalmente invisible.