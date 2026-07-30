# ADR-004 — Decisión de Frontend Web PWA

## BuscoHuella MVP

**Estado:** Aceptado  
**Fecha:** 30 de julio de 2026  
**Decisor:** Xavier Quesada (Fundador / Full-Stack Developer)  
**Consultores:** Herramientas de IA (Kimi, Codex, Gemini, ChatGPT)  

---

# 1. Contexto

## 1.1 Problema

BuscoHuella necesita desarrollar un cliente web progresivo (**PWA**) que permita a usuarios encontrar, reportar y gestionar información relacionada con animales perdidos, encontrados y servicios asociados.

El frontend debe cumplir los siguientes objetivos:

- Ser instalable como aplicación móvil mediante PWA.
- Tener una experiencia optimizada para dispositivos móviles.
- Permitir integración con mapas y geolocalización.
- Mantener una arquitectura escalable para futuras aplicaciones móviles nativas.
- Facilitar el desarrollo y mantenimiento por un equipo reducido.
- Permitir una futura evolución hacia una plataforma multiusuario.

La decisión principal es:

> ¿Qué tecnología frontend permite desarrollar el MVP con mayor velocidad, menor complejidad y mejor capacidad de evolución futura?

---

# 2. Contexto del Proyecto

## 2.1 Situación actual

BuscoHuella se encuentra en fase MVP.

Las restricciones actuales son:

| Factor | Situación |
|---|---|
| Equipo | 1 desarrollador principal |
| Presupuesto inicial | 0 € |
| Prioridad | Validar producto antes de escalar |
| Backend | Supabase + PostgreSQL |
| Cliente objetivo inicial | Usuarios móviles |
| Plataforma inicial | Web PWA |
| Futuro previsto | Aplicación móvil nativa |

---

## 2.2 Arquitectura actual relacionada

La aplicación seguirá una arquitectura desacoplada:

                ┌──────────────────┐
                │   Frontend Web   │
                │       PWA        │
                └────────┬─────────┘
                         │
                         │ SDK / API
                         │
                ┌────────▼──────────┐
                │    Supabase       │
                │ Auth + Database   │
                │ Storage + Realtime│
                └───────────────────┘
                         │
                         │
                ┌────────▼──────────┐
                │  PostgreSQL       │
                └───────────────────┘


El frontend no estará acoplado a un backend específico.

La capa cliente consumirá:

- Autenticación.
- Base de datos.
- Storage de imágenes.
- Realtime.
- Edge Functions futuras.

---

# 3. Requisitos Técnicos del Frontend

## 3.1 Requisitos funcionales

El frontend debe soportar:

| Funcionalidad | Prioridad |
|---|---|
| Registro e inicio de sesión | Alta |
| Gestión de usuarios | Alta |
| Reportar animal perdido | Alta |
| Reportar animal encontrado | Alta |
| Subida de fotografías | Alta |
| Mapa interactivo | Alta |
| Geolocalización GPS | Alta |
| Sistema de filtros | Media |
| Notificaciones futuras | Media |
| Chat futuro | Baja |

---

## 3.2 Requisitos técnicos

| Requisito | Motivo |
|---|---|
| Arquitectura mantenible | Proyecto a largo plazo |
| Código modular | Facilitar crecimiento |
| Buen rendimiento móvil | Usuario principal desde smartphone |
| PWA completa | Evitar dependencia inicial de tiendas móviles |
| SEO razonable | Posicionamiento de reportes públicos |
| Comunidad amplia | Facilidad para encontrar ayuda |
| Integración con React Native futura | Estrategia mobile |

---

# 4. Restricciones de la decisión

## 4.1 Restricciones actuales

| Restricción | Impacto |
|---|---|
| Un único desarrollador | La velocidad importa más que la arquitectura perfecta |
| Presupuesto limitado | Se priorizan tecnologías gratuitas |
| MVP temprano | No se busca una solución enterprise inicial |
| Tiempo limitado | Evitar complejidad innecesaria |
| Futura app móvil | La elección debe permitir evolución |

---

# 5. Pregunta de decisión

La decisión a resolver es:

> ¿Debemos construir la PWA inicial utilizando Angular o Next.js como framework principal?

Las opciones consideradas son:

1. Mantener Angular.
2. Migrar a Next.js.
3. Crear una solución híbrida.

La decisión debe priorizar:

1. Velocidad de lanzamiento.
2. Calidad de experiencia móvil.
3. Facilidad de mantenimiento.
4. Capacidad de evolución futura.
5. Reducción del riesgo técnico.