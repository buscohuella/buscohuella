# BuscoHuella — App Shell

> Documentación técnica de FP-001 — App Shell responsive.

## 1. Propósito

El App Shell define la estructura permanente de la aplicación web de BuscoHuella.

Su objetivo es evitar que cada pantalla tenga que reconstruir:

- navegación;
- encabezado;
- sidebar;
- navegación móvil;
- espaciado principal;
- comportamiento responsive;
- estados activos.

Las páginas funcionales se renderizan dentro de esta estructura común.

## 2. Alcance de FP-001

FP-001 incluye:

- App Shell responsive;
- top bar;
- sidebar para escritorio;
- navegación inferior para móvil;
- acción central de reportar;
- contenedor de página;
- rutas iniciales;
- estados activos;
- soporte básico de accesibilidad;
- validación con lint y build.

FP-001 no incluye:

- autenticación;
- permisos;
- Supabase;
- mapa real;
- formularios de reporte;
- datos persistentes;
- notificaciones reales;
- menú funcional de reportes.

## 3. Estructura de archivos

```text
apps/web/src/
├── app/
│   ├── layout.tsx
│   └── (app)/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── mapa/page.tsx
│       ├── reportes/page.tsx
│       ├── mascotas/page.tsx
│       └── perfil/page.tsx
└── components/
    └── layout/
        ├── app-shell.tsx
        ├── app-sidebar.tsx
        ├── app-topbar.tsx
        ├── mobile-navigation.tsx
        ├── navigation-items.ts
        └── page-container.tsx
```

## 4. Route group `(app)`

La aplicación utiliza un route group de Next.js:

```text
src/app/(app)/
```

Los paréntesis organizan las rutas sin modificar la URL pública.

Ejemplos:

```text
src/app/(app)/page.tsx
→ /

src/app/(app)/mapa/page.tsx
→ /mapa
```

El layout del grupo envuelve las páginas con `AppShell`.

## 5. AppShell

Ubicación:

```text
apps/web/src/components/layout/app-shell.tsx
```

Responsabilidades:

- renderizar `AppSidebar`;
- reservar espacio lateral en escritorio;
- renderizar `AppTopbar`;
- crear el área principal;
- añadir espacio inferior en móvil;
- renderizar `MobileNavigation`.

El App Shell no debe contener reglas de negocio.

## 6. Sidebar de escritorio

Ubicación:

```text
apps/web/src/components/layout/app-sidebar.tsx
```

Visible desde el breakpoint `lg`.

Contiene:

- identidad BuscoHuella;
- navegación principal;
- estado activo;
- acción principal `Reportar`.

La detección de ruta activa utiliza `usePathname()`.

La ruta `/` requiere comparación exacta. Las demás rutas permiten coincidencia por prefijo.

## 7. Top bar

Ubicación:

```text
apps/web/src/components/layout/app-topbar.tsx
```

Responsabilidades actuales:

- mostrar la identidad compacta en móvil;
- mostrar el título;
- reservar una acción de notificaciones;
- reservar un menú móvil futuro.

El botón de menú permanece desactivado hasta que exista una necesidad funcional real.

## 8. Navegación móvil

Ubicación:

```text
apps/web/src/components/layout/mobile-navigation.tsx
```

Visible por debajo de `lg`.

Orden actual:

```text
Inicio · Mapa · Reportar · Mascotas · Perfil
```

La acción `Reportar` ocupa la posición central y se representa como botón elevado.

En FP-001 es visual. En un Feature Pack posterior abrirá opciones para:

- mascota perdida;
- mascota encontrada;
- avistamiento.

La navegación contempla el área segura inferior mediante:

```css
env(safe-area-inset-bottom)
```

## 9. Fuente de navegación

Ubicación:

```text
apps/web/src/components/layout/navigation-items.ts
```

La configuración central evita duplicar nombres, rutas e iconos.

Cada entrada define:

```ts
interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}
```

La navegación móvil y la de escritorio consumen la misma fuente.

## 10. PageContainer

