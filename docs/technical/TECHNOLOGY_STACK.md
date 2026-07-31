# BuscoHuella — Stack Tecnológico

> Inventario técnico vigente del proyecto BuscoHuella.

## 1. Propósito

Este documento recoge las tecnologías aprobadas para construir y operar BuscoHuella.

No sustituye a:

```text
docs/master/DOCUMENTO_MAESTRO.md
docs/architecture/ARCHITECTURE.md
docs/adr/
```

Ante cualquier contradicción, prevalece el Documento Maestro y, después, las ADR aceptadas.

---

## 2. Estado

BuscoHuella se encuentra en fase **Pre-MVP**.

El stack se ha elegido para:

- acelerar la validación;
- reducir complejidad;
- reducir coste operativo;
- mantener seguridad;
- facilitar evolución;
- compartir conocimiento entre web y móvil;
- trabajar con un equipo pequeño.

---

## 3. Resumen

| Área | Tecnología principal |
|---|---|
| Lenguaje | TypeScript |
| Web | Next.js |
| Renderizado y rutas | App Router |
| UI | React |
| Estilos | Tailwind CSS |
| Componentes | Shadcn UI |
| Iconos | Lucide |
| Animaciones | Framer Motion |
| Móvil | Expo React Native |
| Navegación móvil | Expo Router |
| Backend | Supabase |
| Base de datos | PostgreSQL |
| Geolocalización | PostGIS |
| Autenticación | Supabase Auth |
| Archivos | Supabase Storage |
| Tiempo real | Supabase Realtime |
| Lógica de servidor | Supabase Edge Functions |
| Mapas | Mapbox |
| Hosting web | Vercel |
| Repositorio | GitHub |
| CI/CD | GitHub Actions |
| Gestor de paquetes | pnpm |
| Monorepo | pnpm workspaces |
| Runtime | Node.js 20 o superior |

---

## 4. Lenguaje principal

### TypeScript

TypeScript será el lenguaje principal para:

- web;
- móvil;
- paquetes compartidos;
- funciones de servidor;
- herramientas internas cuando proceda.

Reglas:

- modo estricto;
- evitar `any`;
- tipos compartidos cuando corresponda;
- contratos explícitos;
- validación de datos en fronteras;
- nombres descriptivos.

---

## 5. Aplicación web

### Next.js

Responsabilidades:

- landing;
- autenticación;
- perfiles;
- mascotas;
- reportes;
- mapa;
- avistamientos;
- notificaciones web;
- administración mínima;
- páginas públicas;
- SEO.

### App Router

Se utilizará para:

- rutas;
- layouts;
- Server Components cuando aporten valor;
- Route Handlers cuando sean necesarios;
- gestión de metadatos;
- carga progresiva.

### React

Principios:

- componentes pequeños;
- composición;
- estado local por defecto;
- no abusar de estado global;
- lógica reutilizable en hooks;
- accesibilidad en componentes.

---

## 6. Estilos y componentes

### Tailwind CSS

Se utilizará para:

- estilos;
- responsive;
- tokens;
- estados;
- composición visual.

### Shadcn UI

Se utilizará como base de componentes accesibles y personalizables.

No debe tratarse como una dependencia cerrada: los componentes pasan a formar parte del código del proyecto.

### Lucide

Se utilizará para iconografía consistente.

### Framer Motion

Solo se utilizará cuando la animación:

- mejore comprensión;
- aporte feedback;
- facilite transiciones;
- no perjudique rendimiento;
- respete `prefers-reduced-motion`.

---

## 7. Aplicación móvil

### Expo React Native

Tecnologías:

- Expo;
- React Native;
- TypeScript;
- Expo Router.

Estado:

- fase posterior al MVP web;
- arquitectura prevista desde el inicio;
- reutilización de tipos, constantes y validaciones.

No se desarrollará en paralelo con la web hasta que exista una necesidad validada.

---

## 8. Backend

### Supabase

Servicios previstos:

- Auth;
- PostgreSQL;
- PostGIS;
- Storage;
- Realtime;
- Edge Functions.

Motivos:

- velocidad de desarrollo;
- coste inicial reducido;
- PostgreSQL gestionado;
- autenticación integrada;
- RLS;
- almacenamiento;
- tiempo real;
- menor carga operativa.

Supabase no elimina la necesidad de diseñar:

- modelo de datos;
- políticas;
- índices;
- restricciones;
- migraciones;
- auditoría;
- seguridad.

---

## 9. Base de datos

### PostgreSQL

Se utilizará como base de datos principal.

Motivos:

- fiabilidad;
- integridad relacional;
- consultas complejas;
- extensibilidad;
- PostGIS;
- ecosistema;
- portabilidad.

### PostGIS

Se utilizará para:

- distancias;
- radios;
- proximidad;
- zonas;
- filtros geográficos;
- consultas espaciales.

---

## 10. Autenticación

### Supabase Auth

Funciones:

- registro;
- login;
- recuperación de contraseña;
- sesiones;
- proveedores sociales cuando se aprueben;
- gestión de identidad.

No se implementará:

- sistema propio de contraseñas;
- JWT propio;
- autenticación personalizada sin necesidad.

---

## 11. Autorización

Tecnologías y mecanismos:

- Row Level Security;
- roles;
- restricciones de base de datos;
- validación de dominio;
- Edge Functions para operaciones sensibles.

La interfaz no será una barrera de seguridad.

---

## 12. Almacenamiento

### Supabase Storage

Usos:

- fotografías de mascotas;
- reportes;
- avistamientos;
- avatares;
- archivos necesarios.

Requisitos:

