---
id: ADR-007
title: Accesibilidad como requisito de calidad
status: Accepted
date: 2026-08-02
decision_owners:
  - Product
  - Design
  - Engineering
  - QA
related:
  - CROSS_CUTTING_REQUIREMENTS
  - ACCESSIBILITY_STRATEGY
  - FP-006
---

# ADR-007 — Accesibilidad como requisito de calidad

## Estado

**Aceptada**

## Contexto

BuscoHuella se utilizará en situaciones de urgencia, desde dispositivos diversos y por personas con capacidades, edades y niveles de alfabetización digital diferentes.

Aplazar la accesibilidad hasta el final multiplicaría el coste de corregir componentes, navegación, formularios, mapas y flujos críticos.

## Decisión

La experiencia principal de BuscoHuella deberá aspirar como mínimo a:

```text
WCAG 2.2 nivel AA
```

La accesibilidad será parte de la definición de terminado de cada Feature Pack y no una versión separada del producto.

## Ámbito

Aplica a:

- web pública;
- aplicación web;
- futura aplicación móvil;
- correos y notificaciones;
- documentos y formularios;
- mapas y alternativas textuales;
- paneles de organizaciones;
- componentes compartidos.

## Requisitos mínimos por interfaz

- HTML semántico.
- Navegación completa por teclado.
- Orden de foco lógico y foco visible.
- Etiquetas visibles y nombres accesibles.
- Errores vinculados al campo.
- Estados dinámicos anunciados cuando proceda.
- Contraste suficiente.
- Información no dependiente únicamente del color.
- Zoom y reflow sin pérdida funcional.
- Objetivos táctiles adecuados.
- Reducción de movimiento.
- Estados de carga, vacío, éxito y error comprensibles.
- Lenguaje claro.
- Alternativa accesible para mapas y visualizaciones.

## Pruebas

Por Feature Pack:

```text
teclado
foco
zoom 200 %
viewport estrecho
contraste
lector de pantalla básico
errores
carga
vacío
éxito
```

Pruebas periódicas:

- axe o equivalente;
- Lighthouse como señal auxiliar;
- NVDA con navegador de escritorio;
- VoiceOver cuando esté disponible;
- TalkBack para la futura app móvil;
- pruebas con usuarios reales.

## Responsabilidad

La accesibilidad pertenece a producto, diseño, ingeniería y QA.

Un componente compartido no se considerará estable si sus estados o interacciones no son accesibles.

## Consecuencias positivas

- Mayor inclusión y utilidad pública.
- Menor coste de corrección futura.
- Mejor calidad semántica.
- Mejor experiencia móvil y con teclado.
- Menor riesgo legal y reputacional.

## Consecuencias negativas

- Mayor esfuerzo de revisión.
- Necesidad de pruebas manuales.
- Algunas librerías o patrones visuales podrán descartarse.
- Requiere formación y disciplina continuas.

## Excepciones

Toda excepción deberá:

- documentar la barrera;
- justificar por qué no puede resolverse aún;
- indicar impacto;
- asignar una corrección futura;
- no afectar un flujo crítico sin revisión.

## Seguimiento

Se revisará:

- al cerrar cada Feature Pack;
- antes del piloto Sabadell;
- antes del lanzamiento público estable;
- cuando se introduzcan mapas, chat, multimedia o flujos complejos.
