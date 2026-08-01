# BuscoHuella — Development Workflow

> Flujo oficial de desarrollo, documentación y seguimiento del proyecto BuscoHuella.

## 1. Propósito

Este documento define cómo se planifican, implementan, validan, documentan y entregan los cambios en BuscoHuella.

Su objetivo es garantizar:

- trazabilidad entre producto, código y documentación;
- cambios pequeños y revisables;
- una fuente de verdad técnica en GitHub;
- una fuente de verdad operativa en Notion;
- calidad consistente;
- menor deuda técnica y documental;
- incorporación sencilla de nuevas personas o agentes de IA.

Este flujo es aplicable a:

- desarrollo frontend;
- backend;
- base de datos;
- infraestructura;
- diseño;
- documentación;
- seguridad;
- integraciones;
- correcciones;
- refactorizaciones.

---

## 2. Fuentes de verdad

### GitHub

GitHub es la fuente técnica de verdad.

Debe contener:

- código;
- arquitectura;
- ADR;
- contratos;
- esquemas;
- configuración;
- tests;
- documentación técnica;
- historial de cambios;
- issues y pull requests cuando se utilicen.

### Notion

Notion es la fuente operativa de verdad.

Debe contener:

- roadmap;
- fases;
- sprints;
- tareas;
- prioridades;
- responsables;
- bloqueos;
- riesgos;
- decisiones operativas;
- seguimiento de releases;
- coordinación del piloto.

### Regla de sincronización

```text
Una decisión operativa que afecte al producto o la arquitectura
→ debe reflejarse en GitHub.

Un cambio técnico que afecte al alcance, prioridad o calendario
→ debe reflejarse en Notion.
```

Slack, correo o conversaciones informales no sustituyen a GitHub ni Notion.

---

## 3. Ciclo obligatorio de trabajo

Todo bloque de trabajo sigue este ciclo:

```text
1. Diseñar
2. Implementar
3. Probar
4. Documentar
5. Revisar
6. Commit
7. Push
8. Actualizar Notion
```

### 3.1 Diseñar

Antes de escribir código se define:

- problema;
- objetivo;
- alcance;
- fuera de alcance;
- archivos afectados;
- dependencias;
- riesgos;
- criterios de aceptación;
- documentación afectada.

### 3.2 Implementar

La implementación debe:

- seguir la arquitectura vigente;
- reutilizar componentes y utilidades existentes;
- evitar duplicación;
- mantener tipado estricto;
- respetar accesibilidad;
- limitarse al alcance aprobado.

### 3.3 Probar

Cada cambio debe superar las validaciones aplicables.

Para la aplicación web:

```powershell
pnpm --filter @buscohuella/web lint
pnpm --filter @buscohuella/web build
```

Cuando existan tests:

```powershell
pnpm --filter @buscohuella/web test
```

También se revisa manualmente:

- comportamiento esperado;
- responsive;
- teclado;
- foco;
- errores;
- estados vacíos;
- carga;
- permisos;
- traducciones.

### 3.4 Documentar

Se actualiza la documentación cuando cambie:

- arquitectura;
- comportamiento;
- instalación;
- modelo de datos;
- componentes;
- seguridad;
- permisos;
- APIs;
- alcance;
- decisiones;
- proceso operativo.

No todo cambio requiere un documento nuevo.

### 3.5 Revisar

Antes del commit:

```powershell
git status
git diff
git diff --cached
```

Se comprueba:

- que no entren archivos generados;
- que no entren secretos;
- que no entren cambios accidentales;
- que el commit tenga un único propósito;
- que la documentación corresponda con el código.

### 3.6 Commit

El commit debe ser:

- pequeño;
- coherente;
- descriptivo;
- reversible;
- validado.

Formato recomendado:

```text
tipo(área): descripción
```

Ejemplos:

```text
feat(web): crear app shell responsive
fix(auth): corregir redirección tras iniciar sesión
docs(design): documentar navegación móvil
refactor(map): separar controles del mapa
test(pets): añadir validaciones del formulario
chore(monorepo): actualizar configuración del workspace
```

### 3.7 Push

Después del commit:

```powershell
git push origin main
git status
```

El estado final debe ser:

```text
nothing to commit, working tree clean
```

### 3.8 Actualizar Notion

Al cerrar un bloque se actualiza:

- estado;
- progreso;
- resultado;
- bloqueos;
- siguiente acción;
- enlace a commit, PR o release cuando proceda.

---

## 4. Feature Packs

Un Feature Pack es una unidad de entrega funcional y documentada.

