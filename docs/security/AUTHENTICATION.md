# BuscoHuella — Autenticación

> Estrategia técnica de FP-002 — Autenticación web con Supabase Auth.

## 1. Propósito

Este documento define la arquitectura de autenticación de la aplicación web de BuscoHuella.

Su objetivo es garantizar:

- registro e inicio de sesión seguros;
- sesiones persistentes;
- protección de rutas;
- separación entre interfaz y acceso a datos;
- compatibilidad con Server Components;
- recuperación de contraseña;
- evolución futura hacia la app móvil;
- cumplimiento de principios de seguridad y privacidad.

## 2. Alcance de FP-002

FP-002 incluye:

- registro mediante correo electrónico y contraseña;
- confirmación de correo cuando el entorno lo requiera;
- inicio de sesión;
- recuperación de contraseña;
- actualización de contraseña;
- sesión persistente;
- actualización segura de sesión;
- cierre de sesión;
- protección de rutas privadas;
- redirección desde rutas públicas;
- perfil básico vinculado al usuario;
- estados de carga, éxito y error;
- documentación técnica;
- validación manual, lint y build.

## 3. Fuera de alcance

No se incluye inicialmente:

- inicio de sesión con Google;
- inicio de sesión con Apple;
- autenticación mediante teléfono;
- MFA;
- SSO institucional;
- passkeys;
- gestión avanzada de organizaciones;
- roles administrativos completos;
- invitaciones de equipo;
- impersonación;
- enlaces mágicos como método principal.

Estas funciones podrán evaluarse en Feature Packs posteriores.

## 4. Proveedor de autenticación

BuscoHuella utilizará:

```text
Supabase Auth
```

Supabase gestionará:

- usuarios;
- credenciales;
- tokens;
- refresh tokens;
- confirmación de correo;
- recuperación de contraseña;
- sesiones;
- eventos de autenticación.

La aplicación nunca almacenará contraseñas.

## 5. Arquitectura general

```text
Interfaz
   ↓
Feature Auth
   ↓
Servicio de autenticación
   ↓
Cliente Supabase
   ↓
Supabase Auth
```

Los componentes no deben llamar directamente a Supabase.

## 6. Estructura prevista

```text
apps/web/src/
├── app/
│   ├── (auth)/
│   │   ├── iniciar-sesion/
│   │   ├── registro/
│   │   ├── recuperar-contrasena/
│   │   └── actualizar-contrasena/
│   ├── auth/
│   │   └── callback/
│   └── (app)/
├── features/
│   └── auth/
│       ├── components/
│       ├── actions/
│       ├── services/
│       ├── schemas/
│       ├── types/
│       └── utils/
├── services/
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       └── middleware.ts
└── providers/
    └── auth-provider.tsx
```

La estructura podrá adaptarse durante la implementación si Next.js o Supabase exigen una organización distinta.

## 7. Clientes Supabase

### Cliente de navegador

Se utilizará en Client Components cuando sea necesario:

- escuchar cambios de sesión;
- acciones interactivas;
- cierre de sesión;
- funcionalidades en tiempo real.

Nunca recibirá claves privadas.

Variables permitidas:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Cliente de servidor

Se utilizará en:

- Server Components;
- Server Actions;
- Route Handlers;
- validación de sesión;
- lectura segura de cookies.

### Cliente de middleware o proxy

Será responsable de:

- refrescar sesión;
- mantener cookies actualizadas;
- proteger rutas;
- aplicar redirecciones.

No ejecutará lógica de negocio.

## 8. Variables de entorno

Archivo local:

```text
apps/web/.env.local
```

Variables públicas:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Reglas:

- `.env.local` no se versiona;
- no usar `service_role` en el navegador;
- no incluir secretos en commits;
- usar valores distintos por entorno;
- documentar las variables en `.env.example`.

## 9. Rutas públicas

Rutas accesibles sin sesión:

```text
/iniciar-sesion
/registro
/recuperar-contrasena
/actualizar-contrasena
/auth/callback
```

Las páginas legales podrán seguir siendo públicas en la web corporativa.

## 10. Rutas privadas

Rutas que requieren sesión:

```text
/
/mapa
/reportes
/mascotas
/perfil
```

Una persona sin sesión será redirigida a:

```text
/iniciar-sesion
```

La URL original podrá conservarse como destino de retorno.

