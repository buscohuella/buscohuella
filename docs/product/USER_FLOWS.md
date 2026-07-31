# 🐾 BuscoHuella - User Flows

> Documento de definición de los flujos principales de usuario


# 1. Información del documento

| Campo | Valor |
|---|---|
| Proyecto | BuscoHuella |
| Documento | User Flows |
| Versión | 1.0 |
| Estado | Definición |
| Tipo | Producto / UX |
| Última actualización | 2026-07-31 |


---

# 2. Introducción


## 2.1 Objetivo

Este documento define los principales recorridos de usuario dentro de BuscoHuella.

El objetivo es establecer cómo interactúan los diferentes tipos de usuarios con la plataforma, desde la primera apertura de la aplicación hasta la resolución de un caso.

Los flujos sirven como referencia para:

- Diseño UX/UI.
- Desarrollo frontend.
- Desarrollo backend.
- Definición de permisos.
- Pruebas funcionales.


---


## 2.2 Principios de navegación


BuscoHuella seguirá los siguientes principios:

### Simplicidad

Las acciones principales deben estar disponibles con pocos pasos:

- Crear reporte.
- Buscar animales.
- Contactar usuarios.


### Seguridad

Las acciones sensibles requieren usuario identificado:

- Crear reportes.
- Enviar mensajes.
- Gestionar mascotas.


### Localización

La ubicación será un elemento central:

- Mostrar casos cercanos.
- Facilitar coincidencias.
- Priorizar información relevante.


### Confianza

Los usuarios deben conocer:

- Quién publica información.
- Estado del caso.
- Nivel de verificación.


---

# 3. Tipos de usuario


## 3.1 Usuario visitante

Usuario sin cuenta.

Puede:

- Consultar mapa.
- Buscar animales.
- Ver reportes públicos.
- Consultar organizaciones.


Limitaciones:

- No puede crear reportes.
- No puede contactar usuarios.
- No puede gestionar mascotas.


---


## 3.2 Usuario registrado

Usuario particular autenticado.

Puede:

- Crear perfil.
- Registrar mascotas.
- Crear reportes.
- Contactar usuarios.
- Recibir notificaciones.


---


## 3.3 Organización

Entidad relacionada con protección animal.

Ejemplos:

- Protectoras.
- Refugios.
- Centros municipales.


Puede:

- Crear perfil profesional.
- Gestionar casos.
- Recibir avisos.
- Publicar información.


---


## 3.4 Profesional

Usuario relacionado con servicios animales.

Ejemplos:

- Veterinarios.
- Educadores.
- Residencias.


Puede:

- Crear perfil profesional.
- Aparecer en mapa.
- Recibir contactos.


---

# 4. Flujo inicial de aplicación


Usuario abre aplicación

↓

Carga configuración inicial

↓

Detecta idioma

↓

Comprueba sesión existente


## Usuario sin sesión


Pantalla bienvenida


Opciones:

- Crear cuenta.
- Iniciar sesión.
- Entrar sin cuenta.


## Usuario con sesión


↓

Validación sesión


↓

Carga:

- Perfil.
- Mascotas.
- Permisos.
- Notificaciones.


↓

Acceso Home.


---

# 5. Flujo de registro


## 5.1 Registro usuario particular


Paso 1:

Datos básicos:

- Nombre.
- Email.
- Contraseña.


↓

Aceptación:

- Política privacidad.
- Términos.


↓

Paso 2:

Configuración perfil:

- Imagen.
- Ubicación.
- Preferencias.


↓

Paso 3:

Crear mascota opcional.


Resultado:

Usuario registrado.


---

# 6. Flujo recuperación contraseña


Usuario pulsa:

"¿Has olvidado tu contraseña?"


↓

Introduce email


↓

Sistema envía recuperación


↓

Usuario cambia contraseña


↓

Acceso aplicación


---

# 7. Flujo inicio sesión


Usuario introduce credenciales


↓

Validación Supabase Auth


↓

Comprobación usuario


↓

Carga:

- Perfil.
- Roles.
- Permisos.


↓

Acceso aplicación.


Errores posibles:

- Usuario inexistente.
- Contraseña incorrecta.
- Cuenta bloqueada.


---

# 8. Flujo usuario sin cuenta


Usuario visitante:


Puede:

✅ Ver mapa

✅ Buscar animales

✅ Consultar información pública


No puede:

❌ Crear reportes

❌ Contactar usuarios

❌ Crear mascotas


Acción protegida:

↓

