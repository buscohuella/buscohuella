# AGENTS.md

## 1. Propósito

Este documento define cómo deben trabajar los agentes de IA, asistentes de código y colaboradores automatizados dentro del repositorio de BuscoHuella.

Su objetivo es evitar decisiones contradictorias, cambios fuera de alcance, sobreingeniería, duplicidades documentales y modificaciones que no respeten la arquitectura, la seguridad o las prioridades del proyecto.

Estas reglas se aplican a todo el repositorio salvo que exista un `AGENTS.md` más específico dentro de una subcarpeta.

---

## 2. Fuente única de verdad

La fuente única de verdad del proyecto es:

```text
docs/master/DOCUMENTO_MAESTRO.md
```

Ante cualquier contradicción entre:

- código;
- README;
- roadmap;
- ADR;
- documentos secundarios;
- conversaciones;
- comentarios;
- tareas;
- sugerencias de una IA;

prevalece siempre `docs/master/DOCUMENTO_MAESTRO.md`.

Un agente no debe corregir, reinterpretar ni sustituir silenciosamente una decisión del Documento Maestro.

Si detecta una contradicción, debe:

1. señalarla;
2. identificar los archivos afectados;
3. proponer una solución;
4. esperar autorización antes de modificar decisiones estructurales.

---

## 3. Contexto del proyecto

BuscoHuella es una plataforma digital colaborativa para ayudar a localizar mascotas perdidas, comunicar avistamientos y facilitar la coordinación entre propietarios, ciudadanía, protectoras, profesionales y administraciones.

Estado actual:

- fase Pre-MVP;
- desarrollo activo;
- piloto inicial previsto en Sabadell;
- lista de espera de más de 170 personas;
- enfoque web-first para el MVP;
- aplicación móvil prevista para una fase posterior.

North Star Metric:

> Número de mascotas reunidas con sus familias gracias a BuscoHuella.

---

## 4. Principios de trabajo

Todo agente debe seguir estos principios:

1. Documentación antes que implementación.
2. Simplicidad antes que complejidad.
3. MVP antes que expansión.
4. Seguridad y privacidad desde el diseño.
5. Accesibilidad desde el diseño.
6. No inventar requisitos.
7. No añadir funcionalidades fuera de alcance.
8. No introducir dependencias innecesarias.
9. No modificar arquitectura sin justificarlo.
10. No duplicar documentación existente.
11. No ocultar errores ni suposiciones.
12. Mantener trazabilidad de las decisiones.

---

## 5. Alcance del MVP

El MVP incluye:

- registro e inicio de sesión;
- perfil básico de usuario;
- registro de mascotas;
- publicación de mascotas perdidas;
- publicación de mascotas encontradas;
- mapa interactivo;
- feed o listado de reportes;
- filtros básicos;
- página de detalle;
- publicación de avistamientos;
- fotografías;
- ubicación aproximada;
- notificaciones web;
- gestión del estado del caso;
- marcado de casos como resueltos;
- landing pública;
- lista de espera.

El MVP no incluye:

- reconocimiento visual con IA;
- chat interno;
- gamificación;
- pagos;
- suscripciones;
- funciones premium;
- blockchain;
- tokens;
- GPS propio;
- telemedicina;
- red social completa;
- integraciones institucionales complejas;
- automatizaciones avanzadas;
- expansión nacional.

Un agente no debe implementar elementos fuera del MVP salvo autorización explícita.

---

## 6. Stack tecnológico obligatorio

### Web

- Next.js
- TypeScript
- App Router
- Tailwind CSS
- Shadcn UI
- Lucide
- Framer Motion cuando aporte valor real
- Vercel

### Móvil

- Expo
- React Native
- TypeScript
- Expo Router

### Backend

- Supabase
- PostgreSQL
- PostGIS
- Supabase Auth
- Supabase Storage
- Supabase Realtime
- Supabase Edge Functions cuando proceda

### Mapas

- Mapbox

### Infraestructura y flujo

- Git
- GitHub
- GitHub Actions
- Vercel
- Supabase

---

## 7. Tecnologías no vigentes

No se deben reintroducir como stack principal:

- Symfony;
- Angular;
- PHP;
- API Platform;
- Doctrine ORM;
- MinIO;
- Redis como dependencia obligatoria del MVP;
- Leaflet como tecnología principal de mapas;
- OpenStreetMap como proveedor principal;
- autenticación JWT propia;
- backend monolítico separado sin justificación.

