# Análisis Técnico: Angular vs Next.js para el Frontend PWA

## BuscoHuella MVP

Documento de evaluación tecnológica para selección de framework frontend.

---

## Información del documento

| Campo | Valor |
|---|---|
| Proyecto | BuscoHuella |
| Tipo de documento | Análisis técnico comparativo |
| Fecha | 30 de julio de 2026 |
| Estado | Pendiente de decisión definitiva |
| Responsable técnico | Xavier Quesada |
| Apoyo técnico | Herramientas IA (Kimi, Codex, Gemini, ChatGPT) |

---

# 1. Contexto y problema

## 1.1 Situación del proyecto

BuscoHuella necesita desarrollar un frontend web progresivo (**PWA**) orientado principalmente a dispositivos móviles.

La aplicación permitirá a usuarios:

- Registrar animales.
- Reportar mascotas perdidas.
- Reportar animales encontrados.
- Consultar reportes cercanos mediante mapas.
- Subir fotografías.
- Gestionar perfiles de usuario.
- Interactuar con servicios relacionados con animales.

El objetivo inicial es validar el producto mediante un MVP funcional antes de realizar una inversión mayor en infraestructura y desarrollo.

---

## 1.2 Arquitectura actual del proyecto

La arquitectura definida para BuscoHuella es desacoplada:

┌───────────────────────────┐
│                           │
│ Frontend Web PWA          │
│                           │
│ Angular / Next.js / React │
│                           │
└─────────────┬─────────────┘
              │
              │ HTTPS / SDK / API
              │
┌─────────────▼─────────────┐
│                           │
│ Supabase                  │
│                           │
│ - Authentication          │
│ - PostgreSQL              │
│ - Storage                 │
│ - Realtime                │
│ - Edge Functions          │
│                           │
└───────────────────────────┘


El frontend no debe depender de una tecnología backend concreta.

La aplicación cliente consumirá:

- Autenticación.
- Datos de usuarios.
- Información de mascotas.
- Reportes.
- Fotografías almacenadas.
- Eventos realtime.
- Funciones futuras.

---

# 2. Objetivo del análisis

La pregunta técnica principal es:

> ¿Qué tecnología frontend permite desarrollar BuscoHuella más rápido, mantener una arquitectura profesional y facilitar la evolución futura hacia aplicaciones móviles?

La decisión debe equilibrar:

1. Velocidad de desarrollo del MVP.
2. Calidad de experiencia móvil.
3. SEO y posicionamiento.
4. Mantenibilidad del código.
5. Escalabilidad futura.
6. Disponibilidad de herramientas y desarrolladores.
7. Posible evolución hacia aplicación móvil nativa.

---

# 3. Restricciones del proyecto

| Restricción | Impacto técnico |
|---|---|
| Un único desarrollador principal | La productividad es prioritaria |
| Presupuesto inicial 0 € | Se priorizan herramientas gratuitas |
| MVP temprano | Evitar arquitecturas excesivamente complejas |
| Usuario principalmente móvil | Importancia del rendimiento y UX |
| PWA requerida | Debe poder instalarse como aplicación |
| Mapas interactivos | Necesidad de Leaflet y GPS |
| Fotografías | Necesidad de integración con Storage |
| Futura app móvil | La arquitectura debe permitir evolución |

---

# 4. Requisitos técnicos del frontend

## 4.1 Requisitos funcionales

El frontend debe permitir:

| Funcionalidad | Prioridad |
|---|---|
| Registro e inicio de sesión | Alta |
| Gestión de usuarios | Alta |
| Gestión de mascotas | Alta |
| Crear reportes de pérdida | Alta |
| Crear reportes de encontrado | Alta |
| Subir fotografías | Alta |
| Mapa interactivo | Alta |
| Geolocalización GPS | Alta |
| Sistema de filtros | Media |
| Notificaciones | Media |
| Chat entre usuarios | Futura |

---

## 4.2 Requisitos no funcionales

| Requisito | Motivo |
|---|---|
| Código modular | Permitir crecimiento futuro |
| Arquitectura limpia | Facilitar mantenimiento |
| Buen rendimiento móvil | Usuario principal desde smartphone |
| PWA completa | Reducir dependencia inicial de tiendas |
| SEO | Facilitar descubrimiento en Google |
| Comunidad activa | Resolver problemas rápidamente |
| Escalabilidad | Preparar crecimiento del proyecto |

---

# 5. Tecnologías evaluadas

Para el desarrollo del frontend PWA de BuscoHuella se analizan principalmente dos alternativas:

1. Angular.
2. Next.js basado en React.

También se considera una arquitectura híbrida, aunque inicialmente no aporta ventajas para la fase MVP.

La evaluación se realizará teniendo en cuenta:

- Velocidad de desarrollo.
- Experiencia móvil.
- SEO.
- Mantenibilidad.
- Escalabilidad.
- Ecosistema tecnológico.
- Evolución futura hacia aplicación móvil.


---

# 5.1 Opción A — Angular


## Descripción

Angular es un framework frontend completo mantenido por Google.

Proporciona una arquitectura estructurada basada en:

- Componentes.
- Servicios.
- Inyección de dependencias.
- Routing oficial.
- Gestión de formularios.
- Cliente HTTP.
- Sistema de testing.
- Herramientas CLI.

Angular está especialmente orientado a:

- Aplicaciones empresariales.
- Proyectos grandes.
- Equipos con varios desarrolladores.
- Aplicaciones donde se busca una arquitectura estrictamente definida.


---

## Stack propuesto con Angular

```text
Frontend:

├── Angular 20+
├── TypeScript
├── Angular Router
├── Angular Signals
├── RxJS
├── Angular Forms
├── Angular Material
├── Tailwind CSS
├── Angular Service Worker (PWA)
├── Angular SSR
└── Leaflet + ngx-leaflet


Backend:

└── Supabase
    ├── Authentication
    ├── PostgreSQL
    ├── Storage
    ├── Realtime
    └── Edge Functions

```

---

---

## Ventajas de Angular

| Ventaja | Impacto en BuscoHuella |
|---|---|
| Arquitectura muy definida | Reduce decisiones técnicas durante el desarrollo |
| Framework completo | Menor dependencia de librerías externas |
| Excelente soporte TypeScript | Código más mantenible y seguro |
| CLI muy potente | Automatización del desarrollo y generación de código |
| Buen rendimiento | Adecuado para aplicaciones grandes y complejas |
| Buena escalabilidad | Preparado para equipos grandes y proyectos a largo plazo |

---

## Inconvenientes de Angular

| Inconveniente | Impacto en BuscoHuella |
|---|---|
| Mayor curva inicial | Más tiempo de aprendizaje y configuración |
| Más estructura obligatoria | Mayor cantidad de código inicial |
| Mayor cantidad de conceptos | Requiere dominar Signals, RxJS, Dependency Injection y servicios |
| Menor flexibilidad | Más difícil cambiar patrones arquitectónicos |
| Menor reutilización hacia React Native | Menor aprovechamiento del ecosistema compartido con una futura aplicación móvil |

---

# 5.2 Opción B — Next.js + React

## Descripción

Next.js es un framework basado en React mantenido por Vercel.

Permite desarrollar aplicaciones web modernas utilizando:

- React Components.
- React Server Components.
- Client Components.
- Server Side Rendering (SSR).
- Static Site Generation (SSG).
- Routing basado en archivos.
- Optimización automática.
- Streaming y renderizado híbrido.

Es utilizado habitualmente para:

- Startups.
- Productos SaaS.
- Aplicaciones web modernas.
- Plataformas orientadas a SEO.
- Aplicaciones con necesidad de alto rendimiento inicial.

---

## Stack propuesto con Next.js

```text
Frontend:

├── Next.js 15+
├── React 19+
├── TypeScript
├── App Router
├── Tailwind CSS
├── shadcn/ui
├── Zustand
├── TanStack Query
├── React Hook Form
├── Zod
├── Leaflet + React Leaflet
├── Serwist / Web App Manifest (PWA)
└── Testing Library


Backend:

└── Supabase
    ├── Authentication
    ├── PostgreSQL
    ├── Storage
    ├── Realtime
    └── Edge Functions

```

---

## Ventajas de Next.js + React

| Ventaja | Impacto en BuscoHuella |
|---|---|
| Renderizado híbrido SSR/SSG | Mejora SEO y velocidad inicial de carga |
| Ecosistema React | Mayor disponibilidad de librerías y desarrolladores |
| Gran velocidad de desarrollo | Permite validar el MVP más rápidamente |
| Componentes reutilizables | Facilita construir una interfaz modular |
| Excelente integración con TypeScript | Código más mantenible y seguro |
| Buena integración con React Native | Facilita una futura evolución móvil |
| Amplio ecosistema frontend | Reduce tiempo buscando soluciones existentes |

---

## Inconvenientes de Next.js + React

| Inconveniente | Impacto en BuscoHuella |
|---|---|
| Mayor libertad arquitectónica | Requiere definir convenciones propias desde el inicio |
| Más decisiones técnicas | Hay que elegir librerías y patrones adecuados |
| Evolución rápida del ecosistema | Puede requerir revisar dependencias periódicamente |
| Menos estructura obligatoria que Angular | Puede generar inconsistencia si no se aplican normas claras |
| Separación Server Components / Client Components | Requiere aprendizaje adicional en proyectos avanzados |

---

# 5.2 Opción B — Next.js + React

## Descripción

Next.js es un framework basado en React mantenido por Vercel.

Permite desarrollar aplicaciones web modernas utilizando:

- React Components.
- React Server Components.
- Client Components.
- Server Side Rendering (SSR).
- Static Site Generation (SSG).
- Routing basado en archivos.
- Optimización automática.
- Streaming y renderizado híbrido.

Es utilizado habitualmente para:

- Startups.
- Productos SaaS.
- Aplicaciones web modernas.
- Plataformas orientadas a SEO.
- Aplicaciones con necesidad de alto rendimiento inicial.

---

# Stack propuesto con Next.js

```text
Frontend:
├── Next.js 15+
├── React 19+
├── TypeScript
├── App Router
├── Tailwind CSS
├── shadcn/ui
├── Zustand
├── React Hook Form
├── Zod
├── Leaflet + React Leaflet
├── PWA Support (Serwist / Workbox)
└── Testing Library

Backend:
└── Supabase
    ├── Authentication
    ├── PostgreSQL
    ├── Storage
    └── Realtime
```

--- 

# 5.3 Opción C — Aplicación híbrida

## Descripción

La arquitectura híbrida consiste en utilizar diferentes tecnologías para diferentes partes del ecosistema BuscoHuella.

Cada aplicación utilizaría la tecnología más adecuada según sus necesidades.

Ejemplo:

```text
Frontend usuarios:
└── Next.js

Panel administración:
└── Angular

Aplicación móvil:
└── React Native

Backend:
└── Supabase

```

---

## Ventajas potenciales

| Ventaja | Impacto en BuscoHuella |
|---|---|
| Cada tecnología puede estar optimizada para su contexto | Permite utilizar la herramienta más adecuada para cada necesidad concreta |
| Permite equipos especializados | Facilita la organización cuando existen equipos con diferentes responsabilidades |
| Reduce limitaciones de una única tecnología | Aporta mayor flexibilidad para adaptar la arquitectura futura del producto |

---

## Inconvenientes para el MVP

| Inconveniente | Impacto en BuscoHuella |
|---|---|
| Mayor complejidad técnica | Aumenta el número de decisiones arquitectónicas y tareas de mantenimiento |
| Tres ecosistemas tecnológicos diferentes | Incrementa la curva de aprendizaje y la necesidad de conocimientos especializados |
| Código menos reutilizable | Reduce la posibilidad de compartir componentes, lógica y conocimientos entre plataformas |
| Mayor coste futuro | Requiere más recursos humanos para desarrollar, mantener y evolucionar cada tecnología |
| Menor velocidad inicial | Retrasa la validación del producto al dedicar más tiempo a infraestructura y coordinación |

---

## Evaluación

Aunque es técnicamente posible implementar una arquitectura híbrida, **no se recomienda para el MVP** del proyecto BuscoHuella.

Las principales razones son:

- Aumenta significativamente la complejidad inicial del proyecto.
- Incrementa la cantidad de conocimientos tecnológicos necesarios para el desarrollo.
- Aumenta considerablemente las tareas de mantenimiento y actualización.
- Reduce la velocidad de iteración durante la validación del producto.
- Dificulta la definición de estándares y convenciones comunes.
- Añade una sobrecarga técnica innecesaria en fases tempranas del proyecto.

---

## Decisión técnica sobre esta opción

La arquitectura híbrida queda **descartada inicialmente**.

Esta opción podrá ser reconsiderada en fases futuras cuando:

- El proyecto tenga usuarios activos y una validación clara del mercado.
- Exista un equipo de desarrollo más amplio.
- Aparezcan necesidades específicas que justifiquen diferentes tecnologías.
- El presupuesto permita mantener varios stacks tecnológicos.
- La complejidad del producto requiera separar aplicaciones o equipos especializados.

---

# 6. Comparativa técnica Angular vs Next.js

## 6.1 Resumen general

La decisión del framework frontend debe basarse en las necesidades reales de BuscoHuella y no únicamente en las características técnicas de cada tecnología.

Los criterios principales evaluados son:

| Criterio | Prioridad |
|---|---|
| Velocidad de desarrollo del MVP | 🔴 Crítica |
| Experiencia móvil | 🔴 Crítica |
| SEO y posicionamiento web | 🔴 Crítica |
| Mantenibilidad del código | 🟡 Alta |
| Escalabilidad futura | 🟡 Alta |
| Integración con Supabase | 🟡 Alta |
| Comunidad y soporte | 🟡 Alta |
| Preparación para aplicación móvil futura | 🟢 Media |

---

# 6.2 Velocidad de desarrollo del MVP

## Comparativa

| Aspecto | Angular | Next.js | Ventaja |
|---|---|---|---|
| Creación inicial del proyecto | CLI completo y estructurado | Configuración rápida mediante create-next-app | Next.js |
| Estructura inicial | Más definida desde el inicio | Más flexible | Angular |
| Creación de componentes | Más archivos y configuración | Componentes más compactos | Next.js |
| Gestión de rutas | Angular Router | App Router basado en archivos | Next.js |
| Formularios | Angular Forms muy completo | React Hook Form + Zod | Empate |
| Gestión de estado | Services, Signals, RxJS | Zustand, Context, Server State | Next.js |
| Curva inicial | Mayor cantidad de conceptos | Más sencillo para comenzar | Next.js |
| Productividad individual | Alta pero requiere experiencia | Alta desde fases tempranas | Next.js |

---

## Análisis

Angular proporciona una arquitectura muy sólida desde el principio:

- Estructura clara.
- Convenciones definidas.
- Separación estricta de responsabilidades.
- Herramientas oficiales integradas.

Sin embargo, para un MVP desarrollado por una única persona, puede requerir más configuración inicial.

Next.js permite avanzar más rápido:

- Menos archivos iniciales.
- Menos configuración.
- Mayor velocidad creando pantallas.
- Ecosistema React muy amplio.

---

## Veredicto

Para una primera versión con:

- 1 desarrollador.
- Tiempo limitado.
- Necesidad de validar mercado.

**Next.js tiene ventaja en velocidad de desarrollo inicial.**

---

# 6.3 Rendimiento y experiencia de usuario

## Comparativa

| Aspecto | Angular | Next.js | Ventaja |
|---|---|---|---|
| Renderizado inicial | Principalmente SPA | SSR, SSG y CSR híbrido | Next.js |
| Tiempo de carga inicial | Depende de optimización del bundle | Optimización automática | Next.js |
| Optimización móvil | Buena | Muy buena | Next.js |
| Code splitting | Disponible | Integrado por defecto | Next.js |
| Caché y renderizado híbrido | Requiere configuración | Integrado en framework | Next.js |
| PWA | Soporte oficial | Soporte mediante librerías externas | Angular |
| Aplicaciones complejas | Excelente | Excelente | Empate |

---

## Análisis

Ambos frameworks pueden crear una PWA rápida y optimizada.

La diferencia principal está en el modelo de renderizado:

### Angular

Modelo tradicional:

```text
Usuario
   │
   ▼
Carga aplicación Angular
   │
   ▼
Ejecuta JavaScript
   │
   ▼
Renderiza contenido

```

---

# 6.4 SEO y posicionamiento en Google

## Objetivo del proyecto

BuscoHuella necesita aparecer en búsquedas relacionadas con:

- Animales perdidos.
- Animales encontrados.
- Adopciones.
- Servicios veterinarios cercanos.

Ejemplos:

```
Perro perdido Sabadell
Gato encontrado Barcelona
Adopción perros cerca
Veterinario urgencia Terrassa
```


Por tanto, la capacidad SEO del frontend es un requisito estratégico.

---

## Comparativa

| Aspecto | Angular | Next.js | Ventaja |
|---|---|---|---|
| SEO SPA tradicional | Limitado | No recomendado | Next.js |
| SSR integrado | Requiere configuración Angular SSR | Incluido | Next.js |
| Generación páginas estáticas | Disponible | Nativa | Next.js |
| Metadata dinámica | Posible | Muy sencilla | Next.js |
| Páginas públicas indexables | Requiere configuración | Preparado desde inicio | Next.js |

---

## Análisis

Angular puede conseguir un buen SEO mediante:

- Angular SSR.
- Prerenderizado.
- Configuración adicional.

Sin embargo, Next.js incorpora estas capacidades como parte natural del framework.

Para BuscoHuella esto es importante porque muchos contenidos pueden ser públicos:

- Fichas de animales perdidos.
- Reportes encontrados.
- Protectoras.
- Servicios asociados.

---

## Veredicto

Para una plataforma donde los reportes públicos puedan aparecer en Google:

**Next.js tiene ventaja clara por su arquitectura SSR/SSG.**

---

# 6.5 Integración con Supabase y Backend

## Contexto

BuscoHuella utilizará Supabase como Backend as a Service (BaaS).

El frontend será responsable únicamente de consumir los servicios:

- Authentication.
- PostgreSQL mediante Supabase Client.
- Storage de imágenes.
- Realtime.
- Edge Functions futuras.

La elección del framework frontend no condiciona la arquitectura backend.

---

## Comparativa

| Aspecto | Angular | Next.js | Ventaja |
|---|---|---|---|
| Cliente oficial Supabase | Compatible | Compatible | Empate |
| Autenticación usuarios | Supabase Auth + servicios Angular | Supabase Auth + Server/Client Components | Empate |
| Acceso PostgreSQL | SDK Supabase | SDK Supabase | Empate |
| Storage imágenes | SDK Supabase | SDK Supabase | Empate |
| Realtime | Compatible | Compatible | Empate |
| Variables de entorno | Soportado | Soportado | Empate |
| Seguridad con RLS | Gestionado por Supabase | Gestionado por Supabase | Empate |

---

## Arquitectura resultante

Ambas opciones utilizarían la misma arquitectura:

```text
                 Usuario

                    │

                    ▼

        ┌─────────────────────┐
        │ Frontend Web PWA    │
        │ Angular / Next.js   │
        └──────────┬──────────┘

                   │

                   ▼

        ┌─────────────────────┐
        │     Supabase        │
        │                     │
        │ Auth                │
        │ PostgreSQL          │
        │ Storage             │
        │ Realtime            │
        └──────────┬──────────┘

                   │

                   ▼

        ┌─────────────────────┐
        │    PostgreSQL       │
        └─────────────────────┘

```

---

# 6.8 Escalabilidad futura y evolución del producto

## Contexto

BuscoHuella no se plantea únicamente como un MVP.

La visión futura contempla:

- Aplicación móvil nativa.
- Comunidad de usuarios.
- Sistema de notificaciones.
- Chat entre usuarios.
- Panel de administración.
- Gestión profesional para protectoras y veterinarios.
- Posible crecimiento internacional.

Por tanto, la tecnología elegida debe permitir evolucionar sin bloquear futuras decisiones.

---

## Comparativa

| Aspecto | Angular | Next.js | Ventaja |
|---|---|---|---|
| Escalabilidad aplicación web | Excelente | Excelente | Empate |
| Arquitectura para equipos grandes | Muy estructurada | Flexible | Angular |
| Facilidad para startups | Buena | Excelente | Next.js |
| Reutilización con aplicación móvil | Limitada | Mejor integración con React Native | Next.js |
| Ecosistema frontend | Amplio | Muy amplio | Next.js |
| Panel administración futuro | Excelente | Excelente | Empate |
| Aplicaciones empresariales | Muy utilizado | Muy utilizado | Empate |
| Separación por dominios | Excelente | Excelente | Empate |

---

## Angular a largo plazo

Ventajas:

- Arquitectura muy definida.
- Fácil mantener grandes bases de código.
- Excelente para equipos numerosos.
- Patrones claros y consistentes.
- Muy utilizado en entornos empresariales.

Ejemplo:

```text
BuscoHuella Web

├── Core
│   ├── Auth
│   ├── Services
│   └── Guards
│
├── Features
│   ├── Mascotas
│   ├── Reportes
│   ├── Usuarios
│   └── Mapa
│
├── Shared
│   ├── Components
│   └── Utils
│
└── Infrastructure

```

---

## Next.js a largo plazo

Ventajas:

- Ecosistema React muy amplio.
- Mejor integración con React Native para móvil.
- Facilidad para escalar el equipo con talento.
- Menos fricción en desarrollo.
- Mayor velocidad de innovación.

