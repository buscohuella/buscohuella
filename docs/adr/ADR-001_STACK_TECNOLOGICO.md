# ADR-001 — Stack Tecnológico Principal

## BuscoHuella MVP

**Estado:** Aceptado  
**Fecha:** 31 de julio de 2026  
**Decisor:** Xavier Quesada Sevillano — Fundador / Product Owner  
**Ámbito:** Arquitectura general del MVP  
**Revisión prevista:** Después de validar el piloto de Sabadell o ante una limitación técnica demostrable  

---

## 1. Contexto

BuscoHuella se encuentra en fase **Pre-MVP** y debe construir una primera versión funcional con un equipo reducido, presupuesto limitado y necesidad de validar el producto antes de escalar.

La plataforma debe permitir:

- registro e inicio de sesión;
- gestión básica de perfiles;
- registro de mascotas;
- publicación de mascotas perdidas;
- publicación de mascotas encontradas;
- mapa interactivo;
- filtros geográficos;
- publicación de avistamientos;
- subida de fotografías;
- notificaciones web;
- resolución de casos;
- landing pública;
- lista de espera.

La decisión tecnológica debe priorizar:

1. velocidad de implementación;
2. simplicidad operativa;
3. seguridad;
4. accesibilidad;
5. coste inicial bajo;
6. mantenibilidad;
7. capacidad geoespacial;
8. evolución hacia una aplicación móvil;
9. compatibilidad con un equipo pequeño;
10. reducción de sobreingeniería.

---

## 2. Problema

El proyecto necesita definir un stack tecnológico principal que permita construir el MVP sin arrastrar una infraestructura compleja ni bloquear una evolución futura.

La pregunta principal es:

> ¿Qué combinación de tecnologías permite desarrollar, desplegar y mantener BuscoHuella con la menor complejidad razonable y suficiente capacidad de crecimiento?

---

## 3. Restricciones

Las principales restricciones son:

| Factor | Situación |
|---|---|
| Equipo | Un desarrollador principal |
| Estado | Pre-MVP |
| Presupuesto | Limitado |
| Objetivo | Validar primero en Sabadell |
| Prioridad | Velocidad y simplicidad |
| Producto inicial | Aplicación web |
| Móvil | Fase posterior |
| Datos geográficos | Requisito central |
| Seguridad | Requisito obligatorio |
| Accesibilidad | WCAG 2.2 AA |
| Operación | Evitar infraestructura propia compleja |

---

## 4. Criterios de decisión

Se evaluaron las alternativas según:

- tiempo de desarrollo;
- complejidad de despliegue;
- curva de aprendizaje;
- coste;
- seguridad;
- autenticación;
- almacenamiento;
- capacidad geográfica;
- experiencia web;
- soporte móvil futuro;
- ecosistema;
- mantenimiento;
- riesgo de dependencia;
- facilidad de trabajo con IA y herramientas modernas;
- disponibilidad de documentación y comunidad.

---

## 5. Alternativas consideradas

### 5.1 Angular + Symfony + PostgreSQL

#### Ventajas

- arquitectura empresarial madura;
- separación clara entre frontend y backend;
- ecosistema sólido;
- buenas prácticas consolidadas;
- control completo del backend;
- PostgreSQL y PostGIS disponibles.

#### Inconvenientes

- mayor complejidad inicial;
- dos ecosistemas principales;
- más infraestructura;
- más tiempo de configuración;
- mayor coste de mantenimiento;
- autenticación, storage, colas y despliegue requieren más trabajo;
- menor velocidad para un equipo de una persona;
- riesgo de sobredimensionar el MVP.

#### Resultado

Descartado como stack principal para el MVP.

Podría ser válido para una organización mayor o una fase futura con necesidades específicas, pero no ofrece la relación velocidad/complejidad adecuada para la situación actual.

---

### 5.2 Next.js + Supabase + PostgreSQL/PostGIS

#### Ventajas

- TypeScript en gran parte del sistema;
- desarrollo web rápido;
- App Router;
- buena integración con Vercel;
- autenticación integrada;
- PostgreSQL gestionado;
- PostGIS;
- Row Level Security;
- Storage;
- Realtime;
- Edge Functions;
- menor carga operativa;
- buena base para aplicación móvil con Expo;
- comunidad amplia;
- menor tiempo hasta una primera versión funcional.

#### Inconvenientes

- dependencia parcial de servicios gestionados;
- necesidad de diseñar correctamente RLS;
- riesgo de acoplamiento a APIs de Supabase;
- límites de cuota;
- necesidad de disciplina en migraciones;
- algunas lógicas complejas pueden requerir Edge Functions.

#### Resultado

Alternativa seleccionada.

---

