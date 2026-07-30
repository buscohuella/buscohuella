# BUSCOHUELLA — DOCUMENTO MAESTRO v3.1
## Plataforma Digital Colaborativa para la Recuperación de Mascotas Perdidas

> **Versión:** 3.1 (Revisión Editorial y Estructural)  
> **Fecha:** Julio 2026  
> **Autor:** Xavier Quesada Sevillano — CEO & Founder  
> **Estado del proyecto:** En desarrollo activo (Pre-MVP)  
> **Web:** [https://buscohuella.es](https://buscohuella.es)  
> **Lista de espera (waitlist):** 170+ personas registradas  
> **Próxima revisión:** Octubre 2026

---

## 📖 CÓMO USAR ESTE DOCUMENTO

Este archivo es la **fuente única de verdad** (*single source of truth*) del proyecto BuscoHuella. Ante cualquier conflicto entre código, roadmaps secundarios o conversaciones informales, prevalece este documento.

**Para quién es:**
- **Fundador / Product Owner:** Toma de decisiones estratégicas.
- **Colaboradores técnicos:** Contexto de arquitectura y alcance.
- **Asistentes de IA:** Contexto completo para generar código, revisar cambios y automatizar tareas.
- **Inversores / Partners:** Resumen ejecutivo y modelo de negocio.

**Regla de oro:** *Documentación antes que implementación. Medir antes que optimizar. Simplicidad antes que complejidad.*

---

## 📋 TABLA DE CONTENIDOS

0. [Definiciones](#0-definiciones)

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)

2. [Visión y Propósito](#2-vision-y-proposito)
   2.1 [North Star Metric](#21-north-star-metric)  
   2.2 [Propósito Principal](#22-proposito-principal)  
   2.3 [Visión a Largo Plazo](#23-vision-a-largo-plazo)  
   &nbsp;&nbsp;&nbsp;&nbsp;2.3.1 [Visión 2030](#231-vision-2030)  
   2.4 [Objetivos 2026](#24-objetivos-2026)  
   2.5 [No Objetivos 2026](#25-no-objetivos-2026)  
   2.6 [Objetivos 2027](#26-objetivos-2027)  
   2.7 [Misión](#27-mision)  
   2.8 [Frase Guía](#28-frase-guia)  
   2.9 [Principios del Producto](#29-principios-del-producto)  
   2.10 [Declaración de Enfoque](#210-declaracion-de-enfoque)  
   2.11 [Estrategia de Producto](#211-estrategia-de-producto)

3. [Planteamiento del Problema](#3-planteamiento-del-problema)
   3.1 [El Problema Real](#31-el-problema-real)  
   3.2 [El Dolor del Usuario](#32-el-dolor-del-usuario)  
   3.3 [¿Por Qué Ahora?](#33-por-que-ahora)

4. [Público Objetivo](#4-publico-objetivo)
   4.1 [Usuario Principal (B2C)](#41-usuario-principal-b2c)  
   4.2 [Usuario Secundario (B2B Social)](#42-usuario-secundario-b2b-social)  
   4.3 [Usuario Futuro (B2G)](#43-usuario-futuro-b2g)  
   &nbsp;&nbsp;&nbsp;&nbsp;4.3.1 [Ley 7/2023: Obligaciones Municipales](#431-ley-72023-obligaciones-municipales)  
   4.4 [Ciclo de Adopción Institucional](#44-ciclo-de-adopcion-institucional)  
   4.5 [Validación Inicial](#45-validacion-inicial)  
   4.6 [Impacto Esperado](#46-impacto-esperado)  
   4.7 [Estrategia de Adopción Inicial](#47-estrategia-de-adopcion-inicial)  
   4.8 [Estrategia Go-To-Market (MVP)](#48-estrategia-go-to-market-mvp)  
   4.9 [Plan de Adquisición Inicial](#49-plan-de-adquisicion-inicial)  
   4.10 [User Personas](#410-user-personas)

5. [Propuesta de Valor](#5-propuesta-de-valor)
   5.1 [Elevator Pitch](#51-elevator-pitch)  
   5.2 [Propuesta de Valor por Segmento](#52-propuesta-de-valor-por-segmento)  
   5.3 [Diferenciación vs. Competencia](#53-diferenciacion-vs-competencia)  
   5.4 [Ventaja Competitiva Sostenible](#54-ventaja-competitiva-sostenible)  
   5.5 [Foso Estratégico (Moat)](#55-foso-estrategico-moat)  
   5.6 [Rueda de Crecimiento (Flywheel)](#56-rueda-de-crecimiento-flywheel)  
   5.7 [Efecto Red](#57-efecto-red)  
   5.8 [Requisitos de Latencia](#58-requisitos-de-latencia)  
   5.9 [Requisitos de Calidad](#59-requisitos-de-calidad)  
   &nbsp;&nbsp;&nbsp;&nbsp;5.9.1 [Disponibilidad](#591-disponibilidad)  
   &nbsp;&nbsp;&nbsp;&nbsp;5.9.2 [Escalabilidad](#592-escalabilidad)  
   &nbsp;&nbsp;&nbsp;&nbsp;5.9.3 [Rendimiento](#593-rendimiento)  
   &nbsp;&nbsp;&nbsp;&nbsp;5.9.4 [Seguridad](#594-seguridad)  
   5.10 [Sistema de Diseño](#510-sistema-de-diseno)

6. [MVP — Alcance y Funcionalidades](#6-mvp-alcance-y-funcionalidades)
   6.1 [Funcionalidades Incluidas (Fase 1)](#61-funcionalidades-incluidas-fase-1)  
   6.2 [Funcionalidades Excluidas (Fase 2+)](#62-funcionalidades-excluidas-fase-2)  
   6.3 [Flujo de Usuario Principal](#63-flujo-de-usuario-principal)  
   6.4 [Alcance Geográfico](#64-alcance-geografico)  
   6.5 [Casos de Uso Principales](#65-casos-de-uso-principales)  
   6.6 [Recorridos Críticos del Usuario (CUJ)](#66-recorridos-criticos-del-usuario-cuj)  
   6.7 [MVP Congelado](#67-mvp-congelado)  
   6.8 [Definición de Terminado (DoD)](#68-definicion-de-terminado-dod)  
   6.9 [Éxito del MVP](#69-exito-del-mvp)

7. [Modelo de Datos](#7-modelo-de-datos)
   7.1 [Esquema Entidad-Relación](#71-esquema-entidad-relacion)  
   7.2 [Decisiones de Diseño](#72-decisiones-de-diseno)  
   7.3 [Seguridad en Base de Datos](#73-seguridad-en-base-de-datos)  
   7.4 [Modelo de Dominio](#74-modelo-de-dominio)  
   7.5 [Eventos de Dominio](#75-eventos-de-dominio)  
   7.6 [Política de Conservación de Datos](#76-politica-de-conservacion-de-datos)  
   7.7 [Estados del Reporte](#77-estados-del-reporte)

8. [Modelo de Negocio](#8-modelo-de-negocio)
   8.1 [Principios del Modelo](#81-principios-del-modelo)  
   8.2 [Fase 1 — MVP (0-6 meses)](#82-fase-1-mvp)  
   &nbsp;&nbsp;&nbsp;&nbsp;8.2.1 [Objetivos del MVP](#821-objetivos-mvp)  
   &nbsp;&nbsp;&nbsp;&nbsp;8.2.2 [Objetivo de Sostenibilidad](#822-sostenibilidad)  
   &nbsp;&nbsp;&nbsp;&nbsp;8.2.3 [Unit Economics](#823-unit-economics)  
   8.3 [Fase 2 — Crecimiento](#83-fase-2)  
   8.4 [Fase 3 — Escalado](#84-fase-3)  
   8.5 [Política de Monetización](#85-politica-de-monetizacion)  
   8.6 [Reinversión Social](#86-reinversion)  
   8.7 [Supuestos Estratégicos](#87-supuestos)  
   8.8 [Hipótesis a Validar](#88-hipotesis)  
   8.9 [Análisis DAFO](#89-dafo)  
   8.10 [Indicadores de Viabilidad](#810-indicadores-economicos)

9. [Roadmap Estratégico](#9-roadmap-estrategico)
   9.1 [Principios del Roadmap](#91-principios-del-roadmap)  
   9.2 [Fases del Roadmap](#92-fases-del-roadmap)  
   9.3 [Fase 1 — MVP](#93-fase-1-mvp)  
   9.4 [Fase 2 — Beta Local](#94-fase-2-beta-local)  
   9.5 [Fase 3 — Expansión Regional](#95-fase-3-expansion-regional)  
   9.6 [Fase 4 — Escala Nacional](#96-fase-4-escala)  
   9.7 [Gestión del Roadmap](#97-gestion-del-roadmap)  
   9.8 [Criterios de Priorización](#98-criterios-de-priorizacion)  
   9.9 [Funcionalidades Futuras](#99-funcionalidades-futuras)

10. [Arquitectura General](#10-arquitectura-general)
   10.1 [Principios de Arquitectura](#101-principios-de-arquitectura)  
   10.2 [Estilo Arquitectónico](#102-estilo-arquitectonico)  
   10.3 [Componentes Principales](#103-componentes-principales)  
   10.4 [Arquitectura Lógica](#104-arquitectura-logica)  
   10.5 [Dominios Funcionales](#105-dominios-funcionales)  
   10.6 [Escalabilidad](#106-escalabilidad)  
   10.7 [Dependencias Externas](#107-dependencias-externas)  
   10.8 [Decisiones Arquitectónicas](#108-decisiones-arquitectonicas)  
   10.9 [Evolución Arquitectónica](#109-evolucion-arquitectonica)

11. [Arquitectura Software](#11-arquitectura-software)
   11.0 [Objetivos de la Arquitectura](#110-objetivos-de-la-arquitectura)  
   11.1 [Stack Tecnológico](#111-stack-tecnologico)  
   11.2 [Arquitectura del Frontend](#112-arquitectura-del-frontend)  
   11.3 [Arquitectura Backend](#113-arquitectura-backend)  
   11.4 [Estructura del Proyecto](#114-estructura-del-proyecto)  
   11.5 [Acceso a Datos](#115-acceso-a-datos)  
   11.6 [Base de Datos](#116-base-de-datos)  
   11.7 [Almacenamiento de Archivos](#117-almacenamiento)  
   11.8 [Autenticación y Autorización](#118-autenticacion)  
   11.9 [Comunicación en Tiempo Real](#119-tiempo-real)  
   11.10 [Sistema de Notificaciones](#1110-notificaciones)  
   11.11 [Seguridad de la Plataforma](#1111-seguridad)  
   11.12 [Principios de Desarrollo](#1112-principios-de-desarrollo)  
   11.13 [Evolución Tecnológica](#1113-evolucion-tecnologica)  
   11.14 [Gestión del Estado](#1114-gestion-del-estado)  
   11.15 [Capa de Servicios](#1115-capa-de-servicios)  
   11.16 [Componentes Reutilizables](#1116-componentes-ui)  
   11.17 [Integración con Supabase Edge Functions](#1117-integracion-con-supabase-edge-functions)  
   11.18 [Navegación](#1118-navegacion)  
   11.19 [Gestión de Errores](#1119-gestion-errores)  
   11.20 [Logging y Monitorización](#1120-monitorizacion)  
   11.21 [Estándares de Desarrollo](#1121-estandares-de-desarrollo)  
   11.22 [Arquitectura por Capas](#1122-arquitectura-por-capas)  
   11.23 [Estrategia de Testing](#1123-estrategia-de-testing)  
   11.24 [Gestión de Entornos](#1124-gestion-de-entornos)  
   11.25 [Deploy y CI/CD](#1125-deploy-y-ci-cd)
12. [Operaciones y Gobernanza](#12-operaciones-y-gobernanza)
    12.1 [Equipo Actual](#121-equipo-actual)  
    12.2 [Escalado de Equipo](#122-escalado-de-equipo)  
    12.3 [Recursos Económicos](#123-recursos-economicos)  
    12.4 [SLA del MVP](#124-sla-del-mvp)  
    12.5 [Desarrollo Asistido por IA](#125-desarrollo-asistido-por-ia)  
    12.6 [Impacto Social](#126-impacto-social)  
    12.7 [Gobernanza del Producto](#127-gobernanza-del-producto)  
    12.8 [Regla de Supervivencia del Proyecto](#128-regla-de-supervivencia-del-proyecto)  
    12.9 [Matriz de Decisión](#129-matriz-de-decision)  
    12.10 [Consideraciones Legales](#1210-consideraciones-legales)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.1 [Cumplimiento Normativo](#12101-cumplimiento-normativo)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.2 [RGPD](#12102-rgpd)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.3 [LOPDGDD](#12103-lopdgdd)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.4 [Ley 7/2023 de Bienestar Animal](#12104-ley-72023-de-bienestar-animal)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.5 [Política de Conservación de Datos](#12105-politica-de-conservacion-de-datos)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.6 [Responsabilidad sobre Contenidos](#12106-responsabilidad-sobre-contenidos)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.7 [Moderación y Denuncias](#12107-moderacion-y-denuncias)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.8 [Principios de Privacidad](#12108-principios-de-privacidad)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.9 [Titularidad de la Información](#12109-titularidad-de-la-informacion)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.10 [Propiedad Intelectual](#121010-propiedad-intelectual)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.11 [Política de Moderación](#121011-politica-de-moderacion)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.12 [Exención de Responsabilidad](#121012-exencion-de-responsabilidad)  
    &nbsp;&nbsp;&nbsp;&nbsp;12.10.13 [Principios No Negociables](#121013-principios-no-negociables)
13. [Riesgos y Mitigación](#13-riesgos-y-mitigacion)
    13.1 [Matriz de Riesgos Principal](#131-matriz-de-riesgos-principal)  
    13.2 [Riesgos Técnicos](#132-riesgos-tecnicos)  
    13.3 [Riesgo Estratégico Principal](#133-riesgo-estrategico-principal)  
    13.4 [Riesgos Legales](#134-riesgos-legales)
14. [Anexos](#14-anexos)
    14.1 [Stack Técnico Detallado](#141-stack-tecnico-detallado)  
    14.2 [Esquema de Base de Datos](#142-esquema-de-base-de-datos)  
    14.3 [API Endpoints](#143-api-endpoints)  
    14.4 [Guía de Estilo](#144-guia-de-estilo)  
    14.5 [Ideas Futuras](#145-ideas-futuras)  
    14.6 [Decisiones Rechazadas (DR)](#146-decisiones-rechazadas-dr)  
   14.7 [Convenciones de Código y Commits](#147-convenciones-de-codigo-y-commits)
    14.8 [Checklist de Lanzamiento MVP](#148-checklist-de-lanzamiento-mvp)
15. [ESTADO ACTUAL](#15-estado-actual)
    

---

<a id="0-definiciones"></a>
## 0. DEFINICIONES

| Término | Definición |
|---------|------------|
| **Usuario Registrado** | Persona que ha completado el proceso de registro y validación de correo electrónico. |
| **Mascota Registrada** | Animal asociado a una cuenta de usuario con perfil completo (nombre, foto, especie, raza). |
| **Reporte Activo** | Caso de pérdida o hallazgo actualmente abierto en el sistema. |
| **Reporte Resuelto** | Caso cerrado por recuperación, identificación del propietario o cancelación explícita. |
| **Avistamiento** | Información aportada por terceros (fotografía, ubicación, descripción) vinculada a un reporte activo. |
| **Reencuentro Documentado** | Mascota recuperada cuya resolución ha sido confirmada por el propietario en la plataforma. |
| **Protectora Colaboradora** | Entidad sin ánimo de lucro registrada y verificada por el equipo de BuscoHuella. |
| **Densidad Local** | Concentración de usuarios activos por kilómetro cuadrado en una zona geográfica concreta. |
| **Product-Market Fit (PMF)** | Grado en el que el producto satisface una fuerte demanda del mercado. Indicador: retención + reencuentros recurrentes. |

---

<a id="1-resumen-ejecutivo"></a>
## 1. RESUMEN EJECUTIVO

BuscoHuella es una plataforma digital colaborativa para ayudar a localizar mascotas perdidas mediante geolocalización, participación ciudadana y colaboración con protectoras.

El MVP se lanzará inicialmente en **Sabadell** con el objetivo de validar que una comunidad hiperlocal puede aumentar la tasa de recuperación de mascotas.

### North Star Metric
> **Número de mascotas reunidas con sus familias gracias a BuscoHuella.**

### Objetivos MVP (Fase 1)
| Métrica | Objetivo |
|---------|----------|
| Usuarios registrados | 500 |
| Mascotas registradas | 100 |
| Reportes reales | 50 |
| Avistamientos | 25 |
| Reencuentros documentados | 5 |

El foco del proyecto es **validar el problema antes de ampliar funcionalidades, monetización o expansión geográfica**.

---

<a id="2-vision-y-proposito"></a>
## 2. VISIÓN Y PROPÓSITO

<a id="21-north-star-metric"></a>
### 2.1 North Star Metric

La métrica principal de BuscoHuella es:

> **Número de mascotas reunidas con sus familias gracias a BuscoHuella.**

Toda decisión estratégica deberá contribuir directa o indirectamente a aumentar esta métrica.

<a id="22-proposito-principal"></a>
### 2.2 Propósito Principal

Conectar personas, entidades y comunidades para encontrar, ayudar y proteger animales, creando un impacto social positivo y medible.

<a id="23-vision-a-largo-plazo"></a>
### 2.3 Visión a Largo Plazo

Ser la plataforma de referencia en España y Europa para la colaboración entre ciudadanos, asociaciones y entidades públicas en torno al bienestar animal, combinando tecnología, empatía y datos.

<a id="231-vision-2030"></a>
#### 2.3.1 Visión 2030

BuscoHuella aspira a convertirse en la infraestructura digital de referencia para la gestión colaborativa del bienestar animal en España.

La visión a largo plazo incluye:
- Recuperación de mascotas perdidas.
- Colaboración entre ciudadanos y protectoras.
- Herramientas para administraciones públicas.
- Datos e indicadores de bienestar animal.
- Expansión progresiva a nivel europeo.

> **Prioridad actual:** Validar el MVP en Sabadell. Todo lo demás es secundario.

<a id="24-objetivos-2026"></a>
### 2.4 Objetivos 2026 (Julio — Diciembre)

| # | Objetivo | Métrica de éxito |
|---|----------|------------------|
| 1 | Lanzar MVP funcional | Aplicación móvil Expo en desarrollo |
| 2 | Validar uso real en Sabadell | 500 usuarios registrados |
| 3 | Registrar mascotas | 100 mascotas activas |
| 4 | Activar colaboradores | 1 protectora colaboradora |
| 5 | Generar impacto | Primeros reencuentros documentados |

> **El éxito de 2026 no se medirá por ingresos, sino por validación de la propuesta de valor.**

<a id="25-no-objetivos-2026"></a>
### 2.5 No Objetivos 2026

BuscoHuella **NO** pretende durante esta fase:
- Expandirse a nivel nacional.
- Desarrollar hardware propio.
- Competir con GPS para mascotas.
- Construir una red social.
- Generar beneficios económicos significativos.

El único objetivo es validar que la plataforma ayuda realmente a recuperar mascotas.

<a id="26-objetivos-2027"></a>
### 2.6 Objetivos 2027

| # | Objetivo | Métrica |
|---|----------|---------|
| 1 | Validar Product-Market Fit local | 2.000 usuarios registrados |
| 2 | Escalar colaboraciones | 5 protectoras colaboradoras |
| 3 | Lanzar aplicación móvil | App nativa en iOS/Android |
| 4 | Expansión territorial | Cobertura completa del Vallès Occidental |

<a id="27-mision"></a>
### 2.7 Misión (Qué hacemos hoy)

Desarrollamos una plataforma digital colaborativa para ayudar a localizar mascotas perdidas mediante geolocalización, participación ciudadana y colaboración con protectoras y entidades locales.

<a id="28-frase-guia"></a>
### 2.8 Frase Guía

> **"Cada minuto cuenta. Todos merecen volver a casa."**

<a id="29-principios-del-producto"></a>
### 2.9 Principios del Producto

#### Principio 1 — Resolver un problema antes que añadir funcionalidades
BuscoHuella existe para ayudar a localizar mascotas perdidas y facilitar los reencuentros.

Toda funcionalidad nueva deberá responder a la pregunta:
> *¿Ayuda directamente a encontrar una mascota o mejorar la coordinación entre personas?*

Si la respuesta es **no**, la funcionalidad pasará al *backlog* de futuras evaluaciones.

#### Principio 2 — Móvil primero (Mobile First)
La mayoría de usuarios utilizarán BuscoHuella desde un teléfono móvil durante una situación de urgencia. Todas las decisiones de UX, diseño y desarrollo priorizarán la experiencia móvil.

#### Principio 3 — Hiperlocal antes que global
BuscoHuella se construirá de forma progresiva:
1. Sabadell
2. Vallès Occidental
3. Cataluña
4. España
5. Europa

No se desarrollarán funcionalidades pensadas para escala nacional hasta validar el modelo local.

#### Principio 4 — Simplicidad operativa
Cada nueva funcionalidad genera:
- Coste de desarrollo.
- Coste de mantenimiento.
- Coste de soporte.
- Complejidad técnica.

Se priorizarán soluciones simples, robustas y fáciles de mantener.

#### Principio 5 — Datos reales antes que suposiciones
Las decisiones de producto se tomarán basadas en:
- *Feedback* (retroalimentación) de usuarios.
- Uso real de la plataforma.
- Métricas verificables.

No se desarrollarán funcionalidades únicamente porque parezcan interesantes.

<a id="210-declaracion-de-enfoque"></a>
### 2.10 Declaración de Enfoque

BuscoHuella es una **plataforma de recuperación de mascotas**.

**No es:**
- Una red social.
- Un *marketplace*.
- Una aplicación veterinaria.
- Un GPS para mascotas.
- Una plataforma de comercio electrónico.

Toda decisión de producto deberá reforzar el objetivo principal: **aumentar la probabilidad de que una mascota vuelva con su familia.**

<a id="211-estrategia-de-producto"></a>
### 2.11 Estrategia de Producto

BuscoHuella es un producto de **uso esporádico**. A diferencia de redes sociales o aplicaciones de uso diario, los usuarios la utilizan principalmente durante situaciones concretas de pérdida o hallazgo.

La estrategia de crecimiento no se basa en maximizar el uso diario, sino en:
- **Confianza** en momentos críticos.
- **Utilidad** demostrada.
- **Recomendación** entre propietarios.
- **Colaboración** con entidades locales.
- **Reencuentros reales** documentados.

El objetivo es convertirse en la herramienta de referencia cuando una mascota desaparece o es encontrada.

---

<a id="3-planteamiento-del-problema"></a>

## 3. PLANTEAMIENTO DEL PROBLEMA

<a id="31-el-problema-real"></a>

### 3.1 El Problema Real

- **292.000 perros y gatos** recogidos en protectoras en España en 2024 (máximo histórico).
- **75% de animales en refugios NO llevan microchip** o tienen datos desactualizados.
- Solo el **17% de las mascotas perdidas** se reencuentra con su familia.
- Las soluciones actuales están fragmentadas: grupos de WhatsApp, Facebook, aplicaciones desconectadas.
- **Ley 7/2023 de Bienestar Animal**: multas de 500 € a 10.000 € por no comunicar la desaparición en 48 h. Los ayuntamientos necesitan herramientas digitales para cumplir.

<a id="32-el-dolor-del-usuario"></a>

### 3.2 El Dolor del Usuario

| Usuario | Dolor |
|---------|-------|
| **Dueño de mascota** | *"Mi perro se ha escapado. ¿Cómo aviso a mi barrio en minutos, no en horas?"* |
| **Protectora** | *"Recibimos animales encontrados pero no hay forma rápida de conectar con el dueño."* |
| **Ayuntamiento** | *"Necesitamos cumplir la ley y tener censo digital, pero no tenemos presupuesto para desarrollar una app."* |

<a id="33-por-que-ahora"></a>

### 3.3 ¿Por Qué Ahora?

| Factor | Descripción |
|--------|-------------|
| **Marco legal** | La Ley 7/2023 incrementa las obligaciones de gestión, identificación y protección animal, creando una oportunidad para herramientas digitales que faciliten su cumplimiento. |
| **Mercado** | El sector *Pet Tech* mantiene una tendencia de crecimiento impulsada por la digitalización del cuidado animal y el aumento del gasto en bienestar de mascotas. |
| **Contexto social** | España mantiene una elevada problemática relacionada con abandono, pérdida y recogida de animales, generando una necesidad real de mejores sistemas de coordinación. |
| **Tecnología** | La madurez actual de tecnologías móviles, geolocalización y plataformas cloud permite construir soluciones escalables con costes iniciales reducidos. |

---

<a id="4-publico-objetivo"></a>

## 4. PÚBLICO OBJETIVO

<a id="41-usuario-principal-b2c"></a>

### 4.1 Usuario Principal (B2C)

**Dueño de mascota en Sabadell**
- **Edad:** 25-55 años.
- **Perfil digital:** Usa WhatsApp, Instagram, Google Maps diariamente.
- **Necesidad:** Seguridad y tranquilidad para su mascota.
- **Dispositivo:** Smartphone (iOS/Android).
- **Contexto emocional:** Ansiedad alta durante la pérdida. Necesita respuesta inmediata, no procesos complejos.

<a id="42-usuario-secundario-b2b-social"></a>

### 4.2 Usuario Secundario (B2B Social)

**Protectoras y ONGs locales**
- **Ejemplos:** Protectora Sabadell, CAAC Sabadell, SOS Gats.
- **Necesidad:** Visibilidad digital, gestión de casos, conexión con ciudadanos y adoptantes.
- **Dolor operativo:** Falta de herramientas centralizadas; dependen de llamadas telefónicas y redes sociales.

<a id="43-usuario-futuro-b2g"></a>

### 4.3 Usuario Futuro (B2G)

**Ayuntamiento de Sabadell**
- **Necesidad:** Cumplimiento de la Ley 7/2023, estadísticas de bienestar animal, censo digital.
- **Estado:** No forma parte del cliente objetivo del MVP. Se considera línea de crecimiento futura tras validar el producto con usuarios y protectoras.
- **Puerta de entrada:** Concejalía de Medio Ambiente / Bienestar Animal.

<a id="431-ley-72023-obligaciones-municipales"></a>

#### 4.3.1 Ley 7/2023: Obligaciones Municipales

La Ley 7/2023 incrementa las obligaciones administrativas relacionadas con la gestión y protección animal. Las administraciones locales necesitan herramientas que faciliten:
- Seguimiento de incidencias relacionadas con animales.
- Obtención de estadísticas e indicadores.
- Coordinación con entidades colaboradoras.
- Apoyo a campañas de bienestar animal.
- Digitalización progresiva de procesos.

<a id="44-ciclo-de-adopcion-institucional"></a>

### 4.4 Ciclo de Adopción Institucional

La adopción municipal seguirá un proceso progresivo:

1. Contacto institucional.
2. Reuniones exploratorias.
3. Validación del problema.
4. Participación en piloto local.
5. Evaluación de resultados.
6. Proceso administrativo interno.
7. Aprobación presupuestaria.
8. Contratación o convenio.

> **Nota estratégica:** BuscoHuella no asume una venta directa a administraciones públicas. La estrategia consiste en demostrar utilidad mediante pilotos reales antes de cualquier proceso de contratación institucional.

<a id="45-validacion-inicial"></a>

### 4.5 Validación Inicial

Antes del lanzamiento del MVP se ha validado interés mediante:
- Landing page pública.
- Captación orgánica.
- Redes sociales.
- Lista de espera (*waitlist*).

**Resultados:**
- Más de 170 personas registradas.
- Primeras conversaciones con protectoras locales.
- Interés demostrado de propietarios de mascotas en Sabadell.

> Esta validación no demuestra *product-market fit*, pero sí indica interés inicial suficiente para justificar el desarrollo del MVP.

<a id="46-impacto-esperado"></a>

### 4.6 Impacto Esperado

BuscoHuella pretende:
- Reducir el tiempo medio de reencuentro.
- Incrementar la tasa de recuperación de mascotas.
- Mejorar la coordinación ciudadana.
- Facilitar el trabajo de protectoras.
- Reducir costes municipales asociados a animales perdidos.

<a id="47-estrategia-de-adopcion-inicial"></a>

### 4.7 Estrategia de Adopción Inicial

BuscoHuella seguirá una estrategia de **densidad local**. El objetivo no es captar usuarios en toda España, sino concentrar usuarios activos en una única zona geográfica.

**Fase 1:** Sabadell.

**Canales principales:**
- Protectora local.
- Clínicas veterinarias.
- Redes sociales locales.
- Grupos vecinales.
- Boca a boca.

**Métrica clave:** Usuarios activos por km². La utilidad del producto aumenta con la concentración de usuarios en una misma zona.

<a id="48-estrategia-go-to-market-mvp"></a>

### 4.8 Estrategia Go-To-Market (MVP)

**Objetivo:** Conseguir los primeros 100 usuarios activos.

**Acciones:**
- Campaña en grupos locales de Facebook.
- Colaboración con protectoras.
- Cartelería en veterinarios.
- Redes sociales.
- Programa de embajadores locales.

El crecimiento inicial será manual y altamente localizado.

<a id="49-plan-de-adquisicion-inicial"></a>

### 4.9 Plan de Adquisición Inicial

**Objetivo:** Alcanzar los primeros 500 usuarios registrados en Sabadell.

**Canales prioritarios:**
- Protectoras locales.
- Clínicas veterinarias.
- Redes sociales locales.
- Grupos vecinales.
- Programa de embajadores.

**Objetivos orientativos:**
- 5 veterinarios colaboradores → 100 usuarios.
- 2 protectoras colaboradoras → 100 usuarios.
- 10 embajadores locales → 150 usuarios.
- Redes sociales y contenido orgánico → 150 usuarios.

La adquisición inicial será manual, hiperlocal y orientada a generar densidad geográfica.

<a id="410-user-personas"></a>

### 4.10 User Personas

#### Persona 1: Marta — "La dueña preocupada"
- **Edad:** 34 años.
- **Ocupación:** Diseñadora gráfica. Trabaja en Barcelona, vive en el Eixample de Sabadell.
- **Mascota:** Luna, mestiza de 3 años.
- **Contexto:** Luna se escapó una vez por un descuido con la puerta del jardín. Marta pasó horas recorriendo el barrio y publicando en grupos de Facebook sin éxito. Finalmente la encontró por casualidad, pero no quiere volver a sentir esa impotencia.
- **Necesidad:** Una forma rápida, geolocalizada y confiable de alertar a su barrio en segundos, no en horas.
- **Frase clave:** *"Necesito que mi barrio se entere antes de que Luna llegue a la carretera."*

#### Persona 2: Carlos — "El voluntario de la protectora"
- **Edad:** 45 años.
- **Ocupación:** Técnico de mantenimiento. Voluntario en CAAC Sabadell los fines de semana.
- **Contexto:** La protectora recibe animales encontrados casi a diario, pero no tiene herramientas digitales para conectar con los dueños. Depende de llamadas telefónicas y de que alguien reconozca la foto en Facebook.
- **Necesidad:** Un canal directo y estructurado para publicar animales encontrados y recibir avistamientos organizados.
- **Frase clave:** *"Recibimos un perro hoy. ¿Cómo hacemos para que su familia lo encuentre sin depender del azar?"*

#### Persona 3: Ana — "La vecina solidaria"
- **Edad:** 28 años.
- **Ocupación:** Estudiante de máster. Vive en Gràcia de Sabadell. No tiene mascota, pero le encantan los animales.
- **Contexto:** Ve perros y gatos sueltos con frecuencia por su zona. Quiere ayudar, pero no sabe cómo: no usa Facebook, no conoce a los dueños y teme que el animal se asuste si intenta acercarse.
- **Necesidad:** Una forma sencilla de reportar avistamientos sin compromiso, que realmente llegue a quien lo necesita.
- **Frase clave:** *"Veo perros perdidos y no sé a quién avisar. Me gustaría poder ayudar sin meterme en líos."*

---

<a id="5-propuesta-de-valor"></a>

## 5. PROPUESTA DE VALOR

<a id="51-elevator-pitch"></a>

### 5.1 Elevator Pitch

> BuscoHuella es una plataforma digital colaborativa. Permite a los dueños de mascotas en Sabadell reportar animales perdidos o encontrados en tiempo real, conectando vecinos, protectoras y ayuntamiento en un mapa interactivo gratuito.

<a id="52-propuesta-de-valor-por-segmento"></a>

### 5.2 Propuesta de Valor por Segmento

| Segmento | Valor |
|----------|-------|
| **Ciudadanos** | Seguridad para su mascota, comunidad local, reencuentros rápidos. |
| **Protectoras** | Visibilidad digital, gestión eficiente de casos, conexión con adoptantes. |
| **Ayuntamiento** | Cumplimiento legal, censo digital, reducción de costes de gestión. |

<a id="53-diferenciacion-vs-competencia"></a>
### 5.3 Diferenciación vs. Competencia

| Característica | BuscoHuella | Facebook/WhatsApp | Pawboost | Tractive |
|----------------|-------------|-------------------|----------|----------|
| Mapa colaborativo en tiempo real | ✅ Sí | ❌ No | ⚠️ Básico | ❌ No |
| Gratuito | ✅ Sí | ✅ Sí | ⚠️ Freemium | ❌ De pago |
| Conexión con protectoras locales | ✅ Sí | ❌ No | ❌ No | ❌ No |
| Orientado a España/UE | ✅ Sí | ⚠️ Parcial | ❌ EE.UU. | ❌ Global genérico |
| Sin hardware obligatorio | ✅ Sí | ✅ Sí | ✅ Sí | ❌ Requiere collar |
| Integración con ayuntamientos | ✅ Roadmap | ❌ No | ❌ No | ❌ No |

<a id="54-ventaja-competitiva-sostenible"></a>

### 5.4 Ventaja Competitiva Sostenible

BuscoHuella no compite únicamente mediante tecnología. Sus principales ventajas competitivas son:
- Comunidad hiperlocal.
- Colaboración con protectoras.
- Relación con entidades públicas.
- Base de datos propia de reportes y avistamientos.
- Efecto red generado por usuarios activos.

Cuantos más usuarios participan en una zona, mayor es el valor de la plataforma para todos los participantes.

<a id="55-foso-estrategico-moat"></a>

### 5.5 Foso Estratégico (Moat)

BuscoHuella construye ventajas acumulativas difíciles de replicar:
- Comunidad hiperlocal.
- Relaciones con protectoras.
- Relaciones institucionales.
- Datos geolocalizados históricos.
- Efecto red local.
- Confianza de la comunidad.

La combinación de estos elementos genera una barrera competitiva creciente a medida que aumenta la adopción.

<a id="56-rueda-de-crecimiento-flywheel"></a>
### 5.6 Rueda de Crecimiento (Flywheel)

BuscoHuella genera valor mediante un ciclo de crecimiento basado en comunidad:
Más usuarios
↓
Más reportes
↓
Más avistamientos
↓
Más reencuentros
↓
Más confianza
↓
Más recomendaciones
↓
Más usuarios
plain

Cada nuevo usuario aumenta la probabilidad de éxito para el resto de usuarios de su zona. La prioridad estratégica consiste en acelerar este ciclo dentro de una misma área geográfica antes de expandirse a nuevas zonas.

<a id="57-efecto-red"></a>
### 5.7 Efecto Red

BuscoHuella es un producto basado en densidad local. El valor de la plataforma aumenta a medida que crece el número de usuarios activos dentro de una misma zona geográfica.

Cada nuevo usuario:
- Puede detectar mascotas perdidas.
- Puede aportar avistamientos.
- Puede compartir reportes.
- Puede acelerar reencuentros.

Por este motivo la estrategia inicial se centra exclusivamente en Sabadell. La expansión geográfica solo se considerará cuando exista suficiente densidad local que garantice utilidad real para la comunidad.

<a id="58-requisitos-de-latencia"></a>
### 5.8 Requisitos de Latencia

BuscoHuella gestiona información sensible. Los tiempos de respuesta deben optimizarse para:

| Operación | Objetivo |
|-----------|----------|
| Reportes | p95 < 500 ms |
| Avistamientos | p95 < 500 ms |
| Mapas | p95 < 1 s |
| Búsquedas | p95 < 500 ms |
| Alertas | p99 < 1 s |

Las latencias elevadas durante situaciones de emergencia pueden reducir la efectividad de la plataforma.

<a id="59-requisitos-de-calidad"></a>
### 5.9 Requisitos de Calidad

La calidad técnica se mide por: disponibilidad, escalabilidad, latencia, fiabilidad y seguridad.

<a id="591-disponibilidad"></a>
#### 5.9.1 Disponibilidad

- SLA objetivo: 99.9%
- Downtime aceptable: 8.76 horas/año
- Latencia máxima p99: < 1 segundo
- Tiempo de recuperación: < 1 hora

<a id="592-escalabilidad"></a>
#### 5.9.2 Escalabilidad

**Escalabilidad MVP:**
- Usuarios: 500 usuarios activos
- Mascotas: 100 mascotas
- Reportes: 50 activos
- Avistamientos: 100-200

**Crecimiento futuro:**
- Usuarios: 1.000 → 10.000 → 100.000
- Reportes simultáneos: 10 → 100 → 1.000 → 10.000+
- Avistamientos/hora: 100 → 1.000 → 10.000+

Objetivo: escalar sin *downtime* y sin degradación del servicio.

<a id="593-rendimiento"></a>
#### 5.9.3 Rendimiento

- Tiempo de carga página: p95 < 2 segundos
- Tiempo respuesta API: p95 < 500 ms
- Creación reporte: < 1 segundo
- Búsqueda por mapa: < 500 ms
- Alertas push: < 1 segundo (máx. 1 minuto)

<a id="594-seguridad"></a>
#### 5.9.4 Seguridad

- Usuario registrado antes de cualquier acción.
- OAuth 2.0 + JWT + Refresh Tokens.
- Contraseñas: bcrypt.
- API keys para servicios externos.
- *Rate limiting*.
- Protección CSRF, XSS, SQL Injection.
- Encriptación de datos sensibles.
- *Logging* de auditoría.

<a id="510-sistema-de-diseno"></a>
### 5.10 Sistema de Diseño

Diseño moderno, limpio, intuitivo y minimalista.

**Colores**
- Primary: azul (`#3b82f6`)
- Secondary: naranja (`#f97316`)
- White: `#ffffff`
- Black: `#000000`
- Gray Scale: `#f5f5f5` → `#171717`

**Tipografía**
- Fuente: Inter
- Weights: 300, 400, 500, 600, 700

**Iconografía**
- Feather Icons
- Font Awesome
- Material Icons

**Componentes UI**
- Botones
- Inputs
- Tarjetas
- Modales
- Notificaciones
- Avatares
- Mapas

---

<a id="6-mvp-alcance-y-funcionalidades"></a>
## 6. MVP — ALCANCE Y FUNCIONALIDADES

<a id="61-funcionalidades-incluidas-fase-1"></a>
### 6.1 Funcionalidades Incluidas (Fase 1)

| # | Funcionalidad | Descripción | Prioridad |
|---|---------------|-------------|-----------|
| 1 | **Registro/Login** | Supabase Auth, email y contraseña, perfil básico | 🔴 Crítica |
| 2 | **Registrar mascota** | Nombre, foto, especie, raza, color, tamaño, zona | 🔴 Crítica |
| 3 | **Reportar perdido** | Foto, ubicación GPS, descripción, contacto | 🔴 Crítica |
| 4 | **Reportar encontrado** | Foto, ubicación, descripción, contacto | 🔴 Crítica |
| 5 | **Mapa interactivo** | Pins de reportes activos, filtros por tipo, zoom | 🔴 Crítica |
| 6 | **Feed de reportes** | Lista cronológica de casos activos en Sabadell | 🔴 Crítica |
| 7 | **Ver detalle de reporte** | Fotos, ubicación, contacto, avistamientos | 🟡 Alta |
| 8 | **Añadir avistamiento** | Foto + ubicación vinculada a un reporte existente | 🟡 Alta |
| 9 | **Notificaciones web push** | Alerta cuando hay un reporte nuevo cerca | 🟡 Alta |
| 10 | **Landing page** | buscohuella.es con *waitlist* funcional | ✅ Ya existe |

<a id="62-funcionalidades-excluidas-fase-2"></a>
### 6.2 Funcionalidades Excluidas (Fase 2+)

| Funcionalidad | Fase estimada | Razón de exclusión |
|---------------|---------------|-------------------|
| IA de reconocimiento facial | Fase 3 | Requiere dataset + modelo + GPU |
| Blockchain / Token $HUE | Fase 4+ | Sin usuarios, sin utilidad real |
| Aplicación móvil nativa (Expo) | Fase 2 | La PWA cubre inicialmente las necesidades |
| Panel de administración | Fase 2 | Se puede gestionar vía BD directamente |
| Suscripciones de pago | Fase 2 | Primero tracción, luego monetización |
| Chat entre usuarios | Fase 2 | Complejidad innecesaria para MVP |
| Gamificación / puntos | Fase 2 | Distracción del *core* |
| Integración REIAC/SEPRONA | Fase 3 | Requiere acuerdos institucionales |
| IoT / Collares inteligentes | Fase 4+ | Hardware + certificación = años |
| Gestión ganadera | Nunca (*spin-off*) | Fuera del *core* de mascotas |

<a id="63-flujo-de-usuario-principal"></a>
### 6.3 Flujo de Usuario Principal (MVP)

```text
[Usuario abre buscohuella.es/app]
         │
         ▼
[¿Está logueado?]
    Sí / No
    │     │
    ▼     ▼
  [Home]  [Login/Registro]
    │         │
    └────┬────┘
         ▼
[Mapa con reportes activos en Sabadell]
         │
    ┌────┼────┐
    ▼    ▼    ▼
 [Ver  [Filtrar [Reportar
 reporte por tipo]  perdido/
 detalle]          encontrado]
    │                 │
    ▼                 ▼
 [Añadir         [Formulario +
 avistamiento]    foto + GPS +
                  confirmar]
    │
    ▼
[Notificación push
a usuarios cercanos]

```

---

<a id="64-alcance-geografico"></a>

### 6.4 Alcance Geográfico

El MVP de BuscoHuella se limitará inicialmente a **Sabadell**.

Se permitirá el registro desde cualquier ubicación, pero todas las acciones de validación, captación de usuarios y métricas de éxito estarán centradas en Sabadell.

La expansión territorial solo se evaluará tras validar:

- 500 usuarios registrados.
- 100 mascotas registradas.
- 5 reencuentros documentados.

> **Prioridad estratégica:** alcanzar una alta densidad local antes de ampliar la cobertura geográfica.


#### 6.4.1 Flujo de Reencuentro Documentado

El flujo de **Reencuentro Documentado** representa el principal indicador de validación del *Product-Market Fit* de BuscoHuella.

Un reencuentro únicamente se considera **documentado** cuando el propietario confirma la recuperación de su mascota a través de la plataforma.

##### 1. Publicación y avistamientos

El flujo comienza cuando:

1. Un usuario publica un **Reporte de Mascota Perdida**.
2. Otro usuario registra un **avistamiento**, indicando la ubicación y, opcionalmente, una fotografía.

##### 2. Sugerencia de coincidencia

La plataforma compara automáticamente la información del avistamiento con los datos de las mascotas registradas utilizando criterios como:

- Especie.
- Raza.
- Color.
- Tamaño.
- Zona geográfica.

##### 3. Notificación de posible coincidencia

Si existe una coincidencia con suficiente probabilidad, el sistema envía una notificación (*push* y/o correo electrónico) al propietario.

**Ejemplo de notificación:**

> Hemos detectado un posible avistamiento de **[Nombre de la Mascota]** cerca de **[Ubicación]** a las **[Hora]**.

##### 4. Confirmación del reencuentro

El propietario accede al detalle del avistamiento y puede confirmar la coincidencia mediante alguna de las siguientes acciones:

- Pulsar **"Sí, es mi mascota"**.
- Subir una fotografía de confirmación (opcional).

##### 5. Documentación del reencuentro

Una vez confirmada la coincidencia, la plataforma solicita:

- Fecha y hora del reencuentro.
- Lugar exacto de la recuperación.
- Testimonio o descripción del momento (opcional).
- Consentimiento para utilizar la información de forma anonimizada en estadísticas e indicadores.

##### 6. Cierre del reporte

Tras la confirmación:

- El reporte pasa al estado **RESOLVED — Reencuentro Documentado**.
- Se genera un registro permanente que vincula:
  - Reporte perdido.
  - Avistamiento confirmado.
  - Usuario propietario.
  - Evidencia documental (fecha, hora, ubicación y testimonio).

##### 7. Actualización de métricas

El caso pasa a formar parte de los KPIs principales del proyecto.

**Métricas actualizadas:**

- Número de reencuentros documentados.
- Tiempo medio hasta el reencuentro.
- Tasa de éxito por especie.

##### 8. Cierre con la comunidad

El usuario que realizó el avistamiento recibe un mensaje de agradecimiento.

> **¡Gracias! Gracias a tu ayuda, [Nombre de la Mascota] ha podido volver con su familia.**

Opcionalmente, tanto el propietario como el usuario colaborador podrán valorar la experiencia.

##### 9. Casos especiales

Si la mascota es localizada por una protectora o una entidad colaboradora:

- Se notifica igualmente al propietario.
- La entidad podrá completar la documentación oficial.
- El sistema registrará la colaboración entre ciudadano y organización.

---

<a id="65-casos-de-uso-principales">

<a id="65-casos-de-uso-principales"></a>

### 6.5 Casos de Uso Principales

Los siguientes casos de uso representan los flujos funcionales más importantes del MVP de BuscoHuella.

---

#### Caso de Uso 1 — He perdido mi mascota

**Objetivo:** Difundir rápidamente la desaparición para maximizar las posibilidades de reencuentro.

**Flujo:**

1. El usuario inicia sesión.
2. Selecciona una mascota registrada.
3. Pulsa **"Reportar pérdida"**.
4. Añade información adicional.
5. Confirma la ubicación.
6. Publica el reporte.
7. El reporte aparece automáticamente en el mapa.
8. Los usuarios cercanos reciben una notificación.

**Resultado esperado:**

La comunidad puede comenzar a colaborar inmediatamente en la búsqueda.

---

#### Caso de Uso 2 — He encontrado una mascota

**Objetivo:** Conectar rápidamente con el posible propietario.

**Flujo:**

1. El usuario abre BuscoHuella.
2. Pulsa **"Mascota encontrada"**.
3. Sube una fotografía.
4. Añade la ubicación.
5. Publica el reporte.

**Resultado esperado:**

El reporte aparece en el mapa y puede relacionarse con reportes de pérdida existentes.

---

#### Caso de Uso 3 — He visto una mascota reportada

**Objetivo:** Aportar información útil a un caso activo.

**Flujo:**

1. El usuario abre un reporte.
2. Pulsa **"Añadir avistamiento"**.
3. Adjunta una fotografía (opcional).
4. Comparte la ubicación.
5. Envía la información.

**Resultado esperado:**

El propietario recibe información actualizada sobre la posible localización de su mascota.

---

#### Caso de Uso 4 — Registrar una mascota

**Objetivo:** Crear el perfil de una mascota antes de que se produzca una pérdida.

**Flujo:**

1. El usuario se registra o inicia sesión.
2. Accede al apartado **"Mis mascotas"**.
3. Selecciona **"Añadir mascota"**.
4. Completa la información básica:
   - Nombre.
   - Especie (perro, gato u otro).
   - Raza.
   - Color.
   - Tamaño.
   - Fecha de nacimiento (opcional).
5. Sube una fotografía.
6. Confirma el registro.

**Resultado esperado:**

La mascota queda registrada y disponible para asociarla a futuros reportes.

---

#### Caso de Uso 5 — Filtrar reportes por zona

**Objetivo:** Mostrar únicamente los casos relevantes para el usuario.

**Flujo:**

1. El usuario abre el mapa.
2. Visualiza todos los reportes activos de Sabadell.
3. Puede aplicar diferentes filtros:
   - Hacer zoom sobre un barrio.
   - Dibujar un área personalizada.
   - Seleccionar un radio de búsqueda (500 m, 1 km, 5 km, etc.).

**Resultado esperado:**

El mapa actualiza dinámicamente los reportes mostrados según el área seleccionada.

---

<a id="66-recorridos-criticos-del-usuario-cuj"></a>

### 6.6 Recorridos Críticos del Usuario (CUJ)

Los siguientes **Critical User Journeys (CUJ)** representan los flujos imprescindibles para validar el MVP. Cualquier incidencia en alguno de ellos se considera un error crítico del producto.

#### Recorridos críticos

- Registro de usuario.
- Inicio de sesión.
- Registro de una mascota.
- Reportar una mascota perdida.
- Reportar una mascota encontrada.
- Consultar el mapa de reportes.
- Añadir un avistamiento.
- Recibir una notificación de proximidad.
- Confirmar un reencuentro.

#### Criterios de aceptación

Ninguna versión podrá desplegarse en producción si alguno de estos recorridos presenta errores bloqueantes.

Toda validación funcional deberá incluir, como mínimo, la ejecución completa de estos flujos.

#### Prioridad de pruebas

Los CUJ tendrán prioridad sobre cualquier otra funcionalidad durante:

- Testing manual.
- Pruebas de regresión.
- QA previo al despliegue.
- Validaciones asistidas por IA.

> **Regla del proyecto:** Es preferible retrasar una versión antes que publicar una que rompa uno de los recorridos críticos del usuario.

---

<a id="67-mvp-congelado"></a>

### 6.7 MVP Congelado

Una vez definido el alcance del MVP, no se incorporarán nuevas funcionalidades hasta completar la validación de la propuesta de valor.

El objetivo es evitar el **feature creep** y mantener el foco en resolver un único problema: **ayudar a encontrar mascotas perdidas**.

---

#### Funcionalidades permitidas

Las siguientes funcionalidades forman parte del MVP y podrán desarrollarse:

- Registro e inicio de sesión.
- Perfil de usuario.
- Gestión de mascotas.
- Reportes de mascotas perdidas.
- Reportes de mascotas encontradas.
- Mapa interactivo.
- Gestión de avistamientos.
- Notificaciones *push*.
- Landing pública.

---

#### Funcionalidades bloqueadas

Las siguientes funcionalidades **NO** podrán desarrollarse antes de validar el MVP:

| Funcionalidad | Motivo |
|--------------|--------|
| IA de reconocimiento facial | Requiere dataset, entrenamiento y mayor infraestructura. |
| Chat entre usuarios | Añade complejidad innecesaria al MVP. |
| Marketplace | Fuera del objetivo principal del producto. |
| QR inteligente | Puede incorporarse en una fase posterior. |
| Gamificación | No aporta valor durante la validación inicial. |
| Sistema de puntos | Distracción respecto al objetivo principal. |
| Blockchain / Token $HUE | Sin usuarios, no aporta utilidad real. |
| Telemedicina | Fuera del alcance del proyecto. |
| Integraciones complejas | Requieren mayor tracción y recursos. |
| Funcionalidades B2G avanzadas | Dependen de validación institucional. |

---

#### Fuera del alcance (2026–2027)

BuscoHuella **no pretende competir** en:

- GPS para mascotas.
- Redes sociales generalistas.
- Comercio electrónico de productos para mascotas.
- Software de gestión veterinaria.
- Gestión de clínicas.
- Seguros para mascotas.

El foco seguirá siendo exclusivamente la **localización y recuperación de mascotas perdidas**.

---

#### Criterios para desbloquear nuevas funcionalidades

Antes de ampliar el alcance del producto deberán alcanzarse, como mínimo, los siguientes objetivos:

- 500 usuarios registrados.
- 100 mascotas registradas.
- 50 reportes reales.
- 3 meses de uso activo.

Hasta alcanzar estos indicadores, toda la capacidad de desarrollo deberá centrarse en mejorar el núcleo del producto.

> **Regla del proyecto:** Antes de añadir nuevas funcionalidades, primero hay que demostrar que las existentes generan valor real para los usuarios.

---

<a id="68-definicion-de-terminado-dod"></a>

### 6.8 Definición de Terminado (Definition of Done - DoD)

Una funcionalidad únicamente podrá considerarse **terminada** cuando cumpla todos los criterios definidos a continuación.

El objetivo de esta definición es garantizar un nivel mínimo de calidad antes de dar una funcionalidad por finalizada.

---

#### Checklist de finalización

- [ ] Implementación completada.
- [ ] Validación funcional realizada manualmente.
- [ ] Tests básicos ejecutados correctamente.
- [ ] Sin errores críticos conocidos.
- [ ] Compatible con navegadores web soportados.
- [ ] Compatible con dispositivos móviles (*responsive*).
- [ ] Documentación técnica actualizada.
- [ ] Código revisado (manual o asistido por IA).
- [ ] Cumple los estándares de calidad y arquitectura del proyecto.

---

#### Criterios adicionales

Siempre que sea posible, una funcionalidad también debería cumplir:

- Código limpio y mantenible.
- Sin deuda técnica crítica.
- Rendimiento aceptable para el MVP.
- Compatible con el resto del sistema.
- Sin afectar negativamente a los recorridos críticos del usuario (CUJ).

---

#### Regla de aceptación

Cualquier funcionalidad que no cumpla todos los criterios anteriores permanecerá en estado:

> **En desarrollo**

y **no podrá considerarse finalizada**, aunque técnicamente funcione.

> **Principio del proyecto:** Una funcionalidad no está terminada cuando "funciona", sino cuando puede mantenerse, documentarse y utilizarse con confianza.

---

<a id="69-exito-del-mvp"></a>

### 6.9 Éxito del MVP

El objetivo del MVP no es maximizar ingresos ni desarrollar el mayor número posible de funcionalidades. Su propósito es **validar que BuscoHuella aporta un valor real a propietarios de mascotas, ciudadanos y entidades colaboradoras**.

El MVP se considerará validado cuando se alcancen simultáneamente los siguientes indicadores:

| Métrica | Objetivo |
|---------|---------:|
| Usuarios registrados | 500 |
| Mascotas registradas | 100 |
| Reportes reales publicados | 50 |
| Avistamientos registrados | 25 |
| Protectoras colaboradoras activas | 1 |
| Reencuentros documentados | 5 |

---

#### Indicadores cualitativos

Además de las métricas cuantitativas, deberán observarse las siguientes señales:

- Los usuarios utilizan la plataforma durante casos reales de pérdida o hallazgo.
- Se producen colaboraciones espontáneas entre ciudadanos.
- Las protectoras muestran interés en participar activamente.
- Los usuarios recomiendan BuscoHuella a otras personas.
- Se obtienen testimonios positivos sobre la utilidad del producto.

---

#### Criterios de validación

Se considerará que el MVP ha cumplido su objetivo cuando:

- Existe evidencia de que la plataforma facilita reencuentros.
- Los usuarios comprenden fácilmente el funcionamiento del producto.
- El flujo principal funciona de principio a fin sin bloqueos.
- La comunidad comienza a generar efecto red a nivel local.

---

#### Próximo paso tras la validación

Una vez alcanzados los objetivos del MVP, podrá iniciarse la siguiente fase del proyecto:

- Expansión geográfica progresiva.
- Desarrollo de nuevas funcionalidades.
- Inicio de la estrategia de monetización.
- Colaboraciones con entidades públicas y privadas.

Hasta alcanzar estos objetivos, **no se ampliará significativamente el alcance funcional del producto**.

> **Regla estratégica:** Validar primero, escalar después.

---

<a id="7-modelo-de-datos"></a>

# 7. MODELO DE DATOS

El modelo de datos de BuscoHuella está diseñado para ser **simple, escalable y mantenible**, priorizando la rapidez de desarrollo del MVP sin comprometer la evolución futura de la plataforma.

Los principios que guían este modelo son:

- Diseño centrado en el dominio del problema.
- Escalabilidad progresiva.
- Integridad de la información.
- Seguridad desde el diseño (*Security by Design*).
- Compatibilidad con futuras funcionalidades.

---

<a id="71-esquema-entidad-relacion"></a>

## 7.1 Esquema Entidad-Relación

El diagrama completo del modelo de datos se mantiene como documentación independiente para facilitar su mantenimiento.

**Referencia:**

```text
docs/database/DATABASE_SCHEMA.md
```

### Tablas principales

| Tabla | Propósito | Registros estimados (Año 1) |
|--------|-----------|----------------------------:|
| `users` | Perfiles de usuario | 1.000 |
| `pets` | Mascotas registradas | 1.500 |
| `reports` | Reportes de pérdida y hallazgo (CORE) | 500 |
| `report_sightings` | Avistamientos asociados a reportes | 1.000 |
| `shelters` | Protectoras y refugios colaboradores | 10 |
| `notifications` | Notificaciones enviadas | 10.000 |

---

#### Principios del modelo

- Una mascota pertenece a un único propietario.
- Un usuario puede registrar varias mascotas.
- Un reporte puede recibir múltiples avistamientos.
- Todo avistamiento pertenece a un único reporte.
- Un reporte solo puede tener un estado activo en cada momento.

> **Objetivo:** mantener un modelo de datos sencillo durante el MVP y evolucionarlo únicamente cuando exista una necesidad real.

---

<a id="72-decisiones-de-diseno"></a>

## 7.2 Decisiones de Diseño

El modelo de datos se ha diseñado siguiendo principios de simplicidad, escalabilidad y mantenibilidad.

### Decisiones principales

- **UUID como clave primaria (PK)** en todas las tablas.
  - Facilita el escalado horizontal.
  - Evita colisiones entre identificadores.
  - Reduce la exposición de IDs secuenciales.

- **Geolocalización mediante coordenadas GPS**.
  - Latitud y longitud almacenadas como coordenadas estándar.
  - Suficiente para el MVP.

- **PostGIS como evolución futura**.
  - No será necesario inicialmente.
  - Se incorporará cuando el volumen de datos requiera consultas geoespaciales avanzadas.

- **Campos JSONB para metadatos flexibles**.
  - Permiten almacenar información adicional sin modificar el esquema relacional.

- **Soft Deletes**.
  - Los registros no se eliminan físicamente.
  - Se marcan como eliminados para facilitar auditorías y recuperación.

- **Timestamps obligatorios**.
  - Todas las tablas incluirán:
    - `created_at`
    - `updated_at`

### Principios de evolución

El modelo deberá evolucionar únicamente cuando exista una necesidad demostrada por el uso real de la plataforma.

> **Regla:** primero validar el producto; después optimizar el modelo de datos.

---

<a id="73-seguridad-en-base-de-datos"></a>

## 7.3 Seguridad en Base de Datos

La información gestionada por BuscoHuella incluye datos personales y ubicaciones geográficas, por lo que la seguridad constituye un requisito fundamental desde el inicio del proyecto.

### Medidas de seguridad

- **Row Level Security (RLS)** habilitado en PostgreSQL mediante Supabase.
- **Cifrado en tránsito** utilizando TLS 1.3.
- **Cifrado en reposo** gestionado por la infraestructura de Supabase.
- **Backups automáticos** diarios con una retención mínima de 30 días.
- **Control de acceso** basado en autenticación y autorización.
- **Registro de auditoría** para operaciones relevantes.

### Principios

- Mínimo privilegio.
- Acceso únicamente a los datos necesarios.
- Protección frente a accesos no autorizados.
- Cumplimiento de la normativa de protección de datos.

> **Security by Design:** toda nueva funcionalidad deberá diseñarse teniendo en cuenta la seguridad desde su concepción.

---

<a id="74-modelo-de-dominio"></a>

## 7.4 Modelo de Dominio

El dominio de BuscoHuella se compone de un conjunto reducido de entidades claramente definidas.

### Usuario

Representa a una persona registrada en la plataforma.

Puede:

- Registrar mascotas.
- Crear reportes.
- Añadir avistamientos.
- Recibir notificaciones.
- Gestionar su perfil.

---

### Mascota

Representa un animal asociado a un usuario.

Puede encontrarse en uno de los siguientes estados:

- Activa.
- Perdida.
- Recuperada.

Una mascota puede generar varios reportes a lo largo de su vida, aunque únicamente podrá tener un reporte activo simultáneamente.

---

### Reporte

Representa un caso de pérdida o hallazgo.

Tipos de reporte:

- Mascota perdida.
- Mascota encontrada.

Cada reporte puede:

- Recibir múltiples avistamientos.
- Cambiar de estado durante su ciclo de vida.
- Finalizar con un reencuentro documentado.

---

### Avistamiento

Representa una observación realizada por un usuario sobre una mascota reportada.

Incluye:

- Ubicación.
- Fecha y hora.
- Descripción.
- Fotografía (opcional).

Cada avistamiento pertenece a un único reporte.

---

### Protectora

Representa una entidad colaboradora registrada en BuscoHuella.

Puede:

- Publicar reportes.
- Colaborar en búsquedas.
- Validar información.
- Gestionar casos asociados.

---

### Relación entre entidades

```text
Usuario
   │
   ├───< Mascota
   │         │
   │         └───< Reporte
   │                     │
   │                     └───< Avistamiento
   │
   └───< Notificación

Protectora
      │
      └────── participa en Reportes
```

> El objetivo del modelo de dominio es representar el problema de negocio con el menor número posible de entidades, manteniendo claridad y capacidad de evolución.

---

<a id="75-eventos-de-dominio"></a>

## 7.5 Eventos de Dominio

BuscoHuella utiliza eventos de dominio para representar acciones relevantes que ocurren dentro del sistema.

Estos eventos permiten desacoplar funcionalidades, facilitar la analítica y preparar futuras automatizaciones e integraciones.

### Eventos principales

| Evento | Descripción |
|--------|-------------|
| `UserRegistered` | Un nuevo usuario completa el proceso de registro. |
| `PetCreated` | Se registra una nueva mascota. |
| `PetReportedLost` | Se publica un reporte de mascota perdida. |
| `PetReportedFound` | Se publica un reporte de mascota encontrada. |
| `SightingCreated` | Un usuario añade un nuevo avistamiento. |
| `ReportResolved` | Un reporte se marca como resuelto mediante un reencuentro documentado u otro motivo válido. |
| `NotificationSent` | El sistema envía una notificación al usuario. |
| `NotificationOpened` | El usuario abre una notificación recibida. |

### Objetivos

Los eventos de dominio servirán para:

- Alimentar la analítica del producto.
- Medir el comportamiento de los usuarios.
- Desencadenar notificaciones automáticas.
- Facilitar futuras integraciones.
- Implementar automatizaciones basadas en eventos.

> Durante el MVP los eventos podrán implementarse de forma sencilla. En fases posteriores podrán evolucionar hacia una arquitectura orientada a eventos (*Event-Driven Architecture*).

---

<a id="76-politica-de-conservacion-de-datos"></a>

## 7.6 Política de Conservación de Datos

BuscoHuella conservará la información siguiendo los principios de minimización, trazabilidad y cumplimiento normativo.

Las políticas definitivas se revisarán antes del lanzamiento público y deberán adaptarse a la legislación vigente.

### Política inicial

| Tipo de dato | Política de conservación |
|--------------|--------------------------|
| Usuarios eliminados | Anonimización progresiva de los datos personales. |
| Reportes cerrados | Conservación con fines históricos y estadísticos. |
| Logs técnicos | Conservación durante 90 días. |
| Notificaciones | Conservación durante 12 meses. |
| Copias de seguridad | Según la política de infraestructura de Supabase. |

### Principios

- Cumplimiento del RGPD.
- Conservación únicamente durante el tiempo necesario.
- Posibilidad de anonimización cuando proceda.
- Protección frente a pérdidas accidentales.

> La conservación de datos nunca deberá comprometer la privacidad de los usuarios.

---

<a id="77-estados-del-reporte"></a>

## 7.7 Estados del Reporte

Todo reporte deberá encontrarse en uno de los siguientes estados durante su ciclo de vida.

| Estado | Descripción |
|--------|-------------|
| `OPEN` | Reporte activo y visible para la comunidad. |
| `PENDING_VERIFICATION` | Información pendiente de revisión o validación. |
| `RESOLVED` | La mascota ha sido localizada o el propietario ha sido identificado. |
| `CLOSED` | El caso ha sido cerrado manualmente por el propietario o una entidad autorizada. |
| `ARCHIVED` | Reporte histórico sin actividad, conservado únicamente con fines de consulta. |

### Flujo de estados

```text
OPEN
  │
  ├──────────────► PENDING_VERIFICATION
  │                     │
  │                     ▼
  ├──────────────────► RESOLVED
  │                     │
  ▼                     ▼
CLOSED ─────────────► ARCHIVED
```

### Reglas de negocio

- Solo puede existir un estado activo por reporte.
- Un reporte resuelto no podrá volver al estado `OPEN`.
- Los reportes archivados permanecerán disponibles únicamente para consulta y análisis.
- Todos los cambios de estado deberán quedar registrados para fines de auditoría.

> El ciclo de vida del reporte debe ser sencillo, trazable y fácilmente comprensible para cualquier usuario.

---

<a id="8-modelo-de-negocio"></a>

# 8. Modelo de Negocio

BuscoHuella nace como una plataforma tecnológica de impacto social cuyo propósito principal es aumentar las probabilidades de recuperación de mascotas perdidas mediante la colaboración ciudadana y la geolocalización en tiempo real.

El objetivo inicial no es la rentabilidad económica, sino demostrar que el producto genera un impacto medible y resuelve un problema real.

La estrategia de negocio seguirá un modelo de crecimiento progresivo:

1. Validar el problema.
2. Validar la solución.
3. Validar la adopción.
4. Alcanzar sostenibilidad económica.
5. Escalar el proyecto.

La monetización nunca deberá comprometer la misión social de BuscoHuella.

---

<a id="81-principios-del-modelo"></a>

## 8.1 Principios del Modelo

Todo el modelo económico del proyecto se basa en los siguientes principios:

- Priorizar el impacto social frente al beneficio económico.
- Mantener el acceso gratuito para cualquier ciudadano durante el MVP.
- Evitar publicidad invasiva.
- Reinvertir parte de los beneficios en la comunidad.
- Mantener costes operativos reducidos.
- Escalar únicamente cuando exista demanda real.

---

<a id="82-fase-1-mvp"></a>

## 8.2 Fase 1 — MVP (0-6 meses)

### Objetivo

Validar que BuscoHuella resuelve un problema real.

Durante esta fase no existirá ninguna fuente de ingresos.

### Características

- Uso completamente gratuito.
- Sin publicidad.
- Sin suscripciones.
- Sin funcionalidades Premium.
- Sin marketplace.
- Sin venta de datos.

Toda la inversión estará destinada a:

- Desarrollo.
- Infraestructura.
- Captación de usuarios.
- Validación del producto.

---

<a id="821-objetivos-mvp"></a>

### 8.2.1 Objetivos del MVP

El MVP deberá demostrar:

- Que las personas utilizan la plataforma durante pérdidas reales.
- Que la comunidad participa activamente.
- Que se generan avistamientos útiles.
- Que aumentan las probabilidades de recuperación.
- Que protectoras y administraciones muestran interés.

---

<a id="822-sostenibilidad"></a>

### 8.2.2 Objetivo de Sostenibilidad

Durante el MVP el éxito económico no se medirá por ingresos.

Se medirá por:

- Coste de adquisición de usuarios (CAC).
- Coste mensual de infraestructura.
- Coste por usuario activo.
- Tiempo dedicado al soporte.
- Crecimiento orgánico.

El objetivo es demostrar que BuscoHuella puede mantenerse con una estructura de costes reducida.

---

<a id="823-unit-economics"></a>

### 8.2.3 Unit Economics

Objetivos iniciales:

| Métrica | Objetivo |
|----------|----------|
| Infraestructura | < 50 €/mes |
| Coste por usuario activo | < 0,50 €/mes |
| Coste marginal por nuevo usuario | Cercano a 0 € |
| Tiempo medio de soporte | < 5 min/usuario/mes |

---

<a id="83-fase-2"></a>

## 8.3 Fase 2 — Crecimiento (6-18 meses)

Una vez validado el MVP podrán incorporarse modelos de monetización de bajo impacto.

### Fuentes previstas

| Fuente | Descripción |
|---------|-------------|
| Suscripción Premium | Funciones avanzadas para particulares |
| Licencias Protectoras | Herramientas de gestión y estadísticas |
| Licencias Municipales | Paneles de seguimiento y métricas |
| Patrocinios | Empresas comprometidas con el bienestar animal |

La prioridad seguirá siendo mantener gratuita toda la funcionalidad esencial relacionada con la recuperación de mascotas.

---

<a id="84-fase-3"></a>

## 8.4 Fase 3 — Escalado

Con el producto validado podrán incorporarse nuevas líneas de negocio compatibles con la misión del proyecto.

Posibles líneas futuras:

- Marketplace de servicios.
- API para terceros.
- Integraciones profesionales.
- Servicios B2G avanzados.
- Informes estadísticos anonimizados.
- Herramientas para investigación.

Todas estas funcionalidades quedarán fuera del alcance del MVP.

---

<a id="85-politica-de-monetizacion"></a>

## 8.5 Política de Monetización

BuscoHuella seguirá siempre las siguientes reglas:

- Nunca se cobrará por publicar una mascota perdida.
- Nunca se limitarán las alertas básicas.
- Nunca se ocultarán reportes por motivos económicos.
- Nunca se venderán datos personales.
- Toda monetización deberá aportar valor adicional.

---

<a id="86-reinversion"></a>

## 8.6 Reinversión Social

Cuando el proyecto alcance beneficios sostenibles se destinará un porcentaje de los beneficios netos a iniciativas relacionadas con el bienestar animal.

Posibles líneas:

- Educación.
- Campañas de concienciación.
- Ayuda a protectoras.
- Programas municipales.
- Investigación.

La distribución de estos fondos deberá publicarse de forma transparente.

---

<a id="87-supuestos"></a>

## 8.7 Supuestos Estratégicos

El proyecto parte de las siguientes hipótesis:

- Existe una necesidad real no cubierta.
- La colaboración ciudadana mejora la recuperación.
- La geolocalización aporta valor frente a redes sociales.
- Las protectoras colaborarán activamente.
- Los ayuntamientos demandarán métricas locales.
- La concentración geográfica aumenta la eficacia del sistema.

Cada uno de estos supuestos deberá validarse mediante métricas reales.

---

<a id="88-hipotesis"></a>

## 8.8 Hipótesis a Validar

| Código | Hipótesis |
|----------|-----------|
| H1 | Los propietarios utilizarán BuscoHuella durante pérdidas reales. |
| H2 | La geolocalización mejora la coordinación respecto a redes sociales. |
| H3 | Las notificaciones aumentan los avistamientos útiles. |
| H4 | Las protectoras adoptarán la plataforma. |
| H5 | Un modelo hiperlocal genera suficiente densidad de usuarios. |
| H6 | Los reencuentros documentados aumentan la confianza en la plataforma. |

---

<a id="89-dafo"></a>

## 8.9 Análisis DAFO

| Fortalezas | Debilidades |
|------------|-------------|
| Impacto social claro | Equipo reducido |
| Stack tecnológico moderno | Recursos limitados |
| Bajo coste operativo | Dependencia inicial del fundador |
| Enfoque hiperlocal | Baja notoriedad al inicio |

| Oportunidades | Amenazas |
|---------------|----------|
| Crecimiento del sector Pet Tech | Competidores consolidados |
| Ley 7/2023 | Saturación de aplicaciones móviles |
| Digitalización municipal | Cambios regulatorios |
| Posibles subvenciones | Baja adopción inicial |

---

<a id="810-indicadores-economicos"></a>

## 8.10 Indicadores de Viabilidad

El modelo económico se considerará validado cuando se cumplan simultáneamente:

| Indicador | Objetivo |
|-----------|----------|
| Usuarios registrados | ≥ 500 |
| Mascotas registradas | ≥ 100 |
| Reportes reales | ≥ 50 |
| Reencuentros documentados | ≥ 5 |
| Infraestructura mensual | < 100 € |
| Coste por usuario activo | < 0,50 €/mes |

Hasta alcanzar estos indicadores no se ampliará el alcance económico del proyecto.

---

<a id="9-roadmap-estrategico"></a>

# 9. Roadmap estratégico

El desarrollo de BuscoHuella seguirá una estrategia iterativa basada en la validación continua del producto.

Cada fase deberá demostrar valor real antes de iniciar la siguiente. El crecimiento del alcance siempre estará condicionado por métricas objetivas y no por hipótesis.

El roadmap podrá revisarse periódicamente en función de los aprendizajes obtenidos durante el desarrollo y la operación del sistema.

---

<a id="91-principios-del-roadmap"></a>

## 9.1 Principios del Roadmap

El roadmap de BuscoHuella se basa en los siguientes principios:

- Construir primero el núcleo del producto.
- Validar antes de ampliar funcionalidades.
- Priorizar el impacto sobre el número de funcionalidades.
- Reducir al máximo la deuda técnica.
- Mantener una experiencia de usuario sencilla.
- Favorecer la escalabilidad desde el diseño.
- Evitar desarrollos prematuros.

Toda nueva funcionalidad deberá justificar claramente el valor que aporta al objetivo principal del proyecto: aumentar el número de mascotas recuperadas.

---

<a id="92-fases-del-roadmap"></a>

## 9.2 Fases del Roadmap

| Fase | Estado | Objetivo |
|-------|--------|----------|
| MVP | En desarrollo | Validar la propuesta de valor |
| Beta Local | Planificada | Validación en Sabadell |
| Expansión Regional | Futuro | Escalar a Cataluña |
| Escala Nacional | Futuro | Cobertura estatal |
| Plataforma Europea | Visión | Internacionalización |

---

<a id="93-fase-1-mvp"></a>

## 9.3 Fase 1 — MVP

Objetivos principales:

- Registro de usuarios.
- Registro de mascotas.
- Reportes de pérdida.
- Reportes de animales encontrados.
- Avistamientos.
- Mapa interactivo.
- Notificaciones.
- Panel básico de administración.

Indicadores de éxito:

- 500 usuarios.
- 100 mascotas.
- 50 reportes reales.
- 25 avistamientos.
- 5 reencuentros documentados.

La superación de estos objetivos permitirá pasar a la siguiente fase.

---

<a id="94-fase-2-beta-local"></a>

## 9.4 Fase 2 — Beta Local

Una vez validado el MVP comenzará una fase de consolidación en Sabadell.

Las prioridades serán:

- Optimización de rendimiento.
- Mejoras de usabilidad.
- Sistema avanzado de notificaciones.
- Panel para protectoras.
- Dashboard municipal.
- Estadísticas de impacto.
- Verificación de entidades.

El objetivo será convertir BuscoHuella en la herramienta de referencia para la gestión local de mascotas perdidas.

---

<a id="95-fase-3-expansion-regional"></a>

## 9.5 Fase 3 — Expansión Regional

Tras consolidar la operación local se iniciará la expansión progresiva.

Posibles áreas:

- Terrassa.
- Cerdanyola.
- Barberà del Vallès.
- Sant Quirze.
- Rubí.
- Resto del Vallès Occidental.

Durante esta fase se optimizarán:

- Escalabilidad.
- Infraestructura.
- Costes.
- Automatización.
- Analítica avanzada.

---

<a id="96-fase-4-escala"></a>

## 9.6 Fase 4 — Escala Nacional

Una vez validado el modelo operativo:

- Cobertura nacional.
- Convenios institucionales.
- Integraciones oficiales.
- API pública.
- Plataforma para organizaciones.
- Licencias B2G.

El objetivo será convertir BuscoHuella en la plataforma de referencia para la recuperación de mascotas en España.

---

<a id="97-gestion-del-roadmap"></a>

## 9.7 Gestión del Roadmap

El roadmap será un documento vivo.

Cada funcionalidad deberá cumplir:

- Justificación de negocio.
- Impacto esperado.
- Coste estimado.
- Riesgo.
- Dependencias.
- Prioridad.
- Valor para el usuario.

No se desarrollarán funcionalidades únicamente por innovación tecnológica o por moda.

---

<a id="98-criterios-de-priorizacion"></a>

## 9.8 Criterios de Priorización

Las nuevas funcionalidades se priorizarán utilizando los siguientes criterios:

1. Impacto en la recuperación de mascotas.
2. Valor para el usuario.
3. Esfuerzo de implementación.
4. Riesgo técnico.
5. Coste de mantenimiento.
6. Alineación con la misión del proyecto.

Cuando exista empate entre dos funcionalidades, siempre tendrá prioridad aquella que incremente la probabilidad de reencuentro entre mascotas y propietarios.

---

<a id="99-funcionalidades-futuras"></a>

## 9.9 Funcionalidades Futuras

Las siguientes funcionalidades forman parte de la visión a largo plazo del proyecto, pero quedan expresamente fuera del MVP:

- IA para reconocimiento visual.
- QR inteligente.
- Integración con lectores de microchip.
- Chat seguro entre usuarios.
- Marketplace de servicios.
- Gamificación.
- Sistema de recompensas.
- API pública.
- Integración con ayuntamientos.
- Integración con colegios veterinarios.
- Integración con fuerzas de seguridad.
- Plataforma de analítica avanzada.
- Predicción de zonas de avistamiento mediante IA.

Estas funcionalidades únicamente se evaluarán una vez validado el núcleo del producto.

---

<a id="10-arquitectura-general"></a>

# 10. Arquitectura General

La arquitectura de BuscoHuella ha sido diseñada siguiendo principios de modularidad, escalabilidad, mantenibilidad y separación de responsabilidades.

El objetivo es disponer de una plataforma capaz de evolucionar desde un MVP local hasta un sistema distribuido que pueda dar servicio a múltiples municipios sin necesidad de rediseñar su núcleo.

La arquitectura prioriza la simplicidad durante las primeras fases del proyecto, permitiendo incorporar nuevos componentes conforme aumenten los usuarios y las necesidades operativas.

---

<a id="101-principios-de-arquitectura"></a>

## 10.1 Principios de Arquitectura

Toda decisión arquitectónica deberá respetar los siguientes principios:

- Simplicidad antes que complejidad.
- Modularidad.
- Bajo acoplamiento.
- Alta cohesión.
- Escalabilidad horizontal.
- Seguridad desde el diseño (Security by Design).
- Privacidad desde el diseño (Privacy by Design).
- API First.
- Mobile First.
- Cloud Ready.
- Observabilidad.
- Automatización del despliegue.
- Documentación continua.

Estos principios servirán como referencia para cualquier evolución futura del sistema.

---

<a id="102-estilo-arquitectonico"></a>

## 10.2 Estilo Arquitectónico

BuscoHuella adopta una arquitectura basada en servicios desacoplados.

Durante el MVP se utilizará un enfoque de **monolito modular**, donde todos los componentes residirán en una única aplicación backend organizada por dominios funcionales.

Este enfoque reduce la complejidad operativa inicial, facilita el desarrollo y permite evolucionar hacia una arquitectura de microservicios especializados cuando el volumen de usuarios lo justifique.

La separación lógica entre módulos permitirá realizar esta transición sin necesidad de reescribir el sistema completo.

---

<a id="103-componentes-principales"></a>

## 10.3 Componentes Principales

La plataforma estará formada por los siguientes componentes principales:

| Componente | Responsabilidad |
|------------|-----------------|
| Aplicación móvil | Interacción con usuarios finales |
| Landing pública | Captación de usuarios e información del proyecto |
| API Backend | Lógica de negocio y acceso a datos |
| Base de datos | Persistencia de la información |
| Servicio de autenticación | Gestión de usuarios y sesiones |
| Servicio de almacenamiento | Fotografías y documentos |
| Servicio de notificaciones | Envío de notificaciones push y correo electrónico |
| Panel de administración | Gestión operativa del sistema |

---

<a id="104-arquitectura-logica"></a>

## 10.4 Arquitectura Lógica

La solución se divide en varias capas claramente diferenciadas:

### Presentación

- Aplicación móvil.
- Landing pública.
- Panel administrativo.

### Aplicación

- Casos de uso.
- Servicios de dominio.
- Validaciones.
- Gestión de permisos.

### Dominio

- Usuarios.
- Mascotas.
- Reportes.
- Avistamientos.
- Notificaciones.
- Protectoras.
- Estadísticas.

### Infraestructura

- Base de datos.
- Almacenamiento.
- Servicios externos.
- Sistema de logs.
- Monitorización.

Cada capa solo podrá comunicarse con las capas inmediatamente inferiores.

---

<a id="105-dominios-funcionales"></a>

## 10.5 Dominios Funcionales

La aplicación se organiza en los siguientes dominios de negocio:

- Usuarios.
- Autenticación.
- Mascotas.
- Reportes de pérdida.
- Reportes de hallazgo.
- Avistamientos.
- Geolocalización.
- Notificaciones.
- Protectoras.
- Administración.
- Analítica.
- Configuración.

Cada dominio encapsula sus propias reglas de negocio y evoluciona de forma independiente.

---

<a id="106-escalabilidad"></a>

## 10.6 Escalabilidad

La arquitectura ha sido diseñada para soportar el crecimiento progresivo del proyecto.

Inicialmente todos los servicios compartirán la misma infraestructura.

A medida que aumente la carga podrán separarse componentes como:

- Servicio de notificaciones.
- Procesamiento de imágenes.
- Analítica.
- Búsquedas geográficas.
- Inteligencia Artificial.

Esta evolución deberá realizarse sin afectar al funcionamiento de los módulos existentes.

---

<a id="107-dependencias-externas"></a>

## 10.7 Dependencias Externas

Durante el MVP se minimizarán las dependencias de terceros.

Únicamente se utilizarán aquellos servicios que aporten un valor claro al producto, como:

- Servicios de mapas.
- Servicio de almacenamiento.
- Notificaciones push.
- Correo electrónico.
- Autenticación.

La sustitución de cualquier proveedor deberá requerir el mínimo impacto posible sobre la arquitectura.

---

<a id="108-decisiones-arquitectonicas"></a>

## 10.8 Decisiones Arquitectónicas

Las principales decisiones de arquitectura adoptadas son:

- Monolito modular durante el MVP.
- API REST como mecanismo principal de comunicación.
- Base de datos relacional como fuente única de verdad.
- Separación estricta entre frontend y backend.
- Arquitectura preparada para migrar a microservicios especializados.
- Diseño orientado a dominios funcionales.
- Automatización de despliegues mediante CI/CD.
- Observabilidad integrada desde el inicio.

Estas decisiones podrán revisarse únicamente cuando existan métricas que justifiquen un cambio arquitectónico.

---

<a id="109-evolucion-arquitectonica"></a>

## 10.9 Evolución Arquitectónica

La evolución prevista de la plataforma será:

1. MVP local.
2. Optimización funcional.
3. Escalabilidad horizontal.
4. Separación de servicios.
5. Arquitectura distribuida.
6. Plataforma multimunicipio.
7. Cobertura nacional.

Cada transición estará condicionada por el crecimiento real del proyecto y no por previsiones teóricas.

---

<a id="11-arquitectura-software"></a>

# 11. Arquitectura Software

La arquitectura software de BuscoHuella ha sido diseñada bajo un enfoque **Backend as a Service (BaaS)** utilizando **Supabase** como plataforma principal.

Esta decisión permite acelerar el desarrollo del MVP, reducir costes de infraestructura y mantenimiento, simplificar la operación del sistema y centrar los esfuerzos en aportar valor al usuario.

La arquitectura mantiene una clara separación entre la aplicación cliente, los servicios backend y la capa de persistencia, permitiendo evolucionar hacia una arquitectura más distribuida si el crecimiento del proyecto lo requiere.

---

<a id="110-objetivos-de-la-arquitectura"></a>

## 11.0 Objetivos de la Arquitectura

La arquitectura de BuscoHuella tiene como objetivos:

- Permitir una evolución rápida durante el MVP.
- Mantener bajo coste operativo.
- Separar responsabilidades entre capas.
- Facilitar el mantenimiento del código.
- Garantizar seguridad y privacidad desde el diseño.
- Permitir escalar progresivamente sin rehacer el sistema.
- Favorecer la incorporación futura de nuevos módulos.

---

<a id="111-stack-tecnologico"></a>

## 11.1 Stack Tecnológico

Las tecnologías seleccionadas priorizan productividad, escalabilidad, estabilidad y una amplia comunidad de soporte.

| Capa | Tecnología |
|------|------------|
| Aplicación móvil | React Native + Expo |
| Landing Web | Next.js |
| Backend (BaaS) | Supabase |
| Base de datos | PostgreSQL |
| Autenticación | Supabase Auth |
| Almacenamiento | Supabase Storage |
| Tiempo Real | Supabase Realtime |
| Funciones Backend | Supabase Edge Functions |
| Estado Global | Zustand |
| Mapas | React Native Maps |
| Notificaciones Push | Expo Notifications |
| Testing | Jest + React Native Testing Library |
| Control de versiones | Git + GitHub |
| CI/CD | GitHub Actions |
| Entorno local | Docker (opcional) |

---

<a id="112-arquitectura-del-frontend"></a>

## 11.2 Arquitectura del Frontend

La aplicación móvil será desarrollada utilizando **React Native** mediante **Expo**, siguiendo una arquitectura modular organizada por funcionalidades.

Cada módulo será responsable de un dominio concreto del negocio, favoreciendo el desacoplamiento y la mantenibilidad del código.

Los principales módulos serán:

- Autenticación.
- Perfil de usuario.
- Mascotas.
- Reportes de pérdida.
- Reportes de hallazgo.
- Avistamientos.
- Mapa interactivo.
- Notificaciones.
- Configuración.
- Administración (uso interno).

La lógica de presentación permanecerá separada de la lógica de acceso a datos y de las reglas de negocio.

---

<a id="113-arquitectura-backend"></a>

## 11.3 Arquitectura Backend

BuscoHuella utilizará **Supabase** como plataforma backend durante el MVP.

Supabase proporcionará de forma integrada:

- Base de datos PostgreSQL.
- Sistema de autenticación.
- Almacenamiento de archivos.
- Actualizaciones en tiempo real.
- Funciones Edge.
- Seguridad mediante Row Level Security (RLS).

Este enfoque reduce significativamente la complejidad técnica respecto a un backend tradicional y permite evolucionar posteriormente hacia una arquitectura híbrida si fuese necesario.

---

<a id="114-estructura-del-proyecto"></a>

## 11.4 Estructura del Proyecto

La aplicación seguirá una organización modular basada en funcionalidades.

Ejemplo:

src/
├── app/
│   ├── navigation/
│   ├── providers/
│
├── features/
│   ├── auth/
│   ├── pets/
│   ├── reports/
│   ├── sightings/
│   ├── notifications/
│
├── components/
│
├── services/
│   ├── supabase/
│   ├── notifications/
│
├── stores/
│
├── hooks/
│
├── utils/
│
├── theme/

Esta estructura favorece:

- Separación de responsabilidades.
- Reutilización.
- Escalabilidad.
- Mantenimiento independiente de módulos.

---

<a id="115-acceso-a-datos"></a>

## 11.5 Acceso a Datos

Toda la comunicación entre la aplicación y la base de datos se realizará a través del cliente oficial de Supabase.

Las operaciones incluirán:

- Consultas.
- Inserciones.
- Actualizaciones.
- Eliminaciones.
- Suscripciones en tiempo real.

La lógica de negocio crítica podrá trasladarse progresivamente a Edge Functions cuando sea necesario.

---

<a id="116-base-de-datos"></a>

## 11.6 Base de Datos

El sistema utilizará **PostgreSQL** como única fuente de verdad para toda la información del proyecto.

La base de datos almacenará, entre otros:

- Usuarios.
- Mascotas.
- Reportes.
- Avistamientos.
- Protectoras.
- Notificaciones.
- Configuración.
- Métricas.

El modelo de datos seguirá principios de normalización para garantizar la integridad y consistencia de la información.

---

<a id="117-almacenamiento"></a>

## 11.7 Almacenamiento de Archivos

Las fotografías y documentos se almacenarán mediante **Supabase Storage**.

Entre los archivos gestionados se incluyen:

- Fotografías de mascotas.
- Fotografías de avistamientos.
- Imágenes de perfil.
- Evidencias documentales.
- Recursos públicos.

La base de datos únicamente almacenará las referencias necesarias para acceder a estos archivos.

---

<a id="118-autenticacion"></a>

## 11.8 Autenticación y Autorización

La autenticación será gestionada mediante **Supabase Auth**.

Inicialmente se permitirá:

- Registro mediante correo electrónico.
- Inicio de sesión.
- Recuperación de contraseña.
- Gestión de sesiones.

El acceso a los datos estará protegido mediante políticas **Row Level Security (RLS)**, garantizando que cada usuario únicamente pueda acceder a la información para la que dispone de permisos.

---

<a id="119-tiempo-real"></a>

## 11.9 Comunicación en Tiempo Real

BuscoHuella utilizará **Supabase Realtime** para mantener sincronizada la información entre los distintos usuarios.

Entre los eventos susceptibles de sincronización se encuentran:

- Nuevos reportes.
- Nuevos avistamientos.
- Cambios de estado.
- Reencuentros documentados.
- Actualización de estadísticas.

Este mecanismo permitirá ofrecer una experiencia más dinámica sin necesidad de realizar consultas constantes al servidor.

---

<a id="1110-notificaciones"></a>

## 11.10 Sistema de Notificaciones

Las notificaciones constituyen uno de los elementos principales del sistema.

Durante el MVP se utilizará **Expo Notifications** para el envío de notificaciones push.

Estas notificaciones podrán generarse ante eventos como:

- Nuevos avistamientos.
- Posibles coincidencias.
- Confirmaciones de recuperación.
- Cambios relevantes en un reporte.

En futuras versiones podrán incorporarse notificaciones por correo electrónico y otros canales de comunicación.

---

<a id="1111-seguridad"></a>

## 11.11 Seguridad de la Plataforma

La seguridad forma parte de la arquitectura desde las primeras fases del proyecto.

Las principales medidas incluyen:

- Row Level Security (RLS).
- Gestión segura de sesiones.
- Variables de entorno para credenciales.
- Acceso autenticado a recursos privados.
- Separación entre entornos de desarrollo y producción.
- Validación de datos en cliente y servidor.

Ninguna credencial sensible será almacenada en el repositorio del proyecto.

---

<a id="1112-principios-de-desarrollo"></a>

## 11.12 Principios de Desarrollo

El desarrollo de BuscoHuella seguirá los siguientes principios:

- Clean Code.
- SOLID.
- DRY.
- KISS.
- YAGNI.
- API First.
- Mobile First.
- Security by Design.
- Privacy by Design.
- Integración Continua (CI).
- Documentación continua.

Toda nueva funcionalidad deberá respetar estos principios antes de ser incorporada al proyecto.

---

<a id="1113-evolucion-tecnologica"></a>

## 11.13 Evolución Tecnológica

La arquitectura ha sido diseñada para evolucionar progresivamente conforme aumente la adopción de la plataforma.

Entre las posibles líneas de evolución se encuentran:

- Microservicios especializados.
- Procesamiento asíncrono mediante colas.
- Caché distribuida.
- Inteligencia Artificial para reconocimiento visual.
- API pública para terceros.
- Integraciones institucionales.
- Analítica avanzada.

Estas mejoras únicamente se abordarán cuando exista una necesidad real respaldada por métricas de uso y objetivos estratégicos del proyecto.

<a id="1114-gestion-del-estado"></a>

## 11.14 Gestión del Estado

BuscoHuella utilizará Zustand como solución principal para la gestión del estado global.

Se separarán tres tipos de estado:

### Estado global

Información compartida:

- Usuario autenticado.
- Preferencias.
- Configuración.
- Sesión.

### Estado del dominio

Información específica:

- Mascotas.
- Reportes.
- Avistamientos.
- Filtros del mapa.

### Estado local

Gestionado directamente por componentes:

- Formularios.
- Modales.
- Estados temporales.

El objetivo es evitar una complejidad innecesaria durante el MVP.

<a id="1115-capa-de-servicios"></a>

---

## 11.15 Capa de Servicios

La comunicación con servicios externos estará encapsulada mediante una capa de servicios.

Ejemplo:

services/

├── auth.service.ts
├── pets.service.ts
├── reports.service.ts
├── sightings.service.ts
├── notifications.service.ts


Los componentes nunca accederán directamente a Supabase.

La capa de servicios será responsable de:

- Consultas.
- Transformación de datos.
- Manejo de errores.
- Validaciones.
- Comunicación externa.

---

<a id="1116-componentes-ui"></a>

## 11.16 Componentes Reutilizables

Los elementos visuales comunes estarán centralizados:

components/

- Button
- Input
- Card
- Modal
- Avatar
- MapMarker
- EmptyState
- LoadingState
- ErrorState


Los componentes deberán ser:

- Independientes.
- Reutilizables.
- Testeables.
- Documentados.

---

<a id="1117-integracion-con-supabase-edge-functions"></a>

## 11.17 Integración con Supabase Edge Functions

Aunque el MVP utilizará principalmente la base de datos directa, la arquitectura está preparada para migrar lógica crítica a Supabase Edge Functions cuando sea necesario.

### Cuándo usar Edge Functions

Las funciones se utilizarán para:

- Lógica de negocio compleja.
- Procesos asíncronos.
- Operaciones que requieran más tiempo de ejecución.
- Integraciones externas.
- Seguridad adicional.

### Ejemplos en BuscoHuella

Posibles casos de uso:

- Validaciones complejas de reportes.
- Notificaciones avanzadas.
- Procesamiento de avistamientos.
- Integración con APIs externas.
- Procesamiento de imágenes.
- Generación de estadísticas.

### Estructura

Las funciones seguirán una estructura modular:

Edge Functions/

- reports.ts
- pets.ts
- sightings.ts
- notifications.ts

Cada función responderá a una responsabilidad específica.

---

<a id="1118-navegacion"></a>

## 11.18 Navegación

La navegación será gestionada mediante React Navigation.

Estructura prevista:

Auth Stack

- Login
- Registro
- Recuperar contraseña


Main Stack

- Inicio
- Mapa
- Mascotas
- Reportes
- Perfil


La navegación dependerá del estado de autenticación del usuario.

---

<a id="1119-gestion-errores"></a>

## 11.19 Gestión de Errores

La aplicación implementará una estrategia centralizada de errores.

Tipos:

- Errores de red.
- Errores de autenticación.
- Errores de permisos.
- Errores de validación.
- Errores inesperados.

Los errores deberán:

- Ser registrados.
- Mostrar mensajes comprensibles.
- Evitar pérdida de información.
- Permitir diagnóstico posterior.

---

<a id="1120-monitorizacion"></a>

## 11.20 Logging y Monitorización

La plataforma incorporará mecanismos de observabilidad:

- Logs de aplicación.
- Registro de errores.
- Métricas técnicas.
- Eventos de usuario.
- Auditoría de acciones críticas.

Futuras integraciones:

- Sentry.
- Analítica de producto.
- Dashboards operativos.

---

<a id="1121-estandares-de-desarrollo"></a>

## 11.21 Estándares de Desarrollo

### Convenciones de Código

### Convenciones de Commits

``` bash
feat: nueva funcionalidad
fix: corrección de error
docs: documentación
style: formato, sin cambios de código
refactor: refactorización
test: tests
chore: tareas de mantenimiento
```

---

<a id="1122-arquitectura-por-capas"></a>

## 11.22 Arquitectura por Capas

BuscoHuella seguirá una arquitectura basada en separación de responsabilidades:

Presentación:
- Pantallas.
- Componentes.
- Navegación.

Dominio:
- Reglas del negocio.
- Estados.
- Validaciones.

Servicios:
- Comunicación externa.
- Supabase.
- APIs.

Infraestructura:
- Configuración.
- Variables de entorno.
- Servicios externos.

--- 

<a id="1123-estrategia-de-testing"></a>

## 11.23 Estrategia de Testing

La aplicación incorporará:

- Tests unitarios.
- Tests de componentes.
- Tests de integración.
- Tests críticos de usuario.

Prioridad MVP:

1. Autenticación.
2. Creación de reportes.
3. Gestión de mascotas.
4. Recuperación de cuenta.
5. Permisos.

--- 

<a id="1124-gestion-de-entornos"></a>

## 11.24 Gestión de Entornos

Existirán tres entornos:

Development

Para desarrollo local.

Staging

Para pruebas antes de producción.

Production

Entorno real de usuarios.

Cada entorno tendrá:

- Proyecto Supabase independiente.
- Variables propias.
- Credenciales separadas.

---

<a id="1125-deploy-y-ci-cd"></a>

## 11.25 Deploy y CI/CD

Los despliegues seguirán una cadencia ágil:

- Deploy a staging tras merge en main.
- Deploy a producción tras aprobación explícita.

Se utilizarán scripts de automatización para:

- Automatización del despliegue.
- Gestión de variables de entorno.

---

<a id="12-operaciones-y-gobernanza"></a>

# 12. OPERACIONES Y GOBERNANZA

---

<a id="121-equipo-actual"></a>

## 12.1 Equipo Actual

BuscoHuella se encuentra actualmente en fase **Pre-MVP**, con una estructura inicial orientada a la validación del producto, desarrollo tecnológico y preparación del lanzamiento local.

Durante esta fase, el objetivo principal no es construir una organización compleja, sino mantener una estructura ligera que permita avanzar rápidamente, reducir costes y tomar decisiones ágiles.

La organización actual se basa en un modelo de **fundador único con apoyo de herramientas tecnológicas y colaboración puntual especializada**.

---

## Estructura actual

### Fundador / Product Owner

**Responsable: Xavier Quesada Sevillano**

Funciones principales:

- Definición de visión y estrategia del producto.
- Priorización del roadmap.
- Validación de hipótesis de negocio.
- Toma de decisiones arquitectónicas.
- Supervisión del desarrollo tecnológico.
- Gestión de documentación del proyecto.
- Definición de experiencia de usuario.
- Relación con usuarios iniciales y posibles colaboradores.
- Preparación de acuerdos con protectoras y entidades locales.

El fundador mantiene la responsabilidad final sobre:

- Producto.
- Tecnología.
- Estrategia.
- Alcance del MVP.
- Calidad de las entregas.

---

## Desarrollo Tecnológico

Durante la fase MVP, el desarrollo será realizado mediante una combinación de:

- Desarrollo propio.
- Herramientas de inteligencia artificial como apoyo.
- Documentación técnica continua.
- Automatización de procesos.

Las áreas principales incluyen:

### Frontend móvil

Responsabilidades:

- Aplicación React Native + Expo.
- Interfaces de usuario.
- Navegación.
- Gestión del estado.
- Integración con servicios backend.
- Experiencia de usuario móvil.

---

### Backend y datos

Responsabilidades:

- Configuración de Supabase.
- Diseño del modelo de datos.
- Seguridad mediante RLS.
- Gestión de autenticación.
- Reglas de negocio.
- Integraciones externas.

---

### Infraestructura

Responsabilidades:

- Control de versiones.
- Entornos de desarrollo.
- Automatización CI/CD.
- Monitorización.
- Gestión de costes técnicos.

---

## Colaboraciones previstas

Aunque inicialmente el proyecto será gestionado con una estructura reducida, se contempla la incorporación progresiva de colaboradores cuando exista una necesidad validada.

Posibles perfiles futuros:

| Perfil | Momento previsto | Necesidad |
|--------|------------------|-----------|
| Diseñador UX/UI | Tras validación inicial | Mejorar experiencia de usuario |
| Desarrollador adicional | Aumento de usuarios | Acelerar evolución del producto |
| Responsable de comunidad | Crecimiento local | Gestionar usuarios y colaboradores |
| Especialista legal | Antes del lanzamiento público | Revisar cumplimiento normativo |
| Responsable de alianzas | Fase de expansión | Gestionar protectoras y municipios |

---

## Principios organizativos

La estructura de equipo seguirá los siguientes principios:

### 1. Simplicidad

No se crearán roles innecesarios antes de existir una necesidad real.

---

### 2. Responsabilidad clara

Cada área crítica deberá tener un responsable identificado.

---

### 3. Prioridad al producto

Los recursos estarán enfocados principalmente en:

- Resolver el problema principal.
- Mejorar la tasa de recuperación de mascotas.
- Validar la utilidad real de la plataforma.

---

### 4. Escalado progresivo

El equipo crecerá únicamente cuando:

- Exista tracción demostrada.
- Las métricas del MVP lo justifiquen.
- El crecimiento requiera mayor capacidad operativa.

---

## Modelo operativo durante el MVP

Durante la fase inicial, BuscoHuella funcionará bajo un modelo:

**Founder-led + AI Assisted Development**

Donde:

- El fundador mantiene la visión y dirección del producto.
- La inteligencia artificial actúa como herramienta de productividad.
- La documentación funciona como sistema de transferencia de conocimiento.
- Las decisiones importantes quedan registradas.

---

## Objetivo de esta fase

El objetivo del equipo durante el MVP no es crear una estructura empresarial completa.

El objetivo es demostrar:

- Que existe un problema real.
- Que la solución aporta valor.
- Que los usuarios participan.
- Que el modelo puede escalar.

Una vez validada esta fase, la estructura organizativa evolucionará en función de las necesidades reales del proyecto.

> **Regla del proyecto:** El equipo debe crecer cuando el producto lo necesite, no antes.

---

<a id="122-escalado-de-equipo"></a>

## 12.2 Escalado de Equipo

El crecimiento del equipo de BuscoHuella seguirá una estrategia progresiva basada en necesidades reales del producto y no en previsiones teóricas.

El objetivo es mantener una estructura eficiente durante las primeras fases, evitando aumentar costes antes de disponer de validación suficiente.

El equipo evolucionará conforme aumenten:

- Usuarios activos.
- Reportes gestionados.
- Necesidades operativas.
- Complejidad tecnológica.
- Colaboraciones institucionales.

---

# Principios de escalado

El crecimiento del equipo seguirá los siguientes principios:

## 1. Contratar por necesidad, no por anticipación

Cada nueva incorporación deberá responder a un problema concreto:

- Falta de capacidad operativa.
- Necesidad de conocimiento especializado.
- Aumento significativo de usuarios.
- Nuevos mercados o funcionalidades.

---

## 2. Mantener una estructura ligera

Durante las primeras fases se priorizará:

- Automatización.
- Herramientas digitales.
- Procesos documentados.
- Uso eficiente de recursos.

---

## 3. Incorporaciones orientadas a impacto

Cada nuevo miembro deberá contribuir directamente a uno de estos objetivos:

- Más mascotas recuperadas.
- Mejor experiencia de usuario.
- Mayor adopción.
- Mayor estabilidad del sistema.
- Mayor capacidad de crecimiento.

---

# Fases previstas de crecimiento

## Fase 0 — Pre-MVP

### Situación actual

**Equipo:**

- Fundador / Product Owner.
- Desarrollo asistido mediante herramientas de IA.
- Colaboraciones puntuales externas.

### Objetivo

Construir y validar el producto inicial.

### Prioridades:

- Desarrollo del MVP.
- Validación con usuarios reales.
- Preparación del lanzamiento local.
- Creación de comunidad inicial.

---

# Fase 1 — MVP Validado (0-500 usuarios)

## Equipo objetivo

Estructura mínima:

| Rol | Responsabilidad |
|-----|-----------------|
| Founder / Product Owner | Dirección estratégica y producto |
| Desarrollo Full Stack / Mobile | Evolución técnica |
| Soporte y comunidad parcial | Atención a usuarios |

### Objetivo

Mantener la plataforma operativa mientras se valida la propuesta de valor.

---

# Fase 2 — Crecimiento Local (500-5.000 usuarios)

## Equipo objetivo

Posibles incorporaciones:

| Rol | Responsabilidad |
|-----|-----------------|
| Mobile Developer | Nuevas funcionalidades y mantenimiento |
| Backend Developer | Escalabilidad y servicios internos |
| Community Manager | Usuarios, campañas y comunidad |
| Responsable de alianzas | Protectoras y entidades locales |

### Necesidades principales:

- Mejorar soporte.
- Gestionar mayor volumen de reportes.
- Crear relaciones institucionales.
- Optimizar procesos internos.

---

# Fase 3 — Expansión Regional

## Equipo objetivo

Consolidación de áreas:

### Producto

Responsabilidades:

- Roadmap.
- Investigación de usuarios.
- Métricas.
- Experiencia de usuario.

---

### Tecnología

Responsabilidades:

- Arquitectura.
- Seguridad.
- Infraestructura.
- Rendimiento.

Posibles perfiles:

- Backend Engineer.
- Mobile Engineer.
- DevOps.

---

### Operaciones

Responsabilidades:

- Gestión de comunidades locales.
- Formación de colaboradores.
- Atención de incidencias.

---

### Alianzas

Responsabilidades:

- Protectoras.
- Veterinarios.
- Ayuntamientos.
- Organizaciones colaboradoras.

---

# Fase 4 — Escala Nacional

En caso de validación completa del modelo, la estructura podrá evolucionar hacia una organización más especializada.

Áreas previstas:

## Dirección

- CEO / Dirección general.
- Estrategia.
- Financiación.
- Relaciones institucionales.

---

## Producto

- Product Managers.
- UX/UI Designers.
- Analistas de producto.

---

## Tecnología

- Arquitectura.
- Backend.
- Mobile.
- Infraestructura.
- Seguridad.

---

## Operaciones

- Comunidad.
- Soporte.
- Moderación.
- Calidad.

---

## Desarrollo de negocio

- Partnerships.
- Empresas colaboradoras.
- Administraciones públicas.

---

# Criterios para nuevas incorporaciones

Antes de incorporar un nuevo perfil deberán evaluarse:

| Criterio | Pregunta |
|----------|----------|
| Necesidad | ¿Existe un problema que resolver? |
| Impacto | ¿Mejorará una métrica importante? |
| Coste | ¿Es sostenible económicamente? |
| Prioridad | ¿Es más importante que otras inversiones? |
| Alternativas | ¿Puede resolverse mediante automatización? |

---

# Automatización antes que contratación

Antes de aumentar equipo se priorizarán soluciones como:

- Automatización de procesos repetitivos.
- Herramientas de inteligencia artificial.
- Sistemas de autoservicio.
- Documentación interna.
- Paneles de métricas.

---

# Objetivo final

BuscoHuella no busca crear un equipo grande, sino construir un equipo eficiente capaz de maximizar el impacto social del proyecto.

El crecimiento del equipo deberá estar siempre alineado con la misión principal:

> **Aumentar las probabilidades de recuperación de mascotas perdidas mediante tecnología y colaboración ciudadana.**

> **Regla del proyecto:** Primero demostrar tracción. Después construir estructura.

---

<a id="123-recursos-economicos"></a>

## 12.3 Recursos Económicos

BuscoHuella seguirá una estrategia financiera basada en la eficiencia, el control de costes y la sostenibilidad progresiva.

Durante la fase inicial del proyecto, la prioridad no será maximizar ingresos, sino validar que la plataforma resuelve un problema real y puede operar con una estructura económica sostenible.

El objetivo es construir un producto con capacidad de crecimiento sin asumir costes innecesarios antes de disponer de validación suficiente.

---

# Principios financieros

La gestión económica del proyecto seguirá los siguientes principios:

## 1. Control estricto de costes

Durante el MVP se mantendrá una estructura operativa reducida.

Se priorizarán:

- Servicios con planes gratuitos o bajo coste.
- Infraestructura escalable bajo demanda.
- Herramientas con buena relación coste/valor.
- Automatización de tareas repetitivas.

---

## 2. Inversión orientada a validación

Los recursos económicos disponibles se dedicarán principalmente a:

- Desarrollo del producto.
- Infraestructura tecnológica.
- Seguridad.
- Captación inicial de usuarios.
- Validación con la comunidad.
- Aspectos legales necesarios.

---

## 3. Evitar gastos prematuros

No se realizarán inversiones significativas en:

- Equipos grandes.
- Oficinas.
- Marketing masivo.
- Funcionalidades no validadas.
- Infraestructura sobredimensionada.

---

# Situación económica inicial

Durante la fase Pre-MVP, BuscoHuella funcionará bajo un modelo de inversión inicial reducida.

Las principales aportaciones serán:

- Tiempo del fundador.
- Desarrollo propio.
- Herramientas tecnológicas.
- Recursos digitales de bajo coste.

El objetivo es alcanzar la validación inicial minimizando la necesidad de capital externo.

---

# Categorías principales de costes

## 1. Infraestructura tecnológica

Incluye:

- Base de datos.
- Hosting.
- Almacenamiento.
- Servicios externos.
- Monitorización.
- Dominios.

Objetivo inicial:

```text
Mantener costes inferiores a 50 €/mes durante el MVP.
```

---

## 2. Desarrollo

Incluye:

- Herramientas de desarrollo.
- Servicios de integración.
- Licencias necesarias.
- Servicios de testing.

Durante la primera fase se priorizará:

- Desarrollo propio.
- Automatización.
- Herramientas de productividad.

---

## 3. Operaciones

Incluye:

- Gestión de usuarios.
- Soporte.
- Comunicación.
- Moderación.

Inicialmente estas tareas serán asumidas por el fundador.

---

## 4. Legal y cumplimiento

Incluye:

- Revisión legal.
- Protección de datos.
- Documentación necesaria.
- Adaptación normativa.

Este apartado tendrá especial importancia antes del lanzamiento público.

---

## 5. Adquisición de usuarios

Durante el MVP la captación se realizará principalmente mediante:

- Comunidad local.
- Redes sociales.
- Colaboraciones.
- Protectoras.
- Difusión orgánica.

La inversión publicitaria será limitada hasta validar canales efectivos.

---

# Presupuesto operativo estimado MVP

| Categoría | Objetivo mensual |
|-----------|----------------:|
| Infraestructura tecnológica | < 50 € |
| Herramientas software | < 50 € |
| Servicios externos | Variable |
| Marketing inicial | Bajo coste |
| Legal | Según necesidad |
| Operaciones | Principalmente fundador |

---

# Fuentes futuras de financiación

Una vez validada la propuesta de valor, BuscoHuella podrá explorar diferentes vías:

---

## Financiación propia

Posibles fuentes:

- Reinversión de ingresos.
- Aportaciones del fundador.

---

## Subvenciones y ayudas

Posibles vías:

- Programas de innovación.
- Ayudas al emprendimiento.
- Proyectos de impacto social.
- Iniciativas relacionadas con bienestar animal.

---

## Inversión externa

Podrá evaluarse cuando exista:

- Tracción demostrada.
- Métricas positivas.
- Modelo escalable.
- Necesidad clara de aceleración.

---

## Colaboraciones estratégicas

Posibles acuerdos con:

- Empresas del sector animal.
- Protectoras.
- Ayuntamientos.
- Organizaciones sociales.

---

# Criterios antes de aceptar financiación externa

Cualquier financiación deberá cumplir:

- Mantener la misión principal del proyecto.
- No comprometer la independencia estratégica.
- No introducir presión para desarrollar funcionalidades innecesarias.
- Acelerar objetivos ya validados.

---

# Métricas económicas de seguimiento

Durante el MVP se monitorizarán:

| Métrica | Objetivo |
|---------|----------|
| Coste mensual infraestructura | < 50 € |
| Coste por usuario activo | < 0,50 €/mes |
| Coste adquisición usuario | Medición inicial |
| Tiempo dedicado a soporte | Optimización progresiva |
| Dependencia de servicios externos | Minimizada |

---

# Objetivo financiero

El objetivo inicial de BuscoHuella no es generar beneficios inmediatos.

El objetivo es demostrar que:

- Puede operar con costes reducidos.
- Puede generar impacto medible.
- Puede crecer de forma sostenible.
- Puede alcanzar un modelo económico viable.

> **Regla del proyecto:** Cada euro invertido debe aumentar la probabilidad de recuperar más mascotas.

---

<a id="124-sla-del-mvp"></a>

## 12.4 SLA del MVP

El Service Level Agreement (SLA) del MVP define los compromisos mínimos de disponibilidad, mantenimiento y respuesta operativa durante la fase inicial de BuscoHuella.

El objetivo del SLA no es garantizar niveles propios de una plataforma empresarial a gran escala, sino establecer unas expectativas claras y realistas para una fase de validación.

Durante el MVP se priorizará:

- Mantener el servicio operativo.
- Resolver incidencias críticas rápidamente.
- Proteger los datos de los usuarios.
- Garantizar la continuidad del flujo principal del producto.

---

# Objetivos del SLA

El MVP deberá cumplir los siguientes objetivos:

- Mantener una disponibilidad suficiente para los usuarios iniciales.
- Detectar y resolver errores críticos.
- Evitar interrupciones prolongadas del servicio.
- Mantener una comunicación transparente ante incidencias.

---

# Disponibilidad del servicio

Durante la fase MVP se establece como objetivo:

| Métrica | Objetivo |
|---------|----------|
| Disponibilidad mensual objetivo | ≥ 99 % |
| Tiempo máximo de caída no planificada | < 4 horas/mes |
| Mantenimiento planificado | Comunicación previa cuando sea posible |

---

# Clasificación de incidencias

Las incidencias se clasificarán según su impacto en el usuario.

---

## Prioridad P1 — Crítica

### Definición

Incidencia que impide utilizar una funcionalidad principal del producto.

Ejemplos:

- Imposibilidad de iniciar sesión.
- Caída completa de la aplicación.
- Pérdida de acceso a reportes activos.
- Fallos que impidan publicar una mascota perdida.

### Objetivo de respuesta:

- Detección: inmediata mediante monitorización o aviso.
- Inicio de análisis: < 2 horas.
- Resolución objetivo: máximo 24 horas.

---

## Prioridad P2 — Alta

### Definición

Funcionalidad importante afectada, pero existe una alternativa temporal.

Ejemplos:

- Problemas con notificaciones.
- Errores en creación de reportes.
- Fallos parciales del mapa.
- Problemas de sincronización.

### Objetivo de respuesta:

- Inicio de análisis: < 24 horas.
- Resolución objetivo: < 72 horas.

---

## Prioridad P3 — Media

### Definición

Errores que afectan parcialmente a la experiencia, pero no bloquean el uso principal.

Ejemplos:

- Problemas visuales.
- Errores menores de interfaz.
- Mensajes incorrectos.

### Objetivo de respuesta:

- Registro de incidencia.
- Planificación dentro del siguiente ciclo de desarrollo.

---

## Prioridad P4 — Baja

### Definición

Mejoras, sugerencias o problemas menores.

Ejemplos:

- Cambios estéticos.
- Nuevas funcionalidades.
- Mejoras de experiencia.

### Objetivo:

Evaluación dentro del roadmap del producto.

---

# Mantenimiento del sistema

Durante el MVP se realizarán tareas periódicas de mantenimiento:

## Mantenimiento técnico

Incluye:

- Actualización de dependencias.
- Revisión de seguridad.
- Optimización de rendimiento.
- Limpieza de código.
- Revisión de logs.

---

## Mantenimiento de datos

Incluye:

- Revisión de integridad.
- Control de errores.
- Supervisión del almacenamiento.
- Gestión de copias de seguridad.

---

# Copias de seguridad

La estrategia inicial será:

- Backups gestionados mediante la infraestructura de Supabase.
- Revisión periódica de recuperación.
- Protección frente a pérdida accidental de información.

Los datos críticos del sistema deberán poder recuperarse ante fallos técnicos.

---

# Monitorización

Durante el MVP se monitorizarán:

## Métricas técnicas

- Disponibilidad.
- Errores de aplicación.
- Tiempo de respuesta.
- Consumo de infraestructura.
- Fallos de servicios externos.

---

## Métricas de producto

- Usuarios activos.
- Reportes creados.
- Avistamientos registrados.
- Notificaciones enviadas.
- Reencuentros conseguidos.

---

# Gestión de cambios

Toda modificación relevante deberá seguir un proceso mínimo:

1. Identificación de necesidad.
2. Evaluación de impacto.
3. Desarrollo.
4. Pruebas.
5. Despliegue.
6. Verificación posterior.

Los cambios que puedan afectar a recorridos críticos del usuario tendrán prioridad de validación.

---

# Ventanas de mantenimiento

Cuando sea necesario realizar mantenimiento:

- Se intentará realizar fuera de horarios de mayor uso.
- Se minimizará el impacto sobre usuarios.
- Se informará previamente cuando sea posible.

---

# Limitaciones del SLA durante el MVP

Debido a la naturaleza inicial del proyecto:

- No existe soporte 24/7.
- Los tiempos pueden variar según disponibilidad del equipo.
- Las prioridades podrán modificarse según impacto real.
- Nuevas funcionalidades no tendrán prioridad sobre estabilidad.

---

# Principio operativo

Durante el MVP la prioridad será garantizar los recorridos críticos:

1. Registrar usuario.
2. Registrar mascota.
3. Publicar pérdida.
4. Recibir avistamientos.
5. Facilitar el reencuentro.

Cualquier incidencia que afecte a estos procesos tendrá máxima prioridad.

> **Regla del proyecto:** Una nueva funcionalidad nunca tendrá prioridad sobre mantener operativo el camino que permite recuperar una mascota.

---

<a id="125-desarrollo-asistido-por-ia"></a>

## 12.5 Desarrollo Asistido por IA

BuscoHuella utilizará herramientas de inteligencia artificial como apoyo al proceso de desarrollo, documentación y gestión del proyecto.

La inteligencia artificial se considera una herramienta de productividad que permite acelerar tareas, mejorar la calidad del código y reducir tiempos de desarrollo, pero no sustituye la toma de decisiones humanas ni la responsabilidad técnica del proyecto.

---

# Principios de uso de IA

El uso de inteligencia artificial seguirá los siguientes principios:

## 1. La IA como asistente, no como responsable

La inteligencia artificial podrá ayudar en:

- Generación de código.
- Revisión técnica.
- Documentación.
- Análisis de errores.
- Propuestas de arquitectura.
- Creación de pruebas.
- Optimización de procesos.

Las decisiones finales siempre serán revisadas y aprobadas por el responsable del proyecto.

---

## 2. Validación obligatoria

Todo contenido generado mediante IA deberá ser validado antes de incorporarse al proyecto.

La validación incluirá:

- Revisión funcional.
- Revisión de seguridad.
- Pruebas técnicas.
- Comprobación de compatibilidad.
- Evaluación del impacto arquitectónico.

---

## 3. Mantener la calidad del código

El uso de IA no deberá provocar:

- Código innecesariamente complejo.
- Dependencias sin justificar.
- Falta de documentación.
- Deuda técnica evitable.
- Pérdida de comprensión del sistema.

La prioridad seguirá siendo:

> Código simple, mantenible y comprendido por el equipo.

---

# Áreas donde se utilizará IA

## Desarrollo de software

La IA podrá utilizarse para:

- Crear estructuras iniciales de código.
- Proponer implementaciones.
- Detectar errores.
- Explicar código existente.
- Generar tests.
- Realizar refactorizaciones.

---

## Documentación técnica

La IA podrá ayudar en:

- Creación de documentación.
- Mantenimiento del Documento Maestro.
- Generación de guías internas.
- Resumen de decisiones técnicas.

Toda documentación oficial deberá ser revisada antes de considerarse definitiva.

---

## Análisis y planificación

La IA podrá utilizarse para:

- Evaluar alternativas técnicas.
- Analizar riesgos.
- Proponer mejoras.
- Revisar requisitos.
- Ayudar en la priorización del roadmap.

---

## Atención y operaciones futuras

En fases posteriores podrá utilizarse IA para:

- Asistentes internos.
- Automatización de soporte.
- Clasificación de incidencias.
- Análisis de datos.
- Mejora de procesos.

---

# Restricciones de uso

La IA no deberá utilizarse para:

- Tomar decisiones estratégicas automáticamente.
- Acceder a datos sensibles sin autorización.
- Sustituir revisiones de seguridad.
- Publicar código sin validación.
- Introducir funcionalidades fuera del alcance definido.

---

# Seguridad y privacidad

El uso de herramientas de IA deberá respetar:

- Protección de datos personales.
- Confidencialidad del proyecto.
- Seguridad de credenciales.
- Buenas prácticas de desarrollo.

Nunca deberán enviarse a servicios externos:

- Contraseñas.
- Claves privadas.
- Tokens de producción.
- Información personal identificable de usuarios.
- Datos sensibles de mascotas o propietarios.

---

# Flujo recomendado de trabajo con IA

El proceso recomendado será:

```text
Necesidad
    │
    ▼
Análisis del problema
    │
    ▼
Consulta a IA
    │
    ▼
Evaluación de propuesta
    │
    ▼
Implementación
    │
    ▼
Pruebas
    │
    ▼
Revisión humana
    │
    ▼
Integración en proyecto
```

---

---

# Documentación de decisiones asistidas por IA

Las decisiones relevantes generadas con ayuda de inteligencia artificial deberán quedar documentadas cuando tengan impacto sobre aspectos críticos del proyecto.

Se deberán registrar especialmente aquellas decisiones relacionadas con:

- Arquitectura del sistema.
- Seguridad.
- Modelo de datos.
- Experiencia de usuario.
- Procesos críticos del negocio.
- Cambios estructurales importantes.

El objetivo es mantener trazabilidad sobre las decisiones tomadas, conocer su contexto y facilitar futuras revisiones del proyecto.

---

# Ventajas esperadas

El uso adecuado de inteligencia artificial permitirá:

- Reducir tiempos de desarrollo.
- Aumentar la productividad del equipo.
- Mejorar la calidad de la documentación.
- Detectar problemas potenciales antes de la implementación.
- Facilitar la evolución y mantenimiento del producto.
- Acelerar procesos de análisis y validación.

La IA será utilizada como herramienta de apoyo, no como sustituto del criterio técnico y estratégico.

---

# Riesgos a controlar

El uso de inteligencia artificial también implica riesgos que deberán gestionarse correctamente.

| Riesgo | Mitigación |
|--------|------------|
| Código incorrecto o poco mantenible | Revisión humana y testing obligatorio antes de integrar cambios. |
| Dependencia excesiva de herramientas externas | Mantener conocimiento interno del sistema y comprender las decisiones adoptadas. |
| Problemas de seguridad | Validar cualquier código generado antes de incorporarlo al proyecto. |
| Decisiones arquitectónicas incorrectas | Seguir los principios definidos en la arquitectura del proyecto. |
| Información incorrecta o desactualizada | Verificación humana antes de aplicar recomendaciones. |

---

# Principio final

La inteligencia artificial será utilizada como una ventaja competitiva para acelerar el desarrollo de BuscoHuella, mejorar la productividad y aumentar la capacidad de innovación.

Sin embargo, todas las decisiones importantes deberán mantener supervisión humana y alinearse con los objetivos estratégicos del proyecto.

> **Regla del proyecto:** La IA puede acelerar la construcción, pero la responsabilidad sobre las decisiones sigue perteneciendo al equipo.

---

<a id="126-impacto-social"></a>

## 12.6 Impacto Social

BuscoHuella nace como un proyecto tecnológico con una misión principal de impacto social: **aumentar las probabilidades de recuperación de mascotas perdidas mediante la colaboración ciudadana, la tecnología y la información geolocalizada**.

El éxito del proyecto no se medirá únicamente por métricas económicas o de crecimiento, sino por la capacidad de generar un beneficio real para propietarios, animales y comunidades locales.

---

# Propósito de impacto

El impacto principal esperado de BuscoHuella es reducir el tiempo necesario para localizar una mascota perdida y mejorar la coordinación entre las personas involucradas en una búsqueda.

La plataforma pretende transformar una situación de incertidumbre y urgencia en un proceso organizado, colaborativo y medible.

---

# Beneficiarios principales

## Propietarios de mascotas

BuscoHuella permitirá:

- Disponer de una herramienta rápida para iniciar una búsqueda.
- Aumentar la visibilidad de una mascota perdida.
- Recibir posibles avistamientos de la comunidad.
- Coordinar esfuerzos de recuperación.
- Reducir la sensación de aislamiento durante la pérdida.

---

## Mascotas

El beneficio principal para los animales será:

- Aumentar las probabilidades de reencuentro con sus familias.
- Reducir el tiempo en situación de pérdida.
- Facilitar la identificación mediante información compartida.
- Mejorar la colaboración entre ciudadanos y entidades especializadas.

---

## Ciudadanos colaboradores

La plataforma permitirá que cualquier persona pueda participar activamente mediante:

- Comunicación de avistamientos.
- Difusión de casos cercanos.
- Ayuda durante búsquedas locales.
- Colaboración con propietarios y entidades.

El objetivo es convertir a la comunidad en una red de apoyo activa.

---

## Protectoras y entidades colaboradoras

BuscoHuella proporcionará herramientas para:

- Mejorar la coordinación de casos.
- Aumentar la visibilidad de animales encontrados.
- Participar en recuperaciones.
- Obtener información estadística sobre necesidades locales.

---

# Impacto local inicial

Durante la fase MVP el impacto será medido principalmente a nivel local.

La estrategia inicial será concentrar esfuerzos en una zona geográfica limitada para conseguir:

- Mayor densidad de usuarios.
- Más probabilidad de coincidencias.
- Mayor velocidad de respuesta.
- Mejor aprendizaje del comportamiento de los usuarios.

El objetivo no será estar presente en todo el territorio desde el inicio, sino demostrar eficacia en una comunidad concreta.

---

# Indicadores de impacto social

Durante el MVP se monitorizarán indicadores como:

| Indicador | Objetivo inicial |
|-----------|------------------|
| Mascotas registradas | 100 |
| Reportes reales publicados | 50 |
| Avistamientos registrados | 25 |
| Reencuentros documentados | 5 |
| Usuarios colaboradores activos | Medición progresiva |
| Tiempo medio hasta primer avistamiento | Reducir progresivamente |

---

# Principios de impacto

BuscoHuella seguirá los siguientes principios:

- Priorizar siempre el bienestar animal.
- Facilitar el acceso gratuito a las funciones esenciales.
- Evitar barreras económicas durante situaciones de emergencia.
- Promover la colaboración ciudadana.
- Proteger la privacidad de los usuarios.
- Medir el impacto generado mediante datos reales.

---

# Impacto a largo plazo

Si el modelo es validado, BuscoHuella podrá contribuir a:

- Crear comunidades locales más conectadas.
- Mejorar la colaboración entre ciudadanos y entidades.
- Generar datos útiles para la protección animal.
- Ayudar a administraciones en la gestión de incidencias.
- Convertirse en una infraestructura digital de apoyo para la recuperación de mascotas.

---

# Principio final

El crecimiento de BuscoHuella deberá estar siempre condicionado por el impacto generado.

La tecnología será un medio para conseguir un objetivo superior: **que más mascotas vuelvan a casa.**

> **Regla del proyecto:** El éxito de BuscoHuella no se medirá únicamente por usuarios registrados, sino por las mascotas recuperadas gracias a la plataforma.

---

<a id="127-gobernanza-del-producto"></a>

## 12.7 Gobernanza del Producto

La gobernanza de BuscoHuella define los principios, procesos y criterios utilizados para tomar decisiones sobre la evolución del producto.

El objetivo es garantizar que cada decisión mantenga la alineación con la misión principal del proyecto:

> **Aumentar las probabilidades de recuperación de mascotas perdidas mediante tecnología y colaboración ciudadana.**

La gobernanza permitirá evitar decisiones impulsivas, reducir la complejidad innecesaria y mantener el foco durante todas las fases de evolución del producto.

---

# Principios de gobernanza

Todas las decisiones estratégicas y técnicas deberán respetar los siguientes principios:

## 1. Misión antes que funcionalidades

Toda nueva funcionalidad deberá responder a una pregunta principal:

```text
¿Aumenta realmente la probabilidad de recuperar una mascota perdida?
Si la respuesta es negativa o no está demostrada, deberá posponerse.
```

## 2. Datos antes que opiniones

Las decisiones importantes deberán basarse en:

- Métricas de uso.
- Feedback de usuarios.
- Resultados de experimentos.
- Datos operativos.
- Evidencias reales.

Las opiniones personales no deberán sustituir a la validación del usuario.

---

## 3. Simplicidad antes que complejidad

Durante el MVP se priorizarán soluciones:

- Simples.
- Mantenibles.
- Rápidas de implementar.
- Fáciles de entender.

La complejidad únicamente estará justificada cuando aporte un valor demostrado.

---

## 4. Calidad antes que velocidad

No se priorizará publicar rápidamente una funcionalidad si puede comprometer:

- Seguridad.
- Experiencia de usuario.
- Estabilidad del sistema.
- Recorridos críticos del usuario.

---

# Toma de decisiones

Las decisiones relevantes del proyecto deberán considerar los siguientes criterios:

| Criterio | Evaluación |
|----------|------------|
| Impacto en la misión | ¿Ayuda a recuperar más mascotas? |
| Valor para el usuario | ¿Resuelve un problema real? |
| Complejidad técnica | ¿Cuál es el coste de implementación? |
| Mantenimiento futuro | ¿Aumenta la carga operativa? |
| Riesgo | ¿Puede afectar negativamente al producto? |
| Prioridad estratégica | ¿Encaja con la fase actual? |

---

# Niveles de decisión

## Decisiones estratégicas

Incluyen:

- Cambio de modelo de negocio.
- Cambio de público objetivo.
- Nuevas líneas de producto.
- Expansión geográfica.
- Acuerdos estratégicos.

Estas decisiones requieren análisis previo y documentación.

---

## Decisiones de producto

Incluyen:

- Nuevas funcionalidades.
- Cambios importantes de experiencia de usuario.
- Modificaciones del flujo principal.
- Priorización del roadmap.

Deberán justificarse mediante:

- Impacto esperado.
- Coste de implementación.
- Riesgo asociado.
- Alineación con la misión del producto.

---

## Decisiones técnicas

Incluyen:

- Cambios arquitectónicos.
- Cambios de infraestructura.
- Nuevas dependencias.
- Modificaciones del modelo de datos.

Deberán respetar los principios definidos en la arquitectura del proyecto.

---

# Registro de decisiones

Las decisiones relevantes deberán quedar registradas mediante documentación específica.

Cada decisión importante debería incluir:

| Campo | Descripción |
|-------|-------------|
| Fecha | Momento en el que se toma la decisión. |
| Contexto | Situación que origina la decisión. |
| Problema identificado | Necesidad o dificultad detectada. |
| Alternativas consideradas | Opciones evaluadas antes de decidir. |
| Decisión tomada | Solución seleccionada. |
| Motivo | Justificación de la elección. |
| Impacto esperado | Resultado previsto. |
| Riesgos asociados | Posibles efectos negativos. |

---

## Ejemplo de decisión documentada

```text
Decisión:
Adoptar Supabase como Backend as a Service durante el MVP.

Motivo:
Reducir complejidad inicial y acelerar la validación del producto.

Impacto:
Menor tiempo de desarrollo y menor coste operativo.
```

---

# Revisión de decisiones

Las decisiones podrán revisarse cuando:

- Aparezcan nuevos datos.
- Cambien las necesidades del proyecto.
- Existan métricas suficientes para evaluar resultados.
- La arquitectura actual limite el crecimiento.

Revisar una decisión no significa que fuera incorrecta, sino que el contexto puede haber cambiado.

---

# Gobernanza durante el MVP

Durante la fase MVP:

- El fundador actuará como Product Owner.
- Las decisiones deberán priorizar validación sobre crecimiento.
- El alcance estará protegido frente a desviaciones.
- Las nuevas funcionalidades deberán justificar su necesidad.

La velocidad de aprendizaje será más importante que la cantidad de funcionalidades desarrolladas.

---

# Principio final

La gobernanza de BuscoHuella existe para proteger la misión del proyecto y garantizar que cada recurso invertido tenga un impacto real.

> **Regla del proyecto:** No se desarrollará aquello que pueda construirse; se desarrollará aquello que aporte valor demostrado.

---

<a id="128-regla-de-supervivencia-del-proyecto"></a>

## 12.8 Regla de Supervivencia del Proyecto

BuscoHuella debe desarrollarse bajo un principio fundamental: **garantizar la continuidad del proyecto antes de buscar crecimiento acelerado**.

La prioridad durante las primeras fases será construir una base sólida, validar el producto y asegurar que los recursos disponibles se utilizan de forma eficiente.

El objetivo es evitar decisiones que puedan comprometer la viabilidad del proyecto a largo plazo.

---

# Principio de supervivencia

La supervivencia de BuscoHuella dependerá de mantener un equilibrio entre:

- Valor generado para los usuarios.
- Costes operativos.
- Capacidad de desarrollo.
- Complejidad técnica.
- Ritmo de crecimiento.

El proyecto deberá crecer de forma sostenible, evitando depender de recursos externos antes de demostrar una necesidad real.

---

# Reglas fundamentales

## 1. No crecer más rápido que la capacidad operativa

El crecimiento deberá estar acompañado de:

- Capacidad técnica suficiente.
- Soporte adecuado.
- Infraestructura preparada.
- Procesos definidos.

Un crecimiento descontrolado puede perjudicar la experiencia del usuario y la confianza en la plataforma.

---

## 2. Priorizar la misión frente a la expansión

Antes de ampliar alcance geográfico o funcionalidades será necesario demostrar:

- Uso real del producto.
- Valor generado.
- Capacidad de operación.
- Impacto medible.

La expansión no será un objetivo por sí mismo, sino una consecuencia de una validación correcta.

---

## 3. Proteger los recursos disponibles

Cada recurso invertido deberá evaluarse considerando:

- Impacto esperado.
- Coste asociado.
- Riesgo.
- Prioridad estratégica.

Se evitarán inversiones que no aumenten directamente la probabilidad de éxito del proyecto.

---

## 4. Evitar dependencia prematura

BuscoHuella deberá evitar depender excesivamente de:

- Financiación externa.
- Proveedores críticos.
- Herramientas cerradas.
- Personas concretas.

Siempre que sea posible se mantendrá capacidad de adaptación y control sobre los elementos fundamentales del proyecto.

---

# Señales de alerta

El proyecto deberá revisar su estrategia si aparecen situaciones como:

| Señal | Acción recomendada |
|-------|-------------------|
| Costes creciendo sin aumento de valor | Revisar gastos y prioridades. |
| Muchas funcionalidades sin usuarios activos | Volver al núcleo del MVP. |
| Baja participación de la comunidad | Revisar propuesta de valor. |
| Dependencia excesiva de terceros | Buscar alternativas o reducir dependencia. |
| Falta de capacidad operativa | Reducir alcance temporalmente. |

---

# Prioridad en momentos críticos

Si el proyecto debe elegir entre varias opciones, la prioridad será:

1. Mantener el servicio funcionando.
2. Proteger los datos de usuarios.
3. Garantizar los recorridos críticos.
4. Mantener la confianza de la comunidad.
5. Continuar mejorando progresivamente.

Las funcionalidades secundarias podrán retrasarse si es necesario.

---

# Regla de reducción de alcance

Si los recursos disponibles no permiten mantener el ritmo previsto, se reducirá:

- Número de funcionalidades.
- Velocidad de desarrollo.
- Alcance geográfico.
- Complejidad técnica.

Nunca se reducirá:

- Seguridad.
- Privacidad.
- Integridad de los datos.
- Funcionamiento del núcleo del producto.

---

# Principio final

La prioridad de BuscoHuella no es crecer rápidamente, sino construir una plataforma útil, sostenible y capaz de mantenerse en el tiempo.

> **Regla del proyecto:** Primero asegurar la supervivencia del producto; después acelerar el crecimiento.

---

<a id="129-matriz-de-decision"></a>

## 12.9 Matriz de Decisión

La matriz de decisión de BuscoHuella establece un sistema objetivo para evaluar nuevas ideas, funcionalidades, cambios técnicos y decisiones estratégicas.

Su objetivo es evitar decisiones basadas únicamente en intuición y garantizar que cada acción esté alineada con la misión principal del proyecto.

> **Principio:** Una buena idea no siempre es una buena decisión para la fase actual del producto.

---

# Objetivo de la matriz

Antes de aprobar cualquier cambio relevante deberá evaluarse:

- Valor aportado al usuario.
- Impacto en la misión.
- Coste de implementación.
- Riesgo asociado.
- Complejidad futura.
- Momento adecuado dentro del roadmap.

La matriz ayudará a decidir si una iniciativa debe:

- Aprobarse.
- Posponerse.
- Revisarse.
- Rechazarse.

---

# Criterios de evaluación

Cada propuesta será evaluada según los siguientes criterios:

| Criterio | Pregunta clave | Puntuación |
|----------|----------------|------------|
| Impacto en la misión | ¿Ayuda a recuperar más mascotas? | 1-5 |
| Valor para el usuario | ¿Resuelve un problema real? | 1-5 |
| Urgencia | ¿Existe una necesidad inmediata? | 1-5 |
| Facilidad de implementación | ¿Puede desarrollarse con recursos actuales? | 1-5 |
| Coste de mantenimiento | ¿Genera carga operativa futura? | 1-5 |
| Riesgo técnico | ¿Puede comprometer el sistema? | 1-5 |
| Alineación estratégica | ¿Encaja con la fase actual? | 1-5 |

---

# Interpretación de puntuación

| Resultado | Decisión |
|-----------|----------|
| 30-35 puntos | Prioridad alta. Puede entrar en desarrollo. |
| 20-29 puntos | Evaluar dependencia y momento adecuado. |
| 10-19 puntos | Posponer hasta disponer de más información. |
| <10 puntos | No alineado con la estrategia actual. |

---

# Reglas especiales del MVP

Durante la fase MVP tendrán prioridad absoluta las iniciativas relacionadas con:

- Registro de usuarios.
- Gestión de mascotas.
- Reportes de pérdida.
- Reportes de hallazgo.
- Avistamientos.
- Mapa.
- Notificaciones.
- Recuperación de mascotas.

Cualquier funcionalidad fuera de estos ámbitos deberá justificar claramente su necesidad.

---

# Preguntas obligatorias antes de desarrollar

Antes de aprobar una nueva funcionalidad deberá responderse:

```text
1. ¿Qué problema del usuario resuelve?

2. ¿Cómo mejora la recuperación de mascotas?

3. ¿Qué métrica permitirá saber si funciona?

4. ¿Cuál es el coste de implementarla?

5. ¿Qué riesgo añade al sistema?

6. ¿Qué funcionalidad actual podría verse afectada?

7. ¿Podemos medir su éxito de forma objetiva?
```

---

## Ejemplo de propuesta no aprobada
 
## Solicitud

Propuesta: Integrar un feed de noticias tipo "Twitter" con posts de usuarios.

## Análisis
- Valor para el usuario: Podría aumentar engagement.
- Impacto en la misión: Bajo. Las noticias no ayudan a encontrar mascotas.
- Coste de implementación: Moderado (nuevo feed, moderación).
- Riesgo: Generaría ruido y requeriría moderación constante.
- Decisión: Posponer. No es prioritario para el objetivo del MVP.o del MVP.

---

## Ejemplo de propuesta aprobada

```text
Propuesta: Añadir un botón "Avisar a vecinos" en la ficha de mascota perdida.

Análisis:
- Valor para el usuario: Alto. Ayuda a movilizar a personas cercanas.
- Impacto en la misión: Alto. Aumenta posibilidades de recuperación.
- Coste de implementación: Bajo-moderado.
- Riesgo: Bajo.
- Decisión: Aprobar. Prioridad alta para el MVP.
```

---

# Ejemplo de evaluación

## Solicitud

```text
Añadir reconocimiento facial mediante inteligencia artificial.
```

## Evaluación

| Criterio | Puntuación |
|----------|------------|
| Impacto en la misión | 5 |
| Valor para el usuario | 4 |
| Urgencia | 1 |
| Facilidad de implementación | 1 |
| Coste de mantenimiento | 2 |
| Riesgo técnico | 2 |
| Alineación MVP | 1 |

---

## Resultado

```text
16/35 puntos
```

## Decisión

```text
Posponer. Aunque la funcionalidad podría aportar valor, su complejidad técnica y el coste de mantenimiento no se justifican en la fase MVP. Es preferible validar primero las funcionalidades esenciales.
```

---

## Motivo

Aunque la funcionalidad podría aportar valor en el futuro, la complejidad técnica, el coste de mantenimiento y la falta de validación del núcleo principal del producto hacen que no sea adecuada para la fase MVP.

La prioridad actual debe centrarse en validar las funcionalidades esenciales relacionadas con la recuperación de mascotas.

---

# Registro de decisiones rechazadas

Las decisiones rechazadas o pospuestas también deberán documentarse.

El objetivo es evitar reevaluar constantemente ideas descartadas y mantener memoria estratégica del proyecto.

Registrar estas decisiones permite:

- Mantener histórico de decisiones.
- Evitar repetir análisis ya realizados.
- Comprender por qué determinadas funcionalidades fueron descartadas.
- Revisar decisiones cuando cambie el contexto del proyecto.

Cada registro debería incluir:

| Campo | Descripción |
|-------|-------------|
| Idea | Funcionalidad o cambio propuesto. |
| Fecha | Momento de evaluación. |
| Motivo del análisis | Necesidad detectada o problema que originó la propuesta. |
| Decisión | Aprobada, pospuesta o rechazada. |
| Motivo | Justificación de la decisión tomada. |
| Condición futura | Qué tendría que ocurrir para volver a evaluarla. |

---

# Ejemplo de registro rechazado

| Campo | Descripción |
|-------|-------------|
| Idea | Reconocimiento facial mediante inteligencia artificial para identificar mascotas. |
| Fecha | Fase MVP. |
| Motivo del análisis | Explorar mejoras mediante inteligencia artificial para acelerar la identificación. |
| Decisión | Pospuesta. |
| Motivo | Alta complejidad técnica, necesidad de datos suficientes y falta de validación del flujo principal de recuperación. |
| Condición futura | Revisar cuando exista una base de usuarios suficiente, datos históricos y necesidad demostrada. |

---

# Principio final

La matriz de decisión permite que BuscoHuella mantenga el foco, evitando invertir tiempo y recursos en iniciativas que no aporten valor demostrado.

> **Regla del proyecto:** No se prioriza lo más innovador; se prioriza lo que más aumenta la probabilidad de recuperar mascotas.

---

<a id="1210-consideraciones-legales"></a>

## 12.10 Consideraciones Legales

BuscoHuella deberá desarrollarse teniendo en cuenta las obligaciones legales aplicables desde las primeras fases del proyecto.

Aunque durante el MVP la plataforma tendrá un alcance limitado, el diseño inicial deberá contemplar los requisitos necesarios para garantizar un crecimiento seguro, responsable y sostenible.

El cumplimiento normativo será considerado como un elemento fundamental del producto y no como una fase posterior al desarrollo.

---

# Objetivos legales del proyecto

Las consideraciones legales de BuscoHuella tienen como objetivos:

- Proteger los datos personales de los usuarios.
- Garantizar transparencia en el uso de la plataforma.
- Definir responsabilidades entre usuarios, organizaciones y plataforma.
- Establecer normas claras sobre contenidos publicados.
- Reducir riesgos legales durante la evolución del producto.
- Preparar la plataforma para futuras colaboraciones profesionales e institucionales.

---

# Principios legales del MVP

Durante la fase MVP se seguirán los siguientes principios:

## 1. Privacidad desde el diseño

La privacidad deberá considerarse desde la creación de cada funcionalidad.

Se evitará recopilar información innecesaria y únicamente se almacenarán los datos necesarios para el funcionamiento del servicio.

---

## 2. Minimización de datos

BuscoHuella aplicará el principio de recoger únicamente los datos necesarios para:

- Crear cuentas de usuario.
- Gestionar mascotas.
- Publicar alertas.
- Facilitar contactos relacionados con recuperaciones.
- Mejorar la experiencia del usuario.

---

## 3. Transparencia con los usuarios

Los usuarios deberán conocer:

- Qué datos se recopilan.
- Para qué se utilizan.
- Durante cuánto tiempo se conservan.
- Qué derechos pueden ejercer.
- Cómo contactar con la plataforma.

---

## 4. Responsabilidad sobre la información publicada

BuscoHuella deberá establecer mecanismos para gestionar:

- Publicaciones de mascotas perdidas.
- Información de contacto.
- Fotografías subidas por usuarios.
- Reportes de avistamientos.
- Posibles contenidos incorrectos o fraudulentos.

La plataforma facilitará la conexión entre usuarios, pero no sustituirá las responsabilidades individuales de quienes publican información.

---

# Ámbito normativo aplicable

Durante el desarrollo y evolución de BuscoHuella deberán considerarse principalmente:

| Normativa | Aplicación |
|-----------|------------|
| Reglamento General de Protección de Datos (RGPD) | Tratamiento de datos personales de usuarios. |
| Ley Orgánica 3/2018 (LOPDGDD) | Adaptación española en materia de protección de datos. |
| Ley 7/2023 de protección de los derechos y el bienestar de los animales | Aspectos relacionados con animales de compañía y obligaciones asociadas. |
| Ley de Servicios de la Sociedad de la Información (LSSI-CE) | Servicios digitales y comunicaciones electrónicas. |
| Normativa sobre propiedad intelectual | Uso de imágenes, contenidos y materiales publicados. |

---

# Revisión legal antes del lanzamiento público

Antes de una publicación abierta al público deberá revisarse:

- Política de privacidad.
- Términos y condiciones de uso.
- Política de cookies.
- Gestión de consentimiento.
- Tratamiento de datos personales.
- Responsabilidades de usuarios y organizaciones.
- Procedimientos de retirada de contenido.

---

# Principio final

BuscoHuella debe crecer sobre una base legal sólida, garantizando confianza a los usuarios y reduciendo riesgos futuros.

> **Regla del proyecto:** La confianza del usuario es una funcionalidad más del producto.

---

<a id="12101-cumplimiento-normativo"></a>

## 12.10.1 Cumplimiento Normativo

BuscoHuella deberá mantener un enfoque de cumplimiento normativo desde las primeras fases del desarrollo, incorporando las obligaciones legales dentro del diseño del producto.

El objetivo no es únicamente cumplir con la normativa vigente, sino construir una plataforma preparada para crecer de forma segura, transparente y sostenible.

---

# Objetivo del cumplimiento normativo

El cumplimiento normativo de BuscoHuella tiene como objetivos:

- Reducir riesgos legales asociados al funcionamiento de la plataforma.
- Proteger los derechos de usuarios y organizaciones.
- Garantizar un uso responsable de la información gestionada.
- Facilitar futuras colaboraciones con entidades profesionales e institucionales.
- Preparar el producto para una posible expansión geográfica y funcional.

---

# Principios de cumplimiento

## 1. Cumplimiento desde el diseño

Las decisiones técnicas y funcionales deberán considerar los requisitos legales aplicables.

Esto implica evaluar previamente:

- Qué información se recopila.
- Cómo se almacena.
- Quién puede acceder.
- Durante cuánto tiempo se conserva.
- Qué responsabilidades existen sobre su uso.

---

## 2. Documentación legal actualizada

BuscoHuella deberá mantener documentación suficiente para garantizar transparencia y trazabilidad.

La documentación podrá incluir:

- Política de privacidad.
- Términos y condiciones de uso.
- Política de cookies.
- Avisos legales.
- Procedimientos internos.
- Registro de decisiones relacionadas con cumplimiento.

---

## 3. Revisión periódica

El cumplimiento normativo deberá revisarse cuando:

- Se incorporen nuevas funcionalidades.
- Cambie la normativa aplicable.
- Se introduzcan nuevos tipos de datos.
- Se creen nuevas colaboraciones externas.
- La plataforma amplíe su alcance geográfico.

---

# Responsabilidades legales dentro del proyecto

Durante la fase MVP:

- El fundador será responsable de supervisar el cumplimiento inicial.
- Las nuevas funcionalidades deberán considerar posibles implicaciones legales.
- Los servicios externos utilizados deberán evaluarse antes de integrarse.
- Los proveedores tecnológicos deberán cumplir requisitos adecuados de seguridad y privacidad.

---

# Gestión de riesgos legales

Los principales riesgos a controlar serán:

| Riesgo | Medida preventiva |
|--------|-------------------|
| Uso incorrecto de datos personales | Aplicar principios de privacidad y protección de datos. |
| Publicación de información falsa | Establecer normas de uso y mecanismos de reporte. |
| Uso indebido de imágenes | Regular la publicación de contenidos por usuarios. |
| Falta de transparencia | Mantener documentación clara y accesible. |
| Dependencia de servicios externos | Revisar condiciones y garantías de proveedores. |

---

# Adaptación futura

A medida que BuscoHuella evolucione, deberán revisarse las obligaciones legales asociadas a:

- Nuevos modelos de negocio.
- Servicios profesionales.
- Integraciones con entidades externas.
- Procesamiento avanzado de información.
- Uso de inteligencia artificial.
- Expansión a otros territorios.

---

# Principio final

El cumplimiento normativo debe formar parte de la evolución natural del producto, evitando que las obligaciones legales se conviertan en una barrera durante fases posteriores.

> **Regla del proyecto:** Construir rápido no significa ignorar la normativa; significa diseñar correctamente desde el principio.

---

<a id="12102-rgpd"></a>

## 12.10.2 RGPD

BuscoHuella deberá cumplir con el Reglamento General de Protección de Datos (RGPD) al tratar datos personales de usuarios, organizaciones y colaboradores que utilicen la plataforma.

El RGPD será considerado un elemento fundamental del diseño del producto, aplicando principios de privacidad, seguridad y transparencia desde las primeras fases del desarrollo.

---

# Objetivo del cumplimiento RGPD

La aplicación del RGPD tiene como objetivos:

- Proteger los datos personales de los usuarios.
- Garantizar un tratamiento transparente de la información.
- Permitir a los usuarios ejercer sus derechos.
- Reducir riesgos asociados al almacenamiento y procesamiento de datos.
- Establecer una base legal adecuada para cada tratamiento realizado.

---

# Responsable del tratamiento

BuscoHuella deberá definir claramente quién actúa como responsable del tratamiento de los datos personales.

El responsable deberá:

- Determinar las finalidades del tratamiento.
- Garantizar el cumplimiento de la normativa.
- Aplicar medidas de seguridad adecuadas.
- Atender solicitudes relacionadas con derechos de usuarios.
- Mantener documentación de cumplimiento cuando sea necesario.

---

# Principios del tratamiento de datos

BuscoHuella aplicará los principios fundamentales del RGPD:

| Principio | Aplicación en BuscoHuella |
|-----------|----------------------------|
| Licitud, lealtad y transparencia | Informar claramente a los usuarios sobre el uso de sus datos. |
| Limitación de finalidad | Utilizar los datos únicamente para los objetivos definidos. |
| Minimización de datos | Recoger únicamente la información necesaria. |
| Exactitud | Permitir la actualización o corrección de información. |
| Limitación del plazo de conservación | Eliminar o anonimizar datos cuando ya no sean necesarios. |
| Integridad y confidencialidad | Proteger la información frente a accesos no autorizados. |
| Responsabilidad proactiva | Demostrar que se cumplen las obligaciones aplicables. |

---

# Datos personales gestionados

Durante el funcionamiento de BuscoHuella podrán gestionarse datos como:

| Tipo de dato | Uso previsto |
|-------------|--------------|
| Datos identificativos | Creación y gestión de cuentas. |
| Datos de contacto | Comunicación relacionada con mascotas y avisos. |
| Fotografías | Identificación y publicación de mascotas. |
| Ubicación aproximada | Mostrar avisos y facilitar recuperaciones. |
| Información de mascotas | Gestión de perfiles y reportes. |
| Datos de organizaciones | Gestión de entidades colaboradoras. |

---

# Base legal del tratamiento

Cada tratamiento deberá disponer de una base legal adecuada.

Las posibles bases legales podrán incluir:

- Consentimiento del usuario.
- Ejecución de un servicio solicitado.
- Interés legítimo cuando corresponda.
- Cumplimiento de obligaciones legales.

No deberán utilizarse datos personales para finalidades diferentes a las informadas al usuario.

---

# Derechos de los usuarios

BuscoHuella deberá facilitar el ejercicio de los derechos reconocidos por el RGPD:

| Derecho | Descripción |
|---------|-------------|
| Acceso | Conocer qué datos se almacenan sobre el usuario. |
| Rectificación | Corregir información incorrecta. |
| Supresión | Solicitar la eliminación de datos cuando proceda. |
| Oposición | Oponerse a determinados tratamientos. |
| Limitación | Solicitar restricciones sobre el uso de datos. |
| Portabilidad | Recibir datos en formato estructurado cuando sea aplicable. |

---

# Seguridad de la información

BuscoHuella deberá aplicar medidas técnicas y organizativas adecuadas:

- Control de acceso mediante autenticación.
- Protección de credenciales.
- Cifrado de comunicaciones.
- Copias de seguridad.
- Gestión de permisos.
- Registro de acciones críticas.
- Actualización periódica de dependencias.

---

# Privacidad desde el diseño y por defecto

Las funcionalidades deberán diseñarse aplicando privacidad desde el inicio.

Ejemplos:

- No mostrar públicamente datos personales innecesarios.
- Evitar compartir información sensible sin consentimiento.
- Permitir controlar la visibilidad de determinados datos.
- Limitar la exposición de ubicaciones exactas cuando no sea necesario.

---

# Gestión de incidencias de seguridad

En caso de producirse una posible brecha de seguridad deberá existir un procedimiento para:

- Detectar el incidente.
- Evaluar el impacto.
- Aplicar medidas correctivas.
- Documentar lo ocurrido.
- Notificar a las autoridades cuando sea obligatorio.

---

# Principio final

El cumplimiento del RGPD permitirá que BuscoHuella genere confianza entre usuarios, organizaciones y colaboradores, protegiendo la información utilizada para facilitar la recuperación de mascotas.

> **Regla del proyecto:** Los datos de los usuarios son una responsabilidad, no un recurso que explotar.

---

<a id="12103-lopdgdd"></a>

## 12.10.3 LOPDGDD

BuscoHuella deberá cumplir con la Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), normativa española que adapta y complementa la aplicación del RGPD dentro del territorio nacional.

La LOPDGDD establece obligaciones adicionales relacionadas con el tratamiento de datos personales, los derechos digitales de los usuarios y las garantías necesarias para el funcionamiento de servicios digitales.

---

# Objetivo de la LOPDGDD en BuscoHuella

La aplicación de la LOPDGDD tiene como objetivos:

- Adaptar el cumplimiento del RGPD al marco jurídico español.
- Garantizar los derechos digitales de los usuarios.
- Establecer garantías adicionales en el tratamiento de información personal.
- Definir responsabilidades claras dentro del proyecto.
- Preparar la plataforma para operar con usuarios y organizaciones en España.

---

# Aplicación dentro de BuscoHuella

La LOPDGDD será relevante especialmente en aspectos como:

- Gestión de cuentas de usuario.
- Tratamiento de datos de contacto.
- Publicación de información relacionada con mascotas.
- Gestión de fotografías y contenidos subidos por usuarios.
- Comunicación entre usuarios y organizaciones.
- Uso de herramientas externas de almacenamiento o análisis.

---

# Derechos digitales de los usuarios

BuscoHuella deberá garantizar una gestión responsable de los derechos digitales reconocidos por la normativa española.

Esto incluye:

- Información clara sobre el tratamiento de datos.
- Control sobre la información compartida.
- Protección frente a usos no autorizados.
- Facilidad para gestionar la privacidad de la cuenta.
- Posibilidad de ejercer los derechos reconocidos legalmente.

---

# Gestión de usuarios menores de edad

Dado que la plataforma podría ser utilizada por personas de diferentes edades, deberá contemplarse la normativa aplicable a menores.

BuscoHuella deberá valorar:

- Edad mínima para crear una cuenta.
- Necesidad de consentimiento parental cuando corresponda.
- Limitaciones de acceso a determinadas funcionalidades.
- Protección adicional frente a exposición de datos personales.

---

# Publicación de contenidos por usuarios

Los usuarios podrán generar contenido dentro de la plataforma, como:

- Fotografías de mascotas.
- Avisos de pérdida.
- Reportes de hallazgos.
- Comentarios o información adicional.

BuscoHuella deberá establecer mecanismos para:

- Regular el uso adecuado de la plataforma.
- Evitar publicación de información personal innecesaria.
- Gestionar solicitudes de retirada de contenido.
- Actuar ante contenidos ilícitos o fraudulentos.

---

# Proveedores y encargados del tratamiento

Los servicios externos utilizados por BuscoHuella deberán evaluarse para garantizar que cumplen las obligaciones aplicables.

Se deberá revisar:

| Elemento | Revisión |
|----------|----------|
| Proveedor tecnológico | Garantías de seguridad y privacidad. |
| Almacenamiento de datos | Ubicación y condiciones del servicio. |
| Servicios de autenticación | Tratamiento de credenciales y usuarios. |
| Servicios analíticos | Uso de datos y anonimización. |
| Herramientas externas | Condiciones legales aplicables. |

---

# Medidas organizativas

BuscoHuella deberá mantener buenas prácticas internas:

- Control de acceso a información sensible.
- Documentación de procesos relevantes.
- Revisión de permisos.
- Formación básica sobre privacidad.
- Seguimiento de cambios normativos.

---

# Adaptación futura

A medida que el proyecto crezca, deberá revisarse la necesidad de:

- Designar responsables específicos de privacidad.
- Realizar análisis de riesgos.
- Crear procedimientos internos más avanzados.
- Formalizar acuerdos con colaboradores.
- Revisar nuevas obligaciones derivadas del crecimiento del servicio.

---

# Principio final

La LOPDGDD permitirá que BuscoHuella opere dentro del marco legal español, garantizando que la innovación tecnológica avance junto con la protección de los derechos de los usuarios.

> **Regla del proyecto:** Una plataforma de confianza debe proteger tanto a las mascotas como a las personas que intentan ayudarlas.

---

<a id="12104-ley-72023-bienestar-animal"></a>

## 12.10.4 Ley 7/2023 de Bienestar Animal

BuscoHuella deberá considerar la Ley 7/2023 de protección de los derechos y el bienestar de los animales como una referencia normativa relevante debido a que la plataforma está orientada a facilitar la protección, localización y recuperación de animales de compañía.

Aunque BuscoHuella no sustituye a las administraciones públicas ni a los profesionales veterinarios, deberá diseñarse de forma compatible con los principios de protección animal establecidos por la normativa vigente.

---

# Objetivo de cumplimiento

La consideración de la normativa de bienestar animal tiene como objetivos:

- Favorecer la protección de animales de compañía.
- Facilitar procesos de recuperación responsable.
- Promover la tenencia responsable.
- Evitar usos de la plataforma contrarios al bienestar animal.
- Facilitar la colaboración con entidades autorizadas.

---

# Relación de BuscoHuella con el bienestar animal

La plataforma podrá contribuir al bienestar animal mediante:

- Difusión de avisos de animales perdidos.
- Facilitación de encuentros entre propietarios y personas que encuentran animales.
- Colaboración con protectoras y entidades relacionadas.
- Mejora de la comunicación durante procesos de búsqueda.
- Reducción del tiempo de separación entre animales y responsables.

---

# Principios aplicables al funcionamiento de la plataforma

BuscoHuella deberá promover:

## 1. Tenencia responsable

La plataforma deberá fomentar que los usuarios:

- Mantengan correctamente identificadas sus mascotas.
- Actualicen la información de sus animales.
- Actúen de forma responsable ante pérdidas o hallazgos.
- Respeten el bienestar del animal durante cualquier actuación.

---

## 2. Protección del animal encontrado

Cuando un usuario reporte un animal encontrado, BuscoHuella deberá orientar hacia actuaciones responsables:

- Evitar situaciones de riesgo para el animal.
- Facilitar la comunicación con responsables legítimos.
- Promover la colaboración con profesionales o entidades cuando sea necesario.
- Evitar entregas sin verificar correctamente la información.

---

## 3. Prevención de usos indebidos

La plataforma deberá establecer medidas para evitar:

- Intentos de apropiación indebida de animales.
- Información falsa sobre propietarios.
- Publicaciones fraudulentas.
- Uso de la plataforma para actividades incompatibles con el bienestar animal.

---

# Colaboración con entidades profesionales

BuscoHuella podrá colaborar con:

- Protectoras de animales.
- Asociaciones de protección animal.
- Centros veterinarios.
- Profesionales relacionados con animales.
- Entidades públicas.

Estas colaboraciones deberán establecerse mediante criterios claros:

- Verificación de identidad.
- Condiciones de uso.
- Responsabilidades definidas.
- Protección de información compartida.

---

# Gestión de información sobre animales

La plataforma podrá gestionar información como:

- Nombre del animal.
- Especie.
- Fotografías.
- Características identificativas.
- Zona aproximada de pérdida o hallazgo.
- Información relevante para facilitar la recuperación.

Esta información deberá utilizarse exclusivamente para los fines informados al usuario.

---

# Limitaciones de responsabilidad

BuscoHuella deberá dejar claramente definido que:

- La plataforma facilita la conexión entre personas.
- No garantiza la recuperación de todos los animales publicados.
- No sustituye servicios veterinarios, policiales o administrativos.
- Los usuarios son responsables de la información aportada.

---

# Evolución futura

Con el crecimiento del proyecto deberán revisarse posibles requisitos adicionales relacionados con:

- Colaboraciones institucionales.
- Integración con registros oficiales.
- Servicios profesionales.
- Nuevas obligaciones derivadas del sector animal.

---

# Principio final

BuscoHuella debe utilizar la tecnología como herramienta de ayuda a la protección animal, respetando siempre la normativa y priorizando el bienestar de los animales.

> **Regla del proyecto:** La tecnología debe facilitar la recuperación, pero siempre debe estar al servicio del bienestar animal.

---

<a id="12105-lssi-ce"></a>

## 12.10.5 Ley de Servicios de la Sociedad de la Información (LSSI-CE)

BuscoHuella, como plataforma digital que ofrece servicios a través de internet, deberá considerar las obligaciones establecidas por la Ley 34/2002 de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).

Esta normativa regula determinados aspectos relacionados con los servicios digitales, la información proporcionada a los usuarios, las comunicaciones electrónicas y las obligaciones de los prestadores de servicios online.

---

# Objetivo de cumplimiento

La aplicación de la LSSI-CE tiene como objetivos:

- Garantizar transparencia en la relación entre plataforma y usuarios.
- Informar claramente sobre la identidad del responsable del servicio.
- Regular correctamente las comunicaciones electrónicas.
- Establecer condiciones de uso claras.
- Reducir riesgos legales asociados al funcionamiento online.

---

# Información legal de la plataforma

BuscoHuella deberá proporcionar información accesible y clara sobre:

- Identidad del responsable del servicio.
- Datos de contacto.
- Condiciones generales de uso.
- Normas de funcionamiento de la plataforma.
- Canales de comunicación disponibles.
- Información legal necesaria.

Esta información deberá estar disponible de forma sencilla para los usuarios.

---

# Aviso legal

La plataforma deberá disponer de un Aviso Legal que establezca:

- Identificación del titular de la plataforma.
- Condiciones de acceso y uso.
- Responsabilidades de usuarios y plataforma.
- Limitaciones de responsabilidad.
- Normas sobre contenidos publicados.
- Legislación aplicable.

---

# Términos y condiciones de uso

BuscoHuella deberá definir unas condiciones de uso que regulen:

- Creación y gestión de cuentas.
- Uso correcto de las funcionalidades.
- Publicación de información sobre mascotas.
- Uso de fotografías y contenidos.
- Comportamientos prohibidos.
- Suspensión o eliminación de cuentas.
- Responsabilidades de usuarios.

---

# Comunicaciones electrónicas

En caso de utilizar comunicaciones digitales, BuscoHuella deberá garantizar:

- Información transparente sobre el envío de comunicaciones.
- Diferenciación entre comunicaciones necesarias y comerciales.
- Gestión adecuada de preferencias del usuario.
- Posibilidad de modificar o cancelar determinados avisos.

Ejemplos:

| Tipo de comunicación | Tratamiento |
|----------------------|-------------|
| Avisos sobre mascotas perdidas | Comunicación necesaria para el servicio. |
| Confirmaciones de cuenta | Comunicación operativa. |
| Noticias o promociones | Requiere gestión adecuada del consentimiento. |
| Campañas externas | Deben cumplir requisitos legales aplicables. |

---

# Uso de cookies y tecnologías similares

Si la plataforma utiliza cookies u otras tecnologías de seguimiento, deberá contemplarse:

- Información previa al usuario.
- Solicitud de consentimiento cuando sea necesario.
- Explicación de finalidades.
- Gestión de preferencias.
- Política de cookies actualizada.

---

# Responsabilidad sobre contenidos publicados

Como plataforma donde los usuarios pueden publicar información, BuscoHuella deberá establecer:

- Normas sobre contenidos permitidos.
- Mecanismos de reporte.
- Procedimientos de retirada de contenido ilícito.
- Medidas frente a usos fraudulentos.

La plataforma facilitará la comunicación entre usuarios, pero no asumirá automáticamente responsabilidad sobre toda la información publicada por terceros.

---

# Relaciones con organizaciones y profesionales

Cuando colaboren entidades externas como:

- Protectoras.
- Clínicas veterinarias.
- Profesionales del sector animal.
- Organizaciones colaboradoras.

Deberán definirse:

- Condiciones de colaboración.
- Responsabilidades de cada parte.
- Uso permitido de información.
- Reglas de publicación y comunicación.

---

# Evolución futura

Con el crecimiento del proyecto deberán revisarse aspectos como:

- Incorporación de servicios de pago.
- Publicidad dentro de la plataforma.
- Servicios profesionales.
- Marketplace o funcionalidades comerciales.
- Nuevos modelos de negocio.

Cada nueva funcionalidad deberá analizar previamente sus implicaciones legales.

---

# Principio final

La transparencia legal forma parte de la confianza del usuario y debe estar integrada en la experiencia de BuscoHuella desde el inicio.

> **Regla del proyecto:** Una plataforma responsable no solo debe funcionar correctamente; también debe explicar claramente cómo funciona.

---

<a id="12106-responsabilidad-sobre-contenidos"></a>

## 12.10.6 Responsabilidad sobre Contenidos

BuscoHuella permitirá que los usuarios puedan aportar información relacionada con mascotas perdidas, encontradas o avistadas.

Esta participación de los usuarios implica la necesidad de establecer criterios claros sobre la responsabilidad de los contenidos publicados dentro de la plataforma.

El objetivo es garantizar un uso responsable del servicio, proteger a los usuarios y reducir riesgos derivados de información incorrecta, fraudulenta o inapropiada.

---

# Principios generales

Los usuarios serán responsables de la información que publiquen dentro de BuscoHuella.

Esto incluye:

- Datos proporcionados sobre mascotas.
- Fotografías subidas.
- Ubicaciones indicadas.
- Descripciones realizadas.
- Información de contacto compartida.
- Comentarios o comunicaciones realizadas.

---

# Responsabilidad del usuario

Antes de publicar contenido, el usuario deberá garantizar que:

- La información aportada es veraz según su conocimiento.
- Dispone de autorización para utilizar imágenes o contenidos publicados.
- No comparte información falsa de forma intencionada.
- No utiliza la plataforma con fines fraudulentos.
- Respeta la privacidad de otras personas.

---

# Tipos de contenidos gestionados

BuscoHuella podrá gestionar contenidos como:

| Contenido | Consideraciones |
|-----------|-----------------|
| Fotografías de mascotas | Deben utilizarse únicamente para facilitar la identificación y recuperación. |
| Avisos de pérdida | Deben contener información suficiente y veraz. |
| Reportes de hallazgo | Deben evitar acusaciones o información no comprobada. |
| Avistamientos | Deben reflejar observaciones reales del usuario. |
| Información de contacto | Debe compartirse únicamente cuando sea necesario. |

---

# Limitaciones de responsabilidad de la plataforma

BuscoHuella actuará como herramienta de conexión entre usuarios, pero no será responsable de forma automática de:

- Errores en la información aportada por usuarios.
- Datos incorrectos publicados por terceros.
- Conflictos entre usuarios.
- Actuaciones realizadas fuera de la plataforma.
- Resultados concretos de una búsqueda.

La plataforma deberá establecer mecanismos razonables para detectar y gestionar posibles problemas.

---

# Gestión de contenidos incorrectos

Cuando se detecte información incorrecta, fraudulenta o perjudicial, BuscoHuella podrá:

- Solicitar correcciones al usuario.
- Ocultar temporalmente información.
- Retirar contenidos.
- Restringir cuentas cuando sea necesario.
- Revisar casos reportados por la comunidad.

---

# Protección frente a usos indebidos

BuscoHuella deberá prevenir especialmente:

- Publicaciones falsas de mascotas perdidas.
- Intentos de apropiación de animales.
- Uso de fotografías sin autorización.
- Acoso entre usuarios.
- Compartición innecesaria de datos personales.

---

# Evolución futura

A medida que la plataforma crezca deberán establecerse mecanismos más avanzados:

- Sistemas automáticos de detección.
- Historial de modificaciones.
- Verificación de usuarios u organizaciones.
- Herramientas de revisión interna.

---

# Principio final

Los contenidos generados por la comunidad son esenciales para el funcionamiento de BuscoHuella, pero deben gestionarse bajo criterios de responsabilidad, seguridad y confianza.

> **Regla del proyecto:** La información compartida debe ayudar a recuperar mascotas, no generar nuevos riesgos.

---

<a id="12107-moderacion-y-denuncias"></a>

## 12.10.7 Moderación y Denuncias

BuscoHuella deberá disponer de mecanismos que permitan mantener un entorno seguro, fiable y orientado exclusivamente a la recuperación de mascotas.

Debido a que la plataforma permitirá la participación de usuarios mediante publicaciones, reportes y comunicaciones, será necesario establecer procesos de moderación que permitan detectar y gestionar posibles usos incorrectos del servicio.

---

# Objetivo de la moderación

La moderación tendrá como objetivos:

- Mantener la calidad de la información publicada.
- Reducir contenidos falsos o engañosos.
- Proteger a usuarios y animales.
- Evitar usos fraudulentos de la plataforma.
- Garantizar un entorno de confianza.

---

# Principios de moderación

La moderación de BuscoHuella se basará en los siguientes principios:

## 1. Proporcionalidad

Las acciones de moderación deberán adaptarse a la gravedad de la situación.

No todos los errores tendrán la misma consideración:

- Errores involuntarios.
- Información incompleta.
- Contenido incorrecto.
- Uso fraudulento intencionado.

---

## 2. Transparencia

Cuando se aplique una medida de moderación, siempre que sea posible, el usuario deberá conocer:

- Qué contenido ha sido afectado.
- Motivo de la actuación.
- Medida aplicada.
- Posibilidad de revisión.

---

## 3. Protección del usuario

Los procesos de moderación deberán proteger especialmente:

- Datos personales.
- Información sensible.
- Comunicación entre usuarios.
- Seguridad de animales reportados.

---

# Sistema de denuncias

BuscoHuella deberá ofrecer mecanismos para que los usuarios puedan informar sobre:

- Contenido falso.
- Publicaciones sospechosas.
- Información incorrecta.
- Uso indebido de fotografías.
- Comportamientos inapropiados.
- Intentos de fraude.

---

# Tipos de incidencias

| Tipo de incidencia | Ejemplo |
|--------------------|---------|
| Información falsa | Reporte de una mascota que no corresponde con la realidad. |
| Uso indebido de imágenes | Publicación de fotografías sin autorización. |
| Comportamiento abusivo | Mensajes ofensivos o acoso. |
| Fraude | Intentos de obtener animales mediante engaños. |
| Datos incorrectos | Ubicaciones o información desactualizada. |

---

# Flujo básico de denuncia

El proceso inicial podrá seguir el siguiente flujo:

```text
1. Usuario reporta una incidencia.

2. Se registra la denuncia.

3. Se analiza la información disponible.

4. Se decide una acción:
   - Mantener contenido.
   - Solicitar corrección.
   - Ocultar contenido.
   - Eliminar contenido.
   - Restringir usuario.

5. Se registra la actuación realizada.
```

---

<a id="12108-principios-de-privacidad"></a>

### 12.10.8 Principios de Privacidad

La privacidad constituye uno de los pilares fundamentales de BuscoHuella.

El tratamiento de los datos personales deberá diseñarse siguiendo el principio de **Privacy by Design** y **Privacy by Default**, garantizando que la protección de la información forme parte del producto desde su concepción y no como una medida añadida posteriormente.

El objetivo es generar confianza entre los usuarios y minimizar los riesgos asociados al tratamiento de información personal.

---

# Principios de privacidad

Toda funcionalidad desarrollada deberá respetar los siguientes principios.

## 1. Minimización de datos

Únicamente se recopilarán los datos estrictamente necesarios para prestar el servicio.

No se solicitará información personal cuya utilización no esté claramente justificada.

---

## 2. Finalidad específica

Cada dato personal deberá tener una finalidad concreta, legítima y conocida por el usuario.

No se reutilizarán datos para finalidades incompatibles con aquellas para las que fueron obtenidos.

---

## 3. Transparencia

Los usuarios deberán conocer de forma clara:

- Qué información se recopila.
- Con qué finalidad.
- Durante cuánto tiempo se conserva.
- Quién puede acceder a ella.
- Cómo ejercer sus derechos.

Toda esta información deberá estar disponible mediante una política de privacidad accesible y comprensible.

---

## 4. Seguridad

Los datos personales deberán protegerse mediante medidas técnicas y organizativas apropiadas.

Entre otras medidas se contemplarán:

- Cifrado de comunicaciones.
- Control de acceso.
- Gestión segura de credenciales.
- Registro de incidencias de seguridad.
- Actualización periódica de dependencias.

---

## 5. Control por parte del usuario

Los usuarios deberán mantener el control sobre sus datos personales.

Siempre que sea posible podrán:

- Consultar su información.
- Modificarla.
- Descargarla.
- Eliminarla.
- Solicitar la cancelación de su cuenta.

---

# Privacidad durante el MVP

Durante la fase MVP se aplicarán las siguientes reglas:

- Evitar recopilar datos innecesarios.
- Limitar la información visible públicamente.
- Reducir al mínimo los permisos solicitados por la aplicación.
- Revisar periódicamente los datos almacenados.
- Implementar medidas básicas de seguridad desde el primer día.

---

# Evolución futura

A medida que el proyecto crezca podrán incorporarse medidas adicionales como:

- Evaluaciones de impacto (EIPD).
- Auditorías periódicas.
- Sistemas avanzados de anonimización.
- Gestión automatizada de solicitudes RGPD.
- Certificaciones de seguridad.

Estas medidas deberán implantarse conforme aumente el volumen de usuarios y el riesgo asociado al tratamiento de datos.

---

# Principio final

La privacidad no debe entenderse únicamente como una obligación legal, sino como un compromiso permanente con la confianza de los usuarios.

> **Regla del proyecto:** Solo se recogerán los datos imprescindibles para ayudar a recuperar mascotas y prestar el servicio de forma segura.

---

<a id="12109-titularidad-de-la-informacion"></a>

### 12.10.9 Titularidad de la Información

BuscoHuella reconoce que los datos, contenidos y materiales publicados en la plataforma pertenecen, con carácter general, a los usuarios que los generan o a sus legítimos titulares.

La plataforma actuará como responsable del tratamiento de los datos personales que gestione y como proveedor del servicio, sin adquirir derechos de propiedad sobre la información publicada por los usuarios, salvo aquellos estrictamente necesarios para el funcionamiento de la plataforma.

---

# Titularidad de los contenidos

Los usuarios conservarán la titularidad sobre los contenidos que publiquen, incluyendo, entre otros:

- Fotografías de mascotas.
- Descripciones.
- Información de contacto.
- Publicaciones de pérdida o hallazgo.
- Comentarios.
- Actualizaciones del estado de una mascota.

La publicación de estos contenidos no supondrá la cesión de la propiedad intelectual a BuscoHuella.

---

# Licencia de uso para la plataforma

Al publicar contenido, el usuario concederá a BuscoHuella una licencia de uso limitada, no exclusiva y revocable, únicamente para:

- Mostrar la información dentro de la plataforma.
- Facilitar la recuperación de mascotas.
- Distribuir las alertas según la configuración del usuario.
- Adaptar técnicamente el contenido para su correcta visualización.
- Realizar copias de seguridad necesarias para el funcionamiento del servicio.

Esta licencia finalizará cuando el contenido sea eliminado, salvo en aquellos casos en los que deba conservarse por obligación legal.

---

# Información generada por la plataforma

Serán propiedad de BuscoHuella los elementos desarrollados específicamente para el funcionamiento del servicio, incluyendo:

- Código fuente propio.
- Diseño de la aplicación.
- Arquitectura del sistema.
- Base de datos estructural.
- Algoritmos propios.
- Documentación técnica.
- Marca e identidad visual.
- Materiales creados por el equipo del proyecto.

---

# Información generada automáticamente

La plataforma podrá generar información derivada del uso del servicio, como:

- Estadísticas agregadas.
- Métricas de utilización.
- Indicadores de rendimiento.
- Datos anonimizados.
- Informes internos.

Siempre que estos datos no permitan identificar a personas concretas, podrán utilizarse para mejorar el producto y analizar su funcionamiento.

---

# Eliminación de contenidos

Los usuarios podrán solicitar la eliminación de sus contenidos cuando corresponda.

No obstante, BuscoHuella podrá conservar determinada información cuando exista:

- Obligación legal.
- Investigación de fraude.
- Procedimientos judiciales abiertos.
- Necesidad de garantizar la seguridad de la plataforma.
- Protección de derechos de terceros.

En estos casos, la conservación se limitará al tiempo estrictamente necesario.

---

# Uso de información con fines de mejora

La plataforma podrá utilizar información anonimizada para:

- Mejorar funcionalidades.
- Analizar patrones de uso.
- Detectar incidencias.
- Optimizar el rendimiento.
- Priorizar nuevas funcionalidades.

En ningún caso esta información permitirá identificar directamente a un usuario.

---

# Principio final

BuscoHuella reconoce que la información publicada pertenece a quienes la generan y únicamente utilizará dichos contenidos en la medida necesaria para prestar el servicio y cumplir sus obligaciones legales.

> **Regla del proyecto:** Los datos pertenecen a los usuarios; BuscoHuella únicamente los gestiona para facilitar la recuperación de mascotas.

---

<a id="121010-propiedad-intelectual"></a>

### 12.10.10 Propiedad Intelectual

La propiedad intelectual de BuscoHuella constituye uno de los activos estratégicos del proyecto y deberá protegerse durante todas las fases de desarrollo y explotación de la plataforma.

El objetivo es garantizar que tanto el software como los elementos de identidad del proyecto puedan evolucionar de forma segura, preservando los derechos del proyecto y respetando, al mismo tiempo, los derechos de terceros.

---

# Elementos protegidos

Salvo que se indique expresamente lo contrario, serán propiedad de BuscoHuella todos los elementos desarrollados específicamente para el proyecto, incluyendo:

- Código fuente propio.
- Arquitectura del software.
- Diseño de la interfaz de usuario.
- Identidad visual.
- Logotipos.
- Nombre comercial.
- Marca.
- Documentación técnica.
- Manuales.
- Diagramas.
- Material gráfico original.
- Contenido elaborado por el equipo del proyecto.

---

# Derechos de terceros

BuscoHuella respetará en todo momento los derechos de propiedad intelectual de terceros.

No podrán incorporarse al proyecto materiales que infrinjan derechos de autor, incluyendo:

- Fotografías sin autorización.
- Iconos sin licencia.
- Código con licencias incompatibles.
- Textos protegidos.
- Recursos gráficos sin permiso.
- Contenido obtenido de forma ilícita.

Todo recurso utilizado deberá disponer de una licencia compatible con el proyecto.

---

# Uso de software de terceros

Durante el desarrollo podrán utilizarse librerías, frameworks y herramientas externas siempre que:

- Su licencia permita el uso previsto.
- Sean compatibles con la arquitectura del proyecto.
- No generen obligaciones legales incompatibles.
- Se documente adecuadamente su utilización.

Siempre que sea posible se priorizarán soluciones de código abierto ampliamente mantenidas por la comunidad.

---

# Contenido generado por los usuarios

Los usuarios conservarán la propiedad intelectual sobre los contenidos que publiquen.

La publicación de fotografías, descripciones u otros materiales no supondrá la cesión de los derechos de autor a BuscoHuella.

El usuario únicamente autorizará el uso necesario para que la plataforma pueda prestar correctamente el servicio.

---

# Protección de la marca

La identidad de BuscoHuella deberá protegerse frente a usos que puedan generar confusión o suplantación.

Entre otros elementos podrán protegerse:

- Nombre del proyecto.
- Logotipo.
- Dominio principal.
- Identidad gráfica.
- Material corporativo.

Cuando el proyecto alcance una fase de madurez suficiente podrá valorarse el registro oficial de la marca.

---

# Colaboraciones y contribuciones

Las contribuciones realizadas por colaboradores externos deberán definir claramente:

- Autoría.
- Licencia de uso.
- Cesión de derechos, cuando proceda.
- Alcance de la colaboración.
- Responsabilidades de cada parte.

Siempre que sea posible estas condiciones deberán formalizarse por escrito.

---

# Actuación ante infracciones

Si BuscoHuella detecta posibles vulneraciones de propiedad intelectual podrá:

- Retirar temporalmente el contenido.
- Solicitar información adicional.
- Requerir acreditación de los derechos.
- Resolver reclamaciones entre las partes afectadas.
- Colaborar con las autoridades cuando exista obligación legal.

---

# Principio final

La innovación de BuscoHuella debe construirse respetando tanto la propiedad intelectual propia como la de terceros, garantizando un desarrollo sostenible y jurídicamente seguro.

> **Regla del proyecto:** Todo contenido utilizado por BuscoHuella deberá tener un origen legítimo y una licencia compatible con el proyecto.

---

<a id="121011-politica-de-moderacion"></a>

### 12.10.11 Política de Moderación

La política de moderación de BuscoHuella tiene como finalidad garantizar un entorno seguro, útil y respetuoso para todos los usuarios de la plataforma.

La moderación deberá contribuir a la misión principal del proyecto: facilitar la recuperación de mascotas, evitando que la plataforma sea utilizada para fines distintos o perjudiciales.

---

# Objetivos de la moderación

La moderación tendrá los siguientes objetivos:

- Proteger a los usuarios.
- Mantener la calidad de la información publicada.
- Reducir contenidos fraudulentos.
- Evitar comportamientos abusivos.
- Preservar la confianza en la plataforma.
- Garantizar el cumplimiento de las normas de uso.

---

# Principios de moderación

Toda actuación de moderación deberá respetar los siguientes principios.

## 1. Proporcionalidad

Las medidas adoptadas deberán ser proporcionales a la gravedad de la incidencia.

Siempre que sea posible se priorizarán las acciones menos restrictivas antes de aplicar sanciones permanentes.

---

## 2. Imparcialidad

Las decisiones deberán tomarse atendiendo únicamente a los hechos observables y a las normas establecidas.

No podrán basarse en opiniones personales, afinidades o cualquier criterio discriminatorio.

---

## 3. Transparencia

Cuando resulte posible, el usuario afectado será informado sobre:

- El motivo de la actuación.
- La norma incumplida.
- Las consecuencias aplicadas.
- Las posibles vías de revisión.

---

## 4. Protección de la comunidad

Cuando un contenido pueda poner en riesgo a otros usuarios o perjudicar el funcionamiento de la plataforma, BuscoHuella podrá actuar de forma inmediata.

La protección de la comunidad tendrá prioridad sobre la permanencia del contenido.

---

# Contenidos sujetos a moderación

Podrán ser revisados, limitados o eliminados contenidos como:

- Información falsa sobre mascotas.
- Publicaciones fraudulentas.
- Suplantaciones de identidad.
- Fotografías sin autorización.
- Contenido ofensivo o discriminatorio.
- Spam.
- Publicidad no autorizada.
- Contenido ilegal.
- Información que vulnere derechos de terceros.
- Uso indebido de datos personales.

---

# Medidas de moderación

Dependiendo de la gravedad del caso podrán adoptarse medidas como:

| Medida | Aplicación |
|---------|------------|
| Advertencia | Incumplimientos leves o puntuales. |
| Edición o retirada de contenido | Cuando incumpla las normas de uso. |
| Limitación temporal de funciones | En casos de uso inadecuado reiterado. |
| Suspensión temporal de la cuenta | Incumplimientos graves. |
| Bloqueo permanente | Conductas fraudulentas, ilegales o reiteradas. |

---

# Registro de actuaciones

Las actuaciones relevantes de moderación deberán quedar registradas cuando sea necesario para:

- Resolver reclamaciones.
- Garantizar la trazabilidad.
- Detectar patrones de abuso.
- Mejorar los procesos internos.
- Cumplir obligaciones legales.

Estos registros deberán conservarse únicamente durante el tiempo necesario.

---

# Evolución de la política

La política de moderación podrá evolucionar conforme crezcan:

- El número de usuarios.
- Las funcionalidades disponibles.
- Los riesgos detectados.
- Las obligaciones legales.
- Las necesidades operativas.

Las modificaciones deberán mantener siempre la coherencia con la misión del proyecto.

---

# Principio final

La moderación de BuscoHuella no busca limitar la participación de los usuarios, sino proteger la utilidad, la seguridad y la confianza de toda la comunidad.

> **Regla del proyecto:** Toda decisión de moderación deberá contribuir a que BuscoHuella siga siendo un entorno seguro para ayudar a recuperar mascotas.

---

<a id="121012-exencion-de-responsabilidad"></a>

### 12.10.12 Exención de Responsabilidad

BuscoHuella actúa como una plataforma tecnológica destinada a facilitar la localización y recuperación de mascotas mediante la conexión entre usuarios, organizaciones y colaboradores.

La plataforma proporciona herramientas para compartir información y coordinar actuaciones, pero no garantiza el resultado de las publicaciones ni la recuperación efectiva de los animales.

---

# Naturaleza del servicio

BuscoHuella facilita un entorno de colaboración entre los distintos participantes del ecosistema.

La plataforma no sustituye:

- La actuación de las autoridades competentes.
- Los servicios veterinarios.
- Las protectoras de animales.
- Los cuerpos de seguridad.
- Los profesionales especializados.

Su función consiste exclusivamente en ofrecer herramientas tecnológicas que aumenten las probabilidades de recuperación.

---

# Información publicada por los usuarios

Cada usuario será responsable de la información que publique en la plataforma.

BuscoHuella no garantiza que los datos aportados por terceros sean:

- Exactos.
- Completos.
- Actualizados.
- Veraces.
- Libres de errores.

La plataforma podrá colaborar en la detección y retirada de contenidos incorrectos cuando sean identificados.

---

# Disponibilidad del servicio

BuscoHuella realizará esfuerzos razonables para mantener el servicio disponible.

No obstante, no podrá garantizar una disponibilidad ininterrumpida debido a posibles:

- Tareas de mantenimiento.
- Incidencias técnicas.
- Fallos de proveedores externos.
- Problemas de conectividad.
- Ataques informáticos.
- Circunstancias de fuerza mayor.

---

# Servicios de terceros

La plataforma podrá utilizar servicios externos para determinadas funcionalidades, como:

- Mapas.
- Notificaciones.
- Almacenamiento.
- Autenticación.
- Infraestructura en la nube.

BuscoHuella no será responsable de incidencias derivadas exclusivamente del funcionamiento de dichos proveedores.

---

# Recuperación de mascotas

Aunque el objetivo principal del proyecto sea aumentar las probabilidades de recuperar mascotas perdidas, BuscoHuella no puede garantizar:

- Que una mascota sea localizada.
- Que la información publicada llegue a todas las personas relevantes.
- Que los usuarios actúen conforme a las recomendaciones.
- Que todos los avistamientos sean correctos.
- Que los datos publicados por terceros sean exactos.

La recuperación dependerá de múltiples factores ajenos al control de la plataforma.

---

# Limitación de responsabilidad

En la medida permitida por la legislación aplicable, BuscoHuella no responderá por daños derivados de:

- Información incorrecta publicada por terceros.
- Uso indebido de la plataforma.
- Decisiones tomadas exclusivamente por los usuarios.
- Interrupciones temporales del servicio.
- Actuaciones realizadas fuera de la plataforma.
- Incumplimientos de terceros.

Esta limitación no afectará a aquellas responsabilidades que legalmente no puedan excluirse.

---

# Actualización del servicio

BuscoHuella podrá modificar, ampliar o retirar funcionalidades cuando resulte necesario para:

- Mejorar la seguridad.
- Corregir errores.
- Adaptarse a cambios legales.
- Optimizar el funcionamiento del producto.
- Garantizar la sostenibilidad del proyecto.

Siempre que sea posible, estos cambios se comunicarán con antelación razonable.

---

# Principio final

BuscoHuella proporciona una herramienta para facilitar la colaboración entre personas comprometidas con el bienestar animal, pero el éxito de cada recuperación dependerá también de factores externos y de la actuación responsable de la comunidad.

> **Regla del proyecto:** BuscoHuella facilita la recuperación de mascotas, pero no puede garantizar el resultado de cada caso.

---

<a id="121013-principios-no-negociables"></a>

### 12.10.13 Principios No Negociables

BuscoHuella establece una serie de principios que deberán respetarse durante toda la vida del proyecto.

Estos principios constituyen la base ética, legal y técnica sobre la que se desarrollará la plataforma y no podrán modificarse sin una revisión estratégica completa del proyecto.

Su finalidad es garantizar que el crecimiento de BuscoHuella nunca comprometa la confianza de los usuarios ni la misión principal del producto.

---

# Principios fundamentales

Las decisiones futuras deberán respetar los siguientes principios.

## 1. La misión está por encima de cualquier funcionalidad

Toda nueva característica deberá contribuir, directa o indirectamente, a aumentar las probabilidades de recuperar mascotas.

No se desarrollarán funcionalidades que desvíen el propósito principal del proyecto.

---

## 2. La privacidad es prioritaria

La protección de los datos personales será un requisito esencial en todas las fases del desarrollo.

Ninguna mejora funcional justificará reducir el nivel de privacidad o seguridad de los usuarios.

---

## 3. La confianza no se negocia

La relación con la comunidad deberá basarse en:

- Transparencia.
- Honestidad.
- Responsabilidad.
- Protección de los datos.
- Comunicación clara.

La confianza será considerada uno de los principales activos del proyecto.

---

## 4. La seguridad forma parte del producto

La seguridad no será una funcionalidad adicional, sino un requisito permanente del sistema.

Toda nueva implementación deberá analizar su impacto sobre:

- Confidencialidad.
- Integridad.
- Disponibilidad.
- Protección frente a abusos.
- Riesgos operativos.

---

## 5. La tecnología es un medio, no un fin

Las decisiones tecnológicas deberán responder siempre a una necesidad real del producto.

No se incorporarán tecnologías únicamente por tendencia, complejidad o interés técnico si no aportan valor demostrado.

---

## 6. El usuario es el centro del proyecto

Las decisiones deberán priorizar siempre el beneficio para quienes utilizan la plataforma.

La experiencia del usuario tendrá prioridad frente a soluciones excesivamente complejas o difíciles de utilizar.

---

## 7. La evolución debe ser sostenible

BuscoHuella deberá crecer de forma progresiva, evitando decisiones que comprometan:

- La estabilidad del sistema.
- La mantenibilidad del código.
- La viabilidad económica.
- La capacidad de soporte.
- La calidad del servicio.

---

## 8. Cumplimiento normativo permanente

El cumplimiento de la legislación aplicable deberá mantenerse durante toda la evolución del proyecto.

Las obligaciones legales se considerarán parte integrante del producto y deberán revisarse periódicamente.

---

# Revisión de los principios

Estos principios únicamente podrán modificarse cuando exista una justificación estratégica suficientemente documentada.

Cualquier cambio deberá demostrar que:

- Mejora la misión del proyecto.
- No reduce la protección de los usuarios.
- Mantiene la confianza de la comunidad.
- Es compatible con la legislación vigente.
- Favorece la sostenibilidad a largo plazo.

Las modificaciones deberán quedar documentadas y justificadas.

---

# Principio final

Los principios no negociables representan el compromiso permanente de BuscoHuella con las personas, los animales y la sociedad.

Constituyen la referencia sobre la que deberán apoyarse todas las decisiones futuras del proyecto, independientemente de su tamaño o complejidad.

> **Regla del proyecto:** Ninguna decisión será correcta si obliga a renunciar a los valores fundamentales de BuscoHuella.

---

<a id="13-riesgos-y-mitigacion"></a>

# 13. Riesgos y Mitigación

Todo proyecto tecnológico está expuesto a incertidumbres que pueden afectar al cumplimiento de sus objetivos.

La gestión de riesgos de BuscoHuella tiene como finalidad identificar de forma anticipada los principales factores que podrían comprometer el desarrollo, la adopción o la sostenibilidad del proyecto, permitiendo definir medidas preventivas y planes de respuesta adecuados.

La estrategia de riesgos no busca eliminar completamente la incertidumbre, sino reducir su probabilidad de ocurrencia y minimizar su impacto cuando resulte inevitable.

Durante la fase MVP, la gestión de riesgos adquiere una importancia especial debido a la limitación de recursos, al reducido tamaño del equipo y a la necesidad de validar rápidamente la propuesta de valor antes de ampliar el alcance del producto.

Los riesgos serán revisados de forma periódica y podrán modificarse conforme evolucionen la plataforma, la comunidad de usuarios y el contexto tecnológico o normativo.

> **Principio:** Identificar un riesgo antes de que ocurra siempre será menos costoso que reaccionar cuando ya ha producido consecuencias.

--- 

<a id="131-objetivos-de-la-gestion-de-riesgos"></a>

## 13.1 Objetivos de la Gestión de Riesgos

La gestión de riesgos de BuscoHuella tiene como objetivo proporcionar un marco estructurado para identificar, evaluar, priorizar y mitigar aquellos eventos que puedan afectar al éxito del proyecto.

La identificación temprana de riesgos permitirá tomar decisiones fundamentadas, reducir la incertidumbre y mejorar la capacidad de adaptación durante todas las fases de desarrollo.

---

# Objetivos principales

La gestión de riesgos persigue los siguientes objetivos:

- Identificar de forma anticipada los riesgos más relevantes.
- Evaluar la probabilidad e impacto de cada riesgo.
- Definir estrategias de prevención y mitigación.
- Reducir la incertidumbre en la toma de decisiones.
- Favorecer la continuidad del proyecto ante situaciones adversas.
- Facilitar la planificación técnica y estratégica.

---

# Beneficios esperados

Una gestión adecuada de los riesgos permitirá:

- Incrementar la estabilidad del proyecto.
- Reducir el impacto de incidencias críticas.
- Mejorar la planificación de recursos.
- Priorizar actuaciones preventivas frente a reactivas.
- Favorecer un crecimiento más sostenible.

---

# Alcance

La gestión de riesgos abarcará todas las áreas relevantes del proyecto, incluyendo:

- Estrategia.
- Tecnología.
- Operaciones.
- Seguridad.
- Aspectos legales.
- Recursos económicos.
- Comunidad de usuarios.

Los riesgos podrán incorporarse, modificarse o eliminarse conforme evolucione el proyecto y aparezcan nuevas circunstancias.

---

# Revisión continua

La evaluación de riesgos no será una actividad puntual, sino un proceso continuo.

Los riesgos deberán revisarse cuando:

- Se incorporen nuevas funcionalidades.
- Existan cambios relevantes en la arquitectura.
- Cambie el modelo de negocio.
- Se produzcan cambios normativos.
- Aparezcan nuevas dependencias tecnológicas.
- Se obtengan métricas o evidencias que modifiquen la evaluación inicial.

---

# Principio final

La gestión de riesgos forma parte del proceso de construcción del producto y deberá integrarse en la toma de decisiones desde las primeras fases del proyecto.

> **Regla del proyecto:** Un riesgo identificado y gestionado deja de ser una amenaza imprevisible para convertirse en una decisión controlada.

---

<a id="132-clasificacion-de-riesgos"></a>

## 13.2 Clasificación de Riesgos

Con el fin de facilitar su análisis y priorización, los riesgos identificados en BuscoHuella se agrupan en diferentes categorías según el área del proyecto a la que puedan afectar.

Esta clasificación permite aplicar estrategias de mitigación específicas y asignar prioridades de actuación en función de la naturaleza de cada riesgo.

---

# Categorías de riesgos

BuscoHuella clasifica sus riesgos en las siguientes categorías:

| Categoría | Descripción |
|-----------|-------------|
| Estratégicos | Riesgos que pueden afectar a la viabilidad, adopción o crecimiento del proyecto. |
| Técnicos | Riesgos relacionados con la arquitectura, infraestructura, desarrollo y tecnologías utilizadas. |
| Operativos | Riesgos derivados de la gestión diaria, procesos internos y funcionamiento de la plataforma. |
| Financieros | Riesgos asociados a la disponibilidad de recursos económicos y sostenibilidad del proyecto. |
| Legales | Riesgos relacionados con el cumplimiento normativo, la protección de datos y las responsabilidades legales. |

---

# Evaluación de los riesgos

Cada riesgo será analizado considerando, al menos, los siguientes factores:

- Probabilidad de ocurrencia.
- Impacto sobre el proyecto.
- Capacidad de detección temprana.
- Medidas preventivas disponibles.
- Estrategias de mitigación.
- Plan de respuesta en caso de materializarse.

La evaluación podrá revisarse periódicamente conforme evolucionen el proyecto, la tecnología o el entorno en el que opera BuscoHuella.

---

# Priorización

Los riesgos deberán abordarse siguiendo un criterio de prioridad basado en la combinación de su probabilidad e impacto.

De forma general:

| Nivel | Actuación recomendada |
|--------|-----------------------|
| Alto | Mitigación inmediata y seguimiento continuo. |
| Medio | Plan de mitigación definido y revisión periódica. |
| Bajo | Monitorización y revisión cuando cambie el contexto. |

La prioridad de un riesgo podrá modificarse si aparecen nuevas evidencias, métricas o circunstancias que alteren su evaluación inicial.

---

# Revisión de la clasificación

La clasificación de riesgos no será estática.

Nuevas categorías o riesgos específicos podrán incorporarse cuando:

- Evolucione el alcance del proyecto.
- Se integren nuevas tecnologías.
- Cambie el marco normativo.
- Se produzca la expansión geográfica de la plataforma.
- Se detecten nuevos escenarios durante la operación del servicio.

---

# Principio final

Clasificar correctamente los riesgos permite dedicar los recursos disponibles a aquellos aspectos que pueden comprometer en mayor medida el éxito del proyecto.

> **Regla del proyecto:** No todos los riesgos tienen la misma importancia; la prioridad siempre vendrá determinada por su impacto sobre la misión de BuscoHuella.

---

<a id="133-riesgos-estrategicos"></a>

## 13.3 Riesgos Estratégicos

Los riesgos estratégicos son aquellos que pueden comprometer la viabilidad del proyecto, independientemente de la calidad técnica de la plataforma.

En un producto basado en la colaboración ciudadana, el éxito depende principalmente de la capacidad para generar una comunidad activa y comprometida.

Por este motivo, los riesgos estratégicos representan la categoría con mayor impacto potencial durante la fase MVP.

---

# Riesgo estratégico principal

El principal riesgo estratégico de BuscoHuella es no alcanzar una masa crítica suficiente de usuarios activos dentro del área geográfica de validación.

Al tratarse de una plataforma colaborativa, su utilidad aumenta conforme crece la participación de la comunidad.

Sin un número suficiente de usuarios:

- Disminuye el número de reportes.
- Se reducen los avistamientos.
- Baja la probabilidad de recuperación de mascotas.
- Se percibe menor utilidad por parte de nuevos usuarios.
- Se dificulta el crecimiento orgánico.

Este fenómeno es característico de los productos basados en efectos de red.

---

# Estrategia de mitigación

Para reducir este riesgo, durante el MVP se aplicarán las siguientes medidas:

- Validación exclusivamente en Sabadell.
- Captación hiperlocal de usuarios.
- Colaboración con protectoras y asociaciones.
- Relación con clínicas veterinarias.
- Difusión mediante redes sociales locales.
- Participación activa de la comunidad.

La expansión geográfica únicamente se considerará cuando exista evidencia suficiente de adopción en el área inicial.

---

# Riesgos estratégicos identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|---------|:-----------:|:-------:|------------|
| Baja adopción local | Media | Muy alto | Validación hiperlocal y campañas dirigidas. |
| Crecimiento prematuro | Media | Alto | Consolidar Sabadell antes de expandirse. |
| Competencia con mayor capacidad económica | Baja | Media | Diferenciación mediante comunidad y enfoque local. |
| Desviación de la misión del proyecto | Baja | Muy alto | Aplicar los principios de gobernanza y priorización definidos. |
| Desarrollo de funcionalidades sin validar | Media | Alto | Aplicar la matriz de decisión antes de iniciar nuevos desarrollos. |

---

# Indicadores de seguimiento

Para evaluar la evolución de los riesgos estratégicos se monitorizarán, entre otros, los siguientes indicadores:

- Número de usuarios registrados.
- Usuarios activos mensuales.
- Mascotas registradas.
- Reportes publicados.
- Avistamientos registrados.
- Recuperaciones documentadas.
- Participación de organizaciones colaboradoras.

La evolución de estas métricas permitirá detectar de forma temprana posibles desviaciones respecto a los objetivos del MVP.

---

# Revisión del riesgo estratégico

La evaluación de los riesgos estratégicos deberá revisarse cuando:

- Cambie el ámbito geográfico del proyecto.
- Se modifique el modelo de negocio.
- Se incorporen nuevas líneas de producto.
- Se produzcan cambios significativos en la comunidad de usuarios.
- Existan métricas suficientes para replantear la estrategia de crecimiento.

---

# Principio final

El éxito de BuscoHuella dependerá mucho más de la confianza y participación de la comunidad que de la complejidad tecnológica de la plataforma.

> **Regla del proyecto:** Una comunidad pequeña pero activa genera más valor que una gran base de usuarios inactivos.

---

<a id="134-riesgos-tecnicos"></a>

## 13.4 Riesgos Técnicos

Los riesgos técnicos son aquellos derivados de la arquitectura del sistema, las tecnologías utilizadas, la infraestructura, el proceso de desarrollo y las dependencias externas.

Una gestión adecuada de estos riesgos permitirá mantener una plataforma estable, escalable y preparada para evolucionar sin comprometer la calidad del producto.

Durante el MVP se priorizarán soluciones sencillas, ampliamente documentadas y con un mantenimiento reducido.

---

# Objetivos

La gestión de riesgos técnicos tiene como objetivos:

- Garantizar la estabilidad del sistema.
- Reducir la probabilidad de fallos críticos.
- Facilitar el mantenimiento del código.
- Minimizar la deuda técnica.
- Favorecer la escalabilidad futura.
- Reducir la dependencia de componentes difíciles de sustituir.

---

# Riesgos técnicos identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|---------|:-----------:|:-------:|------------|
| Retrasos en el desarrollo | Alta | Alto | Priorización del MVP, planificación iterativa y automatización mediante IA. |
| Dependencia de servicios externos | Media | Alto | Arquitectura desacoplada, copias de seguridad y posibilidad de migración. |
| Incremento de deuda técnica | Media | Alto | Revisiones periódicas, refactorización y cumplimiento de estándares de desarrollo. |
| Errores en producción | Media | Alto | Testing, monitorización y despliegues controlados. |
| Problemas de rendimiento | Baja | Alto | Optimización continua y monitorización de métricas. |
| Vulnerabilidades de seguridad | Media | Muy alto | Aplicación de buenas prácticas, auditorías y revisiones de seguridad. |

---

# Dependencias tecnológicas

BuscoHuella utiliza diferentes servicios externos que simplifican el desarrollo y reducen la complejidad inicial.

Entre las principales dependencias se encuentran:

- Supabase.
- Expo.
- React Native.
- Mapbox.
- GitHub.
- Vercel.
- OpenAI y otras herramientas de inteligencia artificial utilizadas durante el desarrollo.

Aunque estas herramientas aceleran la construcción del producto, deberán existir mecanismos que permitan reducir el impacto ante posibles cambios, incidencias o interrupciones del servicio.

---

# Estrategias de mitigación

Para minimizar los riesgos técnicos se aplicarán, entre otras, las siguientes medidas:

- Arquitectura modular.
- Documentación técnica actualizada.
- Control de versiones mediante Git.
- Copias de seguridad periódicas.
- Automatización de pruebas cuando sea posible.
- Revisión del código antes de cada despliegue.
- Separación entre entornos de desarrollo, pruebas y producción.

Estas medidas permitirán reducir la probabilidad de errores y facilitarán la evolución futura del proyecto.

---

# Seguimiento técnico

Los riesgos técnicos deberán revisarse periódicamente mediante indicadores como:

- Número de incidencias detectadas.
- Tiempo medio de resolución.
- Disponibilidad de los servicios.
- Cobertura de pruebas.
- Rendimiento de la aplicación.
- Errores registrados en producción.

La monitorización continua permitirá detectar tendencias antes de que se conviertan en problemas críticos.

---

# Principio final

La calidad técnica de BuscoHuella no dependerá únicamente de las tecnologías utilizadas, sino de la capacidad para mantener una arquitectura sencilla, bien documentada y preparada para evolucionar.

> **Regla del proyecto:** La mejor arquitectura no es la más compleja, sino aquella que puede mantenerse y evolucionar con confianza.

---

<a id="135-riesgos-operativos"></a>

## 13.5 Riesgos Operativos

Los riesgos operativos son aquellos derivados del funcionamiento diario de la plataforma, la gestión de los procesos internos y la disponibilidad de los recursos necesarios para mantener el servicio.

Durante la fase MVP, BuscoHuella operará con una estructura organizativa reducida, por lo que la eficiencia de los procesos y la automatización tendrán un papel fundamental para garantizar la continuidad del proyecto.

---

# Objetivos

La gestión de los riesgos operativos tiene como objetivos:

- Garantizar la continuidad del servicio.
- Reducir la dependencia de tareas manuales.
- Optimizar el tiempo dedicado a la operación diaria.
- Minimizar errores derivados de los procesos internos.
- Facilitar el crecimiento futuro de la plataforma.

---

# Riesgos operativos identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|---------|:-----------:|:-------:|------------|
| Dependencia del fundador | Alta | Muy alto | Documentación, automatización y estandarización de procesos. |
| Sobrecarga operativa | Alta | Alto | Priorización de tareas y automatización progresiva. |
| Retrasos en soporte o moderación | Media | Alto | Herramientas de gestión, priorización y protocolos definidos. |
| Falta de procedimientos documentados | Media | Medio | Documentación continua de procesos críticos. |
| Errores en operaciones manuales | Media | Medio | Automatización y listas de verificación para tareas repetitivas. |

---

# Áreas operativas

Durante el MVP, las principales actividades operativas incluirán:

- Atención a usuarios.
- Moderación de contenidos.
- Gestión de incidencias.
- Seguimiento de métricas.
- Administración de la plataforma.
- Mantenimiento técnico básico.
- Coordinación con organizaciones colaboradoras.

Siempre que sea posible, estas tareas deberán simplificarse o automatizarse para reducir la carga operativa.

---

# Estrategias de mitigación

Para minimizar los riesgos operativos se aplicarán las siguientes medidas:

- Documentar los procesos principales.
- Automatizar tareas repetitivas.
- Establecer procedimientos claros para incidencias.
- Priorizar las actividades de mayor impacto.
- Revisar periódicamente la carga de trabajo.
- Utilizar herramientas que mejoren la productividad.

El objetivo es que el crecimiento del proyecto no implique un aumento proporcional del esfuerzo operativo.

---

# Continuidad operativa

La continuidad del servicio dependerá de la capacidad para mantener procesos sencillos y bien documentados.

Por ello, cualquier tarea crítica deberá:

- Estar documentada.
- Poder repetirse siguiendo un procedimiento definido.
- Evitar depender exclusivamente del conocimiento de una única persona.
- Revisarse cuando cambie el funcionamiento del sistema.

Esta estrategia facilitará la incorporación de nuevos colaboradores en fases futuras.

---

# Revisión periódica

Los riesgos operativos deberán revisarse cuando:

- Aumente significativamente el número de usuarios.
- Se incorporen nuevas funcionalidades.
- Cambie la estructura organizativa del proyecto.
- Se detecten incidencias repetitivas.
- Aparezcan cuellos de botella en la operación diaria.

---

# Principio final

Una operación sencilla, bien organizada y apoyada por la automatización permitirá dedicar más tiempo a mejorar el producto y menos a resolver tareas repetitivas.

> **Regla del proyecto:** Cada proceso que pueda automatizarse libera tiempo para aportar más valor a los usuarios.

---

<a id="136-riesgos-financieros"></a>

## 13.6 Riesgos Financieros

Los riesgos financieros son aquellos que pueden afectar a la capacidad de BuscoHuella para desarrollar, mantener y hacer crecer la plataforma de forma sostenible.

Durante la fase MVP, el proyecto seguirá una estrategia de inversión progresiva, priorizando la validación del producto antes de realizar inversiones significativas.

La sostenibilidad económica será considerada un requisito para garantizar la continuidad del proyecto a largo plazo.

---

# Objetivos

La gestión de los riesgos financieros tiene como objetivos:

- Garantizar la continuidad económica del proyecto.
- Mantener una estructura de costes sostenible.
- Optimizar el uso de los recursos disponibles.
- Reducir la dependencia de financiación externa.
- Favorecer un crecimiento progresivo y responsable.

---

# Riesgos financieros identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|---------|:-----------:|:-------:|------------|
| Insuficiencia de recursos económicos | Media | Muy alto | Desarrollo por fases y control estricto del presupuesto. |
| Incremento inesperado de costes | Media | Alto | Seguimiento periódico de gastos y optimización de servicios. |
| Dependencia de financiación externa | Baja | Alto | Priorizar la autosuficiencia y la reinversión progresiva. |
| Baja rentabilidad del modelo | Media | Alto | Validar la propuesta de valor antes de ampliar la inversión. |
| Crecimiento superior a la capacidad económica | Baja | Alto | Escalado progresivo y planificación financiera. |

---

# Estrategias de mitigación

Para reducir los riesgos financieros se aplicarán las siguientes medidas:

- Mantener una infraestructura ajustada a las necesidades reales.
- Priorizar herramientas con planes gratuitos o de bajo coste.
- Revisar periódicamente los costes operativos.
- Evitar inversiones que no aporten valor demostrado.
- Planificar el crecimiento de forma escalonada.

La inversión deberá responder siempre a necesidades justificadas mediante datos y métricas.

---

# Seguimiento financiero

La evolución de los riesgos financieros se evaluará mediante indicadores como:

- Coste mensual de infraestructura.
- Coste operativo total.
- Coste por usuario activo.
- Evolución de los ingresos, cuando existan.
- Desviación respecto al presupuesto previsto.
- Capacidad para mantener la operación sin financiación adicional.

Estos indicadores permitirán detectar de forma temprana posibles desviaciones y adoptar medidas correctoras.

---

# Escalabilidad económica

El crecimiento de BuscoHuella deberá producirse de forma proporcional a la disponibilidad de recursos.

La incorporación de nuevas funcionalidades, servicios o áreas geográficas deberá planificarse teniendo en cuenta:

- La capacidad financiera del proyecto.
- El coste de mantenimiento futuro.
- El impacto esperado sobre la misión.
- La sostenibilidad a medio y largo plazo.

El objetivo será evitar un crecimiento que comprometa la estabilidad económica del proyecto.

---

# Principio final

La sostenibilidad financiera no consiste únicamente en reducir costes, sino en invertir los recursos disponibles allí donde generen un mayor impacto para los usuarios y para la misión de BuscoHuella.

> **Regla del proyecto:** Cada inversión debe aumentar el valor del producto sin comprometer su sostenibilidad futura.

---

<a id="137-riesgos-legales"></a>

## 13.7 Riesgos Legales

Los riesgos legales son aquellos derivados del incumplimiento de la normativa aplicable, de una gestión inadecuada de la información o de actuaciones de los usuarios que puedan generar responsabilidades para la plataforma.

Aunque BuscoHuella tenga un alcance inicial reducido durante el MVP, el cumplimiento normativo deberá considerarse un requisito esencial desde las primeras fases del desarrollo.

Una adecuada gestión de estos riesgos contribuirá a proteger tanto a los usuarios como al propio proyecto.

---

# Objetivos

La gestión de los riesgos legales tiene como objetivos:

- Garantizar el cumplimiento de la normativa vigente.
- Reducir la exposición a responsabilidades legales.
- Proteger los derechos de los usuarios.
- Favorecer la confianza en la plataforma.
- Facilitar el crecimiento futuro sobre una base jurídica sólida.

---

# Riesgos legales identificados

| Riesgo | Probabilidad | Impacto | Mitigación |
|---------|:-----------:|:-------:|------------|
| Incumplimiento de la normativa de protección de datos | Baja | Muy alto | Privacidad desde el diseño, minimización de datos y cumplimiento del RGPD y la LOPDGDD. |
| Publicación de contenidos ilícitos o fraudulentos | Media | Alto | Sistema de denuncias, moderación y procedimientos de retirada de contenido. |
| Uso no autorizado de imágenes o información | Media | Alto | Términos de uso claros y mecanismos para comunicar posibles infracciones. |
| Tratamiento inadecuado del consentimiento | Baja | Alto | Gestión transparente del consentimiento y registro de autorizaciones cuando resulte necesario. |
| Cambios en la normativa aplicable | Media | Medio | Revisión periódica del marco legal y actualización de las políticas de la plataforma. |

---

# Estrategias de mitigación

Para reducir los riesgos legales se aplicarán las siguientes medidas:

- Cumplimiento de la legislación vigente desde el diseño del producto.
- Políticas de privacidad y condiciones de uso accesibles y comprensibles.
- Procedimientos de moderación y gestión de incidencias.
- Registro de actuaciones relevantes cuando resulte necesario.
- Revisión periódica de la documentación legal.
- Asesoramiento jurídico especializado cuando la complejidad del proyecto lo requiera.

---

# Seguimiento

Los riesgos legales deberán revisarse especialmente cuando:

- Se modifique la normativa aplicable.
- Se incorporen nuevas funcionalidades que impliquen tratamiento de datos personales.
- Se produzca una expansión geográfica.
- Se establezcan acuerdos con organizaciones o administraciones públicas.
- Se detecten incidencias relacionadas con la privacidad o el uso indebido de la plataforma.

La evaluación continua permitirá adaptar la documentación y los procedimientos internos a las nuevas necesidades del proyecto.

---

# Relación con el marco normativo

La gestión de los riesgos legales se desarrollará conforme a los principios y obligaciones definidos en el apartado **12.10 Consideraciones Legales**, evitando duplicar criterios y manteniendo un marco normativo coherente en todo el proyecto.

---

# Principio final

El cumplimiento legal no debe entenderse como una obligación administrativa, sino como un elemento esencial para garantizar la confianza, la transparencia y la sostenibilidad de BuscoHuella.

> **Regla del proyecto:** Una plataforma que protege los derechos de sus usuarios protege también su propio futuro.

---

<a id="138-matriz-global-de-riesgos"></a>

## 13.8 Matriz Global de Riesgos

La siguiente matriz resume los principales riesgos identificados durante la fase MVP de BuscoHuella.

Su objetivo es ofrecer una visión global del nivel de exposición del proyecto, facilitando la priorización de las acciones preventivas y el seguimiento de su evolución.

La matriz deberá revisarse periódicamente conforme evolucionen la plataforma, la comunidad de usuarios y el contexto tecnológico o normativo.

---

# Matriz de riesgos

| Categoría | Riesgo | Probabilidad | Impacto | Prioridad |
|-----------|---------|:-----------:|:-------:|:---------:|
| Estratégico | No alcanzar masa crítica local | Media | Muy alto | 🔴 Muy alta |
| Estratégico | Crecimiento geográfico prematuro | Media | Alto | 🟠 Alta |
| Técnico | Retrasos en el desarrollo | Alta | Alto | 🔴 Muy alta |
| Técnico | Dependencia de servicios externos | Media | Alto | 🟠 Alta |
| Técnico | Vulnerabilidades de seguridad | Media | Muy alto | 🔴 Muy alta |
| Operativo | Dependencia del fundador | Alta | Muy alto | 🔴 Muy alta |
| Operativo | Sobrecarga operativa | Alta | Alto | 🔴 Muy alta |
| Financiero | Insuficiencia de recursos económicos | Media | Muy alto | 🔴 Muy alta |
| Financiero | Incremento inesperado de costes | Media | Alto | 🟠 Alta |
| Legal | Incumplimiento normativo | Baja | Muy alto | 🟠 Alta |
| Legal | Publicación de contenidos ilícitos | Media | Alto | 🟠 Alta |

---

# Interpretación de prioridades

| Prioridad | Significado |
|-----------|-------------|
| 🔴 Muy alta | Requiere seguimiento continuo y medidas preventivas desde el inicio del proyecto. |
| 🟠 Alta | Debe contar con un plan de mitigación y revisarse periódicamente. |
| 🟡 Media | Requiere monitorización y evaluación conforme evolucione el proyecto. |
| 🟢 Baja | Riesgo controlado. Se revisará únicamente cuando cambie el contexto. |

---

# Revisión de la matriz

La matriz de riesgos deberá actualizarse cuando ocurra cualquiera de las siguientes situaciones:

- Se incorporen nuevas funcionalidades relevantes.
- Cambie la arquitectura del sistema.
- Exista una modificación significativa del modelo de negocio.
- Se produzca la expansión geográfica de la plataforma.
- Cambie la normativa aplicable.
- Aparezcan nuevos riesgos identificados durante la operación del servicio.

Cada revisión deberá reflejar el estado real del proyecto en ese momento, permitiendo adaptar las prioridades y las estrategias de mitigación.

---

# Relación con la gestión del proyecto

La matriz de riesgos servirá como herramienta de apoyo para:

- La planificación del roadmap.
- La priorización de desarrollos.
- La asignación de recursos.
- La toma de decisiones estratégicas.
- La evaluación de la evolución del proyecto.

Su contenido deberá utilizarse conjuntamente con la matriz de decisión, las métricas del MVP y el sistema de gobernanza definidos en este Documento Maestro.

---

# Principio final

La gestión de riesgos es un proceso continuo que acompaña al desarrollo del proyecto durante todo su ciclo de vida.

> **Regla del proyecto:** Un riesgo controlado deja de ser una amenaza para convertirse en una variable gestionable.

---

<a id="139-seguimiento-y-revision"></a>

## 13.9 Seguimiento y Revisión

La gestión de riesgos de BuscoHuella será un proceso continuo y evolutivo.

Los riesgos identificados durante el MVP no deberán considerarse definitivos, sino elementos dinámicos cuya evaluación podrá modificarse conforme evolucionen el producto, la comunidad de usuarios y el entorno en el que opera la plataforma.

El seguimiento periódico permitirá detectar cambios de contexto, anticipar problemas y adaptar las estrategias de mitigación antes de que los riesgos lleguen a materializarse.

---

# Objetivos del seguimiento

El proceso de revisión tiene como finalidad:

- Detectar nuevos riesgos.
- Revisar la probabilidad e impacto de los riesgos existentes.
- Evaluar la eficacia de las medidas de mitigación.
- Identificar oportunidades de mejora.
- Actualizar las prioridades del proyecto.

---

# Cuándo revisar los riesgos

La matriz de riesgos deberá revisarse, como mínimo, cuando se produzca alguna de las siguientes situaciones:

- Finalización de un hito importante del roadmap.
- Incorporación de nuevas funcionalidades.
- Cambios relevantes en la arquitectura.
- Integración de nuevos servicios externos.
- Modificaciones del marco legal aplicable.
- Incremento significativo del número de usuarios.
- Aparición de incidencias críticas.
- Expansión geográfica del proyecto.

Además de estas revisiones extraordinarias, se recomienda realizar una revisión completa de riesgos al finalizar cada fase importante del desarrollo.

---

# Proceso de revisión

Cada revisión deberá seguir, al menos, las siguientes etapas:

1. Identificar nuevos riesgos.
2. Revisar los riesgos existentes.
3. Evaluar la eficacia de las medidas de mitigación.
4. Actualizar la prioridad de cada riesgo.
5. Documentar las decisiones adoptadas.

Este proceso permitirá mantener una visión actualizada del estado del proyecto y facilitará la toma de decisiones basada en evidencias.

---

# Indicadores de seguimiento

La evolución de los riesgos podrá apoyarse en indicadores como:

- Número de incidencias críticas.
- Tiempo medio de resolución.
- Disponibilidad del servicio.
- Evolución de usuarios activos.
- Recuperaciones de mascotas documentadas.
- Desviaciones presupuestarias.
- Incidencias relacionadas con seguridad o privacidad.

Estos indicadores deberán analizarse conjuntamente con las métricas definidas para el MVP.

---

# Mejora continua

Cada incidencia relevante deberá analizarse para identificar su causa y determinar posibles acciones preventivas.

El conocimiento adquirido durante la operación del sistema deberá incorporarse progresivamente a la documentación, los procedimientos y las futuras decisiones de arquitectura y producto.

La gestión de riesgos será, por tanto, un proceso de aprendizaje continuo.

---

# Principio final

Un sistema de gestión de riesgos solo resulta útil cuando evoluciona al mismo ritmo que el propio proyecto.

> **Regla del proyecto:** Revisar un riesgo no significa que haya fallado la planificación; significa que el proyecto está aprendiendo y adaptándose.

---

<a id="1310-principio-final"></a>

## 13.10 Principio Final

La gestión de riesgos forma parte de la estrategia de BuscoHuella y deberá integrarse en todas las decisiones relevantes del proyecto.

Identificar un riesgo no implica detener el desarrollo, sino comprender el contexto, valorar las posibles consecuencias y adoptar las medidas necesarias para reducir su probabilidad o minimizar su impacto.

Durante el MVP, la prioridad será mantener un equilibrio entre innovación, velocidad de desarrollo y estabilidad del producto, evitando asumir riesgos innecesarios que puedan comprometer la misión principal de la plataforma.

La evolución del proyecto, la incorporación de nuevas tecnologías y el crecimiento de la comunidad exigirán revisar periódicamente la evaluación de riesgos y adaptar las estrategias de mitigación cuando sea necesario.

Una gestión responsable de los riesgos permitirá construir una plataforma más robusta, fiable y preparada para evolucionar de forma sostenible.

---

> **Principio del capítulo:** La mejor estrategia no consiste en evitar todos los riesgos, sino en conocerlos, priorizarlos y gestionarlos de forma consciente.

> **Regla del proyecto:** Cada decisión deberá buscar el equilibrio entre innovación, sostenibilidad y la misión principal de BuscoHuella: aumentar la probabilidad de recuperar mascotas perdidas.

---

<a id="14-anexos"></a>

# 14. Anexos

Los anexos recopilan la documentación técnica y funcional que complementa este Documento Maestro.

Su objetivo es evitar duplicidades, mantener el documento principal centrado en la visión global del proyecto y facilitar la evolución independiente de cada área técnica.

Cada anexo constituye una fuente de referencia especializada que podrá evolucionar sin necesidad de modificar la estructura principal del Documento Maestro.

Los anexos deberán mantenerse sincronizados con la arquitectura, el código y las decisiones aprobadas durante el desarrollo del proyecto.

---

<a id="141-anexo-a-arquitectura-tecnica-detallada"></a>

## 14.1 Anexo A — Arquitectura Técnica Detallada

Este anexo recoge toda la documentación relacionada con la arquitectura técnica de BuscoHuella.

Incluye, entre otros aspectos:

- Arquitectura general del sistema.
- Diagramas de componentes.
- Arquitectura frontend.
- Arquitectura backend.
- Integración con Supabase.
- Sistema de autenticación.
- Arquitectura de mapas.
- Servicios externos.
- Flujos de comunicación.
- Estrategia de despliegue.
- Escalabilidad prevista.

La documentación técnica deberá mantenerse alineada con las decisiones arquitectónicas aprobadas mediante los correspondientes registros ADR.

**Documentación de referencia:**

```text
docs/technical/ARCHITECTURE.md
```

---

<a id="142-anexo-b-especificaciones-base-de-datos"></a>

## 14.2 Anexo B — Especificaciones de Base de Datos

Este anexo recoge la estructura y diseño del modelo de datos de BuscoHuella.

Su objetivo es mantener documentada la evolución de la información almacenada y garantizar coherencia entre las diferentes capas del sistema.

Incluye:

- Modelo entidad-relación.
- Tablas principales.
- Relaciones entre entidades.
- Campos obligatorios y opcionales.
- Índices.
- Restricciones.
- Políticas de acceso.
- Migraciones.
- Estrategia de seguridad de datos.

La estructura de base de datos deberá evolucionar siguiendo los principios definidos en la arquitectura del proyecto:

- Simplicidad durante el MVP.
- Escalabilidad progresiva.
- Seguridad por diseño.
- Minimización de datos.

**Documentación de referencia:**

```text
docs/database/DATABASE_SCHEMA.md
supabase/migrations/
```

---

<a id="143-anexo-c-catalogos-de-razas"></a>

## 14.3 Anexo C — Catálogos de Razas y Datos Maestros

Este anexo recoge los datos maestros utilizados por la plataforma para la gestión de mascotas.

Incluye información estructurada como:

- Especies.
- Razas.
- Tamaños.
- Características identificativas.
- Categorías de mascotas.

El objetivo es mejorar la calidad de los datos introducidos por los usuarios y facilitar futuras funcionalidades relacionadas con:

- Búsquedas avanzadas.
- Filtros.
- Identificación de mascotas.
- Estadísticas del sistema.

Durante el MVP se priorizará un catálogo funcional y ligero, evitando introducir complejidad innecesaria antes de validar la necesidad real.

---

<a id="144-anexo-d-glosario-terminos-tecnicos"></a>

## 14.4 Anexo D — Glosario de Términos Técnicos

Este anexo define los principales conceptos utilizados dentro de la documentación de BuscoHuella.

Su objetivo es facilitar la comprensión del proyecto entre perfiles técnicos y no técnicos.

| Término | Definición |
|---------|------------|
| MVP | Producto mínimo viable utilizado para validar una hipótesis de negocio. |
| Usuario | Persona que utiliza la plataforma para gestionar información o participar en recuperaciones. |
| Mascota perdida | Registro creado cuando una mascota desaparece y requiere ayuda comunitaria. |
| Avistamiento | Información aportada por usuarios sobre una posible localización de una mascota. |
| Red local | Comunidad de usuarios concentrada en una zona geográfica concreta. |
| Densidad de usuarios | Cantidad de usuarios activos dentro de una zona determinada. |
| Supabase | Plataforma backend utilizada para servicios como base de datos, autenticación y almacenamiento. |
| ADR | Architecture Decision Record. Registro de decisiones arquitectónicas importantes. |
| DR | Decision Record. Registro de decisiones rechazadas o pospuestas. |
| IA-First | Enfoque donde la inteligencia artificial se utiliza como herramienta de aceleración y soporte. |
| RGPD | Reglamento General de Protección de Datos europeo. |

---

<a id="145-anexo-e-historial-de-decisiones-estrategicas"></a>

## 14.5 Anexo E — Historial de Decisiones Estratégicas

Este anexo recoge las decisiones relevantes tomadas durante la evolución de BuscoHuella.

Su objetivo es mantener memoria del proyecto y comprender el motivo detrás de decisiones importantes.

Incluye:

- Cambios de arquitectura.
- Decisiones de producto.
- Cambios de estrategia.
- Funcionalidades descartadas.
- Justificación de prioridades.
- Aprendizajes obtenidos.

Cada decisión importante deberá incluir:

| Campo | Descripción |
|-------|-------------|
| Fecha | Momento en el que se tomó la decisión. |
| Contexto | Situación que originó la decisión. |
| Decisión | Acción seleccionada. |
| Alternativas consideradas | Opciones evaluadas. |
| Motivo | Justificación principal. |
| Impacto esperado | Resultado previsto. |

Los registros completos se mantendrán dentro del apartado:

```text
15. Historial de Decisiones (ADR)
```

---

<a id="151-estado-actual"></a>

## 15.1 Estado Actual

BuscoHuella se encuentra actualmente en fase **Pre-MVP**, con la definición estratégica, funcional y arquitectónica completada.

El proyecto ha superado la fase inicial de conceptualización y se encuentra en transición hacia la fase de construcción del producto mínimo viable.

Actualmente se dispone de:

- Definición del problema y oportunidad de mercado.
- Validación inicial de interés mediante landing page y lista de espera.
- Definición del público objetivo y usuarios principales.
- Diseño de la propuesta de valor.
- Definición del alcance del MVP.
- Arquitectura tecnológica definida.
- Modelo de datos diseñado.
- Estrategia inicial de adquisición de usuarios.
- Roadmap de evolución del producto.

### Estado de Validación

La validación inicial ha mostrado señales positivas:

| Elemento | Estado |
|----------|--------|
| Landing page pública | ✅ Disponible |
| Lista de espera | ✅ +170 usuarios registrados |
| Interés de propietarios de mascotas | ✅ Validado inicialmente |
| Contacto con protectoras locales | ✅ Iniciado |
| Producto funcional MVP | 🔄 En desarrollo |
| Usuarios activos reales | ⏳ Pendiente de lanzamiento |
| Reencuentros documentados | ⏳ Pendiente de validación |

Esta validación inicial confirma la existencia de un problema real y una necesidad potencial, aunque todavía no demuestra un **Product-Market Fit**.

El siguiente objetivo estratégico es transformar el interés inicial en uso real mediante un MVP funcional desplegado en una zona geográfica controlada.

---

### Estado Técnico

La arquitectura técnica está definida bajo un modelo **Backend as a Service (BaaS)** utilizando Supabase como plataforma principal.

Stack definido:

| Área | Tecnología |
|------|------------|
| Aplicación móvil | React Native + Expo |
| Landing Web | Next.js |
| Backend | Supabase |
| Base de datos | PostgreSQL |
| Autenticación | Supabase Auth |
| Storage | Supabase Storage |
| Tiempo Real | Supabase Realtime |
| Estado global | Zustand |
| Mapas | React Native Maps |
| Notificaciones | Expo Notifications |

La arquitectura ha sido diseñada para permitir una evolución progresiva desde un MVP sencillo hacia una plataforma escalable.

---

### Situación Estratégica

La prioridad actual del proyecto es:

> Construir la versión mínima necesaria para demostrar que una comunidad hiperlocal puede acelerar la recuperación de mascotas perdidas.

Durante esta fase se evitará añadir funcionalidades no esenciales.

Las decisiones actuales siguen tres principios:

- Validar antes de escalar.
- Medir antes de optimizar.
- Resolver un problema concreto antes de ampliar el producto.

El éxito de esta fase no se medirá por la cantidad de funcionalidades desarrolladas, sino por la capacidad de generar primeros casos reales de ayuda y reencuentro entre mascotas y familias.

---

<a id="152-situacion-actual-del-mvp"></a>

## 15.2 Situación Actual del MVP

El MVP de BuscoHuella tiene como objetivo validar la hipótesis principal del proyecto:

> Una comunidad local conectada mediante una plataforma digital puede aumentar las probabilidades de encontrar mascotas perdidas frente a los métodos actuales fragmentados.

El MVP estará limitado intencionadamente a las funcionalidades esenciales necesarias para validar esta hipótesis.

---

## Alcance Actual

El producto mínimo viable contempla los siguientes módulos principales:

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| Registro e inicio de sesión | 🔄 En desarrollo | Creación de cuentas y gestión básica de usuarios |
| Perfil de usuario | 🔄 En desarrollo | Información básica del propietario |
| Gestión de mascotas | 🔄 En desarrollo | Crear y gestionar perfiles de mascotas |
| Reporte de mascota perdida | 🔄 En desarrollo | Publicación de casos de pérdida |
| Reporte de mascota encontrada | 🔄 En desarrollo | Publicación de animales encontrados |
| Mapa colaborativo | 🔄 En desarrollo | Visualización geográfica de reportes |
| Avistamientos | 🔄 En desarrollo | Aportación ciudadana de información |
| Notificaciones básicas | ⏳ Pendiente | Avisos relacionados con reportes |
| Sistema de protectoras | ⏳ Pendiente | Gestión inicial de entidades colaboradoras |
| Administración interna | ⏳ Pendiente | Herramientas de moderación |

---

## Funcionalidades Incluidas en la Primera Versión

El MVP inicial permitirá:

### Usuarios

- Crear una cuenta.
- Acceder a la plataforma.
- Gestionar su perfil.
- Registrar sus mascotas.

### Mascotas

Cada mascota podrá disponer de:

- Nombre.
- Fotografía.
- Especie.
- Raza.
- Sexo.
- Edad.
- Características identificativas.

### Reportes

Los usuarios podrán:

- Crear un reporte de pérdida.
- Crear un reporte de hallazgo.
- Añadir ubicación.
- Añadir fotografías.
- Añadir información relevante.

### Comunidad

Los usuarios podrán:

- Consultar reportes cercanos.
- Informar de posibles avistamientos.
- Ayudar a difundir casos activos.

---

## Funcionalidades Fuera del MVP

Para evitar complejidad prematura quedan fuera inicialmente:

- Inteligencia artificial para reconocimiento facial animal.
- Integración con microchips.
- Integración directa con bases de datos oficiales.
- Marketplace de servicios.
- Chat interno avanzado.
- Red social completa.
- Expansión nacional.
- Aplicaciones específicas para ayuntamientos.
- Automatización avanzada de coincidencias.

Estas funcionalidades podrán incorporarse posteriormente únicamente si existen métricas que justifiquen su desarrollo.

---

## Estado de Construcción

Actualmente el MVP se encuentra en fase de preparación y desarrollo técnico.

Estado general:

| Área | Estado |
|------|--------|
| Definición producto | ✅ Completada |
| Arquitectura técnica | ✅ Definida |
| Diseño funcional | ✅ Definido |
| Modelo de datos | ✅ Diseñado |
| Desarrollo aplicación móvil | 🔄 En progreso |
| Backend Supabase | 🔄 En configuración |
| Testing usuarios reales | ⏳ Pendiente |
| Lanzamiento beta local | ⏳ Pendiente |

---

## Objetivo de la Fase MVP

El objetivo principal no es crear una plataforma completa, sino responder a las siguientes preguntas:

1. ¿Los usuarios registran sus mascotas antes de necesitar ayuda?
2. ¿Los usuarios utilizan la plataforma cuando una mascota desaparece?
3. ¿La comunidad aporta avistamientos útiles?
4. ¿Los reportes generan reencuentros reales?
5. ¿Protectoras locales encuentran valor en colaborar?

Si estas hipótesis se validan, BuscoHuella podrá avanzar hacia una fase de crecimiento y expansión.

---

<a id="153-roadmap-del-mvp"></a>

## 15.3 Roadmap del MVP

El desarrollo del MVP seguirá una estrategia progresiva basada en validación continua.

El objetivo no es lanzar todas las funcionalidades posibles, sino construir únicamente aquellas necesarias para comprobar que BuscoHuella resuelve un problema real.

El roadmap se divide en cuatro etapas:

1. Construcción del producto.
2. Validación interna.
3. Beta local controlada.
4. Lanzamiento inicial.

---

# Fase 1 — Construcción del MVP

**Objetivo:** Crear una primera versión funcional del producto.

### Duración estimada:
3-4 meses.

### Trabajo principal:

#### Aplicación móvil

- Configuración base React Native + Expo.
- Sistema de navegación.
- Sistema de autenticación.
- Gestión de usuarios.
- Gestión de mascotas.
- Creación de reportes.
- Mapa interactivo.
- Visualización de casos.

#### Backend

- Configuración Supabase.
- Diseño final de base de datos.
- Políticas de seguridad RLS.
- Storage para imágenes.
- Servicios de acceso a datos.

#### Calidad

- Tests principales.
- Gestión de errores.
- Preparación de entornos.
- Documentación técnica.

### Criterio de salida:

El MVP permite:

- Crear una cuenta.
- Registrar una mascota.
- Crear un reporte.
- Consultar reportes cercanos.
- Añadir un avistamiento.

---

# Fase 2 — Validación Interna

**Objetivo:** Garantizar estabilidad antes de abrirlo al público.

### Participantes:

- Fundador.
- Equipo cercano.
- Usuarios de confianza.

### Actividades:

- Pruebas completas de flujo.
- Detección de errores.
- Mejora de experiencia de usuario.
- Validación de mensajes y procesos.
- Revisión de seguridad.

### Métricas observadas:

- Errores encontrados.
- Tiempo necesario para crear un reporte.
- Comprensión del flujo.
- Problemas de usabilidad.

### Criterio de salida:

La aplicación permite realizar los flujos principales sin bloqueos críticos.

---

# Fase 3 — Beta Local Sabadell

**Objetivo:** Validar el comportamiento real en una comunidad limitada.

La beta se realizará inicialmente en:

> Sabadell y zona cercana.

La estrategia será hiperlocal para conseguir densidad suficiente de usuarios.

### Acciones:

- Incorporación de primeros usuarios.
- Colaboración con protectoras.
- Difusión mediante veterinarios.
- Activación de comunidad local.
- Recogida de feedback.

### Objetivos iniciales:

| Métrica | Objetivo |
|---------|----------|
| Usuarios registrados | 500 |
| Mascotas registradas | 100 |
| Reportes creados | 50 |
| Avistamientos | 25 |
| Reencuentros documentados | 5 |

### Criterio de salida:

Existe evidencia de uso real y primeros casos exitosos.

---

# Fase 4 — Lanzamiento Inicial

**Objetivo:** Convertir el MVP validado en un producto estable.

### Acciones:

- Publicación oficial.
- Mejora de onboarding.
- Campañas locales.
- Ampliación de colaboradores.
- Optimización técnica.

### Preparación futura:

Tras validar Sabadell se evaluará:

- Expansión territorial.
- Nuevas funcionalidades.
- Modelo de monetización.
- Acuerdos institucionales.

---

# Principios del Roadmap

Durante todas las fases se aplicarán los siguientes criterios:

### 1. Validación antes que desarrollo

Ninguna funcionalidad será añadida sin una hipótesis clara y una métrica asociada.

### 2. Comunidad antes que escala

El crecimiento inicial será geográfico, no nacional.

### 3. Simplicidad operacional

El MVP debe poder mantenerse con recursos limitados.

### 4. Datos antes que decisiones

Las siguientes fases dependerán de métricas reales de uso.

---

El roadmap del MVP finalizará cuando BuscoHuella demuestre que puede generar valor real para usuarios y mascotas dentro de una comunidad concreta.

---

<a id="154-criterios-de-validacion-del-mvp"></a>

## 15.4 Criterios de Validación del MVP

El objetivo principal del MVP de BuscoHuella es validar si una comunidad hiperlocal conectada mediante una plataforma digital puede mejorar la recuperación de mascotas perdidas.

La validación no se basará únicamente en el número de usuarios registrados, sino en la capacidad real del producto para generar utilidad y resolver el problema principal.

---

# Hipótesis Principal

> Si los propietarios de mascotas disponen de una plataforma local, rápida y colaborativa, aumentará la probabilidad de encontrar mascotas perdidas frente a los canales tradicionales actuales.

La validación del MVP determinará si esta hipótesis es correcta antes de invertir en crecimiento, expansión geográfica o nuevas funcionalidades.

---

# Criterios de Validación Principales

## 1. Activación de Usuarios

**Pregunta a validar:**

¿Los usuarios encuentran suficiente valor para completar el registro y configurar su perfil?

### Indicadores:

- Usuarios registrados.
- Porcentaje de usuarios que completan perfil.
- Mascotas registradas.
- Tiempo necesario para completar onboarding.

### Objetivo inicial:

- 500 usuarios registrados.
- 100 mascotas registradas.

---

## 2. Uso en Situaciones Reales

**Pregunta a validar:**

¿Los usuarios utilizan BuscoHuella cuando realmente necesitan ayuda?

### Indicadores:

- Número de reportes creados.
- Usuarios que crean reportes.
- Tiempo desde pérdida hasta publicación.
- Calidad de la información aportada.

### Objetivo inicial:

- 50 reportes reales.

---

## 3. Participación Comunitaria

**Pregunta a validar:**

¿La comunidad aporta información útil para resolver casos?

### Indicadores:

- Número de avistamientos.
- Usuarios colaboradores.
- Fotografías aportadas.
- Interacciones con reportes activos.

### Objetivo inicial:

- 25 avistamientos útiles.

---

## 4. Capacidad de Generar Reencuentros

**Pregunta a validar:**

¿La plataforma consigue conectar mascotas perdidas con sus familias?

Este es el criterio de validación más importante.

### Indicadores:

- Mascotas recuperadas.
- Tiempo hasta recuperación.
- Reportes solucionados.
- Confirmaciones de propietarios.

### Objetivo inicial:

- 5 reencuentros documentados.

---

## 5. Valor para Protectoras

**Pregunta a validar:**

¿Las entidades colaboradoras encuentran utilidad en la plataforma?

### Indicadores:

- Protectoras registradas.
- Casos gestionados.
- Feedback recibido.
- Uso recurrente.

### Objetivo inicial:

- Al menos 2 entidades colaboradoras activas.

---

# Señales Positivas de Validación

El MVP se considerará encaminado correctamente si aparecen:

✅ Usuarios que registran mascotas antes de una emergencia.  
✅ Personas que utilizan la plataforma ante pérdidas reales.  
✅ Vecinos que aportan avistamientos.  
✅ Protectoras que recomiendan utilizar BuscoHuella.  
✅ Casos reales solucionados mediante la plataforma.  
✅ Crecimiento orgánico por recomendación.

---

# Señales Negativas de Validación

Serán señales de alerta:

❌ Muchos registros pero poca actividad.  
❌ Usuarios que no completan el perfil de mascota.  
❌ Pocos reportes reales.  
❌ Falta de participación comunitaria.  
❌ Usuarios que prefieren seguir utilizando únicamente WhatsApp o Facebook.  
❌ Ausencia de colaboración con entidades locales.

---

# Decisiones Después de la Validación

Según los resultados obtenidos:

## Validación positiva

Se avanzará hacia:

- Beta ampliada.
- Más colaboradores.
- Nuevas zonas geográficas.
- Desarrollo de funcionalidades avanzadas.

## Validación parcial

Se realizará:

- Ajuste del producto.
- Mejora de experiencia de usuario.
- Revisión de propuesta de valor.
- Nuevos experimentos.

## Validación negativa

Se analizará:

- Cambio de enfoque.
- Redefinición del problema.
- Reducción de alcance.
- Posible pivotaje.

---

La validación del MVP será considerada exitosa cuando BuscoHuella demuestre que existe una comunidad activa capaz de generar resultados medibles: **más avistamientos, más colaboración y más mascotas reunidas con sus familias.**

---

<a id="155-scorecard-de-validacion-del-mvp"></a>

## 15.5 Scorecard de Validación del MVP

El Scorecard de Validación del MVP establece un sistema objetivo para evaluar si BuscoHuella está generando suficiente valor antes de avanzar hacia una fase de crecimiento.

La evaluación combina métricas de adquisición, activación, uso real, participación comunitaria e impacto generado.

La puntuación total será de **100 puntos**.

---

# Modelo de Evaluación

| Área | Peso | Objetivo |
|------|------|----------|
| Adquisición de usuarios | 15 puntos | Conseguir usuarios iniciales |
| Activación del usuario | 15 puntos | Que los usuarios completen acciones clave |
| Uso real del producto | 20 puntos | Resolver situaciones reales |
| Participación comunitaria | 15 puntos | Generar colaboración local |
| Reencuentros conseguidos | 25 puntos | Impacto principal del producto |
| Colaboración con entidades | 10 puntos | Validación B2B social |

**Puntuación máxima: 100 puntos**

---

# 1. Adquisición de Usuarios — 15 puntos

Evalúa la capacidad de atraer usuarios dentro de la zona inicial.

| Resultado | Puntos |
|-----------|--------|
| <100 usuarios registrados | 0 |
| 100-250 usuarios registrados | 5 |
| 250-500 usuarios registrados | 10 |
| >500 usuarios registrados | 15 |

---

# 2. Activación del Usuario — 15 puntos

Mide si los usuarios completan las acciones necesarias para obtener valor.

Indicadores:

- Registro completado.
- Perfil configurado.
- Mascota registrada.
- Permisos aceptados.

| Resultado | Puntos |
|-----------|--------|
| Activación <20% | 0 |
| Activación 20-40% | 5 |
| Activación 40-60% | 10 |
| Activación >60% | 15 |

---

# 3. Uso Real del Producto — 20 puntos

Evalúa si la plataforma se utiliza ante necesidades reales.

Indicadores:

- Reportes creados.
- Usuarios que utilizan el sistema.
- Calidad de la información.

| Resultado | Puntos |
|-----------|--------|
| <10 reportes reales | 0 |
| 10-25 reportes | 5 |
| 25-50 reportes | 10 |
| >50 reportes | 20 |

---

# 4. Participación Comunitaria — 15 puntos

Mide la capacidad de generar colaboración entre usuarios.

Indicadores:

- Avistamientos.
- Usuarios colaboradores.
- Difusión de casos.

| Resultado | Puntos |
|-----------|--------|
| Sin participación | 0 |
| Participación puntual | 5 |
| Comunidad activa | 10 |
| Alta colaboración recurrente | 15 |

---

# 5. Reencuentros Conseguidos — 25 puntos

Es la métrica principal del proyecto.

Indicadores:

- Mascotas recuperadas.
- Casos solucionados.
- Confirmaciones de propietarios.

| Resultado | Puntos |
|-----------|--------|
| 0 reencuentros | 0 |
| 1-2 reencuentros | 10 |
| 3-5 reencuentros | 20 |
| >5 reencuentros | 25 |

---

# 6. Colaboración con Entidades — 10 puntos

Evalúa la aceptación por parte de organizaciones relacionadas.

Indicadores:

- Protectoras colaboradoras.
- Veterinarios participantes.
- Uso recurrente.

| Resultado | Puntos |
|-----------|--------|
| Sin colaboradores | 0 |
| Primeros contactos | 3 |
| Colaboradores activos | 7 |
| Red consolidada | 10 |

---

# Interpretación del Resultado

| Puntuación | Interpretación | Acción |
|------------|----------------|--------|
| 0-40 | Validación insuficiente | Revisar hipótesis principal |
| 41-60 | Señales iniciales | Iterar producto |
| 61-80 | Validación positiva | Continuar crecimiento local |
| 81-100 | Validación fuerte | Preparar expansión |

---

# Criterio de Decisión Principal

BuscoHuella considerará validado el MVP cuando consiga:

- Puntuación mínima de **70/100**.
- Al menos **5 reencuentros documentados**.
- Usuarios activos en la zona inicial.
- Participación comunitaria demostrable.
- Primeras colaboraciones locales.

La puntuación no sustituye al análisis cualitativo, pero permite tomar decisiones basadas en datos y evitar continuar únicamente por intuición.

---

# Principio de Gestión

> El objetivo del MVP no es demostrar que la tecnología funciona. Es demostrar que una comunidad quiere utilizarla y que genera resultados reales.

---

<a id="156-metricas-clave-del-mvp-kpis"></a>

## 15.6 Métricas Clave del MVP (KPIs)

BuscoHuella utilizará un sistema de métricas orientado a medir la capacidad real de la plataforma para generar impacto.

Las métricas no estarán enfocadas únicamente en crecimiento de usuarios, sino en comprobar si el producto consigue su objetivo principal:

> Ayudar a reunir mascotas perdidas con sus familias mediante una comunidad local conectada.

---

# North Star Metric

## Mascotas reunidas con sus familias gracias a BuscoHuella

Esta será la métrica principal del proyecto.

Representa el valor real generado por la plataforma y mide directamente si BuscoHuella está resolviendo el problema para el que fue creado.

### Fórmula:

Número de mascotas recuperadas confirmadas mediante BuscoHuella


### Objetivo MVP:

- Conseguir los primeros 5 reencuentros documentados.

---

# 1. Métricas de Adquisición

Miden la capacidad de atraer usuarios a la plataforma.

| Métrica | Descripción | Objetivo MVP |
|---------|-------------|--------------|
| Usuarios registrados | Personas con cuenta creada | 500 |
| Nuevos usuarios semanales | Crecimiento de comunidad | Tendencia positiva |
| Fuente de adquisición | Canal de procedencia | Identificar canales efectivos |
| Coste de adquisición (CAC) | Coste medio por usuario conseguido | Mantener bajo |

---

# 2. Métricas de Activación

Miden si los usuarios realizan las acciones necesarias para obtener valor.

| Métrica | Descripción | Objetivo MVP |
|---------|-------------|--------------|
| Perfil completado | Usuarios que completan datos básicos | >60% |
| Mascotas registradas | Usuarios con al menos una mascota | 100 |
| Permisos aceptados | Usuarios que permiten funcionalidades clave | >70% |
| Tiempo hasta primera acción | Tiempo desde registro hasta uso inicial | Reducir progresivamente |

---

# 3. Métricas de Uso del Producto

Miden si la plataforma se utiliza realmente.

| Métrica | Descripción | Objetivo MVP |
|---------|-------------|--------------|
| Reportes creados | Casos de pérdida o hallazgo | 50 |
| Avistamientos registrados | Participación ciudadana | 25 |
| Usuarios activos mensuales (MAU) | Usuarios que utilizan la plataforma | Tendencia creciente |
| Usuarios recurrentes | Personas que vuelven a utilizarla | Incremento progresivo |

---

# 4. Métricas de Retención

Miden si el producto mantiene interés con el tiempo.

| Métrica | Descripción | Objetivo |
|---------|-------------|----------|
| Retención semana 1 | Usuarios que vuelven tras registrarse | Medir aprendizaje |
| Retención mes 1 | Usuarios activos después de 30 días | Mejorar progresivamente |
| Usuarios con mascotas activas | Usuarios preparados ante una emergencia | Aumentar |

La retención será especialmente importante porque BuscoHuella es una plataforma de uso ocasional: muchos usuarios no tendrán una emergencia frecuentemente.

---

# 5. Métricas de Comunidad

Miden la capacidad de colaboración local.

| Métrica | Descripción | Objetivo MVP |
|---------|-------------|--------------|
| Avistamientos por reporte | Participación alrededor de casos activos | Incrementar |
| Usuarios colaboradores | Personas que ayudan sin ser propietarios | Crear comunidad |
| Difusiones realizadas | Comparticiones de casos | Medir alcance |
| Tiempo hasta primer avistamiento | Velocidad de respuesta comunitaria | Reducir |

---

# 6. Métricas de Impacto

Miden el resultado final generado.

| Métrica | Descripción | Objetivo MVP |
|---------|-------------|--------------|
| Reencuentros documentados | Mascotas recuperadas | 5 |
| Tiempo medio de recuperación | Tiempo desde pérdida hasta solución | Reducir |
| Porcentaje de casos resueltos | Casos cerrados correctamente | Incrementar |
| Satisfacción del usuario | Valoración después de un caso | Alta |

---

# 7. Métricas Técnicas

Garantizan que la plataforma puede ofrecer una experiencia fiable.

| Métrica | Objetivo |
|---------|----------|
| Disponibilidad del servicio | >99% |
| Errores críticos | 0 |
| Tiempo respuesta API | <500 ms |
| Fallos de aplicación | Minimizar |
| Tiempo de resolución de incidencias | Reducir |

---

# 8. Métricas de Colaboradores

Evalúan la aceptación por parte de entidades externas.

| Métrica | Objetivo MVP |
|---------|--------------|
| Protectoras colaboradoras | 2 |
| Veterinarios colaboradores | Primeros acuerdos |
| Casos derivados por entidades | Validar utilidad |

---

# Principio de Medición

Durante el MVP se priorizarán métricas de valor frente a métricas superficiales.

No será considerado éxito:

- Tener muchos registros sin actividad.
- Tener muchas descargas sin uso.
- Crear funcionalidades sin usuarios.

Será considerado éxito:

- Usuarios preparados antes de una emergencia.
- Casos reales gestionados.
- Comunidad participativa.
- Mascotas recuperadas.

---

# Regla de Decisión

Toda nueva funcionalidad deberá responder a una pregunta:

> ¿Esta mejora aumenta la probabilidad de reunir una mascota con su familia?

Si la respuesta es negativa, deberá posponerse hasta una fase posterior.

---

<a id="157-proximos-hitos"></a>

## 15.7 Próximos Hitos

Los próximos hitos de BuscoHuella están orientados a transformar la fase actual de planificación y desarrollo en un producto funcional validado con usuarios reales.

La prioridad será avanzar de forma incremental, evitando construir funcionalidades innecesarias antes de comprobar el valor principal del producto.

---

# Hito 1 — Finalización de la Arquitectura Base

**Objetivo:** Disponer de una base técnica sólida para el desarrollo del MVP.

### Tareas:

- Finalizar configuración del proyecto móvil.
- Configurar estructura modular.
- Preparar Supabase.
- Definir tablas principales.
- Configurar autenticación.
- Preparar almacenamiento de imágenes.
- Definir políticas de seguridad RLS.

### Criterio de finalización:

La aplicación dispone de una arquitectura preparada para implementar las funcionalidades principales.

---

# Hito 2 — Desarrollo del Núcleo MVP

**Objetivo:** Crear la primera versión funcional.

### Funcionalidades:

- Registro e inicio de sesión.
- Gestión de usuarios.
- Registro de mascotas.
- Creación de reportes.
- Visualización de mapa.
- Gestión de avistamientos.

### Criterio de finalización:

Un usuario puede completar el flujo principal:

Crear cuenta
↓
Registrar mascota
↓
Crear reporte
↓
Recibir ayuda comunitaria
↓
Cerrar caso


---

# Hito 3 — Pruebas Internas

**Objetivo:** Garantizar estabilidad antes de abrir el producto.

### Tareas:

- Pruebas funcionales.
- Corrección de errores.
- Revisión de experiencia de usuario.
- Validación de permisos.
- Mejora de rendimiento.

### Criterio de finalización:

No existen errores críticos que impidan utilizar el producto.

---

# Hito 4 — Lanzamiento Beta Local

**Objetivo:** Validar BuscoHuella en un entorno real controlado.

Zona inicial:

> Sabadell y alrededores.

### Acciones:

- Incorporar primeros usuarios.
- Contactar con protectoras.
- Activar colaboración con veterinarios.
- Difusión en comunidades locales.
- Recoger feedback.

### Objetivos:

| Métrica | Objetivo |
|---------|----------|
| Usuarios registrados | 500 |
| Mascotas registradas | 100 |
| Reportes reales | 50 |
| Avistamientos | 25 |
| Reencuentros | 5 |

---

# Hito 5 — Validación del Modelo

**Objetivo:** Determinar si existe suficiente valor para continuar creciendo.

Se analizarán:

- Uso real del producto.
- Participación comunitaria.
- Casos resueltos.
- Retención.
- Feedback de usuarios.
- Interés de colaboradores.

### Decisión:

Según los resultados:

- Continuar crecimiento.
- Iterar producto.
- Redefinir estrategia.

---

# Hito 6 — Preparación de Escalado

**Objetivo:** Preparar la evolución tras validar el MVP.

Posibles líneas:

- Ampliación territorial.
- Nuevas colaboraciones.
- Mejoras de automatización.
- Nuevas funcionalidades.
- Modelo de sostenibilidad económica.

---

# Prioridades Actuales

El orden de prioridad de BuscoHuella es:

1. Construir un MVP funcional.
2. Conseguir primeros usuarios reales.
3. Generar primeros reencuentros.
4. Validar colaboración local.
5. Medir resultados.
6. Escalar únicamente después de validar.

---

# Principio Operativo

> Cada hito debe acercar al objetivo principal: conseguir que una mascota perdida tenga más posibilidades de volver con su familia.

El proyecto avanzará por evidencia real, no por cantidad de funcionalidades desarrolladas.

---

<a id="158-vision-de-evolucion-del-proyecto"></a>

## 15.8 Visión de Evolución del Proyecto

BuscoHuella nace como una solución hiperlocal enfocada en resolver un problema concreto: mejorar las posibilidades de recuperar mascotas perdidas mediante una comunidad conectada.

La evolución del proyecto seguirá un crecimiento progresivo basado en validación, impacto generado y necesidades reales de los usuarios.

La visión a largo plazo es convertir BuscoHuella en una plataforma de referencia para la protección, localización y colaboración ciudadana alrededor de mascotas.

---

# Fase 1 — Comunidad Hiperlocal

## Objetivo:

Validar el modelo en una zona geográfica concreta.

Zona inicial:

> Sabadell.

Prioridades:

- Conseguir usuarios activos.
- Generar primeros reencuentros.
- Crear comunidad local.
- Establecer colaboraciones con protectoras y veterinarios.

Resultado esperado:

Demostrar que la densidad local aumenta la eficacia de la plataforma.

---

# Fase 2 — Expansión Regional

## Objetivo:

Replicar el modelo en nuevas zonas con una comunidad preparada.

Posibles áreas:

- Vallès Occidental.
- Área Metropolitana de Barcelona.
- Otras ciudades con demanda demostrada.

Nuevas capacidades:

- Gestión de múltiples zonas.
- Más entidades colaboradoras.
- Mejoras de moderación.
- Sistemas de recomendación geográfica.

Condición de expansión:

La expansión únicamente se realizará cuando exista suficiente actividad y utilidad demostrada en la zona inicial.

---

# Fase 3 — Plataforma Nacional

## Objetivo:

Convertir BuscoHuella en una infraestructura colaborativa para la recuperación de mascotas en España.

Posibles funcionalidades:

- Red nacional de usuarios.
- Integración con entidades especializadas.
- Estadísticas globales.
- Herramientas avanzadas para protectoras.
- Mejoras de automatización.

El crecimiento nacional dependerá de haber validado previamente el modelo local.

---

# Fase 4 — Ecosistema de Bienestar Animal

## Objetivo:

Evolucionar desde una herramienta de búsqueda hacia una plataforma integral de colaboración animal.

Posibles líneas futuras:

### Inteligencia Artificial

- Reconocimiento visual de mascotas.
- Ayuda en identificación.
- Detección de coincidencias.

### Integraciones

- Servicios veterinarios.
- Entidades públicas.
- Organizaciones de protección animal.

### Datos e inteligencia territorial

- Mapas de incidencias.
- Análisis de zonas de riesgo.
- Información para campañas preventivas.

---

# Visión Institucional

A largo plazo, BuscoHuella puede convertirse en una herramienta de apoyo para:

- Protectoras.
- Clínicas veterinarias.
- Asociaciones animales.
- Administraciones públicas.

La relación institucional se desarrollará únicamente después de demostrar utilidad mediante usuarios reales y resultados medibles.

---

# Principios de Evolución

La evolución del proyecto seguirá cinco principios:

## 1. Impacto antes que escala

El objetivo principal será generar más reencuentros, no únicamente crecer en usuarios.

## 2. Comunidad antes que tecnología

La ventaja principal será la red de personas colaborando.

## 3. Simplicidad antes que complejidad

Las nuevas funcionalidades deberán resolver problemas reales.

## 4. Datos antes que decisiones

La expansión se basará en métricas y aprendizaje.

## 5. Confianza como activo principal

BuscoHuella debe convertirse en una plataforma fiable para usuarios y entidades colaboradoras.

---

# Visión Final

> BuscoHuella aspira a convertirse en la plataforma de referencia donde cualquier persona pueda ayudar a encontrar una mascota perdida, conectando ciudadanos, protectoras y entidades mediante tecnología, comunidad y colaboración.

El objetivo final no es únicamente localizar animales, sino crear una red donde perder una mascota deje de ser una situación de incertidumbre y pase a ser un problema colectivo con una respuesta organizada.