# AI Workflow — BuscoHuella

Este documento complementa `AGENTS.md`. Define cómo usamos IA, agentes, modelos,
Skills y herramientas para desarrollar BuscoHuella de forma eficiente, trazable y
proporcional al riesgo.

No sustituye las reglas permanentes del repositorio ni las instrucciones específicas
de cada Skill.

## 1. Propósito

La IA debe acelerar y proteger el desarrollo del MVP de BuscoHuella.

No debe convertirse en un proyecto paralelo ni desplazar las prioridades reales de
producto, seguridad, datos, accesibilidad, UX o estabilidad.

Regla operativa:

> Una nueva herramienta, Skill, agente, integración o automatización debe poder
> explicar en una frase qué problema real de BuscoHuella resuelve.

Si no existe una respuesta clara, no se incorpora todavía.

## 2. Roles

### Xavi — Founder

Responsable de:

- decisión final de producto;
- prioridades;
- alcance del MVP/Beta;
- autorizaciones sensibles;
- aceptación de cambios de negocio o producto;
- decisiones irreversibles o con impacto relevante.

### ChatGPT — CTO / Orchestrator

Responsable de:

- análisis técnico y de producto;
- arquitectura;
- priorización;
- definición de alcance;
- routing de tareas;
- selección del procedimiento adecuado;
- coordinación de agentes;
- revisión final;
- trazabilidad en Notion y documentación canónica.

No debe enviar trabajo a un agente cuando la tarea pueda resolverse de forma más
segura, barata y determinista mediante un comando o cambio mecánico.

### Codex — Builder principal actual

Codex es actualmente el builder técnico principal para tareas que requieren leer,
razonar o modificar el repositorio.

Ejemplos:

- bugs;
- features;
- refactors;
- tests;
- arquitectura;
- cambios con dependencias;
- análisis de implementación;
- correcciones que requieren comprender código existente.

Codex no es el único builder posible. Otros agentes compatibles podrán asumir tareas
en el futuro.

### Reviewer independiente

Puede ser Kimi, otra sesión realmente separada, Claude, Gemini u otro agente adecuado.

Su función es revisar trabajo ya realizado con independencia suficiente.

En una revisión `READ-ONLY`:

- no implementa fixes;
- no altera el código revisado;
- separa hallazgos de correcciones;
- documenta límites de su revisión.

### Skills

Las Skills son procedimientos reutilizables de trabajo.

No son agentes.

Definen cómo ejecutar correctamente una categoría de tarea y qué condiciones deben
cumplirse para considerar el trabajo terminado.

### Tools y connectors

GitHub, Supabase, Notion, Google Drive, Slack, Vercel y otras integraciones son
capacidades del sistema.

No sustituyen criterio técnico, producto ni autorización humana.

## 3. Qué va y qué no va a un agente

Antes de usar Codex u otro agente se aplica esta pregunta:

> ¿La tarea necesita que un agente lea, razone o modifique el repositorio?

Si la respuesta es no, se prefiere una operación determinista.

### Usar agente

Ejemplos:

- corregir un bug;
- implementar una feature;
- investigar una regresión;
- diseñar o modificar arquitectura;
- crear tests ligados a comportamiento real;
- refactorizar;
- analizar seguridad;
- comprender relaciones entre varios archivos;
- revisar una implementación importante;
- reconciliar comportamiento y código.

### No usar agente

Ejemplos:

- crear un archivo cuyo contenido ya está completamente definido;
- escribir una plantilla exacta;
- ejecutar comandos Git simples y conocidos;
- renombrar o copiar archivos de forma mecánica;
- aplicar un cambio textual exacto;
- crear documentación ya redactada;
- realizar comprobaciones deterministas sencillas.

Principio:

> Agentes para razonamiento y trabajo técnico real. Comandos y scripts para trabajo
> mecánico y determinista.

## 4. Routing por tipo de tarea

### Bug o mejora de código

Flujo habitual:

`buscohuella-delivery`
→ revisión independiente cuando el impacto lo justifique
→ integración
→ `buscohuella-qa-e2e` si cambia comportamiento observable.

### Auth, RLS, Storage, privacidad o autorización

Flujo habitual:

`buscohuella-delivery`
→ `buscohuella-independent-audit`
→ `buscohuella-security-rls-audit`
→ integración
→ rollout de Supabase si aplica
→ `buscohuella-qa-e2e` cuando corresponda.

### Documentación

Si el contenido ya está definido y el cambio es mecánico, se crea directamente.

Si modifica reglas importantes, arquitectura o procedimiento:

→ revisión independiente
→ integración controlada.

### QA sin cambios de código

Usar:

`buscohuella-qa-e2e`

Si QA descubre un P0 o P1 reproducible, el flujo vuelve a `buscohuella-delivery`.

## 5. Política de modelos

No se fijan nombres ni precios concretos como regla permanente porque pueden cambiar.

Se utilizan tres categorías funcionales.

### Máxima capacidad

Para:

- arquitectura;
- P0 complejos;
- seguridad;
- decisiones ambiguas;
- errores difíciles de reproducir;
- cambios de alto impacto;
- operaciones con alto coste de error.

### Modelo equilibrado

Para:

- implementación normal;
- tests;
- refactors;
- documentación técnica;
- análisis de alcance medio.

### Modelo económico

Para:

- clasificación;
- resúmenes;
- inventarios;
- tareas mecánicas;
- transformaciones repetitivas;
- trabajos muy delimitados.

