---
id: FP-006
title: Fundación de internacionalización y accesibilidad
version: 1.0.0
status: Planned
owner: Product, Design & Engineering
last_reviewed: 2026-08-02
depends_on:
  - ADR-006
  - ADR-007
applies_to:
  - WEB
  - MOBILE
  - EMAIL
  - NOTIFICATIONS
  - DOCUMENTATION
---

# FP-006 — Fundación de internacionalización y accesibilidad

## Objetivo

Introducir la infraestructura transversal necesaria para que BuscoHuella pueda ofrecer una experiencia multilingüe y accesible sin reescribir las pantallas ya construidas.

## Alcance inicial

### Internacionalización

- [ ] Seleccionar librería i18n para Next.js 16.
- [ ] Definir estrategia de rutas.
- [ ] Crear namespaces.
- [ ] Crear español como catálogo canónico.
- [ ] Añadir catalán para el piloto.
- [ ] Implementar selector de idioma.
- [ ] Persistir preferencia.
- [ ] Migrar autenticación, perfiles y mascotas.
- [ ] Localizar fechas, números, metadatos y errores.
- [ ] Añadir comprobación de claves faltantes.

### Accesibilidad

- [ ] Añadir enlace para saltar al contenido.
- [ ] Revisar landmarks y jerarquía de encabezados.
- [ ] Revisar `Button`, `Input`, `Card` y formularios.
- [ ] Asociar errores mediante `aria-describedby`.
- [ ] Gestionar foco tras errores y acciones.
- [ ] Respetar `prefers-reduced-motion`.
- [ ] Validar zoom y reflow.
- [ ] Añadir prueba automatizada de accesibilidad básica.
- [ ] Ejecutar revisión manual con NVDA.
- [ ] Documentar barreras pendientes.

## Idiomas

### Piloto

```text
es
ca
```

### Preparados para expansión

```text
eu
gl
en
```

## Criterios de terminado

- No quedan textos críticos del módulo migrado fuera del catálogo.
- Español y catalán cubren el mismo conjunto de claves.
- Las rutas y acciones mantienen idioma.
- Los errores de formularios son comprensibles y anunciables.
- Todo flujo migrado funciona con teclado.
- Zoom al 200 % no elimina funcionalidad.
- Lint, typecheck y build son correctos.
- La documentación y Notion están actualizados.

## Orden de ejecución

```text
1. Cerrar edición/restauración básica de mascotas
2. Introducir infraestructura i18n
3. Migrar módulo Pet
4. Auditoría accesible del módulo Pet
5. Aplicar el patrón al resto de módulos
```

## Documentos relacionados

- `docs/project/CROSS_CUTTING_REQUIREMENTS.md`
- `docs/ux/ACCESSIBILITY_STRATEGY.md`
- `docs/frontend/I18N_AND_THEME_STRATEGY.md`
- `docs/adr/ADR-006_INTERNACIONALIZACION.md`
- `docs/adr/ADR-007_ACCESIBILIDAD_COMO_REQUISITO.md`
