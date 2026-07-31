# BuscoHuella — Component Guidelines

> Convenciones para crear, ampliar y utilizar componentes en la aplicación web.

## 1. Objetivo

Estas reglas evitan que la interfaz evolucione como una colección de componentes aislados.

Cada componente debe ser:

- reutilizable;
- predecible;
- accesible;
- tipado;
- responsive;
- coherente con el Design System;
- sencillo de probar y mantener.

## 2. Ubicación de componentes

```text
apps/web/src/
├── components/
│   ├── ui/          # Primitivas visuales reutilizables
│   └── layout/      # App Shell, navegación y estructura
├── features/        # Componentes ligados a una funcionalidad
├── hooks/
├── lib/
└── types/
```

### `components/ui`

Contiene primitivas sin reglas de negocio:

- Button;
- Card;
- Input;
- Badge;
- Dialog;
- Sheet;
- EmptyState.

### `components/layout`

Contiene estructura transversal:

- AppShell;
- AppSidebar;
- AppTopbar;
- MobileNavigation;
- PageContainer.

### `features`

Contiene UI y lógica específica de dominio:

```text
features/pets/
features/reports/
features/map/
features/sightings/
features/profile/
```

Un componente de `features/pets` puede usar `Button`, pero `Button` nunca debe depender de `features/pets`.

## 3. Utilidad `cn()`

Ubicación:

```text
apps/web/src/lib/utils.ts
```

Uso:

```tsx
import { cn } from '@/lib/utils';

<div className={cn('base', condition && 'conditional', className)} />
```

`cn()` combina clases condicionales con `clsx` y resuelve conflictos de Tailwind con `tailwind-merge`.

## 4. API de componentes

### 4.1 Props explícitas

Las variantes deben representarse con uniones tipadas.

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
```

Evitar:

```ts
variant?: string;
```

### 4.2 Extender elementos nativos

Cuando proceda, el componente debe heredar atributos del elemento HTML.

```ts
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}
```

Esto conserva eventos, ARIA, `disabled`, `required`, autocompletado e integración con formularios.

### 4.3 `forwardRef`

Las primitivas de formulario e interacción deben exponer su referencia cuando pueda ser necesaria para foco, formularios, accesibilidad, medición o tests.

### 4.4 Valores predeterminados

Los defaults deben ser seguros:

```tsx
variant = 'primary'
size = 'md'
type = 'button'
```

El botón usa `type="button"` por defecto para evitar envíos accidentales.

## 5. Componentes consolidados

### 5.1 Button

Ubicación:

```text
apps/web/src/components/ui/button.tsx
```

Variantes:

| Variante | Uso |
|---|---|
| `primary` | Acción principal |
| `secondary` | Acción alternativa visible |
| `ghost` | Acción discreta o iconográfica |
| `danger` | Eliminación o acción destructiva |

Tamaños:

| Tamaño | Uso |
|---|---|
| `sm` | Controles compactos y top bars |
| `md` | Uso general |
| `lg` | CTA o acción principal móvil |

Ejemplo:

```tsx
<Button size="lg">Añadir mascota</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="danger">Eliminar cuenta</Button>
```

Reglas:

- una pantalla debe tener una acción primaria dominante;
- no usar `danger` para advertencias no destructivas;
- los botones solo con icono requieren `aria-label`;
- mantener disabled y foco visible;
- el texto debe describir la acción.

### 5.2 Card

Ubicación:

```text
apps/web/src/components/ui/card.tsx
```

Subcomponentes:

- `Card`;
- `CardHeader`;
- `CardTitle`;
- `CardDescription`;
- `CardContent`;
- `CardFooter`.

Ejemplo:

```tsx
<Card elevated>
  <CardHeader>
    <CardTitle>Mis mascotas</CardTitle>
    <CardDescription>Gestiona tu familia animal.</CardDescription>
  </CardHeader>
  <CardContent>{/* contenido */}</CardContent>
  <CardFooter>{/* acciones */}</CardFooter>