```text
Ejemplo:

buscohuella-web/
├── app/                      # Next.js App Router
│   ├── auth/
│   ├── mascotas/
│   ├── reportes/
│   ├── mapa/
│   └── perfil/
│
├── components/               # Componentes React reutilizables
│
├── services/                 # Servicios externos
│   ├── supabase/
│   ├── auth.service.ts
│   └── reports.service.ts
│
├── lib/                      # Lógica reutilizable
│
├── hooks/                    # Hooks personalizados
│
├── store/                    # Estado global (Zustand)
│
├── types/                    # Interfaces TypeScript
│
├── config/                   # Configuración aplicación
│
└── public/                   # Recursos estáticos

```

---

---

## Para BuscoHuella (MVP + futuro)

Next.js tiene ligera ventaja por:

- Mayor rapidez en desarrollo del MVP.
- Mejor ecosistema para productos digitales y startups.
- Mejor soporte SEO desde el inicio.
- Reutilización de conocimientos hacia React Native futuro.
- Mayor velocidad de iteración.
- Comunidad frontend más amplia.

Sin embargo, Angular sigue siendo una alternativa totalmente válida para este proyecto.

La diferencia no está en la capacidad técnica de ambos frameworks, sino en el contexto concreto de BuscoHuella:

- Equipo reducido.
- Necesidad de validar el producto rápidamente.
- Plataforma pública orientada a usuarios finales.
- Importancia del posicionamiento SEO.
- Evolución futura hacia aplicación móvil.

---

## Comparativa

| Aspecto | Angular | Next.js | Ventaja |
|---|---|---|---|
| Aplicaciones empresariales grandes | Excelente | Excelente | Empate |
| Arquitectura estructurada | Muy fuerte | Flexible | Angular |
| Crecimiento del producto | Excelente | Excelente | Empate |
| Ecosistema startup | Bueno | Excelente | Next.js |
| Aplicación móvil futura | Ionic / migración separada | React Native comparte ecosistema | Next.js |
| Comunidad frontend | Grande | Muy grande | Next.js |
| Velocidad de iteración | Buena | Excelente | Next.js |

---

## Angular

Angular destaca especialmente en:

- Aplicaciones empresariales.
- Equipos grandes.
- Proyectos con muchas reglas internas.
- Arquitecturas muy definidas.

Ventajas:

- Convenciones claras.
- Estructura consistente.
- Buen mantenimiento con muchos desarrolladores.
- Excelente para aplicaciones administrativas.

Ejemplo:

```
Aplicación empresarial:

Usuarios internos
        │
        ▼
Angular Dashboard
        │
        ▼
API Backend
        │
        ▼
Base de datos
```

---

## Next.js

Next.js destaca especialmente en:

- Productos digitales.
- Plataformas públicas.
- Aplicaciones orientadas a usuarios.
- Startups.
- Proyectos con necesidad de SEO.

Modelo:

```
Plataforma pública:

Usuario
   │
   ▼
Servidor Next.js
   │
   ▼
HTML inicial optimizado
   │
   ▼
React hidrata componentes
```

Ventajas:

- Mejor percepción de velocidad.
- Mejor rendimiento inicial.
- Mejor experiencia para usuarios móviles.
- Mejor integración con ecosistema React.

---

## Veredicto

Para una aplicación empresarial interna:

Angular tendría ventaja debido a su estructura, convenciones y escalabilidad organizativa.

Para una plataforma orientada a usuarios, comunidad y futura aplicación móvil:

Next.js tiene ventaja por velocidad de desarrollo, SEO y ecosistema React.

BuscoHuella se encuentra más cerca del segundo escenario:

- Plataforma pública.
- Usuarios finales.
- Contenido indexable.
- Crecimiento hacia aplicación móvil.

Resultado:

**Next.js obtiene ventaja para la visión futura del producto.**

---

# 6.9 Mantenimiento y curva de aprendizaje

## Contexto

El desarrollo inicial será realizado por un único desarrollador.

La prioridad no es únicamente crear código, sino poder mantenerlo durante años.

---

## Comparativa

| Aspecto | Angular | Next.js | Ventaja |
|---|---|---|---|
| Estructura inicial | Muy definida | Más flexible | Angular |
| Facilidad primeros pasos | Media | Alta | Next.js |
| Organización grandes proyectos | Excelente | Requiere disciplina | Angular |
| Cantidad de conceptos | Alta | Media | Next.js |
| Documentación oficial | Excelente | Excelente | Empate |
| Comunidad | Grande | Muy grande | Next.js |
| Disponibilidad de desarrolladores | Buena | Muy alta | Next.js |

---

## Análisis

Angular reduce decisiones:

- Cómo organizar carpetas.
- Cómo inyectar dependencias.
- Cómo crear servicios.
- Cómo gestionar estados.

Esto es una ventaja cuando existe un equipo grande.

Next.js proporciona más libertad:

- Elegir librerías.
- Elegir patrones.
- Crear una arquitectura personalizada.

Esto permite más velocidad, pero requiere mantener disciplina técnica.

---

## Veredicto

Para un equipo grande:

Angular tiene ventaja.

Para un desarrollador individual creando un MVP:

Next.js tiene ventaja.

---

# 6.10 Resumen global de la comparativa

| Área evaluada | Angular | Next.js | Ganador |
|---|---|---|---|
| Velocidad desarrollo MVP | Muy bueno | Excelente | Next.js |
| SEO | Bueno con configuración extra | Excelente | Next.js |
| Rendimiento inicial | Bueno | Excelente | Next.js |
| Supabase | Excelente | Excelente | Empate |
| Mapas Leaflet | Excelente | Excelente | Empate |
| PWA | Excelente | Excelente con configuración adicional | Empate |
| Aplicación móvil futura | Limitado | Excelente con React Native | Next.js |
| Grandes equipos | Excelente | Muy bueno | Angular |
| Startup/MVP | Bueno | Excelente | Next.js |
| Comunidad frontend | Grande | Muy grande | Next.js |
| Mantenimiento individual | Bueno | Excelente | Next.js |

---

# 6.11 Puntuación final

Valoración sobre 10 para el contexto actual de BuscoHuella:

| Criterio | Peso | Angular | Next.js |
|---|---|---|---|
| Velocidad MVP | 25% | 7.5/10 | 9/10 |
| SEO | 15% | 7.5/10 | 10/10 |
| Experiencia móvil | 15% | 8/10 | 9/10 |
| Supabase | 10% | 10/10 | 10/10 |
| Mapas | 10% | 10/10 | 10/10 |
| Escalabilidad futura | 15% | 8.5/10 | 9/10 |
| Mantenimiento individual | 10% | 8/10 | 9/10 |

---

## Resultado ponderado

### Angular

**8.2 / 10**

### Next.js

**8.8 / 10**

---

La diferencia no representa que una tecnología sea superior técnicamente.

Representa una adaptación distinta al contexto:

Angular:
- Mejor para equipos grandes.
- Mejor para aplicaciones empresariales.
- Mayor control arquitectónico.

Next.js:
- Mejor para productos digitales.
- Mayor velocidad MVP.
- Mejor estrategia SEO.
- Mejor evolución hacia ecosistema React Native.

---

# Conclusión técnica

Aunque Angular es una tecnología excelente y totalmente válida para BuscoHuella, el análisis del contexto actual favorece a Next.js.

Motivos principales:

- Equipo reducido.
- Necesidad de lanzar rápido.
- Importancia del SEO.
- Producto orientado a usuarios finales.
- Futuro crecimiento hacia aplicación móvil.
- Necesidad de iterar rápidamente.

La decisión recomendada es:

## Elegir Next.js como frontend principal del MVP.

Angular queda como alternativa válida si:

- Ya existe código funcional importante.
- El equipo aumenta considerablemente.
- El proyecto cambia hacia una plataforma empresarial interna.

La elección de Next.js no significa que Angular sea inferior.

Significa que, dadas las condiciones actuales de BuscoHuella, Next.js minimiza riesgos y maximiza velocidad de validación del producto.

---

---

# 7. Decisión técnica recomendada

## Decisión

Después de analizar las dos alternativas principales:

- Angular.
- Next.js + React.

La tecnología recomendada para el frontend web PWA de BuscoHuella MVP es:

# ✅ Next.js + React + TypeScript

---

# 7.1 Justificación de la decisión

La elección está basada en el contexto real del proyecto:

| Factor | Decisión |
|---|---|
| Equipo actual | 1 desarrollador |
| Fase del proyecto | MVP |
| Objetivo principal | Validar producto rápidamente |
| Usuario principal | Usuario móvil |
| Necesidad SEO | Alta |
| Futuro previsto | Aplicación móvil |
| Backend | Supabase desacoplado |
| Presupuesto | 0 € |

---

## Motivos principales

### 1. Mayor velocidad de desarrollo

Next.js permite construir funcionalidades del MVP más rápidamente gracias a:

- Menor cantidad de código inicial.
- Ecosistema React amplio.
- Componentes reutilizables.
- Gran cantidad de librerías disponibles.
- Menor configuración inicial.

Impacto en BuscoHuella:

Permite dedicar más tiempo a funcionalidades de negocio y menos tiempo a configuración técnica.

---

### 2. Mejor estrategia SEO

BuscoHuella necesita que los reportes públicos puedan aparecer en buscadores.

Ejemplos:

```
Perro perdido Sabadell
Gato encontrado Barcelona
Adopción perros cerca
```

Next.js aporta:

- Server Side Rendering (SSR).
- Static Site Generation (SSG).
- Metadata dinámica.
- Páginas públicas optimizadas.

Esto supone una ventaja estratégica frente a una SPA tradicional.

---

### 3. Mejor evolución hacia aplicación móvil

La visión futura contempla:

- Aplicación móvil Android.
- Aplicación móvil iOS.
- Posible React Native.

El ecosistema React permite compartir conocimientos y patrones entre:

```
Web PWA
   │
   ▼
Next.js + React

        ↓

Aplicación móvil
   │
   ▼
React Native
```

Esto reduce la curva futura de aprendizaje.

---

### 4. Mejor adaptación al modelo startup

BuscoHuella inicialmente no es una aplicación empresarial interna.

Es una plataforma pública:

- Usuarios finales.
- Comunidad.
- Contenido generado por usuarios.
- Crecimiento progresivo.

Next.js está especialmente orientado a este tipo de productos.

---

# 7.2 Arquitectura frontend elegida

La arquitectura inicial será:

```
                    Usuario móvil
                         │
                         ▼

              Next.js Progressive Web App

                         │
                         ▼

              Capa de componentes React

                         │
                         ▼

              Servicios y lógica cliente

                         │
                         ▼

                  Supabase SDK

                         │
                         ▼

        ┌─────────────────────────┐
        │       Supabase           │
        │                          │
        │ Authentication           │
        │ PostgreSQL               │
        │ Storage                  │
        │ Realtime                 │
        │ Edge Functions           │
        └─────────────────────────┘
```

---

# 7.3 Stack tecnológico definitivo

## Frontend

```
Next.js 15+
React 19+
TypeScript
App Router
Tailwind CSS
shadcn/ui
Zustand
React Hook Form
Zod
Leaflet
React Leaflet
Serwist PWA
Testing Library
Playwright
```

---

## Backend / Servicios

```
Supabase

├── Authentication
├── PostgreSQL
├── Storage
├── Realtime
├── Edge Functions
└── Row Level Security
```

---

## Herramientas desarrollo

```
Node.js
npm
Git
GitHub
VS Code
ESLint
Prettier
```

---

# 7.4 Principios arquitectónicos

La implementación seguirá estos principios:

## Separación de responsabilidades

El frontend será responsable de:

- Interfaz usuario.
- Experiencia móvil.
- Gestión estado cliente.
- Validaciones visuales.
- Navegación.

Supabase será responsable de:

- Autenticación.
- Persistencia datos.
- Seguridad.
- Archivos.
- Comunicación tiempo real.

---

## Arquitectura modular

El proyecto se organizará por funcionalidades:

Ejemplo:

```
src/

├── app/
│
├── features/
│   ├── auth/
│   ├── mascotas/
│   ├── reportes/
│   ├── mapa/
│   └── usuarios/
│
├── components/
│
├── services/
│
├── stores/
│
├── hooks/
│
└── utils/
```

---

# 7.5 Decisiones descartadas

## Angular

No se selecciona Angular para el MVP.

Motivo:

No por limitaciones técnicas, sino porque:

- Añade más estructura inicial.
- Reduce velocidad de iteración.
- Tiene menor ventaja para React Native futuro.
- El SEO requiere configuración adicional.

---

## Arquitectura híbrida

Descartada inicialmente.

Motivos:

- Mayor complejidad.
- Más mantenimiento.
- Duplicidad tecnológica.
- No aporta valor durante validación MVP.

---

# 7.6 Revisión futura de la decisión

Esta decisión podrá revisarse cuando cambien las condiciones:

Ejemplos:

- Equipo superior a 5 desarrolladores.
- Necesidad de aplicaciones empresariales internas.
- Requisitos técnicos nuevos.
- Cambio de estrategia de producto.

La revisión no implicará migración automática.

Se evaluará siempre:

- Coste.
- Beneficio.
- Riesgo.
- Impacto en usuarios.

---

# Estado final

**Frontend MVP seleccionado:**

```
Next.js + React + TypeScript + PWA
```

**Backend seleccionado:**

```
Supabase + PostgreSQL
```

**Estado de decisión:**

```
ACEPTADA
```

---

---

# 7.7 Riesgos asociados a la decisión

Aunque Next.js es la tecnología seleccionada, existen riesgos que deben controlarse.

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Mayor libertad arquitectónica | Código inconsistente | Definir convenciones desde inicio |
| Dependencia del ecosistema React | Cambios frecuentes | Mantener versiones estables |
| Exceso de librerías externas | Mayor mantenimiento | Selección estricta de dependencias |
| Mala organización del proyecto | Dificultad futura | Arquitectura modular por features |
| Renderizado híbrido mal utilizado | Complejidad innecesaria | Separar Server y Client Components correctamente |

---

## Medidas preventivas

El proyecto seguirá:

- Convenciones claras de carpetas.
- Revisión periódica de dependencias.
- Componentes reutilizables.
- Separación entre UI y lógica negocio.
- Tests automatizados en funcionalidades críticas.

---

# 7.8 Consideraciones de seguridad

La arquitectura seguirá un modelo donde el frontend nunca será considerado una capa segura.

La seguridad estará basada en:

- Supabase Authentication.
- Row Level Security.
- Validación backend.
- Gestión segura de sesiones.
- Control de permisos.

El frontend será únicamente una interfaz de acceso.

Principios:

- Nunca almacenar secretos en cliente.
- Validar permisos en Supabase.
- Limitar acceso a datos mediante RLS.
- Validar archivos subidos.
- Proteger operaciones sensibles.

--- 

# 7.9 Próximos pasos tras la decisión tecnológica

Una vez seleccionado Next.js como frontend del MVP, las siguientes decisiones deberán centrarse en definir la arquitectura interna:

- Organización definitiva de carpetas.
- Convenciones de componentes.
- Gestión del estado global.
- Estrategia de autenticación.
- Modelo de permisos.
- Integración con Supabase.
- Gestión de imágenes.
- Estrategia offline PWA.
- Sistema de testing.
- Pipeline de despliegue.

La selección del framework es únicamente la primera decisión arquitectónica.

La calidad final del producto dependerá principalmente de la correcta definición de estructura, seguridad y buenas prácticas durante la implementación.

---

# 8. Arquitectura funcional del MVP

## 8.1 Objetivo de la arquitectura funcional

La arquitectura funcional del MVP define la organización de las principales capacidades de BuscoHuella y la relación entre los diferentes módulos del sistema.

El objetivo es establecer una base modular que permita:

- Desarrollar el MVP de forma incremental.
- Mantener una separación clara de responsabilidades.
- Facilitar futuras ampliaciones del producto.
- Evitar dependencias innecesarias entre funcionalidades.

---

## 8.2 Módulos funcionales principales

La arquitectura funcional del MVP se dividirá en módulos independientes pero relacionados entre sí.

```text
BuscoHuella MVP

├── Autenticación y usuarios
│
├── Gestión de perfiles
│
├── Gestión de mascotas
│
├── Reportes de animales
│
├── Mapa y geolocalización
│
├── Búsqueda y filtros
│
├── Sistema de comunicación
│
└── Administración básica
```

## Los servicios transversales serán:

```text
Servicios compartidos

├── Gestión de fotografías y archivos
├── Seguridad y permisos
├── Validaciones
└── Auditoría de datos

```

---

## 8.3 Arquitectura de alto nivel

Usuario
   │
   ▼

Next.js PWA

   │
   ├── Componentes React
   ├── Estado global
   ├── Servicios de aplicación (API)
   └── Validaciones

   │

   ▼

Supabase

   ├── Authentication
   ├── PostgreSQL
   ├── Storage
   ├── Realtime
   └── Edge Functions

---

## 8.4 Módulos del MVP

### 8.4.1 Autenticación y usuarios

Este módulo gestiona la identidad de los usuarios dentro de BuscoHuella, permitiendo el acceso seguro a la plataforma y la gestión básica de cuentas.

Incluye:

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Recuperación de contraseña.
- Verificación de correo electrónico.
- Gestión básica de sesión.
- Gestión de roles de usuario.
- Autenticación social (opcional en futuras versiones).

Tipos de usuario iniciales:

- Usuario particular.
- Organización/protectora.
- Profesional relacionado con animales.
- Administrador.

### 8.4.2 Gestión de perfiles

Este módulo permite a los usuarios gestionar su información personal y preferencias dentro de la plataforma.

Incluye:

- Visualización del perfil.
- Edición de información personal.
- Gestión de fotografía de perfil.
- Cambio de contraseña.
- Configuración básica de privacidad.

### 8.4.3 Gestión de mascotas

Este módulo permite a los usuarios crear y gestionar las fichas de sus animales asociados.

Incluye:

- Creación de perfil de mascota.
- Edición de información de mascota.
- Carga de fotografías.
- Especie del animal.
- Raza.
- Nombre.
- Edad aproximada.
- Sexo.
- Características físicas.
- Información identificativa.
- Estado de la mascota (activa, perdida, encontrada o archivada).

### 8.4.4 Reportes de animales

Este módulo permite crear y gestionar avisos relacionados con animales perdidos o encontrados.

Incluye:

- Creación de reporte de animal perdido.
- Creación de reporte de animal encontrado.
- Carga de fotografías.
- Descripción del animal.
- Ubicación del incidente.
- Fecha del reporte.
- Estado del reporte.
- Actualización del estado del animal.
- Marcado como encontrado o resuelto.

### 8.4.5 Mapa y geolocalización

Este módulo permite visualizar información geográfica relacionada con animales y servicios cercanos.

Incluye:

- Mapa interactivo.
- Localización mediante GPS.
- Marcadores de animales perdidos y encontrados.
- Visualización por proximidad.
- Centrado automático según ubicación del usuario.
- Selección de ubicación mediante mapa.
- Cálculo aproximado de distancia entre ubicaciones.

### 8.4.6 Búsqueda y filtros

Este módulo permite localizar animales y reportes mediante diferentes criterios.

Incluye:

- Búsqueda por nombre.
- Búsqueda por especie.
- Búsqueda por raza.
- Búsqueda por características físicas.
- Filtros por ubicación.
- Filtros por fecha.
- Filtros por estado del reporte.

### 8.4.7 Sistema de comunicación

Este módulo permitirá la interacción entre usuarios para facilitar la recuperación de animales.

Inicialmente:

- Contacto mediante información protegida.
- Solicitud de contacto entre usuarios.

Futuras versiones:

- Mensajes directos.
- Chat interno.
- Notificaciones en tiempo real.
- Historial de conversaciones.
- Bloqueo de usuarios.

### 8.4.8 Administración básica

Este módulo permite la gestión interna de la plataforma.

Incluye:

- Gestión de usuarios.
- Gestión de reportes.
- Moderación de contenido.
- Revisión de incidencias.
- Estadísticas básicas.
- Configuración general del sistema.

---

# 8.5 Flujos principales de usuario

## 8.5.1 Flujo de registro e inicio de sesión

### Descripción

Este flujo cubre la creación de una cuenta de usuario en BuscoHuella, la autenticación posterior y la gestión básica de sesión. Es el punto de entrada obligatorio para acceder a las funcionalidades personalizadas de la plataforma.

Los usuarios pueden registrarse mediante correo electrónico y contraseña. En futuras versiones se evaluará la incorporación de autenticación social (Google, Apple).

---

### Actores

| Actor | Rol |
|---|---|
| Usuario no registrado | Persona que accede por primera vez y desea crear una cuenta. |
| Usuario registrado | Persona con cuenta activa que inicia sesión para acceder a la plataforma. |
| Sistema (Supabase Auth) | Servicio responsable de validar credenciales, gestionar tokens y mantener la sesión. |

---

### Estados del usuario en el flujo

```text
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────────┐
│  Visitante  │────▶│  Registro    │────▶│  Verificación│────▶│   Activo    │
│  (anónimo)  │     │  iniciado    │     │   de email   │     │  (logueado) │
└─────────────┘     └──────────────┘     └─────────────┘     └─────────────┘
       │                                                            │
       │                                                            │
       └────────────────────────────────────────────────────────────┘
                              Cierre de sesión
```
---

# Flujo de autenticación de usuarios

## Estados del usuario

