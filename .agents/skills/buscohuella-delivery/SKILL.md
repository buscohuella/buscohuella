---
name: buscohuella-delivery
description: Implementar bugs, mejoras o funcionalidades acotadas en BuscoHuella desde la recepción de la tarea hasta VERIFIED LOCAL, con contexto mínimo, cambio mínimo, tests, validación proporcional y entrega preparada para revisión o integración. Usar cuando se solicite desarrollar o corregir comportamiento del proyecto; no para despliegues LIVE ni integración en main.
---

# BuscoHuella Delivery

Aplica primero las reglas permanentes de [AGENTS.md](../../../AGENTS.md). Esta skill
describe el procedimiento operativo y no amplía el alcance ni las autorizaciones de
la tarea.

## Procedimiento

1. Confirma `D:\Proyectos\buscohuella-dev`, rama `lab/dev`, `git status --short`,
   último commit y referencia local de `origin/main`. Detente si el estado existente
   impide aislar el cambio sin riesgo; no descartes trabajo ajeno.
2. Traduce la tarea a un objetivo verificable y criterios de aceptación concretos.
   Identifica qué queda fuera de alcance y aclara solo las ambigüedades que cambien
   materialmente la solución.
3. Lee únicamente el contexto necesario, siguiendo el orden de `AGENTS.md`:
   documentación aplicable, archivos afectados y tests relacionados. Contrasta toda
   posible decisión estructural con la fuente de verdad del proyecto.
4. Clasifica el impacto antes de editar:
   - seguridad, Auth, RLS o datos;
   - comportamiento funcional;
   - UX y accesibilidad;
   - i18n;
   - SEO, cuando aplique.
   Eleva la profundidad de revisión y validación en las áreas afectadas.
5. Implementa el cambio mínimo que satisface los criterios, reutilizando patrones
   existentes y evitando scope creep, refactors laterales o cambios preventivos.
6. Añade o actualiza los tests que protejan el comportamiento modificado. Si no
   procede añadir tests, deja constancia del motivo y de la comprobación alternativa.
7. Valida de forma proporcional y en este orden:
   - tests dirigidos del área afectada;
   - lint;
   - typecheck;
   - `git diff --check`;
   - suites adicionales, build o validación manual solo cuando el riesgo o la
     integración lo justifiquen.
   Repite las validaciones afectadas después de cualquier cambio posterior.
8. Revisa el diff final para detectar archivos accidentales, secretos, regresiones,
   cambios fuera de alcance y cobertura insuficiente de los impactos clasificados.
9. Declara únicamente los estados demostrados:
   - `IMPLEMENTED`: el cambio solicitado está realizado;
   - `STATICALLY REVIEWED`: el diff y sus impactos fueron revisados;
   - `VERIFIED LOCAL`: las validaciones locales necesarias finalizaron correctamente.
   Si una validación necesaria falla o no puede ejecutarse, no declares
   `VERIFIED LOCAL`. Nunca declares `VERIFIED LIVE` ni `CLOSED` sin evidencia real.
10. Entrega un resumen corto con causa u objetivo, archivos modificados,
    validaciones `PASS`/`FAIL`, riesgos o pendientes y siguiente acción recomendada.

## Guardrails

- No tocar `main`, hacer push, borrar o aplicar stash, ni tocar Supabase LIVE.
- No crear ramas ni worktrees nuevos.
- No crear migraciones ni cambiar RLS o schema salvo petición explícita de la tarea.
- No añadir dependencias sin una necesidad inmediata y justificada.
- No modificar archivos fuera del alcance ni afirmar éxito sin validación.
- Ante una restricción o contradicción, conserva el estado, informa y solicita la
  autorización necesaria antes de ampliar el alcance.
