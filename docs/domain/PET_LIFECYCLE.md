---
id: PET-LIFECYCLE
title: Ciclo de vida de mascotas
version: 1.0.0
status: Proposed
owner: Product & Engineering
last_reviewed: 2026-08-02
depends_on:
  - PET_DOMAIN
  - PET_BUSINESS_RULES
used_by:
  - DATABASE_SCHEMA
  - API
  - WEB
  - MOBILE
  - TESTING
---

# 🐾 Ciclo de Vida de Mascotas

## 1. Propósito

Este documento define los estados válidos de una mascota, sus transiciones y las reglas que deben cumplirse durante todo su ciclo de vida.

El ciclo de vida de `Pet` describe el estado administrativo de su identidad.

No representa situaciones temporales como pérdida, hallazgo, avistamiento o reencuentro. Esas situaciones pertenecen al dominio `Report`.

---

## 2. Estados válidos

```text
DRAFT
ACTIVE
ARCHIVED
DECEASED
```

| Estado | Significado | Visible en panel principal | Permite nuevos reportes |
|---|---|---:|---:|
| `DRAFT` | Ficha incompleta o guardada parcialmente | Sí | No |
| `ACTIVE` | Identidad operativa | Sí | Sí |
| `ARCHIVED` | Identidad retirada de uso ordinario | No | No |
| `DECEASED` | Mascota fallecida | Opcional | No |

---

## 3. Estado inicial

### Sin guardado parcial

```text
CREATE → ACTIVE
```

La mascota se crea únicamente cuando cumple los requisitos mínimos.

### Con guardado parcial

```text
CREATE → DRAFT → ACTIVE
```

`DRAFT` solo debe implementarse si el producto permite guardar formularios incompletos.

Para el MVP, se recomienda evitar `DRAFT` salvo que exista una necesidad clara de experiencia de usuario.

---

## 4. Diagrama de transiciones

```text
                ┌──────────────┐
                │              ▼
CREATE ──────► ACTIVE ──────► ARCHIVED
                  │              │
                  │              └──────► ACTIVE
                  │
                  └──────────► DECEASED
```

Si se implementa `DRAFT`:

```text
CREATE ─► DRAFT ─► ACTIVE ─► ARCHIVED
             │         │           │
             └─────────┘           └──► ACTIVE
                       │
                       └──────────► DECEASED
```

---

## 5. Transiciones permitidas

| Desde | Hacia | Permitida | Motivo |
|---|---|---:|---|
| `DRAFT` | `ACTIVE` | Sí | La ficha cumple requisitos mínimos |
| `DRAFT` | `ARCHIVED` | Sí | Borrador descartado conservando trazabilidad |
| `ACTIVE` | `ARCHIVED` | Sí | Retirada de uso ordinario |
| `ARCHIVED` | `ACTIVE` | Sí | Restauración |
| `ACTIVE` | `DECEASED` | Sí | Registro del fallecimiento |
| `ARCHIVED` | `DECEASED` | Sí | Registro posterior del fallecimiento |
| `DECEASED` | `ACTIVE` | No | Invariante de dominio |
| `DECEASED` | `ARCHIVED` | No | Estado terminal |
| `ARCHIVED` | `DRAFT` | No | Una identidad consolidada no vuelve a borrador |
| `ACTIVE` | `DRAFT` | No | Una identidad consolidada no vuelve a borrador |

---

## 6. Estado terminal

`DECEASED` es un estado terminal.

Una mascota en este estado:

- Conserva su identidad.
- Conserva fotografías e historial.
- Conserva reportes anteriores.
- No puede iniciar nuevos reportes.
- No puede restaurarse a `ACTIVE`.
- No debe eliminarse automáticamente.

Cualquier corrección administrativa excepcional debe requerir intervención autorizada y auditoría.

---

## 7. Estado archivado

`ARCHIVED` representa una identidad válida fuera del uso cotidiano.

Una mascota archivada:

- No aparece en el listado principal.
- No puede iniciar nuevos reportes.
- No se muestra públicamente por defecto.
- Mantiene sus relaciones históricas.
- Puede restaurarse.
- Sigue perteneciendo a su responsable.

Archivar no equivale a eliminar.

---

## 8. Estado activo

`ACTIVE` representa una identidad operativa.

Una mascota activa:

- Puede editarse.
- Puede gestionar fotografías.
- Puede iniciar reportes compatibles.
- Puede aparecer en el panel del responsable.
- Puede disponer de visibilidad pública limitada según sus reglas de privacidad.

---

## 9. Estado borrador

`DRAFT` representa una ficha incompleta.

Una mascota en borrador:

- Solo es visible para su responsable.
- No dispone de vista pública.
- No puede vincularse a reportes.
- Puede editarse.
- Puede activarse al cumplir los requisitos mínimos.
- Puede descartarse o archivarse.

Si el producto no permite guardado parcial, este estado no debe implementarse.

---

## 10. Invariantes

### LC-PET-001 — Identidad estable

El cambio de estado no crea una nueva mascota.

### LC-PET-002 — Estado controlado

El estado solo puede contener valores definidos por este documento.

### LC-PET-003 — Reportes separados

Los estados `LOST`, `FOUND`, `SIGHTED` y `REUNITED` no pertenecen a `Pet`.

### LC-PET-004 — Estado terminal

`DECEASED` no puede volver a `ACTIVE`.

### LC-PET-005 — Historial preservado

