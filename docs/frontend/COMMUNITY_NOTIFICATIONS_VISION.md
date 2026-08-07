# BuscoHuella — Visión de comunidad, comunicación y alertas

## Principio

BuscoHuella no debe limitarse a publicar anuncios. La visión es crear una red
local de respuesta ante pérdidas, avistamientos e incidencias relacionadas con
animales.

La red debe ser útil sin convertirse en una fuente de spam ni exponer datos
personales innecesarios.

## Modelo de comunicación

### Aviso

Es la entidad central de la búsqueda.

### Avistamiento

Es una aportación concreta de una persona a un aviso.

El avistamiento no termina al enviarse: su autor debe poder volver a consultar
su aportación y conocer su evolución sin acceder a información privada del
propietario.

### Seguimiento del colaborador

La persona que envió un avistamiento podrá consultar:

- momento y ubicación enviados;
- comentario;
- fotografías propias;
- estado de revisión;
- estado actual del aviso;
- confirmación de que el propietario lo ha visto/revisado;
- cierre del caso cuando la mascota sea localizada.

Estados de experiencia previstos:

- Enviado;
- Pendiente de revisión;
- Revisado;
- Descartado;
- Marcado como útil;
- Caso resuelto.

Estos textos son de experiencia de usuario y pueden mapearse a estados técnicos
más compactos.

### Timeline de actividad

Cada aportación podrá presentar una línea temporal derivada de eventos:

- avistamiento enviado;
- recibido por el sistema;
- revisado por el propietario;
- marcado como útil o descartado;
- participación de entidad verificada;
- aviso pausado/reactivado;
- mascota localizada;
- caso cerrado.

El timeline debe construirse a partir de eventos persistentes e idempotentes,
no de textos guardados directamente en la interfaz.

### Conversación

En fases posteriores, un avistamiento podrá abrir una conversación privada
entre quien informa y la persona responsable del aviso.

La conversación debe conservar contexto:

- aviso;
- avistamiento;
- participantes;
- estado;
- fecha de cierre.

No se plantea un chat global sin contexto en el MVP.

## Modelo de notificaciones

Las notificaciones deben tener prioridad, ámbito y canal.

### Prioridad alta

- nuevo avistamiento de una mascota propia;
- alerta crítica validada;
- mensaje directo relacionado con una búsqueda activa;
- mascota localizada.

### Prioridad media

- tu avistamiento ha sido revisado;
- mascota perdida dentro del radio configurado;
- actualización importante de un aviso seguido;
- nueva información de un grupo de búsqueda.

### Prioridad baja

- actividad comunitaria no urgente;
- recordatorios;
- recomendaciones.

## Alertas geográficas

Un usuario podrá configurar un área de vigilancia.

Ejemplo:

> Avísame si se pierde un perro a menos de 2 km de mi ubicación habitual.

El sistema deberá contemplar:

- ubicación o zonas guardadas;
- radio;
- especies;
- categorías;
- ventanas horarias;
- frecuencia máxima;
- silenciamiento temporal;
- consentimiento explícito para push.

La ubicación personal utilizada para suscribirse a alertas no debe hacerse
pública.

## Bandejas y escalabilidad

Las bandejas no deben crecer indefinidamente en una sola vista.

Se prevé:

- filtros;
- paginación;
- prioridad de nuevos;
- archivado;
- separación entre búsquedas activas e históricas;
- contadores de no revisados;
- retención y anonimización futura.

Un avistamiento archivado sigue existiendo y conserva trazabilidad.

## Instituciones y entidades verificadas

### Tipos previstos

- protectoras;
- refugios;
- clínicas veterinarias;
- policía local;
- ayuntamientos;
- otros organismos autorizados.

### Principio de mínimo privilegio

Una cuenta institucional solo podrá acceder a la información necesaria para su
función y ámbito territorial.

Se prevé:

- verificación de entidad;
- roles y permisos;
- ámbito territorial;
- auditoría de accesos;
- revocación;
- trazabilidad de actuaciones;
- estado general visible para el ciudadano cuando una entidad participe.

## Grupos de búsqueda

Un grupo será temporal y estará vinculado a un aviso activo.

### Casos de uso

- coordinar voluntarios;
- dividir el territorio en sectores;
- compartir observaciones;
- evitar repetir zonas ya revisadas;
- organizar un punto de encuentro;
- señalar riesgos o zonas inaccesibles;
- integrar avistamientos en tiempo casi real.

### Roles previstos

- responsable del aviso;
- coordinador;
- participante;
- entidad verificada.

### Privacidad

Los participantes no recibirán por defecto:

- domicilio del propietario;
- teléfono privado;
- coordenadas privadas almacenadas;
- información médica o identificativa no necesaria.

## Arquitectura preparada desde ahora

Aunque estas funciones no se implementen todavía, las decisiones actuales
deben favorecerlas:

- `report_id` como contexto central;
- `sighting_id` como unidad de evidencia;
- `report_events` como trazabilidad;
- eventos de revisión separados de la mutación del contenido original;
- notificaciones desacopladas de la interfaz;
- roles y RLS;
- ubicación exacta separada de ubicación pública;
- eventos idempotentes para evitar notificaciones duplicadas;
- posibilidad de asociar actores institucionales sin exponer datos personales;
- conservación/archivo separado de eliminación definitiva.

## Orden recomendado

1. fotografías de avistamientos;
2. bandeja de avistamientos del propietario;
3. organización: filtros, paginación y archivado;
4. `Mis avistamientos` para el colaborador;
5. timeline de actividad;
6. notificación interna;
7. mapa y autocompletado;
8. filtros y alertas básicas;
9. push por proximidad;
10. chat contextual;
11. seguimiento de avisos;
12. grupos de búsqueda;
13. integraciones profesionales e institucionales.

Este orden mantiene el MVP manejable sin cerrar la puerta a la visión completa
de BuscoHuella.
