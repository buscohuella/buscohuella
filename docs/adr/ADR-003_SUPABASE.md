# ADR-003 — Uso de Supabase como Backend Gestionado

## BuscoHuella MVP

**Estado:** Aceptado  
**Fecha:** 31 de julio de 2026  
**Decisor:** Xavier Quesada Sevillano — Fundador / Product Owner  
**Ámbito:** Backend, autenticación, base de datos, almacenamiento y tiempo real  
**Revisión prevista:** Después del piloto de Sabadell o ante una limitación técnica, legal, económica o de rendimiento demostrable  

---

## 1. Contexto

BuscoHuella necesita construir un MVP funcional con un equipo reducido, presupuesto limitado y prioridad en validar el producto antes de asumir una infraestructura compleja.

El backend debe cubrir:

- autenticación;
- perfiles;
- mascotas;
- reportes;
- avistamientos;
- permisos;
- almacenamiento de fotografías;
- consultas geográficas;
- notificaciones;
- tiempo real cuando aporte valor;
- operaciones administrativas;
- seguridad;
- auditoría básica;
- migraciones;
- escalabilidad inicial.

La decisión debe reducir la carga operativa sin sacrificar:

- seguridad;
- control de datos;
- integridad;
- portabilidad razonable;
- cumplimiento normativo;
- capacidad geográfica;
- mantenibilidad.

---

## 2. Problema

La pregunta principal es:

> ¿Debe BuscoHuella construir y operar un backend propio o utilizar Supabase como plataforma gestionada para el MVP?

La decisión afecta directamente a:

- velocidad de desarrollo;
- complejidad;
- coste;
- seguridad;
- autenticación;
- base de datos;
- almacenamiento;
- tiempo real;
- migraciones;
- dependencia de proveedor;
- evolución futura.

---

## 3. Restricciones

| Factor | Situación |
|---|---|
| Equipo | Un desarrollador principal |
| Estado | Pre-MVP |
| Presupuesto | Limitado |
| Prioridad | Validar producto |
| Base de datos | Relacional |
| Geolocalización | Requisito central |
| Seguridad | Obligatoria |
| Datos personales | Sí |
| Archivos | Fotografías |
| Tiempo real | Útil en casos concretos |
| Operación | Evitar infraestructura compleja |
| Móvil futuro | Debe reutilizar backend |

---

## 4. Requisitos del backend

El backend debe soportar:

### Identidad

- registro;
- login;
- recuperación de contraseña;
- sesiones;
- roles;
- permisos.

### Datos

- usuarios;
- perfiles;
- mascotas;
- reportes;
- avistamientos;
- organizaciones;
- notificaciones;
- auditoría.

### Geolocalización

- coordenadas;
- radios;
- distancias;
- proximidad;
- filtros;
- zonas.

### Archivos

- fotografías;
- validación;
- acceso controlado;
- eliminación;
- privacidad.

### Seguridad

- control de acceso;
- mínimo privilegio;
- trazabilidad;
- RLS;
- validación;
- protección de secretos.

---

## 5. Alternativas consideradas

### 5.1 Backend propio con Node.js

#### Ventajas

- control completo;
- TypeScript;
- flexibilidad;
- portabilidad;
- independencia de proveedor.

#### Inconvenientes

- mayor tiempo de desarrollo;
- autenticación propia o adicional;
- despliegue separado;
- mantenimiento;
- observabilidad;
- seguridad;
- almacenamiento;
- escalado;
- gestión de sesiones;
- infraestructura adicional.

#### Resultado

Descartado para el MVP.

---

### 5.2 Backend propio con Symfony

#### Ventajas

- arquitectura madura;
- ecosistema empresarial;
- seguridad;
- control;
- experiencia con PostgreSQL.

#### Inconvenientes

- dos stacks principales;
- más infraestructura;
- más tiempo;
- mayor carga operativa;
- autenticación y storage adicionales;
- menor velocidad para un equipo reducido;
- riesgo de sobredimensionamiento.

#### Resultado

Descartado para el MVP.

---

### 5.3 Firebase

#### Ventajas

- autenticación;
- almacenamiento;
- tiempo real;
- notificaciones;
- servicios gestionados;
- buena experiencia móvil.

#### Inconvenientes

- modelo de datos menos relacional;
- geolocalización menos natural;
- consultas complejas;
- mayor dependencia del modelo Firebase;
- menor encaje con PostgreSQL/PostGIS.

#### Resultado

Descartado frente a Supabase.

---

### 5.4 Supabase

#### Ventajas

- PostgreSQL gestionado;
- PostGIS;
- Supabase Auth;
- Storage;
- Realtime;
- Edge Functions;
- Row Level Security;
- API automática;
- panel administrativo;
- migraciones;
- menor carga operativa;
- coste inicial bajo;
- buena integración con Next.js y Expo.

#### Inconvenientes

- dependencia de proveedor;
- curva de aprendizaje de RLS;
- límites de cuota;
- riesgo de acoplamiento;
- necesidad de disciplina en migraciones;
- complejidad en lógica avanzada;
- ciertas operaciones requieren Edge Functions.

