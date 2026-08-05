---
id: DATABASE_SCHEMA_REPORTS
title: Esquema de base de datos — Reportes
version: 0.1.0
status: Proposed
owner: Engineering & Security
last_reviewed: 2026-08-05
depends_on:
  - REPORT_DOMAIN
  - REPORT_LIFECYCLE
  - REPORT_PRIVACY
  - DATABASE-SCHEMA-PETS
---

# Esquema de base de datos — Reportes

## 1. Entidades

```text
profiles 1 ─── N reports
pets 1 ─── N reports
pet_species 1 ─── N reports
reports 1 ─── N report_photos
reports 1 ─── N sightings
reports 1 ─── N report_events
sightings 1 ─── N sighting_photos
```

## 2. Tabla `reports`

Columnas propuestas:

| Columna | Tipo | Nulo | Uso |
|---|---|---:|---|
| `id` | uuid | No | Identidad |
| `created_by` | uuid | No | Creador |
| `report_type` | text | No | `LOST_PET` o `FOUND_ANIMAL` |
| `pet_id` | uuid | Sí | Solo `LOST_PET` |
| `species_id` | smallint | No | Especie estable |
| `status` | text | No | Ciclo de vida |
| `title` | text | No | Resumen público |
| `description` | text | No | Descripción |
| `incident_at` | timestamptz | No | Momento de pérdida/hallazgo |
| `exact_location` | geography(Point,4326) | No | Privada |
| `public_location` | geography(Point,4326) | Sí | Proyección pública |
| `public_location_precision` | text | No | Precisión |
| `municipality_name` | text | Sí | Contexto legible |
| `contact_mode` | text | No | Canal |
| `public_phone` | text | Sí | Consentimiento explícito |
| `public_email` | text | Sí | Consentimiento explícito |
| `resolution_type` | text | Sí | Resultado |
| `resolution_notes` | text | Sí | Notas |
| `published_at` | timestamptz | Sí | Publicación |
| `resolved_at` | timestamptz | Sí | Resolución |
| `closed_at` | timestamptz | Sí | Cierre |
| `archived_at` | timestamptz | Sí | Archivo |
| `created_at` | timestamptz | No | Creación |
| `updated_at` | timestamptz | No | Actualización |

## 3. Restricciones principales

- `pet_id` obligatorio únicamente para `LOST_PET`.
- `pet_id` nulo al crear `FOUND_ANIMAL`.
- `incident_at <= now()`.
- publicación requiere `public_location` salvo precisión `HIDDEN`.
- resolución requiere tipo y fecha.
- cierre y resolución son mutuamente coherentes.
- un índice único parcial impide dos pérdidas abiertas para la misma mascota.
- teléfono y correo públicos solo aparecen con su modo correspondiente.

## 4. Tabla `report_photos`

- `id`;
- `report_id`;
- `storage_path`;
- `position`;
- `is_primary`;
- `alt_text`;
- `mime_type`;
- `file_size_bytes`;
- `width`;
- `height`;
- timestamps.

Bucket privado recomendado:

```text
report-photos
```

## 5. Tabla `sightings`

| Columna | Tipo |
|---|---|
| `id` | uuid |
| `report_id` | uuid |
| `created_by` | uuid |
| `observed_at` | timestamptz |
| `exact_location` | geography(Point,4326) |
| `public_location` | geography(Point,4326) |
| `public_location_precision` | text |
| `notes` | text |
| `confidence` | text |
| `review_status` | text |
| `created_at` | timestamptz |
| `updated_at` | timestamptz |

## 6. Tabla `report_events`

Registro inmutable:

- `id`;
- `report_id`;
- `actor_id`;
- `event_type`;
- `from_status`;
- `to_status`;
- `metadata jsonb`;
- `created_at`.

No se expone directamente al público.

## 7. Índices previstos

```text
reports(created_by, status, updated_at desc)
reports(report_type, status, incident_at desc)
reports(species_id, status)
GIST(reports.public_location)
GIST(reports.exact_location)
UNIQUE(pet_id) WHERE report_type='LOST_PET' AND status IN ('DRAFT','ACTIVE','PAUSED')

sightings(report_id, observed_at desc)
GIST(sightings.public_location)
GIST(sightings.exact_location)

report_photos(report_id, position)
UNIQUE(report_id) WHERE is_primary = true
```

## 8. Proyección pública

Las tablas base no se consultarán directamente desde clientes públicos.

Se propone una vista o función:

```text
public_report_feed
```

Incluye solo:

- identificador;
- tipo;
- especie;
- estado publicable;
- título;
- descripción segura;
- ubicación pública;
- municipio;
- fecha;
- fotografía principal;
- datos seguros de mascota;
- canal de contacto permitido.

## 9. Migración prevista

```text
create_reports_domain
```

Incluye:

- extensión PostGIS si falta;
- tablas;
- restricciones;
- índices;
- triggers;
- RLS;
- funciones de transición;
- proyección pública inicial;
- auditoría mínima.