Cambiar de estado no elimina automáticamente fotografías, reportes ni eventos.

### LC-PET-006 — Responsable obligatorio

Una mascota activa o archivada debe conservar un responsable principal válido.

### LC-PET-007 — Reportes activos

Una mascota no puede archivarse ni marcarse como fallecida sin resolver o tratar explícitamente sus reportes activos.

### LC-PET-008 — Auditoría

Toda transición debe registrar actor, fecha, estado anterior y estado nuevo.

---

## 11. Reglas de transición

### Activar mascota

```text
Actor:
Owner

Permission:
pet.activate

Preconditions:
- pet.status == DRAFT
- required_fields_complete == true

Result:
pet.status = ACTIVE
```

### Archivar mascota

```text
Actor:
Owner

Permission:
pet.archive

Preconditions:
- pet.status == ACTIVE
- active_reports_count == 0

Result:
pet.status = ARCHIVED
pet.archived_at = now()
```

### Restaurar mascota

```text
Actor:
Owner

Permission:
pet.restore

Preconditions:
- pet.status == ARCHIVED

Result:
pet.status = ACTIVE
pet.archived_at = null
```

### Marcar como fallecida

```text
Actor:
Owner

Permission:
pet.mark_deceased

Preconditions:
- pet.status in [ACTIVE, ARCHIVED]
- active_reports_count == 0

Result:
pet.status = DECEASED
pet.deceased_at = provided_date_or_now()
```

---

## 12. Reglas de autorización

| Acción | Responsable | Usuario ajeno | Moderador | Sistema |
|---|---:|---:|---:|---:|
| Activar | Sí | No | Solo soporte autorizado | No |
| Archivar | Sí | No | Solo soporte autorizado | No |
| Restaurar | Sí | No | Solo soporte autorizado | No |
| Marcar fallecida | Sí | No | Solo soporte autorizado | No |
| Corregir transición inválida | No | No | Sí, auditado | No |

Las operaciones administrativas no deben ejecutarse desde el cliente con credenciales privilegiadas.

---

## 13. Relación con reportes

El estado visible al usuario puede combinar:

```text
pet.status
active_report.type
active_report.status
```

Ejemplo:

```text
pet.status = ACTIVE
report.type = LOST
report.status = ACTIVE

UI state = "Perdida"
```

Al resolver el reporte:

```text
pet.status = ACTIVE
report.status = RESOLVED
report.outcome = REUNITED

UI state = "En casa"
```

La resolución del reporte no modifica el estado administrativo de la mascota.

---

## 14. Restricciones técnicas esperadas

La implementación deberá incluir:

- Tipo controlado para `status`.
- Valor por defecto `ACTIVE`, salvo uso de borradores.
- `archived_at` solo cuando `status = ARCHIVED`.
- `deceased_at` solo cuando `status = DECEASED`.
- Validación de transiciones en servidor.
- Protección mediante RLS.
- Auditoría de cambios sensibles.
- Índices por `owner_id`, `status` y fechas relevantes.

---

## 15. Modelo recomendado para MVP

Para reducir complejidad inicial:

```text
ACTIVE
ARCHIVED
DECEASED
```

Se recomienda omitir `DRAFT` en FP-004 salvo que el formulario necesite guardado parcial.

Modelo mínimo:

```text
CREATE → ACTIVE → ARCHIVED
                 └──────► ACTIVE

ACTIVE → DECEASED
ARCHIVED → DECEASED
```

---

## 16. Casos límite

### Mascota archivada con reporte activo

No permitido.

El reporte debe resolverse o transferirse a un flujo administrativo antes de archivar.

### Mascota fallecida con reporte activo

No permitido sin resolución explícita del reporte.

### Mascota creada por error

Puede eliminarse físicamente solo si no tiene relaciones ni historial relevante.

En caso contrario, debe archivarse.

### Corrección de fallecimiento erróneo

Requiere intervención administrativa auditada.

No forma parte del flujo ordinario del propietario.

---

## 17. Casos de prueba mínimos

### TC-PET-LC-001

Crear una mascota válida produce estado `ACTIVE`.

### TC-PET-LC-002

Archivar una mascota activa sin reportes produce `ARCHIVED`.

### TC-PET-LC-003

No se puede archivar una mascota con reporte activo.

### TC-PET-LC-004

Restaurar una mascota archivada produce `ACTIVE`.

### TC-PET-LC-005

Marcar una mascota activa como fallecida produce `DECEASED`.

### TC-PET-LC-006

No se puede restaurar una mascota fallecida.

### TC-PET-LC-007

Cambiar de estado no elimina fotografías ni historial.

### TC-PET-LC-008

Un usuario ajeno no puede cambiar el estado.

---

## 18. Criterios de aceptación

El ciclo de vida se considera listo para implementación cuando:

- Los estados están claramente definidos.
- Las transiciones válidas e inválidas están documentadas.
- Los estados de reportes están separados.
- Las operaciones sensibles tienen precondiciones.
- Las transiciones pueden convertirse en validaciones y tests.
- La opción recomendada para el MVP está identificada.
- Los casos límite principales están cubiertos.

---

## 19. Documentos relacionados

- `PET_DOMAIN.md`
- `PET_BUSINESS_RULES.md`
- `PET_PRIVACY.md`
- `PET_GLOSSARY.md`
- `REPORT_DOMAIN.md`
- `DATABASE_SCHEMA.md`
- `DATA_DICTIONARY.md`
- `TEST_CASES.md`
