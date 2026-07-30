# DECISIÓN TÉCNICA: Angular vs Next.js para el Frontend PWA
## BuscoHuella MVP — Architecture Decision Record (ADR-001)

**Fecha**: 30 de julio de 2026  
**Estado**: Propuesta (pendiente de decisión por Xavier)  
**Decisores**: Xavier Quesada (CEO/Full-Stack Dev)  
**Consultores**: Agentes IA (Kimi, Codex, Gemini)

---

## 1. CONTEXTO Y PROBLEMA

BuscoHuella necesita un **frontend web progresivo (PWA)** para el MVP. El backend ya está definido (Symfony API REST + PostgreSQL). La pregunta es:

&gt; **¿Qué tecnología frontend nos permite lanzar el MVP más rápido, con mejor rendimiento, y con una base sólida para escalar?**

### Restricciones del proyecto

| Restricción | Impacto en la decisión |
|-------------|------------------------|
| **1 desarrollador** (Xavier) | Necesita velocidad de desarrollo, no complejidad innecesaria |
| **0 € de presupuesto** | Hosting gratuito, herramientas gratuitas |
| **Backend Symfony API** | El frontend solo consume JSON. No hay acoplamiento tecnológico. |
| **PWA requerida** | Debe funcionar como app instalable en móviles |
| **SEO deseable** | Queremos que "perro perdido Sabadell" indexe en Google |
| **Mapas interactivos** | Leaflet + geolocalización GPS |
| **Lanzamiento en 6-8 semanas** | No hay tiempo para aprender un framework desde cero |

### Contexto adicional: ¿Qué código frontend tienes hoy?

Esta decisión depende CRÍTICAMENTE de tu situación actual:

| Situación | Recomendación |
|-----------|---------------|
| **Tienes código Angular funcional** (componentes, routing, servicios) | **Mantén Angular**. No tires trabajo hecho. |
| **Tienes código Angular incompleto/roto** (prototipo, no compila) | **Evalúa coste de reparar vs. rehacer en Next.js** |
| **No tienes nada de frontend** o es solo HTML estático | **Next.js**. Más rápido para empezar desde cero. |
| **Tienes experiencia previa con React** | **Next.js**. Aprovechas lo que ya sabes. |

&gt; **Si no estás seguro de cuál es tu situación, abre tu carpeta `frontend/` y dime: ¿hay componentes `.ts` de Angular? ¿Compila? ¿Hay routing?**

---

## 2. OPCIONES EVALUADAS

### Opción A: Angular (con tu arquitectura actual)

**Descripción**: Mantener o reanudar el desarrollo en Angular (v16+), usando la estructura que ya definiste en tu documento de arquitectura.

**Stack propuesto**:
- Angular 16+ (standalone components)
- Angular Material o Tailwind CSS
- Angular PWA (@angular/pwa)
- Leaflet (ngx-leaflet)
- Angular JWT (@auth0/angular-jwt)

### Opción B: Next.js (App Router)

**Descripción**: Desarrollar el frontend en Next.js 14+ con App Router, aprovechando SSR/SSG y el ecosistema React.

**Stack propuesto**:
- Next.js 14+ (App Router)
- React Server Components + Client Components
- Tailwind CSS + shadcn/ui
- next-pwa (para PWA)
- react-leaflet
- next-auth o JWT manual

### Opción C: Next.js (Pages Router) — descartada

El Pages Router de Next.js está en modo legacy. App Router es el estándar desde 2023. No recomendamos empezar un proyecto nuevo con Pages Router.

---

## 3. COMPARATIVA DETALLADA

### 3.1 Velocidad de desarrollo (MVP)

| Aspecto | Angular | Next.js | Ganador |
|---------|---------|---------|---------|
| **Configuración inicial** | `ng new` + módulos + routing + HTTP client = 15 min | `npx create-next-app` = 2 min | Next.js |
| **Crear un componente** | 3 archivos (ts, html, css) + declaración en módulo | 1 archivo (tsx) | Next.js |
| **Consumir API REST** | HttpClient + servicios + observables | `fetch()` o `axios` directamente | Next.js |
| **Routing** | Configuración en `app-routing.module.ts` | Convención de carpetas (`app/page.tsx`) | Next.js |
| **Formularios** | Reactive Forms (potente pero verboso) | React Hook Form (ligero, rápido) | Next.js |
| **Estado global** | NgRx / Services (complejo) | Zustand / Context (simple) | Next.js |
| **PWA** | `@angular/pwa` (funciona bien) | `next-pwa` (funciona bien) | Empate |
| **Tiempo estimado para MVP** | 6-8 semanas | 4-6 semanas | **Next.js** |