| Estado | Descripción |
|---|---|
| Visitante | Usuario sin autenticar. Puede navegar por contenido público (reportes, mapa). |
| Registro iniciado | Ha accedido al formulario de registro y está introduciendo datos. |
| Pendiente de verificación | Cuenta creada pero email no confirmado. Acceso limitado. |
| Activo | Cuenta verificada y sesión iniciada. Acceso completo a funcionalidades. |
| Sesión expirada | Token de autenticación inválido o expirado. Requiere nuevo inicio de sesión. |

---

# Flujo principal: Registro con correo y contraseña

```text
Usuario                         Next.js PWA                         Supabase Auth
   │                                  │                                  │
   │ 1. Accede a /registro            │                                  │
   │─────────────────────────────────▶│                                  │
   │                                  │                                  │
   │ 2. Muestra formulario            │                                  │
   │◀─────────────────────────────────│                                  │
   │                                  │                                  │
   │ 3. Introduce email, contraseña   │                                  │
   │    y confirmación contraseña     │                                  │
   │─────────────────────────────────▶│                                  │
   │                                  │                                  │
   │ 4. Valida formato email (Zod)    │                                  │
   │    Valida fortaleza contraseña   │                                  │
   │    Comprueba coincidencia campos │                                  │
   │◀─────────────────────────────────│                                  │
   │                                  │                                  │
   │ 5. Envía petición registro       │                                  │
   │─────────────────────────────────▶│─────────────────────────────────▶│
   │                                  │                                  │
   │                                  │ 6. Crea usuario en Authentication │
   │                                  │    Genera token confirmación      │
   │                                  │◀─────────────────────────────────│
   │                                  │                                  │
   │ 7. Muestra mensaje:              │                                  │
   │    "Revisa tu email para         │                                  │
   │     verificar la cuenta"          │                                  │
   │◀─────────────────────────────────│                                  │
   │                                  │                                  │
   │ 8. Accede al enlace del email    │                                  │
   │─────────────────────────────────▶│─────────────────────────────────▶│
   │                                  │                                  │
   │                                  │ 9. Marca email verificado         │
   │                                  │    Actualiza estado usuario       │
   │                                  │◀─────────────────────────────────│
   │                                  │                                  │
   │ 10. Redirige a /login            │                                  │
   │     "Cuenta verificada.          │                                  │
   │      Inicia sesión"               │                                  │
   │◀─────────────────────────────────│                                  │
```
---

# Flujo principal: Inicio de sesión

```text
Usuario                         Next.js PWA                         Supabase Auth
   │                                  │                                  │
   │ 1. Accede a /login               │                                  │
   │─────────────────────────────────▶│                                  │
   │                                  │                                  │
   │ 2. Introduce email y contraseña  │                                  │
   │─────────────────────────────────▶│                                  │
   │                                  │                                  │
   │ 3. Valida campos (Zod)           │                                  │
   │─────────────────────────────────▶│─────────────────────────────────▶│
   │                                  │                                  │
   │                                  │ 4. Verifica credenciales          │
   │                                  │    Comprueba estado cuenta        │
   │                                  │◀─────────────────────────────────│
   │                                  │                                  │
   │ 5. Almacena sesión               │                                  │
   │    (Zustand + cookie)             │                                  │
   │◀─────────────────────────────────│                                  │
   │                                  │                                  │
   │ 6. Redirige a dashboard          │                                  │
   │    o página origen               │                                  │
   │◀─────────────────────────────────│                                  │
```

---

# Flujo alternativo: Recuperación de contraseña

```text
Usuario                         Next.js PWA                         Supabase Auth
   │                                  │                                  │
   │ 1. Pulsa "¿Olvidaste tu          │                                  │
   │    contraseña?"                  │                                  │
   │─────────────────────────────────▶│                                  │
   │                                  │                                  │
   │ 2. Introduce email registrado    │                                  │
   │─────────────────────────────────▶│─────────────────────────────────▶│
   │                                  │                                  │
   │                                  │ 3. Genera token recuperación      │
   │                                  │    Envía email seguro             │
   │                                  │◀─────────────────────────────────│
   │                                  │                                  │
   │ 4. Muestra mensaje confirmación  │                                  │
   │◀─────────────────────────────────│                                  │
   │                                  │                                  │
   │ 5. Accede enlace email           │                                  │
   │─────────────────────────────────▶│─────────────────────────────────▶│
   │                                  │                                  │
   │                                  │ 6. Muestra formulario nueva       │
   │                                  │    contraseña                     │
   │◀─────────────────────────────────│                                  │
   │                                  │                                  │
   │ 7. Introduce nueva contraseña    │                                  │
   │    y confirmación                │                                  │
   │─────────────────────────────────▶│─────────────────────────────────▶│
   │                                  │                                  │
   │                                  │ 8. Actualiza contraseña Auth      │
   │                                  │    Invalida sesiones anteriores   │
   │                                  │◀─────────────────────────────────│
   │                                  │                                  │
   │ 9. Redirige a /login             │                                  │
   │    "Contraseña actualizada"      │                                  │
   │◀─────────────────────────────────│                                  │
```

---

# Reglas de negocio y validaciones

| Regla | Descripción | Responsable |
|--------|-------------|-------------|
| Email único | No puede existir más de una cuenta con el mismo correo electrónico. | Supabase Auth |
| Contraseña segura | Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número. | Frontend (Zod) + Supabase |
| Confirmación de email obligatoria | El usuario no puede acceder a funcionalidades protegidas sin verificar su correo. | Supabase Auth |
| Expiración de token de recuperación | El enlace de recuperación de contraseña expira a las 24 horas. | Supabase Auth |
| Límite de intentos fallidos | Tras 5 intentos de inicio de sesión fallidos, se aplica una espera de 15 minutos. | Supabase Auth |
| Sesión persistente | El usuario permanece autenticado durante 7 días de inactividad mediante refresh token. | Supabase Auth |

---

# Manejo de errores

| Escenario | Mensaje al usuario | Acción técnica |
|------------|--------------------|----------------|
| Email ya registrado | "Este correo ya está en uso. ¿Quieres iniciar sesión?" | Capturar el error `auth/email-already-in-use` y ofrecer redirección al inicio de sesión. |
| Credenciales incorrectas | "Email o contraseña incorrectos." | Capturar el error `auth/invalid-credentials` sin revelar qué campo es incorrecto. |
| Email no verificado | "Debes verificar tu correo antes de continuar." | Capturar el error `auth/email-not-confirmed` y ofrecer el reenvío del correo de verificación. |
| Token de recuperación inválido | "El enlace ha expirado o no es válido. Solicita uno nuevo." | Capturar el error `auth/expired-token` y redirigir al flujo de recuperación de contraseña. |
| Error de red | "No se pudo conectar. Verifica tu conexión e inténtalo de nuevo." | Controlar errores de red o timeout durante la comunicación con el SDK de Supabase. |

---

# Consideraciones técnicas

## Frontend (Next.js)

- El formulario de registro utilizará **React Hook Form** junto con **Zod** para la validación del lado del cliente.
- La comunicación con Supabase se encapsulará mediante el servicio:

```text
services/authService.ts
```

- El estado global de autenticación se gestionará mediante **Zustand**.
- La sesión permanecerá sincronizada con el cliente oficial de Supabase.
- Las rutas protegidas utilizarán **Middleware** o **Route Guards** para comprobar la existencia de una sesión válida antes de permitir el acceso.

---

## Backend (Supabase)

- La tabla `profiles` se creará automáticamente mediante un **trigger** al confirmarse un nuevo registro en:

```text
auth.users
```

- Se aplicarán políticas de **Row Level Security (RLS)** para garantizar que cada usuario únicamente pueda acceder y modificar su propio perfil.
- Los **JWT** serán gestionados íntegramente por **Supabase Auth**, sin necesidad de implementación adicional.

---

# Seguridad

- Nunca se almacenará la contraseña del usuario en el frontend.
- El token de sesión será gestionado por Supabase y almacenado mediante:
  - Cookies seguras (recomendado).
  - O el mecanismo de almacenamiento configurado por el cliente de Supabase.
- Todas las operaciones de lectura y escritura estarán protegidas mediante políticas **Row Level Security (RLS)**.
- Todas las rutas privadas requerirán una sesión válida antes de permitir el acceso.

---

# Pantallas involucradas

| Pantalla | Ruta | Tipo |
|----------|------|------|
| Registro | `/registro` | Pública |
| Inicio de sesión | `/login` | Pública |
| Verificación de email | `/verificar-email` | Pública (token en la URL) |
| Recuperar contraseña | `/recuperar-contraseña` | Pública |
| Restablecer contraseña | `/restablecer-contraseña` | Pública (token en la URL) |

---

# 8.5.2 Flujo de registro de una mascota

## Descripción

Este flujo permite a un usuario registrado y autenticado crear una ficha de mascota dentro de **BuscoHuella**. Cada mascota queda asociada al perfil del usuario que la registra y puede ser gestionada posteriormente (editar, archivar o vincular a reportes).

El registro incluye datos identificativos del animal, fotografías y características físicas. La mascota se crea con el estado **Activa** por defecto.

---

# Actores

| Actor | Rol |
|--------|-----|
| Usuario autenticado | Propietario o responsable del animal que desea registrarlo en la plataforma. |
| Sistema (Supabase) | Persiste los datos de la mascota, gestiona el almacenamiento de imágenes y aplica las políticas de seguridad. |

---

# Precondiciones

- El usuario ha iniciado sesión correctamente.
- El usuario dispone de conexión a Internet (modo online).
- El perfil del usuario existe en la tabla `profiles`.

---

# Estados de la mascota

| Estado | Descripción |
|---------|-------------|
| Activa | Mascota registrada y visible en el perfil del usuario. Estado por defecto. |
| Perdida | Mascota vinculada a un reporte de pérdida activo. |
| Encontrada | Mascota vinculada a un reporte de animal encontrado. |
| Archivada | Mascota oculta del perfil público. Conserva todo su historial. |

```text
        ┌─────────┐
        │ Activa  │ ◀── Estado inicial tras el registro
        └────┬────┘
             │
    ┌────────┼────────┐
    ▼        ▼        ▼
┌────────┐ ┌──────────┐ ┌──────────┐
│Perdida│ │Encontrada│ │Archivada │
└───┬────┘ └────┬─────┘ └────┬─────┘
    │           │            │
    └───────────┴────────────┘
                │
                ▼
           ┌─────────┐
           │ Activa  │ (Reactivación)
           └─────────┘
```

---

# Flujo principal: Registro de una mascota

```text
Usuario autenticado                     Next.js PWA                          Supabase
       │                                      │                                  │
       │ 1. Accede a /mascotas/nueva          │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │ 2. Muestra formulario                │                                  │
       │    (React Hook Form + Zod)           │                                  │
       │◀─────────────────────────────────────│                                  │
       │                                      │                                  │
       │ 3. Introduce los datos               │                                  │
       │    - Nombre                          │                                  │
       │    - Especie                         │                                  │
       │    - Raza                            │                                  │
       │    - Sexo                            │                                  │
       │    - Edad aproximada                 │                                  │
       │    - Características físicas         │                                  │
       │    - Información identificativa      │                                  │
       │      (chip, collar...)               │                                  │
       │                                      │                                  │
       │ 4. Selecciona fotografías            │                                  │
       │    (máximo 5 imágenes)               │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │ 5. Valida datos e imágenes           │                                  │
       │    (JPG/PNG, máximo 5 MB)            │                                  │
       │◀─────────────────────────────────────│                                  │
       │                                      │                                  │
       │ 6. Confirma el registro              │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │                                      │ 7. Sube imágenes a Storage        │
       │                                      │    mascotas/{user_id}             │
       │                                      │─────────────────────────────────▶│
       │                                      │                                  │
       │                                      │ 8. Obtiene URLs                  │
       │                                      │◀─────────────────────────────────│
       │                                      │                                  │
       │                                      │ 9. Inserta registro en pets      │
       │                                      │─────────────────────────────────▶│
       │                                      │                                  │
       │                                      │10. Aplica políticas RLS          │
       │                                      │    user_id = auth.uid()          │
       │                                      │◀─────────────────────────────────│
       │                                      │                                  │
       │11. Confirma el registro              │                                  │
       │   Redirige a /mascotas/{id}          │                                  │
       │◀─────────────────────────────────────│                                  │
```

---

# Flujo alternativo: Registro sin conexión (Offline)

```text
Usuario autenticado                     Next.js PWA
       │                                     │
       │ 1. Accede a /mascotas/nueva         │
       │────────────────────────────────────▶│
       │                                     │
       │ 2. Introduce información            │
       │    y fotografías                    │
       │────────────────────────────────────▶│
       │                                     │
       │ 3. Se detecta falta de conexión     │
       │                                     │
       │ 4. Guarda datos en IndexedDB        │
       │    Estado: Pendiente sincronización │
       │                                     │
       │ 5. Muestra mensaje                  │
       │   "Se sincronizará cuando           │
       │    vuelva la conexión."             │
       │◀────────────────────────────────────│
       │                                     │
       │ ...                                 │
       │                                     │
       │ 6. Detecta conexión restaurada      │
       │    Sincroniza automáticamente       │
       │────────────────────────────────────▶│
```

---

# Reglas de negocio y validaciones

| Regla | Descripción | Responsable |
|--------|-------------|-------------|
| Máximo de mascotas por usuario | Cada usuario podrá tener un máximo de **20 mascotas activas** durante el MVP. | Backend (Trigger) |
| Fotografía obligatoria | Debe existir al menos una fotografía para identificar al animal. | Frontend (Zod) |
| Formato de imágenes | Solo se aceptan archivos JPG, JPEG y PNG de hasta 5 MB por imagen. | Frontend + Storage Policies |
| Límite de imágenes | Máximo de 5 fotografías por mascota. | Frontend |
| Nombre único por usuario | No puede existir otra mascota con el mismo nombre dentro del perfil del mismo usuario. | Backend (Unique Constraint) |
| Campos obligatorios | Nombre, especie y sexo son obligatorios. | Frontend (Zod) |
| Estado inicial | Toda mascota se crea con estado **Activa** y no puede modificarse durante el registro. | Backend (Valor por defecto) |

---

# Manejo de errores

| Escenario | Mensaje al usuario | Acción técnica |
|------------|--------------------|----------------|
| Límite de mascotas alcanzado | "Has alcanzado el límite de 20 mascotas. Archiva una para continuar." | Validar el número de mascotas activas antes del INSERT. |
| Imagen demasiado grande | "La imagen supera los 5 MB. Comprímela o selecciona otra." | Validar `file.size` antes de subir el archivo. |
| Formato de imagen no válido | "Solo se permiten imágenes JPG, JPEG o PNG." | Validar `file.type` contra la lista permitida. |
| Error al subir imágenes | "No se pudieron subir las fotografías. Inténtalo de nuevo." | Capturar el error de Supabase Storage y permitir reintentar. |
| Error de red | "No se pudo guardar la mascota. Revisa tu conexión." | Ofrecer guardar en modo offline o reintentar la operación. |
| Nombre duplicado | "Ya tienes una mascota con ese nombre. Elige otro diferente." | Capturar la violación de la restricción UNIQUE de PostgreSQL. |

---

# Consideraciones técnicas

## Frontend (Next.js)

- El formulario utilizará **React Hook Form** junto con **Zod** para la validación.
- La subida de imágenes se realizará mediante un `<input type="file">` con previsualización.
- Antes de enviarlas se aplicará compresión client-side utilizando librerías como:

```text
browser-image-compression
```

- Durante la subida se mostrará una barra de progreso por imagen.

---

## Backend (Supabase)

### Tabla `pets`

| Campo | Tipo |
|--------|------|
| id | UUID (PK) |
| user_id | UUID (FK → auth.users) |
| name | text |
| species | enum ('dog', 'cat', 'other') |
| breed | text (nullable) |
| sex | enum ('male', 'female', 'unknown') |
| approximate_age | integer (meses, nullable) |
| physical_features | text |
| identifying_info | text |
| status | enum ('active', 'lost', 'found', 'archived') DEFAULT 'active' |
| photos | text[] (URLs de Storage) |
| created_at | timestamp |
| updated_at | timestamp |

### Seguridad en base de datos

- Las políticas **RLS** permitirán únicamente operaciones donde:

```text
user_id = auth.uid()
```

para **SELECT**, **INSERT**, **UPDATE** y **DELETE**.

### Storage

- Bucket:

```text
pet-photos
```

- Acceso restringido mediante políticas basadas en `user_id`.

---

# Seguridad

- Las imágenes se almacenarán en carpetas privadas por usuario.
- Cuando sea necesario compartirlas, se utilizarán **Signed URLs** con expiración.
- El cliente nunca podrá modificar los campos:
  - `user_id`
  - `created_at`
- Todas las operaciones estarán protegidas mediante **Row Level Security (RLS)**.

---

# Pantallas involucradas

| Pantalla | Ruta | Tipo |
|----------|------|------|
| Listado de mascotas | `/mascotas` | Protegida |
| Nueva mascota | `/mascotas/nueva` | Protegida |
| Detalle de mascota | `/mascotas/{id}` | Protegida |
| Editar mascota | `/mascotas/{id}/editar` | Protegida |

---

# 8.5.3 Flujo de creación de reporte de animal perdido

## Descripción

Este flujo permite a un usuario autenticado reportar la desaparición de su mascota. El sistema genera un aviso público con la información del animal, fotografías, la última ubicación conocida y un método de contacto protegido.

El reporte queda vinculado a una mascota previamente registrada o, si el usuario aún no la ha registrado, permite crear una ficha rápida durante el propio proceso.

---

# Actores

| Actor | Rol |
|--------|-----|
| Usuario autenticado (propietario) | Persona que reporta la pérdida de su mascota. |
| Usuario público | Persona que puede visualizar el reporte y contactar con el propietario. |
| Sistema (Supabase) | Gestiona la creación del reporte, las notificaciones y las políticas de acceso. |

---

# Precondiciones

- El usuario ha iniciado sesión correctamente.
- El usuario dispone de al menos una mascota registrada o puede crear una durante el proceso.
- El dispositivo permite obtener la ubicación mediante GPS o seleccionar manualmente una ubicación en el mapa.

---

# Estados del reporte

| Estado | Descripción |
|---------|-------------|
| Activo | Reporte visible públicamente. La mascota continúa desaparecida. |
| Encontrado | El propietario confirma que la mascota ha sido localizada. |
| Cerrado | Reporte finalizado y archivado. Ya no aparece en búsquedas activas. |
| Expirado | Reporte cerrado automáticamente tras 90 días sin actividad. |

```text
┌─────────┐
│ Activo  │
└────┬────┘
     │
     ├──────────────▶ Encontrado ─────────────▶ Cerrado
     │
     └──────────────▶ Expirado ───────────────▶ Cerrado
```

---

# Flujo principal: Crear reporte de mascota perdida

```text
Usuario autenticado                     Next.js PWA                          Supabase
       │                                      │                                  │
       │ 1. Accede a                          │                                  │
       │    /reportes/perdido/nuevo          │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │ 2. Muestra selector de mascotas      │                                  │
       │◀─────────────────────────────────────│                                  │
       │                                      │                                  │
       │ 3. Selecciona mascota                │                                  │
       │    o crea una nueva                  │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │ 4. Completa formulario               │                                  │
       │    - Fecha y hora                    │                                  │
       │    - Última ubicación                │                                  │
       │    - Circunstancias                  │                                  │
       │    - Fotografías                     │                                  │
       │    - Recompensa (opcional)           │                                  │
       │    - Método de contacto              │                                  │
       │◀─────────────────────────────────────│                                  │
       │                                      │                                  │
       │ 5. Obtiene GPS                       │                                  │
       │    o selecciona ubicación            │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │ 6. Valida información                │                                  │
       │    Fecha no futura                   │                                  │
       │    Ubicación obligatoria             │                                  │
       │◀─────────────────────────────────────│                                  │
       │                                      │                                  │
       │ 7. Confirma publicación              │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │                                      │ 8. Actualiza pets.status='lost'   │
       │                                      │─────────────────────────────────▶│
       │                                      │                                  │
       │                                      │ 9. Inserta registro en reports    │
       │                                      │─────────────────────────────────▶│
       │                                      │                                  │
       │                                      │10. Genera URL pública             │
       │                                      │◀─────────────────────────────────│
       │                                      │                                  │
       │11. Confirma publicación              │                                  │
       │   y ofrece compartir                 │                                  │
       │◀─────────────────────────────────────│                                  │
```

---

# Flujo alternativo: Crear una mascota durante el reporte

```text
Usuario autenticado                     Next.js PWA                          Supabase
       │                                      │                                  │
       │ 1. Pulsa "Registrar mascota nueva"   │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │ 2. Muestra formulario reducido       │                                  │
       │    - Nombre                          │                                  │
       │    - Especie                         │                                  │
       │    - Sexo                            │                                  │
       │    - Fotografía principal            │                                  │
       │    - Características básicas         │                                  │
       │◀─────────────────────────────────────│                                  │
       │                                      │                                  │
       │ 3. Confirma                          │                                  │
       │─────────────────────────────────────▶│─────────────────────────────────▶│
       │                                      │                                  │
       │                                      │ 4. Inserta mascota en pets        │
       │                                      │◀─────────────────────────────────│
       │                                      │                                  │
       │ 5. Continúa el flujo                 │                                  │
       │    del reporte                       │                                  │
       │◀─────────────────────────────────────│                                  │
```

