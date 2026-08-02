# @buscohuella/pet-domain

Librería compartida y agnóstica de plataforma para el dominio de mascotas.

## Responsabilidades

- Tipos TypeScript.
- Constantes y límites.
- Esquemas Zod.
- Normalización de entradas.
- Errores de dominio.

## No contiene

- React.
- Next.js.
- Expo.
- Supabase.
- Consultas de red.
- Textos traducidos de interfaz.

## Comandos

```bash
pnpm --filter @buscohuella/pet-domain typecheck
pnpm --filter @buscohuella/pet-domain build
```

## Importación

```ts
import {
  createPetSchema,
  PET_LIMITS,
  type CreatePetData,
  type Pet,
} from '@buscohuella/pet-domain';
```
