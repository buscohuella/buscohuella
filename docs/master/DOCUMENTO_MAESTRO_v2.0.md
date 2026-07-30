# BUSCOHUELLA — DOCUMENTO MAESTRO v3.0
## Plataforma Digital para la Búsqueda y Protección de Mascotas

**Fecha**: Julio 2026  
**Versión**: 3.0 (Consolidada)  
**Nivel de madurez:** Pre-MVP (Build Phase)

**Última revisión:** Julio 2026
**Próxima revisión prevista:** Octubre 2026
**Autor**: Xavier Quesada Sevillano — CEO & Founder  
**Estado del proyecto**: En desarrollo activo (MVP)  
**Web**: https://buscohuella.es  
**Waitlist**: Más de 170 personas registradas en waitlist.

---

## TABLA DE CONTENIDOS

0. [Resumen Ejecutivo](#resumen-ejecutivo)
1. [Visión y Propósito](#vision)
2. [Problem Statement](#problem-statement)
3. [Target Audience](#target-audience)
4. [Propuesta de Valor](#propuesta-de-valor)
5. [Arquitectura Técnica](#arquitectura-tecnica)
6. [MVP — Alcance y Funcionalidades](#mvp)
7. [Modelo de Datos](#modelo-de-datos)
8. [Modelo de Negocio](#modelo-de-negocio)
9. [Roadmap](#roadmap)
10. [Competencia](#competencia)
11. [Métricas y KPIs](#metricas)
12. [Operaciones y Gobernanza](#operaciones)
13. [Riesgos y Mitigación](#riesgos)
14. [Anexos](#anexos)
15. [Historial de Decisiones](#historial-de-decisiones)

## DEFINICIONES

### Usuario Registrado
Persona que ha completado el proceso de registro y validación.

### Mascota Registrada
Mascota asociada a una cuenta de usuario.

### Reporte Activo
Caso de pérdida o hallazgo actualmente abierto.

### Reporte Resuelto
Caso cerrado por recuperación, identificación o cancelación.

### Avistamiento
Información aportada por terceros vinculada a un reporte.

### Reencuentro Documentado
Mascota recuperada cuya resolución ha sido confirmada por el propietario.

---
<a id="resumen-ejecutivo"></a>

# 0. RESUMEN EJECUTIVO

BuscoHuella es una plataforma digital colaborativa para ayudar a localizar mascotas perdidas mediante geolocalización, participación ciudadana y colaboración con protectoras.

El MVP se lanzará inicialmente en Sabadell con el objetivo de validar que una comunidad hiperlocal puede aumentar la tasa de recuperación de mascotas.

North Star Metric:

- Mascotas reunidas con sus familias.

Objetivos MVP:

- 500 usuarios registrados.
- 100 mascotas registradas.
- 50 reportes reales.
- 25 avistamientos.
- 5 reencuentros documentados.

El foco del proyecto es validar el problema antes de ampliar funcionalidades, monetización o expansión geográfica.

---

<a id="vision"></a>

## 1. VISIÓN Y PROPÓSITO

### North Star del Proyecto

La métrica principal de BuscoHuella es:

> Número de mascotas reunidas con sus familias gracias a BuscoHuella.

Toda decisión estratégica deberá contribuir directa o indirectamente a aumentar esta métrica.

### 1.1 Propósito Principal

Conectar personas, entidades y comunidades para encontrar, ayudar y proteger animales, creando un impacto social positivo y medible.

### 1.2 Visión a Largo Plazo

Ser la plataforma de referencia en España y Europa para la colaboración entre ciudadanos, asociaciones y entidades públicas en torno al bienestar animal, combinando tecnología, empatía y datos.

### 1.2.1 Visión 2030

BuscoHuella aspira a convertirse en la infraestructura digital de referencia para la gestión colaborativa del bienestar animal en España.

La visión a largo plazo incluye:

- Recuperación de mascotas perdidas.
- Colaboración entre ciudadanos y protectoras.
- Herramientas para administraciones públicas.
- Datos e indicadores de bienestar animal.
- Expansión progresiva a nivel europeo.

La prioridad actual sigue siendo validar el MVP en Sabadell.

## Objetivos 2026

BuscoHuella establece los siguientes objetivos para el periodo julio-diciembre 2026:

- Lanzar MVP funcional.
- Validar uso real en Sabadell.
- Alcanzar 500 usuarios registrados.
- Registrar 100 mascotas.
- Obtener 1 protectora colaboradora.
- Conseguir los primeros reencuentros documentados.

El éxito del año 2026 no se medirá por ingresos sino por validación de la propuesta de valor.

## No Objetivos 2026

BuscoHuella NO pretende durante esta fase:

- Expandirse a nivel nacional.
- Desarrollar hardware propio.
- Competir con GPS para mascotas.
- Construir una red social.
- Generar beneficios económicos significativos.

El único objetivo es validar que la plataforma ayuda realmente a recuperar mascotas.

## Objetivos 2027

BuscoHuella establece los siguientes objetivos para el periodo enero-diciembre 2027:

- Validar Product-Market Fit local.
- Alcanzar 2.000 usuarios registrados.
- Conseguir 5 protectoras colaboradoras.
- Lanzar aplicación móvil.
- Expandirse al Vallès Occidental.

### 1.3 Misión (Qué hacemos hoy)

Desarrollamos una plataforma digital colaborativa para ayudar a localizar mascotas perdidas mediante geolocalización, participación ciudadana y colaboración con protectoras y entidades locales.

### 1.4 Frase Guía

> **"Cada minuto cuenta. Todos merecen volver a casa."**

## 1.5 PRINCIPIOS DEL PRODUCTO

### Principio 1 — Resolver un problema antes que añadir funcionalidades

BuscoHuella existe para ayudar a localizar mascotas perdidas y facilitar los reencuentros.

Toda funcionalidad nueva deberá responder a la pregunta:

> ¿Ayuda directamente a encontrar una mascota o mejorar la coordinación entre personas?

Si la respuesta es no, la funcionalidad deberá pasar al backlog.

---

### Principio 2 — Mobile First

La mayoría de usuarios utilizarán BuscoHuella desde un teléfono móvil durante una situación de urgencia.

Todas las decisiones de UX, diseño y desarrollo deberán priorizar la experiencia móvil.

---

### Principio 3 — Hiperlocal antes que global

BuscoHuella se construirá de forma progresiva:

1. Sabadell
2. Vallès Occidental
3. Cataluña
4. España
5. Europa

No se desarrollarán funcionalidades pensadas para una escala nacional hasta validar el modelo local.

---

### Principio 4 — Simplicidad Operativa

Cada nueva funcionalidad genera:

- Coste de desarrollo
- Coste de mantenimiento
- Coste de soporte
- Complejidad técnica

Se priorizarán soluciones simples, robustas y fáciles de mantener.

---

### Principio 5 — Datos Reales antes que Suposiciones

Las decisiones de producto se tomarán basadas en:

- Feedback de usuarios
- Uso real de la plataforma
- Métricas verificables

No se desarrollarán funcionalidades únicamente porque parezcan interesantes.

## 1.6 DECLARACIÓN DE ENFOQUE

BuscoHuella es una plataforma de recuperación de mascotas.

No es:

- Una red social.
- Un marketplace.
- Una aplicación veterinaria.
- Un GPS para mascotas.
- Una plataforma de comercio electrónico.

Toda decisión de producto deberá reforzar el objetivo principal:

Aumentar la probabilidad de que una mascota vuelva con su familia.

## 1.7 PRODUCT STRATEGY

BuscoHuella es un producto de uso esporádico.

A diferencia de redes sociales o aplicaciones de uso diario, los usuarios utilizan BuscoHuella principalmente durante situaciones concretas de pérdida o hallazgo de mascotas.

La estrategia de crecimiento no se basa en maximizar el uso diario sino en:

- Confianza.
- Utilidad en momentos críticos.
- Recomendación entre propietarios.
- Colaboración con entidades locales.
- Reencuentros reales documentados.

El objetivo es convertirse en la herramienta de referencia cuando una mascota desaparece o es encontrada.

---

## 2. PROBLEM STATEMENT

### 2.1 El Problema Real

- **292.000 perros y gatos** recogidos en protectoras en España en 2024 (máximo histórico).
- **75% de animales en refugios NO llevan microchip** o tienen datos desactualizados.
- Solo el **17% de las mascotas perdidas** se reencuentra con su familia.
- Las soluciones actuales están fragmentadas: grupos de WhatsApp, Facebook, apps desconectadas.
- **Nueva Ley 7/2023 de Bienestar Animal**: multas de 500-10.000€ por no comunicar la desaparición en 48h. Los ayuntamientos necesitan herramientas digitales para cumplir.

### 2.2 El Dolor del Usuario

| Usuario | Dolor |
|---------|-------|
| Dueño de mascota | "Mi perro se ha escapado. ¿Cómo aviso a mi barrio en minutos, no en horas?" |
| Protectora | "Recibimos animales encontrados pero no hay forma rápida de conectar con el dueño." |
| Ayuntamiento | "Necesitamos cumplir la ley y tener censo digital, pero no tenemos presupuesto para desarrollar una app." |

### 2.3 Por qué "Why Now"

- **Ley 7/2023** obliga a digitalizar la gestión animal.
- **Mercado Pet Tech crece al 21% anual** (Statista 2026).
- **España se encuentra entre los países europeos con mayor volumen de abandono y recogida de animales.** — hay presión social e institucional.
- **Tecnologías maduras**: Supabase, PostgreSQL, Next.js, Expo y geolocalización moderna.

---

<a id="target-audience"></a>

## 3. TARGET AUDIENCE

### 3.1 Usuario Principal (B2C)

**Dueño de mascota en Sabadell**
- Edad: 25-55 años
- Perfil: Usa WhatsApp, Instagram, Google Maps
- Necesidad: Seguridad y tranquilidad para su mascota
- Dispositivo: Smartphone (iOS/Android)

### 3.2 Usuario Secundario (B2B Social)

**Protectoras y ONGs locales**
- Ejemplo: Protectora Sabadell, CAAC Sabadell, SOS Gats
- Necesidad: Visibilidad digital, gestión de casos, conexión con ciudadanos

### 3.3 Usuario Futuro (B2G)

Ayuntamiento de Sabadell

Necesidad:
- Cumplimiento Ley 7/2023
- Estadísticas
- Gestión animal

Estado:
No forma parte del cliente objetivo del MVP.
Se considera una línea de crecimiento futura tras validar el producto con usuarios y protectoras.

### 3.3.1 Ley 7/2023: Obligaciones Municipales

La Ley 7/2023 incrementa las obligaciones administrativas relacionadas con la gestión y protección animal.

Las administraciones locales necesitan herramientas que faciliten:

- Seguimiento de incidencias relacionadas con animales.
- Obtención de estadísticas e indicadores.
- Coordinación con entidades colaboradoras.
- Apoyo a campañas de bienestar animal.
- Digitalización progresiva de procesos.

**Ayuntamiento de Sabadell**
- Necesidad: Cumplir Ley 7/2023, censo digital, estadísticas
- Puerta de entrada: Concejalía de Medio Ambiente / Bienestar Animal

### Ciclo de Adopción Institucional

La adopción municipal seguirá un proceso progresivo:

1. Contacto institucional.
2. Reuniones exploratorias.
3. Validación del problema.
4. Participación en piloto local.
5. Evaluación de resultados.
6. Proceso administrativo interno.
7. Aprobación presupuestaria.
8. Contratación o convenio.

BuscoHuella no asume una venta directa a administraciones públicas.

La estrategia consiste en demostrar utilidad mediante pilotos reales antes de cualquier proceso de contratación institucional.

## 3.4 Validación Inicial

Antes del lanzamiento del MVP se ha validado interés mediante:

- Landing page pública
- Captación orgánica
- Redes sociales
- Waitlist

Resultados:

- Más de 170 personas registradas
- Primeras conversaciones con protectoras locales
- Interés de propietarios de mascotas en Sabadell

Esta validación no demuestra product-market fit, pero sí indica interés inicial suficiente para justificar el desarrollo del MVP.

## 3.5 Impacto Esperado

BuscoHuella pretende:

- Reducir el tiempo medio de reencuentro.
- Incrementar la tasa de recuperación de mascotas.
- Mejorar la coordinación ciudadana.
- Facilitar el trabajo de protectoras.
- Reducir costes municipales asociados a animales perdidos.

## 3.6 Estrategia de Adopción Inicial

BuscoHuella seguirá una estrategia de densidad local.

El objetivo no es captar usuarios en toda España sino concentrar usuarios activos en una única zona geográfica.

### Fase 1

Sabadell.

Canales principales:

- Protectora local
- Clínicas veterinarias
- Redes sociales locales
- Grupos vecinales
- Boca a boca

### Métrica clave

Usuarios activos por km².

La utilidad del producto aumenta con la concentración de usuarios en una misma zona.

## 3.7 Estrategia Go-To-Market MVP

Objetivo:

Conseguir los primeros 100 usuarios activos.

Acciones:

- Campaña en grupos locales de Facebook.
- Colaboración con protectoras.
- Cartelería en veterinarios.
- Redes sociales.
- Programa de embajadores locales.

El crecimiento inicial será manual y altamente localizado.

### 3.8 Plan de Adquisición Inicial

Objetivo:
Alcanzar los primeros 500 usuarios registrados en Sabadell.

Canales prioritarios:

- Protectoras locales.
- Clínicas veterinarias.
- Redes sociales locales.
- Grupos vecinales.
- Programa de embajadores.

Objetivos orientativos:

- 5 veterinarios colaboradores → 100 usuarios.
- 2 protectoras colaboradoras → 100 usuarios.
- 10 embajadores locales → 150 usuarios.
- Redes sociales y contenido orgánico → 150 usuarios.

La adquisición inicial será manual, hiperlocal y orientada a generar densidad geográfica.

---

<a id="propuesta-de-valor"></a>

## 4. PROPUESTA DE VALOR

### 4.1 Elevator Pitch

> BuscoHuella es una plataforma digital colaborativa. Permite a los dueños de mascotas en Sabadell reportar animales perdidos o encontrados en tiempo real, conectando vecinos, protectoras y ayuntamiento en un mapa interactivo gratuito.

### 4.2 Propuesta de Valor por Segmento

| Segmento | Valor |
|----------|-------|
| **Ciudadanos** | Seguridad para su mascota, comunidad local, reencuentros rápidos |
| **Protectoras** | Visibilidad digital, gestión eficiente de casos, conexión con adoptantes |
| **Ayuntamiento** | Cumplimiento legal, censo digital, reducción de costes de gestión |

### 4.3 Diferenciación vs. Competencia

| Característica | BuscoHuella | Facebook/WhatsApp | Pawboost | Tractive |
|----------------|-------------|-------------------|----------|----------|
| Mapa colaborativo en tiempo real | ✅ Sí | ❌ No | ⚠️ Básico | ❌ No |
| Gratuito | ✅ Sí | ✅ Sí | ⚠️ Freemium | ❌ De pago |
| Conexión con protectoras locales | ✅ Sí | ❌ No | ❌ No | ❌ No |
| Orientado a España/UE | ✅ Sí | ⚠️ Parcial | ❌ EE.UU. | ❌ Global genérico |
| Sin hardware obligatorio | ✅ Sí | ✅ Sí | ✅ Sí | ❌ Requiere collar |
| Integración con ayuntamientos | ✅ Roadmap | ❌ No | ❌ No | ❌ No |

### 4.4 Ventaja Competitiva Sostenible

BuscoHuella no compite únicamente mediante tecnología.

Sus principales ventajas competitivas son:

- Comunidad hiperlocal.
- Colaboración con protectoras.
- Relación con entidades públicas.
- Base de datos propia de reportes y avistamientos.
- Efecto red generado por usuarios activos.

Cuantos más usuarios participan en una zona, mayor es el valor de la plataforma para todos los participantes.

### 4.5 Moat Estratégico

BuscoHuella construye ventajas acumulativas difíciles de replicar:

- Comunidad hiperlocal.
- Relaciones con protectoras.
- Relaciones institucionales.
- Datos geolocalizados históricos.
- Efecto red local.
- Confianza de la comunidad.

La combinación de estos elementos genera una barrera competitiva creciente a medida que aumenta la adopción.

## 4.6 Flywheel de Crecimiento

BuscoHuella genera valor mediante un ciclo de crecimiento basado en comunidad.

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

Cada nuevo usuario aumenta la probabilidad de éxito para el resto de usuarios de su zona.

La prioridad estratégica consiste en acelerar este ciclo dentro de una misma área geográfica antes de expandirse a nuevas zonas.

## 4.7 Efecto Red

BuscoHuella es un producto basado en densidad local.

El valor de la plataforma aumenta a medida que crece el número de usuarios activos dentro de una misma zona geográfica.

Cada nuevo usuario:

- Puede detectar mascotas perdidas.
- Puede aportar avistamientos.
- Puede compartir reportes.
- Puede acelerar reencuentros.

Por este motivo la estrategia inicial se centra exclusivamente en Sabadell.

La expansión geográfica solo se considerará cuando exista suficiente densidad local que garantice utilidad real para la comunidad.

## 4.8 Latency Requirements

BuscoHuella gestiona información sensible.

Los tiempos de respuesta deben optimizarse para:

- Reportes: p95 < 500 ms
- Avistamientos: p95 < 500 ms
- Mapas: p95 < 1 s
- Búsquedas: p95 < 500 ms
- Alertas: p99 < 1 s

Las latencias elevadas durante situaciones de emergencia pueden reducir la efectividad de la plataforma.

## 4.9 Quality Requirements

La calidad técnica se mide por: Availability, Scalability, Latency, Reliability, Security.

### 4.9.1 Availability Requirements

- SLA objetivo: 99.9%
- Downtime aceptable: 8.76 horas/año
- Latencia máxima p99: < 1 segundo
- Tiempo de recuperación: < 1 hora

### 4.9.2 Scalability Requirements

Escalabilidad MVP:

- Usuarios: 500 usuarios activos
- Mascotas: 100 mascotas
- Reportes: 50 activos
- Avistamientos: 100-200

La arquitectura debe soportar crecimiento:

- Usuarios: 1.000 → 10.000 → 100.000
- Reportes simultáneos: 10 → 100 → 1.000 → 10.000+
- Avistamientos/hora: 100 → 1.000 → 10.000+

Objetivo: escalar sin downtime y sin degradación del servicio.

### 4.9.3 Performance Requirements

- Tiempo de carga página: p95 < 2 segundos
- Tiempo respuesta API: p95 < 500 ms
- Creación reporte: < 1 segundo
- Búsqueda por mapa: < 500 ms
- Alertas push: < 1 segundo (máx 1 minuto)

### 4.9.4 Security Requirements

- Usuario registrado antes de cualquier acción
- OAuth 2.0 + JWT + Refresh Tokens
- Password: bcrypt
- API keys para servicios externos
- Rate limiting
- Protegido CSRF, XSS, SQL Injection
- Encriptación de datos sensibles
- Logging de auditoría

## 4.10 Design System

Diseño moderno, limpio, intuitivo y minimalista.

### Colores

- Primary: azul (#3b82f6)
- Secondary: naranja (#f97316)
- White: #ffffff
- Black: #000000
- Gray Scale: #f5f5f5 → #171717

### Tipografía

- Fuente: Inter
- Weights: 300, 400, 500, 600, 700

### Iconografía

- Feather Icons
- Font Awesome
- Material Icons

### Componentes UI

- Botones
- Inputs
- Tarjetas
- Modales
- Notificaciones
- Avatares
- Mapas

---

<a id="arquitectura-tecnica"></a>

# 5. ARQUITECTURA TÉCNICA

## 5.1 Arquitectura Oficial MVP v3

BuscoHuella adopta una arquitectura moderna optimizada para:

- Desarrollo rápido
- Escalabilidad
- Bajo mantenimiento
- Integración con herramientas de IA
- Equipo reducido

## Principios de Desarrollo

- Código simple antes que código inteligente.
- Documentación antes que implementación.
- Reutilizar antes que crear.
- Automatizar antes que escalar equipo.
- Seguridad antes que funcionalidades.
- Medir antes que optimizar.

### Stack Principal

| Capa | Tecnología |
|--------|--------|
| Monorepo | Turborepo |
| Frontend Web | Next.js 15 + React 19 + TypeScript |
| Aplicación Móvil | Expo React Native (Roadmap Fase 2) |
| Backend | Supabase |
| Base de Datos | PostgreSQL |
| Autenticación | Supabase Auth |
| Storage | Supabase Storage |
| Realtime | Supabase Realtime |
| Mapas y Geolocalización | Mapbox |
| UI Components | Tailwind CSS + shadcn/ui |
| Hosting Web | Vercel |
| Control de Versiones | GitHub |
| CI/CD | GitHub Actions |
| Monitorización | Sentry + UptimeRobot |
| Asistentes IA de arquitectura y desarrollo | ChatGPT + Codex |

---

## 5.2 Principios Arquitectónicos

### API First

Toda funcionalidad deberá estar diseñada para poder ser consumida desde:

- Web
- Aplicación móvil
- Servicios externos futuros

---

### Monorepo

Todo el proyecto vivirá en un único repositorio:

```text
buscohuella/
├── apps/
│   ├── web/
│   └── mobile/
│
├── packages/
│   ├── shared/
│   ├── ui/
│   └── types/
│
├── docs/
│
└── supabase/
```

### Escalabilidad Progresiva

No se implementarán microservicios durante las primeras fases.

La arquitectura inicial será suficientemente simple para ser mantenida por una sola persona.

### Seguridad por Diseño

- Row Level Security (RLS)
- RGPD
- Mínimo acceso necesario
- Datos cifrados en tránsito

### AI Ready

Toda la documentación deberá permitir que agentes de IA puedan:

- Comprender el sistema
- Generar código
- Revisar cambios
- Automatizar tareas

## 5.3 Architecture Decision Record (ADR-001)

### Decisión

BuscoHuella utilizará:

- Next.js 15
- Supabase
- PostgreSQL
- Mapbox

como stack oficial del MVP.

Expo React Native queda aprobado como tecnología oficial para la aplicación móvil, prevista para la Fase 2.

### Motivos

- Menor complejidad operativa.
- Mayor velocidad de desarrollo.
- Excelente integración con IA.
- Escalabilidad suficiente para las primeras fases.
- Menor coste de mantenimiento.

### Alternativas Evaluadas

- Symfony + Angular
- Laravel
- Django
- Firebase

### Estado

✅ Aceptado

BuscoHuella no depende de acuerdos institucionales para validar el producto.

La validación inicial se realizará exclusivamente con propietarios de mascotas y entidades colaboradoras locales.

La colaboración con administraciones públicas se considera una oportunidad de crecimiento posterior a la validación del modelo.

## ADR-002 — Estrategia Mobile

Decisión:
La aplicación móvil nativa no será desarrollada hasta validar el MVP web.

Estado:
Aceptado.

Motivo:
Reducir complejidad y acelerar validación.

## 5.4 Gestión de Deuda Técnica

La velocidad de desarrollo no deberá comprometer la mantenibilidad.

Se permitirá deuda técnica controlada durante el MVP siempre que:

- Esté documentada.
- Tenga impacto limitado.
- Exista un plan de corrección.

La deuda técnica crítica deberá resolverse antes de nuevas funcionalidades.

La simplicidad y estabilidad del sistema tendrán prioridad frente a la incorporación de características no validadas.

## 5.5 ENTORNOS Y DESPLIEGUE

BuscoHuella dispondrá de los siguientes entornos:

### Desarrollo (DEV)

Uso exclusivo para desarrollo y pruebas.

Características:

- Datos ficticios.
- Cambios frecuentes.
- Sin garantías de estabilidad.

### Staging (PRE)

Entorno de validación previo a producción.

Características:

- Réplica parcial de producción.
- Testing funcional.
- Validación manual de releases.

### Producción (PROD)

Entorno utilizado por usuarios reales.

Características:

- Alta disponibilidad.
- Monitorización activa.
- Backups automáticos.
- Acceso restringido.

---

### Flujo de Despliegue

1. Desarrollo local.
2. Pull Request.
3. Revisión.
4. Deploy automático en Staging.
5. Validación.
6. Deploy a Producción.

No se realizarán cambios manuales directamente en producción.

### 5.6.1 Dependencias Externas

BuscoHuella depende actualmente de los siguientes proveedores:

| Servicio | Proveedor | Criticidad |
|-----------|-----------|-----------|
| Hosting | Vercel | Alta |
| Base de datos | Supabase | Alta |
| Autenticación | Supabase Auth | Alta |
| Storage | Supabase Storage | Alta |
| Mapas | Mapbox | Alta |
| Repositorio | GitHub | Alta |
| Monitorización | Sentry | Media |
| Disponibilidad | UptimeRobot | Baja |

La sustitución de cualquiera de estos proveedores deberá evaluarse mediante un Architecture Decision Record (ADR).

## 5.7 Estrategia de Testing

Tipos de pruebas:

- Unit Tests
- Integration Tests
- End-to-End Tests

Flujos críticos:

- Registro
- Login
- Crear mascota
- Reportar pérdida
- Reportar hallazgo
- Añadir avistamiento

Toda release deberá validar estos flujos antes de producción.

---

<a id="mvp"></a>

## 6. MVP — ALCANCE Y FUNCIONALIDADES

### 6.1 Qué SÍ entra en el MVP (Fase 1)

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
| 10 | **Landing page** | buscohuella.es con waitlist funcional | ✅ Ya existe |

### 6.2 Qué NO entra en el MVP (Fase 2+)

| Funcionalidad | Fase estimada | Razón de exclusión |
|---------------|---------------|-------------------|
| IA de reconocimiento facial | Fase 3 | Requiere dataset + modelo + GPU |
| Blockchain / Token $HUE | Fase 4+ | Sin usuarios, sin utilidad real |
| Aplicación Móvil (Expo React Native) | Fase 2 | La PWA cubre inicialmente las necesidades del MVP |
| Panel de administración | Fase 2 | Se puede gestionar vía BD directamente |
| Suscripciones de pago | Fase 2 | Primero tracción, luego monetización |
| Chat entre usuarios | Fase 2 | Complejidad innecesaria para MVP |
| Gamificación / puntos | Fase 2 | Distracción del core |
| Integración REIAC/SEPRONA | Fase 3 | Requiere acuerdos institucionales |
| IoT / Collares inteligentes | Fase 4+ | Hardware + certificación = años |
| Gestión ganadera | Nunca (spin-off) | Fuera del core de mascotas |

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
[Ver    [Filtrar [Reportar
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

### 6.4 ALCANCE GEOGRÁFICO MVP

El MVP de BuscoHuella se limitará inicialmente a:

- Sabadell

Se permitirá el registro desde cualquier ubicación, pero todas las acciones de validación, captación de usuarios y métricas de éxito estarán centradas en Sabadell.

La expansión territorial solo se evaluará tras validar:

- 500 usuarios registrados
- 100 mascotas registradas
- 5 reencuentros documentados

La prioridad estratégica es alcanzar densidad local antes de ampliar cobertura geográfica.

---

### 6.5 CASOS DE USO PRINCIPALES

## Caso de Uso 1 — He perdido mi mascota

### Objetivo

Difundir rápidamente la desaparición para maximizar las posibilidades de reencuentro.

### Flujo

1. Usuario inicia sesión.
2. Selecciona una mascota registrada.
3. Pulsa "Reportar pérdida".
4. Añade información adicional.
5. Confirma ubicación.
6. Publica reporte.
7. El reporte aparece en el mapa.
8. Los usuarios cercanos reciben notificación.

### Resultado Esperado

La comunidad puede colaborar inmediatamente.

---

## Caso de Uso 2 — He encontrado una mascota

### Objetivo

Conectar rápidamente con el posible propietario.

### Flujo

1. Usuario abre BuscoHuella.
2. Pulsa "Mascota encontrada".
3. Sube fotografía.
4. Añade ubicación.
5. Publica reporte.

### Resultado Esperado

El reporte aparece en el mapa y puede ser relacionado con reportes de pérdida existentes.

---

## Caso de Uso 3 — He visto una mascota reportada

### Objetivo

Aportar información útil a un caso activo.

### Flujo

1. Usuario abre un reporte.
2. Pulsa "Añadir avistamiento".
3. Adjunta fotografía opcional.
4. Comparte ubicación.
5. Envía información.

### Resultado Esperado

El propietario recibe información actualizada sobre la posible localización.

---

## Caso de Uso 4 — Registrar una mascota

### Objetivo

Crear un perfil para una mascota antes de que se pierda.

### Flujo

1. Usuario se registra.
2. Pulsa "Mis mascotas".
3. Selecciona "Añadir mascota".
4. Rellena datos básicos:
   - Nombre
   - Especie (perro, gato, otro)
   - Raza
   - Color
   - Tamaño
   - Fecha de nacimiento
5. Sube fotografía.
6. Confirma registro.

### Resultado Esperado

Mascota disponible para asociarla a reportes futuros.

---

## Caso de Uso 5 — Filtrar reportes por zona

### Objetivo

Visualizar solo los casos relevantes para el usuario.

### Flujo

1. Usuario abre el mapa.
2. Se muestran todos los reportes activos en Sabadell por defecto.
3. Usuario puede:
   - Hacer zoom en un barrio
   - Dibujar un área personalizada
   - Seleccionar un radio (ej. 500m, 1km, 5km)

### Resultado Esperado

El mapa se actualiza dinámicamente.

---

### 6.6 Critical User Journeys

Los siguientes flujos se consideran críticos para la validación del MVP:

1. Registro de usuario.
2. Registro de mascota.
3. Reportar pérdida.
4. Reportar hallazgo.
5. Añadir avistamiento.
6. Recibir notificación.

Ninguna release podrá desplegarse si alguno de estos flujos falla.

Toda validación manual, testing o revisión funcional deberá incluir estos recorridos como prioridad absoluta.

---

### 6.7 MVP CONGELADO

### Funcionalidades Permitidas

- Registro e inicio de sesión
- Perfil de usuario
- Gestión de mascotas
- Reportes de pérdida
- Reportes de encontrado
- Mapa interactivo
- Avistamientos
- Notificaciones push
- Landing pública

---

## Funcionalidades Bloqueadas

Las siguientes funcionalidades NO podrán desarrollarse hasta validar el MVP:

- IA de reconocimiento
- Chat
- Marketplace
- QR inteligente
- Gamificación
- Sistema de puntos
- Blockchain
- Token $HUE
- Telemedicina
- Integraciones complejas
- Funciones B2G avanzadas

---

## Fuera de Alcance del Proyecto (2026-2027)

BuscoHuella no pretende competir en:

- GPS para mascotas
- Redes sociales generalistas
- E-commerce de productos
- Software veterinario
- Gestión de clínicas
- Seguros para mascotas

El foco seguirá siendo la localización y recuperación de mascotas perdidas.

---

## Criterios para Desbloquear Nuevas Funcionalidades

Mínimo:

- 500 usuarios registrados
- 100 mascotas registradas
- 50 reportes reales
- 3 meses de uso activo

Antes de alcanzar estos objetivos, toda la energía deberá centrarse en mejorar el núcleo del producto.

### 6.8 DEFINITION OF DONE

Una funcionalidad solo podrá considerarse terminada cuando cumpla todos los siguientes criterios:

- Implementación completada.
- Funcionalidad validada manualmente.
- Tests básicos ejecutados correctamente.
- Compatible con web.
- Compatible con móvil.
- Documentación actualizada.
- Revisada mediante IA.
- Sin errores críticos conocidos.

Cualquier funcionalidad que no cumpla todos los criterios permanecerá en estado "En desarrollo".

### 6.9 ÉXITO DEL MVP

El MVP se considerará validado cuando se cumplan simultáneamente:

- 500 usuarios registrados
- 100 mascotas registradas
- 50 reportes reales
- 25 avistamientos
- 1 protectora activa
- Al menos 5 reencuentros documentados

Hasta alcanzar estos objetivos no se ampliará significativamente el alcance del producto.

---

<a id="modelo-de-datos"></a>

## 7. MODELO DE DATOS

### 7.1 Esquema Entidad-Relación (Resumen)

Ver archivo completo: `docs/database/DATABASE_SCHEMA.md`

**Tablas principales:**

| Tabla | Propósito | Registros estimados (Año 1) |
|-------|-----------|----------------------------|
| `users` | Perfiles de usuario | 1.000 |
| `pets` | Mascotas registradas | 1.500 |
| `reports` | Reportes de perdido/encontrado (CORE) | 500 |
| `report_sightings` | Avistamientos vinculados a reportes | 1.000 |
| `shelters` | Protectoras y refugios | 10 |
| `notifications` | Notificaciones push/enviadas | 10.000 |

### 7.2 Decisiones de Diseño

- **UUID como PK en todas las tablas**: Permite sharding y escalado horizontal.
- **Geolocalización**: uso inicial de coordenadas GPS estándar.
- **PostGIS** se evaluará cuando el volumen de datos requiera búsquedas geoespaciales avanzadas.
- **JSONB para campos flexibles**: metadata de reportes sin alterar el esquema.
- **Soft deletes**: Nunca borrar datos, solo marcar como eliminados (auditoría).
- **Timestamps en todas las tablas**: `created_at`, `updated_at`.

### 7.3 Seguridad a Nivel de Base de Datos

- **Row Level Security (RLS)**: Implementado en PostgreSQL.
- **Cifrado en tránsito**: TLS 1.3 obligatorio.
- **Cifrado en reposo**: Gestionado por la infraestructura de Supabase.
- **Backups automáticos**: Diarios, retención 30 días.

## 7.4 MODELO DE DOMINIO

Las entidades principales del sistema son:

### Usuario

Representa a una persona registrada en BuscoHuella.

Puede:

- Registrar mascotas.
- Crear reportes.
- Añadir avistamientos.
- Recibir notificaciones.

---

### Mascota

Representa un animal asociado a un usuario.

Puede encontrarse en estado:

- Activa
- Perdida
- Recuperada

---

### Reporte

Representa un caso activo de:

- Mascota perdida
- Mascota encontrada

Puede recibir múltiples avistamientos.

---

### Avistamiento

Representa una observación vinculada a un reporte.

Incluye:

- Ubicación
- Fecha
- Descripción
- Fotografía opcional

---

### Protectora

Entidad colaboradora que puede participar en casos y validar información.

## 7.5 Eventos de Dominio

Los principales eventos del sistema son:

- UserRegistered
- PetCreated
- PetReportedLost
- PetReportedFound
- SightingCreated
- ReportResolved
- NotificationSent
- NotificationOpened

Estos eventos constituyen la base de la analítica de producto y futuras automatizaciones.

## 7.6 POLÍTICA DE CONSERVACIÓN DE DATOS

Los datos se conservarán de acuerdo con la normativa vigente.

Criterios iniciales:

- Usuarios eliminados: anonimización progresiva.
- Reportes cerrados: conservación histórica.
- Logs técnicos: 90 días.
- Notificaciones: 12 meses.

Las políticas definitivas se desarrollarán antes del lanzamiento público.

## 7.7 ESTADOS DEL REPORTE

Todo reporte deberá encontrarse en uno de los siguientes estados:

### OPEN
Reporte activo.

### PENDING_VERIFICATION
Información pendiente de validación.

### RESOLVED
Mascota localizada o propietario identificado.

### CLOSED
Caso cerrado manualmente.

### ARCHIVED
Caso histórico sin actividad.

---

<a id="modelo-de-negocio"></a>

## 8. MODELO DE NEGOCIO

### 8.1 Fase 1 — MVP (Meses 1-6): Sin ingresos

> **Objetivo**: Validar la propuesta. Construir base de usuarios. Demostrar valor al Ayuntamiento.

- Todo gratuito.
- Sin anuncios.
- Sin suscripciones.

## 8.1.1 Objetivo de Sostenibilidad

BuscoHuella no persigue rentabilidad inmediata.

La prioridad es alcanzar:

- Validación de mercado.
- Impacto social real.
- Comunidad activa.

La sostenibilidad económica deberá cubrir:

- Infraestructura.
- Operación.
- Desarrollo continuo.

antes de generar beneficios.

La generación de ingresos tendrá como objetivo principal garantizar la continuidad y escalabilidad del proyecto sin comprometer su misión social.

### 8.1.2 Unit Economics MVP

Durante la fase MVP el objetivo principal no es maximizar ingresos sino validar el producto manteniendo una estructura de costes sostenible.

Objetivos iniciales:

- Coste por usuario activo inferior a 0,50€/mes.
- Infraestructura inferior a 50€/mes.
- Coste marginal cercano a cero para nuevos usuarios.

El crecimiento deberá mantenerse dentro de los límites operativos asumibles para un proyecto bootstrapped.

### 8.2 Fase 2 — Crecimiento (Meses 7-18): Monetización ligera

| Fuente de ingreso | Descripción | % estimado |
|-------------------|-------------|------------|
| **Suscripción Premium** (B2C) | €4.99/mes: historial ilimitado, alertas avanzadas, estadísticas | 40% |
| **Licencias Protectoras** (B2B) | €19.99-49.99/mes: panel de gestión, estadísticas, verificación | 30% |
| **Licencias Ayuntamiento** (B2G) | €500-2.000/año: dashboard municipal, censo, estadísticas | 20% |
| **Patrocinios ESG** | Marcas pet-friendly: Royal Canin, Affinity... | 10% |

### 8.3 Fase 3 — Escala (Año 2+): Modelo sostenible

- Marketplace de servicios (comisiones 5-8%).
- API pública para terceros.
- Datos anonimizados para investigación (universidades).

### 8.4 Reinversión Social

- **10% de beneficios netos** → Fundación BuscoHuella (reforestación, educación).
- **Transparencia**: Publicación trimestral de impacto social.

## 8.5 SUPUESTOS CRÍTICOS

BuscoHuella basa su estrategia inicial en los siguientes supuestos:

- Los propietarios de mascotas utilizarán herramientas digitales durante una pérdida.
- Las protectoras locales estarán dispuestas a colaborar.
- La densidad local de usuarios aumenta la probabilidad de recuperación.
- La geolocalización aporta valor diferencial frente a redes sociales tradicionales.
- La adopción inicial puede lograrse mediante crecimiento orgánico.

Estos supuestos deberán validarse mediante métricas reales durante la fase MVP.

## 8.6 Hipótesis a Validar

El MVP existe para validar las siguientes hipótesis:

H1:
Los propietarios utilizarán BuscoHuella durante una pérdida real.

H2:
La geolocalización mejora la coordinación respecto a Facebook.

H3:
Las notificaciones de proximidad aumentan los avistamientos.

H4:
Las protectoras están dispuestas a participar.

H5:
Un enfoque hiperlocal genera suficiente densidad de usuarios.

---

<a id="roadmap"></a>

## 9. ROADMAP

### 9.1 Roadmap de Producto

| Fase | Periodo | Objetivo | Funcionalidades |
|------|---------|----------|-----------------|
| **Fase 0** | Jul-Ago 2026 | Fundamentos | Monorepo, Supabase, autenticación, modelo de datos, landing optimizada |
| **Fase 1** | Sep-Nov 2026 | MVP Piloto Sabadell | Registro de usuarios, mascotas, reportes perdido/encontrado, mapa colaborativo, avistamientos, notificaciones web push |
| **Fase 1.5** | Dic 2026 | Beta Cerrada | Validación con 100 usuarios reales, métricas de uso, corrección de errores y optimización |
| **Fase 2** | Ene-Mar 2027 | Validación y Crecimiento | Panel para protectoras, sistema premium, aplicación móvil Expo React Native, mejoras de escalabilidad |
| **Fase 3** | Abr-Jun 2027 | Integración Institucional | Dashboard municipal, estadísticas avanzadas, integración con organismos oficiales (REIAC, ayuntamientos) |
| **Fase 4** | Jul-Dic 2027 | Expansión Territorial | Despliegue en Cataluña y otras comunidades, IA básica para matching de fotografías y automatización de reportes |

### 9.2 Roadmap Técnico (Próximos 3 meses)

| Semana | Desarrollo | Objetivo |
|---------|------------|----------|
| S1-S2 | Setup Monorepo + Supabase + Auth | Infraestructura base |
| S3-S4 | Usuarios + Mascotas | Gestión de perfiles y mascotas |
| S5-S6 | Reportes Perdido/Encontrado | Core del producto |
| S7-S8 | Mapa + Geolocalización + Filtros | Visualización colaborativa |
| S9-S10 | Avistamientos + Notificaciones Push | Coordinación comunitaria |
| S11-S12 | Beta Testing + Optimización + Deploy | Lanzamiento piloto Sabadell |

## 9.3 Estado Actual del MVP (Julio 2026)

### Completado

- Landing pública operativa.
- Sistema de waitlist activo.
- Arquitectura técnica definida.
- Documento Maestro consolidado.
- Stack tecnológico validado.

### En Desarrollo

- Monorepo Turborepo.
- Integración Supabase.
- Sistema de autenticación.

### Pendiente

- Gestión de mascotas.
- Reportes de pérdida.
- Reportes de hallazgo.
- Avistamientos.
- Mapa colaborativo.
- Notificaciones push.

### Riesgo Principal

Alcanzar suficiente densidad local de usuarios en Sabadell para validar la utilidad real de la plataforma.

---

<a id="competencia"></a>

## 10. COMPETENCIA

### 10.1 Análisis Competitivo

| Competidor | País | Fortalezas | Debilidades | Nuestro Advantage |
|------------|------|------------|-------------|-------------------|
| **Pawboost** | EE.UU. | Gran base de usuarios, IA facial | Sin comunidad local, sin protectoras | Enfoque hiperlocal + protectoras |
| **Tractive** | Austria | GPS en tiempo real, hardware | Requiere collar (€50+), sin comunidad | Gratuito, sin hardware |
| **Petfinder** | EE.UU. | Adopciones masivas | Solo adopciones, sin pérdidas | Pérdidas + adopciones + comunidad |
| **Gudog** | España | Paseadores verificados | Solo paseos, sin seguridad | Seguridad + comunidad + mapa |
| **Facebook Groups** | Global | Gratuito, masivo | Sin geolocalización, caos informativo | Mapa organizado, notificaciones, verificación |
| **Apps municipales** | España | Oficialidad | Costosas, poco usadas, obsoletas | Gratuita, moderna, comunidad |

### 10.2 Barreras de Entrada que Construimos

1. **Efecto red local**: Cuanto más densidad de usuarios en Sabadell, más útil es.
2. **Datos de protectoras**: Relaciones personales que un competidor no puede replicar rápido.
3. **Integración B2G**: Convenio con ayuntamiento = barrera institucional.
4. **Marca y comunidad**: 170 personas ya esperan. Eso es tracción.

---

<a id="metricas"></a>

## 11. MÉTRICAS Y KPIs

### 11.1 KPIs de Impacto Social

Las métricas más importantes de BuscoHuella son aquellas relacionadas con el impacto generado en la comunidad y el bienestar animal.

- Mascotas recuperadas.
- Horas ahorradas en búsquedas.
- Tiempo medio de reencuentro.
- Protectoras colaboradoras.
- Municipios adheridos.
- Voluntarios activos.

Estas métricas tendrán prioridad estratégica sobre las métricas financieras durante la fase MVP.

### 11.2 Métricas de Tracción (Fase 1)

| Métrica | Objetivo Mes 3 | Objetivo Mes 6 | Cómo medir |
|---------|---------------|----------------|------------|
| Usuarios registrados | 200 | 500 | BBDD |
| Mascotas registradas | 300 | 800 | BBDD |
| Reportes activos | 50 | 150 | BBDD |
| Tiempo medio reencuentro | < 48h | < 24h | Encuesta + BBDD |
| Retención semanal (WAU/MAU) | 40% | 50% | Analytics |
| NPS (Net Promoter Score) | > 30 | > 50 | Encuesta |

### 11.3 Métricas Técnicas

| Métrica | Objetivo | Herramienta |
|---------|----------|-------------|
| Uptime | > 99% | UptimeRobot |
| Tiempo respuesta API | < 500ms | New Relic / Datadog |
| Tiempo carga mapa | < 2s | Lighthouse |
| Tasa de error | < 1% | Sentry |

### 11.4 Métricas de Negocio (Fase 2+)

| Métrica | Objetivo Año 1 | Objetivo Año 2 |
|---------|---------------|----------------|
| CAC (Coste Adquisición) | < €2 | < €1.5 |
| ARPU (Ingreso por usuario) | €0.50 | €2.00 |
| Churn mensual | < 10% | < 5% |
| LTV (Lifetime Value) | > €10 | > €30 |

### 11.5 Métricas de Producto

- Usuarios activos diarios (DAU)
- Usuarios activos semanales (WAU)
- Usuarios activos mensuales (MAU)
- Reportes creados por usuario
- Avistamientos por reporte
- Tiempo medio hasta primer avistamiento
- Conversión visitante → usuario registrado
- Conversión usuario → mascota registrada

### 11.6 Definición de Usuario Activo

Un usuario activo es aquel que realiza al menos una acción significativa durante el periodo analizado.

Acciones consideradas:

- Crear reporte
- Añadir avistamiento
- Registrar mascota
- Consultar mapa
- Abrir una notificación

No se considerará actividad únicamente iniciar sesión.

### 11.7 Analítica del Producto

Toda decisión de producto deberá apoyarse en datos reales obtenidos mediante eventos analíticos.

Eventos mínimos a medir:

- user_registered
- pet_created
- report_created
- sighting_created
- report_resolved
- notification_clicked

La analítica deberá permitir medir:

- Conversión de usuarios.
- Uso de funcionalidades.
- Retención.
- Actividad por zona geográfica.
- Eficacia de las notificaciones.

Las métricas obtenidas tendrán prioridad frente a opiniones o suposiciones.

### 11.8 North Star Metric

Número de mascotas reunidas con sus familias gracias a BuscoHuella.

Todas las decisiones de producto deberán contribuir directa o indirectamente a aumentar esta métrica.

### 11.9 Señales Tempranas de Product-Market Fit

BuscoHuella considerará que existe una señal temprana de Product-Market Fit cuando se cumplan simultáneamente varios de los siguientes indicadores:

- Más del 40% de los usuarios activos regresan mensualmente.
- Se producen reencuentros documentados de forma recurrente.
- Las protectoras recomiendan activamente la plataforma.
- Existen nuevos usuarios que llegan mediante recomendación.
- Los usuarios utilizan BuscoHuella durante situaciones reales de pérdida o hallazgo.

Estas señales serán consideradas más relevantes que cualquier métrica financiera durante la fase MVP.

Antes de alcanzar estas señales no se acelerará la expansión geográfica ni se incrementará significativamente el alcance funcional del producto.

---

### 11.10 Declaración de Impacto

BuscoHuella es una iniciativa tecnológica con propósito social.

El éxito del proyecto se medirá principalmente por:

- Mascotas reunidas con sus familias.
- Tiempo reducido en búsquedas.
- Colaboración ciudadana generada.
- Valor aportado a protectoras y administraciones.

La rentabilidad será considerada una consecuencia de generar valor real y sostenible para la comunidad.

### 11.11 Dashboard del Fundador

Las métricas que deberán visualizarse diariamente son:

### Impacto

- Mascotas recuperadas
- Reportes resueltos
- Tiempo medio de recuperación

### Comunidad

- Usuarios activos diarios (DAU)
- Usuarios activos semanales (WAU)
- Nuevos usuarios

### Producto

- Mascotas registradas
- Reportes creados
- Avistamientos registrados

### Crecimiento

- Conversión waitlist → usuario
- Conversión usuario → mascota registrada
- Conversión mascota → reporte

Estas métricas constituirán el panel principal de seguimiento del proyecto.

## 11.12 Definición de Product-Market Fit

BuscoHuella considerará alcanzado un Product-Market Fit inicial cuando se cumplan simultáneamente:

- Más de 1.000 usuarios registrados.
- Más de 300 usuarios activos mensuales.
- Al menos 20 reencuentros documentados.
- Retención mensual superior al 40%.
- Crecimiento orgánico superior al 25%.
- Protectoras recomendando activamente la plataforma.

Hasta alcanzar estos indicadores no se priorizará la expansión geográfica significativa.

## 11.13 MÉTRICAS DE VALIDACIÓN DEL MVP

El objetivo del MVP no es generar ingresos.

El objetivo es validar:

- Que los usuarios publican reportes.
- Que otros usuarios colaboran mediante avistamientos.
- Que se producen reencuentros reales.
- Que los usuarios regresan a utilizar la plataforma.

Las métricas de validación tendrán prioridad sobre cualquier métrica financiera durante la Fase 1.

---

<a id="operaciones"></a>

## 12. OPERACIONES Y GOBERNANZA 

### 12.1 Equipo Actual

| Rol | Persona | Dedicación | Responsabilidad |
|-----|---------|------------|-----------------|
| **CEO / Full-Stack Dev** | Xavier Quesada | 100% | Estrategia, desarrollo backend, frontend, DevOps |
| **Marketing / Community** | Colaboración voluntaria | Voluntaria | Redes sociales, contacto protectoras |
| **Secretaría / Contactos** | Colaboración voluntaria | Voluntaria | Email, agenda, contacto institucional |

### 12.2 Escalado de Equipo

Durante la fase MVP el proyecto se desarrollará mediante una combinación de:

- Founder (Product Owner)
- ChatGPT (Arquitectura y supervisión técnica)
- Codex (Implementación)
- Automatizaciones IA

La contratación de personal se evaluará únicamente tras validar:

- 500 usuarios registrados
- 100 mascotas registradas
- 50 reportes reales

Hasta entonces se priorizará la eficiencia operativa y el desarrollo asistido por IA.

## 12.3 Recursos Económicos

| Concepto | Coste mensual estimado (Fase 1) |
|-----------|---------------|
| Supabase | €0-25 |
| Vercel | €0 |
| Dominio | €1 |
| Email | €0-6 |
| Monitoring (Sentry/UptimeRobot) | €0 |
| GitHub | €0 |
| **Total estimado** | **€1-32** |

### 12.4 SLA MVP

BuscoHuella se ofrece en modalidad best effort durante la fase MVP.

### Objetivos internos de servicio

- Disponibilidad superior al 95%.
- Recuperación ante incidencias críticas en menos de 48 horas.
- Backups diarios automáticos.

### Consideraciones

Durante la fase MVP no existe garantía contractual de nivel de servicio (SLA).

Los objetivos anteriores constituyen compromisos operativos internos orientados a garantizar la continuidad del servicio mientras se valida el producto.

La definición de un SLA formal se evaluará tras alcanzar Product-Market Fit y disponer de recursos operativos suficientes.

## 12.5 DESARROLLO ASISTIDO POR IA

### Filosofía

BuscoHuella adopta una estrategia AI-First para acelerar el desarrollo, mejorar la calidad técnica y optimizar la toma de decisiones.

Las herramientas de IA actúan como asistentes especializados que apoyan al equipo humano, pero no sustituyen la responsabilidad final sobre el producto.

---

### Roles y Responsabilidades

#### Xavier Quesada (Product Owner)

Responsable de:

- Visión del proyecto
- Estrategia de producto
- Priorización
- Validación con usuarios
- Toma de decisiones finales
- Aprobación de cambios relevantes

#### Asistentes IA (ChatGPT, Codex y futuras herramientas)

Responsables de apoyar en:

- Arquitectura de software
- Diseño de sistemas
- Revisión técnica
- Generación de documentación
- Implementación de código
- Refactorización
- Testing
- Automatización
- Análisis y propuestas de mejora

---

### Principio de Responsabilidad

Las herramientas de IA pueden proponer, generar o revisar trabajo técnico.

La responsabilidad final sobre:

- Producto
- Código
- Seguridad
- Datos
- Cumplimiento legal

corresponde siempre al responsable humano del proyecto.

---

## Cumplimiento Normativo

BuscoHuella se diseñará cumpliendo:

- RGPD
- LOPDGDD
- Ley 7/2023 de Bienestar Animal
- Directrices de accesibilidad WCAG 2.2 AA

La privacidad y protección de datos serán requisitos obligatorios desde el diseño inicial del sistema.

---

### Regla Fundamental

Ninguna funcionalidad deberá implementarse sin existir previamente como documentación aprobada.

Orden obligatorio:

1. Idea
2. Documento
3. Diseño
4. Implementación
5. Test
6. Producción

La documentación constituye la fuente de verdad del proyecto.

---

## 12.5 IMPACTO SOCIAL

### Objetivos de Impacto

BuscoHuella busca generar un impacto medible en tres áreas:

#### Bienestar Animal

- Incrementar la tasa de recuperación de mascotas perdidas.
- Reducir el tiempo medio de reencuentro.
- Mejorar la visibilidad de animales encontrados.

#### Comunidad

- Fomentar la colaboración vecinal.
- Crear redes locales de ayuda.
- Facilitar la participación ciudadana.

#### Administración Pública

- Reducir costes asociados a la gestión de animales perdidos.
- Facilitar el cumplimiento de la Ley 7/2023.
- Proporcionar métricas e indicadores de bienestar animal.

### Indicadores de Impacto

- Mascotas recuperadas.
- Tiempo medio de recuperación.
- Avistamientos registrados.
- Usuarios activos.
- Protectoras colaboradoras.
- Municipios adheridos.

## 12.6 GOBERNANZA DEL PRODUCTO

### Fuente de Verdad

Este documento constituye la referencia principal del proyecto.

En caso de conflicto entre:

- Código
- Roadmaps
- Documentación secundaria
- Conversaciones
- Ideas pendientes

prevalecerá siempre este documento.

---

### Gestión de Cambios

Toda modificación relevante deberá:

1. Documentarse.
2. Justificarse.
3. Actualizar el historial de versiones.
4. Reflejarse en los documentos afectados.

---

### Criterio de Priorización

Las funcionalidades se priorizarán según el siguiente orden:

1. Impacto en la recuperación de mascotas.
2. Valor aportado a usuarios reales.
3. Coste de implementación.
4. Coste de mantenimiento futuro.
5. Alineación con la visión del proyecto.

---

### Regla de Alcance (Scope Control)

Toda nueva funcionalidad deberá cumplir al menos uno de los siguientes criterios:

- Mejorar la localización de mascotas perdidas.
- Mejorar la coordinación entre usuarios.
- Incrementar la tasa de recuperación.
- Reducir el tiempo de reencuentro.
- Facilitar la adopción por parte de la comunidad.

En caso contrario, la funcionalidad pasará al backlog de futuras evaluaciones.

---

### Propietario del Producto

El responsable final de las decisiones de producto es:

**Xavier Quesada Sevillano**
CEO & Founder de BuscoHuella

Las recomendaciones técnicas, estratégicas o de negocio podrán ser consideradas, pero la decisión final corresponderá siempre al Product Owner.

### Regla de No Complejidad Prematura

BuscoHuella evitará incorporar tecnologías, integraciones o funcionalidades
que no hayan sido justificadas mediante datos reales de uso.

La validación del problema siempre tendrá prioridad sobre la sofisticación técnica.

### Principios No Negociables

BuscoHuella nunca deberá:

- Vender datos personales.
- Priorizar ingresos frente a la recuperación de mascotas.
- Introducir publicidad invasiva durante una búsqueda activa.
- Comprometer la privacidad de usuarios o animales.
- Incrementar complejidad sin validación previa.

Estos principios prevalecerán sobre cualquier decisión comercial, tecnológica o estratégica.

## 12.7 Regla de Supervivencia del Proyecto

Ante cualquier duda estratégica, técnica o de producto se aplicará la siguiente prioridad:

1. Ayudar a encontrar mascotas.
2. Conseguir usuarios activos.
3. Conseguir reencuentros.
4. Mejorar retención.
5. Escalar.

Todo lo demás es secundario.

Cuando existan conflictos entre funcionalidades, prioridades o decisiones de negocio, prevalecerá siempre el criterio que contribuya más directamente a la recuperación de mascotas.

## 12.8 MATRIZ DE DECISIÓN

Toda nueva funcionalidad será evaluada mediante la siguiente matriz:

| Criterio | Peso |
|-----------|-------|
| Impacto en recuperación de mascotas | 40% |
| Valor para usuarios reales | 25% |
| Coste de desarrollo | 15% |
| Coste de mantenimiento | 10% |
| Alineación estratégica | 10% |

Las funcionalidades con mayor puntuación tendrán prioridad.

La recuperación de mascotas siempre prevalecerá sobre criterios comerciales.

## 12.9 CONSIDERACIONES LEGALES

BuscoHuella se desarrollará y operará conforme a la legislación vigente en materia de protección de datos, servicios digitales y bienestar animal.

El cumplimiento normativo constituye un requisito obligatorio del proyecto y deberá ser considerado desde el diseño inicial de cualquier funcionalidad.

---

### 12.9.1 Cumplimiento Normativo

BuscoHuella adoptará un enfoque de cumplimiento normativo desde el diseño (*Compliance by Design*).

Toda funcionalidad deberá evaluarse teniendo en cuenta:

- Protección de datos personales.
- Privacidad de los usuarios.
- Seguridad de la información.
- Bienestar animal.
- Derechos digitales.
- Accesibilidad.
- Responsabilidad sobre contenidos publicados.

El cumplimiento legal no se considerará una fase posterior del proyecto, sino un requisito transversal de diseño, desarrollo y operación.

---

### 12.9.2 RGPD

BuscoHuella cumplirá con el Reglamento General de Protección de Datos (RGPD) de la Unión Europea.

Principios aplicables:

- Licitud, lealtad y transparencia.
- Limitación de la finalidad.
- Minimización de datos.
- Exactitud de los datos.
- Limitación del plazo de conservación.
- Integridad y confidencialidad.
- Responsabilidad proactiva.

Todo tratamiento de datos personales deberá disponer de una base legal válida y documentada.

---

### 12.9.3 LOPDGDD

BuscoHuella cumplirá con la Ley Orgánica 3/2018 de Protección de Datos Personales y Garantía de los Derechos Digitales.

Se garantizarán los derechos de los usuarios en relación con:

- Acceso.
- Rectificación.
- Supresión.
- Limitación del tratamiento.
- Oposición.
- Portabilidad.

---

### 12.9.4 Ley 7/2023 de Bienestar Animal

BuscoHuella reconoce el marco legal establecido por la Ley 7/2023 de Protección de los Derechos y el Bienestar de los Animales.

La plataforma buscará facilitar la comunicación y coordinación entre ciudadanos, protectoras y entidades colaboradoras en relación con animales perdidos o encontrados.

BuscoHuella no sustituye las obligaciones legales que correspondan a propietarios, protectoras o administraciones públicas.

---

### 12.9.5 Política de Conservación de Datos

Los datos se conservarán únicamente durante el tiempo necesario para cumplir las finalidades del servicio y las obligaciones legales aplicables.

Criterios iniciales:

- Usuarios eliminados: anonimización progresiva.
- Reportes cerrados: conservación histórica para análisis e impacto.
- Logs técnicos: 90 días.
- Notificaciones: 12 meses.
- Copias de seguridad: según la política de infraestructura vigente.

Las políticas definitivas podrán evolucionar conforme crezca el proyecto y se definan requisitos operativos adicionales.

---

### 12.9.6 Responsabilidad sobre Contenidos Publicados

Los usuarios son responsables de la información, imágenes y contenidos que publiquen dentro de la plataforma.

Al publicar contenido, el usuario declara que:

- Dispone de los derechos necesarios para compartirlo.
- La información aportada es veraz según su conocimiento.
- No vulnera derechos de terceros.
- No infringe la legislación vigente.

BuscoHuella actúa como intermediario tecnológico y podrá intervenir cuando existan indicios razonables de incumplimiento de estas condiciones.

---

### 12.9.7 Moderación y Denuncias

BuscoHuella podrá habilitar mecanismos para que los usuarios comuniquen:

- Información incorrecta.
- Contenidos inapropiados.
- Suplantaciones de identidad.
- Reportes fraudulentos.
- Uso indebido de fotografías.
- Actividades potencialmente maliciosas.

Las incidencias reportadas podrán ser revisadas y gestionadas de acuerdo con la Política de Moderación de la plataforma.

---

## Principios de Privacidad

BuscoHuella adopta un enfoque **Privacy First**.

Principios fundamentales:

- Minimización de datos.
- Consentimiento explícito.
- Transparencia.
- Derecho al olvido.
- Portabilidad de datos.
- Seguridad por defecto.
- Privacidad desde el diseño (*Privacy by Design*).

Los datos personales nunca serán vendidos ni cedidos con fines comerciales a terceros.

---

## Titularidad de la Información

Los usuarios mantienen la titularidad de:

- Datos personales.
- Fotografías.
- Información de mascotas.
- Contenidos aportados a la plataforma.

BuscoHuella recibe únicamente los permisos necesarios para almacenar, procesar y mostrar dicha información con el fin de prestar el servicio.

Los usuarios podrán solicitar:

- Exportación de datos.
- Rectificación.
- Eliminación.
- Limitación del tratamiento.

De acuerdo con la normativa aplicable en materia de protección de datos.

---

### 12.9.8 Propiedad Intelectual

El software, diseño, documentación, identidad visual, bases de datos y elementos desarrollados específicamente para BuscoHuella constituyen activos del proyecto y estarán protegidos por la legislación aplicable en materia de propiedad intelectual e industrial.

Los usuarios conservan la titularidad de los contenidos que publiquen en la plataforma.

Al publicar contenido, conceden a BuscoHuella una licencia limitada, no exclusiva y revocable para:

- Almacenar información.
- Mostrar contenido dentro de la plataforma.
- Procesar datos necesarios para la prestación del servicio.
- Generar estadísticas agregadas y anonimizadas.

Esta licencia finalizará cuando los datos sean eliminados conforme a las políticas de conservación aplicables.

---

### 12.9.9 Política de Moderación

BuscoHuella podrá intervenir sobre contenidos publicados cuando exista evidencia razonable de:

- Información falsa.
- Reportes fraudulentos.
- Suplantación de identidad.
- Contenido ofensivo o discriminatorio.
- Uso indebido de fotografías.
- Spam o actividades maliciosas.
- Publicación de datos personales de terceros sin consentimiento.

Las acciones posibles incluyen:

- Ocultar contenido.
- Solicitar verificación adicional.
- Marcar contenido para revisión.
- Cerrar reportes.
- Suspender temporalmente usuarios.
- Bloquear cuentas reincidentes.

Las decisiones de moderación deberán buscar un equilibrio entre la utilidad de la plataforma, la protección de la comunidad y el respeto a los derechos de los usuarios.

La moderación tendrá como objetivo principal proteger la seguridad, privacidad, confianza y utilidad de BuscoHuella como herramienta de recuperación de mascotas.

---

### 12.9.10 Exención de Responsabilidad

BuscoHuella proporciona herramientas para facilitar la colaboración entre usuarios durante procesos de búsqueda o identificación de animales.

La plataforma no garantiza:

- La localización de una mascota.
- La exactitud absoluta de la información publicada por terceros.
- La disponibilidad continua del servicio durante la fase MVP.

BuscoHuella realizará esfuerzos razonables para mantener la calidad, seguridad y disponibilidad del sistema, pero no podrá ser considerada responsable de decisiones tomadas exclusivamente a partir de información aportada por usuarios.

---

### Principios No Negociables

BuscoHuella se compromete a:

- No vender datos personales.
- No utilizar información identificable con fines publicitarios.
- No comprometer la privacidad de usuarios o mascotas.
- No priorizar intereses comerciales sobre la seguridad y recuperación de animales.
- Mantener una política de transparencia respecto al tratamiento de datos.

Estos principios prevalecerán sobre cualquier decisión comercial, tecnológica o estratégica futura.

---

## 13. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| Baja adopción en Sabadell | Media | Alto | Embajadores locales, veterinarias, protectoras como gatekeepers |
| Retraso técnico (1 persona) | Alta | Alto | Scope mínimo, PWA antes que nativa, uso de IA (Copilot/Cursor) |
| Competidor con más recursos | Baja | Medio | Efecto red local, relaciones B2G, first-mover en Sabadell |
| Problemas legales (RGPD) | Media | Alto | Asesoría legal externa, privacidad por diseño, política clara |
| Falta de financiación | Alta | Alto | Bootstrapping, subvenciones (ENISA, Barcelona Activa), crowdfunding |
| Fatiga del fundador | Media | Alto | Ritmo sostenible, 2 días de descanso/semana, comunidad de apoyo |

## Política de Datos

BuscoHuella aplicará el principio de minimización de datos.

Solo se recopilarán los datos estrictamente necesarios para:

- Identificar usuarios
- Gestionar mascotas
- Gestionar reportes
- Enviar notificaciones

No se comercializarán datos personales.

## Propiedad de los Datos

Los datos generados por la comunidad pertenecen a sus usuarios.

BuscoHuella nunca venderá datos personales ni utilizará información identificable con fines publicitarios.

Cualquier uso de datos con fines estadísticos, investigación o generación de indicadores se realizará de forma agregada y anonimizada conforme al RGPD.

## 13.1 RIESGOS TÉCNICOS

### Dependencia de terceros

BuscoHuella depende de:

- Supabase
- Vercel
- Mapbox
- GitHub

Mitigación:

- Exportaciones periódicas.
- Backups externos.
- Arquitectura documentada.

---

### Escalabilidad geográfica

El crecimiento fuera de Sabadell puede aumentar:

- Costes de infraestructura.
- Complejidad operativa.
- Soporte necesario.

Mitigación:

- Validación local previa.
- Escalado progresivo.

---

### Dependencia del fundador

Actualmente gran parte del conocimiento reside en una sola persona.

Mitigación:

- Documentación exhaustiva.
- Automatización.
- Procesos estandarizados.

## Riesgo Existencial

El principal riesgo de BuscoHuella no es técnico.

Es no alcanzar suficiente densidad de usuarios en una zona geográfica concreta.

Sin una masa crítica local de usuarios activos, la utilidad del producto disminuye significativamente.

Por este motivo la estrategia inicial se centra exclusivamente en Sabadell.

## 13.2 Riesgo Estratégico Principal

BuscoHuella es un producto de red local.

Su utilidad depende directamente de la densidad de usuarios activos en una misma zona geográfica.

El principal riesgo estratégico del proyecto es:

"No alcanzar masa crítica local suficiente para generar valor."

Si no existe suficiente participación ciudadana:

- Habrá menos avistamientos.
- Habrá menos reportes útiles.
- Disminuirá la tasa de recuperación.
- Los usuarios perderán interés.

Por este motivo:

- Sabadell es la prioridad absoluta.
- No se expandirá geográficamente antes de validar densidad local.
- Toda acción de marketing deberá centrarse inicialmente en Sabadell.

## 13.3 RIESGOS LEGALES

Posibles riesgos:

- Publicación de información incorrecta.
- Reportes fraudulentos.
- Uso indebido de fotografías.
- Tratamiento inadecuado de datos personales.

Mitigación:

- Sistema de denuncias.
- Moderación básica.
- Términos y condiciones.
- Política de privacidad.
- Cumplimiento RGPD.

---

<a id="anexos"></a>

## 14. ANEXOS

### 14.1 Anexo A: Stack Técnico Detallado

Ver: `docs/technical/STACK.md`

### 14.2 Anexo B: Esquema de Base de Datos Completo

Ver: `docs/database/DATABASE_SCHEMA.md` + `supabase/migrations/001_create_tables.sql`

### 14.3 Anexo C: API Endpoints

Ver: `docs/api/API_CONTRACT.md`

### 14.4 Anexo D: Guía de Estilo

Ver: `docs/frontend/STYLE_GUIDE.md` (basado en WCAG 2.2 AA)

### 14.5 Anexo E: Ideas Futuras (Aparcamiento)

Ver: `docs/roadmap/IDEAS_FUTURAS.md`

**Lista de funcionalidades aparcadas:**
- Blockchain / Token $HUE
- IA de reconocimiento facial (HuellaIA)
- IoT / Collares inteligentes
- Gestión ganadera
- Turismo pet-friendly
- Telemedicina veterinaria
- Adopción tipo Tinder
- Gamificación avanzada
- Marketplace de productos
- Logística sostenible

### 14.6 Registro de Decisiones Rechazadas (DR)

Las siguientes propuestas fueron evaluadas y descartadas durante la fase MVP para mantener el foco en la validación del producto.

---

### DR-001 — Aplicación móvil antes de validar MVP web

Estado:
Rechazada.

Motivo:
Mayor complejidad técnica y operativa sin evidencia previa de adopción.

---

### DR-002 — Blockchain y Token $HUE en MVP

Estado:
Rechazada.

Motivo:
No aporta valor directo al objetivo principal de recuperación de mascotas.

---

### DR-003 — Chat entre usuarios

Estado:
Pospuesto.

Motivo:
No es necesario para validar la hipótesis principal del MVP y aumenta significativamente la complejidad del sistema.

---

## 15. HISTORIAL DE DECISIONES

### 15.1 ADR-001 Stack Tecnológico

### 15.2 ADR-002 Estrategia Mobile

### 15.3 DR-001 App móvil antes del MVP

### 15.4 DR-002 Blockchain y Token HUE

### 15.5 DR-003 Chat entre usuarios

## Estado Actual del Proyecto

Julio 2026

Estado general:
En desarrollo activo.

Completado:
- Landing pública.
- Waitlist.
- Arquitectura definida.
- Documento Maestro.
- Stack validado.

En desarrollo:
- Monorepo.
- Supabase.
- Sistema de autenticación.

Pendiente:
- Gestión de mascotas.
- Reportes.
- Mapa colaborativo.
- Notificaciones push.

---

## HISTORIAL DE VERSIONES

| Versión | Fecha | Cambios |
|---------|-------|---------|
| v1.0 | Nov 2025 | Documento inicial |
| v1.1 | Ene 2026 | Estrategia de expansión y visión de producto |
| v1.2 | Mar 2026 | Documento maestro ampliado |
| **v2.0** | **Jul 2026** | **Consolidación inicial del proyecto** |
| **v3.0** | **Jul 2026** | **Reestructuración MVP, arquitectura AI-First, enfoque hiperlocal Sabadell** |

## BuscoHuella en una frase

BuscoHuella aspira a convertirse en la infraestructura digital de referencia para la coordinación ciudadana en casos de mascotas perdidas y encontradas.

No pretende sustituir a las protectoras ni a las administraciones públicas.

Pretende conectarlas.

---

## Definición de Éxito del MVP

El MVP se considerará exitoso si:

- Existe uso real recurrente.
- Se producen reencuentros documentados.
- Los usuarios recomiendan la plataforma.
- Al menos una protectora participa activamente.

El éxito no dependerá inicialmente de los ingresos obtenidos.

## MVP Validation Scorecard

| Métrica | Objetivo |
|----------|----------|
| Usuarios | 500 |
| Mascotas | 100 |
| Reportes | 50 |
| Avistamientos | 25 |
| Protectoras | 1 |
| Reencuentros | 5 |

---

*"Cada minuto cuenta. Todos merecen volver a casa."*  
**BuscoHuella — Documento Maestro v3.0**  
Julio 2026 — Fuente de verdad del proyecto