No es simplemente una carpeta ni un commit.

Cada Feature Pack representa un bloque coherente de producto o infraestructura.

Ejemplos:

```text
FP-001 — App Shell
FP-002 — Autenticación
FP-003 — Navegación
FP-004 — Dashboard
FP-005 — Mapa
FP-006 — Reportes
FP-007 — Mascotas
FP-008 — Avistamientos
FP-009 — Perfil
FP-010 — Notificaciones
```

La numeración es secuencial y no se reutiliza.

---

## 5. Contenido mínimo de un Feature Pack

Cada Feature Pack debe definir:

### Identificación

```text
ID:
Nombre:
Estado:
Responsable:
Fecha de inicio:
Fecha de cierre:
```

### Objetivo

Qué problema resuelve y qué resultado debe producir.

### Alcance

Qué incluye.

### Fuera de alcance

Qué no se implementará en ese bloque.

### Dependencias

Qué componentes, servicios o decisiones necesita.

### Entregables

Ejemplo:

```text
- componentes;
- rutas;
- validaciones;
- tests;
- documentación;
- configuración;
- migraciones;
```

### Criterios de aceptación

Condiciones objetivas que deben cumplirse.

### Riesgos

Problemas previsibles, limitaciones o decisiones pendientes.

### Validación

Comandos, pruebas manuales y evidencias.

### Documentación afectada

Archivos que deben revisarse.

### Registro operativo

Estado y resultado en Notion.

---

## 6. Estados de un Feature Pack

Estados oficiales:

```text
Propuesto
Planificado
En curso
Bloqueado
En revisión
Completado
Cancelado
```

### Propuesto

Existe la idea, pero no está priorizada.

### Planificado

Tiene alcance y prioridad definidos.

### En curso

Se está implementando.

### Bloqueado

No puede avanzar por una dependencia o impedimento.

### En revisión

La implementación ha terminado y está siendo validada.

### Completado

Cumple los criterios de finalización.

### Cancelado

Se ha descartado. Debe registrarse el motivo.

---

## 7. Criterio de finalización

Un Feature Pack no está completado hasta que:

- cumple el alcance;
- pasa lint;
- compila;
- pasa tests aplicables;
- funciona manualmente;
- contempla responsive;
- contempla accesibilidad;
- no incluye secretos;
- no introduce errores conocidos sin registrar;
- actualiza documentación;
- tiene commit y push;
- deja el árbol limpio;
- actualiza Notion.

Este conjunto constituye la Definition of Done de BuscoHuella.

---

## 8. Cambios pequeños dentro de un Feature Pack

Un Feature Pack puede dividirse en varios commits.

Ejemplo:

```text
FP-001 — App Shell

1. feat(web): crear estructura del app shell
2. feat(web): añadir navegación móvil
3. feat(web): añadir sidebar de escritorio
4. docs(frontend): documentar app shell
```

Cada commit debe seguir siendo válido y revisable.

No es obligatorio incluir el identificador del Feature Pack en el mensaje del commit, pero puede añadirse en la descripción, PR o Notion.

---

## 9. Bugs

Los errores deben clasificarse.

### Severidad

```text
Crítica
Alta
Media
Baja
```

### Prioridad

```text
P0
P1
P2
P3
```

### Registro mínimo

```text
Título
Entorno
Pasos para reproducir
Resultado esperado
Resultado real
Evidencia
Severidad
Prioridad
Versión
Estado
```

Un bug no debe resolverse modificando alcance de forma silenciosa.

Si la corrección cambia arquitectura o comportamiento documentado, debe actualizarse la documentación correspondiente.

---

## 10. Deuda técnica

La deuda técnica debe registrarse cuando:

- se acepta una solución temporal;
- se omite un test;
- se pospone una refactorización;
- se introduce una duplicación conocida;
- se mantiene una dependencia obsoleta;
- existe una limitación de rendimiento;
- falta documentación importante.

Cada deuda debe incluir:

```text
Motivo
Impacto
Riesgo
Solución propuesta
Prioridad
Momento recomendado
```

No se permite usar “más adelante” sin dejar registro.

---

## 11. Cambios de alcance

Cuando una nueva idea aparece durante la implementación:

1. se detiene su inclusión automática;
2. se evalúa si pertenece al MVP;
3. se registra en Notion;
4. se revisa el Documento Maestro;
5. se decide si:
   - entra en el Feature Pack;
   - se crea otro Feature Pack;
   - se añade al backlog;
   - se descarta.

