---
id: REPORT_LIFECYCLE
title: Ciclo de vida de reportes
version: 0.1.0
status: Proposed
owner: Product & Engineering
last_reviewed: 2026-08-05
---

# Ciclo de vida de reportes

## Transiciones permitidas

```text
DRAFT → ACTIVE
DRAFT → CLOSED

ACTIVE → PAUSED
ACTIVE → RESOLVED
ACTIVE → CLOSED

PAUSED → ACTIVE
PAUSED → RESOLVED
PAUSED → CLOSED

RESOLVED → ARCHIVED
CLOSED → ARCHIVED
```

Las reaperturas desde `RESOLVED`, `CLOSED` o `ARCHIVED` no forman parte del
flujo ordinario. Requieren una operación administrativa auditada.

## Publicación

Para pasar a `ACTIVE` se exige:

- tipo válido;
- especie;
- fecha del incidente;
- descripción mínima;
- ubicación válida;
- ubicación pública calculada;
- al menos una fotografía cuando el tipo sea `FOUND_ANIMAL`;
- mascota activa cuando sea `LOST_PET`;
- medio de contacto configurado.

## Pausa

La pausa:

- oculta el caso de búsquedas públicas ordinarias;
- conserva avistamientos e historial;
- no equivale a resolución;
- puede revertirse.

## Resolución

Requiere:

- `resolution_type`;
- `resolved_at`;
- nota opcional;
- actor autorizado.

## Cierre

Se utiliza para:

- publicación errónea;
- duplicado;
- retirada voluntaria;
- imposibilidad de continuar;
- incumplimiento;
- otro motivo documentado.

## Archivo

Es una operación de conservación. No elimina evidencias ni métricas.