## 11. Redirecciones

### Sin sesión

```text
Ruta privada
→ /iniciar-sesion
```

### Con sesión

```text
/iniciar-sesion
/registro
→ /
```

### Recuperación

```text
Correo de recuperación
→ /auth/callback
→ /actualizar-contrasena
```

### Cierre de sesión

```text
Logout
→ /iniciar-sesion
```

## 12. Flujos

### 12.1 Registro

```text
Formulario
→ validación
→ signUp
→ confirmación de correo
→ creación o sincronización de perfil
→ inicio o login según configuración
```

Campos iniciales:

- nombre;
- correo;
- contraseña;
- confirmación de contraseña;
- aceptación de términos y privacidad.

### 12.2 Inicio de sesión

```text
Correo + contraseña
→ validación
→ signInWithPassword
→ sesión
→ redirección
```

### 12.3 Recuperación de contraseña

```text
Correo
→ resetPasswordForEmail
→ correo seguro
→ callback
→ nueva contraseña
→ sesión actualizada
```

### 12.4 Cierre de sesión

```text
Acción
→ signOut
→ eliminar sesión
→ limpiar estado
→ redirección
```

## 13. Validación

La validación debe existir antes de llamar a Supabase.

Reglas iniciales:

### Correo

- obligatorio;
- formato válido;
- normalizado;
- sin espacios accidentales.

### Contraseña

Mínimo inicial:

- 8 caracteres;
- una mayúscula;
- una minúscula;
- un número.

La política podrá reforzarse según configuración de Supabase y evaluación de UX.

### Confirmación

Debe coincidir exactamente con la contraseña.

### Términos

El registro requiere aceptación explícita de:

- términos;
- política de privacidad.

No se marcarán por defecto.

## 14. Mensajes de error

Los mensajes deben ser comprensibles y no revelar información sensible.

Ejemplos:

```text
No se ha podido iniciar sesión. Revisa tus datos.
No se ha podido completar el registro.
El enlace ha caducado o ya no es válido.
La contraseña no cumple los requisitos.
```

Evitar:

- mostrar stack traces;
- exponer mensajes internos;
- confirmar si un correo existe cuando pueda facilitar enumeración de usuarios;
- mostrar tokens o códigos técnicos.

Los errores técnicos deben mapearse a mensajes de producto.

## 15. Estado de autenticación

El estado mínimo incluye:

```ts
interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}
```

No se copiará toda la sesión a stores innecesarios.

La fuente de verdad seguirá siendo Supabase y las cookies seguras.

## 16. Auth Provider

El provider podrá exponer:

```ts
user
session
isLoading
signIn
signUp
signOut
resetPassword
updatePassword
```

Responsabilidades:

- escuchar cambios de sesión;
- mantener estado de interfaz;
- evitar duplicación;
- ofrecer una API estable.

No debe sustituir la protección de servidor.

## 17. Server Actions

Las operaciones de formularios podrán implementarse mediante Server Actions cuando sea adecuado.

Ventajas:

- lógica sensible fuera del cliente;
- integración con formularios;
- redirecciones del servidor;
- menor exposición de detalles.

Las acciones deben:

- validar entradas;
- manejar errores;
- evitar datos sensibles en logs;
- devolver estados serializables;
- no contener lógica ajena a autenticación.

## 18. Perfil de usuario

Supabase Auth mantiene la identidad.

BuscoHuella tendrá una tabla de perfil separada:

```text
profiles
```

Relación:

```text
profiles.id
→ auth.users.id
```

Campos mínimos previstos:

```text
id
display_name
avatar_url
locale
created_at
updated_at
```

Los campos definitivos se definirán junto al esquema de base de datos.

## 19. Roles

Para el MVP, toda cuenta nueva empezará con un rol básico:

```text
citizen
```

Los roles futuros podrán incluir:

```text
citizen
shelter
professional
municipality
admin
```

El rol nunca debe confiarse únicamente al cliente.

La autorización real se aplicará mediante:

- RLS;
- claims autorizados;
- políticas de servidor;
- comprobaciones de permisos.

## 20. Row Level Security

Las tablas con datos personales o privados deben activar RLS.

Principio:

```text
Un usuario solo puede leer o modificar
los datos que le pertenecen
o para los que tiene permiso explícito.
```