Si algún documento todavía menciona estas tecnologías, debe considerarse potencialmente desactualizado y contrastarse con:

```text
docs/master/DOCUMENTO_MAESTRO.md
docs/adr/
docs/technical/TECHNOLOGY_STACK.md
```

---

## 8. Orden de lectura obligatorio

Antes de realizar una tarea, el agente debe leer únicamente lo necesario, en este orden:

1. `AGENTS.md`
2. `README.md`
3. `docs/master/DOCUMENTO_MAESTRO.md`
4. Documento específico del área afectada
5. ADR relacionados
6. Código existente del módulo
7. Tests existentes

Ejemplos:

### Base de datos

```text
docs/database/
docs/domain/
docs/security/
docs/identity/
```

### Web

```text
docs/frontend/
docs/ux/
docs/technical/
```

### Móvil

```text
docs/mobile/
docs/ux/
```

### Mapas

```text
docs/maps/
docs/search/
docs/domain/LOCATION_DOMAIN.md
```

### Seguridad

```text
docs/security/
docs/data/
docs/legal/
docs/identity/
```

El agente no debe leer todo el repositorio si la tarea es pequeña.

---

## 9. Reglas para modificar código

Antes de escribir código:

1. confirmar el objetivo;
2. identificar el módulo afectado;
3. revisar documentación específica;
4. revisar implementación existente;
5. comprobar que la tarea está dentro del MVP;
6. definir criterios de aceptación;
7. identificar riesgos de seguridad;
8. identificar impacto en accesibilidad;
9. identificar impacto en datos;
10. proponer el cambio mínimo necesario.

Durante la implementación:

- usar TypeScript estricto;
- evitar `any` salvo justificación;
- mantener funciones pequeñas;
- preferir composición;
- evitar lógica duplicada;
- reutilizar componentes existentes;
- mantener separación entre UI, dominio y acceso a datos;
- no exponer secretos;
- no confiar en validación solo del cliente;
- gestionar estados de carga, vacío y error;
- no bloquear la interfaz innecesariamente;
- mantener textos preparados para internacionalización.

Después de implementar:

- ejecutar lint;
- ejecutar typecheck;
- ejecutar tests;
- revisar accesibilidad;
- revisar seguridad;
- actualizar documentación si cambia comportamiento;
- resumir archivos modificados;
- indicar validaciones realizadas;
- declarar cualquier limitación pendiente.

---

## 10. Reglas de arquitectura

El proyecto debe priorizar:

- arquitectura simple;
- bajo acoplamiento;
- alta cohesión;
- capas claras;
- componentes reutilizables;
- contratos tipados;
- seguridad por defecto;
- evolución incremental;
- observabilidad suficiente;
- mínimo coste operativo para el MVP.

No se debe:

- crear microservicios prematuramente;
- introducir colas, buses o cachés sin necesidad real;
- añadir abstracciones sin uso inmediato;
- duplicar lógica entre web y móvil;
- mezclar acceso a datos con presentación;
- usar el cliente como única barrera de seguridad;
- crear tablas sin definir RLS;
- almacenar datos sensibles sin justificarlo;
- introducir dependencias por conveniencia menor.

Las decisiones estructurales importantes deben documentarse mediante ADR.

---

## 11. Reglas de Supabase

Toda tabla nueva debe incluir, cuando aplique:

- clave primaria;
- timestamps;
- relación con propietario o actor;
- índices necesarios;
- restricciones;
- políticas RLS;
- estrategia de borrado;
- política de conservación;
- auditoría si es crítica.

Nunca asumir que una tabla es segura por defecto.

Toda operación sensible debe validarse en servidor o mediante políticas de base de datos.

No incluir:

- claves privadas;
- service role key;
- secretos;
- tokens;
- credenciales;
- datos reales de usuarios;

en archivos versionados.

---

## 12. Seguridad y privacidad

El agente debe respetar:

- RGPD;
- LOPDGDD;
- minimización de datos;
- limitación de finalidad;
- privacidad por defecto;
- conservación limitada;
- control de acceso;
- trazabilidad;
- eliminación segura.

Especial atención a:

- ubicación de usuarios;
- ubicación de mascotas;
- teléfonos;
- correos;
- fotografías;
- datos de menores;
- datos de protectoras;
- información policial o municipal.

Las ubicaciones sensibles deben mostrarse de forma aproximada cuando corresponda.