---

# Reglas de negocio y validaciones

| Regla | Descripción | Responsable |
|--------|-------------|-------------|
| Mascota vinculada obligatoria | Todo reporte de pérdida debe estar asociado a una mascota existente. | Backend (FK Constraint) |
| Una mascota, un reporte activo | Una mascota solo puede tener un reporte de pérdida activo simultáneamente. | Backend (Unique Constraint) |
| Ubicación obligatoria | Debe indicarse una ubicación aproximada mediante GPS o selección manual. | Frontend (Zod) |
| Fecha no futura | La fecha del extravío no puede ser posterior al momento actual. | Frontend + Backend |
| Recompensa opcional | Campo numérico opcional con valor mínimo 0 €. | Frontend (Zod) |
| Expiración automática | Los reportes activos se cerrarán automáticamente tras 90 días sin actividad. | Backend (Cron Job / Edge Function) |
| Edición limitada | Solo el propietario puede modificar el reporte mientras permanezca activo. | RLS |

---

# Manejo de errores

| Escenario | Mensaje al usuario | Acción técnica |
|------------|--------------------|----------------|
| GPS no disponible | "No se pudo obtener tu ubicación. Selecciónala manualmente en el mapa." | Cambiar automáticamente al selector de mapa (Leaflet). |
| Mascota con reporte activo | "Esta mascota ya tiene un reporte de pérdida activo. Ciérralo antes de crear otro." | Validar antes del INSERT en la base de datos. |
| Fecha futura | "La fecha del extravío no puede ser posterior a hoy." | Validación en Zod y comprobación adicional en backend. |
| Sin fotografías | "Añade al menos una fotografía para identificar a tu mascota." | Validar que exista al menos una imagen antes de publicar. |
| Error al publicar | "No se pudo publicar el reporte. Inténtalo de nuevo." | Capturar errores de Supabase y permitir reintentar la operación. |

---

# Consideraciones técnicas

## Frontend (Next.js)

- La selección de ubicación utilizará **Leaflet** junto con la API de geolocalización del navegador.
- La fecha del extravío se introducirá mediante un componente `datetime-local`.
- Las fotografías adicionales se almacenarán en:

```text
reports/{report_id}
```

- La URL pública seguirá un formato optimizado para SEO:

```text
/reportes/perdido/{slug}-{id}
```

---

## Backend (Supabase)

### Tabla `reports`

| Campo | Tipo |
|--------|------|
| id | UUID (PK) |
| type | enum ('lost', 'found') |
| status | enum ('active', 'found', 'closed', 'expired') DEFAULT 'active' |
| pet_id | UUID (FK → pets) |
| user_id | UUID (FK → auth.users) |
| last_seen_at | timestamp |
| location_lat | decimal |
| location_lng | decimal |
| location_address | text |
| description | text |
| circumstances | text |
| reward | decimal (nullable) |
| contact_preference | enum ('app', 'email', 'phone') |
| photos | text[] |
| created_at | timestamp |
| updated_at | timestamp |

### Seguridad en base de datos

- Escritura protegida mediante:

```text
user_id = auth.uid()
```

- Los reportes con estado **Activo** serán de lectura pública.

### Triggers

Al crear un reporte de tipo **lost**, se actualizará automáticamente el estado de la mascota:

```text
pets.status = 'lost'
```

---

# SEO

- Las páginas públicas se renderizarán mediante **Server Side Rendering (SSR)**.
- Se generarán metadatos dinámicos como:

```text
Perro perdido en [Ciudad] - [Nombre] | BuscoHuella
```

- Se configurarán etiquetas **Open Graph** utilizando la fotografía principal de la mascota para mejorar la visualización al compartir el enlace.

---

# Pantallas involucradas

| Pantalla | Ruta | Tipo |
|----------|------|------|
| Nuevo reporte de pérdida | `/reportes/perdido/nuevo` | Protegida |
| Selector de mascota | `/reportes/perdido/nuevo?step=pet` | Protegida |
| Detalle del reporte | `/reportes/perdido/{slug}-{id}` | Pública |
| Mis reportes | `/mis-reportes` | Protegida |
| Editar reporte | `/reportes/{id}/editar` | Protegida |

---

# 8.5.4 Flujo de creación de reporte de animal encontrado

## Descripción

Este flujo permite a cualquier persona, registrada o anónima, reportar un animal encontrado. A diferencia del reporte de pérdida, el animal no necesita estar previamente registrado en la plataforma, ya que normalmente se desconoce su propietario.

El reporte incluye fotografías, ubicación del hallazgo, descripción del animal y un método de contacto protegido. Si el animal dispone de chip, collar o placa identificativa, esta información puede añadirse para facilitar la localización de su propietario.

---

# Actores

| Actor | Rol |
|--------|-----|
| Usuario autenticado | Persona registrada que reporta un animal encontrado. |
| Usuario anónimo | Persona sin cuenta que reporta un animal encontrado (requiere verificación anti-spam). |
| Sistema (Supabase) | Gestiona la creación del reporte, la búsqueda de coincidencias y las notificaciones. |

---

# Precondiciones

- El dispositivo dispone de acceso a la cámara o galería de imágenes.
- El dispositivo puede obtener la ubicación mediante GPS o permite seleccionarla manualmente.
- Los usuarios anónimos deben superar la verificación anti-spam (CAPTCHA).

---

# Estados del reporte

| Estado | Descripción |
|---------|-------------|
| Activo | Reporte visible públicamente mientras se busca al propietario. |
| Reclamado | Un usuario indica ser el propietario. Pendiente de verificación. |
| Resuelto | Se confirma la identidad del propietario y el animal ha sido devuelto. |
| Cerrado | Reporte archivado sin resolución confirmada. |
| Expirado | Reporte cerrado automáticamente tras 90 días sin actividad. |

```text
┌─────────┐
│ Activo  │
└────┬────┘
     │
     ├──────────────▶ Reclamado ─────────────▶ Resuelto ─────────────▶ Cerrado
     │
     └──────────────▶ Expirado ──────────────▶ Cerrado
```

---

# Flujo principal: Reportar un animal encontrado (usuario autenticado)

```text
Usuario autenticado                     Next.js PWA                          Supabase
       │                                      │                                  │
       │ 1. Accede a                          │                                  │
       │    /reportes/encontrado/nuevo       │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │ 2. Muestra formulario                │                                  │
       │    - Fotografías                     │                                  │
       │    - Especie                         │                                  │
       │    - Raza (opcional)                 │                                  │
       │    - Sexo (opcional)                 │                                  │
       │    - Características físicas         │                                  │
       │    - Chip / Collar / Placa           │                                  │
       │    - Fecha y hora                    │                                  │
       │    - Ubicación                       │                                  │
       │    - Circunstancias                  │                                  │
       │    - Contacto                        │                                  │
       │◀─────────────────────────────────────│                                  │
       │                                      │                                  │
       │ 3. Añade fotografías                 │                                  │
       │    (1 a 5 imágenes)                  │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │ 4. Obtiene GPS                       │                                  │
       │    o selecciona ubicación            │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │ 5. Valida información                │                                  │
       │    Fecha válida                      │                                  │
       │    Mínimo una fotografía             │                                  │
       │◀─────────────────────────────────────│                                  │
       │                                      │                                  │
       │ 6. Confirma publicación              │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │                                      │ 7. Sube imágenes a Storage        │
       │                                      │─────────────────────────────────▶│
       │                                      │                                  │
       │                                      │ 8. Obtiene URLs                  │
       │                                      │◀─────────────────────────────────│
       │                                      │                                  │
       │                                      │ 9. Inserta registro en reports    │
       │                                      │    type='found'                  │
       │                                      │─────────────────────────────────▶│
       │                                      │                                  │
       │                                      │10. Busca coincidencias            │
       │                                      │    potenciales                   │
       │                                      │◀─────────────────────────────────│
       │                                      │                                  │
       │11. Confirma publicación              │                                  │
       │   Muestra coincidencias              │                                  │
       │◀─────────────────────────────────────│                                  │
```

---

# Flujo alternativo: Reporte anónimo

```text
Usuario anónimo                          Next.js PWA                          Supabase
       │                                      │                                  │
       │ 1. Accede a                          │                                  │
       │    /reportes/encontrado/nuevo       │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │ 2. Muestra formulario                │                                  │
       │    + Email obligatorio               │                                  │
       │    + CAPTCHA                         │                                  │
       │◀─────────────────────────────────────│                                  │
       │                                      │                                  │
       │ 3. Completa formulario               │                                  │
       │    y CAPTCHA                         │                                  │
       │─────────────────────────────────────▶│                                  │
       │                                      │                                  │
       │ 4. Valida CAPTCHA                    │                                  │
       │─────────────────────────────────────▶│─────────────────────────────────▶│
       │                                      │                                  │
       │                                      │ 5. Verifica CAPTCHA              │
       │                                      │◀─────────────────────────────────│
       │                                      │                                  │
       │                                      │ 6. Inserta reporte               │
       │                                      │    user_id = null                │
       │                                      │─────────────────────────────────▶│
       │                                      │                                  │
       │ 7. Envía email de gestión            │                                  │
       │◀─────────────────────────────────────│                                  │
```

---

# Reglas de negocio y validaciones

| Regla | Descripción | Responsable |
|--------|-------------|-------------|
| Email obligatorio (anónimo) | Los usuarios sin cuenta deben proporcionar un correo electrónico válido. | Frontend (Zod) |
| CAPTCHA obligatorio (anónimo) | Todos los reportes anónimos deben superar una verificación anti-spam. | Frontend + Edge Function |
| Fotografía obligatoria | Debe añadirse al menos una fotografía del animal encontrado. | Frontend (Zod) |
| Ubicación obligatoria | Debe indicarse mediante GPS o selección manual en el mapa. | Frontend (Zod) |
| Fecha no futura | La fecha del hallazgo no puede ser posterior al momento actual. | Frontend + Backend |
| Contacto protegido | Los datos de contacto nunca se muestran directamente al público. | Frontend |
| Coincidencias automáticas | El sistema buscará automáticamente reportes de pérdida compatibles. | Backend (Edge Function) |

---

# Manejo de errores

| Escenario | Mensaje al usuario | Acción técnica |
|------------|--------------------|----------------|
| CAPTCHA fallido | "La verificación de seguridad ha fallado. Inténtalo de nuevo." | Rechazar la petición y solicitar un nuevo CAPTCHA. |
| Email inválido | "Introduce un correo electrónico válido para que puedan contactarte." | Validar el formato mediante Zod. |
| Sin fotografías | "Añade al menos una fotografía del animal encontrado." | Validar que exista al menos una imagen antes de publicar. |
| GPS desactivado | "Activa la ubicación o selecciona manualmente el lugar en el mapa." | Cambiar automáticamente al selector manual (Leaflet). |
| Error al buscar coincidencias | "Reporte publicado correctamente. Revisaremos posibles coincidencias." | No bloquear la publicación si falla el proceso de matching. |

---

# Consideraciones técnicas

## Frontend (Next.js)

- El formulario será muy similar al utilizado para reportar una mascota perdida, pero sin el selector de mascotas del usuario.
- Los usuarios anónimos dispondrán de un campo adicional para introducir su correo electrónico.
- Se integrará **hCaptcha** o **Cloudflare Turnstile** para evitar spam.
- La selección manual de la ubicación se realizará mediante **Leaflet**.

---

## Backend (Supabase)

### Tabla `reports`

Se utilizará la misma tabla de reportes, diferenciando el tipo mediante:

```text
type = 'found'
```

Además, se añadirá el siguiente campo para los reportes anónimos:

| Campo | Tipo |
|--------|------|
| anonymous_email | text (nullable) |

### Seguridad en base de datos

- Los usuarios autenticados escribirán mediante RLS.
- Los reportes anónimos se crearán a través de una **Edge Function** que validará previamente el CAPTCHA.
- Los reportes con estado **Activo** serán de lectura pública.

### Edge Function

Función encargada de localizar posibles coincidencias:

```text
match-found-pet
```

Criterios utilizados:

- Radio aproximado de 5 km.
- Misma especie.
- Fecha cercana.
- Características similares.

---

# SEO

Las páginas públicas de animales encontrados serán indexables mediante una URL amigable:

```text
/reportes/encontrado/{slug}-{id}
```

Se generarán metadatos dinámicos como:

```text
Animal encontrado en [Ciudad] - [Especie] | BuscoHuella
```

---

# Pantallas involucradas

| Pantalla | Ruta | Tipo |
|----------|------|------|
| Nuevo reporte de hallazgo | `/reportes/encontrado/nuevo` | Pública / Protegida |
| Detalle del reporte | `/reportes/encontrado/{slug}-{id}` | Pública |
| Mis reportes | `/mis-reportes` | Protegida |
| Gestionar reporte anónimo | `/reportes/gestionar?token={token}` | Pública |

---

# 8.5.5 Flujo de búsqueda y localización de animales

## Descripción

Este flujo permite a cualquier usuario, registrado o anónimo, localizar animales perdidos o encontrados mediante filtros de búsqueda y visualización geográfica.

La plataforma ofrece dos modos de visualización: **lista de resultados** y **mapa interactivo**. Cuando el usuario concede acceso a su ubicación, las búsquedas priorizan los reportes más cercanos geográficamente.

---

# Actores

| Actor | Rol |
|--------|-----|
| Usuario (registrado o anónimo) | Persona que busca animales o reportes en la plataforma. |
| Sistema de geolocalización | Servicio del navegador que proporciona las coordenadas GPS del usuario. |
| Supabase PostgreSQL + PostGIS | Base de datos encargada de ejecutar consultas geoespaciales y aplicar filtros de búsqueda. |

---

# Modos de visualización

| Modo | Descripción | Uso recomendado |
|------|-------------|-----------------|
| Lista | Resultados ordenados por proximidad o fecha en formato de tarjetas. | Consultar rápidamente fotografías y detalles principales. |
| Mapa | Marcadores geolocalizados sobre un mapa interactivo (Leaflet). | Visualizar la distribución geográfica de los reportes. |

---

# Flujo principal: Búsqueda con geolocalización activa

```text
Usuario                               Next.js PWA                     Supabase + PostGIS
    │                                      │                                  │
    │ 1. Accede a /buscar o /mapa          │                                  │
    │─────────────────────────────────────▶│                                  │
    │                                      │                                  │
    │ 2. Solicita permiso de ubicación     │                                  │
    │◀─────────────────────────────────────│                                  │
    │                                      │                                  │
    │ 3. Acepta o deniega                  │                                  │
    │─────────────────────────────────────▶│                                  │
    │                                      │                                  │
    │ 4. Obtiene coordenadas GPS           │                                  │
    │─────────────────────────────────────▶│                                  │
    │                                      │                                  │
    │ 5. Muestra filtros por defecto       │                                  │
    │    - Radio: 5 km                     │                                  │
    │    - Estado                          │                                  │
    │    - Orden                           │                                  │
    │◀─────────────────────────────────────│                                  │
    │                                      │                                  │
    │ 6. Aplica filtros                    │                                  │
    │─────────────────────────────────────▶│─────────────────────────────────▶│
    │                                      │                                  │
    │                                      │ 7. Consulta PostGIS              │
    │                                      │    ST_DWithin                    │
    │                                      │    ST_Distance                   │
    │                                      │◀─────────────────────────────────│
    │                                      │                                  │
    │ 8. Renderiza resultados              │                                  │
    │    Lista o mapa                      │                                  │
    │◀─────────────────────────────────────│                                  │
    │                                      │                                  │
    │ 9. Selecciona un resultado           │                                  │
    │─────────────────────────────────────▶│─────────────────────────────────▶│
    │                                      │                                  │
    │                                      │10. Obtiene detalle completo      │
    │                                      │◀─────────────────────────────────│
    │                                      │                                  │
    │11. Muestra ficha del reporte         │                                  │
    │   Fotografías                        │                                  │
    │   Descripción                        │                                  │
    │   Distancia                          │                                  │
    │   Contacto                           │                                  │
    │◀─────────────────────────────────────│                                  │
```

---

# Flujo alternativo: Búsqueda sin geolocalización

```text
Usuario                               Next.js PWA                          Supabase
    │                                      │                                  │
    │ 1. No concede permiso GPS            │                                  │
    │─────────────────────────────────────▶│                                  │
    │                                      │                                  │
    │ 2. Utiliza ubicación por defecto     │                                  │
    │    o búsqueda manual                 │                                  │
    │◀─────────────────────────────────────│                                  │
    │                                      │                                  │
    │ 3. Introduce ciudad                  │                                  │
    │    o selecciona punto                │                                  │
    │─────────────────────────────────────▶│─────────────────────────────────▶│
    │                                      │                                  │
    │                                      │ 4. Resuelve coordenadas          │
    │                                      │    Ejecuta consulta              │
    │                                      │◀─────────────────────────────────│
    │                                      │                                  │
    │ 5. Muestra resultados                │                                  │
    │    ordenados por proximidad          │                                  │
    │◀─────────────────────────────────────│                                  │
```

---

# Flujo alternativo: Sin resultados

```text
Usuario                               Next.js PWA
    │                                      │
    │ 1. Aplica filtros                    │
    │─────────────────────────────────────▶│
    │                                      │
    │ 2. Consulta devuelve                 │
    │    cero resultados                   │
    │◀─────────────────────────────────────│
    │                                      │
    │ 3. Muestra estado vacío              │
    │    "No hay reportes                  │
    │     en esta zona"                    │
    │                                      │
    │    Sugerencias:                      │
    │    - Ampliar radio                   │
    │    - Cambiar filtros                 │
    │    - Crear alerta (futuro)           │
    │◀─────────────────────────────────────│
    │                                      │
    │ 4. Modifica filtros                  │
    │─────────────────────────────────────▶│
```

---

# Reglas de negocio y validaciones

| Regla | Descripción | Responsable |
|--------|-------------|-------------|
| Radio de búsqueda | El radio permitido estará comprendido entre 1 km y 50 km. | Frontend + Supabase |
| Resultados paginados | La búsqueda devolverá 20 resultados por página mediante paginación o infinite scroll. | Supabase |
| Privacidad de coordenadas | Las coordenadas del usuario se redondearán antes de almacenarse en logs para proteger su privacidad. | Frontend |
| Orden por defecto | Los resultados se ordenarán primero por proximidad y posteriormente por fecha descendente. | Supabase |
| Datos públicos | Los reportes activos podrán consultarse sin necesidad de autenticación. | RLS + Supabase |
| Miniaturas | En la lista solo se cargarán imágenes en miniatura; la imagen original se solicitará al abrir el detalle. | Supabase Storage |

---

# Manejo de errores

| Escenario | Mensaje al usuario | Acción técnica |
|------------|--------------------|----------------|
| GPS no disponible | "No se pudo acceder a tu ubicación. Mostrando resultados de la zona predeterminada." | Utilizar unas coordenadas de referencia configuradas por la aplicación. |
| Error de red | "No se pudieron cargar los resultados. Pulsa para volver a intentarlo." | Mostrar botón de reintento con backoff exponencial. |
| Tiempo de espera excedido | "La búsqueda está tardando más de lo esperado." | Cancelar la consulta tras 10 segundos y mostrar un skeleton loader. |
| Permiso de ubicación denegado | "Puedes buscar introduciendo una localidad o seleccionando una zona en el mapa." | Mostrar buscador por texto y selección manual mediante Leaflet. |

---

# Consideraciones técnicas

## Frontend (Next.js)

- La carga inicial de resultados se realizará mediante **Server Components (SSR)** para mejorar el posicionamiento SEO.
- El mapa interactivo será un **Client Component** implementado con **React Leaflet**.
- Todos los filtros se sincronizarán con los parámetros de la URL para permitir compartir búsquedas y favorecer la indexación.
- **TanStack Query** gestionará el estado, la caché y la revalidación automática de los resultados.

---

## Backend (Supabase)

### Base de datos

Las búsquedas geográficas utilizarán la extensión **PostGIS**, empleando funciones como:

```text
ST_DWithin()
ST_Distance()
```

Para búsquedas complejas se implementará una función SQL o una **Edge Function** que combine:

- Proximidad geográfica.
- Estado del reporte.
- Especie.
- Raza.
- Fecha.
- Otros filtros dinámicos.

### Imágenes

Las miniaturas se servirán desde **Supabase Storage** utilizando transformaciones automáticas para reducir el tamaño de descarga.

---

# Rendimiento

- Las columnas geográficas dispondrán de índices **GIST** para optimizar las consultas espaciales.
- Los campos de búsqueda por texto utilizarán un **debounce de 300 ms** para evitar solicitudes innecesarias.
- Cuando existan más de 50 marcadores visibles, el mapa activará automáticamente el **Marker Clustering** para mejorar el rendimiento y la experiencia de usuario.

---

# Pantallas involucradas

| Pantalla | Ruta | Tipo |
|----------|------|------|
| Búsqueda / Explorar | `/buscar` | Pública |
| Mapa interactivo | `/mapa` | Pública |
| Detalle de reporte | `/reporte/[id]` | Pública (SSR/SEO) |
| Mis búsquedas guardadas | `/busquedas` | Protegida (Funcionalidad futura) |

---

# 8.5.6 Flujo de contacto entre usuarios

## Descripción

Este flujo permite que un usuario que ha encontrado, visto o dispone de información relevante sobre un animal pueda ponerse en contacto con la persona que publicó un reporte.

