# FP-011 — Implementation Log

## Objetivo

Implementar el flujo MVP para comunicar la pérdida de una mascota reutilizando el dominio y la capa de datos creados en FP-010.

## Principios transversales

Cada entrega debe revisar conjuntamente:

- i18n ES/CA;
- accesibilidad y navegación por teclado;
- UX móvil y reducción de carga cognitiva;
- seguridad y privacidad;
- validación en cliente y servidor;
- logging sanitizado;
- errores visibles y recuperables;
- temas claro y oscuro;
- responsive;
- typecheck, lint, tests y build.

## Decisión de UX: flujo de urgencia ligero

El flujo prioriza velocidad y claridad para una persona que puede estar bajo estrés.

Secuencia prevista:

1. Elegir el tipo de aviso.
2. Seleccionar una mascota activa.
3. Indicar cuándo ocurrió mediante opciones rápidas.
4. Indicar la ubicación del incidente:
   - GPS actual;
   - búsqueda manual;
   - selección o ajuste en mapa.
5. Añadir una descripción breve.
6. Revisar, guardar borrador y publicar.

Reglas:

- no volver a pedir datos ya registrados de la mascota;
- usar valores seguros por defecto;
- mantener opciones avanzadas detrás de divulgación progresiva;
- no crear un borrador vacío solo por entrar en el flujo;
- separar ubicación exacta privada y ubicación pública aproximada;
- permitir completar información adicional después de publicar.

## Entrega 1 — Mis avisos y selector de tipo

Estado: completada.

Incluye:

- listado real mediante `ReportRepository.listOwnReports()`;
- filtros por estado;
- estados vacío y error;
- catálogo ES/CA;
- ruta `/mis-reportes/nuevo`;
- elección visual entre pérdida y hallazgo.

## Entrega 2 — Selección de mascota perdida

Estado: en implementación.

Incluye:

- activación del flujo `LOST_PET`;
- ruta `/mis-reportes/nuevo/perdida`;
- carga real de mascotas del usuario;
- exclusión de fichas archivadas o fallecidas;
- selección con un toque;
- reutilización futura de nombre, raza, rasgos y fotografías;
- estados vacío y error;
- ES/CA;
- semántica de radiogrupo y foco visible.

No incluye todavía:

- creación del borrador;
- fecha y hora;
- GPS, búsqueda o mapa;
- descripción;
- publicación.

## Decisión de navegación y centro de creación

- El módulo se denomina **Avisos**.
- La acción global se denomina **Crear aviso**.
- El botón central móvil representa **acciones rápidas**, no un enlace exclusivo a mascota perdida.
- En web móvil abre un `Sheet` inferior accesible.
- La app nativa podrá conservar un menú radial equivalente.
- Categorías previstas: mascota perdida, animal encontrado, avistamiento, incidencia o peligro y SOS.
- Durante FP-011 solo mascota perdida queda habilitada.
- Cuando `Mis avisos` está vacío, se oculta el CTA superior y se mantiene el CTA principal del estado vacío.
- Cuando existen avisos, vuelve a mostrarse el CTA superior.
- La navegación `Inicio` conserva la ruta canónica `/inicio`.
## Entrega 3 — Momento del incidente

Estado: en implementación.

Incluye:

- opciones rápidas: ahora, hace menos de una hora, hoy y ayer;
- fecha y hora personalizada;
- bloqueo de fechas futuras;
- conservación de la mascota y del momento en la URL;
- semántica de radiogrupo;
- feedback accesible y foco visible;
- ES/CA;
- ruta preparada para el paso de ubicación.

Decisión de datos:

- las respuestas aproximadas se conservan como `NOW`, `RECENT`, `TODAY` o `YESTERDAY`;
- no se inventa una hora exacta para una respuesta aproximada;
- únicamente `CUSTOM` transporta un instante ISO exacto;
- el borrador todavía no se crea hasta disponer también de ubicación.
## Entrega 4 — Ubicación del incidente

Estado: en implementación.

Incluye:

- solicitud de GPS únicamente tras una acción explícita;
- manejo de permiso denegado, timeout, posición no disponible y navegador incompatible;
- alternativa manual siempre disponible;
- confirmación y cambio de ubicación;
- aproximación pública de coordenadas GPS a tres decimales;
- almacenamiento temporal de coordenadas exactas en `sessionStorage`;
- exclusión de coordenadas exactas de URL, historial y logs;
- ES/CA;
- navegación con teclado y estados anunciados.

Decisión de privacidad:

- la coordenada GPS exacta es privada;
- la posición pública se aproxima antes de mostrarse;
- la ubicación no se persiste todavía en Supabase;
- el borrador se creará cuando estén disponibles los datos mínimos y se ejecute validación de servidor;
- la geocodificación y el ajuste mediante Mapbox se conectarán sobre esta capa sin cambiar el contrato del flujo.
## Entrega 5 — Descripción y datos esenciales

Estado: en implementación.

Incluye:

- descripción breve obligatoria de 10 a 800 caracteres;
- contador y validación accesible;
- detalles rápidos opcionales: collar o arnés, medicación, miedo y sociabilidad;
- preferencia para reutilizar fotografías de la ficha;
- almacenamiento temporal en `sessionStorage`;
- ES/CA;
- ruta preparada para revisión final.

Decisión de dominio:

- los detalles rápidos no crean columnas nuevas en `reports`;
- se utilizarán para componer una descripción pública coherente durante la revisión;
- la preferencia de fotografías se resolverá mediante `report_photos`;
- el borrador no se crea hasta que la revisión reúna mascota, momento, ubicación y descripción;
- la validación final se realizará también en servidor con `createReportSchema`.
## Entrega 6 — Revisión y creación del borrador

Estado: en implementación.

Incluye:

- revisión conjunta de mascota, momento, ubicación, descripción, detalles y fotografías;
- creación real de `reports` con estado `DRAFT`;
- validación de cliente y `createReportSchema` en servidor;
- verificación de sesión y propiedad de la mascota;
- logging sanitizado;
- limpieza de `sessionStorage` solo después de crear correctamente;
- redirección a `Mis avisos`;
- ES/CA.

Decisiones de integridad:

- `NOW` se persiste con el instante de creación;
- `CUSTOM` conserva el instante ISO seleccionado;
- `RECENT`, `TODAY` y `YESTERDAY` no generan una hora ficticia y dejan `incident_at` pendiente;
- GPS persiste ubicación exacta privada y ubicación pública aproximada;
- una referencia manual se guarda provisionalmente como nombre de zona sin inventar coordenadas;
- el borrador permanece privado hasta una publicación explícita;
- la preferencia de reutilizar fotos queda pendiente de copiar metadatos en la entrega de fotografías.
## FP-012 — Fotografías del aviso

Estado: infraestructura y gestión inicial.

Incluye:

- bucket privado `report-photos`;
- rutas de almacenamiento `ownerId/reportId/photoId.webp`;
- políticas de Storage ligadas al propietario y a borradores;
- procesamiento seguro y conversión a WEBP;
- URLs firmadas de corta duración;
- subida individual y zona drag-and-drop;
- fotografía principal atómica;
- orden accesible mediante controles;
- eliminación de archivo y metadatos;
- máximo definido por `REPORT_LIMITS`;
- ES/CA.

Pendiente de una iteración posterior:

- arrastre visual para reordenar;
- copia opcional de fotografías de la ficha de mascota;
- edición del texto alternativo;
- publicación del aviso;
- auditoría global de traducciones.