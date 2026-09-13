# Contribuir a BuscoHuella

Gracias por tu interés en contribuir a BuscoHuella.

Este documento explica cómo preparar cambios, trabajar con Git, mantener la calidad del proyecto y abrir contribuciones coherentes con el alcance actual.

Antes de empezar, revisa:

```text
README.md
AGENTS.md
docs/master/DOCUMENTO_MAESTRO.md
```

Ante cualquier contradicción, prevalece:

```text
docs/master/DOCUMENTO_MAESTRO.md
```

---

## 1. Filosofía de contribución

BuscoHuella se encuentra en fase **Pre-MVP**.

Toda contribución debe priorizar:

- simplicidad;
- seguridad;
- accesibilidad;
- mantenibilidad;
- foco en el MVP;
- bajo coste operativo;
- documentación suficiente;
- evolución incremental;
- cambios pequeños y revisables.

No se deben introducir funcionalidades futuras salvo autorización expresa.

---

## 2. Alcance actual

El MVP incluye:

- autenticación;
- perfiles;
- registro de mascotas;
- reportes de mascotas perdidas;
- reportes de mascotas encontradas;
- mapa;
- filtros;
- avistamientos;
- fotografías;
- notificaciones web;
- resolución de casos;
- landing pública;
- lista de espera.

El MVP no incluye:

- IA de reconocimiento;
- chat;
- pagos;
- suscripciones;
- funciones premium;
- gamificación;
- blockchain;
- tokens;
- GPS propio;
- telemedicina;
- adopciones como módulo principal;
- historiales clínicos completos;
- red social completa;
- integraciones institucionales avanzadas.

---

## 3. Antes de empezar una tarea

Antes de modificar código o documentación:

1. confirma el objetivo;
2. identifica el módulo afectado;
3. revisa `AGENTS.md`;
4. revisa el Documento Maestro;
5. revisa la documentación específica;
6. comprueba si existe una ADR relacionada;
7. revisa el código actual;
8. define criterios de aceptación;
9. identifica riesgos;
10. confirma que la tarea está dentro del MVP.

No empieces a implementar una funcionalidad si los requisitos no están claros.

Aplica la política de eficiencia de contexto, entorno, validación y escalado definida
en [`docs/project/DEVELOPMENT_WORKFLOW.md`](docs/project/DEVELOPMENT_WORKFLOW.md).

---