En el MVP el contacto se realiza de forma indirecta y protegida, evitando exponer datos personales hasta que ambas partes acepten el intercambio de información. En futuras versiones se incorporará mensajería interna en tiempo real.

El objetivo principal es facilitar la recuperación de animales manteniendo la privacidad y seguridad de todos los usuarios.

---

# Actores

| Actor | Rol |
|--------|-----|
| Usuario solicitante | Persona que desea contactar con el autor de un reporte. |
| Usuario receptor | Persona que publicó el reporte de pérdida o hallazgo. |
| Sistema de moderación | Sistema encargado de registrar solicitudes y prevenir abusos (futura versión). |

---

# Estados de la solicitud de contacto

| Estado | Descripción |
|---------|-------------|
| Pendiente | La solicitud ha sido enviada y está esperando respuesta. |
| Aceptada | El receptor acepta compartir sus datos de contacto. |
| Rechazada | El receptor rechaza la solicitud. |
| Completada | Ambas partes han establecido contacto externo. |
| Expirada | La solicitud no ha recibido respuesta durante 7 días. |

```text
┌─────────────────┐
│   Pendiente     │
│   (Enviada)     │
└────────┬────────┘
         │
         ├──────────────▶ Aceptada ─────────────▶ Completada
         │
         ├──────────────▶ Rechazada
         │
         └──────────────▶ Expirada
```

---

# Flujo principal: Envío de solicitud de contacto

```text
Usuario A (Solicitante)               Next.js PWA                    Usuario B (Receptor)
         │                                  │                                  │
         │ 1. Abre un reporte               │                                  │
         │    y pulsa "Contactar"           │                                  │
         │─────────────────────────────────▶│                                  │
         │                                  │                                  │
         │ 2. Verifica autenticación        │                                  │
         │◀─────────────────────────────────│                                  │
         │                                  │                                  │
         │ 3. Muestra formulario            │                                  │
         │    - Motivo                      │                                  │
         │    - Mensaje                     │                                  │
         │    - Teléfono (opcional)         │                                  │
         │◀─────────────────────────────────│                                  │
         │                                  │                                  │
         │ 4. Envía solicitud               │                                  │
         │─────────────────────────────────▶│─────────────────────────────────▶│
         │                                  │                                  │
         │                                  │ 5. Inserta registro             │
         │                                  │    contact_requests             │
         │                                  │    status='pending'             │
         │                                  │                                  │
         │                                  │ 6. Envía notificación           │
         │                                  │◀─────────────────────────────────│
         │                                  │                                  │
         │ 7. Confirma envío                │                                  │
         │◀─────────────────────────────────│                                  │
```

---

# Flujo principal: Respuesta del receptor

```text
Usuario B (Receptor)                  Next.js PWA                  Usuario A (Solicitante)
         │                                  │                                  │
         │ 1. Recibe notificación           │                                  │
         │─────────────────────────────────▶│                                  │
         │                                  │                                  │
         │ 2. Consulta solicitud            │                                  │
         │    pendiente                     │                                  │
         │◀─────────────────────────────────│                                  │
         │                                  │                                  │
         │ 3. Selecciona acción             │                                  │
         │    [Aceptar] [Rechazar]          │                                  │
         │─────────────────────────────────▶│                                  │
         │                                  │                                  │
         │ 4. Si acepta                     │                                  │
         │    - Confirma datos              │                                  │
         │    - Comparte contacto           │                                  │
         │                                  │─────────────────────────────────▶│
         │                                  │                                  │
         │                                  │ 5. Notifica aceptación          │
         │                                  │    y datos compartidos          │
         │                                  │◀─────────────────────────────────│
         │                                  │                                  │
         │ 6. Si rechaza                    │                                  │
         │    - Motivo opcional             │                                  │
         │                                  │─────────────────────────────────▶│
         │                                  │                                  │
         │                                  │ 7. Notifica rechazo             │
         │                                  │◀─────────────────────────────────│
```

---

# Flujo alternativo: Usuario no autenticado

```text
Usuario anónimo                        Next.js PWA
        │                                   │
        │ 1. Pulsa "Contactar"              │
        │──────────────────────────────────▶│
        │                                   │
        │ 2. Detecta sesión inexistente     │
        │                                   │
        │ 3. Muestra modal                  │
        │    "Necesitas una cuenta          │
        │     para contactar"               │
        │                                   │
        │    [Iniciar sesión]              │
        │    [Registrarse]                 │
        │◀──────────────────────────────────│
        │                                   │
        │ 4. Completa autenticación         │
        │──────────────────────────────────▶│
        │                                   │
        │ 5. Regresa al reporte             │
        │    con formulario abierto         │
        │◀──────────────────────────────────│
```

---

# Reglas de negocio y validaciones

| Regla | Descripción | Responsable |
|--------|-------------|-------------|
| Autenticación obligatoria | Solo usuarios registrados y con cuenta verificada pueden enviar solicitudes. | Supabase Auth + Frontend |
| Límite de solicitudes | Máximo 3 solicitudes por reporte y 10 solicitudes por día. | Supabase (RLS + Triggers) |
| Mensaje obligatorio | Longitud mínima de 20 caracteres y máxima de 500 caracteres. | Frontend (Zod) + Supabase |
| Privacidad de datos | El receptor solo ve el mensaje y motivo hasta aceptar el contacto. | Supabase RLS |
| Plazo de respuesta | La solicitud expira automáticamente tras 7 días sin respuesta. | Supabase (Cron Job / Edge Function) |
| Bloqueo de usuarios | El receptor puede bloquear a un solicitante para impedir futuros contactos. | Supabase |
| Prevención de spam | Mensajes sospechosos pueden requerir revisión adicional. | Edge Function (futura versión) |

---

# Manejo de errores

| Escenario | Mensaje al usuario | Acción técnica |
|------------|--------------------|----------------|
| Límite de solicitudes alcanzado | "Has alcanzado el límite de contactos por hoy. Inténtalo mañana." | Validar contador antes de crear la solicitud. |
| Reporte resuelto | "Este reporte ya ha sido resuelto y no acepta nuevos contactos." | Verificar estado del reporte antes de permitir el envío. |
| Usuario bloqueado | "No es posible contactar con este usuario en este momento." | Consultar tabla de bloqueos antes de procesar la solicitud. |
| Error al enviar notificación | "La solicitud se ha guardado correctamente. La notificación se enviará más tarde." | Registrar en cola de reintentos para email o push. |

---

# Consideraciones técnicas

## Frontend (Next.js)

- El botón **Contactar** se mostrará en la ficha pública del reporte.
- El formulario de contacto será un **Client Component** interactivo.
- El estado de las solicitudes se gestionará mediante **TanStack Query**.
- Las notificaciones push requerirán un **Service Worker** activo en la PWA.

---

## Backend (Supabase)

### Tabla `contact_requests`

| Campo | Tipo |
|--------|------|
| id | UUID (PK) |
| report_id | UUID (FK → reports) |
| requester_id | UUID (FK → auth.users) |
| recipient_id | UUID (FK → auth.users) |
| message | text |
| reason | text |
| status | enum ('pending', 'accepted', 'rejected', 'completed', 'expired') |
| shared_contact_data | jsonb |
| created_at | timestamp |
| responded_at | timestamp |

### Seguridad en base de datos

Las políticas RLS permitirán visualizar únicamente las solicitudes donde:

```text
requester_id = auth.uid()

o

recipient_id = auth.uid()
```

### Automatización

Un trigger actualizará automáticamente la fecha de modificación y ejecutará una Edge Function cuando cambie el estado de una solicitud.

---

# Privacidad y seguridad

- Los datos personales del receptor no se exponen hasta que acepta la solicitud.
- Todos los mensajes se sanitizan antes de almacenarse para prevenir ataques XSS.
- Se registrará información de auditoría:
  - Dirección IP.
  - Fecha y hora.
  - Identificador de usuario.

- Estos datos nunca serán visibles desde la interfaz pública.

---

# Pantallas involucradas

| Pantalla | Ruta | Tipo |
|----------|------|------|
| Detalle de reporte | `/reporte/[id]` | Pública |
| Formulario de contacto | `/reporte/[id]/contactar` | Protegida |
| Solicitudes enviadas | `/perfil/contactos/enviados` | Protegida |
| Solicitudes recibidas | `/perfil/contactos/recibidos` | Protegida |
| Notificación por email | Enlace externo con token temporal | Pública |

---

# 8.5.7 Flujo de resolución de un reporte

## Descripción

Este flujo permite al autor de un reporte marcarlo como resuelto cuando el animal ha sido recuperado, localizado o la situación ha finalizado.

También contempla la actualización intermedia del estado cuando existen novedades relevantes pero el caso continúa abierto.

La resolución de un reporte modifica su visibilidad pública, cancela las solicitudes de contacto pendientes y actualiza el estado asociado de la mascota cuando corresponda.

---

# Actores

| Actor | Rol |
|--------|-----|
| Usuario autor | Persona que creó el reporte y puede modificar su estado. |
| Usuario con solicitud activa | Persona que había solicitado contacto y recibe notificación del cierre. |
| Sistema | Gestiona el cambio de estado, las notificaciones y el archivado automático. |

---

# Estados del reporte

| Estado | Descripción | Visibilidad |
|---------|-------------|-------------|
| Activo | Reporte publicado y visible. Acepta nuevas solicitudes de contacto. | Pública |
| En avance | El autor ha añadido información adicional, pero el caso sigue abierto. | Pública |
| Resuelto | El animal ha sido recuperado o la incidencia ha finalizado. No acepta nuevos contactos. | Pública (marcado como resuelto) |
| Archivado | Reporte histórico únicamente visible para su autor. | Privada |

```text
                 Estado inicial
                      │
                      ▼
                ┌──────────┐
                │  Activo  │
                └────┬─────┘
                     │
             Actualización
                     ▼
              ┌────────────┐
              │ En avance  │
              └────┬───────┘
                   │
                   ▼
              ┌────────────┐
              │ Resuelto   │
              └────┬───────┘
                   │
          Archivado automático
                   ▼
             ┌────────────┐
             │ Archivado  │
             └────────────┘

Durante las primeras 24 horas:

Resuelto ─────────────▶ Activo (Deshacer)
```

---

# Flujo principal: Resolver un reporte

```text
Usuario (Autor)                      Next.js PWA                          Supabase
      │                                   │                                  │
      │ 1. Accede a "Mis reportes"        │                                  │
      │──────────────────────────────────▶│─────────────────────────────────▶│
      │                                   │                                  │
      │                                   │ 2. Consulta reportes             │
      │                                   │    del usuario                   │
      │                                   │◀─────────────────────────────────│
      │                                   │                                  │
      │ 3. Muestra listado                │                                  │
      │◀──────────────────────────────────│                                  │
      │                                   │                                  │
      │ 4. Selecciona                     │                                  │
      │    "Marcar como resuelto"         │                                  │
      │──────────────────────────────────▶│                                  │
      │                                   │                                  │
      │ 5. Muestra confirmación           │                                  │
      │    - Motivo                       │                                  │
      │    - Mensaje opcional             │                                  │
      │◀──────────────────────────────────│                                  │
      │                                   │                                  │
      │ 6. Confirma                       │                                  │
      │──────────────────────────────────▶│─────────────────────────────────▶│
      │                                   │                                  │
      │                                   │ 7. Actualiza estado             │
      │                                   │    a RESUELTO                   │
      │                                   │                                  │
      │                                   │ 8. Cancela solicitudes          │
      │                                   │    pendientes                   │
      │                                   │                                  │
      │                                   │ 9. Envía notificaciones         │
      │                                   │◀─────────────────────────────────│
      │                                   │                                  │
      │ 10. Muestra confirmación          │                                  │
      │◀──────────────────────────────────│                                  │
      │                                   │                                  │
      │ 11. Redirige a                    │                                  │
      │     "Mis reportes"                │                                  │
      │◀──────────────────────────────────│                                  │
```

---

# Flujo alternativo: Actualizar estado del reporte

```text
Usuario (Autor)                      Next.js PWA                          Supabase
      │                                   │                                  │
      │ 1. Abre un reporte activo         │                                  │
      │──────────────────────────────────▶│─────────────────────────────────▶│
      │                                   │                                  │
      │ 2. Pulsa                          │                                  │
      │    "Actualizar estado"            │                                  │
      │──────────────────────────────────▶│                                  │
      │                                   │                                  │
      │ 3. Completa formulario            │                                  │
      │    - Estado                       │                                  │
      │    - Nueva ubicación              │                                  │
      │    - Fotografías                  │                                  │
      │    - Mensaje                      │                                  │
      │◀──────────────────────────────────│                                  │
      │                                   │                                  │
      │ 4. Guarda cambios                 │                                  │
      │──────────────────────────────────▶│─────────────────────────────────▶│
      │                                   │                                  │
      │                                   │ 5. Actualiza reporte            │
      │                                   │    y updated_at                 │
      │                                   │                                  │
      │                                   │ 6. Notifica usuarios            │
      │                                   │◀─────────────────────────────────│
      │                                   │                                  │
      │ 7. Confirma actualización         │                                  │
      │◀──────────────────────────────────│                                  │
```

---

# Flujo alternativo: Deshacer resolución

```text
Usuario (Autor)                      Next.js PWA                          Supabase
      │                                   │                                  │
      │ 1. Abre reporte resuelto          │                                  │
      │    (<24 horas)                    │                                  │
      │──────────────────────────────────▶│─────────────────────────────────▶│
      │                                   │                                  │
      │ 2. Muestra botón                  │                                  │
      │    "Deshacer"                     │                                  │
      │◀──────────────────────────────────│                                  │
      │                                   │                                  │
      │ 3. Confirma                       │                                  │
      │──────────────────────────────────▶│─────────────────────────────────▶│
      │                                   │                                  │
      │                                   │ 4. Restaura estado             │
      │                                   │    ACTIVO                      │
      │                                   │    Reactiva contactos          │
      │                                   │◀─────────────────────────────────│
      │                                   │                                  │
      │ 5. Muestra confirmación           │                                  │
      │◀──────────────────────────────────│                                  │
```

---

# Reglas de negocio y validaciones

| Regla | Descripción | Responsable |
|--------|-------------|-------------|
| Solo el autor puede resolver | Únicamente el creador del reporte puede cambiar su estado. | Supabase RLS |
| Confirmación obligatoria | El cierre requiere una confirmación explícita. | Frontend |
| Plazo para deshacer | Puede revertirse durante las primeras 24 horas. | Supabase |
| Motivo obligatorio | Debe seleccionarse un motivo de cierre predefinido. | Frontend + Supabase |
| Notificación automática | Todos los usuarios con solicitudes activas reciben aviso. | Trigger + Edge Function |
| Archivado automático | Los reportes resueltos se archivan tras 30 días. | Supabase Cron Job |
| Historial permanente | Una vez expirado el plazo de deshacer, el cierre queda registrado definitivamente. | Supabase |

---

# Manejo de errores

| Escenario | Mensaje al usuario | Acción técnica |
|------------|--------------------|----------------|
| Usuario sin permisos | "No tienes permisos para modificar este reporte." | Verificar que `user_id = auth.uid()`. |
| Reporte ya resuelto | "Este reporte ya ha sido cerrado." | Validar el estado antes del UPDATE. |
| Plazo para deshacer expirado | "Ya no es posible reactivar este reporte." | Validar `resolved_at` dentro de las últimas 24 horas. |
| Error al enviar notificaciones | "El reporte se ha cerrado correctamente. Algunas notificaciones podrían enviarse más tarde." | Registrar notificaciones pendientes para reintento. |

---

# Consideraciones técnicas

## Frontend (Next.js)

- La acción **Marcar como resuelto** utilizará una mutación con **TanStack Query**.
- El modal de confirmación será un **Client Component**.
- La página **Mis reportes** utilizará **Server Components** para la carga inicial y filtrado.

---

## Backend (Supabase)

### Tabla `reports`

| Campo | Tipo |
|--------|------|
| id | UUID (PK) |
| user_id | UUID (FK → auth.users) |
| status | enum ('active', 'in_progress', 'resolved', 'archived') |
| resolution_reason | text |
| resolution_message | text |
| resolved_at | timestamp |
| created_at | timestamp |
| updated_at | timestamp |

### Seguridad (RLS)

Solo podrá realizar `UPDATE` el propietario del reporte:

```text
auth.uid() = user_id
```

y únicamente cuando el reporte no esté archivado.

### Automatización

Trigger `on_report_resolved`

- Actualiza las solicitudes de contacto pendientes a estado `cancelled`.
- Inserta registros en la tabla `notifications`.
- Ejecuta una Edge Function para enviar emails y notificaciones push.

---

# Privacidad y seguridad

- El mensaje de resolución se sanitiza antes de almacenarse.
- Las imágenes añadidas durante las actualizaciones utilizan el mismo flujo de validación y almacenamiento que las fotografías originales.
- Todas las operaciones de actualización quedan registradas para auditoría.

---

# Pantallas involucradas

| Pantalla | Ruta | Tipo |
|----------|------|------|
| Mis reportes | `/perfil/reportes` | Protegida |
| Detalle del reporte | `/perfil/reportes/[id]` | Protegida |
| Confirmar resolución | `/perfil/reportes/[id]/resolver` | Protegida |
| Historial de reportes | `/perfil/reportes/historial` | Protegida |

---

# 9. Arquitectura técnica del sistema

## 9.1 Estructura del proyecto Next.js

---

### Añadir nuevas carpetas dentro de `src/`

### Añadir `actions/`

Las Server Actions serán uno de los mecanismos principales de comunicación entre la interfaz y el servidor.

```text
src/
└── actions/
    ├── auth/
    ├── pets/
    ├── reports/
    └── contacts/
```

---

### Añadir `providers/`

Actualmente solo existe el layout.

Conviene separar todos los Providers.

```text
src/
└── providers/
    ├── auth-provider.tsx
    ├── query-provider.tsx
    ├── theme-provider.tsx
    └── notification-provider.tsx
```

---

### Añadir `contexts/`

Aunque Zustand gestione casi todo el estado, algunos Context son recomendables.

```text
src/
└── contexts/
    ├── theme-context.tsx
    └── offline-context.tsx
```

---

### Añadir `constants/`

Las constantes globales no deberían vivir dentro de utils.

```text
src/
└── constants/
    ├── routes.ts
    ├── app.ts
    ├── map.ts
    ├── storage.ts
    └── validation.ts
```

---

### Añadir `config/`

Configuraciones centralizadas.

```text
src/
└── config/
    ├── env.ts
    ├── auth.ts
    ├── map.ts
    ├── pwa.ts
    └── seo.ts
```

---

### Añadir `middleware/`

Si existen middlewares propios.

```text
src/
└── middleware/
    └── auth.ts
```

---

### Añadir `middleware.ts` en raíz

Muy recomendable.

```text
middleware.ts
```

Servirá para:

- protección de rutas
- redirecciones
- internacionalización futura
- validación de sesión

---

### Añadir `workers/`

Como el proyecto es PWA.

```text
src/
└── workers/
    └── sync.worker.ts
```

---

### Añadir `offline/`

Toda la lógica offline debería vivir separada.

```text
src/
└── offline/
    ├── indexeddb.ts
    ├── sync-manager.ts
    └── queue.ts
```

---

### Añadir `notifications/`

Para centralizar notificaciones.

```text
src/
└── notifications/
    ├── push.ts
    ├── email.ts
    └── subscriptions.ts
```

---

### Añadir `schemas/`

Actualmente los esquemas Zod están en lib.

Es más habitual separarlos.

```text
src/
└── schemas/
    ├── auth.ts
    ├── pet.ts
    ├── report.ts
    └── contact.ts
```

---

## Modificar la carpeta `lib/`

Actualmente:

```text
lib/
    utils/
    validations/
```

Propuesta:

```text
lib/
    supabase/
    utils/
```

Mover todos los Zod a:

```text
schemas/
```

---

## Añadir dentro de `lib/utils`

Actualmente hay pocos helpers.

Añadir:

```text
utils/
    slug.ts
    geo.ts
    image.ts
    permissions.ts
    logger.ts
```

---

## Añadir dentro de `services`

Actualmente:

```text
auth
pet
report
storage
contact
```

Añadir:

```text
notification-service.ts
map-service.ts
geocoding-service.ts
matching-service.ts
```

---

## Añadir dentro de `stores`

Añadir:

```text
notification-store.ts
offline-store.ts
search-store.ts
```

---

## Añadir dentro de `types`

Actualmente falta bastante tipado.

Añadir:

```text
contact.ts
notification.ts
location.ts
pagination.ts
common.ts
```

---

## Añadir dentro de `components/features`

Actualmente:

```text
auth
mascotas
reportes
mapa
```

Añadir:

```text
contactos/
perfil/
busqueda/
notificaciones/
```

---

## Añadir dentro de `components/ui`

Muy recomendable incluir:

```text
badge.tsx
avatar.tsx
dropdown.tsx
dialog.tsx
textarea.tsx
select.tsx
switch.tsx
tabs.tsx
tooltip.tsx
pagination.tsx
```

---

## Añadir dentro de `app/`

Faltan algunas rutas importantes.

```text
(reportes)/
    perdido/
    encontrado/

mis-contactos/

notificaciones/

configuracion/
```

---

## Añadir dentro de `public`

Actualmente:

```text
icons
images
manifest.json
```

Añadir:

```text
offline.html
browserconfig.xml
favicon.ico
robots.txt
```

