# R1.1 — Checklist de validación `public_profiles`

No ejecutado contra producción. Usar local/staging y fixtures sintéticos.

- [ ] `anon` lee únicamente perfiles con `is_public = true` y alias no nulo.
- [ ] `anon` no puede leer directamente `public.profiles`.
- [ ] Perfiles privados no aparecen.
- [ ] `bio` siempre es `NULL`.
- [ ] Email, `full_name`, teléfono, microchip, notas, IDs internos y ubicación exacta no aparecen en la vista, respuestas REST/RPC ni logs.
- [ ] `public_show_avatar = false` devuelve `avatar_path = NULL`.
- [ ] `public_show_municipality = false` devuelve `municipality = NULL`.
- [ ] `authenticated` puede consultar la vista pública pero no mutarla.
- [ ] Usuario A conserva lectura/edición de su propio perfil según RLS.
- [ ] Usuario B no puede leer ni modificar datos privados de A.
- [ ] `get-public-profile.ts` continúa esperando las cinco columnas actuales.
- [ ] Signed URL del bucket `profile-avatars` continúa funcionando únicamente para avatares autorizados.
- [ ] Grants efectivos: `PUBLIC`, `anon` y `authenticated` no tienen privilegios heredados sobre la vista; solo `SELECT` explícito para `anon` y `authenticated`.
- [ ] `security_barrier = true` es compatible en local/staging y no introduce regresión; si no aporta valor o falla, se documenta y se retira antes de promover.
- [ ] Advisor antes/después registrado; el warning de Security Definer queda explicado.
- [ ] Se documenta que este PR reduce exposición mediante proyección y grants, pero no elimina el warning `security_definer_view`.
- [ ] Se documenta que eliminar totalmente el warning requeriría otra arquitectura (por ejemplo, tabla/proyección pública separada o policy muy controlada), fuera de esta decisión si amplía el riesgo.
- [ ] Si no existe base local/staging disponible, estas comprobaciones quedan pendientes y el PR permanece draft.
- [ ] `supabase migration list` y el inventario GitHub ↔ Supabase quedan adjuntos al PR.