&gt; **Veredicto**: Next.js es más rápido para un MVP porque elimina boilerplate y tiene un ecosistema de herramientas más ágil.

### 3.2 Rendimiento y UX

| Aspecto | Angular | Next.js | Ganador |
|---------|---------|---------|---------|
| **Bundle size inicial** | ~150-200 KB (pesado) | ~80-120 KB (optimizado automáticamente) | Next.js |
| **Tiempo de carga** | SPA: todo el JS se descarga antes | SSR: HTML primero, JS después (perceived performance) | Next.js |
| **SEO** | SSR posible (Angular Universal) pero complejo | SSR/SSG nativo, sin configuración extra | **Next.js** |
| **Core Web Vitals** | Requiere optimización manual | Optimizado por defecto (Next.js hace code splitting automático) | Next.js |
| **PWA installable** | ✅ Sí (service worker automático) | ✅ Sí (con next-pwa) | Empate |
| **Offline functionality** | ✅ Sí (caching automático) | ✅ Sí (configurable) | Empate |
| **Geolocalización GPS** | ✅ Navigator.geolocation | ✅ Navigator.geolocation | Empate |
| **Mapas (Leaflet)** | ngx-leaflet (wrapper) | react-leaflet (wrapper) | Empate |

&gt; **Veredicto**: Next.js gana claramente en SEO y rendimiento inicial. Para un MVP donde queremos indexar en Google ("perro perdido Sabadell"), SSR es una ventaja masiva.

### 3.3 Ecosistema y mantenimiento

| Aspecto | Angular | Next.js | Ganador |
|---------|---------|---------|---------|
| **Popularidad** | Enterprise, bancos, grandes corporaciones | Startups, scale-ups, proyectos modernos | Next.js (más demanda) |
| **Desarrolladores disponibles** | Menos, más caros, perfil senior | Más, más baratos, perfil junior/medio | Next.js |
| **Documentación** | Excelente, oficial, en español | Excelente, oficial, en inglés | Empate |
| **Comunidad** | Grande pero más conservadora | Enorme, muy activa, muchos recursos | Next.js |
| **Paquetes npm compatibles** | Específicos de Angular | Cualquier paquete de React (millones) | Next.js |
| **Herramientas UI** | Angular Material, PrimeNG, Tailwind | shadcn/ui, Radix, Tailwind, Chakra, MUI | Next.js |
| **Curva de aprendizaje** | Alta (RxJS, Dependency Injection, módulos) | Media (React + convenciones de Next.js) | Next.js |
| **Actualizaciones** | Difíciles (cambios breaking frecuentes) | Más suaves | Next.js |

&gt; **Veredicto**: Next.js tiene un ecosistema más amplio y es más fácil encontrar desarrolladores. Angular es más "enterprise" pero más rígido.

### 3.4 Integración con Symfony Backend

| Aspecto | Angular | Next.js | Ganador |
|---------|---------|---------|---------|
| **Consumo de API REST** | HttpClient + interceptors | `fetch()` nativo o axios | Empate |
| **JWT Auth** | @auth0/angular-jwt | next-auth o manual | Empate |
| **Tipado de API** | Generar interfaces desde OpenAPI | Generar interfaces desde OpenAPI | Empate |
| **Compartir tipos** | DTOs duplicados (frontend/backend) | DTOs duplicados (frontend/backend) | Empate |

&gt; **Veredicto**: Empate total. El backend es agnóstico al frontend.

### 3.5 Costes y Hosting

