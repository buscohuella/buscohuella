# FP-018.2 — Consolidación de Avisos y navegación

## Objetivo

Reducir confusión en la navegación y corregir inconsistencias detectadas al
validar los flujos completos de avisos y avistamientos.

## Navegación

La navegación privada principal queda reducida a:

- Inicio;
- Mapa;
- Avisos;
- Mascotas;
- Perfil.

`/avisos` funciona como centro del dominio de búsqueda.

### Explorar avisos

Lo que ocurre alrededor del usuario o en una zona elegida.

Ruta canónica: `/avisos`.

La ruta histórica `/reportes` se conservará temporalmente como redirección
para no romper enlaces compartidos.

Evolución prevista:

- ubicación actual o zona manual;
- radio 1 / 5 / 10 / 25 / 50 km;
- filtros;
- mismo ámbito geográfico en feed y mapa.

### Mis avisos

Casos publicados por el usuario sobre sus mascotas.

Ruta canónica: `/mis-avisos`.

La ruta histórica `/mis-reportes` se conservará temporalmente como redirección.

### Avistamientos recibidos

Información enviada por terceros sobre los avisos del usuario.

Ruta: `/avistamientos`.

### Mis avistamientos

Información que el usuario ha enviado sobre mascotas de terceros.

Ruta: `/mis-avistamientos`.

## Fotografías públicas

Se corrige la lectura de fotografías de avisos activos mediante
`is_public_active_report()`.

No se hace público el bucket `report-photos`.

Las políticas de `report_photos` y `storage.objects` consultan una función
`SECURITY DEFINER` que únicamente devuelve `true` si el aviso:

- existe;
- está `ACTIVE`;
- tiene `published_at`.

## Casos resueltos

En listados y detalle privado, los casos terminales:

- `RESOLVED`;
- `CLOSED`;
- `ARCHIVED`;

dejan de mostrar de forma prominente la etiqueta de tipo `Mascota perdida`.

El tipo sigue almacenado para trazabilidad histórica.

## Historial privado

Se corrige:

- traducción de `SIGHTING_REVIEWED`;
- etiqueta específica según `ACCEPTED / REJECTED / FLAGGED`;
- deduplicación de eventos históricos idénticos por tipo, estado y timestamp;
- conservación de la compactación de cambios de fotografías.

## Próximo bloque

Una vez validado FP-018.2:

- cerrar FP-018.1;
- FP-019 — centro de notificaciones internas.
