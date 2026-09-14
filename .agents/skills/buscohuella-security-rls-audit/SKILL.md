---
name: buscohuella-security-rls-audit
description: Auditar en modo estrictamente READ-ONLY la seguridad de cambios o funcionalidades de BuscoHuella que involucren Supabase, Auth, autenticación o autorización, RLS/policies, Storage, privacidad, roles, permisos, ownership, acceso o exposición de datos sensibles, seguridad backend o server actions sobre datos protegidos. Usar antes de considerar una funcionalidad segura para MVP/Beta; complementa la auditoría técnica general y no aplica fixes.
---

# BuscoHuella Security and RLS Audit

Aplica las reglas permanentes de [AGENTS.md](../../../AGENTS.md) y usa
[buscohuella-independent-audit](../buscohuella-independent-audit/SKILL.md) para el
encuadre general, la base Git, la disciplina de evidencia y el formato de hallazgos.
Esta skill añade únicamente la revisión especializada de seguridad y acceso a datos.

## Procedimiento

1. Mantén `READ-ONLY` absoluto durante toda la auditoría. Delimita el diff, commit,
   feature, tabla, RPC, bucket, policy, server action, flujo Auth, rol o permiso
   concreto que se revisará.
2. Identifica los actores y superficies afectados: anónimo, autenticado, propietario,
   otro usuario, admin, policía, ayuntamiento, ONG/protectora, `service_role` cuando
   aparezca en código y backend/server action. No asumas que un rol existe o tiene
   privilegios si no hay evidencia.
3. Traza el acceso extremo a extremo y señala dónde se autentica, autoriza y aplica
   ownership:

   ```text
   UI/client → server action/API → repositorio/RPC → Supabase
   → tabla/Storage → RLS/policy/ownership
   ```

4. Revisa solo las superficies aplicables:
   - **Auth:** autenticación exigida; usuario obtenido de sesión fiable; ningún
     `userId` del cliente como autoridad; autorización separada; roles; escalado de
     privilegios; enumeración de cuentas o filtración innecesaria.
   - **RLS:** habilitación; policies `SELECT`/`INSERT`/`UPDATE`/`DELETE`; coherencia
     de `USING` y `WITH CHECK`; ownership, estados, roles especiales, relaciones y
     acceso cruzado; RPCs `SECURITY DEFINER`, grants y bypass inesperados.
   - **Storage:** bucket y policies por operación; ownership en paths; lectura,
     modificación o borrado cruzado; coherencia objeto/metadata DB; URLs públicas o
     firmadas y exposición accidental.
   - **Server/backend:** `service_role`, secretos y variables de entorno; operaciones
     privilegiadas; validación server-side; parámetros controlados por cliente;
     accesos que eviten RLS y errores que filtren información interna.
   - **Privacidad/datos:** minimización; campos sensibles, IDs internos, ubicación,
     datos personales o ajenos, logs y errores; mínimo privilegio.
   - **Integridad:** operaciones parciales DB/Storage, rollback o compensación,
     borrado, huérfanos, relaciones, estados imposibles y concurrencia material.
5. Prioriza especialmente acceso del usuario A a recursos del B, owner elegible por
   el cliente, ausencia o bypass de autorización, policies permisivas, uso o
   exposición indebida de `service_role`, Storage cruzado, respuestas no autorizadas,
   RPCs privilegiadas accesibles, mutación sin ownership, filtración personal y
   acceso conservado tras cambios de estado.
6. Para cada hallazgo incluye:
   - severidad: `P0` crítico/bloqueante, `P1` importante o `P2` no bloqueante;
   - tipo: `defecto demostrado`, `riesgo plausible` o
     `duda que requiere verificación`;
   - actor atacante o usuario afectado y recurso;
   - evidencia concreta y archivo/línea/policy/RPC cuando sea posible;
   - impacto y recomendación mínima.
7. No afirmes una vulnerabilidad por sospecha. Separa comportamiento demostrado por
   código o policy, riesgo inferido y comportamiento que requiere una prueba adicional.
   Evita consejos genéricos, checklist inflado, refactors cosméticos, arquitectura
   nueva sin riesgo demostrado, scope creep y duplicar la auditoría general.
8. Si una prueba exige escritura, impersonación, mutación, explotación activa o datos
   destructivos, no la ejecutes: documenta la prueba faltante, el entorno seguro
   necesario y clasifícala como duda o riesgo pendiente según la evidencia.
9. Cierra con recuentos `P0`/`P1`/`P2`, riesgos residuales y un veredicto:
   - `SECURITY_BLOCKED`: hay un P0 o falta una condición crítica para determinar la
     seguridad;
   - `SECURITY_NEEDS_FIXES`: no hay P0, pero existe al menos un P1;
   - `SECURITY_REVIEW_PASS`: no hay P0 ni P1; puede haber P2 o riesgos residuales
     explícitos.
   Nunca declares `VERIFIED LIVE` ni `CLOSED`.

## Guardrails

- No modificar archivos, aplicar fixes, hacer commit o push, usar stash, cambiar de
  rama, ejecutar `git fetch`, crear ramas/worktrees ni instalar dependencias.
- No generar artefactos que modifiquen el repositorio ni tocar LIVE.
- Toda consulta a Supabase debe ser `READ-ONLY`: no crear o modificar policies,
  migraciones, schema, Auth o Storage; no insertar, actualizar ni borrar datos.
- No usar `service_role` para probar acceso. Cualquier operación que exceda
  `READ-ONLY` queda fuera de esta skill y requiere una tarea separada.
- Si encuentras un secreto, informa de su existencia y ubicación de forma segura sin
  reproducir su valor.