Esto evita el crecimiento descontrolado del alcance.

---

## 12. ADR

Se crea o actualiza un ADR cuando una decisión:

- afecta a varias áreas;
- cambia una tecnología principal;
- introduce una dependencia estructural;
- modifica el modelo de datos;
- cambia autenticación o seguridad;
- cambia la arquitectura de despliegue;
- resulta difícil de revertir;
- necesita contexto futuro.

No se crea un ADR para cambios triviales de implementación.

---

## 13. Documentación por tipo de cambio

### Diseño visual

Revisar:

```text
docs/ux/DESIGN_SYSTEM.md
docs/frontend/COMPONENT_GUIDELINES.md
docs/ux/ACCESSIBILITY.md
```

### Arquitectura

Revisar:

```text
ARCHITECTURE_OVERVIEW.md
docs/architecture/ARCHITECTURE.md
docs/adr/
```

### Producto y alcance

Revisar:

```text
docs/master/DOCUMENTO_MAESTRO.md
docs/product/MVP_SCOPE.md
docs/product/ROADMAP.md
```

### Base de datos

Revisar:

```text
docs/database/DATABASE_SCHEMA.md
docs/database/
```

### Seguridad

Revisar:

```text
docs/security/
docs/legal/
```

### Instalación y desarrollo

Revisar:

```text
README.md
CONTRIBUTING.md
docs/devops/
```

---

## 14. Comentarios en código

Los comentarios deben explicar:

- por qué existe una decisión;
- una limitación externa;
- una regla no evidente;
- una excepción;
- un riesgo;
- un comportamiento deliberado.

No deben repetir lo que el código ya expresa.

Correcto:

```ts
// Evita que el botón envíe accidentalmente el formulario.
type = 'button';
```

Evitar:

```ts
// Establece el tipo a button.
type = 'button';
```

---

## 15. Seguridad

Nunca se debe incluir en Git:

- contraseñas;
- tokens;
- claves privadas;
- service role keys;
- secretos de producción;
- datos personales reales;
- archivos `.env` con credenciales.

Antes del commit:

```powershell
git diff --cached
```

Los secretos deben gestionarse mediante variables de entorno y proveedores autorizados.

---

## 16. Archivos generados

No deben incluirse salvo decisión explícita:

```text
node_modules/
.next/
dist/
coverage/
archivos temporales
logs
cachés
```

Los lockfiles sí deben versionarse cuando cambien dependencias.

---

## 17. Ramas y Pull Requests

Durante la fase inicial y con un único desarrollador se permite trabajar en `main` con:

- cambios pequeños;
- validaciones previas;
- commits frecuentes;
- árbol limpio.

Cuando aumente el equipo o el riesgo, se utilizarán ramas:

```text
feature/FP-001-app-shell
fix/auth-redirect
docs/design-system
```

Los Pull Requests serán obligatorios cuando:

- haya varias personas;
- el cambio sea crítico;
- afecte seguridad;
- cambie base de datos;
- modifique producción;
- requiera revisión externa.

---

## 18. Excepciones urgentes

Un hotfix puede reducir pasos previos cuando existe:

- caída de producción;
- vulnerabilidad;
- pérdida de datos;
- bloqueo crítico de usuarios.

Aun así, después debe completarse:

- validación;
- documentación;
- commit;
- push;
- registro en Notion;
- análisis de causa.

La urgencia no elimina la trazabilidad.

---

## 19. Flujo resumido

```text
Idea o necesidad
        ↓
Evaluar alcance
        ↓
Crear o asignar Feature Pack
        ↓
Diseñar
        ↓
Implementar
        ↓
Lint + build + tests
        ↓
Validación manual
        ↓
Actualizar documentación
        ↓
Revisar diff
        ↓
Commit
        ↓
Push
        ↓
Actualizar Notion
        ↓
Cerrar Feature Pack
```

---

## 20. Primeros Feature Packs previstos

```text
FP-001 — App Shell
FP-002 — Autenticación
FP-003 — Navegación y rutas
FP-004 — Dashboard
FP-005 — Mapa
FP-006 — Reportes
FP-007 — Mascotas
FP-008 — Avistamientos
FP-009 — Perfil
FP-010 — Notificaciones
```

Esta lista puede evolucionar mediante el proceso de planificación.

---

## 21. Regla final

Ninguna funcionalidad está terminada únicamente porque “funciona”.

Está terminada cuando:

```text
funciona
+ está validada
+ está documentada
+ está versionada
+ está registrada
+ puede entenderla otra persona
```
