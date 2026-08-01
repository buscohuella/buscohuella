# BuscoHuella — Design System

> Sistema visual canónico para la aplicación web y referencia común para la futura aplicación móvil.

## 1. Propósito

Este documento define las decisiones visuales consolidadas de BuscoHuella.

Su objetivo es mantener una experiencia:

- coherente entre pantallas;
- reconocible entre la web pública, la aplicación web y la futura app móvil;
- accesible conforme a WCAG 2.2 AA;
- fácil de mantener y ampliar;
- independiente de colores o estilos escritos de forma arbitraria.

La implementación actual vive principalmente en:

```text
apps/web/src/app/globals.css
apps/web/src/components/ui/
apps/web/src/lib/utils.ts
```

## 2. Alcance de producto

| Superficie | Propósito |
| --- | --- |
| `buscohuella.es` | Web pública, marketing, SEO, blog, contacto y lista de espera |
| `app.buscohuella.es` | Aplicación web funcional y responsive |
| iOS / Android | Aplicación móvil nativa futura |

Las tres superficies deben compartir identidad, lenguaje y reglas visuales. No tienen que compartir literalmente todos sus componentes.

## 3. Principios visuales

### 3.1 Claridad antes que decoración

Cada elemento debe ayudar a comprender, decidir o actuar. Los efectos visuales no deben competir con reportes urgentes, información de localización, formularios o estados de una mascota.

### 3.2 Blanco como superficie dominante

La interfaz utiliza fondos blancos y superficies grises suaves. El verde se reserva para marca, acciones principales, selección y estados positivos.

### 3.3 Color semántico

Los colores se eligen por función, no por pantalla.

Correcto:

```tsx
className="bg-primary text-white"
```

Evitar:

```tsx
className="bg-emerald-600 text-white"
```

### 3.4 Mobile-first y responsive

- Móvil: top bar, contenido vertical, navegación inferior y acción central.
- Escritorio: sidebar, top bar y área principal.
- Mapa: superficie principal con controles superpuestos y paneles adaptativos.

### 3.5 Accesibilidad desde el diseño

Todos los componentes deben contemplar contraste, foco visible, teclado, etiquetas accesibles, estados que no dependan solo del color, reducción de movimiento y mensajes de error comprensibles.

## 4. Tokens oficiales

La fuente canónica está en:

```text
apps/web/src/app/globals.css
```

### 4.1 Marca

| Token | Valor actual | Uso |
| --- | ---: | --- |
| `--primary` | `#047857` | Acción principal, selección activa y enlaces funcionales |
| `--primary-hover` | `#065F46` | Hover y estado presionado |
| `--primary-soft` | `#ECFDF5` | Fondos suaves e iconos |
| `--accent` | `#E67E22` | Acentos y señalización no crítica |
| `--accent-hover` | `#B25E09` | Variante accesible del acento |
| `--accent-soft` | `#FFF7ED` | Fondo suave del acento |

La marca histórica también utiliza un verde más brillante. Puede mantenerse en recursos de marca o ilustraciones, pero las acciones con texto blanco deben utilizar una variante con contraste suficiente.

### 4.2 Superficies

| Token | Valor |
| --- | ---: |
| `--background` | `#FFFFFF` |
| `--surface` | `#F5F6F7` |
| `--surface-elevated` | `#FFFFFF` |

### 4.3 Texto

| Token | Valor | Uso |
| --- | ---: | --- |
| `--foreground` | `#1C1C1E` | Texto principal y títulos |
| `--muted-foreground` | `#4B5563` | Descripciones y texto secundario |
| `--subtle-foreground` | `#6B7280` | Placeholder y metadatos |

### 4.4 Bordes

| Token | Valor |
| --- | ---: |
| `--border` | `#A3A3A3` |
| `--border-soft` | `#E5E7EB` |

### 4.5 Estados

| Token | Valor | Uso |
| --- | ---: | --- |
| `--success` | `#047857` | Confirmaciones |
| `--warning` | `#B25E09` | Advertencias |
| `--danger` | `#B91C1C` | Error, eliminación y peligro |
| `--info` | `#1D4ED8` | Información neutral |
| `--focus` | `#047857` | Indicador de foco |
| `--disabled` | `#D1D5DB` | Controles desactivados |

## 5. Forma

### 5.1 Radios

