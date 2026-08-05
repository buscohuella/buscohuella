---
id: MVP-IMPLEMENTATION-ROADMAP
title: Roadmap de implementación del MVP
version: 1.3.0
status: Active
owner: Product & Engineering
last_reviewed: 2026-08-05
depends_on:
  - DOCUMENTO_MAESTRO
  - ROADMAP
  - MVP_SCOPE
  - FEATURE_PACK_DEFINITION_OF_DONE
---

# BuscoHuella — Roadmap de implementación del MVP

## 1. Propósito

Este documento define el **orden concreto de construcción** del MVP de BuscoHuella.

No sustituye a:

- `docs/master/DOCUMENTO_MAESTRO.md`, que mantiene la visión y estrategia;
- `docs/product/ROADMAP.md`, que organiza las fases de producto;
- los Feature Packs, que describen cada entrega;
- Notion, que mantiene tareas, fechas, bloqueos y seguimiento diario.

La jerarquía documental es:

```text
Documento Maestro
→ visión, propósito y límites

ROADMAP.md
→ fases de producto

MVP_IMPLEMENTATION_ROADMAP.md
→ secuencia técnica del MVP

FP-XXX.md
→ alcance y criterios de cada entrega

Notion
→ ejecución diaria y estado operativo
```

## 2. Principios de ejecución

Cada bloque seguirá, cuando corresponda, esta secuencia:

```text
reglas y documentación
→ modelo de datos
→ seguridad y RLS
→ dominio compartido
→ acceso a datos
→ interfaz
→ pruebas
→ validación manual
→ documentación
→ commit
```

Reglas:

1. No avanzar con errores de typecheck, lint, tests o build.
2. Mantener migraciones y documentación sincronizadas.
3. No introducir funciones futuras dentro del alcance del MVP.
4. Aplicar accesibilidad básica y preparación i18n desde cada pantalla.
5. Priorizar los flujos que aumentan la probabilidad de reencuentro.
6. No depender de la futura aplicación móvil para validar el núcleo.
7. Mantener cada Feature Pack pequeño, verificable y reversible.

## 3. Leyenda de estado

| Estado | Significado |
|---|---|
| `Completed` | Implementado, validado y publicado |
| `In Progress` | En desarrollo activo |
| `Ready` | Definido y preparado para comenzar |
| `Planned` | Ordenado, pendiente de definición detallada |
| `Blocked` | No puede continuar por una dependencia |
| `Deferred` | Fuera del MVP actual |

## 4. Secuencia del MVP

### FP-001 — App Shell

**Estado:** `Completed`

Incluye:

- estructura web;
- navegación responsive;
- componentes visuales base;
- layout privado;
- rutas iniciales.

### FP-002 — Autenticación

**Estado:** `Completed`

Incluye:

- registro;
- confirmación;
- login y logout;
- recuperación de contraseña;
- Supabase SSR;
- rutas públicas y privadas.

### FP-003 — Perfiles

**Estado:** `Completed`

Incluye:

- perfiles privados y públicos;
- alias;
- municipio;
- biografía;
- privacidad;
- RLS.

Pendientes no bloqueantes:

- avatar;
- preferencias;
- exportación;
- baja de cuenta.

### FP-004 — Dominio y persistencia de mascotas

**Estado:** `Completed`

Incluye:

- reglas del dominio Pet;
- ciclo de vida;
- privacidad;
- especies;
- esquema de base de datos;
- RLS;
- Storage privado;
- migraciones.

### FP-005 — Librerías e integración web de mascotas

**Estado:** `Completed`

Incluye:

- `@buscohuella/pet-domain`;
- `@buscohuella/pet-data`;
- mapeadores;
- repositorio;
- listado;
- alta;
- detalle;
- archivado;
- logging estructurado.

### FP-006 — Fundación i18n y accesibilidad

**Estado:** `Planned — transversal`

No bloquea el CRUD actual.

Para el MVP:

- cimientos técnicos;
- textos fáciles de extraer;
- tokens compatibles con temas;
- accesibilidad básica por pantalla.

Antes del piloto ampliado:

- español y catalán;
- revisión de flujos críticos;
- WCAG 2.2 AA como objetivo.

### FP-007 — Completar CRUD de mascotas

**Estado:** `Completed`

Completado:

- edición;
- separación entre activas y archivadas;
- restauración;
- confirmaciones accesibles;
- mensajes de éxito y error;
- commits funcionales publicados.

Pendientes no bloqueantes:

- aviso de cambios sin guardar, si se prioriza;
- definición de eliminación definitiva;
- decisión sobre historial de cambios.

### FP-008 — Catálogo de razas y cruces

**Estado:** `Completed`

Objetivo:

- catálogo normalizado por especie;
- búsqueda incremental;
- raza principal;
- segunda raza opcional;
- “No conozco la raza”;
- “Mestizo / mezcla desconocida”;
- datos consistentes para filtros e IA futura.

Entregables:

- documentación;
- migración;
- catálogo inicial;
- tipos y validación;
- repositorio;
- selector web;
- actualización de alta y edición.

### FP-009 — Fotografías de mascotas

**Estado:** `Completed`

Completado:

- bucket privado, tabla, límites y políticas RLS;
- dominio y repositorio compartidos;
- subida múltiple secuencial;
- validación real de tipo, firma, tamaño, dimensiones y megapíxeles;
- procesamiento seguro con Sharp;
- orientación automática y eliminación de EXIF/GPS;
- redimensionado y conversión a WebP;
- URLs firmadas;
- galería privada;
- visor ampliado y navegación con teclado;
- cambio de portada;
- edición del texto alternativo;
- eliminación con confirmación;
- portada en el listado de mascotas;
- reordenado accesible y persistente;
- compensación de archivos huérfanos;
- límite de 10 fotografías validado;
- integración responsive y accesible;
- migraciones y Storage validados en Supabase;
- commits `4a49699`, `de6314b` y `165bd2b`.

Pendientes no bloqueantes:

- moderación asistida de contenido;
- detección orientativa de animales;
- generación de variantes o miniaturas dedicadas;
- migración opcional de fotografías antiguas a WebP.

Dependencias satisfechas:

- bucket privado disponible;
- tabla `pet_photos`;
- ficha de mascota estable.
### FP-010 — Dominio y base de datos de reportes

**Estado:** `Completed`

Completado:

- dominio funcional documentado;
- ciclo de vida y transiciones;
- privacidad geográfica y contacto protegido;
- esquema relacional;
- PostGIS;
- tablas `reports`, `report_photos`, `sightings`, `sighting_photos` y `report_events`;
- restricciones e índices;
- RLS;
- auditoría automática;
- proyección pública segura mediante `get_public_reports`;
- bloqueo de dos pérdidas abiertas para una misma mascota;
- paquete `@buscohuella/report-domain`;
- 17 tests de dominio;
- paquete `@buscohuella/report-data`;
- conversión PostGIS ↔ dominio;
- repositorios y mapeadores;
- 13 tests de datos;
- typecheck y build global;
- migración validada en Supabase;
- commits `6c3dbcb`, `1c68990` y `d3013c5`.

Base preparada para:

- web;
- aplicación móvil;
- intranets profesionales;
- mapa;
- notificaciones;
- avistamientos;
- resolución y reencuentros.

Pendientes no bloqueantes:

- roles y membresías de organizaciones;
- moderación y antifraude;
- asignación profesional de casos;
- optimización geográfica con volumen real;
- pruebas de carga antes de expansión.
### Fase de consolidación transversal

**Estado:** `In Progress`

Antes de finalizar la interfaz de FP-011 se activan:

- `FD-001` — arquitectura territorial y geoespacial;
- `FD-002` — i18n, accesibilidad y temas;
- `FP-006` — infraestructura transversal real;
- principios de arquitectura;
- modelo unificado de ubicación;
- diseño inclusivo para flujos de urgencia;
- arquitectura de notificaciones geográficas;
- ADR de malla, privacidad y routing.

Objetivo:

- evitar deuda de traducción;
- evitar rehacer formularios inaccesibles;
- evitar un modelo geográfico limitado a municipio y coordenadas;
- preparar FP-011 para web, móvil e intranets futuras.

