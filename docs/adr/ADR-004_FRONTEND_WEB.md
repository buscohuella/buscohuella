# ADR-004 — Frontend Web del MVP

## BuscoHuella MVP

**Estado:** Aceptado  
**Fecha:** 31 de julio de 2026  
**Decisor:** Xavier Quesada Sevillano — Fundador / Product Owner  
**Ámbito:** Aplicación web, renderizado, UI, accesibilidad y despliegue  
**Revisión prevista:** Después del piloto de Sabadell o ante una limitación técnica demostrable  

---

## 1. Contexto

BuscoHuella necesita una aplicación web que permita validar el producto con rapidez y que funcione correctamente desde dispositivos móviles.

La aplicación debe permitir:

- registro;
- inicio de sesión;
- perfiles;
- mascotas;
- reportes;
- mapa;
- filtros;
- avistamientos;
- fotografías;
- notificaciones web;
- resolución de casos;
- páginas públicas;
- landing;
- lista de espera.

La web será la primera aplicación funcional del MVP.

La estrategia general es:

```text
web-first
mobile-first en diseño
aplicación móvil nativa en una fase posterior
```

---

## 2. Problema

La pregunta principal es:

> ¿Qué tecnología frontend ofrece la mejor combinación de velocidad, mantenibilidad, experiencia móvil, accesibilidad, SEO y evolución futura para el MVP de BuscoHuella?

---

## 3. Restricciones

| Factor | Situación |
|---|---|
| Equipo | Un desarrollador principal |
| Estado | Pre-MVP |
| Presupuesto | Limitado |
| Prioridad | Validar producto |
| Dispositivo principal | Smartphone |
| Backend | Supabase |
| Base de datos | PostgreSQL + PostGIS |
| Mapas | Mapbox |
| Hosting previsto | Vercel |
| Móvil futuro | Expo React Native |
| Accesibilidad | WCAG 2.2 AA |
| Idiomas | ES, CA, EN, EU, GL |

---

## 4. Requisitos del frontend

### 4.1 Funcionales

- autenticación;
- perfiles;
- mascotas;
- reportes;
- avistamientos;
- mapa;
- filtros;
- subida de fotografías;
- estados de caso;
- notificaciones;
- páginas públicas;
- SEO;
- internacionalización.

### 4.2 Técnicos

- TypeScript;
- responsive;
- mobile-first;
- accesibilidad;
- rendimiento;
- componentes reutilizables;
- integración con Supabase;
- integración con Mapbox;
- despliegue simple;
- mantenimiento por un equipo pequeño;
- compatibilidad con una futura aplicación móvil.

---

## 5. Criterios de decisión

Se evaluaron las opciones según:

1. velocidad de desarrollo;
2. curva de aprendizaje;
3. mantenimiento;
4. rendimiento;
5. SEO;
6. accesibilidad;
7. experiencia móvil;
8. integración con Supabase;
9. integración con Vercel;
10. ecosistema;
11. TypeScript;
12. compatibilidad conceptual con React Native;
13. facilidad de despliegue;
14. riesgo técnico.

---

## 6. Alternativas consideradas

### 6.1 Angular

#### Ventajas

- framework completo;
- arquitectura estructurada;
- TypeScript;
- ecosistema empresarial;
- herramientas integradas;
- buenas convenciones.

#### Inconvenientes

- mayor complejidad inicial;
- más código ceremonial;
- menor velocidad para un equipo de una persona;
- menor alineación con React Native;
- mayor coste de migración desde la dirección actual;
- menor integración natural con Vercel;
- menor ventaja para páginas públicas y SEO frente a Next.js.

#### Resultado

Descartado para el MVP.

---

### 6.2 React SPA tradicional

#### Ventajas

- flexibilidad;
- ecosistema amplio;
- TypeScript;
- buena integración con librerías.

#### Inconvenientes

- requiere decidir routing, renderizado, metadatos y estructura;
- SEO menos directo;
- más decisiones de infraestructura;
- despliegue y renderizado menos integrados;
- mayor riesgo de arquitectura inconsistente.

#### Resultado

Descartado frente a Next.js.

---

### 6.3 Next.js

#### Ventajas

- React;
- TypeScript;
- App Router;
- Server Components;
- rutas;
- layouts;
- metadatos;
- SEO;
- renderizado híbrido;
- integración con Vercel;
- comunidad amplia;
- buen soporte para páginas públicas y privadas;
- integración sencilla con Supabase;
- alineación conceptual con React Native;
- soporte para aplicaciones responsive y PWA progresiva.

#### Inconvenientes

- complejidad entre servidor y cliente;
- cambios frecuentes del framework;
- riesgo de usar Client Components en exceso;
- riesgo de acoplamiento a Vercel;
- curva de aprendizaje del App Router;
- necesidad de gestionar caché y renderizado correctamente.