Principio:

> Usar el modelo de menor coste que pueda resolver la tarea con fiabilidad suficiente.

Se escala de capacidad cuando aumentan:

- ambigüedad;
- impacto;
- riesgo de seguridad;
- irreversibilidad;
- dificultad;
- coste potencial del error.

## 6. Contexto y tokens

Los tokens son un recurso operativo, no una métrica de calidad.

Reglas:

- no enviar el repositorio completo cuando no sea necesario;
- proporcionar únicamente el contexto mínimo suficiente;
- reutilizar documentación canónica;
- no pedir a varios agentes que implementen exactamente lo mismo;
- un builder por tarea ordinaria;
- usar reviewer separado cuando el impacto lo justifique;
- evitar repetir análisis ya resueltos;
- reducir primero contexto innecesario antes de aumentar modelo o coste.

## 7. Un writer por defecto

El laboratorio ordinario actual es:

`D:\Proyectos\buscohuella-dev`

Rama:

`lab/dev`

Por defecto trabaja un único writer principal sobre ese laboratorio.

No se crean ramas, clones o worktrees adicionales por rutina.

Los worktrees separados se justifican únicamente cuando exista desarrollo concurrente
real por varios builders sobre tareas independientes y claramente aisladas.

## 8. ChatGPT, capacidad incluida y API

ChatGPT es actualmente el centro de trabajo operativo del proyecto.

La capacidad incluida disponible se utiliza antes de introducir infraestructura
adicional de pago por uso.

La API no se adopta únicamente porque parezca una solución más avanzada.

API, Agents SDK u otras capas de automatización se introducen cuando exista un proceso:

- concreto;
- repetitivo;
- previamente probado manualmente;
- medible;
- con beneficio claro;
- cuyo coste y mantenimiento estén justificados.

No se incluyen precios concretos en este documento porque pueden quedar obsoletos.

## 9. Automatización futura

La progresión prevista es:

`manual disciplinado`
→ `semi-automatizado`
→ `agentes coordinados`
→ `automatización completa de procesos maduros`

Posibles usos futuros:

- clasificación automática de PR;
- routing por riesgo;
- revisión automática;
- generación de planes de QA;
- sincronización de resultados con Notion o Slack;
- observabilidad;
- alertas;
- tareas recurrentes de mantenimiento.

Nada de esto se activa preventivamente.

## 10. Reglas críticas deterministas

Una regla crítica no debe depender únicamente de que un modelo la recuerde.

Siempre que sea posible se prefieren barreras técnicas como:

- tests;
- CI;
- RLS;
- constraints;
- protección de ramas;
- scripts;
- validaciones;
- permisos;
- checks automáticos.

`AGENTS.md`, prompts y Skills complementan estas barreras.

No las sustituyen.

## 11. Herramientas y fuentes de verdad

### GitHub

Contiene:

- código;
- versionado;
- historial técnico;
- pull requests;
- CI;
- artefactos técnicos versionados.

### Notion

Contiene:

- gestión operativa;
- roadmap;
- decisiones;
- Project Journal;
- reuniones;
- seguimiento del proyecto.

### Google Drive

Contiene:

- documentación pesada;
- evidencias;
- informes;
- PDFs;
- contratos;
- presentaciones;
- estudios;
- documentos externos;
- archivos compartidos.

### Supabase

Es backend y fuente de datos del producto.

No es una herramienta de gestión del proyecto.

### Vercel

Es la superficie de despliegue y runtime web.

### Slack

Es comunicación, coordinación y alertas.

Los resultados importantes deben consolidarse en GitHub o Notion cuando corresponda.

### Obsidian

Solo se considerará si aparece un hueco de conocimiento técnico que GitHub y Notion
no cubran adecuadamente.

Regla:

> No añadir una aplicación si no podemos explicar qué información vive allí y no en
> las demás.

## 12. Skills actuales

Skills activas:

- `buscohuella-delivery`
- `buscohuella-independent-audit`
- `buscohuella-security-rls-audit`
- `buscohuella-qa-e2e`

Skills operativas previstas:

- `buscohuella-integration`
- `buscohuella-supabase-rollout`

No se crean Skills preventivamente.

Una nueva Skill debe cubrir un procedimiento:

- repetitivo;
- suficientemente estable;
- relevante para BuscoHuella;
- no cubierto adecuadamente por las Skills existentes.

## 13. Adopciones técnicas condicionadas

Estas herramientas son candidatas, no dependencias actuales.

### Playwright + axe

Candidato cuando formalicemos E2E de navegador y accesibilidad automatizada.

### Sentry

Candidato para observabilidad y errores de runtime antes o alrededor de Beta.

### PostHog

Candidato para analítica de producto cuando Beta genere uso real y necesitemos medir
funnels, abandono y comportamiento.

### API / Agents SDK

Candidato cuando automaticemos un flujo que ya haya sido validado manualmente.

No se instala ni activa ninguna de estas herramientas por anticipado.

## 14. Prioridad del producto

La arquitectura IA existe para servir a BuscoHuella.

No para alterar su prioridad.

Orden general:

1. P0 de seguridad, datos y funcionalidad.
2. P1 importante de MVP/Beta.
3. UX, accesibilidad y SEO necesarios.
4. Tooling que reduzca riesgo o acelere trabajo real.
5. Mejoras futuras.

Cuando una mejora de IA compita con una necesidad crítica del producto, gana el
producto.