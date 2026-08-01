# BuscoHuella — Arquitectura de rutas

> Convención canónica de rutas públicas, autenticadas y de recuperación para la aplicación web.

## 1. Objetivo

La arquitectura debe permitir:

- acceso inmediato a información útil;
- navegación sin cuenta;
- protección de datos personales;
- gestión privada para usuarios autenticados;
- enlaces públicos compartibles;
- fichas QR;
- crecimiento sin mezclar sesión e identificadores.

## 2. Route Groups

Next.js permite agrupar rutas con carpetas entre paréntesis sin incluirlas en la URL.

Estructura actual:

```text
src/app/
├── (public)/
├── (auth)/
├── (private)/
├── (recovery)/
└── auth/
```

Las carpetas de grupo no aparecen en el navegador.

Ejemplo:

```text
src/app/(private)/inicio/page.tsx
→ /inicio
```

## 3. Rutas públicas

Accesibles con o sin sesión:

```text
/
/mapa
/reportes
```

El layout público puede leer una sesión opcional.

Sin sesión muestra:

- iniciar sesión;
- crear cuenta.

Con sesión muestra:

- acceso al área personal.

### Futuras rutas públicas

```text
/reportes/[slug]
/qr/[codigo]
/avistamientos/[reporte]
/u/[alias]
```

## 4. Rutas de autenticación

```text
/login
/registro
/recuperar-contrasena
```

El layout `(auth)` comprueba si ya existe usuario.

Con sesión:

```text
/login
→ /inicio
```

Esto evita mostrar formularios de acceso a usuarios ya autenticados.

## 5. Rutas privadas

Requieren usuario autenticado:

```text
/inicio
/mis-mascotas
/mis-reportes
/perfil
/configuracion
```

El layout `(private)` ejecuta:

```text
getCurrentUser()
```

Sin usuario:

```text
→ /login
```

## 6. Recuperación

Ruta:

```text
/nueva-contrasena
```

Pertenece al grupo `(recovery)` y no a `(auth)`.

Motivo:

- el enlace de recuperación crea una sesión temporal;
- el layout normal de auth redirigiría una sesión a `/inicio`;
- el layout recovery necesita validar un contexto adicional.

Acceso válido requiere:

- sesión temporal;
- cookie HTTP-only de recuperación.

## 7. Sesiones

La sesión nunca se incluye en la URL.

Incorrecto:

```text
/inicio/session-83hf93hf
```

Correcto:

```text
/inicio
```

La sesión se almacena en cookies.

Beneficios:

- no aparece en el historial;
- no se comparte al copiar enlaces;
- no llega a analítica como parte de la ruta;
- no expone credenciales;
- permite SSR seguro.

## 8. Identificadores públicos

Los recursos concretos sí requieren un identificador.

### Reportes

Propuesta:

```text
/reportes/luna-perdida-sabadell-8f31
```

Puede combinar:

- slug legible;
- sufijo aleatorio corto.

El slug mejora comprensión y compartición.

El código evita colisiones y enumeración trivial.

### QR

Propuesta:

```text
/qr/7K9X-PQ2M
```

El código QR:

- será aleatorio;
- no será el ID interno;
- no revelará el usuario;
- no revelará la cantidad de registros;
- podrá rotarse o revocarse.

### Perfil público

Propuesta:

```text
/u/xaviku
```

Solo existirá si el usuario activa el perfil público.

No se utilizará como canal obligatorio para reportes o mascotas.

## 9. Perfil público y contacto

El perfil público podrá mostrar opcionalmente:

- alias;
- avatar;
- municipio aproximado;
- biografía;
- insignias;
- contribuciones;
- rutas;
- organizaciones vinculadas.

No mostrará por defecto:

- correo;
- teléfono;
- dirección;
- ubicación exacta;
- documentación;
- datos privados de mascotas.

## 10. Contacto seguro

El contacto por una mascota o reporte será contextual.

Ejemplo:

```text
/qr/7K9X-PQ2M
→ Avisar a su familia
```

El sistema podrá:

- crear una notificación;
- enviar un mensaje protegido;
- mostrar datos autorizados;
- permitir un avistamiento.

El dueño podrá mantener desactivado su perfil público y seguir recibiendo avisos.

## 11. Invitados

Un visitante sin cuenta podrá:

- abrir `/`;
- explorar `/mapa`;
- consultar `/reportes`;
- abrir una ficha pública;
- escanear un QR;
- comunicar información básica futura.

No podrá:

- gestionar mascotas;
- editar reportes;
- acceder al perfil;
- consultar información privada;
- gestionar notificaciones.

## 12. Nombres canónicos

Se usarán rutas orientadas a intención:

```text
/mis-mascotas
/mis-reportes
```

en lugar de:

```text
/mascotas
/reportes
```

cuando se trate de gestión privada.

La ruta pública conserva:

```text
/reportes
```

## 13. Mapa

`/mapa` es público.

Las funciones podrán variar según sesión:

Sin cuenta:

- consultar casos públicos;
- usar filtros básicos;
- abrir fichas;
- iniciar avistamiento.

Con cuenta:

- guardar preferencias;
- recibir alertas;
- crear reportes;
- acceder a funciones personales.

## 14. Convenciones

- español como idioma de ruta inicial;
- nombres en minúscula;
- palabras separadas por guion;
- evitar IDs secuenciales públicos;
- evitar información sensible en query strings;
- validar redirecciones;
- no usar alias como identificador interno;
- mantener IDs internos inmutables;
- permitir cambiar alias público.

## 15. Evolución multiidioma

La estrategia definitiva de i18n se definirá antes de acumular demasiadas funcionalidades.

Posibles formatos:

```text
/ca/mapa
/en/map
```

o idioma por preferencia y rutas canónicas independientes.

No se añadirá un prefijo `/es` por defecto si se mantiene la estrategia histórica del proyecto.

## 16. Modo oscuro

El modo oscuro no modifica la arquitectura de rutas.

Se gestionará mediante:

- preferencias del usuario;
- tokens CSS;
- configuración del sistema;
- persistencia de tema.

## 17. Estado actual

Implementado:

```text
/
/mapa
/reportes
/login
/registro
/recuperar-contrasena
/nueva-contrasena
/inicio
/mis-mascotas
/mis-reportes
/perfil
```

Pendiente:

```text
/configuracion
/reportes/[slug]
/qr/[codigo]
/avistamientos/[reporte]
/u/[alias]
```

## 18. Decisión canónica

BuscoHuella es una plataforma de acceso mixto:

```text
Contenido público
+ funciones limitadas para invitados
+ gestión privada autenticada
```

Nunca se exigirá una cuenta para consultar información pública urgente o escanear una chapa QR.