Ubicación:

```text
apps/web/src/components/layout/page-container.tsx
```

Proporciona:

- ancho máximo común;
- separación horizontal responsive;
- separación vertical;
- extensión mediante `className`.

Uso:

```tsx
<PageContainer>
  {/* contenido de la página */}
</PageContainer>
```

Las páginas no deben repetir manualmente el contenedor principal salvo que una experiencia específica, como el mapa, necesite ocupar toda la superficie.

## 11. Rutas iniciales

| Ruta | Propósito actual |
|---|---|
| `/` | Dashboard provisional |
| `/mapa` | Placeholder del mapa |
| `/reportes` | Placeholder de reportes |
| `/mascotas` | Placeholder de mascotas |
| `/perfil` | Placeholder del perfil |

Estas rutas permiten validar arquitectura y navegación antes de conectar datos reales.

## 12. Responsive

### Móvil y tablet

- sidebar oculto;
- top bar compacta;
- contenido con padding lateral;
- navegación fija inferior;
- espacio inferior para evitar que el contenido quede oculto.

### Escritorio

- sidebar fija de `18rem`;
- contenido desplazado mediante `lg:pl-72`;
- navegación inferior oculta;
- top bar persistente;
- área principal amplia.

## 13. Accesibilidad

FP-001 incluye:

- landmarks `header`, `nav`, `main` y `aside`;
- `aria-label` en navegaciones;
- `aria-current="page"` en la ruta activa;
- nombres accesibles en botones solo con icono;
- iconos decorativos con `aria-hidden`;
- foco visible;
- objetivos táctiles amplios;
- contraste basado en tokens;
- soporte de reducción de movimiento heredado del Design System.

## 14. Scroll y navegación

El elemento raíz incluye:

```tsx
data-scroll-behavior="smooth"
```

Esto informa a Next.js de que el proyecto utiliza:

```css
scroll-behavior: smooth;
```

y evita avisos durante transiciones de ruta.

## 15. Validación realizada

Comandos:

```powershell
pnpm --filter @buscohuella/web lint
pnpm --filter @buscohuella/web build
```

Rutas generadas:

```text
/
/mapa
/reportes
/mascotas
/perfil
```

También se validó manualmente:

- navegación entre rutas;
- estado activo;
- sidebar;
- navegación móvil;
- ausencia de scroll horizontal;
- renderizado responsive;
- foco básico.

## 16. Incidencias conocidas

### LanguageTool y error de hidratación

En el navegador normal puede aparecer un aviso de hidratación causado por atributos añadidos por una extensión:

```text
data-lt-installed="true"
```

El aviso desaparece en incógnito y no pertenece al código de BuscoHuella.

No debe ocultarse mediante `suppressHydrationWarning`.

### Caché de Next.js tras mover la ruta raíz

Al mover `src/app/page.tsx` al route group, `.next/dev` conservó temporalmente tipos antiguos.

Solución aplicada:

```powershell
Remove-Item .pps\web\.next -Recurse -Force
```

Después, el build volvió a completarse correctamente.

## 17. Reglas para ampliar el App Shell

- no introducir lógica de dominio en `components/layout`;
- mantener la navegación centralizada;
- no duplicar sidebar o bottom navigation;
- conservar nombres accesibles;
- no añadir rutas fuera del MVP sin revisar alcance;
- documentar cambios estructurales;
- probar móvil y escritorio;
- ejecutar lint y build.

## 18. Próximos cambios previstos

Los siguientes Feature Packs podrán ampliar el shell con:

- usuario autenticado;
- avatar;
- cierre de sesión;
- notificaciones reales;
- protección de rutas;
- menú de reportes;
- badges;
- navegación según permisos;
- variantes para invitado u organización.

Estas ampliaciones deben preservar la estructura base creada en FP-001.

## 19. Estado

```text
Feature Pack: FP-001
Nombre: App Shell
Estado: Completado
Validación: lint + build + revisión manual
Siguiente: FP-002 — Autenticación
```