| Aspecto | Angular | Next.js | Ganador |
|---------|---------|---------|---------|
| **Build output** | Static files (HTML/JS/CSS) | Static files o SSR (Node.js) | Empate |
| **Hosting gratuito** | Vercel, Netlify, GitHub Pages | Vercel (optimizado para Next.js), Netlify | Next.js |
| **Coste hosting producción** | 0 € (static hosting) | 0 € (Vercel hobby) | Empate |
| **CI/CD** | GitHub Actions | GitHub Actions + Vercel (automático) | Next.js |

&gt; **Veredicto**: Empate en coste. Next.js tiene ventaja en Vercel (deploy automático, previews por PR).

### 3.6 Escalabilidad futura

| Aspecto | Angular | Next.js | Ganador |
|---------|---------|---------|---------|
| **App nativa (React Native)** | Migración completa (Ionic es híbrida, no nativa) | Reutilización de lógica React (más fácil migrar a RN) | Next.js |
| **Panel de administración** | Angular es ideal para dashboards | Next.js también funciona bien | Angular (ligera ventaja) |
| **Equipo grande (&gt;5 devs)** | Arquitectura estricta, buena para equipos | Más flexible, requiere disciplina | Angular |
| **Mantenimiento a largo plazo** | Google lo mantiene (garantía de largo plazo) | Vercel lo mantiene (empresa privada) | Angular (ligera ventaja) |

&gt; **Veredicto**: Next.js es mejor para la transición a React Native (Fase 2). Angular es mejor para equipos grandes y dashboards.

---

## 4. ANÁLISIS PARA EL CASO BUSCOHUELLA

### ¿Qué necesitamos realmente?

| Necesidad | Angular | Next.js | Prioridad |
|-----------|---------|---------|-----------|
| Lanzar en 6 semanas | ⚠️ Posible | ✅ Más probable | 🔴 Crítica |
| SEO para "perro perdido Sabadell" | ⚠️ Complicado (requiere Universal) | ✅ Nativo | 🔴 Crítica |
| PWA instalable | ✅ Fácil | ✅ Fácil | 🟡 Alta |
| Mapa con Leaflet | ✅ Fácil | ✅ Fácil | 🟡 Alta |
| Auth JWT | ✅ Fácil | ✅ Fácil | 🟡 Alta |
| Encontrar devs en el futuro | ⚠️ Más difícil | ✅ Más fácil | 🟡 Alta |
| Reutilizar código para app nativa | ❌ No | ✅ Sí (React Native) | 🟢 Media |
| Dashboard admin (futuro) | ✅ Ideal | ⚠️ Funciona | 🟢 Media |

### Escenarios de decisión

#### Escenario 1: "Tengo código Angular que funciona"

**Decisión: Mantén Angular.**

No tires código que ya compila. El coste de rehacerlo en Next.js (2-3 semanas) no compensa la mejora. Angular es una tecnología sólida y el MVP saldrá bien.

**Acciones**:
1. Audita tu código Angular actual: ¿qué funciona? ¿qué está roto?
2. Si el 60%+ funciona, continúa con Angular.
3. Añade `@angular/pwa` para convertirlo en PWA.
4. Configura Angular Universal (SSR) SOLO si el SEO es crítico y tienes tiempo.

#### Escenario 2: "Tengo código Angular pero está roto/incompleto"

**Decisión: Evalúa el coste de reparación.**

- Si repararlo lleva &lt; 1 semana → Repara Angular.
- Si repararlo lleva &gt; 2 semanas → Considera Next.js. Es más rápido empezar de cero en Next.js que arreglar un Angular roto.

#### Escenario 3: "No tengo nada de frontend o es solo HTML estático"

**Decisión: Next.js.**

Sin duda. Es la opción más rápida, con mejor SEO, y mejor preparada para escalar a app nativa.

#### Escenario 4: "Sé React pero no Angular"

**Decisión: Next.js.**

Aprovecha tu conocimiento existente. No aprendas Angular solo para este proyecto.

---

## 5. RECOMENDACIÓN OFICIAL

### Recomendación condicional

| Si tu situación es... | Recomendación | Justificación |
|-----------------------|---------------|---------------|
| Código Angular funcional | **Angular** | No tires trabajo hecho. El MVP saldrá bien. |
| Código Angular roto/incompleto | **Next.js** | Más rápido rehacer que reparar. Mejor SEO. |
| Sin frontend o HTML estático | **Next.js** | Velocidad de desarrollo superior. |
| Experiencia previa con React | **Next.js** | Aprovechas conocimiento. Menos curva. |

