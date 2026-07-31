# BuscoHuella — Arquitectura del Sistema

> Documento técnico principal de arquitectura para el MVP de BuscoHuella.

## 1. Propósito

Este documento define la arquitectura técnica vigente de BuscoHuella.

Su objetivo es describir:

- los límites del sistema;
- los componentes principales;
- las responsabilidades de cada capa;
- las decisiones tecnológicas activas;
- las reglas de seguridad;
- los criterios de evolución;
- las decisiones expresamente fuera del MVP.

Este documento no sustituye a:

```text
docs/master/DOCUMENTO_MAESTRO.md
```

Ante cualquier contradicción, prevalece el Documento Maestro.

---

## 2. Estado del proyecto

BuscoHuella se encuentra en fase **Pre-MVP**.

La arquitectura debe permitir validar primero el producto en Sabadell con:

- bajo coste operativo;
- complejidad controlada;
- seguridad por defecto;
- posibilidad de crecimiento;
- mínima deuda técnica razonable;
- documentación suficiente;
- evolución incremental.

La arquitectura no debe sobredimensionarse para escenarios futuros que todavía no han sido validados.

---

## 3. Objetivo del sistema

El sistema debe permitir que una persona pueda:

1. registrarse;
2. iniciar sesión;
3. registrar una mascota;
4. publicar una mascota perdida;
5. publicar una mascota encontrada;
6. consultar reportes en un mapa;
7. filtrar por zona, estado, tipo o distancia;
8. comunicar un avistamiento;
9. adjuntar fotografías;
10. recibir notificaciones relevantes;
11. actualizar el estado del caso;
12. marcar un caso como resuelto;
13. documentar un reencuentro.

La métrica principal es:

> Número de mascotas reunidas con sus familias gracias a BuscoHuella.

---

## 4. Alcance arquitectónico del MVP

### Incluido

- aplicación web;
- autenticación;
- perfiles;
- mascotas;
- reportes;
- avistamientos;
- mapa;
- filtros;
- fotografías;
- notificaciones web;
- resolución de casos;
- landing pública;
- lista de espera;
- administración mínima necesaria;
- métricas esenciales.

### Excluido

- reconocimiento visual mediante IA;
- chat interno;
- gamificación;
- pagos;
- suscripciones;
- funciones premium;
- blockchain;
- tokens;
- GPS propio;
- telemedicina;
- historiales clínicos completos;
- adopciones como módulo principal;
- red social completa;
- microservicios;
- colas complejas;
- integraciones institucionales avanzadas;
- expansión nacional.

---

## 5. Principios arquitectónicos

La arquitectura seguirá estos principios:

1. Simplicidad antes que complejidad.
2. MVP antes que expansión.
3. Seguridad por defecto.
4. Privacidad desde el diseño.
5. Accesibilidad desde el diseño.
6. Bajo acoplamiento.
7. Alta cohesión.
8. Contratos tipados.
9. Evolución incremental.
10. Observabilidad suficiente.
11. Coste operativo razonable.
12. Documentación antes que implementación.
13. No introducir dependencias sin necesidad.
14. No crear abstracciones prematuras.
15. No crear servicios separados sin una razón medible.

---

## 6. Arquitectura de alto nivel

```text
┌──────────────────────────────────────────────┐
│                  Usuarios                    │
│ Propietarios · Vecinos · Protectoras · Admin │
└──────────────────────┬───────────────────────┘
                       │
              ┌────────▼────────┐
              │ Aplicación web  │
              │ Next.js         │
              │ TypeScript      │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │    Supabase     │
              │ Auth            │
              │ Database        │
              │ Storage         │
              │ Realtime        │
              │ Edge Functions  │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │ PostgreSQL      │
              │ PostGIS         │
              └─────────────────┘

              ┌─────────────────┐
              │ Aplicación móvil│
              │ Expo React Native
              │ Fase posterior  │
              └────────┬────────┘
                       │
                       └──────────────► Supabase
```

---

## 7. Estilo arquitectónico

BuscoHuella utilizará inicialmente una arquitectura modular apoyada en servicios gestionados.

Características:

