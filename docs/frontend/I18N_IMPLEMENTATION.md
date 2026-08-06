---
id: I18N_IMPLEMENTATION
title: Implementación de internacionalización web
version: 0.1.0
status: In Progress
owner: Frontend, Product & Accessibility
last_reviewed: 2026-08-06
depends_on:
  - ADR-006
  - FP-006
  - FD-002
---

# Implementación de internacionalización web

## Estado

**Estado:** `In Progress`

La primera entrega instala el núcleo técnico sin publicar todavía un selector
de idioma incompleto.

## Decisiones

- español es el locale por defecto;
- catalán es el segundo locale operativo;
- español mantiene rutas sin prefijo;
- no se cambian rutas en esta entrega;
- no se añade una dependencia externa;
- los catálogos se organizan por namespace;
- servidor y cliente comparten diccionarios y convenciones;
- `Intl` formatea fechas, números y tiempos relativos;
- el atributo `lang` se resuelve por petición.

## Resolución del locale

```text
cookie buscohuella-locale
→ Accept-Language
→ es
```

La cookie se activará cuando exista un selector visible sobre una superficie
suficientemente migrada.

## Comportamiento ante claves ausentes

Durante el desarrollo, una clave ausente devuelve la propia clave.

## Primera migración de prueba

`ThemeToggle` consume:

```text
common.theme.activateLight
common.theme.activateDark
```

## Siguiente entrega

1. tests del traductor y resolución de locale;
2. selector de idioma;
3. migración completa de Perfil;
4. extracción progresiva de Auth;
5. validación de textos largos y catalán;
6. automatización de claves huérfanas o ausentes.
