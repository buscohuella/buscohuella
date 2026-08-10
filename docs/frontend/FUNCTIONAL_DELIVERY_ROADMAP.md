# BuscoHuella — Roadmap de entregas funcionales

## Convención

Estados:

- `DONE` — implementado y validado;
- `IN_PROGRESS` — en desarrollo/pruebas;
- `NEXT` — siguiente bloque previsto;
- `PLANNED` — aprobado pero posterior;
- `VISION` — dirección futura, no comprometida para MVP.

Este documento se actualizará al cerrar cada entrega.

## Actualización validada — ubicación y avistamientos — 8 de agosto de 2026

- `DONE` — mapa público Mapbox con listado alternativo accesible.
- `DONE` — autocompletado de direcciones mediante Mapbox Geocoding.
- `DONE` — selección por clic y pin desplazable.
- `DONE` — selector reutilizado en avisos y avistamientos.
- `DONE` — coordenadas privadas separadas de la proyección pública aproximada.
- `NEXT` — representar ubicaciones aproximadas como zonas circulares para no sugerir una precisión inexistente.

La validación manual confirmó el flujo GPS, búsqueda, selección de sugerencia,
movimiento del pin y creación del avistamiento.

## Avisos

- `DONE` FP-011 — creación de aviso de mascota perdida.
- `DONE` FP-012 — fotografías del aviso.
- `DONE` FP-013 — publicación.
- `DONE` FP-014 — gestión de ciclo de vida.
- `DONE` FP-015 — edición y cierre visual.
- `DONE` FP-016 — ficha pública.

## Avistamientos

- `DONE` FP-017A — creación del avistamiento.
- `DONE` FP-017B — fotografías privadas del avistamiento.
- `DONE` FP-017C — bandeja y gestión para el propietario.
- `DONE` FP-017C.1 — filtros, paginación, contador, archivado y feedback.
- `DONE` FP-018 — `Mis avistamientos` para el colaborador.
- `DONE` FP-018.1 — timeline completo de actividad del avistamiento.

## Perfil, avatar e internacionalización

- `DONE` — perfil privado y público con visibilidad configurable.
- `DONE` — avatar de usuario en formato JPEG, PNG o WebP, con límite de 5 MiB.
- `DONE` — procesamiento seguro en servidor: rotación, redimensionado y conversión a WebP.
- `DONE` — reemplazo y eliminación de la fotografía, manteniendo una única imagen por usuario.
- `DONE` — avatar visible en perfil público cuando el perfil está habilitado y en la navegación privada como fallback de identidad.
- `DONE` — textos de perfil y avatar preparados con i18n para español y catalán.
- `DONE` — selector de archivos accesible, con etiquetas propias traducibles y navegación por teclado.
- Seguridad: bucket privado, RLS por propietario y URLs firmadas; la exposición pública depende de `profiles.is_public`.
- Pendiente no bloqueante: añadir nuevos idiomas mediante diccionarios, sin modificar los componentes.

## Notificaciones

- `DONE` FP-019 — centro de notificaciones interno; validado funcionalmente.
- `DONE` FP-019.1 — nuevo avistamiento para propietario; validado funcionalmente.
- `DONE` FP-019.2 — revisión del avistamiento para colaborador; validado funcionalmente.
- `DONE` FP-019.3 — aviso resuelto / mascota localizada; validado funcionalmente.
- `PLANNED` FP-020 — push web.
- `PLANNED` FP-020.1 — alertas por proximidad.

## Mapa y ubicación

- `DONE` — mapa público + lista accesible de reportes activos.
- `PLANNED` — avisos cercanos por ubicación y radio.
- `DONE` — mapa público de avisos con zonas circulares para ubicaciones aproximadas.
- `DONE` — autocompletado de direcciones.
- `DONE` — marcar ubicación en mapa y pin desplazable.
- `PLANNED` — geocodificación/reverse geocoding avanzada.
- `PLANNED` — mapa privado de búsqueda y avistamientos.
- `PLANNED` — filtros por radio y especie.

### Primera entrega: mapa público y alternativa accesible

Esta entrega cubre únicamente la consulta pública de reportes activos que ya
disponen de una ubicación pública aproximada.