- monorepo;
- frontend web principal;
- backend gestionado con Supabase;
- base de datos relacional;
- geolocalización con PostGIS;
- seguridad mediante RLS;
- almacenamiento gestionado;
- comunicación en tiempo real cuando aporte valor;
- Edge Functions para lógica sensible o integraciones;
- despliegue web en Vercel.

No se utilizará un backend monolítico Symfony ni una API separada como núcleo del MVP.

---

## 8. Monorepo

Estructura objetivo:

```text
buscohuella/
├── apps/
│   ├── web/
│   └── mobile/
├── packages/
│   ├── shared-types/
│   ├── shared-utils/
│   └── constants/
├── supabase/
│   ├── migrations/
│   ├── functions/
│   └── seed/
├── docs/
├── scripts/
├── tools/
├── AGENTS.md
├── CONTRIBUTING.md
├── ARCHITECTURE_OVERVIEW.md
└── README.md
```

Reglas:

- cada aplicación mantiene su propia configuración;
- la lógica compartida debe ubicarse en `packages/`;
- las migraciones de Supabase deben versionarse;
- las funciones de servidor deben estar versionadas;
- la documentación debe mantenerse centralizada;
- no duplicar tipos ni constantes entre web y móvil.

---

## 9. Aplicación web

### Tecnologías

- Next.js;
- TypeScript;
- App Router;
- Tailwind CSS;
- Shadcn UI;
- Lucide;
- Framer Motion cuando aporte valor real;
- Vercel.

### Responsabilidades

- landing pública;
- registro;
- inicio de sesión;
- recuperación de contraseña;
- perfil;
- gestión de mascotas;
- reportes;
- mapa;
- feed;
- filtros;
- avistamientos;
- resolución de casos;
- notificaciones web;
- administración mínima;
- internacionalización;
- accesibilidad.

### Reglas

- TypeScript estricto;
- componentes pequeños;
- separación entre UI, dominio y acceso a datos;
- estados de carga, vacío y error;
- validación en cliente y servidor;
- no confiar únicamente en la interfaz;
- textos preparados para i18n;
- formularios accesibles;
- mapas con alternativas textuales cuando proceda.

---

## 10. Aplicación móvil

### Tecnologías previstas

- Expo;
- React Native;
- TypeScript;
- Expo Router.

### Estado

La aplicación móvil se desarrollará después de validar la aplicación web.

### Objetivo

Reutilizar:

- tipos;
- constantes;
- validaciones;
- reglas de dominio;
- contratos;
- integración con Supabase.

### No hacer

- duplicar lógica de negocio;
- crear APIs distintas sin necesidad;
- crear modelos incompatibles con la web;
- desarrollar funcionalidades fuera del MVP por comodidad móvil.

---

## 11. Backend con Supabase

Supabase será el backend principal del MVP.

Servicios:

- Supabase Auth;
- PostgreSQL;
- PostGIS;
- Supabase Storage;
- Supabase Realtime;
- Edge Functions cuando sea necesario.

### Responsabilidades

- autenticación;
- autorización;
- persistencia;
- consultas;
- seguridad;
- almacenamiento;
- tiempo real;
- lógica sensible;
- integraciones externas;
- auditoría cuando corresponda.

### Regla principal

Las operaciones sensibles no deben depender únicamente del cliente.

---

## 12. Base de datos

### Tecnología

- PostgreSQL;
- PostGIS.

### Dominios iniciales

- usuarios;
- perfiles;
- mascotas;
- reportes;
- avistamientos;
- archivos;
- notificaciones;
- organizaciones básicas;
- estados;
- auditoría necesaria.

### Reglas de modelado

Toda tabla debe considerar:

- clave primaria;
- timestamps;
- restricciones;
- relaciones;
- índices;
- claves foráneas;
- RLS;
- estrategia de borrado;
- conservación;
- auditoría cuando corresponda;
- integridad referencial.

### No hacer

- tablas sin políticas de seguridad;
- columnas duplicadas sin justificación;
- datos sensibles innecesarios;
- almacenamiento de secretos;
- relaciones ambiguas;
- estados libres si deben ser controlados.

---

