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

## Ubicaciones

- [ ] Integrar autocompletado con Mapbox Search.
- [ ] Priorizar resultados por ubicación actual y municipio.
- [ ] Añadir “Usar mi ubicación” y “Marcar en el mapa”.
- [ ] Conservar coordenada exacta privada y publicar solo una versión
  aproximada.
- [ ] No inventar coordenadas cuando la entrada sea manual.

## Internacionalización

- [ ] Auditoría completa ES/CA pantalla por pantalla.
- [ ] Unificar terminología: aviso, reporte, avistamiento, zona aproximada.
- [ ] Revisar mayúsculas, plurales, fechas y textos truncados.
- [ ] Preparar ampliación posterior a EN, EU y GL sin duplicar lógica.

## Interfaz y accesibilidad

- [ ] Revisión responsive de móvil, tableta y escritorio.
- [ ] Auditoría WCAG de foco, teclado, etiquetas y contraste.
- [ ] Estados de carga, vacíos, error y confirmación coherentes.
- [ ] Skeletons y microinteracciones sin perjudicar rendimiento.
- [ ] Revisar modo oscuro en todas las pantallas.

## Técnica

- [ ] Corregir el warning de desarrollo de `ThemeScript` sin provocar flash de
  tema incorrecto.
- [ ] Mejorar captura y presentación de errores de Supabase.
- [ ] Revisar logs estructurados y evitar datos sensibles.
- [ ] Auditoría de SEO, Open Graph, rendimiento y accesibilidad.
- [ ] Revisar políticas RLS y permisos base para los flujos anónimos.

## Criterio de cierre

La auditoría global se realizará cuando estén completos:

1. creación y gestión de avisos;
2. ficha pública;
3. avistamientos y panel del propietario;
4. mapa;
5. notificaciones y filtros esenciales.
