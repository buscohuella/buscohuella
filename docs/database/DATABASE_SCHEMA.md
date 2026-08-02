---
id: DATABASE-SCHEMA-PETS
title: Esquema de base de datos — Mascotas
version: 1.0.0
status: Proposed
owner: Engineering
last_reviewed: 2026-08-02
depends_on:
  - PET_DOMAIN
  - PET_BUSINESS_RULES
  - PET_LIFECYCLE
  - PET_PRIVACY
  - PET_TYPES
used_by:
  - SUPABASE_MIGRATIONS
  - API
  - WEB
  - MOBILE
  - TESTING
---

# 🗄️ Esquema de Base de Datos — Mascotas

## 1. Objetivo

Definir el modelo relacional inicial del dominio `Pet` para FP-004.

El diseño debe:

- Mantener separadas la identidad de la mascota y las incidencias.
- Aplicar privacidad por defecto.
- Permitir múltiples especies sin migraciones estructurales.
- Soportar fotografías privadas.
- Ser compatible con Supabase PostgreSQL y RLS.
- Escalar hacia reportes, organizaciones y cuidadores autorizados.

---

## 2. Decisiones principales

### DB-PET-001 — Catálogo de especies

Las especies no se almacenarán mediante un enum PostgreSQL cerrado.

Se utilizará la tabla:

```text
pet_species
```

Motivo:

- Permite añadir nuevas especies sin alterar la tabla `pets`.
- Permite activar especies por fases.
- Permite agrupar animales de compañía, équidos, granja y otros.
- Mantiene códigos internos estables e independientes de traducciones.

### DB-PET-002 — Identidad permanente

La tabla `pets` representa la identidad estable de la mascota.

No almacena estados temporales de pérdida o hallazgo.

### DB-PET-003 — Fotografías separadas

Las fotografías se almacenan en `pet_photos`.

Los binarios permanecen en Supabase Storage.

### DB-PET-004 — RLS obligatoria

Las tablas privadas se crean con RLS habilitada.

### DB-PET-005 — Eliminación lógica

El uso ordinario se resuelve mediante `status` y fechas de archivo o fallecimiento.

---

## 3. Entidades iniciales

```text
profiles 1 ─── N pets
pet_species 1 ─── N pets
pets 1 ─── N pet_photos
```

### Fuera de esta migración

```text
pets 1 ─── N reports
pets N ─── N authorized_caregivers
pets 1 ─── N audit_events
```

Estas relaciones se añadirán en hitos posteriores.

---

## 4. Tabla `pet_species`

Catálogo extensible de especies admitidas por el producto.

| Columna | Tipo | Nulo | Descripción |
|---|---|---:|---|
| `id` | `smallint` | No | Identificador interno |
| `code` | `text` | No | Código estable |
| `category` | `text` | No | Grupo funcional |
| `sort_order` | `smallint` | No | Orden de interfaz |
| `is_enabled` | `boolean` | No | Disponible para crear mascotas |
| `mvp_enabled` | `boolean` | No | Disponible en el MVP |
| `created_at` | `timestamptz` | No | Fecha de creación |
| `updated_at` | `timestamptz` | No | Fecha de modificación |

### Restricciones

- `code` único.
- Código en mayúsculas y snake case.
- `sort_order >= 0`.
- `category` controlada.
- Las traducciones no se almacenan en esta tabla.

### Categorías iniciales

```text
COMPANION
EQUINE
FARM
OTHER
```

---

## 5. Tabla `pets`

| Columna | Tipo | Nulo | Descripción |
|---|---|---:|---|
| `id` | `uuid` | No | Identidad de la mascota |
| `owner_id` | `uuid` | No | Responsable principal |
| `species_id` | `smallint` | No | Especie |
| `name` | `text` | No | Nombre o alias |
| `breed` | `text` | Sí | Raza o tipo |
| `is_mixed_breed` | `boolean` | No | Mestiza |
| `sex` | `text` | No | Sexo conocido |
| `birth_date` | `date` | Sí | Fecha de nacimiento |
| `birth_date_precision` | `text` | No | Precisión de fecha |
| `size` | `text` | No | Tamaño general |
| `weight_kg` | `numeric(6,2)` | Sí | Peso aproximado |
| `primary_color` | `text` | Sí | Color principal |
| `secondary_colors` | `text[]` | No | Colores adicionales |
| `description` | `text` | Sí | Descripción general |
| `distinctive_features` | `text` | Sí | Rasgos distintivos |
| `has_microchip` | `boolean` | No | Indica microchip |
| `microchip_number` | `text` | Sí | Valor normalizado y privado |
| `identification_notes` | `text` | Sí | Notas identificativas |
| `private_notes` | `text` | Sí | Notas del responsable |
| `status` | `text` | No | Estado administrativo |
| `visibility` | `text` | No | Política de visibilidad |
| `archived_at` | `timestamptz` | Sí | Fecha de archivo |
| `deceased_at` | `date` | Sí | Fecha de fallecimiento |
| `created_at` | `timestamptz` | No | Fecha de creación |
| `updated_at` | `timestamptz` | No | Fecha de actualización |

### Estados

```text
ACTIVE
ARCHIVED
DECEASED
```

### Visibilidad

```text
PRIVATE
PUBLIC_WHEN_REPORTED
PUBLIC
```

### Sexo

```text
FEMALE
MALE
UNKNOWN
```

### Precisión de nacimiento

```text
EXACT
APPROXIMATE
UNKNOWN
```

