# BuscoHuella R1 — Pre-Beta hardening

Estado: preparación documental; no acredita una Beta validada. Corte: 8 de septiembre de 2026.

R1 consolida la web ciudadana existente para que sea pequeña, segura y demostrable. Repositorio activo: [buscohuella/buscohuella](https://github.com/buscohuella/buscohuella).

## Índice

- [Auditoría y fuentes](audit-summary.md)
- [Matriz funcional](mvp-functional-matrix.md)
- [Plan de seguridad](security-hardening-plan.md)
- [Gaps y backlog](known-gaps.md)
- [Criterios Beta](beta-checklist.md)
- [Estrategia de pruebas](testing-strategy.md)

## Alcance y autoridad

Este paquete es documentación operativa R1 basada en el handoff autorizado por el usuario. No sustituye ni reescribe el [Documento Maestro v3.1](../master/DOCUMENTO_MAESTRO.md). Las contradicciones con el Maestro, AGENTS y fuentes externas se registran en known-gaps; no se resuelven silenciosamente ni autorizan cambios estructurales. El nuevo Maestro se elaborará después de validar R1.

El código y las migraciones prueban lo versionado; una auditoría previa de Supabase no acredita su estado actual. Las comprobaciones live y los resultados de pruebas deben llevar entorno, fecha y commit. Drive y Notion son guías y evidencias provisionales, no el Maestro final.

Fuera de R1: Expo, Dashboard PRO, IA, chat, pagos, premium, blockchain/token/DAO, gamificación, QR/GPS/collar, integraciones institucionales y EN/EU/GL. Web Push real queda futuro; R1 mantiene notificaciones internas ES/CA.

## Orden de ejecución

1. Rama `r1/pre-beta-hardening` desde main remoto y PR documental con estos siete archivos.
2. Limpieza del archivo accidental de ayuda de less en commit separado del contenido documental.
3. Issues con criterio de aceptación, evidencia, dependencias y PR.
4. `public_profiles`, cierre anon RPC/helpers/triggers y grants mínimos.
5. Reconciliación de migraciones, tipos y tests anon/A-B/Storage/RPC.
6. SEO, consistencia ES/CA y accesibilidad.
7. Eliminar cuenta y decisión explícita FOUND_ANIMAL; cierre de riesgos de integridad/borrado y runbook Beta.

El inventario de migraciones y dependencias es previo a diseñar cada corrección de seguridad. No hay despliegue implícito al completar un PR.

## Control de cambios

- No escribir directamente en main ni modificar repos históricos.
- Todo cambio Supabase mediante migración versionada; no SQL manual en producción.
- Probar migraciones y regresiones en local/staging antes de planificar producción.
- No borrar/mover documentos antiguos de Drive ni reescribir el Maestro.
- GitHub conserva documentos y cambios versionados; Notion registra decisiones y progreso; Drive enlaza las guías y la entrega GitHub.
- Cada avance distingue preparado, implementado, probado y desplegado.
- El checkout original conserva 11 commits locales adicionales: no forman parte de esta entrega.

## Fuentes

El [handoff](https://docs.google.com/document/d/14_RRHG_To9hMjGHrb2VLOAw7roU5PO-u6jwDkaZBgmo/edit) y el [índice Drive](https://docs.google.com/document/d/1aWvOWPtG2OTLeFc98wCTm466H4dqIG_ZZlZgg-B9cTY/edit) son puntos de entrada. La relación completa está en [audit-summary](audit-summary.md).