---

## Añadir dentro de `supabase/functions`

Aunque sean futuras.

```text
match-found-pet/

send-notification/

cleanup-expired/

process-contact/
```

---

## Añadir carpeta `docs`

Muy recomendable.

```text
docs/
    diagrams/
    decisions/
```

---

## Añadir carpeta `scripts`

Para automatizaciones.

```text
scripts/
    generate-types.ts
    seed.ts
```

---

## Añadir dentro de `tests`

Actualmente:

```text
unit
integration
e2e
```

Añadir:

```text
fixtures/
mocks/
helpers/
```

---

## Añadir archivo

```text
components.json
```

Necesario si se utiliza shadcn/ui.

---

## Añadir archivo

```text
postcss.config.mjs
```

Requerido por Tailwind.

---

## Añadir archivo

```text
next-env.d.ts
```

Generado automáticamente por Next.js.

---

## Añadir archivo

```text
instrumentation.ts
```

Preparado para observabilidad y métricas futuras.

---

# Modificar el apartado "Principios"

Añadir dos principios nuevos.

| Principio | Descripción |
|------------|-------------|
| Offline First | La aplicación continúa funcionando sin conexión siempre que sea posible mediante IndexedDB y sincronización diferida. |
| Seguridad por defecto | Todas las operaciones se diseñan siguiendo el principio de mínimo privilegio mediante RLS, validaciones y Server Actions. |

---

# Añadir un nuevo apartado

## Convención de Server Actions

Todas las operaciones de escritura (INSERT, UPDATE y DELETE) se implementarán mediante Server Actions.

Las consultas complejas reutilizables podrán encapsularse en funciones SQL, vistas o Edge Functions cuando sea necesario.

Las Server Actions actuarán como capa de aplicación entre la interfaz y Supabase, centralizando la validación, autorización y manejo de errores.

---

# Añadir un nuevo apartado

## Convención de rutas

- Las rutas públicas vivirán bajo `(public)`.
- Las rutas autenticadas vivirán bajo `(dashboard)`.
- Las rutas de autenticación vivirán bajo `(auth)`.
- Las APIs internas solo existirán cuando no puedan implementarse mediante Server Actions.
- Todas las rutas seguirán nomenclatura kebab-case.

---

# Añadir un nuevo apartado

## Gestión del estado

Se utilizarán tres niveles de estado:

- Estado del servidor: TanStack Query.
- Estado global del cliente: Zustand.
- Estado local de componentes: React Hooks (useState, useReducer).

Se evitará duplicar información entre estos niveles para mantener una única fuente de verdad.

---

# Añadir un nuevo apartado

## Gestión Offline

Cuando no exista conexión:

- Los formularios se almacenarán en IndexedDB.
- Las operaciones pendientes se encolarán.
- La sincronización se realizará automáticamente al recuperar conectividad mediante Background Sync o mecanismo equivalente.
- El usuario será informado visualmente del estado de sincronización.

---

## 9.2 Capas frontend y arquitectura de componentes

Todas las operaciones que modifican información (`INSERT`, `UPDATE` y `DELETE`) se implementarán mediante **Server Actions** de Next.js.

Las **Server Actions** actuarán como capa de aplicación encargándose de:

- Validar los datos de entrada.
- Comprobar la autorización del usuario autenticado.
- Ejecutar la lógica de negocio correspondiente.
- Invocar los servicios de acceso a datos y Supabase.
- Invalidar la caché cuando sea necesario mediante `revalidatePath()` o `revalidateTag()`.
- Devolver respuestas tipadas y errores controlados al frontend.

De esta forma, los **Client Components** nunca interactúan directamente con la base de datos para operaciones críticas, centralizando la lógica de negocio y mejorando la seguridad y mantenibilidad del sistema.

---

## Flujo completo de una mutación

```text
Usuario
    │
    ▼
Client Component
    │
    ▼
React Hook Form
    │
    ▼
Validación Zod
    │
    ▼
Server Action
    │
    ▼
Servicio de aplicación
    │
    ▼
Supabase
    │
    ▼
PostgreSQL + RLS
    │
    ▼
Server Action
    │
    ├── revalidatePath() / revalidateTag()
    ▼
TanStack Query
    │
    ▼
Interfaz actualizada
```

---

## Flujo completo de lectura de datos

```text
Navegador
    │
    ▼
Server Component
    │
    ▼
Supabase Server Client
    │
    ▼
PostgreSQL
    │
    ▼
Server Component
    │
    ▼
Streaming HTML
    │
    ▼
Hidratación
    │
    ▼
Client Components
```

---

## Estrategia de renderizado

BuscoHuella utilizará distintas estrategias de renderizado en función de las características de cada pantalla, buscando el equilibrio entre rendimiento, SEO e interactividad.

| Tipo de contenido | Estrategia |
|-------------------|------------|
| Landing principal | SSG (Static Site Generation) |
| Reportes públicos | SSR (Server Side Rendering) |
| Resultados de búsqueda | SSR |
| Perfil del usuario | Renderizado dinámico |
| Dashboard | Renderizado dinámico |
| Formularios | Client Rendering |
| Mapa interactivo | CSR mediante `dynamic()` (`ssr: false`) |

---

## Estrategia de caché

Next.js proporciona varios niveles de caché que permiten optimizar el rendimiento de la aplicación.

BuscoHuella utilizará la siguiente estrategia:

| Nivel | Uso |
|--------|-----|
| Request Memoization | Evitar consultas duplicadas durante una misma petición. |
| Data Cache | Almacenar datos públicos poco cambiantes. |
| Full Route Cache | Landing y páginas estáticas. |
| Router Cache | Optimizar la navegación entre rutas. |
| TanStack Query Cache | Gestionar el estado remoto y sincronización en cliente. |

Las mutaciones realizadas mediante **Server Actions** invalidarán únicamente las rutas o etiquetas afectadas utilizando `revalidatePath()` o `revalidateTag()`.

---

## Suspense y Streaming

Siempre que sea posible, las páginas se dividirán mediante fronteras **Suspense** para permitir el envío progresivo del contenido al navegador.

Esta estrategia proporciona las siguientes ventajas:

- Renderizado inicial más rápido.
- Visualización inmediata del contenido disponible.
- Skeletons únicamente donde sean necesarios.
- Mejor percepción de rendimiento por parte del usuario.
- Reducción del tiempo hasta la primera interacción.

---

## Gestión de errores

Cada capa será responsable exclusivamente de gestionar los errores que le correspondan.

| Capa | Responsabilidad |
|------|-----------------|
| Interfaz de usuario | Mostrar mensajes claros y comprensibles al usuario. |
| Componentes Feature | Gestionar estados visuales de carga, error y éxito. |
| Server Actions | Traducir errores técnicos a errores de negocio. |
| Supabase | Aplicar autenticación y políticas RLS. |
| PostgreSQL | Garantizar la integridad de los datos mediante restricciones y claves. |

---

## Validación en múltiples capas

Toda la información introducida por el usuario será validada en diferentes niveles para garantizar su integridad y evitar manipulaciones.

```text
Formulario
    │
    ▼
React Hook Form
    │
    ▼
Validación Zod (cliente)
    │
    ▼
Server Action
    │
    ▼
Validación Zod (servidor)
    │
    ▼
Supabase
    │
    ▼
Restricciones PostgreSQL
```

La validación nunca dependerá exclusivamente del cliente.

---

## Comunicación entre componentes

La comunicación entre componentes seguirá los siguientes mecanismos según el ámbito del estado:

| Necesidad | Solución |
|------------|----------|
| Comunicación padre → hijo | Props |
| Estado local | `useState()` o `useReducer()` |
| Estado global | Zustand |
| Estado remoto | TanStack Query |

Se evitará utilizar Context API para almacenar estados globales cuando existan soluciones más adecuadas, como Zustand.

---

## Gestión de formularios

Todos los formularios del sistema seguirán una arquitectura homogénea basada en React Hook Form y Server Actions.

```text
React Hook Form
    │
    ▼
Zod Resolver
    │
    ▼
Client Component
    │
    ▼
Server Action
    │
    ▼
Servicio de aplicación
    │
    ▼
Supabase
```

Esta arquitectura permite mantener la validación, la lógica de negocio y el acceso a datos claramente separados.

---

## Estrategia de carga diferida

Las librerías con mayor tamaño únicamente se cargarán cuando sean necesarias.

Ejemplos:

- Leaflet.
- Browser Image Compression.
- Visores de imágenes.
- Librerías de gráficos.

Para ello se utilizarán las siguientes técnicas:

- `dynamic()`
- `React.lazy()`
- `Suspense`

reduciendo el tamaño inicial del bundle JavaScript.

---

---

## Arquitectura de composición

La interfaz de BuscoHuella seguirá una arquitectura basada en composición de componentes, favoreciendo la reutilización, la separación de responsabilidades y la mantenibilidad del código.

En lugar de construir componentes monolíticos con múltiples responsabilidades, la aplicación se estructurará mediante pequeños componentes especializados que podrán combinarse para formar interfaces más complejas.

La composición seguirá una jerarquía similar a la siguiente:

```text
Page
│
├── Layout
│
├── Feature
│   ├── Container
│   ├── Form
│   ├── List
│   ├── Card
│   └── Actions
│
└── UI
    ├── Button
    ├── Input
    ├── Badge
    ├── Avatar
    ├── Dialog
    └── Skeleton
```

Cada nivel tendrá una responsabilidad claramente definida:

| Nivel | Responsabilidad |
|--------|-----------------|
| Pages | Obtener datos iniciales, definir metadata y componer la pantalla. |
| Layouts | Compartir la estructura común entre varias páginas. |
| Features | Implementar la lógica funcional de cada módulo de negocio. |
| UI | Proporcionar componentes visuales reutilizables y desacoplados. |

Esta organización facilita:

- Reutilización de componentes.
- Separación de responsabilidades.
- Mayor facilidad para realizar pruebas.
- Escalabilidad del proyecto.
- Reducción del acoplamiento entre módulos.

Como regla general, un componente únicamente conocerá la capa inmediatamente inferior, evitando dependencias innecesarias entre módulos y favoreciendo una arquitectura limpia y mantenible.

---

## 9.3 Servicios y lógica de negocio

### Objetivo

Definir la capa de servicios del frontend: dónde vive la lógica de comunicación con Supabase, cómo se estructura por dominio y qué patrones se aplican para mantener los componentes libres de responsabilidades de acceso a datos, validación y lógica de negocio.

La regla de oro es:

> **Los componentes renderizan; los servicios gestionan datos y lógica de negocio.**

La capa de servicios actúa como una abstracción entre la interfaz y la infraestructura externa, evitando que los componentes React conozcan detalles de Supabase, consultas, estructuras internas de tablas o reglas de negocio.

---

# Principios de diseño

| Principio | Descripción |
|---|---|
| **Un servicio por dominio** | Cada módulo funcional (`auth`, `mascotas`, `reportes`, `contactos`, etc.) dispone de su propio servicio independiente. |
| **Sin lógica de UI** | Los servicios nunca importan componentes React ni manipulan estados visuales. |
| **Tipado estricto** | Todas las entradas y salidas están definidas mediante TypeScript. No se utiliza `any`. |
| **Validación en frontera** | Los datos recibidos desde formularios o acciones se validan con Zod antes de llegar a Supabase. |
| **Errores centralizados** | Cada dominio define errores propios que permiten traducir fallos técnicos a mensajes comprensibles. |
| **Separación de responsabilidades** | Los servicios gestionan datos y reglas de negocio; los componentes gestionan presentación. |
| **Testabilidad** | Los servicios reciben dependencias externas mediante parámetros para facilitar mocks y pruebas unitarias. |

---

# Arquitectura de comunicación

Las operaciones seguirán la siguiente arquitectura:

```text
Usuario
    |
    ▼
Client Component
    |
    ▼
React Hook Form / TanStack Query
    |
    ▼
Server Action
    |
    ▼
Service Layer
    |
    ▼
Supabase Client
    |
    ▼
PostgreSQL + RLS
```

Las operaciones críticas de escritura:

- `INSERT`
- `UPDATE`
- `DELETE`

pasarán siempre por **Server Actions**.

Los componentes cliente nunca realizarán operaciones sensibles directamente contra Supabase.

Esto permite:

- Centralizar autorización.
- Validar datos antes de persistirlos.
- Mantener las reglas de negocio fuera de la interfaz.
- Aplicar políticas de seguridad consistentes.

---

# Estructura de servicios

La carpeta de servicios tendrá una organización basada en dominios:

```text
src/
└── services/
    ├── auth-service.ts
    ├── pet-service.ts
    ├── report-service.ts
    ├── contact-service.ts
    ├── storage-service.ts
    ├── map-service.ts
    ├── notification-service.ts
    ├── matching-service.ts
    └── index.ts
```

---

# Responsabilidad de cada servicio

| Servicio | Responsabilidad |
|---|---|
| `auth-service.ts` | Registro, login, logout, recuperación de contraseña y gestión de sesión. |
| `pet-service.ts` | CRUD de mascotas, información identificativa y relación usuario-mascota. |
| `report-service.ts` | Creación, consulta, modificación y resolución de reportes perdidos/encontrados. |
| `contact-service.ts` | Gestión de contactos entre usuarios y seguimiento de comunicaciones. |
| `storage-service.ts` | Subida, eliminación y gestión de imágenes almacenadas. |
| `map-service.ts` | Consultas geográficas, posiciones y datos utilizados por mapas. |
| `notification-service.ts` | Gestión de avisos internos y notificaciones push. |
| `matching-service.ts` | Algoritmos de coincidencia entre animales perdidos y encontrados. |

---

# Estructura interna de un servicio

Todos los servicios seguirán una estructura común:

| Sección | Contenido |
|---|---|
| **Types** | Interfaces y tipos específicos del dominio. |
| **Schemas** | Validaciones mediante Zod. |
| **CRUD** | Operaciones básicas de lectura y escritura. |
| **Business Logic** | Operaciones compuestas con reglas de negocio. |
| **Error Classes** | Errores personalizados del dominio. |
| **Private Helpers** | Transformaciones internas no exportadas. |

Ejemplo:

```text
report-service.ts

├── Types
├── Schemas
├── CRUD
├── Business Logic
├── Error Classes
└── Private Helpers
```

---

# Patrón de implementación

## Inyección del cliente Supabase

Los servicios no crean directamente la instancia de Supabase.

Reciben el cliente como dependencia:

```typescript
function service(
  supabase: SupabaseClient<Database>
)
```

Esto permite utilizar distintas configuraciones según el contexto.

---

## Uso desde Server Components

```text
Server Component
        |
        ▼
lib/supabase/server.ts
        |
        ▼
Service Layer
        |
        ▼
Supabase
```

---

## Uso desde Server Actions

```text
Server Action
        |
        ▼
lib/supabase/server.ts
        |
        ▼
Service Layer
        |
        ▼
Supabase
```

---

## Ventajas

- Facilita testing mediante mocks.
- Evita acoplamiento con Supabase.
- Permite controlar permisos según contexto.
- Mantiene separada infraestructura y lógica de negocio.
- Facilita cambiar la fuente de datos en el futuro.

---

# Ejemplo completo: Report Service

```typescript
// services/report-service.ts

import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { Database } from '@/types/database';


// ======================================
// Types
// ======================================

export type ReportStatus =
    | 'activo'
    | 'en_revision'
    | 'resuelto'
    | 'archivado';


export type ReportType =
    | 'perdido'
    | 'encontrado';


export interface CreateReportInput {

    userId: string;

    petId?: string | null;

    type: ReportType;

    title: string;

    description: string;

    latitude: number;

    longitude: number;

    locationName: string;

    photos: string[];

    contactPhone?: string;

}


export interface ReportFilters {

    type?: ReportType;

    status?: ReportStatus;

    species?: string;

    breed?: string;

    limit?: number;

    offset?: number;

}


// ======================================
// Validation
// ======================================

const createReportSchema = z.object({

    userId:
        z.string().uuid(),

    petId:
        z.string()
            .uuid()
            .optional()
            .nullable(),

    type:
        z.enum([
            'perdido',
            'encontrado'
        ]),

    title:
        z.string()
            .min(5)
            .max(120),

    description:
        z.string()
            .min(20)
            .max(2000),

    latitude:
        z.number()
            .min(-90)
            .max(90),

    longitude:
        z.number()
            .min(-180)
            .max(180),

    locationName:
        z.string()
            .min(2)
            .max(200),

    photos:
        z.array(
            z.string().url()
        )
        .max(5),

    contactPhone:
        z.string()
            .optional()

});


// ======================================
// Create Report
// ======================================

export async function createReport(
    supabase: SupabaseClient<Database>,
    input: CreateReportInput
) {

    const validated =
        createReportSchema.parse(input);


    const { data, error } =
        await supabase
            .from('reports')
            .insert({

                user_id:
                    validated.userId,

                pet_id:
                    validated.petId,

                type:
                    validated.type,

                title:
                    validated.title,

                description:
                    validated.description,

                latitude:
                    validated.latitude,

                longitude:
                    validated.longitude,

                location_name:
                    validated.locationName,

                photos:
                    validated.photos,

                contact_phone:
                    validated.contactPhone,

                status:
                    'activo'

            })
            .select()
            .single();


    if(error){

        throw new ReportServiceError(
            'No se pudo crear el reporte',
            error
        );

    }


    return data;

}
```

---

# Continuación: Servicios por dominio

## Report Service (continuación)

Además de la creación de reportes, el servicio incluirá las operaciones necesarias para consulta, modificación y gestión del ciclo de vida de un reporte.

```typescript
export async function getReports(
    supabase: SupabaseClient<Database>,
    filters: ReportFilters = {}
) {

    let query =
        supabase
            .from('reports')
            .select(`
                *,
                profiles:user_id (
                    full_name,
                    avatar_url
                ),
                pets:pet_id (
                    name,
                    species,
                    breed,
                    photos
                )
            `)
            .eq(
                'status',
                filters.status ?? 'activo'
            )
            .order(
                'created_at',
                {
                    ascending: false
                }
            );


    if(filters.type){

        query =
            query.eq(
                'type',
                filters.type
            );

    }


    if(filters.limit){

        query =
            query.range(
                filters.offset ?? 0,
                (filters.offset ?? 0)
                + filters.limit
                - 1
            );

    }


    const {
        data,
        error
    } = await query;


    if(error){

        throw new ReportServiceError(
            'Error al obtener reportes',
            error
        );

    }


    return data ?? [];

}
```

---

## Obtener reporte por identificador

```typescript
export async function getReportById(
    supabase: SupabaseClient<Database>,
    id: string
){

    const {
        data,
        error
    } =
        await supabase
            .from('reports')
            .select(`
                *,
                profiles:user_id (
                    full_name,
                    avatar_url,
                    phone
                ),
                pets:pet_id (*)
            `)
            .eq(
                'id',
                id
            )
            .single();


    if(error){

        throw new ReportServiceError(
            'Reporte no encontrado',
            error,
            404
        );

    }


    return data;

}
```

---

## Actualización de estado del reporte

```typescript
export async function updateReportStatus(
    supabase: SupabaseClient<Database>,
    reportId: string,
    userId: string,
    status: ReportStatus,
    resolutionMessage?: string
){

    const {
        data,
        error
    } =
        await supabase
            .from('reports')
            .update({

                status,

                resolution_message:
                    resolutionMessage,

                resolved_at:
                    status === 'resuelto'
                        ? new Date().toISOString()
                        : null,

                updated_at:
                    new Date().toISOString()

            })
            .eq(
                'id',
                reportId
            )
            .eq(
                'user_id',
                userId
            )
            .select()
            .single();


    if(error){

        throw new ReportServiceError(
            'No se pudo actualizar el reporte',
            error
        );

    }


    return data;

}
```

---

# Errores personalizados

Cada servicio tendrá sus propios errores para poder distinguir fallos técnicos de errores funcionales.

Ejemplo:

```typescript
export class ReportServiceError extends Error {

    constructor(
        message: string,
        public readonly cause: unknown,
        public readonly statusCode?: number
    ){

        super(message);

        this.name =
            'ReportServiceError';

    }

}
```

---

# Auth Service

Archivo:

```text
src/services/auth-service.ts
```

Responsabilidad:

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Recuperación de contraseña.
- Gestión de sesión activa.

---

```typescript
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';


export async function signUp(
    supabase: SupabaseClient<Database>,
    email: string,
    password: string
){

    const {
        data,
        error
    } =
        await supabase.auth.signUp({

            email,

            password,

            options: {

                emailRedirectTo:
                    `${process.env.NEXT_PUBLIC_APP_URL}/login`

            }

        });


    if(error){

        throw new AuthServiceError(
            error.message,
            error
        );

    }


    return data;

}



export async function signIn(
    supabase: SupabaseClient<Database>,
    email: string,
    password: string
){

    const {
        data,
        error
    } =
        await supabase.auth.signInWithPassword({

            email,

            password

        });


    if(error){

        throw new AuthServiceError(
            'Credenciales incorrectas',
            error
        );

    }


    return data;

}



export async function signOut(
    supabase: SupabaseClient<Database>
){

    const {
        error
    } =
        await supabase.auth.signOut();


    if(error){

        throw new AuthServiceError(
            'Error al cerrar sesión',
            error
        );

    }

}



export async function getSession(
    supabase: SupabaseClient<Database>
){

    const {
        data,
        error
    } =
        await supabase.auth.getSession();


    if(error){

        throw new AuthServiceError(
            'Sesión inválida',
            error
        );

    }


    return data.session;

}



export class AuthServiceError extends Error {

    constructor(
        message: string,
        public readonly cause: unknown
    ){

        super(message);

        this.name =
            'AuthServiceError';

    }

}
```

