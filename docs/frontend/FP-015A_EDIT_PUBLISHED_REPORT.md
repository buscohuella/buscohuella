# FP-015A — Edición de avisos publicados

Permite editar avisos en estado `ACTIVE` o `PAUSED`.

Campos editables:

- título;
- descripción;
- referencia pública de ubicación;
- modo de contacto;
- teléfono o correo públicos.

Campos inmutables tras publicar:

- tipo de aviso;
- mascota asociada;
- especie;
- creador.

Cada cambio efectivo registra un evento `UPDATED`.

La gestión de fotografías publicadas se implementará en FP-015B.