#### Resultado

Alternativa seleccionada.

---

## 6. Decisión

BuscoHuella utilizará Supabase como backend gestionado principal del MVP.

Servicios adoptados:

```text
Supabase Auth
PostgreSQL
PostGIS
Supabase Storage
Supabase Realtime
Supabase Edge Functions
```

Supabase será la infraestructura principal compartida por:

- aplicación web;
- aplicación móvil futura;
- funciones administrativas;
- integraciones básicas;
- procesos de servidor.

---

## 7. Justificación

Supabase se selecciona porque:

- reduce tiempo de desarrollo;
- reduce carga operativa;
- mantiene PostgreSQL;
- permite PostGIS;
- integra autenticación;
- integra almacenamiento;
- ofrece RLS;
- facilita tiempo real;
- permite funciones de servidor;
- ofrece una base portable;
- facilita web y móvil;
- evita construir servicios no diferenciales.

---

## 8. Arquitectura resultante

```text
Aplicación web Next.js
        │
        ├── Supabase Auth
        ├── PostgreSQL
        ├── PostGIS
        ├── Storage
        ├── Realtime
        └── Edge Functions

Aplicación móvil Expo
        │
        └── Mismos servicios Supabase
```

---

## 9. Supabase Auth

Se utilizará para:

- registro;
- login;
- recuperación de contraseña;
- sesiones;
- proveedores sociales cuando se aprueben;
- identidad de usuario.

No se implementará:

- sistema propio de contraseñas;
- JWT propio;
- autenticación paralela;
- sesiones personalizadas sin necesidad.

---

## 10. PostgreSQL

PostgreSQL será la fuente principal de datos.

Se utilizará para:

- datos relacionales;
- integridad;
- restricciones;
- índices;
- consultas;
- auditoría;
- estados;
- relaciones entre entidades.

Las decisiones de datos deben priorizar:

- integridad;
- normalización razonable;
- claridad;
- rendimiento;
- seguridad;
- mantenibilidad.

---

## 11. PostGIS

PostGIS se utilizará para:

- puntos geográficos;
- distancias;
- búsqueda por radio;
- proximidad;
- filtros;
- zonas;
- consultas espaciales.

La lógica geográfica crítica no debe depender exclusivamente del cliente.

---

## 12. Row Level Security

RLS será obligatoria para tablas con datos personales, privados o sensibles.

Principios:

- denegar por defecto;
- mínimo privilegio;
- propietario controla sus datos;
- lectura pública solo cuando esté justificada;
- escritura limitada;
- administración mediante roles;
- políticas simples;
- pruebas obligatorias.

No se considerará segura una tabla solo porque la interfaz oculte acciones.

---

## 13. Supabase Storage

Se utilizará para:

- fotografías de mascotas;
- imágenes de reportes;
- imágenes de avistamientos;
- avatares;
- archivos estrictamente necesarios.

Reglas:

- buckets definidos;
- políticas;
- validación de tipo;
- validación de tamaño;
- privacidad;
- limpieza;
- eliminación;
- nombres no predecibles;
- protección de URLs.

---

## 14. Supabase Realtime

Podrá utilizarse para:

- nuevos avistamientos;
- cambios de estado;
- reportes;
- notificaciones;
- sincronización ligera.

No se activará por defecto en todas las tablas.

Debe evaluarse:

- necesidad;
- coste;
- volumen;
- impacto;
- complejidad.

---

## 15. Edge Functions

Se utilizarán para:

- operaciones sensibles;
- secretos;
- integraciones;
- notificaciones;
- tareas administrativas;
- validaciones de servidor;
- lógica no apta para cliente.

No se utilizarán para lógica simple que PostgreSQL o RLS ya resuelvan correctamente.

---

## 16. Migraciones

Toda modificación estructural debe versionarse.

Se utilizará:

```text
supabase/migrations/
```

Reglas:

- no modificar producción manualmente sin registro;
- no borrar migraciones aplicadas;
- revisar SQL;
- documentar cambios destructivos;
- mantener rollback o estrategia de recuperación;
- probar en desarrollo.

---

## 17. Seguridad

Toda implementación debe considerar:

- RLS;
- restricciones;
- claves separadas;
- service role protegida;
- secretos fuera del cliente;
- validación;
- mínimos privilegios;
- auditoría;
- cifrado en tránsito;
- logs sin datos sensibles.

Nunca exponer:

- service role key;
- secretos;
- tokens;
- credenciales;
- claves privadas.

---

## 18. Privacidad

Supabase deberá configurarse respetando:

- RGPD;
- LOPDGDD;
- minimización;
- limitación de finalidad;
- conservación;
- borrado;
- acceso;
- trazabilidad;
- privacidad por defecto.

Especial atención a:

- ubicaciones;
- teléfonos;
- emails;
- fotografías;
- datos de menores;
- datos institucionales;
- información de contacto.

---

## 19. Consecuencias positivas

