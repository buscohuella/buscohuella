# 📚 Documentación de BuscoHuella

Este índice es el **START HERE técnico** del repositorio. No duplica el estado vivo
del proyecto: enlaza a las fuentes canónicas.

## Empezar aquí

1. [`../AGENTS.md`](../AGENTS.md) — reglas permanentes para agentes y colaboradores.
2. [`master/DOCUMENTO_MAESTRO.md`](master/DOCUMENTO_MAESTRO.md) — fuente maestra de
   producto y alcance.
3. [`AI_WORKFLOW.md`](AI_WORKFLOW.md) — roles de IA, routing, Skills, modelos,
   contexto y herramientas.
4. [`project/DEVELOPMENT_WORKFLOW.md`](project/DEVELOPMENT_WORKFLOW.md) — flujo
   oficial de desarrollo e integración.
5. [`../ARCHITECTURE_OVERVIEW.md`](../ARCHITECTURE_OVERVIEW.md) — mapa de arquitectura.
6. [`../BUSCOHUELLA_CONTINUIDAD_IA.md`](../BUSCOHUELLA_CONTINUIDAD_IA.md) —
   bootstrap para recuperar contexto sin depender de conversaciones antiguas.

## Producto

- [`product/MVP_SCOPE.md`](product/MVP_SCOPE.md) — alcance del MVP.
- [`product/MVP_IMPLEMENTATION_ROADMAP.md`](product/MVP_IMPLEMENTATION_ROADMAP.md) —
  secuencia de implementación.
- [`product/ROADMAP.md`](product/ROADMAP.md) — roadmap de producto.
- [`product/USER_FLOWS.md`](product/USER_FLOWS.md) — flujos principales de usuario.

## Arquitectura y datos

- [`architecture/ARCHITECTURE.md`](architecture/ARCHITECTURE.md) — arquitectura
  detallada.
- [`database/DATABASE_SCHEMA.md`](database/DATABASE_SCHEMA.md) — modelo de datos.
- [`adr/`](adr/) — decisiones arquitectónicas.
- [`security/`](security/) — seguridad.
- [`identity/`](identity/) — identidad y autorización.
- [`data/`](data/) — reglas y documentación de datos.

## Desarrollo transversal

- [`project/CROSS_CUTTING_REQUIREMENTS.md`](project/CROSS_CUTTING_REQUIREMENTS.md) —
  requisitos transversales.
- [`project/FEATURE_PACK_DEFINITION_OF_DONE.md`](project/FEATURE_PACK_DEFINITION_OF_DONE.md) —
  Definition of Done de Feature Packs.
- [`frontend/`](frontend/) — documentación web/frontend.
- [`ux/`](ux/) — UX y accesibilidad.
- [`devops/`](devops/) — desarrollo, despliegue y operaciones.

## Estado vivo y operación

El estado actual **no se mantiene copiándolo en este índice**.

Consultar:

- **Notion Command Center** — producto, operación y prioridades;
- **Execution** — trabajo vigente;
- **Milestones & Roadmap** — hitos;
- **Project Journal** — memoria cronológica y decisiones aplicadas;
- **GitHub** — verdad técnica verificable.

Si un documento histórico contradice estas fuentes, no asumir que sigue vigente:
reconciliarlo antes de actuar.

## IA y agentes

Skills activas:

```text
.agents/skills/buscohuella-delivery/
.agents/skills/buscohuella-independent-audit/
.agents/skills/buscohuella-security-rls-audit/
.agents/skills/buscohuella-qa-e2e/
.agents/skills/buscohuella-integration/
.agents/skills/buscohuella-supabase-rollout/
```

No crear nuevas Skills ni añadir herramientas o agentes preventivamente. Antes debe
existir un procedimiento real, repetitivo, estable y con beneficio medible.
