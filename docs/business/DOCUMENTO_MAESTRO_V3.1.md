# BUSCOHUELLA — DOCUMENTO MAESTRO v3.1
## Plataforma Digital para la Búsqueda y Protección de Mascotas

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
   8.1 [Fase 1 — MVP (Sin Ingresos)](#81-fase-1--mvp-sin-ingresos)  
   &nbsp;&nbsp;&nbsp;&nbsp;8.1.1 [Objetivo de Sostenibilidad](#811-objetivo-de-sostenibilidad)  
   &nbsp;&nbsp;&nbsp;&nbsp;8.1.2 [Unit Economics](#812-unit-economics)  
   8.2 [Fase 2 — Crecimiento](#82-fase-2--crecimiento)  
   8.3 [Fase 3 — Escala](#83-fase-3--escala)  
   8.4 [Reinversión Social](#84-reinversion-social)  
   8.5 [Supuestos Críticos](#85-supuestos-criticos)  
   8.6 [Hipótesis a Validar](#86-hipotesis-a-validar)  
   8.7 [DAFO Estratégico](#87-dafo-estrategico)
9. [Hoja de Ruta (Roadmap)](#9-hoja-de-ruta-roadmap)
   9.1 [Roadmap de Producto](#91-roadmap-de-producto)  
   9.2 [Roadmap Técnico (Próximos 3 Meses)](#92-roadmap-tecnico-proximos-3-meses)  
   9.3 [Estado Actual del MVP](#93-estado-actual-del-mvp)
10. [Competencia](#10-competencia)
    10.1 [Análisis Competitivo](#101-analisis-competitivo)  
    10.2 [Barreras de Entrada](#102-barreras-de-entrada)
11. [Métricas y KPIs](#11-metricas-y-kpis)
    11.1 [KPIs de Impacto Social](#111-kpis-de-impacto-social)  
    11.2 [Métricas de Tracción](#112-metricas-de-traccion)  
    11.3 [Métricas Técnicas](#113-metricas-tecnicas)  
    11.4 [Métricas de Negocio](#114-metricas-de-negocio)  
    11.5 [Métricas de Producto](#115-metricas-de-producto)  
    11.6 [Definición de Usuario Activo](#116-definicion-de-usuario-activo)  
    11.7 [Analítica de Producto](#117-analitica-de-producto)  
    11.8 [North Star Metric](#118-north-star-metric)  
    11.9 [Señales Tempranas de Product-Market Fit](#119-senales-tempranas-de-product-market-fit)  
    11.10 [Declaración de Impacto](#1110-declaracion-de-impacto)  
    11.11 [Dashboard del Fundador](#1111-dashboard-del-fundador)  
    11.12 [Definición de Product-Market Fit](#1112-definicion-de-product-market-fit)  
    11.13 [Métricas de Validación del MVP](#1113-metricas-de-validacion-del-mvp)  
    11.14 [Glosario de Métricas](#1114-glosario-de-metricas)
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
15. [Historial de Versiones](#15-historial-de-versiones)

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
| 1 | Lanzar MVP funcional | Web operativa en producción |
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
| **Marco legal** | La Ley 7/2023 obliga a digitalizar la gestión animal. |
| **Mercado** | El sector *Pet Tech* crece al 21% anual (Statista, 2026). |
| **Contexto social** | España se encuentra entre los países europeos con mayor volumen de abandono y recogida de animales. Hay presión social e institucional. |
| **Tecnología** | Stack maduro y accesible: Supabase, PostgreSQL, Next.js, Expo y geolocalización moderna. |

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

<a id="64-alcance-geografico">

### 6.4 Alcance Geográfico
El MVP de BuscoHuella se limitará inicialmente a Sabadell.
Se permitirá el registro desde cualquier ubicación, pero todas las acciones de validación, captación de usuarios y métricas de éxito estarán centradas en Sabadell.
La expansión territorial solo se evaluará tras validar:
500 usuarios registrados
100 mascotas registradas
5 reencuentros documentados
La prioridad estratégica es alcanzar densidad local antes de ampliar cobertura geográfica.

--- 

<a id="65-casos-de-uso-principales">

### 6.5 Casos de Uso Principales
Caso de Uso 1 — He perdido mi mascota
Objetivo: Difundir rápidamente la
System is currently busy. Please try again later.