---
id: FP-007
title: Completar CRUD de mascotas
version: 1.0.0
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

## Objetivo

Completar la gestión básica de fichas antes de introducir fotografías,
catálogo normalizado de razas y reportes.

## Entrega 1 — Edición

- [x] Ruta `/mis-mascotas/[id]/editar`.
- [x] Carga privada de mascota mediante RLS.
- [x] Formulario precargado.
- [x] Catálogo de especies habilitadas.
- [x] Validación mediante `updatePetSchema`.
- [x] Actualización mediante `PetRepository.updatePet()`.
- [x] Control de sesión.
- [x] Tratamiento de permisos, ficha inexistente y microchip duplicado.
- [x] Logging estructurado.
- [x] Confirmación visible.
- [x] Acceso desde el detalle.
- [x] Bloqueo de edición para fichas no activas.
- [x] Estado de carga.
- [ ] Typecheck, lint y build.
- [ ] Prueba manual.
- [ ] Commit.

## Accesibilidad aplicada

- Labels visibles.
- Navegación mediante teclado.
- Foco visible.
- Mensaje general con `role="alert"`.
- Errores próximos al campo.
- Preparación de IDs para ayuda y errores.
- Objetivos táctiles de tamaño suficiente.
- Estado de acción en progreso.

## Seguridad

- El identificador de propietario no procede del formulario.
- La sesión se comprueba en el servidor.
- RLS limita la actualización a la persona propietaria.
- No se registra el microchip ni el contenido completo del formulario.
- Las fichas archivadas no se editan hasta restaurarlas.

## Pendiente del bloque CRUD

1. Separar activas y archivadas.
2. Restaurar una mascota archivada.
3. Eliminación definitiva segura.
4. Historial de cambios.

## Fuera de esta entrega

- Catálogo de razas.
- Selección de dos razas.
- Fotografías.
- Informes de pérdida.