### Mi recomendación personal (como consultor)

&gt; **Si no tienes un frontend Angular que funcione HOY, usa Next.js.**

**Razones**:
1. **SEO nativo**: Queremos que la gente busque "perro perdido Sabadell" y aparezca BuscoHuella. Con Angular SPA, Google no indexa bien el contenido dinámico. Con Next.js SSR, sí.
2. **Velocidad**: Lanzarás 2 semanas antes. Con 1 persona, eso es la diferencia entre éxito y agotamiento.
3. **Ecosistema**: Si necesitas contratar un frontend en el futuro, encontrarás 5x más devs React que Angular.
4. **React Native**: Cuando vayas a Fase 2 (app nativa), reutilizarás lógica de React.
5. **Vercel**: Deploy automático, previews por PR, hosting gratuito. Te ahorra horas de DevOps.

**La única razón para elegir Angular**: si YA tienes código funcional que te costó semanas hacer. En ese caso, el coste hundido justifica seguir.

---

## 6. PLAN DE IMPLEMENTACIÓN (si eliges Next.js)

### Semana 1: Setup

```bash
# 1. Crear proyecto
npx create-next-app@latest buscohuella-web --typescript --tailwind --eslint --app --src-dir

# 2. Instalar dependencias MVP
cd buscohuella-web
npm install leaflet react-leaflet zustand axios
npm install -D @types/leaflet

# 3. Configurar PWA
npm install next-pwa

# 4. Instalar axios y types adicionales
npm install axios
npm install -D @types/axios

# 5. Crear carpeta lib/ y configurar api.ts

```bash
mkdir lib

```

### Semanas 2-3: Páginas Core

| Página | Ruta | Componentes principales |
| :--- | :--- | :--- |
| Home / Feed | `/` | Lista de reportes, filtros rápidos |
| Mapa | `/mapa` | Leaflet map, markers, clusters |
| Login | `/login` | Formulario JWT |
| Registro | `/registro` | Formulario multi-step |
| Perfil | `/perfil` | Mis mascotas, mis reportes |
| Añadir mascota | `/mascota/nueva` | Formulario con foto |
| Reportar | `/reportar` | Formulario con GPS + foto |
| Detalle reporte | `/reporte/[id]` | Fotos, mapa, contacto, avistamientos |


### Semana 4: PWA + Polish

- Configurar `manifest.json`
- Configurar service worker (`next-pwa`)
- Iconos PWA (192x192, 512x512)
- Test en móvil real
- Optimización Core Web Vitals


```bash
# Estructura de carpetas recomendada (Next.js App Router)

buscohuella-web/
├── app/
│   ├── layout.tsx              # Root layout + providers
│   ├── page.tsx                # Home / Feed
│   ├── mapa/
│   │   └── page.tsx            # Mapa interactivo
│   ├── login/
│   │   └── page.tsx            # Login
│   ├── registro/
│   │   └── page.tsx            # Registro
│   ├── perfil/
│   │   └── page.tsx            # Perfil de usuario
│   ├── mascota/
│   │   └── nueva/
│   │       └── page.tsx        # Añadir mascota
│   ├── reportar/
│   │   └── page.tsx            # Reportar perdido/encontrado
│   └── reporte/
│       └── [id]/
│           └── page.tsx        # Detalle de reporte
│
├── components/
│   ├── ui/                     # Botones, inputs, modals (shadcn)
│   ├── map/
│   │   ├── Map.tsx             # Leaflet wrapper
│   │   ├── ReportMarker.tsx    # Marker personalizado
│   │   └── MapFilters.tsx      # Filtros del mapa
│   ├── report/
│   │   ├── ReportCard.tsx      # Tarjeta de reporte
│   │   └── ReportForm.tsx      # Formulario de reporte
│   └── layout/
│       ├── Navbar.tsx
│       └── BottomNav.tsx       # Navegación móvil
│
├── lib/
│   ├── api.ts                  # Cliente axios + JWT
│   ├── types.ts                # TypeScript interfaces
│   └── constants.ts            # Zonas Sabadell, tipos, etc.
│
├── hooks/
│   ├── useAuth.ts              # Auth state + JWT
│   ├── useReports.ts           # CRUD reportes
│   └── useLocation.ts          # Geolocalización
│
├── stores/
│   └── useAuthStore.ts         # Zustand auth store
│
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── sw.js                   # Service worker (next-pwa)
│   └── icons/                  # Iconos PWA
│
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json