Incluye:

- marcadores no exactos para reportes públicos activos;
- identificación visual y textual del tipo de reporte;
- selección de un marcador y acceso al detalle público;
- filtros básicos compartidos entre mapa y lista;
- lista paginada equivalente para teclado, lectores de pantalla y dispositivos
  donde el mapa no esté disponible;
- estados de carga, vacío, error y ubicación no disponible;
- respeto de la precisión pública y exclusión de coordenadas privadas.

No incluye en esta primera entrega:

- geocodificación o autocompletado;
- consultas por radio o avisos cercanos;
- ubicación actual del usuario;
- edición de ubicaciones;
- Web Push, chat, QR, NFC o GPS.

#### Criterios de aceptación

1. Una persona no autenticada puede consultar los reportes activos públicos.
2. El mapa y la lista muestran el mismo conjunto de resultados.
3. Ningún marcador expone la ubicación exacta privada del reporte.
4. Cada resultado ofrece una alternativa textual y un enlace al detalle.
5. La interfaz funciona sin depender exclusivamente del color o del mapa.
6. Los estados de carga, vacío y error ofrecen una acción o explicación útil.
7. La entrega pasa lint, typecheck, build y tests disponibles antes de la
   validación manual.

### Siguiente bloque: selector de ubicación

Después de validar el mapa público, el formulario de aviso y el formulario de
avistamiento deberán compartir un selector de ubicación con tres caminos:

- ubicación actual, con permiso explícito del navegador;
- búsqueda de dirección o lugar con autocompletado;
- selección manual mediante un pin desplazable en el mapa.

El texto escrito libremente no se considerará una ubicación geográfica válida
para el mapa. La selección confirmada generará una coordenada privada y una
proyección pública degradada según la precisión elegida. La dirección exacta no
se mostrará públicamente.

Este bloque deberá conservar la alternativa textual, permitir corregir la
descripción del lugar y mantener estados de permiso denegado, resultado no
encontrado, ubicación aproximada y error del proveedor.

## Auditoría transversal inmediata

Tras cerrar perfil, avatar, i18n y ubicación, el siguiente bloque es una auditoría por flujos del MVP: permisos/RLS, privacidad de ubicaciones y fotografías, accesibilidad WCAG 2.2 AA, responsive, errores visibles, SEO/Open Graph y validación manual en español y catalán.

## Comunicación

- `PLANNED` — chat contextual propietario ↔ colaborador.
- `PLANNED` — solicitud de información adicional.
- `PLANNED` — solicitud de fotografías adicionales.
- `PLANNED` — bloqueo/reporte y moderación.

## Comunidad

- `VISION` — seguir avisos.
- `VISION` — grupos temporales de búsqueda.
- `VISION` — sectores y tareas.
- `VISION` — mapa colaborativo.
- `VISION` — puntos revisados.
- `VISION` — coordinación de voluntarios.

## Entidades verificadas

- `VISION` — protectoras/refugios.
- `VISION` — clínicas veterinarias.
- `VISION` — policía local.
- `VISION` — ayuntamientos.
- `VISION` — ámbito territorial y permisos.
- `VISION` — estado “en seguimiento por entidad verificada”.
- `VISION` — bandeja profesional.

## Inteligencia

- `VISION` — coincidencias perdido/encontrado.
- `VISION` — comparación asistida de fotografías.
- `VISION` — priorización de avistamientos.
- `VISION` — patrones de movimiento.
- `VISION` — sugerencias de zonas de búsqueda.

## Auditoría antes de beta pública

Debe completarse una auditoría específica de:

- ES/CA;
- UX y responsive;
- accesibilidad;
- fotografías públicas;
- navegación;
- errores y feedback;
- RLS y permisos;
- privacidad;
- retención de datos;
- rendimiento;
- SEO/Open Graph;
- `ThemeScript`;
- logs y datos sensibles;
- rate limiting y anti-spam.

## Próximo orden operativo

1. validar y cerrar FP-019 y sus subflujos;
2. avisos cercanos + mapa/autocompletado;
3. auditoría MVP;
4. beta controlada;
5. FP-020 push web y alertas por proximidad, según evidencia del piloto.
