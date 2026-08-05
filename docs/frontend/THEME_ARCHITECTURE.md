---
id: THEME_ARCHITECTURE
title: Arquitectura de temas
version: 0.1.0
status: Proposed
owner: Frontend, Design & Accessibility
last_reviewed: 2026-08-05
---

# Arquitectura de temas

## Modos

- `light`;
- `dark`;
- `system`.

## Requisitos

- persistencia de preferencia;
- detección del sistema;
- render inicial sin parpadeo;
- actualización reactiva;
- metadatos del navegador;
- contraste AA;
- fotografías y mapas legibles;
- formularios coherentes;
- impresión en modo apropiado.

## Implementación web

La preferencia se expresará mediante un atributo estable en el elemento raíz:

```html
<html data-theme="dark">
```

Los componentes consumirán tokens semánticos, nunca ramas del tipo:

```tsx
isDark ? '#fff' : '#000'
```

## Estado `system`

`system` conserva la intención del usuario y resuelve el tema efectivo mediante
`prefers-color-scheme`.

## Mapas

El estilo del mapa y sus controles debe cambiar con el tema efectivo sin
alterar la semántica de marcadores.

## Accesibilidad

El modo oscuro no reduce contraste ni usa fondos negros puros por defecto.
El foco permanece visible en todas las superficies.
## Selector rápido

La barra superior utiliza un cambio directo entre tema claro y oscuro.

- en tema claro muestra la acción `Activar tema oscuro`;
- en tema oscuro muestra la acción `Activar tema claro`;
- el control mantiene tamaño fijo;
- la preferencia persiste;
- las opciones avanzadas futuras vivirán en una pantalla de apariencia y accesibilidad.