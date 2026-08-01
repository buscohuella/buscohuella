# BuscoHuella — Autenticación

> Documentación técnica de FP-002 — Autenticación SSR con Supabase.

## 1. Estado

- **Feature Pack:** FP-002
- **Estado:** Implementado y validado en desarrollo local
- **Aplicación:** `apps/web`
- **Proveedor de identidad:** Supabase Auth
- **Renderizado:** Next.js App Router con SSR
- **Sesión:** Cookies seguras gestionadas mediante `@supabase/ssr`

## 2. Alcance implementado

FP-002 incluye:

- registro con correo y contraseña;
- confirmación de correo;
- inicio de sesión;
- persistencia de sesión;
- cierre de sesión;
- recuperación de contraseña;
- actualización de contraseña;
- protección de rutas privadas;
- separación entre rutas públicas, privadas y de autenticación;
- mensajes de éxito y error;
- política de contraseña;
- enfriamiento visual para reenvío de recuperación;
- protección de acceso directo a `/nueva-contrasena`;
- prevención de enumeración de cuentas.

## 3. Dependencias

```json
{
  "@supabase/supabase-js": "cliente oficial de Supabase",
  "@supabase/ssr": "integración SSR y cookies"
}
```

## 4. Variables de entorno

Archivo local:

```text
apps/web/.env.local
```

Variables necesarias:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Plantilla versionada:

```text
apps/web/.env.example
```

Nunca deben versionarse secretos ni contraseñas SMTP.

## 5. Clientes Supabase

### Cliente de navegador

```text
apps/web/src/services/supabase/client.ts
```

Uso:

- componentes cliente;
- suscripciones;
- operaciones que deban ejecutarse en el navegador.

### Cliente de servidor

```text
apps/web/src/services/supabase/server.ts
```

Uso:

- Server Components;
- Server Actions;
- Route Handlers;
- lectura autenticada con cookies.

### Renovación de sesión

```text
apps/web/src/services/supabase/proxy.ts
apps/web/src/proxy.ts
```

El Proxy renueva cookies de autenticación cuando corresponde.

No contiene lógica de autorización de producto. La protección de rutas se realiza en layouts del servidor.

## 6. Registro

Ruta:

```text
/registro
```

Acción:

```text
apps/web/src/features/auth/actions/register.ts
```

Flujo:

```text
Formulario
→ validación local
→ supabase.auth.signUp()
→ envío de correo
→ confirmación mediante token_hash
→ sesión autenticada
→ /inicio
```

Metadatos guardados actualmente:

```json
{
  "full_name": "Nombre del usuario"
}
```

La creación de un perfil persistente en una tabla `profiles` pertenece al siguiente Feature Pack.

## 7. Confirmación de correo

Route Handler:

```text
apps/web/src/app/auth/confirm/route.ts
```

La plantilla de correo utiliza:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
  Confirmar correo electrónico
</a>
```

El servidor:

1. recibe `token_hash`;
2. ejecuta `verifyOtp`;
3. establece la sesión mediante cookies;
4. redirige a `/inicio?account_confirmed=1`.

## 8. Inicio de sesión

Ruta:

```text
/login
```

Acción:

```text
apps/web/src/features/auth/actions/login.ts
```

Flujo:

```text
Correo y contraseña
→ signInWithPassword()
→ cookies SSR
→ /inicio?login=success
```

Las credenciales incorrectas producen un mensaje genérico:

```text
El correo o la contraseña no son correctos.
```

No se revela qué campo es incorrecto.

## 9. Cierre de sesión

Acción:

```text
apps/web/src/features/auth/actions/logout.ts
```

Flujo:

```text
signOut()
→ cookies eliminadas
→ /login?logged_out=1
```

## 10. Recuperación de contraseña

Ruta inicial:

```text
/recuperar-contrasena
```

Acción:

```text
apps/web/src/features/auth/actions/recover-password.ts
```

Flujo:

```text
Correo
→ resetPasswordForEmail()
→ respuesta genérica
→ correo de recuperación
→ /auth/confirm
→ sesión temporal de recovery
→ /nueva-contrasena
```

La respuesta es deliberadamente genérica:

```text
Si existe una cuenta asociada, recibirás un enlace para cambiar la contraseña.
```

Esto evita enumerar qué correos están registrados.

### Plantilla de recuperación

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/nueva-contrasena">
  Crear nueva contraseña
</a>
```

## 11. Protección del flujo de recuperación

