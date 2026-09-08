# Matriz funcional R1

Corte: 8 de septiembre de 2026, base GitHub ce304aa. «Implementado» significa presencia en código/documentación contrastada, no validación end-to-end ni despliegue certificado.

| Área | Estado | Evidencia actual | Cierre R1 |
| --- | --- | --- | --- |
| Landing | Implementada | app/(public)/page.tsx | Smoke, enlaces, metadata y accesibilidad |
| Registro/login/recovery | Implementado | features/auth; rutas auth y recovery | Sesión expirada, recuperación, redirects, errores y noindex |
| Perfil privado/público | Implementado con P0 | features/profile; public_profiles | Proyección mínima, privacidad, grants y tests anon/A-B |
| Mascotas y fotografías | Implementado con P0 de borrado | pet-domain, pet-data, features/pets | Ownership, Storage privado, fallos de cleanup y reintentos |
| Reporte perdido/publicación | Implementado | report-domain, features/reports | Validación servidor, fotos, ubicación y estados |
| Animal encontrado | Parcial/decisión pendiente | FOUND_ANIMAL en backend; flujo completo no acreditado | Completar y probar, o excluir explícitamente de Beta; foto obligatoria si se habilita según auditoría Notion |
| Mapa/listado/detalle | Implementado | /mapa, /explorar-avisos, /avisos/[id] | Proyección segura, filtros, carga/error/vacío y teclado |
| Avistamientos/fotos | Implementado | features/reports; migraciones sightings | A/B, ubicación manual honesta, fotos y revisión del propietario |
| Notificaciones internas | Implementadas | features/notifications; FP-019 | Aislamiento por destinatario, lectura, contador, preferencias e idempotencia |
| Ciclo de vida/resolución | Implementado, regresión pendiente | lifecycle RPC y acciones | Un evento por transición efectiva, ningún evento espurio por no-op |
| Borrado de reportes | Riesgo P0 | delete-archived-report.ts | Sin blobs de avistamientos huérfanos; fallos visibles y reintentos |
| Eliminar cuenta | Pendiente | Sin flujo confirmado | Decisión explícita y dependencias/Storage/sesiones resueltos antes de Beta pública |
| ES/CA | Implementado, QA pendiente | features/i18n/locales | Igualdad de claves, interpolaciones y textos sin mezclar |
| Accesibilidad | Infraestructura presente | features/accessibility y UI | Auditoría real de teclado, foco, contraste, formularios y mapa |
| SEO | Parcial | Noindex auth; metadata de detalle | robots, sitemap, cobertura privada, canonical correcto y alternates verificables |
| Legal/ayuda | Páginas presentes | app/(public)/legal y ayuda | Coherencia con comportamiento real; no equivale a validación legal |
| CI/tests | Base presente | workflow y tests de paquetes | Seguridad, E2E, tipos/migraciones y resultados reproducibles |
| Web Push real | Futuro | FP-019 lo excluye | No implementar en R1 |
| Expo / Dashboard PRO | Legacy/futuro | Repos históricos separados | Solo referencia |
| IA/chat/pagos/premium/blockchain/DAO | Futuro | Handoff los excluye | No implementar en R1 |
| EN/EU/GL e integraciones avanzadas | Futuro | Handoff los excluye | No ampliar alcance |

Las decisiones de producto pendientes no se cierran por esta matriz. Véanse [gaps](known-gaps.md) y [checklist](beta-checklist.md).
