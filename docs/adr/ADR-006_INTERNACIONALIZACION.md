---
id: ADR-006
title: Estrategia de internacionalización
status: Accepted
date: 2026-08-02
decision_owners:
  - Product
  - Engineering
related:
  - CROSS_CUTTING_REQUIREMENTS
  - I18N_AND_THEME_STRATEGY
  - FP-006
---

# ADR-006 — Estrategia de internacionalización

## Estado

**Aceptada**

## Contexto

BuscoHuella nace en Sabadell, tendrá una aplicación web y una futura aplicación móvil, y prevé operar progresivamente en distintos territorios.

Mantener textos de interfaz dispersos dentro de componentes provocaría:

- duplicación;
- traducciones inconsistentes;
- dificultad para localizar errores y correos;
- deuda técnica al añadir nuevos idiomas;
- problemas con pluralización, fechas y textos largos;
- divergencia entre web y móvil.

## Decisión

BuscoHuella adoptará una arquitectura de internacionalización basada en claves estables y catálogos por dominio.

Idiomas previstos:

```text
es — español, idioma por defecto
ca — catalán
eu — euskera
gl — gallego
en — inglés
```

Prioridad de lanzamiento:

```text
MVP técnico
→ infraestructura preparada

Piloto Sabadell
→ español y catalán

Expansión
→ inglés, euskera y gallego según necesidad validada
```

## Principios

- Los códigos internos no se traducen.
- Los textos visibles no se usan como identificadores.
- No se concatenan fragmentos traducibles.
- Se contemplan pluralización y textos más largos.
- Fechas, números y horas se formatean con `Intl`.
- Los mensajes de validación, correos, metadatos y notificaciones forman parte de i18n.
- El contenido generado por usuarios conserva su idioma original.
- Las traducciones automáticas futuras deberán identificarse como tales.
- Web y móvil podrán compartir claves y convenciones, pero no necesariamente la misma librería de renderizado.

## Organización prevista

```text
locales/
├── es/
│   ├── common.json
│   ├── auth.json
│   ├── profile.json
│   ├── pets.json
│   ├── reports.json
│   ├── map.json
│   └── errors.json
├── ca/
├── eu/
├── gl/
└── en/
```

## Selección de idioma

Orden previsto:

```text
preferencia autenticada
→ cookie
→ cabecera del navegador
→ español
```

La estrategia de rutas se decidirá antes de publicar contenido indexable multilingüe.

## Consecuencias positivas

- Menor coste de expansión.
- Consistencia entre superficies.
- Mejor soporte de SEO, correos y notificaciones.
- Separación entre lógica y contenido visible.
- Menor riesgo de reescritura.

## Consecuencias negativas

- Mayor disciplina al crear interfaces.
- Necesidad de QA lingüístico.
- Más archivos y claves.
- Riesgo de claves huérfanas si no se automatiza su validación.

## Alternativas descartadas

### Traducir al final

Descartada por el coste de extraer textos y corregir componentes rígidos.

### Duplicar páginas por idioma

Descartada por mantenimiento y riesgo de divergencia.

### Guardar todas las etiquetas en base de datos

Descartada para textos funcionales; la base de datos se reservará para contenido editorial o administrable cuando corresponda.

## Seguimiento

La decisión se revisará:

- antes de implementar el selector de idioma;
- antes del piloto público;
- al comenzar la aplicación móvil;
- al definir SEO multilingüe.
