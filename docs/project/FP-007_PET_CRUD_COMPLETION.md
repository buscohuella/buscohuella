---
id: FP-007
title: Completar CRUD de mascotas
version: 1.1.0
status: In Progress
owner: Product & Engineering
last_reviewed: 2026-08-02
depends_on:
  - FP-004
  - FP-005
  - ADR-005
  - ADR-007
---

# FP-007 — Completar CRUD de mascotas

## Entrega 1 — Edición

- [x] Ruta `/mis-mascotas/[id]/editar`.
- [x] Formulario precargado.
- [x] Validación y actualización compartidas.
- [x] Confirmación visible.
- [x] Prueba manual correcta.
- [x] Commit publicado.

## Entrega 2 — Activas, archivadas y restauración

- [x] Vista de mascotas activas.
- [x] Vista de mascotas archivadas.
- [x] Contadores por estado.
- [x] URLs recargables mediante `estado`.
- [x] Acción de restauración.
- [x] Restauración mediante `PetRepository.restorePet()`.
- [x] Confirmación propia antes de archivar.
- [x] Confirmación propia antes de restaurar.
- [x] Diálogo basado en `<dialog>`.
- [x] Cierre mediante Escape.
- [x] Bloqueo durante la acción.
- [x] Mensajes de éxito.
- [x] Fichas archivadas consultables pero no editables.
- [x] Logging de fallos de restauración.
- [ ] Typecheck, lint y build.
- [ ] Prueba manual.
- [ ] Commit.

## Principio de confirmaciones

Las confirmaciones se aplican según riesgo:

- **Guardar cambios:** acción normal y reversible; no requiere una
  confirmación repetitiva.
- **Salir con cambios sin guardar:** deberá avisar cuando se implemente
  detección de formulario modificado.
- **Archivar:** requiere confirmación porque cambia la visibilidad de la
  ficha.
- **Restaurar:** requiere confirmación simple porque cambia el estado.
- **Eliminar definitivamente:** exigirá confirmación reforzada.

## Accesibilidad

- Navegación por enlaces reales.
- Estado seleccionado mediante `aria-current`.
- Diálogo con título y descripción asociados.
- Escape cancela mientras no exista una acción en curso.
- Botones con etiquetas textuales.
- Mensajes de resultado con `role="status"` o `role="alert"`.
- Estado no comunicado únicamente mediante color.

## Pendiente para cerrar FP-007

1. Aviso de cambios sin guardar.
2. Eliminación definitiva segura.
3. Historial de cambios.
