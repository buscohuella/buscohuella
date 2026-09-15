---
name: buscohuella-qa-e2e
description: Verificar mediante QA, E2E o prueba funcional que un flujo completo de BuscoHuella funciona realmente después de implementarlo, incluyendo formularios, navegación, Auth desde la perspectiva del usuario, creación/edición/borrado, estados, persistencia, regresiones y recorridos multipaso en validación Pre-Beta/Beta. Usar para ejecutar y documentar comportamiento observable en LOCAL o DEV/TEST; no para implementar fixes, auditar código en general ni probar LIVE.
---

# BuscoHuella QA E2E

Aplica [AGENTS.md](../../../AGENTS.md). Esta skill demuestra comportamiento funcional
extremo a extremo. [buscohuella-delivery](../buscohuella-delivery/SKILL.md) construye
o corrige; [buscohuella-independent-audit](../buscohuella-independent-audit/SKILL.md)
revisa técnicamente; y
[buscohuella-security-rls-audit](../buscohuella-security-rls-audit/SKILL.md) revisa
seguridad y autorización. No dupliques esos procedimientos.

## Procedimiento

1. **Delimita la prueba.** Registra flujo o funcionalidad, criterios de aceptación,
   actor/rol, inicio, resultado final, datos necesarios, entorno permitido y riesgos
   de mutación. Limita regresiones a las directamente relacionadas.
2. **Confirma el entorno.** Usa `D:\Proyectos\buscohuella-dev`, rama `lab/dev`, como
   laboratorio y código bajo prueba; no crees ramas, worktrees, clones, repositorios
   ni otros entornos locales para una QA ordinaria. Distingue `LOCAL`, `DEV/TEST` y
   `LIVE`; usa únicamente el `LOCAL` o `DEV/TEST` ya existente cuando la tarea lo
   permita y verifica URL, deployment y proyecto Supabase antes de mutar datos, sin
   inferirlos por su nombre. No crees proyectos Supabase, buckets, schemas, tablas,
   policies, infraestructura ni entornos. Si no puedes demostrar que el entorno es
   seguro, detente con `QA_BLOCKED`. `LIVE` queda fuera de esta skill.
3. **Registra el estado inicial.** Anota precondiciones, usuario/rol, fixtures o
   registros, estado previo del recurso y commit/versión cuando sea relevante. No
   reutilices datos ambiguos que puedan falsear el resultado.
4. **Diseña el recorrido mínimo.** Define el happy path y solo los negativos o
   regresiones necesarios. Por ejemplo: registro→login; crear→listado→detalle;
   editar→refrescar→persistencia; reportar→feed/mapa/detalle;
   avistamiento→reporte; archivar/borrar→estado posterior; cambio de idioma; o error
   de validación sin datos incoherentes. Evita matrices exhaustivas sin necesidad.
5. **Ejecuta como usuario real.** Prioriza: tests E2E existentes, automatizaciones
   existentes, navegador/app real, comprobaciones dirigidas de persistencia y, solo
   para explicar lo observado, inspección técnica. Reutiliza herramientas actuales
   del proyecto; no impongas una concreta ni sustituyas la ejecución por leer código
   cuando el flujo pueda probarse.
6. **Controla las mutaciones QA.** Antes de crear entidades, busca una cuenta QA
   dedicada o fixtures sintéticos reutilizables y reutilízalos si no invalidan la
   prueba. Si necesitas datos nuevos, crea solo el mínimo mediante la misma UI/API
   del actor y hazlos identificables, por ejemplo con `QA_E2E_...`. Como referencia
   ordinaria: máximo un usuario QA nuevo, una mascota, un reporte y uno o dos
   avistamientos u objetos auxiliares; amplía esos límites solo si la naturaleza del
   escenario lo justifica explícitamente. No hagas generación masiva, fuzzing ni
   pruebas de volumen/carga sin una tarea específica. Nunca uses datos personales
   reales de terceros ni `service_role` para preparar o limpiar fixtures. No borres
   fixtures QA compartidos: limpia solo recursos creados por la ejecución actual
   cuando corresponda y conserva antes la evidencia de fallos. Al terminar informa
   exactamente qué datos creaste, reutilizaste, conservaste y eliminaste.
7. **Verifica el resultado, no solo la ausencia de error.** Según el criterio,
   comprueba UI/mensaje, URL y navegación, estado del componente, persistencia tras
   refrescar o reloguear, listado/feed/mapa/detalle, relaciones, Storage/imágenes,
   traducciones, duplicados, huérfanos, repetición de acciones, errores y recuperación.
   No declares éxito por una pantalla si el criterio exige estado persistido.
8. **Prueba negativos materiales.** Considera obligatorios, inválidos, doble envío,
   recurso inexistente, acción repetida, sesión ausente/expirada, atrás/refresh, error
   parcial, ausencia de imagen, datos existentes y estados incompatibles. No realices
   pruebas ofensivas; deriva indicios de seguridad a `buscohuella-security-rls-audit`.
9. **Registra evidencia por escenario:** precondición, acción, resultado esperado,
   resultado real, `PASS`/`FAIL`/`BLOCKED` y evidencia disponible. Para fallos añade
   paso exacto, actor, recurso, impacto, reproducibilidad y evidencia suficiente para
   que `buscohuella-delivery` pueda corregirlos.
10. **Clasifica y decide:** `P0` bloquea un flujo crítico o implica pérdida/corrupción
    o consecuencia crítica para Beta; `P1` afecta comportamiento importante del
    MVP/Beta o es regresión significativa; `P2` es menor y no bloqueante. Finaliza con:
    - `QA_BLOCKED`: falta una comprobación crítica o un entorno seguro demostrado;
    - `QA_NEEDS_FIXES`: existe al menos un P0 o P1 funcional reproducible;
    - `QA_PASS`: pasan los criterios E2E necesarios; documenta P2 y límites residuales.
    `QA_PASS` no implica `SECURITY_REVIEW_PASS`, `VERIFIED LIVE` ni `CLOSED`.

## Guardrails

- Código y repositorio permanecen `READ-ONLY`: no modificar código o tests, aplicar
  fixes, crear migraciones, cambiar schema/RLS/policies/Auth/infraestructura, hacer
  commit/push, usar stash, cambiar rama, ejecutar `git fetch`, crear ramas/worktrees,
  clones, repositorios o entornos locales, instalar dependencias ni generar artefactos
  dentro del repositorio.
- Datos de prueba mutables solo en `LOCAL` o `DEV/TEST`, con datos sintéticos, volumen
  mínimo y dentro del flujo autorizado. Verifica el entorno antes de mutarlos; no
  borres ni alteres datos reales ajenos o fixtures QA compartidos.
- `LIVE` y `service_role` están prohibidos. Una prueba que requiera privilegios
  especiales no puede hacerse pasar mediante bypass técnico.
- No crear proyectos Supabase, buckets, schemas, tablas, policies, infraestructura
  ni entornos para una QA ordinaria.
- No corrijas durante la prueba. Conserva evidencia antes de limpiar un fallo y
  devuelve la corrección a `buscohuella-delivery`.
- Detente si el entorno o la propiedad de los datos no están claramente identificados.
