---
id: REPORT_DOMAIN
title: Dominio de reportes
version: 0.1.0
status: Proposed
owner: Product & Engineering
last_reviewed: 2026-08-05
---

# Dominio de reportes

## 1. Separación conceptual

```text
Pet
→ identidad estable de una mascota conocida

Report
→ incidencia temporal y publicable

Sighting
→ evidencia aportada sobre un Report
```

La pérdida de una mascota no cambia el estado administrativo de `pets`.

## 2. Tipos de reporte

```text
LOST_PET
FOUND_ANIMAL
```

### LOST_PET

Requiere una mascota existente propiedad del creador.

### FOUND_ANIMAL

Describe un animal cuya persona responsable puede ser desconocida. No requiere
crear una fila en `pets`.

## 3. Estados

```text
DRAFT
ACTIVE
PAUSED
RESOLVED
CLOSED
ARCHIVED
```

- `DRAFT`: privado e incompleto.
- `ACTIVE`: visible y en búsqueda.
- `PAUSED`: temporalmente no visible para colaboración pública.
- `RESOLVED`: el objetivo se alcanzó.
- `CLOSED`: finalizado sin resolución positiva o por duplicidad/error.
- `ARCHIVED`: conservación histórica sin operaciones ordinarias.

## 4. Resultados de resolución

```text
REUNITED
OWNER_LOCATED
TRANSFERRED_TO_AUTHORITY
TRANSFERRED_TO_SHELTER
SAFE_WITH_FINDER
OTHER
```

`REUNITED` se usa cuando una mascota perdida vuelve con su familia.
`OWNER_LOCATED` se usa cuando un animal encontrado se vincula con su responsable.

## 5. Entidades

### Report

- identidad;
- creador;
- tipo;
- mascota opcional;
- especie;
- título y descripción;
- fecha del incidente;
- ubicación exacta privada;
- ubicación pública;
- precisión pública;
- estado;
- privacidad;
- contacto;
- resolución;
- fechas de publicación y cierre.

### ReportPhoto

Evidencia visual específica del caso. Puede reutilizar una foto de mascota como
referencia, pero mantiene identidad y orden propios.

### Sighting

- reporte;
- autor;
- fecha observada;
- ubicación exacta privada;
- ubicación pública protegida;
- notas;
- nivel de confianza;
- fotografía opcional;
- estado de revisión.

### ReportEvent

Registro inmutable de cambios relevantes:

- creación;
- publicación;
- pausa;
- reactivación;
- edición sensible;
- avistamiento;
- resolución;
- cierre;
- reapertura administrativa.

## 6. Reglas esenciales

- Una mascota solo puede tener un `LOST_PET` abierto.
- `FOUND_ANIMAL` no puede referenciar una mascota al crearse.
- La especie es obligatoria y estable durante la vida del reporte.
- La fecha del incidente no puede ser futura.
- La ubicación exacta solo es visible para creador y roles autorizados.
- Un reporte público siempre usa una ubicación degradada o desplazada.
- Un avistamiento no puede publicarse sin reporte activo.
- Resolver requiere resultado y fecha.
- Cerrar sin resolución requiere motivo.
- Los reportes no se borran físicamente desde flujos ordinarios.

## 7. Reutilización

El dominio se implementará en un paquete compartido para:

- web;
- aplicación móvil;
- jobs;
- Edge Functions;
- tests.