---

# Pet Service

Archivo:

```text
src/services/pet-service.ts
```

Responsabilidad:

- Crear mascotas.
- Consultar mascotas del usuario.
- Actualizar información.
- Gestionar relación usuario-mascota.

Las imágenes se gestionan mediante `storage-service.ts`.

---

```typescript
import { SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { Database } from '@/types/database';



export interface CreatePetInput {

    userId: string;

    name: string;

    species:
        | 'perro'
        | 'gato'
        | 'otro';

    breed?: string;

    age?: number;

    sex?:
        | 'macho'
        | 'hembra';

    color?: string;

    distinguishingFeatures?: string;

    photos: string[];

    chipId?: string;

}



const createPetSchema =
    z.object({

        userId:
            z.string().uuid(),

        name:
            z.string()
                .min(1)
                .max(50),

        species:
            z.enum([
                'perro',
                'gato',
                'otro'
            ]),

        breed:
            z.string()
                .max(50)
                .optional(),

        age:
            z.number()
                .min(0)
                .max(50)
                .optional(),

        sex:
            z.enum([
                'macho',
                'hembra'
            ])
            .optional(),

        color:
            z.string()
                .max(50)
                .optional(),

        distinguishingFeatures:
            z.string()
                .max(500)
                .optional(),

        photos:
            z.array(
                z.string().url()
            )
            .max(5),

        chipId:
            z.string()
                .max(50)
                .optional()

    });
```

---

## Operaciones de lectura

Además de las operaciones de escritura, los servicios gestionarán las consultas necesarias para recuperar información del dominio.

Las consultas complejas no se realizarán directamente desde componentes ni desde páginas.

Ejemplo:

```typescript
export async function getReports(
  supabase: SupabaseClient<Database>,
  filters: ReportFilters = {}
) {

  let query =
    supabase
      .from('reports')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        ),
        pets:pet_id (
          name,
          species,
          breed,
          photos
        )
      `)
      .order(
        'created_at',
        {
          ascending: false
        }
      );


  if(filters.type){

    query =
      query.eq(
        'type',
        filters.type
      );

  }


  if(filters.status){

    query =
      query.eq(
        'status',
        filters.status
      );

  }


  if(filters.limit){

    query =
      query.range(
        filters.offset ?? 0,
        (filters.offset ?? 0)
          + filters.limit
          - 1
      );

  }


  const {
    data,
    error
  } = await query;


  if(error){

    throw new ReportServiceError(
      'Error al obtener reportes',
      error
    );

  }


  return data ?? [];

}
```

---

## Actualización de datos

Las modificaciones de datos siempre deben pasar por validaciones y comprobaciones de permisos.

Ejemplo:

```typescript
export async function updateReportStatus(
  supabase: SupabaseClient<Database>,
  reportId: string,
  userId: string,
  status: ReportStatus
){

  const {
    data,
    error
  } =
    await supabase
      .from('reports')
      .update({

        status,

        updated_at:
          new Date()
            .toISOString()

      })
      .eq(
        'id',
        reportId
      )
      .eq(
        'user_id',
        userId
      )
      .select()
      .single();


  if(error){

    throw new ReportServiceError(
      'No se pudo actualizar el reporte',
      error
    );

  }


  return data;

}
```

La comprobación mediante `user_id` no sustituye a RLS.

Su función es añadir una capa adicional de protección antes de que la operación llegue a la base de datos.

La seguridad definitiva continúa siendo responsabilidad de Supabase RLS.

---

# Servicios por dominio

## Auth Service

Archivo:

```
src/services/auth-service.ts
```

Responsabilidad:

- Registro de usuarios.
- Inicio de sesión.
- Cierre de sesión.
- Recuperación de contraseña.
- Consulta de sesión activa.
- Gestión de identidad mediante Supabase Auth.

Ejemplo:

```typescript
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';


export async function signIn(
  supabase: SupabaseClient<Database>,
  email: string,
  password: string
){

  const {
    data,
    error
  } =
    await supabase.auth.signInWithPassword({

      email,

      password

    });


  if(error){

    throw new AuthServiceError(
      'Credenciales incorrectas',
      error
    );

  }


  return data;

}


export class AuthServiceError
extends Error {

  constructor(
    message:string,
    public readonly cause:unknown
  ){

    super(message);

    this.name =
      'AuthServiceError';

  }

}
```

---

# Pet Service

Archivo:

```
src/services/pet-service.ts
```

Responsabilidad:

- Crear mascotas.
- Editar información.
- Obtener mascotas del usuario.
- Gestionar relación usuario-mascota.
- Preparar información para reportes.

Ejemplo:

```typescript
export interface CreatePetInput {

  userId:string;

  name:string;

  species:
    | 'perro'
    | 'gato'
    | 'otro';

  breed?:string;

  age?:number;

  photos:string[];

}


export async function createPet(
  supabase:SupabaseClient<Database>,
  input:CreatePetInput
){

  const {
    data,
    error
  } =
    await supabase
      .from('pets')
      .insert({

        user_id:
          input.userId,

        name:
          input.name,

        species:
          input.species,

        breed:
          input.breed,

        age:
          input.age,

        photos:
          input.photos

      })
      .select()
      .single();


  if(error){

    throw new PetServiceError(
      'No se pudo crear la mascota',
      error
    );

  }


  return data;

}
```

---

# Storage Service

Archivo:

```
src/services/storage-service.ts
```

Responsabilidad:

- Subida de imágenes.
- Eliminación de archivos.
- Generación de URLs.
- Control de tamaño y formato.

Reglas:

| Regla | Valor |
|---|---|
| Formatos permitidos | JPG, PNG, WebP |
| Tamaño máximo | 5 MB |
| Ubicación | Supabase Storage |
| Codificación base64 | No permitida |

Ejemplo:

```typescript
export async function uploadImage(
  supabase:SupabaseClient<Database>,
  file:File,
  bucket:string,
  path:string
){

  if(file.size > 5 * 1024 * 1024){

    throw new StorageServiceError(
      'Archivo demasiado grande'
    );

  }


  const {
    error
  } =
    await supabase.storage
      .from(bucket)
      .upload(
        path,
        file
      );


  if(error){

    throw new StorageServiceError(
      'Error subiendo imagen',
      error
    );

  }


  const {
    data
  } =
    supabase.storage
      .from(bucket)
      .getPublicUrl(path);


  return data.publicUrl;

}
```

---

# Uso mediante Server Actions

Las operaciones críticas utilizan Server Actions.

Ejemplo:

```
Usuario
 |
 ▼
Formulario React
 |
 ▼
Server Action
 |
 ▼
Servicio
 |
 ▼
Supabase
 |
 ▼
Base de datos
```

Ejemplo:

```typescript
'use server';


import { createClient }
from '@/lib/supabase/server';

import {
 createReport
}
from '@/services/report-service';



export async function createReportAction(
  input:CreateReportInput
){

  const supabase =
    createClient();


  return await createReport(
    supabase,
    input
  );

}
```

---

# Uso desde componentes cliente

Los componentes cliente no acceden directamente a Supabase para operaciones sensibles.

Incorrecto:

```typescript
Component
   |
   ▼
Supabase INSERT
```

Correcto:

```
Component
    |
    ▼
Hook
    |
    ▼
Server Action
    |
    ▼
Service
    |
    ▼
Supabase
```

---

# Manejo de errores

Los servicios nunca devuelven mensajes preparados para usuarios.

Devuelven errores técnicos tipados.

Ejemplo:

```typescript
class PetServiceError
extends Error {

 constructor(
   message:string,
   public cause?:unknown
 ){

   super(message);

   this.name =
    'PetServiceError';

 }

}
```

Conversión posterior:

| Error técnico | Mensaje usuario |
|---|---|
| AuthServiceError | Email o contraseña incorrectos |
| PetServiceError | No se pudo guardar la mascota |
| ReportServiceError | No se pudo crear el reporte |
| StorageServiceError | Error procesando imagen |
| RLS Error | No tienes permisos |

---

# Reglas finales de arquitectura

## Separación de responsabilidades

Los servicios:

✅ Conocen Supabase.  
✅ Conocen reglas de negocio.  
✅ Validan datos de entrada.  
✅ Transforman datos técnicos.

Los servicios NO:

❌ Conocen componentes React.  
❌ Manipulan estados UI.  
❌ Realizan navegación.  
❌ Muestran mensajes al usuario.


---

# Rendimiento

Buenas prácticas:

- Evitar consultas innecesarias.
- Utilizar `select()` con relaciones controladas.
- Implementar paginación mediante `range()`.
- No cargar imágenes completas cuando no son necesarias.
- Utilizar caché mediante TanStack Query.
- Evitar duplicación de peticiones.


---

# Seguridad

La arquitectura aplica defensa por capas:

```
Frontend
   |
   ▼
Validación Zod
   |
   ▼
Server Actions
   |
   ▼
Servicios
   |
   ▼
Supabase RLS
   |
   ▼
Base de datos
```

La validación frontend mejora experiencia.

La seguridad real depende de:

- Row Level Security.
- Políticas de Supabase.
- Roles.
- Permisos.
- Control de acceso en servidor.


---

# Testabilidad

Gracias a la inyección del cliente Supabase:

```typescript
service(
   mockSupabase,
   data
)
```

Los servicios pueden probarse sin:

- Renderizar componentes.
- Levantar una aplicación completa.
- Conectarse a una base de datos real.

Esto permite realizar pruebas unitarias rápidas y mantener el código desacoplado.

---

## Conclusión

La capa de servicios será el punto central donde vive la lógica de negocio de BuscoHuella.

Los componentes serán responsables únicamente de representar información y gestionar interacción del usuario.

La comunicación con Supabase, validación, seguridad y reglas del dominio quedarán encapsuladas en servicios independientes.

Esta arquitectura permite que el proyecto pueda crecer desde un MVP hasta una aplicación completa manteniendo orden, escalabilidad y facilidad de mantenimiento.

---

## 9.4 Estado global y gestión de datos

### Objetivo

Definir la estrategia de gestión de estado en BuscoHuella: qué datos pertenecen a cada capa, qué herramientas se utilizan y cómo se evita la duplicidad de información, inconsistencias y renders innecesarios.

La arquitectura separa claramente tres tipos de estado:

- **Estado local:** datos temporales propios de un componente.
- **Estado global cliente:** información transversal compartida entre múltiples componentes.
- **Estado remoto:** datos procedentes de Supabase gestionados mediante caché y sincronización.

La regla de oro es:

> **Los datos remotos viven en TanStack Query.  
> El estado global de aplicación vive en Zustand.  
> El estado temporal vive en React Hooks locales.**

---

# Principios de gestión de estado

| Principio | Descripción |
|---|---|
| **Fuente única de verdad** | Los datos obtenidos desde Supabase solo existen en la caché de TanStack Query. No se duplican en Zustand ni en estados locales. |
| **Estado mínimo necesario** | Zustand únicamente almacena información que no pertenece al servidor ni puede derivarse de otros datos. |
| **Separación Server State / Client State** | Los datos remotos se gestionan con TanStack Query. La interfaz y preferencias con Zustand. |
| **Sincronización controlada** | Las modificaciones de datos remotos invalidan automáticamente la caché relacionada. |
| **Cercanía al consumidor** | Un estado solo se convierte en global cuando varios componentes independientes necesitan acceder a él. |
| **Persistencia selectiva** | Solo se persisten preferencias no sensibles. Nunca tokens, credenciales o información privada. |

---

# Arquitectura de estado

```text
┌─────────────────────────────────────────────┐
│              ESTADO LOCAL                   │
│              React Hooks                    │
│                                             │
│  useState                                   │
│  useReducer                                 │
│  useRef                                     │
│                                             │
│  Formularios                                │
│  Inputs                                     │
│  Animaciones                                │
│  Estados temporales                         │
└──────────────────┬──────────────────────────┘
                   │

                   ▼

┌─────────────────────────────────────────────┐
│           ESTADO GLOBAL CLIENTE             │
│                Zustand                      │
│                                             │
│  Auth Store                                 │
│  UI Store                                   │
│  Map Store                                  │
│                                             │
│  Usuario                                    │
│  Tema                                       │
│  Modales                                    │
│  Estado mapa                                │
└──────────────────┬──────────────────────────┘
                   │

                   ▼

┌─────────────────────────────────────────────┐
│            ESTADO REMOTO                    │
│           TanStack Query                    │
│                                             │
│  Queries                                    │
│  Mutations                                  │
│  Infinite Queries                           │
│                                             │
│  Reportes                                   │
│  Mascotas                                   │
│  Perfiles                                   │
│  Búsquedas                                  │
└──────────────────┬──────────────────────────┘
                   │

                   ▼

┌─────────────────────────────────────────────┐
│               SUPABASE                      │
│                                             │
│ PostgreSQL                                  │
│ Storage                                     │
│ Auth                                        │
└─────────────────────────────────────────────┘
```

---

# Distribución de responsabilidades

| Capa | Tecnología | Datos gestionados | Persistencia |
|---|---|---|---|
| Estado local | React Hooks | Formularios, componentes temporales, UI específica | Volátil |
| Estado global | Zustand | Sesión, preferencias, mapa, UI transversal | Opcional |
| Estado remoto | TanStack Query | Mascotas, reportes, perfiles, búsquedas | Caché memoria |
| Estado URL | Next.js Router | Filtros, búsquedas, paginación | URL compartible |

---

# Estado global con Zustand

Zustand se utiliza únicamente para información que:

- Necesita acceso desde múltiples componentes.
- No procede directamente de Supabase.
- No debe gestionarse mediante una query.

No se utiliza Zustand como sustituto de una base de datos ni como caché manual.

---

# Auth Store

Archivo:

```
src/stores/auth-store.ts
```

Responsabilidad:

- Mantener usuario autenticado.
- Compartir estado de sesión.
- Controlar estados de carga.
- Sincronizar cambios realizados por Supabase Auth.

```typescript
import { create } from 'zustand';

import type {
  User,
  Session
} from '@supabase/supabase-js';


interface AuthState {

  user: User | null;

  session: Session | null;

  isAuthenticated: boolean;

  isLoading: boolean;


  setSession:
    (session: Session | null) => void;


  clearSession:
    () => void;

}


export const useAuthStore =
create<AuthState>((set) => ({

  user: null,

  session: null,

  isAuthenticated: false,

  isLoading: true,


  setSession(session){

    set({

      session,

      user:
        session?.user ?? null,

      isAuthenticated:
        Boolean(session),

      isLoading:false

    });

  },


  clearSession(){

    set({

      user:null,

      session:null,

      isAuthenticated:false,

      isLoading:false

    });

  }


}));
```

---

# UI Store

Archivo:

```
src/stores/ui-store.ts
```

Gestiona estados visuales globales.

Ejemplos:

- Modales.
- Toasts.
- Menús.
- Sidebar.
- Tema visual.

```typescript
import { create } from 'zustand';


interface UIState {

  activeModal:string | null;

  sidebarOpen:boolean;


  openModal:
    (id:string)=>void;


  closeModal:
    ()=>void;


  toggleSidebar:
    ()=>void;

}


export const useUIStore =
create<UIState>((set)=>({

  activeModal:null,

  sidebarOpen:false,


  openModal(id){

    set({
      activeModal:id
    });

  },


  closeModal(){

    set({
      activeModal:null
    });

  },


  toggleSidebar(){

    set(state=>({

      sidebarOpen:
        !state.sidebarOpen

    }));

  }


}));
```

---

# Map Store

Archivo:

```
src/stores/map-store.ts
```

Responsabilidad:

Gestionar el estado interactivo del mapa:

- Centro actual.
- Zoom.
- Marcador seleccionado.
- Filtros activos.

```typescript
interface MapState {

 center:{
   lat:number;
   lng:number;
 };

 zoom:number;

 selectedMarkerId:string|null;

 setCenter:
   (center:MapState['center'])=>void;

 setZoom:
   (zoom:number)=>void;

 selectMarker:
   (id:string|null)=>void;

}
```

El mapa no almacena los animales encontrados.

Los datos de animales vienen siempre desde:

```
TanStack Query
        |
        ▼
map-service.ts
        |
        ▼
Supabase
```

---

# Estado remoto con TanStack Query

TanStack Query es la capa encargada de gestionar:

- Caché.
- Loading states.
- Errores.
- Revalidación.
- Peticiones duplicadas.
- Actualización tras cambios.

Ejemplos:

```
['reports']

['reports', {type:'perdido'}]

['pet', petId]

['profile', userId]
```

---

# Configuración inicial

Archivo:

```
src/lib/query-client.ts
```

```typescript
import {
 QueryClient
}
from '@tanstack/react-query';


export const queryClient =
new QueryClient({

 defaultOptions:{

  queries:{

   staleTime:
    1000 * 60 * 2,

   gcTime:
    1000 * 60 * 10,

   retry:1,

   refetchOnWindowFocus:false

  },


  mutations:{

   retry:false

  }

 }

});
```

---

# Lecturas mediante TanStack Query

Ejemplo:

```typescript
export function useReports(filters){

 const supabase =
   useSupabaseClient();


 return useQuery({

   queryKey:[
     'reports',
     filters
   ],


   queryFn:()=>


     getReports(
       supabase,
       filters
     )


 });


}
```

---

# Escrituras mediante Server Actions

Las operaciones sensibles no se ejecutan directamente desde componentes cliente.

Flujo:

```
Cliente
  |
  ▼
React Component
  |
  ▼
Server Action
  |
  ▼
Service
  |
  ▼
Supabase
```

Ejemplo:

Crear reporte:

```
ReportForm.tsx

        |
        ▼

createReportAction()

        |
        ▼

report-service.ts

        |
        ▼

Supabase INSERT
```

Ventajas:

- No expone lógica sensible.
- Centraliza permisos.
- Facilita auditoría.
- Mantiene separación frontend/backend.

---

# Invalidación de caché

Después de una modificación:

```
Server Action

      |

Supabase UPDATE

      |

invalidateQueries()

      |

TanStack Query refresca datos

      |

Componentes actualizados
```

Ejemplo:

```typescript
queryClient.invalidateQueries({

 queryKey:[
   'reports'
 ]

});
```

---

# Estado local

Para datos que pertenecen exclusivamente a un componente:

| Caso | Herramienta |
|-|-|
| Input simple | useState |
| Formulario complejo | React Hook Form |
| Validación | Zod |
| Wizard de pasos | useReducer |
| Referencias DOM | useRef |
| Debounce búsqueda | useEffect |

---

# Formularios

BuscoHuella utilizará:

- React Hook Form.
- Zod.
- Server Actions.

Flujo:

```
Usuario introduce datos

        |

React Hook Form

        |

Zod Validation

        |

Server Action

        |

Service

        |

Supabase
```

---

# Sincronización búsqueda y URL

Los filtros públicos se almacenan en la URL.

Ejemplo:

```
/buscar?tipo=perdido&especie=perro
```

Ventajas:

- Compartible.
- Indexable.
- Recuperable al volver atrás.
- Compatible con SEO.

---

# Consideraciones técnicas

## Zustand

- No almacenar datos procedentes de Supabase.
- No guardar tokens JWT.
- No sustituir TanStack Query.
- Mantener stores pequeños.
- Usar persist únicamente para preferencias.

---

## TanStack Query

- Cada queryKey debe representar exactamente sus parámetros.
- Las mutaciones deben invalidar datos relacionados.
- Ajustar staleTime según importancia del dato.
- Evitar duplicar caché manualmente.

---

## Seguridad

Nunca guardar:

- Tokens.
- Passwords.
- Datos privados sensibles.

La autenticación pertenece a:

```
Supabase Auth
```

La autorización pertenece a:

```
Supabase RLS
```

Zustand únicamente refleja el estado necesario para la interfaz.

---

## Resultado final

La arquitectura de estado queda:

```
React Hooks
     |
     |
Zustand
     |
     |
TanStack Query
     |
     |
Services
     |
     |
Server Actions
     |
     |
