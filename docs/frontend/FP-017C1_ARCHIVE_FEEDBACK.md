# FP-017C.1 — Feedback de archivado/restaurado

Añade feedback visible y accesible después de archivar o restaurar un
avistamiento.

## Comportamiento

- muestra estado de procesamiento;
- confirma archivado;
- confirma restauración;
- muestra error específico si la RPC falla;
- ES/CA;
- no introduce una librería nueva de toast;
- conserva la Server Action y la revalidación existente.

El componente utiliza `useActionState`, `role=status` para éxito y `role=alert`
para error.