## 13. Modelo de dominio del MVP

### Usuario

Representa a la persona o entidad autenticada.

Responsabilidades:

- identidad;
- perfil;
- rol;
- preferencias;
- relación con mascotas;
- relación con reportes;
- relación con avistamientos.

### Perfil

Incluye información pública o semipública del usuario.

Debe minimizar datos personales.

### Mascota

Representa un animal registrado.

Datos principales:

- nombre;
- especie;
- raza;
- sexo;
- edad aproximada;
- tamaño;
- color;
- descripción;
- fotografías;
- microchip cuando proceda;
- propietario;
- estado.

### Reporte

Representa una pérdida, hallazgo o caso activo.

Datos principales:

- tipo;
- mascota relacionada;
- fecha;
- ubicación;
- descripción;
- fotografías;
- estado;
- autor;
- visibilidad;
- resolución.

### Avistamiento

Representa una observación asociada a un reporte.

Datos principales:

- reporte;
- autor;
- fecha;
- ubicación;
- descripción;
- fotografía;
- nivel de precisión;
- validación básica.

### Organización

Representa una protectora, refugio, profesional o entidad colaboradora.

Su alcance inicial debe ser mínimo.

---

## 14. Estados del reporte

Los estados deben ser explícitos y controlados.

Ejemplo conceptual:

```text
draft
active
resolved
archived
cancelled
```

Las transiciones deben validarse.

Ejemplo:

```text
draft → active
active → resolved
active → cancelled
resolved → archived
```

No permitir cambios arbitrarios sin autorización.

---

## 15. Autenticación

### Tecnología

Supabase Auth.

### Métodos iniciales

- email y contraseña;
- recuperación de contraseña;
- proveedores sociales cuando estén autorizados;
- sesión persistente segura.

### Reglas

- contraseñas gestionadas por Supabase;
- no almacenar contraseñas propias;
- no exponer tokens;
- no versionar secretos;
- controlar expiración;
- revocar sesiones cuando proceda;
- registrar eventos críticos sin datos sensibles.

---

## 16. Autorización

La autorización se implementará mediante:

- roles;
- políticas RLS;
- validaciones de dominio;
- Edge Functions cuando sea necesario.

Roles previstos:

- ciudadano;
- colaborador;
- protectora;
- profesional;
- administración;
- invitado;
- administrador.

Los roles deben tener permisos mínimos.

No confiar en ocultar botones como mecanismo de seguridad.

---

## 17. Row Level Security

RLS es obligatoria para tablas con datos de usuario o datos sensibles.

### Principios

- denegar por defecto;
- mínimo privilegio;
- propietario controla sus datos;
- lectura pública solo cuando esté justificada;
- escritura limitada;
- administración mediante roles;
- políticas simples y auditables.

### Ejemplos conceptuales

- un usuario puede editar su perfil;
- un usuario puede gestionar sus mascotas;
- un usuario puede gestionar sus reportes;
- otros usuarios pueden ver solo reportes públicos;
- un avistamiento puede ser creado por un usuario autenticado;
- un administrador puede moderar según rol.

Toda política debe probarse.

---

## 18. Edge Functions

Se utilizarán cuando exista necesidad de:

- lógica sensible;
- validación de servidor;
- integraciones externas;
- envío de notificaciones;
- operaciones administrativas;
- protección de secretos;
- procesos que no deben ejecutarse en cliente.

No usar Edge Functions para lógica simple que PostgreSQL y RLS ya resuelvan correctamente.

---

## 19. Storage

### Tecnología

Supabase Storage.

### Tipos de archivo

- fotografías de mascotas;
- imágenes de reportes;
- imágenes de avistamientos;
- avatares;
- documentos estrictamente necesarios.

### Reglas

- buckets separados cuando aporte seguridad;
- validación de tipo MIME;
- validación de tamaño;
- nombres no predecibles;
- políticas de acceso;
- estrategia de eliminación;
- limpieza de archivos huérfanos;
- privacidad por defecto.

No se utilizará MinIO en el MVP.

---

## 20. Mapas y geolocalización

### Tecnologías

- Mapbox;
- PostGIS.