| Token | Valor |
| --- | ---: |
| `--radius-sm` | `0.5rem` |
| `--radius-md` | `0.75rem` |
| `--radius-lg` | `1rem` |
| `--radius-xl` | `1.5rem` |
| `--radius-full` | `9999px` |

Uso recomendado:

- inputs: `rounded-lg`;
- tarjetas: `rounded-xl`;
- botones principales: `rounded-full`;
- bottom sheets: radios grandes en el borde superior.

### 5.2 Sombras

| Token | Uso |
| --- | --- |
| `--shadow-sm` | Separación mínima |
| `--shadow-md` | Tarjetas elevadas y acción principal |
| `--shadow-lg` | Navegación flotante, modales o paneles |

Las sombras deben ser discretas. Los resplandores intensos se reservan para acciones excepcionales.

## 6. Tipografía

La dirección visual de marca utiliza Inter para interfaz y Poppins para encabezados de marca.

La aplicación nueva todavía mantiene la configuración tipográfica inicial de Next.js. La migración definitiva de fuentes se hará como cambio separado.

Reglas:

- cuerpo mínimo de `16px`;
- evitar texto esencial inferior a `14px`;
- títulos con alto contraste;
- no usar peso ligero para contenido importante;
- mantener longitudes de línea legibles.

## 7. Movimiento

Se permiten animaciones para feedback, continuidad espacial, confirmación, paneles, cambios de estado y carga.

No se trasladan automáticamente a la app las animaciones decorativas de la landing.

La aplicación respeta `prefers-reduced-motion`.

## 8. Navegación

### Móvil

```text
Inicio · Mapa · Reportar · Mascotas · Perfil
```

La acción central debe comunicar claramente que sirve para reportar y puede desplegar:

- mascota perdida;
- mascota encontrada;
- avistamiento.

### Escritorio

La navegación inferior se sustituye por sidebar, top bar, área principal y paneles laterales cuando proceda.

## 9. Patrones previstos

- App Shell;
- top bar;
- sidebar;
- navegación móvil;
- floating action button;
- bottom sheet;
- segmented control;
- empty state;
- form field;
- search bar;
- badge de estado;
- controles del mapa;
- alertas;
- skeletons.

Cada patrón nuevo se documentará cuando se consolide.

## 10. Reglas de uso

### Hacer

- reutilizar componentes de `components/ui`;
- utilizar tokens semánticos;
- probar móvil y escritorio;
- validar foco con teclado;
- incluir estados vacíos, carga y error;
- ejecutar lint y build;
- actualizar la documentación al consolidar patrones.

### Evitar

- colores directos sin justificación;
- sombras diferentes en cada pantalla;
- componentes duplicados;
- acciones importantes solo mediante iconos sin nombre accesible;
- texto gris demasiado claro;
- animaciones permanentes que distraigan;
- introducir funciones futuras en pantallas del MVP.

## 11. Fuera del MVP inmediato

Los diseños históricos incluyen conceptos valiosos que ahora quedan fuera de alcance:

- chat;
- puntos y logros;
- premium;
- dispositivos;
- donaciones;
- noticias;
- gamificación;
- IA.

## 12. Validación obligatoria

```powershell
pnpm --filter @buscohuella/web lint
pnpm --filter @buscohuella/web build
```

También se verifica:

- navegación con `Tab`;
- diseño móvil;
- diseño de escritorio;
- contraste;
- estados disabled y error;
- navegador incógnito cuando una extensión altera el DOM.

---

## Estrategias transversales relacionadas

Este Design System debe aplicarse junto con:

```text
docs/ux/ACCESSIBILITY_STRATEGY.md
docs/frontend/I18N_AND_THEME_STRATEGY.md
docs/project/CROSS_CUTTING_REQUIREMENTS.md
docs/project/FEATURE_PACK_DEFINITION_OF_DONE.md
```

Relación entre documentos:

- `DESIGN_SYSTEM.md` define el lenguaje visual y los componentes.
- `ACCESSIBILITY_STRATEGY.md` define cómo garantizar una experiencia inclusiva.
- `I18N_AND_THEME_STRATEGY.md` define la preparación para idiomas y temas.
- `CROSS_CUTTING_REQUIREMENTS.md` establece requisitos comunes de producto y tecnología.
- `FEATURE_PACK_DEFINITION_OF_DONE.md` convierte dichos requisitos en una validación obligatoria.

Cualquier componente nuevo debe respetar estos documentos desde su diseño inicial.
