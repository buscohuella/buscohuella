# @buscohuella/pet-data

Capa de acceso a datos del dominio de mascotas.

## Incluye

- Tipos generados desde Supabase.
- Tipos de filas, inserciones y actualizaciones.
- Mapeadores `snake_case` ↔ dominio.
- Repositorio CRUD.
- Normalización de errores.

## Dependencias

- `@buscohuella/pet-domain`
- `@supabase/supabase-js`

## No incluye

- React.
- Componentes.
- Formularios.
- Traducciones.
- Creación global del cliente Supabase.

La aplicación inyecta un `SupabaseClient<Database>` ya configurado.

## Validación

```bash
pnpm --filter @buscohuella/pet-data typecheck
pnpm --filter @buscohuella/pet-data test
```
