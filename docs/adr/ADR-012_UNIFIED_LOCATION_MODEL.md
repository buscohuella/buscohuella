# ADR-012 — Adoptar un modelo unificado de ubicación

- **Estado:** Accepted
- **Fecha:** 2026-08-05

## Contexto

Coordenadas, dirección, lugar, territorio, malla y cobertura representan
aspectos distintos de una ubicación. Guardar únicamente latitud, longitud y
municipio limita privacidad, búsqueda, routing y expansión internacional.

## Decisión

BuscoHuella tratará `Location` como un agregado operativo que relaciona:

- punto exacto;
- representación pública;
- precisión;
- dirección;
- lugar;
- territorios;
- celdas;
- cobertura;
- fuente;
- confianza;
- snapshot.

## Consecuencias

- modelo más expresivo;
- mejor privacidad;
- soporte de calles, parques y zonas rurales;
- contratos más claros;
- implementación progresiva para evitar sobrearquitectura.