---

```

### 7. PLAN DE IMPLEMENTACIÓN (si mantienes Angular)

Acciones inmediatas:

- Auditar código existente:

  ```bash
  cd frontend  # o apps/web/
  ng serve
  ```

- Añadir PWA (si no lo tienes):

  ```bash
  ng add @angular/pwa
  ```
  
  - Configurar SSR (opcional, para SEO):
  
  ```bash
  ng add @angular/ssr
  ```
  
  - Integrar Leaflet:
  
  ```bash
  npm install leaflet @asymmetrik/ngx-leaflet
  npm install -D @types/leaflet
  ```
  
  - Conectar con Symfony API:
  
  ```bash
  ng g service api
  ```

  - Configurar interceptor JWT:
  
  ```bash
  ng g interceptor jwt
  ```

---

## 8. RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
| :--- | :--- | :--- | :--- |
| Elegir Next.js y no saber React | Media | Alto | Si no sabes React, el aprendizaje lleva 1-2 semanas. Considera un curso rápido (React docs oficial, 3h). |
| Elegir Angular y no terminar a tiempo | Media | Alto | Angular tiene más boilerplate. Define un scope MÁS pequeño si eliges Angular. |
| Elegir Next.js y tener que rehacer en Angular para el panel admin | Baja | Medio | El panel admin (Fase 2) puede ser una app separada. No necesita ser el mismo framework. |
| Elegir Angular y no poder contratar devs | Media | Medio | En España hay menos devs Angular. Pero para Fase 2 tendrás presupuesto para formar o contratar senior. |
| Parálisis por análisis | Alta | Alto | Tómate 24h para decidir. No más. Cualquier decisión es mejor que ninguna. |

---

## 9. DECISIÓN

- **Fecha de decisión**: 30/07/2026
- **Decisión tomada**: ☐ Angular   [X] Next.js
- **Justificación**: Mayor agilidad en el desarrollo del MVP y mejor ecosistema para PWAs ligeras.
- **Próximo paso inmediato**: Configurar proyecto Next.js (Semanas 1-6).

---

## 10. ANEXOS

### Anexo A: Recursos de aprendizaje

**Si eliges Next.js y necesitas aprender React rápido:**
- React Docs Oficial (3-4 horas, interactivo)
- Next.js Learn (2-3 horas, construyes una app real)
- Tailwind CSS Docs (referencia rápida)

**Si eliges Angular y necesitas refrescar:**
- Angular Docs (referencia oficial)
- Angular University (cursos gratuitos)

### Anexo B: Comparativa de código (mismo componente)

**Componente**: Botón primario

**Angular**:
```typescript
// button.component.ts
@Component({
  selector: 'app-button',
  template: `<button class="btn-primary" [disabled]="disabled">{{ label }}</button>`,
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
}
```

**Next.js (React):**

```typescript
// Button.tsx
interface ButtonProps {
  label: string;
  disabled?: boolean;
}

export function Button({ label, disabled }: ButtonProps) {
  return (
    <button className="btn-primary" disabled={disabled}>
      {label}
    </button>
  );
}
```

**Observación**: El componente React tiene menos código, menos conceptos (`@Input`, `@Component`, módulos), y es más directo.

---

## Validación y Aval del Equipo

Documento ADR-001. Revisar si cambian las condiciones del proyecto (equipo, presupuesto, plazo).

**Avalado por**:
- [X] Xavier (Fundador)

Esta decisión está avalada por el 100% del equipo fundador y se basa en un análisis exhaustivo de los objetivos del proyecto, recursos disponibles y limitaciones técnicas. La decisión es firme y se mantendrá hasta la próxima revisión del documento.
