---
name: buscohuella-independent-audit
description: Realizar auditorías técnicas independientes y READ-ONLY de cambios, commits, funcionalidades o áreas concretas de BuscoHuella antes de su integración o cierre. Usar cuando un segundo agente deba revisar trabajo ajeno, identificar hallazgos accionables y emitir un veredicto sin modificar ni corregir el repositorio.
---

# BuscoHuella Independent Audit

Aplica las reglas permanentes de [AGENTS.md](../../../AGENTS.md). Usa
[buscohuella-delivery](../buscohuella-delivery/SKILL.md) solo como referencia del
proceso auditado: esta skill revisa sus resultados, no los implementa ni corrige.

## Procedimiento

1. Mantén modo `READ-ONLY` durante toda la auditoría. Confirma repositorio, rama,
   estado Git y referencia evaluada mediante comandos no mutantes.
2. Delimita el objetivo exacto: diff de `lab/dev` frente a `origin/main`, commit
   concreto, archivos concretos o funcionalidad/área concreta. No incluyas cambios
   fuera de ese perímetro; distingue cambios confirmados de trabajo local adicional.
   Para `lab/dev` frente a `origin/main`, registra el hash local exacto de
   `origin/main` usado como base. No ejecutes `git fetch`; si no puedes verificar su
   frescura frente al remoto sin esa operación, indícalo como limitación y no como
   fallo salvo que sea material para el objetivo concreto.
3. Lee únicamente la documentación, decisiones, código y tests necesarios para
   entender el comportamiento esperado y evaluar la evidencia.
4. Revisa, cuando aplique:
   - seguridad, Auth, permisos, RLS y privacidad;
   - integridad y consistencia de datos;
   - lógica funcional, regresiones y manejo de errores;
   - tests y cobertura relevante;
   - UX, accesibilidad e i18n;
   - SEO de superficies públicas;
   - rendimiento o arquitectura solo ante impacto material.
5. Prioriza únicamente hallazgos reales y accionables:
   - `P0`: crítico o bloqueante;
   - `P1`: importante para MVP o Beta;
   - `P2`: menor y no bloqueante.
6. Para cada hallazgo indica severidad, archivo y línea cuando sea posible,
   evidencia concreta, impacto y recomendación breve. Etiquétalo además como
   `defecto demostrado`, `riesgo plausible` o `duda que requiere verificación`.
7. Contrasta cada hallazgo con el alcance y las decisiones aceptadas. Descarta falsos
   positivos, observaciones cosméticas sin impacto, refactors por preferencia,
   decisiones ya resueltas y ampliaciones de scope.
8. Si no existen hallazgos importantes, indícalo expresamente. No ocultes límites de
   la revisión ni conviertas falta de evidencia en una afirmación de corrección.
9. Termina con recuentos de `P0`, `P1` y `P2`, riesgos residuales y un veredicto:
   - `BLOCKED`: existe al menos un P0 o falta una condición crítica para auditar;
   - `NEEDS_FIXES`: no hay P0, pero existe al menos un P1;
   - `REVIEW_PASS`: no hay P0 ni P1; informa cualquier P2 o riesgo residual.
   Nunca declares `VERIFIED LIVE` ni `CLOSED`.

## Guardrails

- No modificar archivos, aplicar fixes, hacer commit o push, usar stash ni cambiar
  de rama.
- No crear ramas, worktrees, migraciones ni cambios de RLS o schema.
- No instalar dependencias ni ejecutar herramientas que generen o modifiquen
  artefactos del repositorio.
- Toda operación sobre Supabase debe ser `READ-ONLY`. Cualquier operación que exceda
  `READ-ONLY` queda fuera de esta skill y requiere una tarea separada.
- Si una comprobación no puede realizarse sin escribir o ampliar el alcance,
  regístrala como límite o duda pendiente en vez de ejecutarla.