Archivos:

```text
apps/web/src/features/auth/lib/recovery-flow.ts
apps/web/src/app/(recovery)/layout.tsx
```

Al validar un token de tipo `recovery`, BuscoHuella crea una cookie HTTP-only temporal:

```text
buscohuella_recovery_flow
```

Duración actual:

```text
15 minutos
```

Para acceder a `/nueva-contrasena` se requiere:

- sesión válida emitida por Supabase;
- cookie temporal de recuperación.

Comportamiento:

```text
Sin sesión + acceso directo
→ /recuperar-contrasena

Sesión normal + acceso directo
→ /inicio

Token válido de recuperación
→ acceso permitido
```

Tras actualizar la contraseña:

- se elimina la cookie de recuperación;
- se cierra la sesión temporal;
- se redirige al login.

## 12. Política de contraseña

Archivo:

```text
apps/web/src/features/auth/lib/password-policy.ts
```

Requisitos actuales:

- mínimo 8 caracteres;
- al menos una mayúscula;
- al menos una minúscula;
- al menos un número.

La misma política se usa en registro y recuperación.

Mensajes específicos informan qué requisito falta.

## 13. Contraseña repetida

Si Supabase devuelve:

```text
same_password
```

la aplicación muestra:

```text
La nueva contraseña no puede ser igual a la contraseña actual.
```

## 14. Control de reenvío

Después de solicitar recuperación:

- el formulario se reemplaza por un estado de éxito;
- aparece una cuenta atrás de 60 segundos;
- el botón de reenvío permanece desactivado;
- al finalizar puede solicitarse otro enlace.

El cronómetro es una mejora de interfaz.

La protección real se mantiene en el servidor mediante los límites de Supabase.

## 15. SMTP

Proveedor configurado para desarrollo:

```text
DonDominio
```

Remitente usado actualmente:

```text
hola@buscohuella.com
```

La contraseña SMTP:

- no se guarda en Git;
- no se documenta;
- solo se configura en el panel de Supabase.

Pendiente futuro:

- diseño de emails;
- dominio definitivo de envío;
- SPF;
- DKIM;
- DMARC;
- reputación de envío;
- plantillas multiidioma;
- proveedor transaccional escalable si fuera necesario.

## 16. Mensajes de estado

Actualmente se muestran avisos accesibles dentro de la interfaz para:

- cuenta confirmada;
- sesión iniciada;
- sesión cerrada;
- contraseña actualizada;
- correo de recuperación solicitado;
- enlace inválido o caducado;
- errores de contraseña.

Pendiente transversal:

```text
Sistema global de toast/notificaciones de interfaz
```

## 17. Seguridad

Decisiones aplicadas:

- sesiones fuera de la URL;
- cookies HTTP-only cuando corresponde;
- validación de usuario mediante `getUser()`;
- respuestas genéricas para evitar enumeración;
- redirecciones seguras;
- rechazo de rutas externas en `next`;
- cookie temporal para recuperación;
- política de contraseña común;
- límites de correo controlados por Supabase;
- secretos fuera del repositorio.

Pendiente antes de producción:

- CAPTCHA;
- revisión de límites de Auth;
- auditoría de eventos;
- alertas de seguridad;
- protección antifraude;
- MFA opcional;
- gestión de dispositivos;
- pruebas automatizadas;
- política de sesiones;
- eliminación y exportación de cuenta.

## 18. Pruebas manuales realizadas

Se ha validado:

- registro real;
- recepción de correo;
- confirmación;
- usuario confirmado en Supabase;
- login;
- persistencia tras recarga;
- logout;
- bloqueo de rutas privadas;
- acceso público sin cuenta;
- recuperación;
- cambio de contraseña;
- rechazo de contraseña anterior;
- rechazo de contraseña débil;
- rechazo de contraseña repetida;
- acceso directo bloqueado a `/nueva-contrasena`;
- reenvío con enfriamiento;
- respuesta genérica para correo no registrado;
- `pnpm lint`;
- `pnpm build`.

## 19. Comandos de validación

```powershell
pnpm --filter @buscohuella/web lint
pnpm --filter @buscohuella/web build
```

## 20. Próximo bloque

FP-003 deberá implementar:

- tabla `profiles`;
- trigger desde `auth.users`;
- políticas RLS;
- alias;
- avatar;
- municipio;
- visibilidad pública;
- edición de perfil;
- base para roles y reputación futura.
