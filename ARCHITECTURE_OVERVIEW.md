# BuscoHuella — Architecture Overview

> Resumen técnico de alto nivel del sistema BuscoHuella.

## 1. Propósito

Este documento ofrece una visión rápida y vigente de la arquitectura prevista para BuscoHuella.

No sustituye a:

```text
docs/master/DOCUMENTO_MAESTRO.md
```

ni a la documentación técnica detallada de `docs/`.

Ante cualquier contradicción, prevalece el Documento Maestro.

---

## 2. Estado actual

BuscoHuella se encuentra en fase **Pre-MVP**.

La arquitectura se diseña para validar primero el producto en Sabadell con el menor coste y complejidad razonables.

Principios:

- web-first para el MVP;
- monorepo;
- backend gestionado;
- seguridad por defecto;
- accesibilidad desde el diseño;
- crecimiento incremental;
- evitar sobreingeniería;
- no construir funcionalidades futuras antes de validar el núcleo.

---

## 3. Objetivo del sistema

El sistema debe permitir que una persona pueda:

1. registrarse;
2. registrar una mascota;
3. publicar una pérdida o hallazgo;
4. consultar reportes cercanos;
5. comunicar un avistamiento;
6. recibir información relevante;
7. actualizar el estado del caso;
8. documentar un reencuentro.

La métrica principal es:

> Número de mascotas reunidas con sus familias gracias a BuscoHuella.

---

## 4. Componentes principales

```text
┌─────────────────────────────────────┐
│             Usuarios                │
│ Propietarios · Vecinos · Entidades  │
└──────────────────┬──────────────────┘
                   │
        ┌──────────▼──────────┐
        │    Aplicación web   │
        │ Next.js · TypeScript│
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │      Supabase       │
        │ Auth · Database     │
        │ Storage · Realtime  │
        │ Edge Functions      │
        └──────────┬──────────┘
                   │
        ┌──────────▼──────────┐
        │ PostgreSQL + PostGIS│
        └─────────────────────┘

        ┌─────────────────────┐
        │  Aplicación móvil   │
        │ Expo React Native   │
        │   Fase posterior    │
        └──────────┬──────────┘
                   │
                   └──────────────► Supabase
```

---

## 5. Monorepo

Estructura objetivo:

```text
buscohuella/
├── apps/
│   ├── web/
│   └── mobile/
├── packages/
│   ├── shared-types/
│   ├── shared-utils/
│   └── constants/
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── seed/
├── docs/
├── scripts/
├── tools/
├── AGENTS.md
├── CONTRIBUTING.md
└── README.md
```

La estructura real puede evolucionar, pero debe conservar:

- separación entre aplicaciones;
- lógica compartida reutilizable;
- configuración de Supabase versionada;
- documentación centralizada;
- ausencia de duplicidades innecesarias.

---

## 6. Aplicación web

Tecnologías:

- Next.js;
- TypeScript;
- App Router;
- Tailwind CSS;
- Shadcn UI;
- Lucide;
- Framer Motion cuando aporte valor;
- Vercel.

Responsabilidades:

- landing pública;
- registro e inicio de sesión;
- perfiles;
- gestión de mascotas;
- reportes;
- mapa;
- avistamientos;
- notificaciones web;
- estados de casos;
- administración mínima necesaria.

La aplicación web será la primera interfaz funcional del MVP.

---

## 7. Aplicación móvil

Tecnologías previstas:

- Expo;
- React Native;
- TypeScript;
- Expo Router.

La aplicación móvil no forma parte de la primera entrega web del MVP.

Se desarrollará posteriormente reutilizando:

- tipos;
- validaciones;
- contratos;
- constantes;
- reglas de dominio;
- integración con Supabase.

---

## 8. Backend

El backend principal será Supabase.

Servicios utilizados:

- Supabase Auth;
- PostgreSQL;
- PostGIS;
- Supabase Storage;
- Supabase Realtime;
- Edge Functions cuando sean necesarias.

No se prevé un backend Symfony, PHP o API Platform para el MVP.

Las reglas críticas no deben depender únicamente del cliente.

---

## 9. Base de datos

Tecnologías:

- PostgreSQL;
- PostGIS.

Dominios iniciales:

- usuarios;
- perfiles;
- mascotas;
- reportes;
- avistamientos;
- archivos;
- notificaciones;
- organizaciones básicas;
- estados y auditoría necesaria.

Toda tabla debe considerar:

- clave primaria;
- timestamps;
- restricciones;
- índices;
- relaciones;
- políticas RLS;
- conservación de datos;
- estrategia de borrado;
- auditoría cuando corresponda.

---

## 10. Seguridad

La seguridad se aplica desde el diseño.

Principios:

- Row Level Security obligatoria;
- mínimo privilegio;
- validación en servidor o base de datos;
- secretos fuera del repositorio;
- protección de ubicaciones sensibles;
- minimización de datos;
- trazabilidad de acciones críticas;
- cifrado en tránsito;
- cumplimiento de RGPD y LOPDGDD.

Nunca se debe utilizar el cliente como única barrera de seguridad.

---

## 11. Geolocalización y mapas