Supabase
```

Esta separación permite que BuscoHuella pueda crecer sin convertir el frontend en un conjunto de estados duplicados y lógica mezclada.

---

## 10. Diseño de base de datos

## 10.1 Modelo de datos, tablas principales y relaciones

### Principios del diseño

El modelo de datos de BuscoHuella se construye sobre PostgreSQL (vía Supabase) con las siguientes directrices:

| Principio | Aplicación |
|---|---|
| **Extensión de auth** | La tabla `auth.users` de Supabase es la fuente de identidad. Los perfiles se almacenan en una tabla `profiles` vinculada por UUID. |
| **Auditoría en cada tabla** | Todos los registros incluyen `created_at`, `updated_at` y `created_by` (donde aplique). |
| **Soft delete** | No se eliminan registros de negocio; se marcan como `archivado` o `deleted_at`. |
| **Geoespacial nativo** | Las coordenadas se almacenan como `geography(POINT,4326)` habilitando búsquedas por proximidad con PostGIS. |
| **Estados explícitos** | Las entidades con ciclo de vida (reportes, mascotas, solicitudes) usan enums o check constraints para validar estados. |
| **Integridad referencial** | Las relaciones utilizan foreign keys con `ON DELETE` explícito para evitar huérfanos. |

---

### Diagrama de entidades

```text
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   auth.users    │◄────────│    profiles     │◄────────┤     pets        │
│   (Supabase)    │   1:1   │                 │   1:N   │                 │
│                 │         │  • full_name    │         │  • name         │
│  id (uuid) PK   │         │  • role         │         │  • species      │
│  email          │         │  • phone        │         │  • status       │
│  phone          │         │  • avatar_url   │         │  • user_id FK   │
└─────────────────┘         └─────────────────┘         └─────────────────┘
         │                            │
         │                            │
         │                     ┌──────┘
         │                     │
         │              ┌─────────────────┐
         │              │     reports     │
         │              │                 │
         │              │  • type         │
         │              │  • status       │
         │              │  • location     │
         │              │  • pet_id FK    │
         │              │  • user_id FK   │
         │              └────────┬────────┘
         │                       │
         │              ┌────────┴────────┐
         │              │                 │
         │      ┌───────┴───────┐  ┌──────┴────────┐
         │      │report_updates │  │contact_requests │
         │      │  (futuro)     │  │                 │
         │      └───────────────┘  │  • status       │
         │                         │  • report_id FK │
         │                         │  • requester_id │
         │                         └─────────────────┘
         │
    ┌────┴────────────────────────┐
    │      notifications          │
    │        (futuro)             │
    └─────────────────────────────┘
```

---


## Estados de negocio

### Ciclo de vida de un reporte

```text
Nuevo reporte
     │
     ▼
┌─────────┐     ┌─────────────┐     ┌─────────────────────┐
│ ACTIVO  │────▶│ CONTACTADO  │────▶│ POSIBLE_COINCIDENCIA│
│         │     │             │     │                     │
│ Visible │     │ Existe una  │     │ Existen indicios    │
│ en mapa │     │ comunicación│     │ claros de encontrar │
│ y lista │     │ iniciada   │     │ al animal           │
└────┬────┘     └─────────────┘     └──────────┬──────────┘
     │                                          │
     │                                          │
     └──────────────────────────────────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │  RESUELTO   │
                   │             │
                   │ Animal      │
                   │ encontrado  │
                   │ o caso      │
                   │ cerrado     │
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ ARCHIVADO   │
                   │             │
                   │ Histórico   │
                   │ fuera de    │
                   │ búsquedas   │
                   └─────────────┘
```

---

| Estado | Descripción | Visible público | Acepta contactos |
|---|---|---|---|
| activo | Reporte publicado y buscando visibilidad. | Sí | Sí |
| contactado | Existe comunicación iniciada entre usuarios. | Sí | Sí |
| posible_coincidencia | Hay información relevante sobre una posible identificación. | Sí | Limitado |
| resuelto | Animal encontrado o caso cerrado. | Sí (marcado) | No |
| archivado | Registro histórico fuera de búsquedas activas. | No | No |

---

### Ciclo de vida de una solicitud de contacto

| Estado | Descripción |
|---|---|
| pendiente | Solicitud enviada esperando respuesta del receptor. |
| aceptada | El receptor acepta y comparte los datos permitidos. |
| rechazada | El receptor decide no continuar la comunicación. |
| cancelada | La solicitud queda invalidada antes de completarse. |
| expirada | Solicitud sin respuesta durante un periodo determinado (futuro). |

---

### Ciclo de vida de una mascota

| Estado | Descripción |
|---|---|
| activa | Mascota registrada y vinculada a un usuario. |
| perdida | Existe un reporte activo asociado de pérdida. |
| encontrada | Existe un reporte activo asociado de localización. |
| archivada | Mascota retirada del sistema o historial cerrado. |

---

# Índices recomendados

## 1. Índice geoespacial sobre reportes

La búsqueda por proximidad es una de las funcionalidades principales de BuscoHuella.

PostGIS requiere un índice espacial `GIST` sobre la columna `location` para permitir búsquedas eficientes mediante `ST_DWithin`, `ST_Contains` y otras operaciones geográficas.

```sql
CREATE INDEX idx_reports_location
ON reports
USING GIST(location);
```

```sql
SELECT *
FROM reports
WHERE ST_DWithin(
    location,
    ST_SetSRID(
        ST_MakePoint(-3.70379,40.416775),
        4326
    )::geography,
    5000
);

```

---


## 10.2.1 Objetivo

Definir la estrategia de optimización de PostgreSQL para BuscoHuella, estableciendo los índices necesarios para garantizar tiempos de respuesta adecuados en las operaciones principales del sistema:

- Búsqueda de animales perdidos y encontrados.
- Filtrado por ubicación geográfica.
- Consulta de mascotas por usuario.
- Gestión de solicitudes de contacto.
- Carga rápida del mapa.
- Consultas frecuentes desde Supabase.

La estrategia de indexación se basa en los patrones reales de uso de la aplicación, evitando crear índices innecesarios que puedan afectar al rendimiento de escritura.

La regla principal es:

> Los índices deben crearse según las consultas reales del sistema, no por cada columna existente.

---

## Principios de indexación

| Principio | Aplicación |
|---|---|
| **Índices orientados a casos de uso** | Se crean índices basados en las consultas principales de la aplicación. |
| **Evitar sobreindexación** | Cada índice mejora lecturas pero añade coste en inserciones y actualizaciones. |
| **Prioridad a búsquedas geográficas** | El mapa es una funcionalidad principal y requiere índices PostGIS específicos. |
| **Combinar filtros frecuentes** | Se utilizan índices compuestos para búsquedas habituales. |
| **Medición en producción** | Las consultas se analizarán mediante `EXPLAIN ANALYZE` antes de optimizaciones avanzadas. |

---

# Índices recomendados

## 10.2.2 Índice geoespacial sobre reportes

La búsqueda por proximidad es una de las funcionalidades principales de BuscoHuella.

Los reportes utilizan el campo `location` con tipo `geography(POINT,4326)` de PostGIS.

Para optimizar consultas mediante funciones como:

- `ST_DWithin()` para búsquedas por radio.
- `ST_Distance()` para calcular cercanía.
- Operaciones geográficas sobre mapas.

se crea un índice espacial utilizando el método `GIST`.

Ejemplo:

```bash
CREATE INDEX idx_reports_location
ON reports
USING GIST(location);
```

Este índice permite resolver consultas como:

- Animales perdidos cerca del usuario.
- Animales encontrados alrededor de una zona.
- Carga inicial de marcadores del mapa.
- Búsqueda de reportes dentro de un radio determinado.

---

## 10.2.3 Índices sobre estados y tipos de reporte

La tabla `reports` es la entidad principal del sistema, por lo que tendrá muchas consultas filtrando por:

- Estado del reporte.
- Tipo de reporte (perdido/encontrado).
- Fecha de creación.

Ejemplos de uso:

- Mostrar únicamente reportes activos.
- Separar animales perdidos de encontrados.
- Ordenar los avisos más recientes.
- Cargar rápidamente el listado de reportes.

Para estos casos se recomienda un índice compuesto:

```bash
CREATE INDEX idx_reports_status_type_created
ON reports(status, type, created_at DESC);
```

Este índice permite consultas eficientes como:

- Buscar solo reportes activos (`status='activo'`)
- Buscar reportes perdidos de una especie (`status='activo', type='perdido'`)
- Ordenar los resultados por fecha reciente
- Combinar filtros geográficos con estados y tipos

---

## 10.2.4 Índices sobre perfiles y mascotas

La tabla `profiles` contiene la información extendida de los usuarios autenticados mediante Supabase Auth.

Las consultas principales serán:

- Obtener el perfil del usuario autenticado.
- Filtrar usuarios según su tipo de cuenta.
- Mostrar información pública de organizaciones y profesionales.

Se recomienda un índice sobre el rol del usuario para optimizar filtros por tipo de perfil:


## 10.2.6 Índice completo recomendado (resumen)

```sql
-- Índices geoespaciales
CREATE INDEX idx_reports_location
ON reports
USING GIST(location);

-- Índices sobre reportes por estado y tipo
CREATE INDEX idx_reports_status_type_created
ON reports(status, type, created_at DESC);

-- Índices sobre usuarios
CREATE INDEX idx_users_username
ON users(username);

-- Índices sobre mascotas
CREATE INDEX idx_pets_user_id
ON pets(user_id);

CREATE INDEX idx_pets_name
ON pets(name);

-- Índices sobre contactos
CREATE INDEX idx_contacts_status_created
ON contacts(status, created_at DESC);

-- Índices sobre mensajes
CREATE INDEX idx_messages_conversation_id
ON messages(conversation_id);

CREATE INDEX idx_messages_conversation_created
ON messages(conversation_id, created_at DESC);
```

La tabla `profiles` contiene la información extendida de los usuarios autenticados mediante Supabase Auth.

Las consultas principales serán:

- Obtener el perfil del usuario autenticado.
- Filtrar usuarios según su tipo de cuenta.
- Mostrar información pública de organizaciones y profesionales.

Se recomienda un índice sobre el rol del usuario para optimizar filtros por tipo de perfil:

```sql
CREATE INDEX idx_profiles_role
ON profiles(role);
```

---

La tabla `pets` almacena las mascotas registradas por cada usuario.

Las consultas principales serán:

- Obtener las mascotas asociadas a un usuario.
- Mostrar las mascotas del perfil.
- Asociar una mascota existente a un nuevo reporte.

Se recomienda un índice sobre la relación con el propietario:

```sql
CREATE INDEX idx_pets_user_id
ON pets(user_id);
```

Si en el futuro se habilitan búsquedas directas por nombre de mascota, se podrá añadir un índice adicional:

```sql
CREATE INDEX idx_pets_name
ON pets(name);
```

---

---

## 10.2.5 Índices sobre solicitudes de contacto

La tabla `contact_requests` gestiona las solicitudes de comunicación entre usuarios relacionadas con un reporte.

Las consultas principales serán:

- Obtener solicitudes pendientes.
- Mostrar solicitudes recibidas por un usuario.
- Consultar solicitudes recientes.
- Gestionar cambios de estado de una solicitud.

Se recomienda un índice compuesto por estado y fecha:

```sql
CREATE INDEX idx_contact_requests_status_created
ON contact_requests(status, created_at DESC);
```

Además, como el usuario receptor será una de las consultas más frecuentes, se recomienda un índice específico:

```sql
CREATE INDEX idx_contact_requests_recipient
ON contact_requests(recipient_id);
```

---

---

## 10.2.6 Resumen de índices recomendados

A continuación se muestra el conjunto de índices principales definidos para la primera versión de BuscoHuella.

Estos índices cubren las operaciones críticas del sistema:

- Búsqueda geográfica de reportes.
- Filtrado de animales perdidos y encontrados.
- Consulta de mascotas por propietario.
- Gestión de solicitudes de contacto.
- Filtrado de usuarios por tipo de perfil.

```sql
-- Índice geoespacial para búsquedas por proximidad
CREATE INDEX idx_reports_location
ON reports
USING GIST(location);


-- Índice compuesto para filtros frecuentes de reportes
CREATE INDEX idx_reports_status_type_created
ON reports(status, type, created_at DESC);


-- Índice para búsqueda de perfiles por rol
CREATE INDEX idx_profiles_role
ON profiles(role);


-- Índice para obtener mascotas de un usuario
CREATE INDEX idx_pets_user_id
ON pets(user_id);


-- Índice opcional para búsquedas por nombre de mascota
CREATE INDEX idx_pets_name
ON pets(name);


-- Índice para gestión de solicitudes de contacto
CREATE INDEX idx_contact_requests_status_created
ON contact_requests(status, created_at DESC);


-- Índice para solicitudes recibidas por un usuario
CREATE INDEX idx_contact_requests_recipient
ON contact_requests(recipient_id, status);

```

Estos índices representan la configuración inicial recomendada para el MVP.

Durante la evolución del sistema podrán añadirse nuevos índices según las métricas reales de uso y las consultas detectadas en producción.

---

## 10.2.7 Estrategia de monitoreo y mantenimiento

Una vez que la aplicación esté en producción, se deberán monitorizar los índices para asegurar que siguen aportando mejoras de rendimiento y no generan costes innecesarios en operaciones de escritura.

El objetivo es comprobar:

- Que las consultas principales utilizan los índices esperados.
- Que no existen índices sin uso.
- Que las consultas críticas mantienen tiempos de respuesta adecuados.
- Que la base de datos puede escalar correctamente.

Herramientas recomendadas:

- `EXPLAIN ANALYZE` para analizar el plan de ejecución de consultas concretas.
- `pg_stat_statements` para identificar consultas lentas o ejecutadas frecuentemente.
- `pg_stat_user_indexes` para revisar la utilización real de los índices.

Ejemplo de análisis de una búsqueda geográfica:

```bash
EXPLAIN ANALYZE
SELECT *
FROM reports
WHERE status = 'activo'
AND type = 'perdido'
AND ST_DWithin(
    location,
    ST_SetSRID(
        ST_MakePoint(-3.70379, 40.416775),
        4326
    )::geography,
    5000
)
ORDER BY created_at DESC
LIMIT 20;
```

El resultado de `EXPLAIN ANALYZE` permitirá verificar si PostgreSQL utiliza correctamente:

- El índice geoespacial `idx_reports_location`.
- Los índices compuestos sobre estados y fechas.
- La estrategia de consulta definida para el mapa y los listados.

Las optimizaciones futuras deberán basarse en datos reales de producción y no únicamente en estimaciones iniciales.

---

# 10.2 Índices y optimización de consultas

# 10.2 Índices y optimización de consultas

## 10.2.1 Objetivo

## Principios de indexación

# Índices recomendados

## 10.2.2 Índice geoespacial sobre reportes

## 10.2.3 Índices sobre estados y tipos de reporte

## 10.2.4 Índices sobre perfiles y mascotas

## 10.2.5 Índices sobre solicitudes de contacto

## 10.2.6 Resumen de índices recomendados

## 10.2.7 Estrategia de monitoreo y mantenimiento

---

# 11. Arquitectura de seguridad

Autenticación.
Roles.
Permisos.
Row Level Security.
Protección de datos.
Subida segura de imágenes.

---

# 12. Arquitectura de API y servicios

Servicios frontend.
Supabase Client.
Edge Functions futuras.
Integraciones externas.

---

# 13. Arquitectura PWA y experiencia móvil

Instalación móvil.
Manifest.
Service Worker.
Caché.
Funcionamiento offline parcial.
Notificaciones push futuras.

---

# 14. Arquitectura de mapas y geolocalización

Leaflet.
GPS.
Coordenadas.
Radio de búsqueda.
Marcadores.
Clustering.

---

# 15. Estrategia de testing

Tests unitarios.
Tests componentes.
Tests E2E.
Herramientas:
  Testing Library
  Playwright
  Vitest/Jest

---

# 16. Estrategia de despliegue (Deployment)

Hosting frontend.
Supabase.
Variables entorno.
CI/CD.
Entornos:
  Development
  Staging
  Production

---

# 17. Roadmap técnico del MVP

### 17.1 Fases:

- **Fase 0:** Configuración del proyecto y herramientas.
- **Fase 1:** Autenticación y gestión de usuarios.
- **Fase 2:** Gestión de perfiles.
- **Fase 3:** Gestión de mascotas.
- **Fase 4:** Creación y gestión de reportes.
- **Fase 5:** Mapa y geolocalización.
- **Fase 6:** Búsqueda y filtros.
- **Fase 7:** Sistema de comunicación.
- **Fase 8:** Administración básica.
- **Fase 9:** Testing.
- **Fase 10:** Despliegue.

---

# 18. Consideraciones adicionales

## 18.1 Consideraciones de SEO

Next.js facilita la optimización SEO mediante: Server-Side Rendering (SSR) y Static Site Generation (SSG).

Se debe definir una estrategia para:

- Optimización de metadatos.
- Títulos y descripciones dinámicas.
- Generación de sitemaps.
- Etiquetas Open Graph.

## 18.2 Accesibilidad (a11y)

La plataforma debe seguir estándares de accesibilidad web:

- Roles ARIA.
- Navegación por teclado.
- Contraste de colores suficiente.
- Descripciones alternativas para imágenes.
- Formularios accesibles.

## 18.3 Consideraciones de UX móvil

La aplicación debe ofrecer una experiencia óptima en dispositivos móviles:

- Diseño responsive.
- Interacciones táctiles adecuadas.
- Gestos comunes.
- Minimización de la carga de datos.
- Uso eficiente del GPS.

## 18.4 Consideraciones de rendimiento

- Carga optimizada de imágenes.
- Lazy loading de componentes.
- Caché inteligente.
- Carga inicial optimizada.
- Minificación de código.

## 18.5 Consideraciones de privacidad y RGPD

- Consentimiento de cookies.
- Política de privacidad clara.
- Gestión de datos personales.
- Opciones de eliminación de cuenta.
- Privacidad de la ubicación.

## 18.6 Estrategia de internacionalización (i18n)

Aunque el MVP será en español, se debe planificar soporte para:

- Múltiples idiomas.
- Formatos de fecha y número.
- Textos localizables.
- Futuras expansiones a Latinoamérica.

---

# 19. Conclusiones técnicas

## 19.1 Resumen de decisiones

- **Frontend:** Next.js
- **Base de datos:** Supabase
- **Almacenamiento:** Supabase Storage
- **Mapas:** Leaflet
- **Testing:** Vitest, Testing Library, Playwright
- **Despliegue:** Vercel
- **Framework:** Next.js 14+ (App Router)
- **Lenguaje:** TypeScript
- **PWA:** Service Worker, Manifest

## 19.2 Ventajas clave del stack propuesto

### Para Next.js:
- Rapidez de desarrollo.
- Excelente SEO.
- Soporte para Server Components.
- Facilidad de despliegue.
- Integración nativa con Vercel.
- Comunidad grande y activa.

### Para Supabase:
- Base de datos PostgreSQL.
- Autenticación lista para usar.
- Almacenamiento de archivos.
- Integración en tiempo real.
- APIs automáticas.

### Para PWA:
- Instalación en móvil.
- Funcionamiento offline parcial.
- Mejor experiencia de usuario.
- Notificaciones futuras.

## 19.3 Consideraciones finales para el equipo

1. **Empezar por lo mínimo indispensable** y evitar la sobreingeniería.
2. **Implementar la seguridad desde el primer día** con RLS.
3. **Priorizar la experiencia móvil** dado el público objetivo.
4. **Definir una estructura de carpetas clara** que permita escalar.
5. **No complicar el testing al inicio**, centrarse en flujos críticos.
6. **Mantener el código modular** para facilitar mantenimientos futuros.

---

# 20. Recomendaciones de implementación (Quick Start)

## 20.1 Primeros pasos técnicos recomendados

```bash
# 1. Crear proyecto Next.js
npx create-next-app@latest buscohuella-mvp
# 2. Configurar TypeScript
# 3. Instalar Supabase Client
npm install @supabase/supabase-js
# 4. Instalar Leaflet y Mapbox (si se usa mapa de Mapbox)
npm install leaflet leaflet-routing-machine mapbox-gl
# 5. Configurar variables de entorno
# 6. Crear base de datos en Supabase
# 7. Implementar autenticación básica
# 8. Crear página de inicio
# 9. Crear página de reporte
# 10. Crear página de búsqueda
```

## 20.2 Estructura inicial de carpetas sugerida

```text
buscohuella-mvp/
  app/
    (auth)/
    (dashboard)/
    (public)/
    api/
  components/
    ui/
    layout/
    features/
  lib/
  services/
  assets/
  public/
```

## 20.3 Componentes iniciales recomendados

- `Navbar.tsx`
- `Footer.tsx`
- `AuthProvider.tsx`
- `LoginForm.tsx`
- `RegisterForm.tsx`
- `ReportForm.tsx`
- `Map.tsx`
- `PetCard.tsx`
- `UserDashboard.tsx`

## 20.4 Servicios iniciales recomendados

- `supabase.ts` (cliente Supabase)
- `authService.ts`
- `petService.ts`
- `reportService.ts`
- `mapService.ts`

---

## 20.5 Ejemplo rápido de integración Supabase

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

## 20.6 Ejemplo rápido de componente de mapa

```typescript
// components/Map.tsx
'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function Map() {
  const mapRef = useRef<L.Map | null>(null);
  
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([40.416775, -3.703790], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapRef.current);
    }
  }, []);
  
  return <div id="map" style={{ height: '400px', width: '100%' }} />;
}
```

## 20.7 Ejemplo rápido de gestión de autenticación

```typescript
// lib/auth.ts
import { supabase } from './supabase';

export async function signUp(email: string, password: string) {
  const { error, data } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { error, data } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}
```

## 20.8 Ejemplo rápido de gestión de reportes

```typescript
// services/reportService.ts
import { supabase } from '../lib/supabase';

export async function createReport(data: any) {
  const { error, data: newReport } = await supabase
    .from('reports')
    .insert(data);
  if (error) throw error;
  return newReport;
}

export async function getReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
```

## 21. Riesgos técnicos y mitigaciones

Riesgo	|	Solución
Crecimiento usuarios	|	Escalado Supabase
Costes almacenamiento	|	Optimización imágenes
Seguridad	|	RLS
Complejidad inicial	|	Empezar simple
Testing	|	Testing prioritario
Despliegue	|	CI/CD simple
Internacionalización	|	Planificar desde inicio
Optimización SEO	|	SSR + SSG
Accesibilidad	|	Normas ARIA
UX móvil	|	Diseño responsive