### FP-011 — Reportar mascota perdida

**Estado:** `Planned`

Incluye:

- seleccionar mascota;
- fecha y ubicación;
- zona pública segura;
- descripción del incidente;
- fotografías;
- contacto protegido;
- publicación;
- detalle;
- edición y cierre.

### FP-012 — Reportar animal encontrado

**Estado:** `Planned`

Incluye:

- registro sin mascota previa;
- especie y descripción;
- ubicación aproximada;
- evidencias;
- estado de custodia;
- contacto;
- posible conversión o vinculación futura.

### FP-013 — Avistamientos

**Estado:** `Planned`

Incluye:

- añadir avistamiento a un reporte;
- fecha;
- ubicación aproximada;
- notas;
- fotografía opcional;
- historial;
- notificación a la persona responsable.

### FP-014 — Mapa y alternativa geográfica accesible

**Estado:** `Planned`

Incluye:

- reportes públicos;
- filtros;
- marcadores;
- geolocalización;
- radio;
- agrupación;
- detalle;
- listado alternativo accesible;
- protección de ubicaciones sensibles.

### FP-015 — Notificaciones críticas

**Estado:** `Planned`

Incluye:

- eventos esenciales;
- correo;
- preferencias;
- límites;
- avisos de avistamiento;
- cambios de estado;
- prevención de abuso.

Web push se incorporará solo si no retrasa el piloto.

### FP-016 — Resolución y reencuentros

**Estado:** `Planned`

Incluye:

- cerrar reporte;
- marcar reencuentro;
- evidencia opcional;
- historia opcional;
- métricas;
- North Star Metric;
- prevención de cierres falsos.

### FP-017 — Preparación transversal del piloto

**Estado:** `Planned`

Incluye:

- i18n español/catalán;
- revisión accesible de flujos críticos;
- responsive;
- observabilidad;
- manejo de errores;
- privacidad;
- seguridad;
- pruebas end-to-end esenciales;
- analítica responsable.

### FP-018 — Piloto Sabadell

**Estado:** `Planned`

Incluye:

- entorno estable;
- usuarios piloto;
- protectora colaboradora;
- veterinarios y entidades;
- soporte;
- métricas;
- entrevistas;
- incidencias;
- revisión de aprendizaje;
- decisión de siguiente fase.

## 5. Ruta crítica

La ruta mínima para comenzar el piloto es:

```text
FP-007 CRUD mascotas
→ FP-008 razas
→ FP-009 fotografías
→ FP-010 dominio de reportes
→ FP-011 perdidos
→ FP-012 encontrados
→ FP-013 avistamientos
→ FP-014 mapa/listado
→ FP-015 notificaciones esenciales
→ FP-016 reencuentros
→ FP-017 preparación transversal
→ FP-018 piloto
```

## 6. Funcionalidades no bloqueantes

Podrán aplazarse si ponen en riesgo el piloto:

- modo oscuro completo;
- web push avanzada;
- eliminación definitiva desde la interfaz;
- historial visual completo;
- avatar de usuario;
- exportación avanzada;
- QR;
- chat;
- gamificación;
- premium;
- marketplace;
- IA de reconocimiento;
- aplicación móvil.

## 7. Condiciones para cambiar el orden

El orden podrá modificarse únicamente por:

- bloqueo técnico real;
- riesgo de seguridad o privacidad;
- aprendizaje validado con usuarios;
- dependencia externa;
- simplificación necesaria para el piloto;
- cambio aprobado del alcance del MVP.

Todo cambio debe actualizar:

1. este documento;
2. el Feature Pack afectado;
3. Notion;
4. el Documento Maestro o una ADR si altera una decisión estructural.

## 8. Seguimiento

Al cerrar cada Feature Pack se actualizarán:

- estado;
- commits;
- validaciones;
- pendientes no bloqueantes;
- riesgos;
- siguiente entrega.

La revisión mínima será:

```text
al cerrar cada FP
antes de comenzar un nuevo dominio
antes del piloto
trimestralmente
```
