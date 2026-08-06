# FP-013 — Publicación de avisos

## Flujo

`Fotografías → Revisar y publicar → Confirmar → ACTIVE`

## Seguridad

La transición se ejecuta mediante `publish_report_draft`, una función
`SECURITY DEFINER` que valida propietario, estado y requisitos mínimos.
También registra un evento `PUBLISHED` en la misma transacción.
