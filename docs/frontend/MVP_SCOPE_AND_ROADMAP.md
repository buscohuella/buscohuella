# BuscoHuella — Alcance MVP y roadmap funcional

## Objetivo

El MVP debe demostrar que BuscoHuella puede reducir el tiempo entre la pérdida
de un animal, la difusión del aviso y la recepción de información útil de la
comunidad.

La prioridad no es incluir todas las funciones posibles, sino cerrar un ciclo
completo y fiable:

`publicar -> difundir -> recibir avistamientos -> revisar -> localizar`

## MVP obligatorio

### Identidad y mascotas

- registro e inicio de sesión;
- perfil básico;
- registro y gestión de mascotas;
- permisos y privacidad de datos.

### Avisos

- mascota perdida;
- borrador, revisión y publicación;
- fotografía principal y galería;
- edición posterior;
- pausar, reactivar, resolver/cerrar;
- ficha pública segura;
- compartir aviso.

### Avistamientos

El MVP incluye los dos lados de la colaboración.

#### Persona que informa

- creación autenticada desde el aviso público;
- momento del avistamiento;
- GPS o referencia manual;
- nivel de confianza;
- comentario;
- hasta cinco fotografías opcionales;
- confirmación de envío;
- sección `Mis avistamientos`;
- consulta posterior de su aportación;
- estado de revisión por parte del propietario;
- estado actual del aviso relacionado;
- acceso a sus propias fotografías.

#### Propietario del aviso

- bandeja global de avistamientos recibidos;
- contador de nuevos;
- detalle del avistamiento;
- ubicación exacta cuando esté autorizado;
- fotografías privadas;
- comentario y nivel de confianza;
- estados de revisión;
- filtros y paginación;
- archivado sin destrucción de evidencia.

### Estados de avistamiento

Los estados persistidos actualmente son:

- `PENDING` → Nuevo;
- `ACCEPTED` → Revisado / útil;
- `REJECTED` → Descartado;
- `FLAGGED` → Marcado para atención.

La interfaz puede presentar nombres más amigables, pero no debe mezclar
“descartar”, “archivar” y “eliminar”.

### Conservación y archivado

Un avistamiento revisado o descartado no se elimina automáticamente.

Motivos:

- trazabilidad de la búsqueda;
- fotografías y ubicación asociadas;
- reconstrucción posterior de movimientos;
- moderación;
- cumplimiento y auditoría.

El MVP debe permitir ocultar de la vista principal los avistamientos ya
gestionados mediante filtros y archivado. La eliminación definitiva se reserva
para procesos específicos de usuario, moderación, cumplimiento legal o
políticas de conservación.

### Notificaciones MVP

El MVP debe incluir al menos notificación interna para eventos críticos:

- nuevo avistamiento recibido;
- avistamiento revisado por el propietario;
- aviso relacionado resuelto/cerrado;
- cambios importantes en el estado del aviso.

Las notificaciones push se incorporarán después de estabilizar la bandeja
interna, pero la arquitectura debe permitirlas.

### Mapa y búsqueda

- avisos activos en mapa;
- filtros básicos;
- selección de ubicación;
- autocompletado de direcciones;
- ubicación aproximada pública;
- coordenada exacta privada;
- avistamientos relevantes sobre el mapa privado de búsqueda.

## Post-MVP cercano

### Chat asociado al avistamiento

El propietario y la persona que informa podrán iniciar una conversación
privada desde un avistamiento concreto.

Principios:

- no exponer teléfono o correo por defecto;
- conversación vinculada al aviso y al avistamiento;
- bloqueo y reporte de usuarios;
- conservación limitada y política de moderación;
- posibilidad de cerrar el chat cuando el aviso termine;
- posibilidad de solicitar información o fotografías adicionales.

### Alertas por proximidad

Los usuarios podrán activar alertas geográficas y recibir mensajes como:

> Se ha perdido un perro a 1,2 km de ti.

Configuración prevista:

- radio de interés;
- especies;
- categorías de aviso;
- horarios/silencio;
- frecuencia;
- push, bandeja interna y eventualmente correo.

El objetivo es ayudar sin generar fatiga de notificaciones.

### Notificaciones push

Casos prioritarios:

- mascota perdida cerca;
- nuevo avistamiento de tu mascota;
- tu avistamiento ha sido revisado;
- respuesta a una conversación;
- cambio relevante en un aviso seguido;
- mascota encontrada;
- alerta urgente validada.

## Fase comunidad

### Seguir avisos

Una persona podrá seguir un aviso sin ser su propietaria para recibir novedades
relevantes de la búsqueda.

### Grupos de búsqueda

Un aviso podrá crear un grupo temporal de coordinación.

Posibles funciones:

- participantes;
- chat o tablón del grupo;
- mapa compartido;
- sectores de búsqueda;
- puntos revisados;
- tareas y responsables;
- avistamientos recientes;
- punto de encuentro;
- cierre automático cuando finalice la búsqueda.

Debe evitarse publicar en abierto información sensible sobre el propietario o
la ubicación exacta de la mascota.

## Fase profesional e institucional

### Protectoras y veterinarios

Entidades verificadas podrán:

- recibir avisos relevantes de su zona;
- marcar animales recibidos o identificados;
- colaborar en búsquedas;
- aportar avistamientos verificados;
- gestionar una bandeja profesional;
- participar en grupos de búsqueda;
- indicar que un caso está siendo seguido por una entidad.

### Policía local y ayuntamientos

Las autoridades integradas podrán disponer de permisos específicos para:

- recibir alertas territoriales;
- consultar incidencias relevantes;
- coordinar casos de seguridad o bienestar animal;
- responder mediante cuentas institucionales verificadas;
- mostrar al ciudadano un estado general como “en seguimiento por entidad
  verificada” cuando corresponda.

No tendrán acceso automático a todos los datos personales. Cada dato deberá
estar justificado por función, ámbito territorial y base legal.

## Fase inteligencia y automatización

Cuando exista volumen suficiente de datos reales:

- coincidencias entre animales perdidos y encontrados;
- comparación asistida de fotografías;
- priorización de avistamientos;
- detección de patrones geográficos;
- sugerencias de áreas de búsqueda;
- alertas inteligentes por proximidad y tiempo.

Estas funciones serán ayuda a la decisión, no sustitutos de confirmación
humana.

## Regla de producto

Una funcionalidad pasa al MVP solo si mejora de forma clara una de estas
métricas:

- tiempo hasta publicación;
- alcance útil del aviso;
- número/calidad de avistamientos;
- tiempo hasta reencuentro;
- seguridad y confianza de usuarios;
- capacidad del colaborador para saber si su ayuda fue útil.

Lo demás permanece en roadmap hasta que el flujo principal sea estable.
