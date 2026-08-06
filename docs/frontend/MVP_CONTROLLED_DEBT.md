# MVP — Registro de deuda controlada

Este documento reúne mejoras detectadas durante la construcción del flujo
principal. No bloquean el avance salvo que afecten seguridad, pérdida de datos
o una funcionalidad crítica.

## Público y avisos

- [ ] Mostrar correctamente las fotografías principales en `/reportes` y
  `/reportes/[id]` para usuarios anónimos.
- [ ] Hacer clicable toda la tarjeta del área privada y revisar el patrón de
  navegación de las tarjetas públicas.
- [ ] Separar y normalizar de forma consistente descripción y “Detalles
  importantes”.
- [ ] Revisar textos de zona aproximada y formato oficial de lugares.
- [ ] Revisar confirmaciones y feedback después de acciones importantes.

## Ubicaciones

- [ ] Integrar autocompletado con Mapbox Search.
- [ ] Priorizar resultados por ubicación actual y municipio.
- [ ] Añadir “Usar mi ubicación” y “Marcar en el mapa”.
- [ ] Conservar coordenada exacta privada y publicar solo una versión
  aproximada.
- [ ] No inventar coordenadas cuando la entrada sea manual.
- [ ] Normalizar nombres oficiales de calles, plazas, municipios y barrios.

## Internacionalización

- [ ] Auditoría completa ES/CA pantalla por pantalla.
- [ ] Unificar terminología: aviso, reporte, avistamiento, zona aproximada.
- [ ] Revisar mayúsculas, plurales, fechas y textos truncados.
- [ ] Garantizar que los textos generados por el sistema se traduzcan sin
  alterar textos escritos por usuarios.
- [ ] Preparar ampliación posterior a EN, EU y GL sin duplicar lógica.

## Interfaz y accesibilidad

- [ ] Revisión responsive de móvil, tableta y escritorio.
- [ ] Auditoría WCAG de foco, teclado, etiquetas y contraste.
- [ ] Estados de carga, vacíos, error y confirmación coherentes.
- [ ] Skeletons y microinteracciones sin perjudicar rendimiento.
- [ ] Revisar modo oscuro en todas las pantallas.
- [ ] Revisar jerarquía de CTA y navegación entre área privada y contenido
  público.

## Técnica

- [ ] Corregir el warning de desarrollo de `ThemeScript` sin provocar flash de
  tema incorrecto.
- [ ] Mejorar captura y presentación de errores de Supabase.
- [ ] Revisar logs estructurados y evitar datos sensibles.
- [ ] Auditoría de SEO, Open Graph, rendimiento y accesibilidad.
- [ ] Revisar políticas RLS y permisos base para los flujos anónimos.
- [ ] Revisar eventos de auditoría para evitar duplicados y asegurar
  idempotencia.
- [ ] Revisar límites, rate limiting y protección anti-spam antes de beta
  pública.

## Avistamientos

- [ ] Fotografías opcionales del avistamiento.
- [ ] Bandeja del propietario con contador y estados de revisión.
- [ ] Confirmación/descartado de avistamientos.
- [ ] Mostrar ubicación aproximada y exacta según permisos.
- [ ] Notificación interna al propietario cuando recibe un nuevo avistamiento.
- [ ] Preparar el modelo para conversación privada asociada a un avistamiento.

## Criterio de cierre

La auditoría global se realizará cuando estén completos:

1. creación y gestión de avisos;
2. ficha pública;
3. avistamientos y panel del propietario;
4. mapa;
5. notificaciones y filtros esenciales.

Las funciones de comunidad avanzada, chat completo, autoridades y grupos de
búsqueda se gestionan en documentación de roadmap y no se consideran deuda del
MVP.