### Tamaño

```text
TINY
SMALL
MEDIUM
LARGE
GIANT
UNKNOWN
```

El tamaño es transversal y puede interpretarse según especie. No sustituye atributos especializados futuros.

---

## 6. Tabla `pet_photos`

| Columna | Tipo | Nulo | Descripción |
|---|---|---:|---|
| `id` | `uuid` | No | Identificador |
| `pet_id` | `uuid` | No | Mascota relacionada |
| `storage_path` | `text` | No | Ruta privada de Storage |
| `position` | `smallint` | No | Orden |
| `is_primary` | `boolean` | No | Fotografía principal |
| `visibility` | `text` | No | Contexto de exposición |
| `alt_text` | `text` | Sí | Texto alternativo |
| `mime_type` | `text` | Sí | Tipo validado |
| `file_size_bytes` | `integer` | Sí | Tamaño |
| `width` | `integer` | Sí | Anchura |
| `height` | `integer` | Sí | Altura |
| `created_at` | `timestamptz` | No | Fecha de creación |
| `updated_at` | `timestamptz` | No | Fecha de actualización |

### Visibilidad de fotografía

```text
PRIVATE
PUBLIC_PROFILE
PUBLIC_REPORT
```

### Restricciones

- Ruta única.
- Posición no negativa.
- Máximo una fotografía principal por mascota.
- Tamaño y dimensiones positivos.
- Tipos MIME permitidos definidos por aplicación y Storage.

---

## 7. Restricciones relevantes

### Mascota

- Nombre entre 1 y 80 caracteres.
- Raza hasta 120 caracteres.
- Descripción hasta 1.000 caracteres.
- Rasgos distintivos hasta 1.000 caracteres.
- Notas privadas hasta 2.000 caracteres.
- Peso mayor que cero.
- Fecha de nacimiento no futura.
- `archived_at` solo con estado `ARCHIVED`.
- `deceased_at` solo con estado `DECEASED`.
- Microchip presente únicamente cuando `has_microchip = true`.
- Microchip normalizado y único cuando no sea nulo.

### Fotografías

- Una sola principal por mascota mediante índice único parcial.
- `storage_path` único.
- `position >= 0`.
- Dimensiones y tamaño positivos.

---

## 8. Índices

### `pet_species`

```text
UNIQUE(code)
(category, is_enabled, sort_order)
```

### `pets`

```text
(owner_id, status, updated_at DESC)
(species_id, status)
UNIQUE(microchip_number) WHERE microchip_number IS NOT NULL
```

### `pet_photos`

```text
(pet_id, position)
UNIQUE(pet_id) WHERE is_primary = true
UNIQUE(storage_path)
```

---

## 9. RLS esperada

### `pet_species`

Lectura permitida a `anon` y `authenticated` para filas activas.

Escritura reservada a procesos administrativos.

### `pets`

El responsable puede:

- Insertar filas con `owner_id = auth.uid()`.
- Leer sus filas.
- Modificar sus filas sin cambiar `owner_id`.
- Eliminar físicamente solo mediante lógica controlada del servidor.

No existe lectura anónima directa.

### `pet_photos`

El responsable puede operar únicamente sobre fotografías de mascotas propias.

La política debe verificar la relación:

```text
pet_photos.pet_id → pets.owner_id = auth.uid()
```

---

## 10. Proyección pública futura

La tabla `pets` no se concede directamente a usuarios anónimos.

Cuando se implemente exposición pública se utilizará una proyección segura:

```text
public_pet_profiles
```

o una función controlada asociada al reporte.

No forma parte de la primera migración.

---

## 11. Storage

Bucket recomendado:

```text
pet-photos
```

Configuración inicial:

- Privado.
- Acceso mediante políticas.
- URLs firmadas.
- Ruta conceptual:

```text
{owner_id}/{pet_id}/{photo_id}.{extension}
```

La creación del bucket y sus políticas se documentará y aplicará en un bloque separado.

---

## 12. Compatibilidad futura por especie

El modelo común de `pets` contiene únicamente atributos transversales.

Atributos especializados futuros no deben añadirse como columnas nulas masivas.

Ejemplos:

```text
pet_dog_attributes
pet_equine_attributes
pet_livestock_attributes
```

Solo se crearán si una necesidad validada lo exige.

Ejemplos de atributos especializados:

- Número de explotación.
- Identificador oficial ganadero.
- Capa equina.
- Aptitud productiva.
- Rebaño.
- Registro genealógico.

Estos datos quedan fuera del MVP.

---

## 13. Migraciones previstas

### Migración 1

```text
create_pet_species_and_pets_base
```

Incluye:

- `pet_species`
- datos semilla
- `pets`
- `pet_photos`
- restricciones
- índices
- RLS básica
- triggers `updated_at`

### Migración 2

```text
configure_pet_photos_storage
```

Incluye:

- bucket
- políticas de Storage

### Migraciones posteriores

- Reportes.
- Proyección pública.
- Cuidadores.
- Organizaciones.
- Atributos especializados.

---

## 14. Criterios de aceptación

- El catálogo permite añadir especies sin alterar `pets`.
- Las tablas privadas tienen RLS.
- El microchip no puede exponerse por lectura pública.
- Solo existe una foto principal.
- Los estados cumplen el ciclo de vida.
- La eliminación lógica está soportada.
- Las relaciones futuras no quedan bloqueadas.
- No se implementan detalles de granja sin necesidad validada.
