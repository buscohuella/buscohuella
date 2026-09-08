# R1.1 — Drift de migraciones y `public_profiles`

Estado: propuesta de PR; no aplicada en Supabase remoto. Corte: 8 de septiembre de 2026.

## Diferencias observadas

GitHub contiene, entre otras, las migraciones `20260801105227_create_profiles_base`, `20260802123944_harden_public_profiles`, `20260808003000_allow_public_profile_avatar_signed_reads`, `20260812120000_fix_public_profile_view_for_anonymous_reads` y `20260903143000_profile_privacy_controls`.

El proyecto vivo `buscohuella-app-dev` (`tqdmykvnocpffzkcaysp`) reporta timestamps/nombres equivalentes pero no idénticos: `20260808082849`, `20260812104140` y `20260902231717`. Esto se trata como drift de historial hasta comparar contenido completo; no se editan migraciones históricas para ocultarlo.

## Estado vivo conocido

La vista viva tiene la proyección mínima esperada, owner `postgres`, comportamiento Security Definer por defecto y no tiene `security_barrier` activado. Advisor marca `public.public_profiles` como `security_definer_view`. También se observaron grants excesivos sobre la vista; la migración propuesta revoca privilegios heredados de `PUBLIC` y de los roles, y concede únicamente `SELECT` a `anon` y `authenticated`. Este PR reduce exposición por grants/proyección, pero no elimina el warning; eliminarlo requeriría otra arquitectura, probablemente una tabla/proyección pública separada o una policy muy controlada.

## Regla de reconciliación

Esta PR añade una migración nueva. La aplicación a staging debe comparar `supabase migration list`, definición de vista, owner, opciones, grants y Advisor antes/después. La producción requiere una promoción aprobada; esta PR no aplica SQL remoto.
