---
id: FP-010-DATABASE-VALIDATION
title: Validación de la migración de reportes
version: 0.1.0
status: Draft
owner: Engineering & Security
last_reviewed: 2026-08-05
---

# Validación de la migración de reportes

## Antes de aplicar

```powershell
npx supabase db push --dry-run
```

Debe aparecer:

```text
20260805113000_create_reports_domain.sql
```

## Después de aplicar

### Tablas

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'reports',
    'report_photos',
    'sightings',
    'sighting_photos',
    'report_events'
  )
order by table_name;
```

### PostGIS

```sql
select extname
from pg_extension
where extname = 'postgis';
```

### RLS

```sql
select
  tablename,
  rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'reports',
    'report_photos',
    'sightings',
    'sighting_photos',
    'report_events'
  );
```

### Políticas

```sql
select
  tablename,
  policyname,
  cmd
from pg_policies
where schemaname = 'public'
  and tablename in (
    'reports',
    'report_photos',
    'sightings',
    'sighting_photos',
    'report_events'
  )
order by tablename, policyname;
```

### Índice de pérdida abierta

```sql
select indexname
from pg_indexes
where schemaname = 'public'
  and indexname = 'reports_one_open_lost_pet_idx';
```

### Función pública segura

```sql
select *
from public.get_public_reports();
```

Sin reportes activos debe devolver cero filas, no un error.

## Casos que deben rechazarse

- `LOST_PET` sin `pet_id`;
- mascota de otra persona;
- especie distinta de la mascota;
- `FOUND_ANIMAL` con `pet_id`;
- fecha del incidente futura;
- publicación sin ubicación;
- teléfono público sin valor;
- correo público sin valor;
- transición inválida;
- dos reportes abiertos para la misma mascota;
- avistamiento sobre reporte no activo;
- fecha de avistamiento futura.

## Casos que deben permitirse

- borrador incompleto;
- publicar una pérdida propia válida;
- pausar y reactivar;
- resolver;
- cerrar con motivo;
- archivar un reporte finalizado;
- crear avistamiento sobre reporte activo;
- consultar la proyección pública sin exponer ubicación exacta.
