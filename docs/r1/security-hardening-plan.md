# Plan de hardening R1

Estado: plan, sin SQL aplicado. Se conservan las prioridades del handoff; los detalles de diseño requieren contraste del esquema acumulado y pruebas.

## Reglas y preparación

Todo cambio Supabase debe quedar en migración versionada y PR. No ejecutar SQL manual en producción. Antes de diseñar: inventario de firmas RPC, vistas, grants efectivos/heredados, policies, triggers, dependencias y migraciones aplicadas. Comparar repositorio con entorno autorizado de solo lectura y ensayar cambios en local/staging. No editar migraciones ya aplicadas para ocultar drift.

No exponer claves privilegiadas, datos reales, microchip, notas privadas ni ubicación exacta en documentación, logs, HTML, metadata o respuestas públicas. Las pruebas usan identidades y mascotas sintéticas.

## R1-SEC-001 — public_profiles

Evidencia versionada: una migración activa semántica definer para lectura anónima mientras profiles tiene acceso anon revocado. La auditoría previa señala el Advisor.

Aceptación: perfil no público inaccesible; proyección pública mínima; visibilidad de avatar/municipio respetada; perfiles privados y campos sensibles inaccesibles a anon y otros usuarios; lectura pública legítima conservada; Advisor limpio o hallazgo explicado y revisado.

Conflicto a resolver antes del código: Drive propone security_invoker; Notion propone alternativamente RPC pública específica. Esta segunda opción ampliaría la allowlist del handoff, limitada a get_public_reports/get_public_report. No se adopta automáticamente. Elegir y documentar una solución que preserve privacidad sin conceder SELECT amplio sobre profiles ni romper RLS.

## R1-SEC-002 — anon, PUBLIC y funciones internas

Objetivo del handoff: anon solo invoca las RPC públicas de reportes. Las migraciones ya revocan varias RPC privadas; revisar todas las firmas y funciones creadas después. Hay helpers concedidos a anon: no revocarlos a ciegas si policies de fotografías/Storage dependen de ellos.

Aceptación: matriz de privilegios por firma; pruebas reales por rol; ausencia de EXECUTE público innecesario, incluido el heredado de PUBLIC; lectura pública y policies necesarias siguen funcionando. Si hacen falta cambios de exposición/esquema, documentar contrato y decisión antes de implementarlos.

## R1-SEC-003 — grants mínimos

Inventariar tablas, vistas, secuencias y privilegios por rol. Retirar TRUNCATE/TRIGGER/REFERENCES y escrituras innecesarias de clientes según uso real. Comprobar RLS y ownership por operación; no equiparar authenticated a propietario.

Aceptación: matriz antes/después, anon y usuario B sin acceso privado ni mutaciones indebidas, usuario A conserva sus operaciones; Storage y RPC no se rompen. No dar por cerrada seguridad solo porque RLS esté habilitado.

## R1-SEC-004 — Auth

Verificar leaked password protection y documentar disponibilidad/configuración o bloqueo del plan. No declarar activación sin evidencia. Los cambios de configuración que no sean SQL deben quedar trazados y reproducibles en el repositorio mediante el mecanismo admitido; no ejecutar cambios manuales de producción en esta fase.

## Dependencias de cierre

- R1-DATA-001: reconciliar inventario de migraciones GitHub/entorno; distinguir nombres distintos de cambios semánticos.
- R1-TYPES-001: regenerar ambos contratos desde el esquema validado, corregir consumidores/casts y verificar typecheck.
- R1-QA-001: anon, A/B, Storage, RPC y proyecciones públicas.
- R1-DATA-002: cleanup de fotografías y borrado reintentable.
- R1-INT-001: eventos/notificaciones sin duplicados.
- R1-PROD-001: eliminación de cuenta; matriz de dependencias, aportaciones a terceros, objetos, sesiones y errores parciales antes de implementación.

## Validación y entrega

Cada PR incluye migración cuando proceda, pruebas de permiso concedido y denegado, regresión funcional, impacto en datos y pasos de recuperación. Ejecutar Security Advisor después del hardening en el entorno de validación y justificar pendientes. La aplicación en producción requiere una entrega planificada; ni este documento ni un CI verde significan despliegue.
