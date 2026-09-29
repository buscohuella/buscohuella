---
name: buscohuella-supabase-rollout
description: Aplicar de forma controlada a un entorno Supabase remoto cambios ya implementados, integrados y revisados —migraciones SQL o configuración explícitamente autorizada— con baseline, comprobación de pendientes, backup/restore, rollback y verificación LIVE. No desarrolla migraciones ni corrige código.
---

# BuscoHuella Supabase Rollout

Aplica primero [AGENTS.md](../../../AGENTS.md). Esta skill empieza después de `buscohuella-delivery`, las auditorías aplicables y `buscohuella-integration`. No sustituye ninguna de ellas.

## Precondiciones obligatorias

1. Identificar explícitamente proyecto Supabase y entorno objetivo. No inferirlo por nombre, sesión o último proyecto usado.
2. El cambio exacto debe estar integrado en `origin/main`, su SHA registrado y debe existir `INTEGRATION_PASS`; cualquier CI requerida sobre ese SHA debe estar en PASS.
3. La migración/configuración debe tener validación local aplicable (`VERIFIED LOCAL`) y revisión independiente favorable.
4. Si afecta Auth, RLS, policies, Storage, grants, SECURITY DEFINER, privacidad o acceso: exigir `SECURITY_REVIEW_PASS` sobre la misma referencia.
5. Debe existir autorización explícita para tocar el entorno remoto indicado.
6. Debe estar comprobado el mecanismo de backup/restore o recuperación aplicable y registrado el punto de retorno.
7. No puede existir drift remoto inexplicado en los objetos que el cambio va a modificar.
8. `supabase migration list` debe ofrecer un historial local↔remoto reconciliado que permita identificar inequívocamente el conjunto pendiente. Si existen versiones local-only/remote-only históricas sin reconciliar —aunque el esquema parezca correcto— esta skill termina con `ROLLOUT_BLOCKED`. La reparación del migration history es una tarea separada y explícitamente autorizada; esta skill **no ejecuta `migration repair`, `db pull` ni mutaciones del historial para desbloquearse a sí misma**.
9. Debe definirse el orden de despliegue código ↔ base de datos. Si la app desplegada todavía depende del esquema anterior o el nuevo código requiere el esquema nuevo, documentar compatibilidad y secuencia antes de aplicar; preferir cambios backward-compatible/expand-contract cuando sea necesario.
10. Si el cambio es destructivo, irreversible, contiene backfill material o puede bloquear tablas/objetos críticos, debe existir evaluación explícita de impacto, ventana/estrategia operativa y recuperación suficiente. Sin ello: `ROLLOUT_BLOCKED`.

Si falla una precondición, termina con `ROLLOUT_BLOCKED` sin escribir en remoto.

## Fase 1 — Baseline READ-ONLY

Antes de aplicar:

1. Registrar identidad/ref del proyecto y entorno.
2. Capturar historial remoto de migraciones.
3. Compararlo con `supabase/migrations/` de `origin/main` y con la evidencia canónica de reconciliación del migration history.
4. Ejecutar/inspeccionar `supabase migration list` en modo no mutante y exigir que las versiones local↔remoto estén reconciliadas. Si el CLI aborta por remote-only/local-only históricos no resueltos, `ROLLOUT_BLOCKED`; no intentar repararlos dentro de esta ejecución.
5. Determinar **el conjunto exacto de migraciones pendientes**.
6. Si existe cualquier migración pendiente adicional a las expresamente autorizadas para este rollout, `ROLLOUT_BLOCKED`. No usar `db push` para aplicar implícitamente un lote mayor.
7. Capturar DDL/definiciones aplicables antes del cambio: tablas, funciones, triggers, views, policies, grants, buckets/policies o configuración Auth según alcance.
8. Capturar Security/Performance Advisor cuando sea relevante.
9. Registrar métricas estructurales mínimas útiles para verificación —por ejemplo counts— sin extraer ni copiar PII innecesaria.
10. Clasificar el riesgo operativo del DDL/configuración: locks esperables, duración potencial, backfills, operaciones destructivas, dependencias de aplicación y reversibilidad. Si el riesgo no puede acotarse, `ROLLOUT_BLOCKED`.

## Fase 2 — Plan y rollback

Antes de escribir:

1. Identificar la unidad de cambio exacta: nombre(s) de migración o cambio de configuración.
2. Confirmar que una migración ya aplicada **no se editará, renombrará ni borrará**.
3. Definir rollback antes de rollout:
   - SQL/schema/policy: nueva migración correctiva basada en el baseline capturado;
   - configuración Auth/Storage no versionada por SQL: acción compensatoria explícita con valor anterior registrado;
   - operaciones no transaccionales: documentar el estado parcial posible y la recuperación.