#### Resultado

Seleccionado.

---

### 6.4 Solución híbrida Angular + Next.js

#### Ventajas

- reutilización potencial de trabajo previo;
- transición progresiva.

#### Inconvenientes

- dos frameworks;
- duplicación;
- más dependencias;
- mayor mantenimiento;
- mayor complejidad;
- inconsistencia de UI;
- peor experiencia para un equipo pequeño.

#### Resultado

Descartado.

---

## 7. Decisión

BuscoHuella utilizará:

```text
Next.js
React
TypeScript
App Router
Tailwind CSS
Shadcn UI
Lucide
Framer Motion cuando aporte valor
Vercel
```

La aplicación web se ubicará en:

```text
apps/web/
```

---

## 8. Justificación

Next.js se selecciona porque:

- reduce decisiones de infraestructura;
- ofrece una base web completa;
- soporta páginas públicas y privadas;
- mejora SEO;
- integra rutas, layouts y metadatos;
- facilita despliegue en Vercel;
- utiliza React y TypeScript;
- se integra con Supabase;
- permite una experiencia mobile-first;
- facilita compartir conceptos y tipos con Expo React Native;
- permite iterar rápidamente.

---

## 9. App Router

Se utilizará App Router.

Responsabilidades:

- rutas;
- layouts;
- loading states;
- error boundaries;
- metadatos;
- Server Components;
- Client Components cuando sean necesarios;
- Route Handlers cuando proceda.

No se utilizará Pages Router como arquitectura principal.

---

## 10. Server Components

Se utilizarán por defecto cuando:

- no sea necesaria interacción del cliente;
- se pueda cargar información en servidor;
- mejore rendimiento;
- reduzca JavaScript;
- proteja lógica;
- simplifique composición.

No se utilizarán como dogma.

---

## 11. Client Components

Se utilizarán cuando sea necesaria:

- interacción;
- estado;
- eventos;
- APIs del navegador;
- geolocalización;
- mapas;
- formularios dinámicos;
- hooks de cliente.

Regla:

> Mantener el límite cliente lo más pequeño y claro posible.

No convertir páginas completas en Client Components sin necesidad.

---

## 12. Acceso a Supabase

Se crearán clientes diferenciados para:

- servidor;
- navegador;
- operaciones administrativas protegidas.

Reglas:

- no exponer service role;
- respetar RLS;
- no confiar solo en el cliente;
- validar operaciones sensibles;
- usar Edge Functions cuando proceda;
- evitar consultas duplicadas.

---

## 13. UI

### Tailwind CSS

Se utilizará para:

- estilos;
- responsive;
- estados;
- tokens;
- composición.

### Shadcn UI

Se utilizará como base de componentes accesibles y personalizables.

### Lucide

Se utilizará para iconografía.

### Framer Motion

Se utilizará únicamente cuando:

- mejore comprensión;
- aporte feedback;
- no perjudique rendimiento;
- respete reducción de movimiento.

---

## 14. Diseño mobile-first

La interfaz se diseñará primero para pantallas pequeñas.

Requisitos:

- navegación clara;
- objetivos táctiles adecuados;
- formularios sencillos;
- botones accesibles;
- mapas adaptados;
- textos legibles;
- modales utilizables;
- estados visibles;
- rendimiento en conexiones móviles.

---

## 15. PWA

La aplicación podrá incorporar progresivamente:

- manifest;
- iconos;
- instalación;
- service worker;
- caché;
- notificaciones;
- comportamiento offline limitado.

Una PWA completa no será requisito obligatorio para lanzar la primera versión.

Toda capacidad PWA debe responder a una necesidad validada.

---

## 16. SEO

Las páginas públicas deben considerar:

- metadatos;
- títulos;
- descripciones;
- Open Graph;
- URLs estables;
- sitemap;
- robots;
- datos estructurados cuando proceda;
- contenido accesible.

Los reportes públicos deben proteger información sensible.

---

## 17. Internacionalización

Idiomas previstos:

- español;
- catalán;
- inglés;
- euskera;
- gallego.

La solución i18n concreta se decidirá durante la inicialización técnica.

Debe soportar:

- App Router;
- rutas;
- metadatos;
- fallback;
- pluralización;
- traducciones tipadas cuando sea viable.

---

## 18. Accesibilidad

Objetivo:

```text
WCAG 2.2 nivel AA
```

Requisitos:

- HTML semántico;
- teclado;
- foco visible;
- contraste;
- labels;
- lectores de pantalla;
- mensajes de error;
- reducción de movimiento;
- no depender solo del color;
- alternativas al mapa;
- estados de carga anunciables.

---

## 19. Rendimiento

Prioridades:

- poco JavaScript en cliente;
- imágenes optimizadas;
- carga diferida;
- mapas bajo demanda;
- consultas eficientes;
- componentes pequeños;
- evitar dependencias pesadas;
- Core Web Vitals;
- conexiones móviles;
- caché controlada.

---

## 20. Gestión de estado

Se priorizará:

1. estado del servidor;
2. estado local;
3. parámetros de URL;
4. formularios;
5. contexto solo cuando sea necesario.

No se añadirá una librería global de estado hasta que exista una necesidad real.

---

## 21. Formularios

Los formularios deben:

- ser accesibles;
- validar en cliente;
- validar en servidor;
- mostrar errores claros;
- conservar datos cuando sea posible;
- gestionar carga;
- impedir envíos duplicados;
- no confiar solo en el navegador.

La librería concreta se decidirá al implementar los primeros formularios.

---

## 22. Mapas

Mapbox se integrará como componente de cliente.

Reglas:

- cargar bajo demanda;
- controlar tamaño del bundle;
- gestionar errores;
- permitir alternativa textual;
- proteger coordenadas;
- no ejecutar lógica geográfica crítica únicamente en cliente;
- utilizar PostGIS para consultas espaciales.

---

## 23. Fotografías

La web debe permitir:

- selección;
- cámara cuando sea compatible;
- previsualización;
- validación;
- eliminación;
- compresión cuando proceda;
- subida a Supabase Storage;
- feedback de progreso.

---

## 24. Notificaciones web

Las notificaciones se incorporarán de forma progresiva.

Canales iniciales:

- in-app;
- web cuando sea viable;
- email cuando sea necesario.

No se retrasará el MVP por implementar notificaciones avanzadas.

---

## 25. Testing

Se deberán cubrir:

- componentes críticos;
- formularios;
- autenticación;
- mascotas;
- reportes;
- avistamientos;
- permisos;
- accesibilidad;
- navegación;
- integración con Supabase.

La herramienta concreta se decidirá durante la configuración del proyecto.

---

## 26. Despliegue

La aplicación se desplegará en Vercel.

Flujo previsto:

```text
GitHub
→ GitHub Actions
→ Vercel Preview
→ Producción
```

Se utilizarán:

- previews;
- variables de entorno;
- dominios;
- logs;
- despliegues automáticos.

---

## 27. Consecuencias positivas

- velocidad de desarrollo;
- buena experiencia web;
- SEO;
- TypeScript;
- React;
- despliegue sencillo;
- integración con Supabase;
- integración con Vercel;
- evolución móvil coherente;
- comunidad amplia.

---

## 28. Consecuencias negativas

- dependencia parcial de Next.js;
- dependencia parcial de Vercel;
- complejidad servidor/cliente;
- cambios frecuentes;
- riesgo de sobreusar Client Components;
- necesidad de disciplina con caché;
- curva de aprendizaje.

---

## 29. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---:|---:|---|
| Exceso de JavaScript | Media | Alta | Server Components |
| Mal uso de caché | Media | Media | Reglas y tests |
| Acoplamiento a Vercel | Media | Media | APIs estándar |
| Cambios del framework | Media | Media | Versiones controladas |
| PWA prematura | Media | Media | Implementación gradual |
| Accesibilidad deficiente | Media | Alta | WCAG y pruebas |
| Bundle de Mapbox | Media | Media | Carga diferida |
| Client Components excesivos | Media | Alta | Límites pequeños |

---

## 30. Tecnologías descartadas

No se utilizarán como frontend principal:

- Angular;
- Pages Router;
- SPA React sin framework;
- solución híbrida Angular + Next.js;
- Flutter Web;
- frontend separado para administración en el MVP.

---

## 31. Criterios de revisión futura

Esta decisión se revisará si:

- Next.js impide un requisito crítico;
- el rendimiento no es suficiente;
- Vercel deja de ser viable;
- aparece un coste desproporcionado;
- la aplicación móvil requiere cambios estructurales;
- el equipo crece;
- surge una obligación legal;
- el piloto demuestra nuevos requisitos.

---

## 32. Documentación relacionada

```text
docs/master/DOCUMENTO_MAESTRO.md
docs/adr/ADR-001_STACK_TECNOLOGICO.md
docs/adr/ADR-002_ESTRATEGIA_MOBILE.md
docs/adr/ADR-003_SUPABASE.md
docs/architecture/ARCHITECTURE.md
docs/technical/TECHNOLOGY_STACK.md
docs/frontend/
docs/ux/
AGENTS.md
```

---

## 33. Estado de la decisión

**Aceptado.**

Next.js con App Router será el framework principal de la aplicación web del MVP.

---

## 34. Regla final

> La aplicación web debe permitir validar BuscoHuella rápidamente, con una experiencia móvil accesible y sin convertir la PWA o la infraestructura frontend en un objetivo independiente.
