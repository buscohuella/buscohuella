---
id: TERRITORIAL_MODEL
title: Modelo territorial
version: 0.1.0
status: Proposed
owner: Maps & Engineering
last_reviewed: 2026-08-05
---

# Modelo territorial

## 1. Entidad genérica

```text
territory
- id
- country_code
- type
- parent_id
- official_code
- canonical_name
- localized_names
- boundary
- source
- source_version
- valid_from
- valid_until
- confidence
```

## 2. Tipos base

- `COUNTRY`;
- `ADMIN_LEVEL_1`;
- `ADMIN_LEVEL_2`;
- `ADMIN_LEVEL_3`;
- `MUNICIPALITY`;
- `DISTRICT`;
- `SECTOR`;
- `NEIGHBORHOOD`;
- `PROTECTED_AREA`;
- `NATURAL_AREA`;
- `OPERATIONAL_ZONE`;
- `CUSTOM_AREA`.

Las etiquetas visibles dependen del país.

## 3. España

Primera configuración:

- país;
- comunidad o ciudad autónoma;
- provincia;
- isla/comarca/entidad equivalente cuando proceda;
- municipio;
- distrito;
- barrio u otras divisiones locales.

No se asume que toda España usa comarca, distrito o barrio.

## 4. Relaciones

Un punto puede estar:

- dentro de varios territorios jerárquicos;
- cerca de otro territorio;
- sobre un límite;
- cubierto por una zona operativa;
- relacionado con varios municipios candidatos.

## 5. Snapshot

Los reportes guardarán un snapshot mínimo para conservar el contexto del
momento, aunque una fuente cambie posteriormente.

El snapshot no sustituye las relaciones canónicas.