No registrar secretos ni datos personales en logs.

---

## 13. Accesibilidad

Toda interfaz debe aspirar a WCAG 2.2 AA.

Requisitos mínimos:

- contraste suficiente;
- navegación por teclado;
- foco visible;
- labels accesibles;
- uso correcto de HTML semántico;
- mensajes de error comprensibles;
- alternativas textuales;
- no depender solo del color;
- áreas táctiles adecuadas;
- estados de carga anunciables;
- formularios con ayuda clara;
- soporte para lectores de pantalla.

Un agente no debe considerar una pantalla terminada si solo funciona visualmente.

---

## 14. Internacionalización

Idiomas previstos:

- español;
- catalán;
- inglés;
- euskera;
- gallego.

Reglas:

- no incrustar textos visibles directamente en componentes cuando exista sistema i18n;
- usar claves estables;
- evitar concatenaciones difíciles de traducir;
- considerar pluralización;
- considerar longitud variable;
- no asumir que todos los idiomas ocupan el mismo espacio.

El español es el idioma principal inicial.

---

## 15. Convenciones de código

### TypeScript

- nombres descriptivos;
- tipos explícitos en fronteras;
- evitar tipos demasiado amplios;
- preferir `unknown` frente a `any`;
- usar enums solo cuando aporten valor;
- preferir uniones literales para estados simples;
- manejar correctamente `null` y `undefined`.

### React

- componentes pequeños;
- lógica reutilizable en hooks;
- no abusar de estado global;
- evitar efectos innecesarios;
- separar componentes de presentación y lógica cuando mejore claridad;
- no usar memoización prematura.

### Archivos

- nombres en `kebab-case` salvo convención del framework;
- componentes React en `PascalCase`;
- variables y funciones en `camelCase`;
- constantes globales en `UPPER_SNAKE_CASE`;
- tipos e interfaces en `PascalCase`.

---

## 16. Dependencias

Antes de añadir una dependencia:

1. comprobar si el stack actual ya resuelve la necesidad;
2. evaluar mantenimiento;
3. evaluar tamaño;
4. evaluar seguridad;
5. evaluar compatibilidad;
6. justificarla en el cambio;
7. evitar duplicidad funcional.

No añadir dependencias sin uso inmediato.

No usar paquetes abandonados o sin mantenimiento razonable.

---

## 17. Tests y calidad

Toda funcionalidad crítica debe tener pruebas.

Prioridades:

1. lógica de dominio;
2. permisos y seguridad;
3. flujos de reporte;
4. gestión de mascotas;
5. avistamientos;
6. resolución de casos;
7. filtros;
8. componentes críticos;
9. integraciones.

Tipos de prueba:

- unitarias;
- integración;
- end-to-end cuando corresponda;
- accesibilidad;
- seguridad;
- regresión.

No afirmar que una tarea está terminada si no se han ejecutado las validaciones disponibles.

---

## 18. Documentación

No crear documentos nuevos si uno existente puede actualizarse.

Antes de crear documentación:

1. buscar documentos relacionados;
2. comprobar duplicidades;
3. definir propósito;
4. definir ubicación correcta;
5. enlazarlo desde índices si corresponde.

Ubicaciones principales:

```text
docs/master/
docs/product/
docs/architecture/
docs/adr/
docs/database/
docs/domain/
docs/security/
docs/legal/
docs/ux/
docs/technical/
```

Toda decisión importante debe quedar registrada.

---

## 19. Git, main y laboratorio

`main` es la rama estable y protegida. No se desarrolla directamente sobre `main`.
Solo entra trabajo validado mediante una integración controlada.

Para el desarrollo diario se utiliza este único laboratorio permanente:

```text
D:\Proyectos\buscohuella-dev
rama: lab/dev
```

El laboratorio conserva `node_modules/`, `.env.local` y builds locales cuando sea
seguro hacerlo. Antes de ejecutar `pnpm install`, comprueba si el entorno ya está
preparado. No se crea una rama ni un worktree por cada ticket salvo necesidad técnica
real explícitamente autorizada.

El flujo vigente es:

```text
main estable y alineado con origin/main
        ↓
trabajo y validación en lab/dev
        ↓
tests y revisión
        ↓
integración controlada en main
        ↓
push
        ↓
realinear lab/dev con origin/main
```

---

## 20. Commits

Usar Conventional Commits.

Ejemplos:

