# 🐾 BuscoHuella

> **Encuentra. Protege. Conecta.**

Plataforma digital colaborativa para ayudar a localizar mascotas perdidas, comunicar avistamientos y conectar a propietarios, vecinos, protectoras, profesionales y administraciones.

[![Estado](https://img.shields.io/badge/estado-Pre--MVP-yellow)]()
[![Piloto](https://img.shields.io/badge/piloto-Sabadell-2E86DE)]()
[![Waitlist](https://img.shields.io/badge/waitlist-170%2B-6AB04C)](https://buscohuella.es)
[![Licencia](https://img.shields.io/badge/licencia-propietaria-red)]()

---

## 📖 Qué es BuscoHuella

BuscoHuella es una plataforma web y móvil diseñada para mejorar la respuesta comunitaria ante la pérdida o localización de una mascota.

La plataforma permitirá:

- Publicar mascotas perdidas o encontradas.
- Consultar reportes en un mapa interactivo.
- Comunicar avistamientos con ubicación y fotografías.
- Recibir alertas relacionadas con una zona.
- Centralizar la información relevante de cada caso.
- Facilitar la colaboración entre ciudadanía, protectoras y profesionales.

El proyecto comenzará con un piloto local en **Sabadell, Vallès Occidental, Cataluña**.

---

## 🎯 Propósito

BuscoHuella nace con una prioridad clara:

> Ayudar a que más mascotas regresen con sus familias.

La métrica principal del proyecto es:

**Número de mascotas reunidas con sus familias gracias a BuscoHuella.**

---

## 🚀 Estado del proyecto

BuscoHuella se encuentra actualmente en fase **Pre-MVP** y en desarrollo activo.

| Área | Estado |
| --- | --- |
| Landing pública | ✅ Operativa |
| Lista de espera | ✅ 170+ personas registradas |
| Documentación funcional | 🚧 En revisión y consolidación |
| Arquitectura técnica | 🚧 Definida |
| Aplicación web MVP | 📋 Pendiente de implementación |
| Backend y base de datos | 📋 Pendiente de implementación |
| Aplicación móvil | 📋 Posterior al MVP web |
| Piloto en Sabadell | 📋 Próxima fase |

---

## 🧭 Objetivos del MVP

El MVP de BuscoHuella busca validar que una red local bien coordinada puede mejorar la difusión, seguimiento y resolución de casos de mascotas perdidas.

Objetivos iniciales:

- 500 usuarios registrados.
- 100 mascotas registradas.
- 50 reportes reales.
- 25 avistamientos publicados.
- 5 reencuentros documentados.
- 1 protectora colaboradora.
- Cobertura inicial en Sabadell.

---

## ✅ Funcionalidades incluidas en el MVP

La primera versión incluirá:

- Registro e inicio de sesión.
- Gestión básica del perfil de usuario.
- Registro de mascotas.
- Publicación de mascotas perdidas.
- Publicación de mascotas encontradas.
- Mapa interactivo de reportes.
- Feed o listado de reportes.
- Filtros por tipo, estado, fecha y distancia.
- Página de detalle de cada reporte.
- Publicación de avistamientos.
- Fotografías y ubicación aproximada.
- Notificaciones web.
- Gestión de estados del caso.
- Marcado de casos como resueltos.
- Landing pública y lista de espera.

---

## ⏳ Funcionalidades fuera del MVP

Para evitar complejidad prematura, la primera versión no incluirá:

- Reconocimiento visual mediante inteligencia artificial.
- Chat interno.
- Gamificación.
- Pagos o suscripciones.
- Funciones premium.
- Blockchain o tokens.
- Dispositivos GPS propios.
- Telemedicina.
- Red social completa.
- Integraciones institucionales complejas.
- Automatizaciones avanzadas para administraciones.

Estas funcionalidades podrán estudiarse en fases posteriores, una vez validado el producto principal.

---

## 🏗️ Arquitectura prevista

BuscoHuella utilizará una arquitectura monorepo con aplicaciones web y móvil, servicios compartidos y backend gestionado mediante Supabase.

```text
┌─────────────────────┐
│   Aplicación web    │
│      Next.js        │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│      Supabase       │
│ Auth · Database     │
│ Storage · Realtime  │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│ PostgreSQL + PostGIS│
└─────────────────────┘

┌─────────────────────┐
│  Aplicación móvil   │
│ Expo React Native   │
└──────────┬──────────┘
           │
           └──────────────► Supabase
```

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| Web | Next.js, TypeScript, App Router |
| Estilos | Tailwind CSS |
| Componentes UI | Shadcn UI |
| Animaciones | Framer Motion |
| Iconos | Lucide |
| Aplicación móvil | Expo React Native, TypeScript |
| Backend | Supabase |
| Base de datos | PostgreSQL |
| Geolocalización | PostGIS |
| Autenticación | Supabase Auth |
| Almacenamiento | Supabase Storage |
| Tiempo real | Supabase Realtime |
| Mapas | Mapbox |
| Hosting web | Vercel |
| CI/CD | GitHub Actions |
| Control de versiones | Git y GitHub |

---

## 📁 Estructura prevista del repositorio

```text
buscohuella/
├── apps/
│   ├── web/                  # Aplicación web Next.js
│   └── mobile/               # Aplicación móvil Expo
│
├── packages/
│   └── shared/               # Tipos, utilidades y lógica compartida
│
├── docs/                     # Documentación del proyecto
│   ├── master/
│   ├── product/
│   ├── architecture/
│   ├── database/
│   ├── security/
│   ├── legal/
│   ├── ux/
│   └── ...
│
├── supabase/                 # Migraciones y configuración de Supabase
├── scripts/                  # Scripts de desarrollo y mantenimiento
├── AGENTS.md                 # Instrucciones para agentes de IA
├── CONTRIBUTING.md           # Guía de contribución
├── README.md
└── .gitignore
```

La estructura puede evolucionar durante la implementación, pero cualquier cambio relevante deberá documentarse.

---

## 📚 Documentación principal

La documentación completa se encuentra en la carpeta `docs/`.

| Documento | Propósito |
| --- | --- |
| `docs/master/DOCUMENTO_MAESTRO.md` | Fuente única de verdad del proyecto |
| `docs/product/MVP_SCOPE.md` | Alcance del MVP |
| `docs/product/ROADMAP.md` | Fases y prioridades |
| `docs/database/DATABASE_SCHEMA.md` | Modelo de datos |
| `docs/identity/USER_ROLES.md` | Roles y permisos |
| `docs/maps/MAP_ARCHITECTURE.md` | Arquitectura de mapas |
| `docs/integrations/SUPABASE.md` | Integración con Supabase |
| `docs/devops/CI_CD.md` | Integración y despliegue continuo |

Ante cualquier contradicción entre documentos, prevalece:

```text
docs/master/DOCUMENTO_MAESTRO.md
```

---

## 👥 Usuarios principales

BuscoHuella está pensado para:

- Propietarios de mascotas.
- Vecinos y colaboradores.
- Protectoras y refugios.
- Veterinarios.
- Comercios y profesionales del sector animal.
- Ayuntamientos.
- Policía local.
- Usuarios invitados.

Cada rol tendrá permisos y capacidades diferentes según la fase del producto.

---

## 🔒 Seguridad y privacidad

La seguridad se aplicará desde el diseño inicial del producto.

Principios previstos:

- Autenticación segura.
- Row Level Security en Supabase.
- Acceso basado en roles.
- Minimización de datos personales.
- Ubicaciones sensibles protegidas o aproximadas.
- Cifrado en tránsito mediante TLS.
- Registro de acciones críticas.
- Política de conservación y eliminación de datos.
- Cumplimiento del RGPD y la LOPDGDD.
- Consideración de la Ley 7/2023 de Bienestar Animal.

---

## ♿ Accesibilidad

BuscoHuella se diseñará siguiendo los criterios de **WCAG 2.2 nivel AA**.

Se priorizarán:

- Contraste suficiente.
- Navegación mediante teclado.
- Etiquetas accesibles.
- Lectura mediante tecnologías de asistencia.
- Estados de foco visibles.
- Mensajes de error comprensibles.
- Uso del color acompañado de texto o iconografía.

---

## 🌍 Idiomas previstos

La plataforma contempla soporte para:

- Español.
- Catalán.
- Inglés.
- Euskera.
- Gallego.

El español será el idioma principal inicial.

---

## 🧪 Desarrollo local

El entorno de desarrollo todavía está en preparación.

Los requisitos previstos serán:

- Node.js 20 o superior.
- npm, pnpm o gestor definido por el proyecto.
- Git.
- Cuenta de Supabase.
- Cuenta de Mapbox.
- Cuenta de Vercel.
- Expo para el desarrollo móvil.

Las instrucciones definitivas se añadirán cuando la primera aplicación esté inicializada.

---

## 🤝 Contribución

BuscoHuella se encuentra actualmente en una fase temprana de desarrollo.

Antes de contribuir:

1. Revisa `README.md`.
2. Revisa `AGENTS.md`.
3. Consulta `docs/master/DOCUMENTO_MAESTRO.md`.
4. Confirma el alcance de la tarea.
5. Evita introducir funcionalidades fuera del MVP.
6. Crea una rama específica.
7. Incluye pruebas y documentación cuando corresponda.
8. Abre un Pull Request para revisión.

No se deben realizar cambios directos en `main` salvo correcciones excepcionales autorizadas.

---

## 🗺️ Roadmap resumido

### Fase 0 — Fundación

- Consolidación documental.
- Preparación del repositorio.
- Estándares de desarrollo.
- Configuración del monorepo.
- Entornos y herramientas.

### Fase 1 — MVP web

- Autenticación.
- Usuarios y mascotas.
- Reportes.
- Mapa.
- Avistamientos.
- Notificaciones.
- Resolución de casos.

### Fase 2 — Beta local

- Piloto en Sabadell.
- Métricas reales.
- Colaboración con protectoras.
- Mejoras de experiencia.
- Optimización de rendimiento.

### Fase 3 — Aplicación móvil

- Aplicación nativa mediante Expo.
- Notificaciones móviles.
- Geolocalización mejorada.
- Experiencia optimizada para campo.

### Fase 4 — Expansión regional

- Vallès Occidental.
- Más protectoras y profesionales.
- Integraciones institucionales progresivas.

---

## 📊 Métricas principales

BuscoHuella medirá, entre otras:

- Mascotas reunidas con sus familias.
- Reportes publicados.
- Avistamientos útiles.
- Tiempo hasta el primer avistamiento.
- Casos activos y resueltos.
- Usuarios activos.
- Retención.
- Densidad local de usuarios.
- Participación por municipio.
- Colaboraciones activas.

---

## 📜 Licencia

Este proyecto es propietario.

Todos los derechos están reservados.

No se permite copiar, redistribuir, modificar o utilizar comercialmente el contenido o el código sin autorización expresa.

---

## 📞 Contacto

- Web: [https://buscohuella.es](https://buscohuella.es)
- Email: `xavier@buscohuella.es`
- GitHub: `buscohuella/buscohuella`
- Fundador: Xavier Quesada Sevillano

---

> **Cada minuto cuenta. Todos merecen volver a casa.**
