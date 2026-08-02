# Architecture Decision Records

Este directorio contiene las decisiones arquitectónicas relevantes de BuscoHuella.

## Estados

- `Proposed`: pendiente de aprobación.
- `Accepted`: decisión vigente.
- `Deprecated`: ya no recomendada.
- `Superseded`: sustituida por otra ADR.
- `Rejected`: evaluada y descartada.

## Índice

| ADR | Decisión | Estado |
|---|---|---|
| [ADR-001](./ADR-001_STACK_TECNOLOGICO.md) | Stack tecnológico | Vigente |
| [ADR-002](./ADR-002_ESTRATEGIA_MOBILE.md) | Estrategia móvil | Vigente |
| [ADR-003](./ADR-003_SUPABASE.md) | Supabase | Vigente |
| [ADR-004](./ADR-004_FRONTEND_WEB.md) | Frontend web | Vigente |
| [ADR-005](./ADR-005_LIBRERIAS_DE_DOMINIO_COMPARTIDAS.md) | Librerías de dominio compartidas | Accepted |
| [ADR-006](./ADR-006_INTERNACIONALIZACION.md) | Estrategia de internacionalización | Accepted |
| [ADR-007](./ADR-007_ACCESIBILIDAD_COMO_REQUISITO.md) | Accesibilidad como requisito de calidad | Accepted |

## Cuándo crear una ADR

Se crea una ADR cuando una decisión:

- Afecta varias áreas o aplicaciones.
- Es difícil o costosa de revertir.
- Introduce una dependencia estructural.
- Define límites entre capas.
- Sustituye una decisión anterior.
- Necesita contexto para futuros desarrolladores.

Las decisiones pequeñas y locales deben documentarse en el código o en el Feature Pack correspondiente.