### 19.1 Velocidad

Permite disponer rápidamente de:

- autenticación;
- base de datos;
- almacenamiento;
- tiempo real;
- funciones;
- APIs;
- panel.

### 19.2 Menor operación

Reduce la necesidad de:

- servidores propios;
- gestión de base de datos;
- almacenamiento separado;
- autenticación propia;
- infraestructura inicial.

### 19.3 PostgreSQL portable

La base principal sigue siendo PostgreSQL.

Esto reduce el riesgo de bloqueo absoluto.

### 19.4 PostGIS

Permite implementar correctamente la lógica geográfica.

### 19.5 Compartido entre web y móvil

La misma infraestructura servirá para ambas aplicaciones.

---

## 20. Consecuencias negativas

### 20.1 Dependencia

El proyecto dependerá de Supabase.

Mitigación:

- PostgreSQL;
- migraciones;
- documentación;
- capas de acceso;
- evitar APIs propietarias innecesarias.

### 20.2 RLS compleja

Las políticas pueden provocar errores de seguridad o permisos.

Mitigación:

- revisión;
- tests;
- denegar por defecto;
- políticas simples;
- documentación.

### 20.3 Coste futuro

El crecimiento puede aumentar costes.

Mitigación:

- monitorizar;
- presupuestar;
- optimizar;
- revisar arquitectura cuando exista uso real.

### 20.4 Límites de plataforma

Algunas necesidades futuras pueden exceder el modelo gestionado.

Mitigación:

- Edge Functions;
- servicios externos cuando proceda;
- revisión mediante ADR.

---

## 21. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---:|---:|---|
| RLS incorrecta | Media | Alta | Tests y revisión |
| Exposición de service role | Baja | Crítica | Secretos protegidos |
| Acoplamiento | Media | Media | Capas y PostgreSQL |
| Costes | Media | Media | Monitorización |
| Cuotas | Media | Media | Alertas y optimización |
| Migraciones defectuosas | Media | Alta | Staging y backups |
| Uso excesivo de Realtime | Baja | Media | Activación selectiva |
| Lógica sensible en cliente | Media | Alta | RLS y Edge Functions |

---

## 22. Portabilidad

La portabilidad se protegerá mediante:

- PostgreSQL estándar;
- SQL versionado;
- migraciones;
- lógica de dominio desacoplada;
- variables de entorno;
- contratos claros;
- backups;
- documentación.

La portabilidad no será absoluta, pero debe ser razonable.

---

## 23. Backups

Debe existir una estrategia de:

- copias;
- recuperación;
- pruebas;
- retención;
- restauración;
- documentación.

No se considerará suficiente que el proveedor ofrezca backups sin validar el proceso de recuperación.

---

## 24. Entornos

Se utilizarán entornos separados cuando proceda:

- desarrollo;
- staging;
- producción.

Cada entorno debe tener:

- proyecto o configuración separada;
- claves separadas;
- datos controlados;
- migraciones;
- variables propias.

---

## 25. Observabilidad

Se deberá monitorizar:

- errores;
- consultas lentas;
- fallos de autenticación;
- fallos de storage;
- Edge Functions;
- uso de cuotas;
- consumo;
- eventos críticos.

No registrar datos personales innecesarios.

---

## 26. Testing

Debe probarse:

- RLS;
- roles;
- permisos;
- migraciones;
- integridad;
- funciones;
- storage;
- autenticación;
- consultas geográficas;
- operaciones administrativas.

No se considerará completa una política sin pruebas.

---

## 27. Criterios de revisión futura

Esta decisión se revisará si:

- Supabase no cubre una necesidad crítica;
- el coste deja de ser razonable;
- aparecen límites de rendimiento;
- existen restricciones legales;
- se requiere residencia específica;
- se necesita control operativo mayor;
- se requiere infraestructura especializada;
- el equipo crece significativamente;
- el piloto valida una escala mayor;
- la dependencia impide evolucionar.

---

## 28. Decisiones aplazadas

Quedan pendientes:

- proveedor de email;
- observabilidad;
- analítica;
- colas;
- tareas programadas;
- estrategia avanzada de backups;
- procesamiento de imágenes;
- protección avanzada contra abuso;
- rate limiting;
- búsqueda avanzada.

Cada decisión estructural requerirá su propia ADR.

---

## 29. Documentación relacionada

```text
docs/master/DOCUMENTO_MAESTRO.md
docs/adr/ADR-001_STACK_TECNOLOGICO.md
docs/architecture/ARCHITECTURE.md
docs/technical/TECHNOLOGY_STACK.md
docs/integrations/SUPABASE.md
docs/database/DATABASE_SCHEMA.md
docs/security/
AGENTS.md
```

---

## 30. Estado de la decisión

**Aceptado.**

Supabase será el backend gestionado principal del MVP de BuscoHuella.

---

## 31. Regla final

> Supabase debe reducir complejidad operativa sin convertirse en una excusa para descuidar seguridad, modelado, migraciones o privacidad.
