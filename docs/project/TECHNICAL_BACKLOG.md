---
id: TECHNICAL_BACKLOG
title: Backlog técnico transversal
version: 1.0.0
status: Active
owner: Product & Engineering
last_reviewed: 2026-08-06
---

# Backlog técnico transversal

## Propósito

Registrar ideas válidas sin abandonar el objetivo activo.

Este documento no autoriza automáticamente la implementación. El orden lo
determinan el roadmap, las dependencias y los riesgos reales.

## Ahora

### FD-003 — cierre progresivo

Orden vigente:

1. infraestructura i18n mínima;
2. Perfil;
3. Mascotas;
4. patrones restantes;
5. catálogo interno;
6. auditoría de accesibilidad;
7. documentación final y cierre.

## Próximo

### FD-005 — primera entrega

Antes de finalizar los flujos críticos de FP-011:

- contrato común de error;
- logger estructurado;
- sanitización de datos;
- request/correlation ID;
- error boundary cliente;
- captura segura en servidor;
- códigos de incidencia visibles;
- política de `console`;
- documentación de privacidad y retención.

### FP-011

- formulario de mascota perdida;
- ubicación exacta y pública;
- textos traducibles;
- accesibilidad;
- seguridad;
- errores compatibles con FD-005.

## Medio plazo

- migración de todas las pantallas al Design System;
- español y catalán completos;
- pruebas end-to-end críticas;
- métricas operativas;
- panel inicial de incidencias;
- roles y organizaciones;
- eventos y notificaciones;
- optimización geográfica.

## Futuro

- intranets profesionales;
- moderación;
- feature flags;
- kill switches;
- PWA y offline limitado;
- push avanzado;
- analítica responsable;
- rendimiento y pruebas de carga;
- aplicación móvil;
- IA asistida;
- variantes de imágenes.

## Reglas de clasificación

### Incorporar ahora

Solo cuando:

- bloquea el trabajo activo;
- corrige seguridad, privacidad o pérdida de datos;
- evita una deuda inmediata difícil de revertir.

### Programar como próximo

Cuando:

- debe existir antes del siguiente flujo crítico;
- reduce riesgo de producción;
- habilita varias funciones próximas.

### Registrar como futuro

Cuando:

- aporta valor, pero no bloquea el MVP;
- requiere volumen real;
- depende del piloto;
- aumenta demasiado el alcance actual.

## Regla transversal por pantalla

Toda pantalla nueva o migrada revisará:

- i18n;
- accesibilidad;
- seguridad y privacidad;
- Design System;
- validaciones;
- gestión visible de errores;
- temas;
- responsive;
- rendimiento;
- documentación.