- políticas;
- límites;
- tipos permitidos;
- tamaño máximo;
- limpieza;
- privacidad;
- protección de URLs.

---

## 13. Tiempo real

### Supabase Realtime

Casos posibles:

- nuevos avistamientos;
- cambios de estado;
- actualizaciones de reportes;
- notificaciones relevantes.

No debe activarse por defecto en todas las tablas.

---

## 14. Funciones de servidor

### Supabase Edge Functions

Se utilizarán para:

- integraciones;
- secretos;
- notificaciones;
- validaciones sensibles;
- operaciones administrativas;
- lógica no apta para cliente.

No se usarán cuando PostgreSQL, RLS o el cliente resuelvan el caso de forma segura y simple.

---

## 15. Mapas

### Mapbox

Usos:

- mapa;
- marcadores;
- geocodificación cuando corresponda;
- interacción;
- visualización;
- experiencia web y móvil.

### PostGIS

Mapbox representa la información.

PostGIS ejecuta las operaciones geográficas del dominio.

No se debe delegar toda la lógica geográfica al cliente.

---

## 16. Monorepo

### pnpm workspaces

Estructura prevista:

```text
apps/
packages/
supabase/
```

Motivos:

- instalación eficiente;
- paquetes compartidos;
- scripts comunes;
- separación clara;
- soporte web y móvil.

No se incorporará Turborepo inicialmente salvo que exista una necesidad real.

---

## 17. Gestor de paquetes

### pnpm

Será el gestor principal.

Reglas:

- mantener un único lockfile;
- no mezclar npm, Yarn y pnpm;
- revisar dependencias;
- evitar paquetes duplicados;
- fijar versiones cuando proceda.

---

## 18. Runtime

### Node.js

Versión mínima prevista:

```text
Node.js 20
```

Se versionará mediante:

```text
.nvmrc
```

o mecanismo equivalente.

---

## 19. Despliegue web

### Vercel

Se utilizará para:

- previews;
- staging cuando proceda;
- producción web;
- variables de entorno;
- integración con GitHub.

---

## 20. Control de versiones

### Git y GitHub

Se utilizarán para:

- historial;
- ramas;
- revisiones;
- Pull Requests;
- issues;
- automatización;
- releases.

---

## 21. CI/CD

### GitHub Actions

Validaciones previstas:

- lint;
- typecheck;
- tests;
- build;
- migraciones;
- seguridad;
- accesibilidad crítica.

Despliegues:

```text
GitHub → Vercel
GitHub → Supabase
```

---

## 22. Calidad de código

Herramientas previstas:

- ESLint;
- Prettier;
- TypeScript;
- tests;
- GitHub Actions.

Las versiones concretas se definirán al inicializar el monorepo.

---

## 23. Testing

Herramientas por decidir durante la inicialización.

Necesidades:

- unitarias;
- integración;
- end-to-end;
- accesibilidad;
- seguridad;
- RLS.

No se seleccionará una herramienta únicamente por popularidad.

---

## 24. Accesibilidad

Objetivo:

```text
WCAG 2.2 AA
```

El stack debe permitir:

- HTML semántico;
- teclado;
- lectores de pantalla;
- foco;
- contraste;
- reducción de movimiento;
- componentes accesibles.

---

## 25. Internacionalización

Idiomas previstos:

- español;
- catalán;
- inglés;
- euskera;
- gallego.

La librería concreta se decidirá durante la configuración web.

Debe soportar:

- App Router;
- rutas;
- traducciones;
- pluralización;
- fallback;
- SEO.

---

## 26. Observabilidad

Herramientas concretas pendientes de decisión.

Necesidades:

- errores;
- rendimiento;
- fallos de autenticación;
- fallos de Supabase;
- métricas críticas;
- privacidad.

No se deben registrar datos sensibles innecesarios.

---

## 27. Tecnologías no vigentes

No forman parte del stack activo:

- Angular;
- Symfony;
- PHP;
- API Platform;
- Doctrine ORM;
- Symfony Messenger;
- MinIO;
- Redis como requisito;
- RabbitMQ como requisito;
- JWT propio;
- Leaflet como solución principal;
- OpenStreetMap como proveedor principal;
- Google Maps como proveedor principal.

---

## 28. Tecnologías futuras no aprobadas

No están aprobadas para el MVP:

- microservicios;
- Kubernetes;
- colas complejas;
- Elasticsearch;
- blockchain;
- tokens;
- servicios propios de IA;
- infraestructura IoT;
- hardware GPS;
- sistemas clínicos;
- pagos;
- chat.

Su incorporación requerirá una ADR.

---

## 29. Criterios para nuevas tecnologías

Antes de añadir una tecnología:

1. definir el problema;
2. comprobar si el stack actual lo resuelve;
3. evaluar mantenimiento;
4. evaluar seguridad;
5. evaluar coste;
6. evaluar tamaño;
7. evaluar curva de aprendizaje;
8. evaluar compatibilidad;
9. justificarla mediante ADR cuando sea estructural.

---

## 30. Documentación relacionada

```text
docs/master/DOCUMENTO_MAESTRO.md
docs/architecture/ARCHITECTURE.md
ARCHITECTURE_OVERVIEW.md
docs/adr/ADR-001_STACK_TECNOLOGICO.md
docs/adr/ADR-003_SUPABASE.md
docs/adr/ADR-004_FRONTEND_WEB.md
AGENTS.md
```

---

## 31. Regla final

El stack debe favorecer:

- velocidad;
- simplicidad;
- seguridad;
- accesibilidad;
- mantenibilidad;
- coste razonable;
- crecimiento incremental.

> No se añadirá tecnología para resolver un problema que todavía no existe.