### 5.3 React + backend propio en Node.js

#### Ventajas

- TypeScript de extremo a extremo;
- control completo;
- ecosistema amplio;
- flexibilidad.

#### Inconvenientes

- requiere construir autenticación;
- requiere desplegar backend;
- requiere storage;
- requiere más observabilidad;
- requiere más seguridad operativa;
- mayor carga de mantenimiento;
- menor velocidad para el MVP.

#### Resultado

Descartado para el MVP.

---

### 5.4 Flutter + Firebase

#### Ventajas

- móvil multiplataforma;
- desarrollo rápido;
- Firebase Auth;
- Storage;
- notificaciones;
- buena experiencia móvil.

#### Inconvenientes

- web menos prioritaria;
- menor alineación con el enfoque web-first;
- modelo de datos no relacional en Firestore;
- menos adecuado para relaciones complejas;
- consultas geográficas más limitadas;
- menor afinidad con PostgreSQL/PostGIS;
- curva adicional para Dart.

#### Resultado

Descartado.

---

### 5.5 Next.js + Firebase

#### Ventajas

- desarrollo rápido;
- autenticación y storage integrados;
- ecosistema amplio;
- despliegue sencillo.

#### Inconvenientes

- base de datos no relacional;
- menor encaje con el dominio relacional;
- geolocalización menos natural;
- mayor complejidad para ciertas consultas;
- dependencia más fuerte del modelo Firebase.

#### Resultado

Descartado frente a Supabase.

---

### 5.6 Laravel + Vue/React

#### Ventajas

- ecosistema maduro;
- desarrollo backend rápido;
- autenticación disponible;
- buena comunidad;
- arquitectura conocida.

#### Inconvenientes

- dos stacks principales;
- mayor infraestructura;
- más despliegue y mantenimiento;
- menor alineación con TypeScript compartido;
- mayor complejidad para un equipo pequeño.

#### Resultado

Descartado para el MVP.

---

## 6. Decisión

Se adopta el siguiente stack principal:

### Lenguaje

```text
TypeScript
```

### Aplicación web

```text
Next.js
React
App Router
Tailwind CSS
Shadcn UI
Lucide
Framer Motion cuando aporte valor
```

### Aplicación móvil

```text
Expo
React Native
TypeScript
Expo Router
```

La aplicación móvil se desarrollará en una fase posterior.

### Backend

```text
Supabase
Supabase Auth
Supabase Storage
Supabase Realtime
Supabase Edge Functions
```

### Base de datos

```text
PostgreSQL
PostGIS
```

### Mapas

```text
Mapbox
```

### Hosting y despliegue

```text
Vercel
GitHub
GitHub Actions
Supabase
```

### Monorepo

```text
pnpm
pnpm workspaces
Node.js 20+
```

---

## 7. Justificación

La decisión se basa en que esta combinación:

- reduce infraestructura;
- reduce tiempo de desarrollo;
- reduce coste inicial;
- permite trabajar principalmente con TypeScript;
- mantiene PostgreSQL como base robusta;
- incorpora capacidades geográficas mediante PostGIS;
- ofrece autenticación, almacenamiento y tiempo real;
- facilita el despliegue;
- permite evolucionar hacia móvil;
- mantiene una arquitectura razonablemente portable;
- evita construir servicios que no diferencian el producto.

---

## 8. Consecuencias positivas

### 8.1 Menor tiempo de lanzamiento

Se evita construir desde cero:

- autenticación;
- almacenamiento;
- backend base;
- infraestructura;
- tiempo real;
- gestión de sesiones.

### 8.2 Menor carga operativa

Supabase y Vercel reducen:

- mantenimiento de servidores;
- configuración de despliegue;
- gestión de base de datos;
- operación inicial.

### 8.3 Coherencia tecnológica

TypeScript permite compartir:

- tipos;
- contratos;
- validaciones;
- utilidades;
- constantes.

### 8.4 Capacidad geoespacial

PostGIS permite:

- búsquedas por radio;
- cálculo de distancias;
- filtros;
- zonas;
- proximidad.

### 8.5 Evolución móvil

Expo React Native puede consumir la misma infraestructura y reutilizar parte del conocimiento y tipos.

---

## 9. Consecuencias negativas

### 9.1 Dependencia de proveedores

El proyecto dependerá de:

- Supabase;
- Vercel;
- Mapbox.

Mitigación:

- PostgreSQL como base portable;
- migraciones versionadas;
- lógica de dominio desacoplada;
- variables de entorno;
- evitar APIs propietarias innecesarias.

### 9.2 Seguridad compleja en RLS

RLS ofrece seguridad potente, pero requiere diseño correcto.

Mitigación:

- políticas denegadas por defecto;
- tests de permisos;
- revisión de cada tabla;
- documentación;
- auditoría.

### 9.3 Límites de cuota

Los planes gratuitos pueden resultar insuficientes.

Mitigación:

- monitorizar uso;
- medir antes de escalar;
- presupuestar crecimiento;
- optimizar consultas y archivos.

### 9.4 Riesgo de lógica excesiva en cliente

Supabase facilita acceso directo desde cliente.

Mitigación:

- no confiar en cliente;
- usar RLS;
- restricciones;
- Edge Functions;
- validaciones en base de datos.

---

## 10. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---:|---:|---|
| Políticas RLS incorrectas | Media | Alta | Tests y revisión |
| Dependencia de Supabase | Media | Media | PostgreSQL portable |
| Costes de Mapbox | Baja/Media | Media | Control de uso |
| Acoplamiento al proveedor | Media | Media | Capas y contratos |
| Complejidad futura | Media | Media | ADR y revisión |
| Crecimiento de Realtime | Baja | Media | Uso selectivo |
| Demasiadas dependencias | Media | Media | Política estricta |
| Sobreingeniería | Media | Alta | Foco en MVP |

---

## 11. Tecnologías descartadas como stack vigente

No se utilizarán como stack principal del MVP:

- Angular;
- Symfony;
- PHP;
- API Platform;
- Doctrine ORM;
- Symfony Messenger;
- MinIO;
- Redis como requisito;
- RabbitMQ como requisito;
- JWT propio;
- Leaflet como solución principal;
- OpenStreetMap como proveedor principal;
- Google Maps como proveedor principal.

Esto no implica que sean tecnologías inadecuadas en general, sino que no son la mejor decisión para el contexto actual de BuscoHuella.

---

## 12. Decisiones aplazadas

Quedan pendientes decisiones específicas sobre:

- librería de testing;
- solución de i18n;
- observabilidad;
- analítica;
- emails;
- notificaciones web;
- monitorización;
- gestión de errores;
- validación de schemas;
- tratamiento de imágenes.

Estas decisiones se tomarán cuando exista contexto técnico suficiente.

---

## 13. Impacto en la estructura del repositorio

Estructura objetivo:

```text
apps/
├── web/
└── mobile/

packages/
├── shared-types/
├── shared-utils/
└── constants/

supabase/
├── migrations/
├── functions/
└── seed/
```

El repositorio utilizará:

- pnpm;
- un único lockfile;
- configuración compartida;
- scripts comunes;
- documentación centralizada.

---

## 14. Impacto en el desarrollo

Toda nueva funcionalidad debe:

- usar TypeScript;
- respetar la arquitectura;
- utilizar Supabase;
- definir RLS;
- considerar accesibilidad;
- considerar i18n;
- considerar seguridad;
- evitar dependencias innecesarias;
- mantenerse dentro del MVP.

---

## 15. Impacto en despliegue

### Web

```text
GitHub → Vercel
```

### Backend y base de datos

```text
GitHub → Supabase migrations/functions
```

### Validaciones

```text
GitHub Actions
```

---

## 16. Criterios de revisión futura

Esta decisión se revisará si ocurre alguno de estos casos:

- Supabase no cubre una necesidad crítica;
- los costes dejan de ser razonables;
- aparecen límites de rendimiento;
- se requiere control operativo mayor;
- el proyecto incorpora un equipo técnico amplio;
- se necesitan integraciones complejas;
- el piloto valida un crecimiento significativo;
- la aplicación móvil cambia la arquitectura;
- una obligación legal exige cambios;
- aparecen problemas de portabilidad.

---

## 17. Consecuencia organizativa

La elección obliga a mantener:

- conocimiento de TypeScript;
- conocimiento de Next.js;
- conocimiento de PostgreSQL;
- conocimiento de RLS;
- conocimiento de Supabase;
- disciplina de migraciones;
- conocimiento básico de Mapbox;
- control de variables de entorno.

---

## 18. Documentación relacionada

```text
docs/master/DOCUMENTO_MAESTRO.md
docs/technical/TECHNOLOGY_STACK.md
docs/architecture/ARCHITECTURE.md
ARCHITECTURE_OVERVIEW.md
docs/adr/ADR-003_SUPABASE.md
docs/adr/ADR-004_FRONTEND_WEB.md
AGENTS.md
```

---

## 19. Estado de la decisión

**Aceptado.**

La decisión entra en vigor para el MVP y sustituye cualquier referencia activa a Angular, Symfony u otras combinaciones anteriores.

---

## 20. Regla final

> El stack debe permitir validar BuscoHuella rápidamente sin sacrificar seguridad, accesibilidad ni una evolución razonable.
