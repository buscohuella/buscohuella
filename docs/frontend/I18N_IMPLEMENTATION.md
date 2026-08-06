---
id: I18N_IMPLEMENTATION
title: Implementación de internacionalización web
version: 0.2.0
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

El núcleo técnico está operativo y Perfil es la primera superficie completa
migrada. La segunda entrega publica el selector ES/CA.

## Resolución del locale

```text
cookie buscohuella-locale
→ Accept-Language
→ es
```

## Selector de idioma

El selector:

- está disponible con y sin sesión;
- aparece en navegación pública, aplicación privada y Auth;
- usa nombre de idioma y código, no banderas;
- funciona con teclado y lector de pantalla;
- guarda la preferencia durante un año;
- conserva la ruta, sesión y tema;
- actualiza el atributo `lang`;
- utiliza un control nativo para máxima compatibilidad.

## Estado de traducción

```text
Infraestructura
→ completada

Perfil
→ español y catalán completos

ThemeToggle
→ español y catalán

Resto de la web
→ migración progresiva
```

Cambiar el idioma no implica todavía que toda la web esté traducida. Las
superficies no migradas continuarán mostrando sus textos actuales hasta su
entrega correspondiente.

## Siguiente entrega

1. Mascotas;
2. navegación y textos comunes;
3. Auth completo;
4. Reportes;
5. mapa y superficies públicas;
6. validación lingüística y accesible.