### Casos de uso

- mapa de reportes;
- búsqueda por radio;
- filtros por distancia;
- avistamientos;
- zonas;
- proximidad;
- agrupación de marcadores;
- ubicación aproximada.

### Seguridad

- no mostrar coordenadas sensibles exactas cuando no sea necesario;
- limitar precisión;
- proteger hogares;
- evitar exposición de patrones personales;
- aplicar reglas por rol;
- registrar consentimiento cuando proceda.

---

## 21. Búsqueda

La búsqueda inicial se apoyará en:

- consultas PostgreSQL;
- PostGIS;
- filtros simples;
- índices adecuados.

No se introducirá un motor externo de búsqueda sin una necesidad medible.

Filtros iniciales:

- tipo;
- estado;
- fecha;
- distancia;
- especie;
- zona.

---

## 22. Realtime

Supabase Realtime podrá utilizarse para:

- actualizaciones de reportes;
- nuevos avistamientos;
- cambios de estado;
- notificaciones relevantes;
- sincronización ligera.

No utilizar Realtime por defecto para todo.

Debe evaluarse:

- coste;
- volumen;
- necesidad real;
- impacto en batería;
- impacto en datos móviles;
- complejidad.

---

## 23. Notificaciones

### MVP

- notificaciones web;
- email cuando sea necesario.

### Futuro

- notificaciones móviles;
- canales adicionales.

### Casos de uso

- nuevo avistamiento;
- cambio de estado;
- reporte cercano;
- resolución del caso;
- mensajes administrativos importantes.

No incluir SMS como canal obligatorio del MVP.

---

## 24. Internacionalización

Idiomas previstos:

- español;
- catalán;
- inglés;
- euskera;
- gallego.

Reglas:

- español como idioma inicial;
- claves estables;
- no concatenar frases;
- pluralización;
- textos extensibles;
- compatibilidad con diferentes longitudes;
- fallback controlado.

---

## 25. Accesibilidad

Objetivo:

```text
WCAG 2.2 nivel AA
```

La accesibilidad forma parte de la definición de terminado.

Requisitos:

- HTML semántico;
- teclado;
- foco visible;
- contraste;
- labels;
- lectores de pantalla;
- mensajes de error claros;
- áreas táctiles adecuadas;
- no depender solo del color;
- estados de carga anunciables;
- alternativas para mapas;
- formularios comprensibles.

---

## 26. Seguridad y privacidad

Principios:

- mínimo privilegio;
- privacidad por defecto;
- minimización;
- limitación de finalidad;
- control de acceso;
- cifrado en tránsito;
- no registrar secretos;
- auditoría;
- conservación limitada;
- borrado seguro;
- cumplimiento de RGPD y LOPDGDD.

Datos especialmente sensibles:

- ubicación;
- teléfono;
- email;
- fotografías;
- datos de menores;
- datos de entidades;
- información policial o municipal.

---

## 27. Validación de datos

Debe existir validación en:

- cliente;
- servidor;
- base de datos.

Herramientas posibles:

- schemas tipados;
- restricciones PostgreSQL;
- RLS;
- Edge Functions;
- validaciones de formularios.

No aceptar datos únicamente porque el cliente los envía.

---

## 28. Gestión de errores

Toda operación debe considerar:

- error de red;
- sesión expirada;
- datos inválidos;
- permisos insuficientes;
- archivo inválido;
- fallo de almacenamiento;
- fallo de mapa;
- fallo de terceros;
- conflicto de estado.

Los mensajes deben ser comprensibles y no filtrar información sensible.

---

## 29. Observabilidad

El MVP debe registrar:

- errores;
- fallos de autenticación;
- fallos de subida;
- errores de consultas;
- eventos críticos;
- métricas de producto.

No registrar:

- contraseñas;
- tokens;
- claves;
- ubicaciones sensibles completas;
- datos personales innecesarios.

La observabilidad debe servir para operar el producto, no para acumular datos.

---

## 30. Métricas del producto

Métricas iniciales:

- mascotas reunidas;
- reportes activos;
- reportes resueltos;
- avistamientos;
- tiempo hasta primer avistamiento;
- usuarios activos;
- retención;
- densidad local;
- actividad por municipio;
- colaboraciones activas.

