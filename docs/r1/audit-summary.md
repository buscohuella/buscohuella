# Auditoría R1 y evidencias

Corte: 8 de septiembre de 2026. Revisión documental y estática; no se ha reejecutado la auditoría live de Supabase ni el recorrido completo de la web desplegada.

## Base comprobada

| Superficie | Evidencia y resultado |
| --- | --- |
| GitHub activo | `buscohuella/buscohuella`, main remoto `ce304aa1a371a2cb9d543f0f8f415b972678f81e`; web Next.js en apps/web |
| Checkout original | main local `8ff7162`, limpio y 11 commits por delante del remoto; conservado sin reset ni push |
| Base R1 | Worktree aislado desde main remoto para evitar mezclar los 11 commits locales |
| Trabajo abierto al iniciar | Sin issues ni PR abiertos; sin docs/r1 ni rama remota R1 |
| Expo histórico | [package.json](https://github.com/buscohuella/buscohuella-app/blob/main/package.json) usa expo-router; solo referencia |
| Master histórico | [README](https://github.com/xavikuDEV/BuscoHuella_Master/blob/main/README.md) describe web-pro, dashboard, mobile-app y DUA; fuera de R1 |
| Drive | Siete documentos R1 encontrados bajo [00_BuscoHuella_Master](https://drive.google.com/drive/folders/1kSgf78pW8UQ9vE4v9dkJXHcTU-urgrLg) |
| Notion | Auditorías y handoff disponibles; contienen evolución y rectificaciones, no solo estado final |
| Archivo accidental | Archivo raíz cuyo nombre comienza por (mvp), con caracteres de uso privado: contenido de ayuda de less |

## Hallazgos contrastados

- Existen migraciones de hardening previas. `20260810130100_remove_inherited_public_rpc_grants.sql` revoca EXECUTE a PUBLIC/anon para varias RPC privadas, pero concede anon a `is_public_active_report` y `report_accepts_sightings`. Hay que revisar el resultado acumulado y sus dependencias RLS antes de revocar.
- `20260812120000_fix_public_profile_view_for_anonymous_reads.sql` establece `security_invoker = false`; la corrección no puede limitarse a cambiar un flag sin probar acceso público y privacidad de profiles.
- SEO es parcial: login/registro ya declaran noindex. El generador compartido de metadata del detalle público tiene canonical, Open Graph y Twitter. `/avisos/[id]` lo reexporta, mientras canonical apunta a `/reportes/[id]`, ruta que redirige. Debe reconciliarse.
- No aparecen robots.ts ni sitemap.ts; el layout privado no declara metadata noindex. No hay prueba de alternates lingüísticos ES/CA en la revisión.
- El borrado de reportes limpia report-photos pero no recoge sighting-photos antes de borrar sightings. El borrado de mascotas elimina DB antes de Storage y devuelve éxito aunque el cleanup Storage falle. Riesgos de residuos, no prueba de residuos reales.
- Los contratos de tipos están en dos paquetes. La auditoría previa señala drift de perfiles, notificaciones y avistamientos; regeneración y comparación pendientes.
- CI contiene install, lint, build de paquetes, typecheck, tests y build web. Esta descripción no equivale a una ejecución verde ni a cobertura E2E/seguridad.

## Inventario para el siguiente PR

- Web: `apps/web/src/app`, `apps/web/src/features`, `apps/web/src/services/supabase`.
- Dominio/datos: `packages/pet-domain`, `pet-data`, `report-domain`, `report-data`.
- Migraciones: `supabase/migrations`.
- Tipos: `packages/pet-data/src/database.types.ts`, `packages/report-data/src/database.types.ts`.
- Idiomas: `apps/web/src/features/i18n/locales/es` y `ca`.
- Tests actuales: `packages/*/test/*.test.mjs`; CI: `.github/workflows/ci.yml`.
- Documentación relacionada: `docs/frontend/FP-016_PUBLIC_REPORT.md`, `FP-019_INTERNAL_NOTIFICATIONS.md`, `docs/adr/ADR-002_ESTRATEGIA_MOBILE.md`, `docs/database`, `docs/security`.

## Fuentes externas

- [Handoff para Codex](https://docs.google.com/document/d/14_RRHG_To9hMjGHrb2VLOAw7roU5PO-u6jwDkaZBgmo/edit)
- [START HERE](https://docs.google.com/document/d/1aWvOWPtG2OTLeFc98wCTm466H4dqIG_ZZlZgg-B9cTY/edit)
- [Estado real](https://docs.google.com/document/d/13LGwINuB0u6A56mOZGhqkj6R5jYiO371Dfp9OjjNs64/edit)
- [Auditoría consolidada](https://docs.google.com/document/d/1ZiLMt1zf0PX9Srbir5lMCqrTl6FkRjkKA41cvDX3a9E/edit)
- [Known gaps](https://docs.google.com/document/d/1r3bbb-KVChLiSwBeVoZf9-bEyYY-tM0FbAAV5BNivgw/edit)
- [Roadmap/backlog](https://docs.google.com/document/d/1O70XabSDZzZkJsfqpXquQwuJs3k5BB52Jva5y7sEJEw/edit)
- [Draft docs/r1](https://docs.google.com/document/d/1A_eW6x4Bmwhh2hd7i-mxVgvbg4QQl1qBqyyxSJOHRlo/edit)
- [Notion: auditoría Supabase y handoff](https://www.notion.so/3d4918d781ec815ea954e0604fe7bf50)
- [Notion: auditoría documental y Expo](https://www.notion.so/3d2918d781ec81f59789c0cd2b8d360c)

Las afirmaciones live de la auditoría previa (RLS, buckets, grants, Advisor y drift) se conservan como evidencia previa pendiente de reconfirmar. Ninguna casilla Beta se cierra por haber copiado esos resultados.