## 4. Estructura general

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
├── ARCHITECTURE_OVERVIEW.md
└── README.md
```

No crees carpetas nuevas sin una finalidad clara.

---

## 5. Requisitos del entorno

Los requisitos definitivos se irán completando cuando el monorepo quede inicializado.

Base prevista:

- Git;
- Node.js 20 o superior;
- pnpm;
- cuenta de Supabase;
- cuenta de Mapbox;
- cuenta de Vercel;
- editor compatible con TypeScript.

Comprobaciones básicas:

```bash
git --version
node --version
npm --version
pnpm --version
```

---

## 6. Flujo de trabajo Git

`main` es estable y protegido. No se desarrolla directamente sobre `main`; solo
entra trabajo validado mediante Pull Request.

Usa un único laboratorio reutilizable para el trabajo diario, por ejemplo:

```text
D:\Proyectos\buscohuella-dev
```

Reutiliza `node_modules/`, `.env.local` y builds locales. Antes de ejecutar
`pnpm install`, comprueba si el laboratorio ya está preparado. Crea worktrees
adicionales solo para paralelismo real o una necesidad técnica justificada.

Antes de empezar una tarea:

```bash
git fetch origin main
git status --short
git log -1 --oneline
git switch -c tipo/nombre-tarea origin/main
```

La rama debe ser corta, creada desde `origin/main` actualizado y reutilizar la
misma carpeta de laboratorio. El flujo es:

```text
PASS → PR → main → borrar rama → actualizar laboratorio desde main
FAIL → corregir en la misma rama hasta quedar verde
```

Evita ramas largas acumuladas e integraciones intermedias innecesarias.

Ejemplos:

```text
docs/actualizar-stack
feat/registro-mascotas
fix/filtro-distancia
refactor/supabase-client
chore/configurar-eslint
```

---

## 7. Convención de ramas

Usa uno de estos prefijos:

```text
feat/
fix/
docs/
refactor/
test/
chore/
perf/
ci/
```

Ejemplos:

```text
feat/auth-supabase
fix/map-radius-filter
docs/update-architecture
refactor/report-service
test/pet-registration
chore/monorepo-setup
ci/vercel-preview
```

Los nombres deben:

- estar en minúsculas;
- usar guiones;
- ser breves;
- describir una sola tarea.

---

## 8. Commits

Usa Conventional Commits.

Formato:

```text
tipo(alcance): descripción
```

Tipos habituales:

```text
feat
fix
docs
refactor
test
chore
perf
ci
build
```

Ejemplos:

```text
docs(readme): actualizar estado del proyecto
docs(architecture): alinear arquitectura con el MVP actual
feat(auth): implementar inicio de sesión con Supabase
fix(map): corregir filtro por distancia
refactor(reports): simplificar acceso a datos
test(pets): añadir pruebas de registro
chore(deps): actualizar dependencias seguras
```

Cada commit debe:

- tener un propósito único;
- evitar cambios accidentales;
- ser reversible;
- no incluir secretos;
- no mezclar documentación y código sin necesidad;
- no incluir archivos generados irrelevantes.

---

## 9. Antes de hacer commit

Ejecuta siempre:

```bash
git status
git diff
```

Revisa:

- archivos modificados;
- archivos nuevos;
- cambios generados;
- timestamps accidentales;
- reformateos automáticos;
- secretos;
- archivos fuera del alcance.

No uses:

```bash
git add .
```

sin revisar antes el estado del repositorio.

Es preferible:

```bash
git add ruta/del/archivo
```

Antes de modificar cualquier tarea confirma siempre cwd, rama, `git status --short`,
`git log -1 --oneline` y que la base sea el `origin/main` actual. Durante el trabajo
mantén el cambio mínimo, no hagas refactors fuera de alcance, no añadas dependencias
sin justificación, no toques Supabase LIVE, no incluyas secretos y no hagas auto-merge.

---

## 10. Código

### TypeScript

- usa modo estricto;
- evita `any`;
- usa `unknown` cuando corresponda;
- tipa las fronteras;
- usa nombres descriptivos;
- maneja `null` y `undefined`;
- evita tipos excesivamente amplios.

### React

- componentes pequeños;
- hooks reutilizables;
- no abusar de estado global;
- evitar efectos innecesarios;
- evitar memoización prematura;
- separar UI, dominio y acceso a datos.

### General

- funciones breves;
- lógica clara;
- bajo acoplamiento;
- alta cohesión;
- no duplicar;
- no sobreabstraer;
- no introducir dependencias sin justificar.

---

## 11. Seguridad

Toda contribución debe considerar:

- autenticación;
- autorización;
- Row Level Security;
- mínimo privilegio;
- validación en servidor o base de datos;
- secretos fuera del repositorio;
- protección de datos personales;
- ubicaciones sensibles;
- trazabilidad.

Nunca subas:

- `.env.local`;
- tokens;
- contraseñas;
- service role keys;
- claves privadas;
- secretos de Mapbox;
- credenciales de terceros;
- datos reales de usuarios.

---

## 12. Supabase

Toda tabla nueva debe considerar:

- clave primaria;
- timestamps;
- relaciones;
- índices;
- restricciones;
- políticas RLS;
- conservación;
- borrado;
- auditoría cuando corresponda.

Las migraciones deben versionarse.

No toques Supabase LIVE directamente ni edites producción manualmente sin registrar
el cambio. Los cambios de datos deben mantener RLS y validación de permisos/roles.

---

## 13. Accesibilidad

Objetivo:

```text
WCAG 2.2 nivel AA
```

Toda interfaz debe considerar:

- teclado;
- foco visible;
- labels;
- HTML semántico;
- contraste;
- lectores de pantalla;
- mensajes de error;
- estados de carga;
- áreas táctiles;
- `prefers-reduced-motion` cuando aplique;
- alternativas al color;
- alternativas textuales para mapas.

La accesibilidad forma parte de la definición de terminado.

---

## 14. Internacionalización

Idiomas previstos:

- español;
- catalán;
- inglés;
- euskera;
- gallego.

Reglas:

- no incrustar textos si existe i18n;
- usar claves estables;
- evitar concatenaciones;
- contemplar pluralización;
- contemplar diferentes longitudes;
- mantener fallback controlado.

Los textos visibles no se hardcodean. ES y CA son los idiomas actuales y las claves
deben seguir siendo compatibles con EN, EU y GL.

---

## 15. Testing

Toda funcionalidad crítica debe incluir pruebas cuando exista infraestructura para ello.

Prioridades:

1. reglas de dominio;
2. autenticación;
3. permisos;
4. RLS;
5. mascotas;
6. reportes;
7. avistamientos;
8. resolución;
9. geolocalización;
10. accesibilidad.

Tipos:

- unitarias;
- integración;
- end-to-end;
- accesibilidad;
- seguridad;
- regresión.

Después de implementar ejecuta, según corresponda:

```bash
pnpm --filter @buscohuella/web test
pnpm --filter @buscohuella/web lint
pnpm --filter @buscohuella/web typecheck
pnpm --filter @buscohuella/web build
git diff --check
```

Añade validación manual real cuando proceda y revisa seguridad/datos/RLS,
accesibilidad WCAG 2.2 AA, i18n ES/CA, SEO de contenido indexable, responsive/móvil
y estados loading/error/empty. No repitas validaciones completas si no hubo cambios
relevantes.

No confundas los estados `IMPLEMENTED`, `STATICALLY REVIEWED`, `VERIFIED LOCAL`,
`VERIFIED LIVE` y `CLOSED`. Un commit no significa `CLOSED`.

Cada ticket debe tener un ID; referencia ese ID en el commit y el Pull Request cuando
exista, registra la evidencia de tests y deja constancia de los pendientes conocidos.
Notion mantiene el seguimiento operativo y GitHub/docs las instrucciones versionadas.

---

## 16. Documentación

Actualiza documentación cuando cambie:

- arquitectura;
- comportamiento;
- alcance;
- modelo de datos;
- permisos;
- stack;
- integración;
- flujo de usuario;
- requisitos;
- seguridad.

Antes de crear un documento nuevo:

1. busca si ya existe uno relacionado;
2. evita duplicidades;
3. elige la carpeta correcta;
4. enlázalo desde índices si procede.

---

## 17. ADR

Crea o actualiza una ADR cuando cambie una decisión estructural.

Ejemplos:

- stack;
- proveedor;
- estrategia móvil;
- autenticación;
- mapas;
- almacenamiento;
- arquitectura;
- despliegue;
- seguridad.

No cambies una decisión arquitectónica importante únicamente desde código.

---

## 18. Archivos generados

No modifiques manualmente archivos generados cuando exista una herramienta para regenerarlos.

Ejemplo:

```text
docs/project-tree.md
```

No mezcles cambios automáticos de timestamps o contadores con commits no relacionados.

---

## 19. Pull Requests

Todo Pull Request debe incluir:

- objetivo;
- contexto;
- alcance;
- archivos principales;
- pruebas realizadas;
- impacto en seguridad;
- impacto en accesibilidad;
- impacto en datos;
- documentación actualizada;
- capturas si cambia UI;
- riesgos;
- limitaciones;
- tareas pendientes.

Título recomendado:

```text
tipo(alcance): descripción
```

Ejemplo:

```text
feat(pets): añadir registro básico de mascotas
```

---

## 20. Checklist antes de abrir un PR

- [ ] La tarea está dentro del alcance.
- [ ] Se revisó `AGENTS.md`.
- [ ] Se revisó el Documento Maestro.
- [ ] No contradice la arquitectura.
- [ ] No añade funcionalidades futuras.
- [ ] No expone secretos.
- [ ] Respeta seguridad y RLS.
- [ ] Respeta accesibilidad.
- [ ] Respeta i18n.
- [ ] Se ejecutaron las validaciones disponibles.
- [ ] Se actualizaron documentos relacionados.
- [ ] El diff no contiene cambios accidentales.
- [ ] Los commits tienen propósito único.
- [ ] El árbol de trabajo queda limpio.

---

## 21. Trabajo con agentes de IA

Los agentes deben seguir:

```text
AGENTS.md
```

Antes de aceptar cambios generados por IA:

- revisar el diff;
- validar requisitos;
- comprobar seguridad;
- comprobar accesibilidad;
- comprobar dependencias;
- ejecutar tests;
- comprobar documentación;
- verificar que no inventó requisitos.

La IA puede proponer cambios, pero no sustituye la revisión humana.

---

## 22. Código de conducta

Se espera una colaboración:

- respetuosa;
- constructiva;
- inclusiva;
- profesional;
- orientada a resolver problemas;
- sensible al propósito social del proyecto.

No se toleran:

- acoso;
- discriminación;
- ataques personales;
- divulgación de información privada;
- comportamiento hostil;
- uso irresponsable de datos sensibles.

---

## 23. Regla final

Cuando exista duda:

1. no inventes;
2. no amplíes alcance;
3. consulta documentación;
4. explica la incertidumbre;
5. solicita revisión.

> Los cambios pequeños, claros, seguros y trazables son preferibles a las soluciones grandes y prematuras.
