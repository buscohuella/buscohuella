# 🐾 BuscoHuella - MVP Scope

> Documento de definición del alcance del Producto Mínimo Viable (MVP)

---

# 1. Información del documento

| Campo | Valor |
|---|---|
| Proyecto | BuscoHuella |
| Documento | MVP Scope |
| Versión | 1.0 |
| Estado | Definición |
| Tipo | Producto |
| Última actualización | 2026-07-31 |

---

# 2. Introducción

## 2.1 Propósito

Este documento define el alcance funcional del MVP de BuscoHuella.

El objetivo es establecer claramente qué funcionalidades forman parte de la primera versión del producto, evitando desviaciones durante el desarrollo y garantizando que el equipo pueda centrarse en validar la propuesta de valor principal.

---

## 2.2 Visión del MVP

BuscoHuella nace con el objetivo de ayudar a encontrar animales perdidos conectando:

- Personas que han perdido una mascota.
- Personas que han encontrado un animal.
- Asociaciones protectoras.
- Profesionales veterinarios.
- Comunidades locales.

La primera versión se centrará en crear una red de ayuda basada en:

- Reportes de animales perdidos y encontrados.
- Geolocalización.
- Información de mascotas.
- Comunicación entre usuarios.
- Alertas y notificaciones.

---

# 3. Objetivo principal del MVP

El objetivo principal del MVP es validar que una comunidad puede ayudar a recuperar animales perdidos mediante una plataforma digital basada en ubicación.

La pregunta principal que queremos responder es:

> ¿Puede una plataforma local aumentar las posibilidades de encontrar una mascota perdida conectando rápidamente personas, información y localización?

---

# 4. Usuarios objetivo

## 4.1 Usuario particular

Persona que:

- Tiene una mascota.
- Ha perdido un animal.
- Ha encontrado un animal perdido.
- Quiere ayudar a la comunidad.

Ejemplos:

- Dueño de perro perdido.
- Persona que encuentra un gato abandonado.
- Vecino que quiere colaborar.

---

## 4.2 Organización

Entidad dedicada al cuidado animal:

Ejemplos:

- Protectoras.
- Refugios.
- Asociaciones animales.
- Centros municipales.

Necesidades:

- Gestionar casos.
- Publicar información.
- Recibir avisos cercanos.

---

## 4.3 Profesional

Usuarios relacionados con servicios animales:

Ejemplos:

- Veterinarios.
- Educadores caninos.
- Residencias.
- Servicios de transporte animal.

---

# 5. Alcance funcional del MVP

---

# 5.1 Sistema de usuarios

## Incluido

✅ Registro de usuario

Métodos iniciales:

- Email
- Teléfono (futuro según proveedor)

---

✅ Inicio de sesión

Incluye:

- Autenticación segura.
- Gestión de sesión.
- Recuperación de acceso.

---

✅ Perfil de usuario

Información:

- Nombre.
- Imagen.
- Localización.
- Tipo de usuario.

Tipos:

- Particular.
- Organización.
- Profesional.

---

# 5.2 Gestión de mascotas

## Incluido

Los usuarios podrán crear perfiles de mascotas.

Información:

- Nombre.
- Tipo de animal.
- Raza.
- Sexo.
- Edad.
- Color.
- Características especiales.
- Fotografías.
- Microchip (opcional).

---

Objetivo:

Crear una ficha identificativa que facilite la búsqueda.

---

# 5.3 Reporte de animal perdido

## Incluido

Un usuario podrá crear una alerta de mascota perdida.

Datos:

- Mascota asociada.
- Fecha de pérdida.
- Última ubicación conocida.
- Fotografías.
- Descripción.
- Información adicional.
- Estado del reporte.

Estados:
```text
Activo
En búsqueda
Encontrado
Cerrado
```

---

# 5.4 Reporte de animal encontrado

## Incluido

Un usuario podrá informar de un animal encontrado.

Datos:

- Tipo de animal.
- Ubicación.
- Fecha.
- Fotografías.
- Descripción.
- Estado.

---

# 5.5 Mapa y geolocalización

## Incluido