Tecnologías:

- Mapbox;
- PostGIS.

Casos de uso iniciales:

- mapa de reportes;
- filtros por distancia;
- búsqueda por zona;
- avistamientos;
- ubicación aproximada;
- proximidad a reportes activos.

Las coordenadas sensibles deben protegerse o aproximarse según el caso.

---

## 12. Almacenamiento

Supabase Storage gestionará inicialmente:

- fotografías de mascotas;
- imágenes de reportes;
- imágenes de avistamientos;
- avatares cuando proceda.

No se utilizará MinIO como dependencia del MVP.

Los buckets deben tener:

- reglas de acceso;
- límites;
- validación de tipo;
- validación de tamaño;
- estrategia de eliminación;
- política de privacidad.

---

## 13. Tiempo real y notificaciones

Supabase Realtime podrá utilizarse para actualizaciones relevantes del sistema.

Las notificaciones del MVP serán principalmente web.

No se debe introducir infraestructura adicional de colas o mensajería hasta que exista una necesidad real y medible.

---

## 14. Internacionalización

Idiomas previstos:

- español;
- catalán;
- inglés;
- euskera;
- gallego.

El español será el idioma inicial.

La arquitectura debe evitar textos visibles incrustados cuando ya exista sistema de traducciones.

---

## 15. Accesibilidad

Objetivo:

```text
WCAG 2.2 nivel AA
```

La accesibilidad forma parte de la definición de terminado.

Debe considerarse en:

- navegación;
- formularios;
- colores;
- foco;
- teclado;
- lectores de pantalla;
- estados de error;
- estados de carga;
- componentes interactivos;
- mapas y alternativas textuales.

---

## 16. Observabilidad

El MVP debe registrar lo suficiente para diagnosticar errores sin capturar datos personales innecesarios.

Áreas:

- errores de aplicación;
- errores de autenticación;
- fallos de subida;
- errores de consultas;
- eventos críticos de dominio;
- métricas del producto.

No registrar secretos, tokens ni información sensible.

---

## 17. Despliegue

### Web

```text
GitHub → GitHub Actions → Vercel
```

### Backend y datos

```text
GitHub → Supabase migrations/functions → Supabase
```

Entornos previstos:

- desarrollo;
- staging cuando sea necesario;
- producción.

Las variables de entorno no deben versionarse.

---

## 18. Testing

Prioridades:

- reglas de dominio;
- permisos;
- RLS;
- autenticación;
- registro de mascotas;
- publicación de reportes;
- avistamientos;
- resolución de casos;
- filtros geográficos;
- accesibilidad.

Tipos:

- unitarios;
- integración;
- end-to-end;
- seguridad;
- accesibilidad.

---

## 19. Decisiones fuera del MVP

No forman parte de la arquitectura inicial:

- IA de reconocimiento;
- chat;
- pagos;
- suscripciones;
- gamificación;
- blockchain;
- tokens;
- GPS propio;
- telemedicina;
- historiales clínicos completos;
- adopciones como módulo principal;
- red social;
- microservicios;
- colas complejas;
- Redis o RabbitMQ obligatorios;
- integraciones institucionales avanzadas.

Podrán evaluarse después de validar el producto principal.

---

## 20. Tecnologías descartadas como stack principal

No utilizar como arquitectura vigente:

- Angular;
- Symfony;
- PHP;
- API Platform;
- Doctrine ORM;
- MinIO;
- JWT propio;
- Leaflet como solución principal;
- OpenStreetMap como proveedor principal;
- Redis o RabbitMQ como requisito inicial.

Las referencias existentes a estas tecnologías deben revisarse porque pueden pertenecer a documentación histórica.

---

## 21. Evolución prevista

### Fase 0 — Fundación

- documentación;
- monorepo;
- estándares;
- entornos;
- seguridad base.

### Fase 1 — MVP web

- autenticación;
- mascotas;
- reportes;
- mapa;
- avistamientos;
- notificaciones;
- resolución.

### Fase 2 — Beta local

- piloto en Sabadell;
- métricas reales;
- mejora de experiencia;
- colaboración con protectoras.

### Fase 3 — Aplicación móvil

- Expo React Native;
- notificaciones móviles;
- experiencia de campo.

### Fase 4 — Expansión regional

- Vallès Occidental;
- más organizaciones;
- integraciones progresivas.

---

## 22. Documentación relacionada

```text
docs/master/DOCUMENTO_MAESTRO.md
docs/architecture/ARCHITECTURE.md
docs/architecture/SYSTEM_DIAGRAMS.md
docs/adr/
docs/technical/TECHNOLOGY_STACK.md
docs/database/DATABASE_SCHEMA.md
docs/integrations/SUPABASE.md
docs/maps/MAP_ARCHITECTURE.md
docs/security/
```

---

## 23. Regla arquitectónica final

Toda decisión debe favorecer:

- simplicidad;
- seguridad;
- mantenibilidad;
- accesibilidad;
- coste razonable;
- validación rápida;
- crecimiento incremental.

> La arquitectura debe servir al MVP, no convertir el MVP en una excusa para construir una plataforma sobredimensionada.
