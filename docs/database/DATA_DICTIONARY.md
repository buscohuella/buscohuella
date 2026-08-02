---
id: DATA-DICTIONARY-PETS
title: Diccionario de datos — Mascotas
version: 1.0.0
status: Proposed
owner: Engineering
last_reviewed: 2026-08-02
depends_on:
  - DATABASE_SCHEMA_PETS
  - PET_TYPES
used_by:
  - SUPABASE_MIGRATIONS
  - API
  - TYPESCRIPT_TYPES
  - VALIDATION
  - TESTING
---

# 📚 Diccionario de Datos — Mascotas

## 1. Convenciones

- Base de datos: `snake_case`.
- Código TypeScript: `camelCase`.
- Estados internos: inglés y mayúsculas.
- Traducciones: fuera de la base de datos.
- Fechas con hora: UTC mediante `timestamptz`.
- Fechas civiles: `date`.
- Identificadores principales: UUID.

---

## 2. `pet_species`

| Campo | Regla |
|---|---|
| `id` | `smallint`, generado, estable |
| `code` | 2–50 caracteres; `^[A-Z][A-Z0-9_]*$` |
| `category` | `COMPANION`, `EQUINE`, `FARM`, `OTHER` |
| `sort_order` | Entero no negativo |
| `is_enabled` | Disponible en catálogo global |
| `mvp_enabled` | Disponible en formularios del MVP |
| `created_at` | UTC |
| `updated_at` | UTC |

### Semántica

`is_enabled = false` desactiva una especie para nuevas altas sin invalidar mascotas existentes.

`mvp_enabled = true` permite mostrar la especie en la primera fase del producto.

---

## 3. `pets`

| Campo | Tipo lógico | Regla |
|---|---|---|
| `id` | UUID | Inmutable |
| `owner_id` | UUID | FK a `profiles.id` |
| `species_id` | Small integer | FK a `pet_species.id` |
| `name` | Texto | 1–80; trim |
| `breed` | Texto opcional | Máximo 120 |
| `is_mixed_breed` | Booleano | `false` por defecto |
| `sex` | Código | `FEMALE`, `MALE`, `UNKNOWN` |
| `birth_date` | Fecha opcional | No futura |
| `birth_date_precision` | Código | `EXACT`, `APPROXIMATE`, `UNKNOWN` |
| `size` | Código | `TINY`, `SMALL`, `MEDIUM`, `LARGE`, `GIANT`, `UNKNOWN` |
| `weight_kg` | Decimal opcional | > 0; máximo técnico razonable |
| `primary_color` | Texto opcional | Máximo 80 |
| `secondary_colors` | Lista de texto | Vacía por defecto |
| `description` | Texto opcional | Máximo 1.000 |
| `distinctive_features` | Texto opcional | Máximo 1.000 |
| `has_microchip` | Booleano | `false` por defecto |
| `microchip_number` | Texto sensible | Normalizado; único si existe |
| `identification_notes` | Texto sensible | Máximo 1.000 |
| `private_notes` | Texto privado | Máximo 2.000 |
| `status` | Código | `ACTIVE`, `ARCHIVED`, `DECEASED` |
| `visibility` | Código | `PRIVATE`, `PUBLIC_WHEN_REPORTED`, `PUBLIC` |
| `archived_at` | Fecha/hora opcional | Solo si `ARCHIVED` |
| `deceased_at` | Fecha opcional | Solo si `DECEASED` |
| `created_at` | Fecha/hora | UTC |
| `updated_at` | Fecha/hora | UTC |

---

## 4. Normalización del microchip

Entrada:

```text
" 941-000 027 123 456 "
```

Valor normalizado:

```text
941000027123456
```

Reglas:

- Eliminar espacios y separadores.
- Convertir a mayúsculas.
- Rechazar caracteres no permitidos.
- No incluir el valor en logs.
- No devolverlo en DTO públicos.
- Mostrarlo enmascarado cuando proceda.

La validación específica por país o estándar podrá ampliarse posteriormente.

---

## 5. `pet_photos`

| Campo | Tipo lógico | Regla |
|---|---|---|
| `id` | UUID | Inmutable |
| `pet_id` | UUID | FK a `pets.id` |
| `storage_path` | Texto | Único; máximo 500 |
| `position` | Entero | >= 0 |
| `is_primary` | Booleano | Una por mascota |
| `visibility` | Código | `PRIVATE`, `PUBLIC_PROFILE`, `PUBLIC_REPORT` |
| `alt_text` | Texto opcional | Máximo 300 |
| `mime_type` | Texto opcional | MIME permitido |
| `file_size_bytes` | Entero opcional | > 0 |
| `width` | Entero opcional | > 0 |
| `height` | Entero opcional | > 0 |
| `created_at` | Fecha/hora | UTC |
| `updated_at` | Fecha/hora | UTC |

---

## 6. Valores por defecto

### `pets`

```text
is_mixed_breed = false
sex = UNKNOWN
birth_date_precision = UNKNOWN
size = UNKNOWN
secondary_colors = []
has_microchip = false
status = ACTIVE
visibility = PUBLIC_WHEN_REPORTED
```

### `pet_photos`

```text
position = 0
is_primary = false
visibility = PRIVATE
```

---

## 7. Campos públicos y privados

### Potencialmente públicos

```text
name
species
breed
sex
size
primary_color
secondary_colors
description
distinctive_features
selected_photo
```

### Privados

```text
owner_id
microchip_number
identification_notes
private_notes
exact_birth_date
internal_timestamps
storage_path
```

La clasificación pública no concede acceso directo. Debe pasar por una proyección segura.

---

## 8. Mapeo TypeScript

```ts
type PetStatus = 'ACTIVE' | 'ARCHIVED' | 'DECEASED';

type PetVisibility =
  | 'PRIVATE'
  | 'PUBLIC_WHEN_REPORTED'
  | 'PUBLIC';

type PetSex = 'FEMALE' | 'MALE' | 'UNKNOWN';

type BirthDatePrecision =
  | 'EXACT'
  | 'APPROXIMATE'
  | 'UNKNOWN';

type PetSize =
  | 'TINY'
  | 'SMALL'
  | 'MEDIUM'
  | 'LARGE'
  | 'GIANT'
  | 'UNKNOWN';
```

La especie se representa mediante un código de catálogo, no mediante una unión cerrada generada manualmente.

---

## 9. Reglas de nulabilidad

- `breed` puede ser nulo cuando se desconoce.
- `birth_date` puede ser nula.
- `birth_date_precision = UNKNOWN` exige `birth_date = null`.
- `has_microchip = false` exige `microchip_number = null`.
- `status = ARCHIVED` exige `archived_at` no nulo.
- `status = DECEASED` exige `deceased_at` no nulo.

---

## 10. Códigos de error sugeridos

```text
PET_NAME_INVALID
PET_SPECIES_DISABLED
PET_BIRTH_DATE_FUTURE
PET_WEIGHT_INVALID
PET_MICROCHIP_INVALID
PET_MICROCHIP_DUPLICATE
PET_STATUS_TRANSITION_INVALID
PET_OWNER_MISMATCH
PET_PHOTO_LIMIT_REACHED
PET_PRIMARY_PHOTO_CONFLICT
PET_NOT_FOUND
```

---

## 11. Criterios de aceptación

- Cada columna tiene semántica clara.
- Los valores controlados están definidos.
- Los campos sensibles están identificados.
- Los valores por defecto están documentados.
- El mapeo a TypeScript es directo.
- Las reglas pueden convertirse en validaciones y tests.