```text
docs(readme): actualizar README al Documento Maestro v3.1
docs(agents): añadir reglas para agentes de IA
feat(auth): implementar inicio de sesión con Supabase
fix(map): corregir filtro por distancia
refactor(reports): simplificar servicio de reportes
test(pets): añadir pruebas de registro de mascotas
chore(deps): actualizar dependencias seguras
```

Cada commit debe:

- tener un propósito claro;
- evitar mezclar tareas;
- ser reversible;
- no incluir archivos accidentales;
- no incluir secretos;
- no incluir artefactos generados innecesarios.

---

## 21. Pull Requests

Todo PR debe incluir:

- objetivo;
- contexto;
- archivos principales;
- pruebas realizadas;
- impacto en seguridad;
- impacto en accesibilidad;
- impacto en datos;
- documentación actualizada;
- capturas si cambia UI;
- riesgos conocidos;
- tareas pendientes.

Un agente no debe aprobar su propio trabajo sin revisión crítica.

---

## 22. Archivos generados

No modificar manualmente archivos generados si existe una herramienta para regenerarlos.

Ejemplo:

```text
docs/project-tree.md
```

Si se actualiza automáticamente, debe hacerse mediante la herramienta correspondiente.

No incluir cambios de timestamp o regeneraciones accidentales dentro de commits no relacionados.

---

## 23. Qué no debe hacer un agente

Un agente no debe:

- inventar requisitos;
- asumir permisos;
- modificar `main` sin autorización;
- introducir funcionalidades futuras;
- cambiar stack sin ADR;
- borrar documentación sin revisar referencias;
- mover archivos masivamente sin plan;
- crear carpetas vacías sin propósito;
- generar skills vacías;
- añadir dependencias innecesarias;
- ocultar errores;
- declarar éxito sin validación;
- exponer secretos;
- subir datos personales;
- modificar archivos fuera del alcance;
- reformatear todo el repositorio por una tarea pequeña;
- reescribir código estable sin necesidad;
- crear abstracciones prematuras;
- implementar pagos, IA o chat en el MVP sin autorización.

---

## 24. Skills compartidas del proyecto

Las skills compartidas del proyecto se ubicarán en:

```text
.agents/skills/
```

Cada skill debe tener:

```text
.agents/skills/<skill-name>/SKILL.md
```

No se deben crear skills vacías.

Una skill solo debe añadirse cuando exista un procedimiento repetitivo y bien definido.

Ejemplos futuros:

```text
.agents/skills/buscohuella-docs/SKILL.md
.agents/skills/buscohuella-feature/SKILL.md
.agents/skills/buscohuella-review/SKILL.md
```

Las skills no sustituyen a este archivo.

`AGENTS.md` define reglas permanentes.

Las skills definen procedimientos reutilizables y no deben duplicar `AGENTS.md`.

---

## 25. Flujo de trabajo obligatorio

Para cada tarea:

```text
Antes: cwd → rama → git status --short → git log -1 --oneline → origin/main actual
→ Comprender alcance y documentación necesaria
→ Trabajar en lab/dev con el cambio mínimo, sin refactors ajenos
→ Tests, validación y revisión
→ Documentar y registrar evidencia
→ Integración controlada en main → push
→ Realinear lab/dev con origin/main
```

Antes de modificar:

- confirmar cwd, rama, `git status --short`, `git log -1 --oneline` y la base `origin/main` actualizada;
- confirmar que el trabajo se realiza en `D:\Proyectos\buscohuella-dev` sobre `lab/dev`;
- no cambiar de rama con trabajo local sin revisar su estado;
- no crear una rama ni un worktree por ticket salvo necesidad técnica real explícitamente autorizada;
- no tocar Supabase LIVE ni secretos;
- no hacer auto-merge.

Durante:

- mantener el cambio mínimo y dentro del ticket;
- no añadir dependencias sin justificación;
- validar permisos, roles, datos y RLS cuando aplique;
- respetar arquitectura, i18n y accesibilidad existentes.

Después:

- ejecutar tests relevantes, lint, typecheck, `git diff --check` y build cuando aplique;
- realizar validación manual real cuando corresponda;
- revisar WCAG 2.2 AA, responsive/móvil, estados loading/error/empty, i18n y SEO si afectan al cambio;
- registrar evidencia y pendientes conocidos.

