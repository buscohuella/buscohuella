---
id: ADR-005
title: Librerías de dominio compartidas
status: Accepted
date: 2026-08-02
decision_owners:
  - Product
  - Engineering
supersedes: []
superseded_by: null
related:
  - FP-005
  - ADR-001
  - ADR-002
  - ADR-004
---

# ADR-005 — Librerías de Dominio Compartidas

## Estado

**Aceptada**

## Contexto

BuscoHuella tendrá una aplicación web, una aplicación móvil y servicios que compartirán conceptos de negocio como mascotas, reportes, usuarios, notificaciones y permisos.

Duplicar tipos, límites y validaciones en cada aplicación provocaría:

- Reglas inconsistentes.
- Errores distintos entre plataformas.
- Mayor coste de mantenimiento.
- Acoplamiento entre lógica de negocio y frameworks.
- Dificultad para probar el dominio de forma aislada.

El monorepo ya utiliza pnpm workspaces y admite paquetes bajo `packages/*`.

## Decisión

Los dominios reutilizables se implementarán como paquetes TypeScript propios con el namespace:

```text
@buscohuella/*
```

El primer paquete es:

```text
@buscohuella/pet-domain
```

Cada librería de dominio podrá contener:

- Tipos TypeScript.
- Constantes.
- Límites.
- Esquemas de validación.
- Normalizadores.
- Errores tipados.
- Mapeadores puros.
- Tests unitarios.

Las librerías de dominio no dependerán de:

- React.
- Next.js.
- Expo o React Native.
- Supabase.
- APIs del navegador.
- Componentes visuales.
- Textos traducidos de interfaz.

## Arquitectura

```text
Web ───────────┐
Mobile ────────┼──► @buscohuella/pet-domain
Backend ───────┤
Tests ─────────┘
```

La infraestructura se conecta al dominio mediante capas específicas:

```text
UI
 ↓
Application / Service
 ↓
Repository / Supabase
 ↓
Domain package
```

El paquete de dominio no importa la infraestructura.

## Validación

Se utilizará Zod para validación ejecutable compartida.

Los esquemas con reglas cruzadas seguirán esta estructura:

```text
1. Definir objeto base sin refinamientos
2. Derivar variantes como partial()
3. Aplicar superRefine() al final
```

Esto evita incompatibilidades de Zod al derivar esquemas refinados y mantiene separadas:

- Validación estructural.
- Valores por defecto.
- Reglas de consistencia entre campos.

## Versionado

Durante el desarrollo inicial:

- Los paquetes permanecen privados dentro del monorepo.
- Utilizan versionado semántico.
- Los cambios incompatibles deben documentarse.
- No se publican en un registro externo salvo decisión posterior.

## Consecuencias positivas

- Una única fuente de verdad para web y móvil.
- Tests de dominio independientes de la interfaz.
- Menor duplicación.
- Errores y límites consistentes.
- Mejor evolución del monorepo.
- Posibilidad de reutilizar código en servicios futuros.

## Consecuencias negativas

- Requiere disciplina de dependencias.
- Puede aumentar el número de paquetes.
- Los cambios compartidos pueden afectar varias aplicaciones.
- Obliga a mantener contratos estables y tests.

## Alternativas descartadas

### Duplicar lógica en cada aplicación

Descartada por riesgo de divergencia.

### Colocar todo en `apps/web`

Descartada porque impediría reutilización móvil.

### Crear un único paquete `shared` con todo

Descartada como estrategia principal porque tendería a convertirse en un contenedor sin límites claros.

Se priorizan paquetes por dominio o responsabilidad.

## Reglas de adopción

Un nuevo paquete compartido debe cumplir al menos una de estas condiciones:

- Será utilizado por más de una aplicación.
- Contiene una regla de negocio transversal.
- Necesita tests aislados de los frameworks.
- Define un contrato estable entre capas.

No debe crearse un paquete para utilidades triviales de uso único.

## Seguimiento

La decisión se revisará cuando:

- Exista la aplicación móvil.
- Se incorporen más de cinco paquetes de dominio.
- Sea necesario publicar paquetes externamente.
- Aparezcan problemas de tiempos de compilación o dependencias circulares.