Mostrar mensaje:

"Necesitas crear una cuenta para continuar"


↓

Opciones:

- Registrarse.
- Iniciar sesión.


---

# 9. Flujo gestión de mascotas


Usuario


↓

Mis mascotas


↓

Seleccionar mascota


Opciones:

- Crear.
- Editar.
- Eliminar.
- Ver historial.


Datos:

- Nombre.
- Tipo.
- Raza.
- Foto.
- Edad.
- Sexo.
- Color.
- Características.
- Microchip.


Resultado:

Mascota actualizada.


---

# 10. Flujo creación reporte perdido


Usuario


↓

Crear reporte


↓

Seleccionar mascota


↓

Introducir información:


- Fecha pérdida.
- Última ubicación.
- Fotografías.
- Descripción.
- Datos contacto.


↓

Confirmar publicación


↓

Validación


↓

Publicación en mapa


Resultado:

Reporte activo.


---

# 11. Flujo creación reporte encontrado


Usuario


↓

Crear reporte encontrado


↓

Introduce:


- Tipo animal.
- Ubicación.
- Fecha.
- Fotografías.
- Descripción.


↓

Publicar


Resultado:

Animal visible en mapa.


---

# 12. Flujo búsqueda de animales


Usuario


↓

Mapa


↓

Aplicar filtros:


- Tipo animal.
- Distancia.
- Estado.
- Fecha.


↓

Selecciona marcador


↓

Visualiza detalle


Acciones:

- Contactar.
- Guardar.
- Compartir.


---

# 13. Flujo contacto


Usuario encuentra reporte


↓

Pulsa contactar


↓

Validación permisos


↓

Crear conversación


↓

Enviar mensajes


Estados:

- Pendiente.
- Activa.
- Cerrada.


---

# 14. Flujo notificaciones


Sistema genera evento:


Ejemplos:

- Nuevo mensaje.
- Coincidencia cercana.
- Cambio estado reporte.


↓

Enviar notificación


↓

Usuario abre aviso


↓

Accede al contenido relacionado.


---

# 15. Flujo coincidencias


Sistema analiza:


- Ubicación.
- Tipo animal.
- Características.


↓

Detecta posible coincidencia


↓

Genera aviso


↓

Usuario revisa información


↓

Contacta si procede.


---

# 16. Flujo organización


Registro organización


↓

Validación administrativa


↓

Creación perfil


↓

Panel organización


Funciones:

- Gestionar casos.
- Publicar información.
- Recibir alertas.


---

# 17. Flujo profesional


Registro profesional


↓

Validación


↓

Perfil profesional


↓

Visible en mapa


Funciones:

- Recibir contactos.
- Gestionar información pública.


---

# 18. Flujo cierre de caso


Usuario encuentra mascota


↓

Actualiza reporte


Estados:


Activo

↓

Encontrado

↓

Cerrado


Acciones:

- Confirmar recuperación.
- Añadir información final.
- Archivar.


---

# 19. Flujo usuario bloqueado


Sistema detecta:


- Incumplimiento normas.
- Reportes abusivos.
- Actividad sospechosa.


↓

Bloqueo temporal o permanente


↓

Restricción acceso.


---

# 20. Flujo modo offline


Sin conexión:


Permitir:

- Visualizar datos almacenados.
- Consultar últimos reportes.


No permitir:

- Crear reportes.
- Enviar mensajes.


Cuando vuelve conexión:

↓

Sincronización automática.


---

# 21. Resumen navegación


## Visitante

Inicio

↓

Mapa

↓

Detalle reporte


---


## Usuario registrado

Login

↓

Home

↓

Mascotas

↓

Reportes

↓

Mensajes

↓

Perfil


---


## Organización

Login

↓

Panel organización

↓

Casos

↓

Notificaciones


---


# 22. Estados globales


## Usuario

- Visitante.
- Registrado.
- Verificado.
- Bloqueado.


## Reporte

- Borrador.
- Activo.
- En búsqueda.
- Encontrado.
- Cerrado.
- Archivado.


## Conversación

- Pendiente.
- Activa.
- Cerrada.


---

# 23. Documentos relacionados


- `/docs/product/MVP_SCOPE.md`
- `/docs/domain/DOMAIN_MODEL.md`
- `/docs/mobile/MOBILE_NAVIGATION.md`
- `/docs/database/DATABASE_SCHEMA.md`
- `/docs/identity/AUTH_FLOW.md`
- `/docs/requirements/MVP_REQUIREMENTS.md`