Mapa principal con:

- Animales perdidos.
- Animales encontrados.
- Organizaciones.
- Servicios relacionados.

Funciones:

- Visualización de marcadores.
- Centrado en ubicación actual.
- Consulta de información.

---

# 5.6 Sistema de búsqueda

## Incluido

Búsqueda básica:

Filtros:

- Tipo de animal.
- Ubicación.
- Estado.
- Distancia.

---

# 5.7 Comunicación

## Fuera del MVP inicial

El chat interno y el envío de mensajes entre usuarios no forman parte del
MVP inicial. Cualquier mecanismo de contacto futuro deberá definirse en una
fase posterior, con sus requisitos de privacidad, moderación y protección de
datos.

---

# 5.8 Notificaciones

## Incluido

Notificaciones básicas:

- Nuevo mensaje.
- Actualización de reporte.
- Coincidencias cercanas.

---

# 6. Funcionalidades fuera del MVP

Estas funcionalidades quedan fuera de la primera versión.

---

## Inteligencia Artificial

No incluido inicialmente:

- Reconocimiento facial animal.
- Comparación automática de fotografías.
- Predicción de coincidencias.

Planificado para futuras versiones.

---

## Marketplace

No incluido:

- Venta de productos.
- Servicios premium.
- Tienda.

---

## Pagos

No incluido:

- Suscripciones.
- Donaciones.
- Pagos a profesionales.

---

## Red social avanzada

No incluido:

- Publicaciones.
- Seguidores.
- Historias.
- Comunidad tipo red social.

---

## Aplicación administrativa avanzada

No incluido inicialmente:

- Dashboard completo.
- Estadísticas avanzadas.
- Gestión compleja.

---

# 7. Priorización MVP

## Must Have (Obligatorio)

| Funcionalidad | Prioridad |
|-|-|
| Registro usuarios | 🔴 Alta |
| Login | 🔴 Alta |
| Perfil mascota | 🔴 Alta |
| Reporte perdido | 🔴 Alta |
| Reporte encontrado | 🔴 Alta |
| Mapa | 🔴 Alta |
| Geolocalización | 🔴 Alta |
| Contacto usuario | 🔴 Alta |

---

## Should Have (Importante)

| Funcionalidad | Prioridad |
|-|-|
| Notificaciones | 🟠 Media |
| Filtros avanzados | 🟠 Media |
| Organizaciones | 🟠 Media |
| Favoritos | 🟠 Media |

---

## Could Have (Futuro)

| Funcionalidad | Prioridad |
|-|-|
| IA reconocimiento | 🟢 Baja |
| Chat avanzado | 🟢 Baja |
| Gamificación | 🟢 Baja |
| Estadísticas públicas | 🟢 Baja |

---

# 8. Criterios de éxito del MVP

El MVP será considerado válido si consigue:

## Usuarios

- Usuarios capaces de registrarse.
- Usuarios capaces de crear una mascota.
- Usuarios capaces de publicar casos.

---

## Recuperación

- Casos encontrados mediante la plataforma.
- Contactos generados entre usuarios.

---

## Comunidad

- Participación local.
- Incremento de reportes.
- Interacción entre usuarios.

---

# 9. Evolución prevista

## Versión 1.0

Base funcional:

- Usuarios.
- Mascotas.
- Reportes.
- Mapa.
- Contacto.

---

## Versión 1.5

Mejoras:

- Notificaciones avanzadas.
- Organizaciones verificadas.
- Mejoras de búsqueda.

---

## Versión 2.0

Funciones inteligentes:

- IA.
- Reconocimiento de imágenes.
- Predicción de coincidencias.
- Red comunitaria avanzada.

---

# 10. Decisiones relacionadas

Documentos relacionados:

- `/docs/product/VISION.md`
- `/docs/product/ROADMAP.md`
- `/docs/product/USER_FLOWS.md`
- `/docs/domain/DOMAIN_MODEL.md`
- `/docs/requirements/MVP_REQUIREMENTS.md`

---

# Estado

Documento preparado para guiar el desarrollo inicial del MVP de BuscoHuella.
