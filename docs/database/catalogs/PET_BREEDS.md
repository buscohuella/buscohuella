---
id: PET-BREEDS-CATALOG
title: Catálogo de razas de mascotas
version: 1.0.0
status: Proposed
owner: Product & Data
last_reviewed: 2026-08-03
depends_on:
  - PET_TYPES
  - FP-008
---

# Catálogo de razas de mascotas

## Propósito

Representar y buscar razas sin usar un enum cerrado ni obligar al usuario a conocerlas.

## Reglas

- Cada raza pertenece a una especie.
- `code` es estable y no traducible.
- `canonical_name` es la etiqueta inicial.
- `aliases` contiene variantes de búsqueda.
- Una raza deshabilitada sigue siendo referenciable.
- Los cruces no crean una raza combinada nueva.
- `UNKNOWN` y `MIXED_UNKNOWN` son estados de la ficha, no razas.

## Ejemplo

```text
code: GERMAN_SHEPHERD
canonical_name: Pastor alemán
aliases:
  - pastor aleman
  - ovejero alemán
  - german shepherd
```

## Búsqueda MVP

Puede filtrar en cliente por:

- nombre;
- alias;
- texto sin acentos;
- prefijos;
- palabras parciales.

## Internacionalización futura

Podrá añadirse:

```text
pet_breed_translations
- breed_id
- locale
- name
- aliases
```

No bloquea el piloto inicial.
