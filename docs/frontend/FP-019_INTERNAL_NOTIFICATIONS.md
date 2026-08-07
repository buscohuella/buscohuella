# FP-019 — Centro de notificaciones internas

## Objetivo

Convertir eventos relevantes del dominio en avisos dirigidos a usuarios sin
acoplar la lógica de negocio a la interfaz o a un canal concreto.

## Modelo

`report_events` sigue siendo la fuente de verdad.

`notifications` representa una entrega a un destinatario concreto:

- destinatario;
- tipo;
- aviso;
- avistamiento;
- actor;
- evento origen;
- metadata;
- fecha de lectura;
- fecha de creación.

## Tipos MVP

### Para el propietario

- `NEW_SIGHTING`.

### Para el colaborador

- `SIGHTING_REVIEWED`;
- `REPORT_PAUSED`;
- `REPORT_REACTIVATED`;
- `REPORT_RESOLVED`;
- `REPORT_CLOSED`;
- `REPORT_ARCHIVED`.

## Idempotencia

La restricción:

`recipient_id + kind + source_event_id`

evita crear dos veces la misma entrega a partir del mismo evento.

## Privacidad

La tabla no se expone directamente a `authenticated`.

La lectura y mutaciones pasan por RPCs `SECURITY DEFINER` que limitan los datos
a `auth.uid()`.

El alias del actor solo se devuelve si el perfil está configurado como público.

## UI

Ruta:

`/notificaciones`

Incluye:

- Todas;
- No leídas;
- Leídas;
- paginación de 20;
- contador de no leídas;
- marcar todas como leídas;
- abrir una notificación marca esa entrega como leída;
- campana con badge en el topbar.

## Actualización del badge

FP-019 refresca el contador:

- al cambiar de ruta;
- al recuperar foco de la ventana;
- cada 30 segundos.

No utiliza todavía Supabase Realtime.

## Backfill

Se crean notificaciones a partir de eventos históricos existentes para
facilitar validación.

Los eventos históricos duplicados conocidos se normalizan antes de insertar.

## Fuera de FP-019

- Web Push;
- alertas por proximidad;
- preferencias de canal;
- modo silencio;
- digest;
- notificaciones institucionales;
- Realtime.

Estas funciones reutilizarán la misma tabla/eventos.

## Próximo paso

Tras validar FP-019:

- feedback/UX de notificaciones si es necesario;
- FP-020 o bloque geográfico según prioridad de producto.
