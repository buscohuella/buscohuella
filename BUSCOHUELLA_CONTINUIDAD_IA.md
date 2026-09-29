# BuscoHuella — Continuidad operativa para IA

## Propósito

Este archivo es un **bootstrap de contexto**, no una copia del estado actual del
proyecto.

No debe contener el Feature Pack activo, el último bug, una lista manual de tareas
pendientes ni un snapshot funcional que pueda quedar obsoleto. El estado vivo se
consulta en sus fuentes canónicas.

## Fuentes de verdad

Usar esta jerarquía según el tipo de información:

1. `AGENTS.md` — reglas permanentes para agentes.
2. `docs/AI_WORKFLOW.md` — roles, routing, modelos, contexto y herramientas.
3. `docs/master/DOCUMENTO_MAESTRO.md` — producto, alcance y decisiones maestras.
4. GitHub — código, tests, migraciones, commits, PR, ADR y estado técnico verificable.
5. Notion Command Center — operación, prioridades, Execution, Milestones,
   Product Master, Decision Log y Project Journal.
6. Google Drive — evidencias y documentación pesada o externa cuando aplique.

Una conversación anterior no sustituye a estas fuentes.

## Recuperar contexto al comenzar o cambiar de conversación

1. Confirmar repositorio, entorno y rama.
2. Leer `AGENTS.md`.
3. Leer `README.md`.
4. Leer `docs/master/DOCUMENTO_MAESTRO.md`.
5. Leer `docs/AI_WORKFLOW.md`.
6. Consultar en Notion la tarea u objetivo operativo vigente y el último Project
   Journal relevante.
7. Comprobar el estado real de GitHub y del árbol de trabajo.
8. Identificar ticket, objetivo, alcance, riesgos y criterios de aceptación.
9. Cargar únicamente la documentación y los archivos específicos necesarios para
   esa tarea.
10. Elegir el procedimiento o Skill adecuado.
11. Ejecutar el cambio mínimo y las validaciones proporcionales al riesgo.
12. Registrar el resultado en GitHub y Notion cuando corresponda.

## Entorno ordinario

```text
Repositorio estable: D:\Proyectos\buscohuella
Laboratorio:        D:\Proyectos\buscohuella-dev
Rama de trabajo:    lab/dev
Rama estable:       main
```

Por defecto existe un único writer principal en `lab/dev`.

No crear ramas, clones o worktrees adicionales por rutina. Solo se justifican por
paralelismo real, aislamiento técnico, hotfix u otra necesidad explícita.

## Routing mínimo

```text
Bug o mejora de código
→ buscohuella-delivery

Auth / RLS / Storage / autorización / privacidad / datos sensibles
→ buscohuella-delivery
→ buscohuella-independent-audit cuando el impacto lo justifique
→ buscohuella-security-rls-audit

Cambio observable por el usuario
→ buscohuella-qa-e2e tras implementación e integración

Revisión independiente de una entrega relevante
→ buscohuella-independent-audit

Integrar a `main` una referencia ya validada y revisada
→ buscohuella-integration

Aplicar a Supabase remoto un cambio ya integrado y autorizado
→ buscohuella-supabase-rollout

Cambio mecánico o documentación con contenido completamente definido
→ operación determinista; no gastar un agente de código por defecto
```

El detalle completo vive en `docs/AI_WORKFLOW.md` y en cada
`.agents/skills/*/SKILL.md`.

## Política de contexto

No cargar todo el repositorio ni toda la documentación por defecto.

Secuencia:

```text
AGENTS.md
→ documento específico
→ archivos afectados
→ tests relacionados
→ ampliar contexto solo si aparece una dependencia real
```

Reutilizar decisiones ya documentadas y evitar repetir análisis cerrados.

## Handoff mínimo al cerrar un bloque

Dejar trazables, cuando apliquen:

- ID de tarea o ticket;
- estado real (`IMPLEMENTED`, `VERIFIED LOCAL`, `VERIFIED LIVE`, etc.);
- commit o PR relacionado;
- pruebas ejecutadas y resultado;
- riesgos o bloqueos abiertos;
- siguiente acción concreta.

El handoff persistente vive en GitHub y Notion. Este archivo no se actualiza para
cada ticket.

## Regla final

Cuando alguien diga **“continuamos BuscoHuella”**, no reconstruir el proyecto desde
la memoria de una conversación.

Primero recuperar el estado canónico y después continuar desde la tarea real.