No vuelvas a leer todo el repositorio para una tarea pequeña, no reinstales dependencias
si el laboratorio ya está preparado y no repitas validaciones completas si no hubo
cambios relevantes.

### Política de eficiencia

La eficiencia de contexto, ejecución y razonamiento reduce tiempo y trabajo repetido
sin rebajar la calidad ni la seguridad.

#### Contexto

Para una tarea pequeña se lee solo lo necesario, en este orden preferido:

```text
AGENTS.md → documento específico → archivos afectados → tests relacionados
```

Amplía el contexto únicamente cuando aparezca una dependencia real. Reutiliza las
decisiones ya documentadas en lugar de investigarlas de nuevo.

#### Entorno y ejecución

- no ejecutes `pnpm install` si `node_modules/` ya está preparado;
- no reconstruyas paquetes que no estén afectados;
- reutiliza el laboratorio único, `.env.local` y builds existentes;
- no crees worktrees adicionales salvo necesidad justificada;
- no levantes Docker/Supabase local si la tarea no lo requiere.

#### Validación proporcional

- ejecuta primero los tests específicos del área afectada;
- ejecuta validaciones globales cuando el riesgo o la integración lo justifique;
- no repitas suites completas si no hubo cambios relevantes desde la última validación;
- cualquier cambio posterior a una validación invalida esa validación y obliga a repetir
  la parte afectada.

#### Escalado de razonamiento/modelo

La documentación no depende de nombres concretos de modelos. Usa el menor nivel
suficiente y escala cuando aumenten el riesgo o la incertidumbre:

| Nivel | Casos orientativos |
| --- | --- |
| Ligero | documentación, i18n simple, CSS pequeño, cambios mecánicos, Git, renombrados y tareas repetitivas |
| Medio | componentes, bugs normales, formularios, lógica acotada, tests e integración entre módulos |
| Alto | seguridad, Auth, Supabase/RLS, migraciones, datos, permisos/roles, arquitectura, concurrencia, trade-offs importantes y bugs difíciles o no entendidos |

#### Salidas

- comunica resultados concisos;
- no pegues logs completos si basta con resultado y error relevante;
- resume archivos modificados, tests PASS/FAIL y pendientes;
- no repitas contexto ya conocido innecesariamente.

La eficiencia nunca elimina seguridad, privacidad, accesibilidad, i18n, tests
necesarios, validación de datos ni trazabilidad.

---

## 26. Checklist final

Antes de finalizar una tarea, comprobar:

- [ ] La tarea está dentro del alcance.
- [ ] Se leyó la documentación necesaria.
- [ ] No contradice el Documento Maestro.
- [ ] No añade funcionalidad fuera del MVP.
- [ ] No introduce dependencias innecesarias.
- [ ] No expone secretos.
- [ ] Respeta RLS y permisos.
- [ ] Respeta accesibilidad.
- [ ] Respeta internacionalización.
- [ ] Se ejecutaron las validaciones disponibles.
- [ ] Se actualizaron documentos relacionados.
- [ ] El diff no contiene cambios accidentales.
- [ ] El commit tiene un propósito único.
- [ ] Se declararon limitaciones o riesgos pendientes.

La entrega debe distinguir explícitamente estos estados:

```text
IMPLEMENTED
STATICALLY REVIEWED
VERIFIED LOCAL
VERIFIED LIVE
CLOSED
```

Un commit no implica `CLOSED`. `VERIFIED LIVE` requiere evidencia explícita en el
entorno correspondiente y nunca se asume por haber pasado tests locales.

La i18n no debe hardcodear textos visibles: se mantienen ES/CA y se prepara la
compatibilidad futura con EN/EU/GL, revisando longitud y pluralización cuando proceda.

La accesibilidad incluye teclado, foco visible, lector de pantalla, contraste,
targets táctiles, `prefers-reduced-motion` cuando aplique y no depender solo del color.

La seguridad exige no tocar LIVE directamente, versionar migraciones, mantener RLS
para cambios de datos, validar permisos/roles y no exponer secretos.

Cada ticket debe tener ID; commit y PR deben referenciarlo cuando exista. GitHub/docs
son las instrucciones versionadas y Notion el seguimiento operativo.

---

## 27. Regla final

Cuando exista duda:

1. no inventar;
2. no asumir;
3. no ampliar alcance;
4. consultar la documentación;
5. explicar la incertidumbre;
6. pedir autorización.

> Simplicidad, seguridad, trazabilidad y foco en el MVP.