---

## 31. Testing

### Prioridades

1. reglas de dominio;
2. autenticación;
3. RLS;
4. permisos;
5. registro de mascotas;
6. reportes;
7. avistamientos;
8. resolución;
9. filtros geográficos;
10. accesibilidad.

### Tipos

- unitarios;
- integración;
- end-to-end;
- accesibilidad;
- seguridad;
- regresión.

No afirmar que una funcionalidad está terminada si no se han ejecutado las validaciones disponibles.

---

## 32. Entornos

Entornos previstos:

- desarrollo;
- staging cuando sea necesario;
- producción.

Cada entorno debe tener:

- variables propias;
- Supabase separado cuando proceda;
- claves separadas;
- datos controlados;
- despliegues independientes.

No mezclar datos de producción con desarrollo.

---

## 33. CI/CD

### Web

```text
GitHub → GitHub Actions → Vercel
```

### Backend y datos

```text
GitHub → migraciones / funciones → Supabase
```

Validaciones recomendadas:

- lint;
- typecheck;
- tests;
- build;
- comprobaciones de migraciones;
- seguridad;
- accesibilidad crítica.

---

## 34. Gestión de secretos

Nunca versionar:

- `.env.local`;
- service role key;
- tokens;
- claves privadas;
- secretos de Mapbox;
- credenciales;
- contraseñas;
- claves de terceros.

Usar:

- variables de entorno;
- secretos de Vercel;
- secretos de Supabase;
- secretos de GitHub Actions.

---

## 35. Dependencias

Antes de añadir una dependencia:

1. comprobar si ya existe solución;
2. revisar mantenimiento;
3. revisar seguridad;
4. revisar tamaño;
5. revisar compatibilidad;
6. justificar su uso;
7. evitar duplicidad.

No añadir dependencias sin uso inmediato.

---

## 36. Decisiones no vigentes

No forman parte de la arquitectura activa:

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

Las referencias históricas deben mantenerse únicamente donde aporten contexto.

---

## 37. Futuras capacidades

Podrán evaluarse más adelante:

- IA de reconocimiento;
- chat;
- pagos;
- suscripciones;
- premium;
- QR inteligente;
- gamificación;
- adopciones;
- historiales veterinarios;
- IoT;
- GPS;
- integraciones públicas;
- integraciones institucionales;
- automatizaciones avanzadas;
- APIs públicas.

No deben condicionar la arquitectura del MVP salvo necesidad real.

---

## 38. Evolución prevista

### Fase 0 — Fundación

- documentación;
- monorepo;
- estándares;
- entornos;
- seguridad base.

### Fase 1 — MVP web

- autenticación;
- mascotas;
- reportes;
- mapa;
- avistamientos;
- notificaciones;
- resolución.

### Fase 2 — Beta local

- piloto en Sabadell;
- métricas;
- mejora de experiencia;
- protectoras colaboradoras.

### Fase 3 — Aplicación móvil

- Expo React Native;
- notificaciones móviles;
- experiencia de campo.

### Fase 4 — Expansión regional

- Vallès Occidental;
- más organizaciones;
- integraciones progresivas.

---

## 39. Documentación relacionada

```text
docs/master/DOCUMENTO_MAESTRO.md
ARCHITECTURE_OVERVIEW.md
docs/architecture/SYSTEM_DIAGRAMS.md
docs/adr/
docs/technical/TECHNOLOGY_STACK.md
docs/database/DATABASE_SCHEMA.md
docs/domain/
docs/integrations/SUPABASE.md
docs/maps/MAP_ARCHITECTURE.md
docs/security/
docs/ux/ACCESSIBILITY.md
AGENTS.md
```

---

## 40. Regla final

Toda decisión arquitectónica debe favorecer:

- simplicidad;
- seguridad;
- accesibilidad;
- mantenibilidad;
- coste razonable;
- validación rápida;
- crecimiento incremental;
- trazabilidad.

> La arquitectura debe servir al MVP y a sus usuarios, no convertirse en un objetivo independiente.
