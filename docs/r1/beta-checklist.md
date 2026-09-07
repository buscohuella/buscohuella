# Checklist Beta R1

Estado inicial: sin validación R1 ejecutada. Cada casilla requiere evidencia, fecha, entorno, commit y responsable; completar documentación no habilita Beta automáticamente.

## Preparación R1.0

- [ ] PR documental con los siete archivos revisado.
- [ ] Archivo accidental de less eliminado en commit de limpieza.
- [ ] Issues enlazados, dependencias y prioridades visibles.
- [ ] Notion y Drive enlazan el estado real de la entrega.
- [ ] 11 commits locales preservados y excluidos del PR documental.

## Beta privada pequeña

- [ ] Alcance web ES/CA congelado y pendientes explicados.
- [ ] Smoke de los recorridos críticos ejecutado con datos sintéticos.
- [ ] Testers de confianza, instrucciones y canal de incidencias preparados.
- [ ] Responsable y criterio para detener la prueba definidos.
- [ ] Sin exposición conocida de datos privados; una Beta privada no exime de resolver fallos de acceso.
- [ ] Documentadas las limitaciones de FOUND_ANIMAL y eliminación de cuenta.

## Beta privada ampliada

- [ ] public_profiles, RPC anon y grants corregidos y probados.
- [ ] Tests A/B y Storage negativos/positivos pasan.
- [ ] Tipos y migraciones reconciliados en entorno seguro.
- [ ] E2E mínimo y flujos principales estables.
- [ ] No hay P0 de seguridad o integridad abierto en el alcance ofrecido.
- [ ] Errores parciales de borrado son visibles y reintentables.

## Beta pública

- [ ] Todo lo anterior validado.
- [ ] Advisor ejecutado; hallazgos restantes documentados y revisados.
- [ ] Microchip, notas privadas y exact_location ausentes de API pública, HTML, metadata y logs.
- [ ] Allowlist RPC anónima comprobada por firma; funciones internas no invocables innecesariamente.
- [ ] Storage privado según contrato, URLs firmadas y pruebas de enumeración/acceso cruzado.
- [ ] Eliminar cuenta resuelto o decisión temporal explícita, operativa y revisada.
- [ ] FOUND_ANIMAL completo o exclusión Beta explícita, sin promesas contradictorias.
- [ ] Cleanup de Storage y eventos/notificaciones sin duplicación validados.
- [ ] robots/sitemap/noindex y canonical de rutas reales comprobados.
- [ ] Política de indexación de reportes/perfiles públicos decidida.
- [ ] Metadata/OG/Twitter y alternates ES/CA revisados en HTML servido.
- [ ] Consistencia de claves ES/CA pasa.
- [ ] Auditoría básica WCAG 2.2 AA sobre componentes y flujos realizada.
- [ ] CI y E2E pasan; auditoría de dependencias y secretos gestionada.
- [ ] Runbook, soporte, recuperación y plan de despliegue preparados.

## Después de validar R1

Preparar el nuevo Documento Maestro y reconciliar documentación antigua mediante revisión separada. No mover ni borrar documentos históricos como efecto automático de completar esta checklist.