</Card>
```

Reglas:

- no usar tarjetas para cada fragmento;
- reservar `elevated` para jerarquía real;
- no anidar tarjetas sin razón clara;
- separar visualmente acciones del footer;
- usar títulos breves.

### 5.3 Input

Ubicación:

```text
apps/web/src/components/ui/input.tsx
```

Ejemplo:

```tsx
<label htmlFor="pet-name">Nombre</label>
<Input id="pet-name" name="name" autoComplete="off" />
```

Ejemplo con error:

```tsx
<Input
  id="email"
  type="email"
  hasError
  aria-describedby="email-error"
/>
<p id="email-error">Introduce un correo válido.</p>
```

Reglas:

- todo input debe tener label visible salvo patrón accesible justificado;
- placeholder no sustituye al label;
- los errores deben expresarse con texto;
- `hasError` establece `aria-invalid`;
- usar `aria-describedby`;
- utilizar tipos HTML correctos;
- definir `autoComplete` cuando corresponda;
- no impedir pegar contraseñas o correos.

## 6. Estilos

### 6.1 Tokens semánticos

Usar:

```text
bg-primary
text-foreground
text-muted-foreground
border-border
bg-surface
text-danger
```

Evitar colores de paleta directos salvo una visualización de datos documentada.

### 6.2 Extensión mediante `className`

Los componentes admiten `className`, pero la extensión no debe romper foco, contraste, área táctil, disabled ni semántica.

### 6.3 Transiciones

Declarar propiedades específicas:

```text
transition-[background-color,color,border-color,opacity,transform]
```

Evitar `transition-all` en primitivas reutilizables.

## 7. Accesibilidad

Todo componente interactivo debe verificar:

- teclado;
- foco visible;
- nombre accesible;
- disabled;
- contraste;
- semántica HTML;
- tamaño táctil;
- reducción de movimiento.

### Iconos

Decorativos:

```tsx
aria-hidden="true"
```

Botones solo con icono:

```tsx
aria-label="Ver notificaciones"
```

### Errores

No utilizar únicamente borde rojo. Mostrar mensaje, `aria-invalid` y relación con `aria-describedby`.

## 8. Responsive

Los componentes no deben asumir una anchura fija de teléfono.

Reglas:

- mobile-first;
- `w-full` cuando el flujo lo necesite;
- layouts con grid o flex;
- evitar alturas fijas para texto traducible;
- probar textos largos;
- ocultar navegación móvil en escritorio;
- ocultar sidebar en tamaños pequeños.

## 9. Internacionalización

Idiomas previstos:

```text
es, ca, eu, gl, en
```

Por tanto:

- no diseñar botones con anchuras rígidas;
- evitar concatenar frases traducidas;
- preparar labels para crecer;
- no mostrar claves de traducción;
- mantener textos provisionales fuera de producción.

## 10. Comentarios en código

Los comentarios explican el motivo, no repiten el código.

Útil:

```ts
// Evita que el botón envíe accidentalmente formularios.
type = 'button'
```

Evitar:

```ts
// Pone el fondo verde.
'bg-primary'
```

## 11. Nuevos componentes

Antes de crear una primitiva:

1. buscar si ya existe;
2. decidir si pertenece a `ui`, `layout` o `features`;
3. definir variantes mínimas;
4. verificar accesibilidad;
5. usar tokens;
6. añadir un ejemplo real;
7. ejecutar lint y build;
8. documentar el patrón si es transversal.

## 12. Criterio de finalización

Un componente no está terminado hasta que:

- compila;
- pasa lint;
- funciona con teclado;
- tiene estados relevantes;
- responde en móvil y escritorio;
- usa tokens;
- respeta las dependencias entre capas;
- queda documentado si crea una convención nueva.

Validación:

```powershell
pnpm --filter @buscohuella/web lint
pnpm --filter @buscohuella/web build
```
