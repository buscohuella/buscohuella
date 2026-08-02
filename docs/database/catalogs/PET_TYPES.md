---
id: PET-TYPES-CATALOG
title: Catálogo de especies y tipos de animales
version: 1.0.0
status: Proposed
owner: Product & Data
last_reviewed: 2026-08-02
depends_on:
  - PET_DOMAIN
used_by:
  - DATABASE_SCHEMA_PETS
  - FORMS
  - FILTERS
  - REPORTS
  - ANALYTICS
---

# 🐾 Catálogo de Especies y Tipos de Animales

## 1. Principio

BuscoHuella no se limita a perros y gatos.

El producto debe poder registrar y gestionar progresivamente:

- Animales de compañía.
- Aves.
- Pequeños mamíferos.
- Reptiles.
- Équidos.
- Animales de granja.
- Otros animales domésticos o bajo custodia humana.

La disponibilidad funcional se desplegará por fases.

---

## 2. Modelo de catálogo

Cada especie dispone de:

```text
id
code
category
sort_order
is_enabled
mvp_enabled
```

Las etiquetas visibles se resuelven mediante i18n.

Ejemplo:

```text
code: DOG
es: Perro
ca: Gos
en: Dog
```

No se almacenan traducciones en PostgreSQL.

---

## 3. Categorías

### `COMPANION`

Animales mantenidos principalmente como compañía.

### `EQUINE`

Caballos, ponis, burros y otros équidos.

### `FARM`

Animales domésticos vinculados a explotaciones, granjas o entornos rurales.

### `OTHER`

Casos no cubiertos o pendientes de clasificación.

Las categorías son funcionales, no taxonómicas.

---

## 4. Fase MVP

Especies recomendadas para el primer lanzamiento:

| Código | Categoría | MVP |
|---|---|---:|
| `DOG` | `COMPANION` | Sí |
| `CAT` | `COMPANION` | Sí |
| `BIRD` | `COMPANION` | Sí |
| `RABBIT` | `COMPANION` | Sí |
| `RODENT` | `COMPANION` | Sí |
| `REPTILE` | `COMPANION` | Sí |
| `OTHER_COMPANION` | `COMPANION` | Sí |

Esto permite atender casos reales sin inflar formularios especializados.

---

## 5. Fase posterior cercana

| Código | Categoría |
|---|---|
| `FERRET` | `COMPANION` |
| `TURTLE` | `COMPANION` |
| `FISH` | `COMPANION` |
| `AMPHIBIAN` | `COMPANION` |
| `HORSE` | `EQUINE` |
| `PONY` | `EQUINE` |
| `DONKEY` | `EQUINE` |
| `GOAT` | `FARM` |
| `SHEEP` | `FARM` |
| `PIG` | `FARM` |
| `CATTLE` | `FARM` |
| `CHICKEN` | `FARM` |
| `DUCK` | `FARM` |
| `GOOSE` | `FARM` |
| `OTHER_FARM` | `FARM` |

La activación dependerá de validación de demanda, normativa y diseño de formularios.

---

## 6. Estrategia de fases

### Fase 1 — MVP local

Prioridad:

- Perros.
- Gatos.
- Animales de compañía comunes.
- Opción genérica controlada.

### Fase 2 — Cobertura ampliada

Prioridad:

- Hurones.
- Tortugas.
- Peces.
- Équidos.
- Animales domésticos rurales comunes.

### Fase 3 — Dominio especializado

Posibles capacidades:

- Datos de explotación.
- Identificación ganadera.
- Custodia de organizaciones.
- Transferencias.
- Registros oficiales.
- Alertas por rebaño o grupo.

Estas capacidades no deben condicionar el MVP.

---

## 7. Reglas

### CAT-PET-001 — Código estable

El código interno no cambia por traducciones ni decisiones de interfaz.

### CAT-PET-002 — Activación reversible

Una especie puede desactivarse para nuevas altas sin borrar registros existentes.

### CAT-PET-003 — Sin enum cerrado

Añadir una especie no requiere alterar la tabla `pets`.

### CAT-PET-004 — “Otro” controlado

Las opciones genéricas deben distinguir contexto:

```text
OTHER_COMPANION
OTHER_FARM
OTHER
```

### CAT-PET-005 — Raza separada

La especie no debe mezclarse con la raza.

Ejemplo:

```text
species = DOG
breed = BORDER_COLLIE
```

### CAT-PET-006 — Tipo funcional

Cuando una clasificación exacta no sea necesaria, se prioriza una categoría útil para búsqueda y reportes.

---

## 8. Razas

El catálogo de razas debe depender de la especie.

Para el MVP puede utilizarse:

- Texto libre normalizado.
- Sugerencias de interfaz.
- Opción mestizo.
- Opción desconocida.

Un catálogo completo de razas puede añadirse después sin cambiar `pets`.

---

## 9. Animales de granja

Los animales de granja plantean necesidades adicionales:

- Identificación oficial.
- Titularidad y custodia.
- Explotación.
- Movimientos.
- Grupos o rebaños.
- Normativa específica.
- Riesgos de seguridad y fraude.

Por ello:

- El modelo base admite la especie.
- Las funciones especializadas se activan por fases.
- No se añaden columnas ganaderas a todas las mascotas.
- Los datos específicos se modelarán en entidades adicionales cuando se validen.

---

## 10. Criterios de aceptación

- El sistema no queda limitado a perros y gatos.
- El MVP mantiene un formulario sencillo.
- Añadir especies no exige migrar `pets`.
- Animales de granja quedan contemplados sin sobrediseñar.
- Los códigos son traducibles y estables.
- La activación puede gestionarse por fase.
