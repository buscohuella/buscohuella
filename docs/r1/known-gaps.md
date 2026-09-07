# Gaps, contradicciones y backlog R1

Corte: 8 de septiembre de 2026. Todos los elementos técnicos siguen abiertos salvo evidencia posterior enlazada. Prioridad Beta no equivale a orden inmediato de implementación.

## Contradicciones que no se deben resolver en silencio

| ID | Evidencia | Tratamiento |
| --- | --- | --- |
| R1-DOC-001 | AGENTS/README dan primacía absoluta al Maestro; handoff/Notion proponen fuentes operativas R1 | Registrar la discrepancia y trabajar dentro del alcance autorizado. No reemplazar el Maestro ni modificar decisiones estructurales sin resolverlas |
| R1-DOC-002 | Maestro §§2.4/15 describe Expo; §6.2 y ADR-002 posponen la app nativa | R1 web; conservar documentos antiguos y registrar su desactualización |
| R1-DOC-003 | Maestro §§6.1/6.7 incluye push; handoff excluye Web Push y FP-019 describe in-app | Mantener in-app en R1; no prometer push implementado |
| R1-DOC-004 | FOUND_ANIMAL figura en alcance pero el flujo completo no está confirmado | Decisión explícita antes de Beta; no retirarlo ni implementarlo por inferencia |
| R1-DOC-005 | Drive dice «faltan noindex/OG/canonical»; código ya tiene parte | Corregir diagnóstico: cobertura parcial; canonical apunta a ruta redirigida y faltan alternates ES/CA verificados |
| R1-DOC-006 | docs/INDEX y docs/api/API_CONTRACT señalados como desactualizados en Notion | Revalidar referencias y contrato; no reescribir ni archivar masivamente en R1.0 |
| R1-DOC-007 | 11 commits locales fuera de main remoto | Preservados en checkout original; PR documental desde remoto. Reconciliación separada, sin push implícito |
| R1-DOC-008 | Drive recomienda vista invoker; Notion sugiere RPC de perfil; allowlist anon solo reportes | Resolver contrato de perfiles antes del PR técnico; ninguna alternativa queda aprobada por copiar el backlog |

## Backlog de ejecución

| ID | Prioridad | Trabajo y criterio de cierre |
| --- | --- | --- |
| R1-SEC-001 | P0 | public_profiles seguro, campos/visibilidad probados y lectura legítima conservada |
| R1-SEC-002 | P0 | RPC/helpers/triggers: privilegios mínimos por firma, PUBLIC incluido, sin romper policies |
| R1-SEC-003 | P0 | Grants mínimos tablas/vistas, matriz antes/después y regresión A/B |
| R1-SEC-004 | P0 | Leaked password protection verificada o bloqueo documentado |
| R1-DATA-001 | P0 | Migraciones reconciliadas y reproducción en local/staging |
| R1-TYPES-001 | P0 | Tipos pet-data/report-data regenerados, consumidores reconciliados y typecheck |
| R1-QA-001 | P0 | Tests anon/A-B/Storage/RPC y ausencia de datos privados en proyecciones públicas |
| R1-QA-002 | P0 | E2E de auth → mascota/foto → reporte → mapa → avistamiento → notificación → resolución |
| R1-QA-003 | P0 | Auditoría dependencias y secret scanning formal, incluido historial, con hallazgos gestionados |
| R1-SEO-001 a 007 | P0 | robots, sitemap, noindex, metadata, OG/Twitter, canonical/alternates ES-CA y decisión de indexación pública |
| R1-I18N-001 | P0 | Test falla ante claves ES/CA faltantes o sobrantes; comprobar interpolaciones y textos mezclados |
| R1-A11Y-001 | P0 | Labels, foco, teclado, contraste, alt, formularios y mapa probados |
| R1-PROD-001 | P0 | Eliminar cuenta implementado o decisión temporal explícita y operativa antes de Beta pública |
| R1-PROD-002 | P0 | FOUND_ANIMAL completo y probado o exclusión Beta explícita |
| R1-PROD-003 | P1 | Estados vacíos/error/sesión expirada comprensibles en flujos principales |
| R1-OPS-001 | P0 | Runbook, testers, canal de bugs, responsables y criterio de bloqueo |
| R1-DATA-002 | P0 | Cleanup Storage de reportes/mascotas sin éxito silencioso ni pérdida de metadatos para reintentar |
| R1-INT-001 | P0 | Un evento por transición efectiva; cero en no-op; notificaciones sin duplicados |

Los IDs DATA-002 e INT-001 agrupan los riesgos de borrado e integridad ya registrados en la auditoría Notion; no añaden funcionalidades futuras. Los enlaces de issues se incorporan aquí al crearlos.

## Evidencias y límites

El drift de esquema/tipos, los grants live y la disponibilidad Auth vienen de la auditoría previa: necesitan verificación actual. El código confirma riesgos en cleanup de Storage, pero esta revisión no cuantifica objetos huérfanos. El riesgo de eventos duplicados debe contrastarse con la cadena completa de migraciones y tests; no limpiar datos históricos sin plan.

PWA completa, entrega push y cobertura legal no se presumen por existir una web, una tabla de notificaciones o páginas legales. [Matriz funcional](mvp-functional-matrix.md) y [pruebas](testing-strategy.md) detallan los cierres.

## Seguimiento

Notion registra decisiones/resultados y enlaces a issue/PR; Drive START HERE enlaza esta documentación versionada. No marcar cerrado un gap por haber creado un issue. Cada cierre necesita evidencia, entorno/commit y revisión; distinguir corrección versionada de despliegue.