Ejemplo conceptual para perfiles:

```text
SELECT propio perfil
UPDATE propio perfil
```

Las políticas concretas se documentarán en el esquema de base de datos.

## 21. Modo invitado

El modo invitado no se implementará automáticamente dentro de FP-002.

Decisión provisional:

- se mantiene como opción de producto;
- se evaluará antes del cierre del Feature Pack;
- podrá permitir exploración pública limitada;
- no permitirá crear reportes, mascotas ni avistamientos sin autenticación.

La navegación pública no debe confundirse con una sesión autenticada falsa.

## 22. Seguridad

Reglas obligatorias:

- cookies seguras;
- tokens gestionados por Supabase;
- no almacenar tokens manualmente en `localStorage`;
- no usar `service_role` en cliente;
- no registrar contraseñas;
- no incluir secretos en errores;
- usar HTTPS en producción;
- validar en servidor;
- proteger operaciones con RLS;
- revisar URLs de redirección permitidas;
- limitar datos personales;
- aplicar privacidad desde el diseño.

## 23. Correo y redirecciones

Supabase deberá configurar:

```text
Site URL
Redirect URLs
Email templates
```

Entornos previstos:

```text
http://localhost:3000
https://app.buscohuella.es
```

No se permitirán redirecciones abiertas.

## 24. Accesibilidad

Las pantallas de autenticación deben incluir:

- labels visibles;
- campos con `autocomplete`;
- mensajes asociados mediante `aria-describedby`;
- estado `aria-invalid`;
- foco al primer error;
- botones con estado loading;
- contraste AA;
- navegación completa con teclado;
- opción de mostrar u ocultar contraseña;
- mensajes que no dependan solo del color.

Valores de autocompletado recomendados:

```text
email
current-password
new-password
name
```

## 25. Estados de interfaz

Cada formulario debe contemplar:

```text
Inicial
Escribiendo
Validando
Enviando
Éxito
Error
Desactivado
```

Durante el envío:

- evitar doble envío;
- mantener feedback visible;
- no borrar datos sin necesidad;
- permitir reintento.

## 26. Observabilidad

Durante el MVP se registrarán únicamente eventos técnicos necesarios.

No se registrarán:

- contraseñas;
- tokens;
- enlaces de recuperación completos;
- datos personales innecesarios.

Eventos de producto posibles:

```text
UserRegistrationStarted
UserRegistered
UserLoginSucceeded
UserLoginFailed
PasswordResetRequested
PasswordUpdated
UserLoggedOut
```

La analítica deberá respetar privacidad y consentimiento.

## 27. Testing

### Validación manual

- registro válido;
- registro inválido;
- correo duplicado;
- login válido;
- login incorrecto;
- recuperación;
- enlace caducado;
- sesión tras recarga;
- acceso privado sin sesión;
- acceso a login con sesión;
- logout;
- teclado;
- móvil;
- escritorio.

### Automatización futura

- tests de schemas;
- tests de servicios;
- tests de Server Actions;
- tests de middleware;
- tests end-to-end.

## 28. Criterios de aceptación

FP-002 se considerará completado cuando:

- el usuario pueda registrarse;
- pueda iniciar sesión;
- pueda recuperar su contraseña;
- la sesión persista;
- las rutas privadas estén protegidas;
- las rutas de auth redirijan con sesión;
- el cierre de sesión funcione;
- exista un perfil básico;
- los errores sean accesibles;
- no haya secretos versionados;
- lint y build pasen;
- la documentación esté actualizada;
- Notion refleje el resultado.

## 29. Validación técnica

```powershell
pnpm --filter @buscohuella/web lint
pnpm --filter @buscohuella/web build
```

Cuando existan tests:

```powershell
pnpm --filter @buscohuella/web test
```

## 30. Orden de implementación

```text
1. Dependencias y variables de entorno
2. Clientes Supabase
3. Schemas y tipos
4. Servicio de autenticación
5. Route group público
6. Pantallas de registro y login
7. Recuperación y actualización
8. Middleware/proxy
9. Provider y sesión
10. Logout y perfil
11. RLS
12. Tests
13. Documentación final
```

## 31. Estado

```text
Feature Pack: FP-002
Nombre: Autenticación
Estado: Planificado
Dependencia principal: Supabase
Anterior: FP-001 — App Shell
```