4. No continuar si el rollback depende de recordar manualmente el estado anterior o de datos que no se capturaron.
5. Para cambios P0/seguridad, destructivos o con riesgo alto de indisponibilidad, preparar antes de escribir el **plan/SQL de rollback como artefacto revisado fuera del directorio activo `supabase/migrations/`** o en una referencia Git separada que no forme parte del checkout de rollout. **Nunca dejar una migración de rollback futura como pendiente junto a la migración que se va a aplicar**, porque `db push` podría ejecutar ambas. Solo si el rollback llega a ser necesario se materializa como nueva migración correctiva versionada, se revisa su conjunto de pendientes y se aplica mediante un rollout separado.

## Fase 3 — Aplicación

1. Aplicar únicamente la unidad autorizada mediante el mecanismo oficial del proyecto.
2. Si se usa Supabase CLI, revisar inmediatamente antes la lista real de pendientes. `supabase db push` solo es válido cuando el conjunto que va a aplicar coincide exactamente con el autorizado.
3. No ejecutar SQL ad-hoc equivalente a una migración versionada para “ir más rápido”.
4. No ejecutar `db reset`, borrar historial de migraciones ni usar opciones destructivas sobre el entorno remoto.
5. No combinar un cambio SQL con cambios manuales de Dashboard no documentados en la misma operación. Si ambos son necesarios, tratarlos como subpasos separados y auditables.
6. Ante error inesperado, detener el rollout. No encadenar comandos correctivos improvisados sobre remoto.

## Fase 4 — Verificación posterior

Tras una aplicación técnicamente exitosa:

1. Confirmar que el historial remoto contiene exactamente las migraciones esperadas y ninguna adicional.
2. Releer los objetos modificados y comparar con la intención del cambio.
3. Revalidar RLS, policies, grants, SECURITY DEFINER/search_path y Storage cuando aplique.
4. Reejecutar Security Advisor y comprobar que no se introducen errores/warnings materiales nuevos; un P0 que pretendía corregirse debe desaparecer o quedar explicado con evidencia.
5. Ejecutar smoke tests funcionales mínimos. Si requieren escritura, usar únicamente cuentas/entidades de QA autorizadas y datos no sensibles; no usar datos de usuarios reales para probar.
6. Para acceso: probar actor permitido y actor denegado cuando sea necesario. No usar `service_role` como sustituto de una prueba de RLS/ownership.
7. Verificar que fallos parciales relevantes conservan el comportamiento documentado cuando puedan probarse de forma segura.

## Fase 5 — Resultado y recuperación

- `ROLLOUT_BLOCKED`: no se escribió en remoto porque faltaba una precondición, había drift o pendientes inesperados.
- `APPLIED_NOT_VERIFIED`: el cambio quedó aplicado, pero falta una verificación necesaria o existe una incidencia no resuelta. No continuar con dependencias posteriores.
- `VERIFIED LIVE`: el cambio exacto está aplicado y todas las verificaciones requeridas terminaron en PASS con evidencia.

Si la verificación falla después de aplicar:

1. no editar la migración aplicada ni reescribir historial;
2. detener cambios dependientes;
3. decidir entre migración correctiva o acción compensatoria según el rollback predefinido;
4. revisar/auditar la corrección antes de aplicarla salvo incidente que requiera respuesta urgente expresamente autorizada;
5. registrar estado parcial y evidencia. Nunca convertir un fallo en éxito silencioso.

`VERIFIED LIVE` de esta skill no significa `CLOSED` del Feature Pack o bloque funcional.

## Guardrails

- No desarrollar ni modificar el cambio durante rollout.
- No tocar un proyecto remoto no identificado explícitamente.
- No aplicar pendientes adicionales por conveniencia.
- No ejecutar `migration repair`, `db pull` ni mutar `supabase_migrations.schema_migrations` como parte de esta skill; cualquier reconciliación de historial exige una tarea separada con equivalencia semántica demostrada.
- No ejecutar `db reset` ni borrar/modificar historial remoto.
- No editar migraciones ya aplicadas.
- No copiar secretos, tokens, PII o datos reales a logs/documentación.
- No usar `service_role` para demostrar que una policy funciona.
- No improvisar SQL correctivo en remoto fuera del proceso de migración/compensación.
- No marcar `VERIFIED LIVE` solo porque el comando de aplicación terminó con exit code 0.
