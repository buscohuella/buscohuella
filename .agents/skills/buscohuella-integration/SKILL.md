---
name: buscohuella-integration
description: Integrar de forma controlada en main cambios de BuscoHuella ya VERIFIED LOCAL y con revisión independiente favorable, verificar el resultado remoto y realinear lab/dev sin desarrollar, corregir ni tocar Supabase LIVE. Usar solo cuando el trabajo esté terminado, validado y autorizado para integración.
---

# BuscoHuella Controlled Integration

Aplica primero las reglas permanentes de [AGENTS.md](../../../AGENTS.md). Esta skill cubre exclusivamente la integración de trabajo ya terminado. No sustituye `buscohuella-delivery`, `buscohuella-independent-audit` ni `buscohuella-security-rls-audit`.

## Precondiciones obligatorias

Antes de integrar, exige evidencia de:

1. `VERIFIED LOCAL` del cambio a integrar.
2. `REVIEW_PASS` de `buscohuella-independent-audit` sobre el commit/diff exacto.
3. Si afecta Auth, RLS, Storage, permisos, privacidad o datos protegidos: `SECURITY_REVIEW_PASS` sobre la misma referencia.
4. Ningún `P0` ni `P1` abierto dentro del alcance de integración.
5. Autorización explícita para integrar.
6. `origin/main` debe estar protegido mediante PR como ruta normal, sin force push ni borrado rutinario, y con la CI requerida identificada.
7. Debe existir una rama remota permanente `origin/lab/dev`, poder demostrarse su relación con `origin/main` sin reescritura de historial y tener salvaguardas contra force push/borrado rutinario sin impedir pushes normales.
8. La configuración del repositorio no debe eliminar automáticamente `lab/dev` tras merge, o debe existir una regla efectiva que impida ese borrado de la rama permanente.
9. El repositorio debe permitir **merge commit** como método de merge mientras este modelo de rama permanente siga vigente; si la configuración no puede verificarse o solo permite squash/rebase, `INTEGRATION_BLOCKED` hasta decidir otro modelo canónico.

Si falta una precondición, termina con `INTEGRATION_BLOCKED` sin integrar nada en `main`.

## Procedimiento

1. Confirma el estado de ambos árboles de trabajo:
   - `D:\Proyectos\buscohuella` → `main`;
   - `D:\Proyectos\buscohuella-dev` → `lab/dev`.
   Registra `git status --short`, `git branch --show-current`, `git log -1 --oneline` y los SHAs de `origin/main` y `origin/lab/dev`.
2. Ejecuta `git fetch origin --prune` desde árboles limpios. `main` local debe poder avanzar por fast-forward hasta `origin/main`; no integres si existen commits locales ajenos o divergencia no explicada.
3. Compara la base real `origin/main` con la base usada por las auditorías. Si cambió de forma material para el alcance, invalida los PASS afectados y devuelve el cambio a revisión antes de continuar.
4. En `lab/dev`, identifica el conjunto exacto de commits y archivos candidatos mediante `git log origin/main..lab/dev` y `git diff origin/main...lab/dev`. Deben coincidir con la referencia auditada y no contener trabajo adicional.
5. Comprueba que la actualización de `origin/lab/dev` puede hacerse por **fast-forward normal**. Si requeriría `--force`, reset o reescritura para publicar el trabajo auditado, termina con `INTEGRATION_BLOCKED` y reconcilia primero la rama.
6. Antes de publicar, confirma que no existe otro PR de integración abierto desde `lab/dev`. Solo puede existir **un PR de integración activo a la vez**. Publica el head auditado mediante push normal de `lab/dev` a `origin/lab/dev`. No empujes directamente a `main`.
7. Crea o actualiza un Pull Request `lab/dev → main`. Desde este momento `lab/dev` queda **congelada para trabajo nuevo** hasta merge/cierre del PR. Comprueba en GitHub que el diff, commits y archivos del PR coinciden exactamente con lo auditado. Cualquier push posterior cambia la referencia auditada: solo se permite para corregir ese mismo alcance y obliga a repetir las validaciones/auditorías afectadas.
8. Espera a que toda CI requerida termine en PASS. CI pendiente o fallida mantiene `INTEGRATION_BLOCKED`. No corrijas código dentro de esta skill; cualquier fix vuelve a `buscohuella-delivery` y debe revalidarse/revisarse.
9. Justo antes del merge, reconfirma que la base del PR no ha cambiado de forma que invalide la revisión, que la protección de `main` sigue vigente y que merge commit continúa permitido. Si cambió una condición material, `INTEGRATION_BLOCKED` y nueva revisión cuando proceda.
10. Resuelve conversaciones/revisiones pendientes y obtén autorización humana explícita para merge. El agente no aprueba su propio trabajo y no usa auto-merge.
11. Integra mediante **merge commit** como estrategia normal de la rama permanente `lab/dev`, salvo que una decisión canónica posterior cambie expresamente el modelo. No usar squash/rebase como atajo, porque romperían la relación de ancestro necesaria para realinear `lab/dev` sin reescritura.
12. Tras el merge, verifica el SHA real de `origin/main` y que el commit/PR esperado quedó integrado. Como el CI del proyecto también se ejecuta en `push` a `main`, espera a que la CI requerida del **SHA final de `main`** termine en PASS. CI post-merge pendiente o fallida mantiene `INTEGRATION_BLOCKED` y exige incidencia/fix/revert controlado; no reescribas `main`.
13. Realinea primero `main` local mediante fast-forward a `origin/main`. Después, solo con `lab/dev` limpio y sin trabajo adicional, avánzalo también por fast-forward a `origin/main` y publica ese avance normal a `origin/lab/dev`. Si cualquier paso no es fast-forward o hay trabajo extra, no resetees, no fuerces y termina con `INTEGRATION_BLOCKED` dejando evidencia del estado.
14. Confirma que `origin/main` y `origin/lab/dev` quedan en la base esperada tras la realineación y registra SHAs, PR, CI pre-merge y post-merge, merge, archivos integrados, incidencias y siguiente estado permitido.

## Resultado

Emite uno de estos veredictos operativos:

- `INTEGRATION_PASS`: PR integrado y confirmado en `origin/main`, CI requerida en PASS y `lab/dev` realineada de forma segura con la nueva base.
- `INTEGRATION_BLOCKED`: falta una precondición, la base revisada quedó obsoleta, existe conflicto, falla una validación o no puede garantizarse una realineación segura.

`INTEGRATION_PASS` no significa `VERIFIED LIVE` ni `CLOSED`.

## Guardrails

- No implementar features, fixes ni refactors durante la integración.
- No modificar Supabase LIVE, Auth, Storage o schema.
- No aplicar migraciones LIVE.
- No hacer push directo a `main` como flujo normal.
- No iniciar trabajo nuevo ni mezclar otro ticket en `lab/dev` mientras exista un PR de integración abierto desde esa rama.
- No usar `git push --force`, `reset --hard` sobre trabajo no demostrado como prescindible, `stash`, rebase destructivo ni reescritura de historial.
- No usar squash/rebase merge mientras `lab/dev` sea una rama permanente que se realinea por fast-forward.
- No integrar un cambio distinto del revisado.
- No reutilizar una auditoría si la base cambió materialmente.
- No autoaprobar el trabajo ni hacer auto-merge.
- No declarar `VERIFIED LIVE` ni `CLOSED`.
