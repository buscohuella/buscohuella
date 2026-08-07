# BuscoHuella — Reputación, puntos, verificación y recompensas

## Objetivo

BuscoHuella debe poder evolucionar desde una plataforma funcional de búsqueda
hacia una comunidad donde las contribuciones útiles generen confianza,
reconocimiento e incentivos.

Esta capa NO forma parte del núcleo obligatorio del MVP, pero el MVP debe
registrar desde ahora hechos verificables que permitan construirla después sin
rehacer el modelo.

## Principio fundamental

No mezclar en una sola cifra conceptos distintos.

BuscoHuella tratará por separado:

1. **Reputación**
   - mide confianza y credibilidad;
   - debe basarse en historial verificable;
   - no debería poder comprarse.

2. **Puntos**
   - mecanismo de gamificación;
   - se obtienen por acciones elegibles;
   - pueden subir o bajar según reglas versionadas.

3. **Impacto**
   - refleja contribuciones reales;
   - por ejemplo avistamientos revisados, fotografías útiles o búsquedas
     resueltas en las que participó el usuario.

4. **Verificación**
   - confirma identidad, rol o pertenencia a una entidad;
   - no equivale a reputación alta;
   - puede existir para ciudadanos, protectoras, veterinarios, policías,
     ayuntamientos u otras entidades autorizadas.

5. **Recompensas**
   - ventajas que pueden canjearse con puntos u otros criterios;
   - descuentos, promociones, beneficios de colaboradores u otros incentivos;
   - deben mantenerse desacopladas de la reputación.

## Fuentes de verdad

La reputación y los puntos no deben depender de contadores editables
manualmente.

Deben derivarse de eventos y hechos persistentes.

### Eventos del MVP que podrán alimentar el sistema

- `SIGHTING_CREATED`
- `SIGHTING_REVIEWED`
- publicación de un aviso;
- actualización/corrección de un aviso;
- fotografías aportadas;
- cierre o resolución de un caso;
- participación verificada en una búsqueda.

### Eventos futuros

- avistamiento marcado explícitamente como útil;
- coincidencia confirmada;
- animal localizado;
- colaboración en grupo de búsqueda;
- tarea/sector completado;
- verificación de entidad;
- moderación favorable/desfavorable;
- contribución validada por una entidad;
- respuesta útil en chat contextual.

## Eventos antes que puntos

Ejemplo conceptual:

`usuario envía avistamiento con foto`
→ se registra el evento real
→ el propietario lo revisa
→ posteriormente una regla de gamificación decide si corresponde recompensa.

No guardar únicamente:

`points = points + 10`

sin conservar el motivo.

## Ledger futuro de puntos

Cuando se implemente el sistema se recomienda un registro inmutable de
movimientos.

Ejemplo conceptual:

- usuario;
- regla/version;
- evento origen;
- puntos positivos o negativos;
- fecha;
- motivo;
- referencia a aviso/avistamiento;
- estado de reversión.

El saldo será consecuencia de los movimientos.

Esto permitirá:

- auditoría;
- reversión de fraude;
- cambios de reglas;
- estadísticas;
- evitar duplicados;
- explicar al usuario por qué recibió puntos.

## Reglas versionadas

Las reglas podrán cambiar con el tiempo.

Ejemplo ilustrativo, NO definitivo:

- colaboración enviada;
- fotografía añadida;
- colaboración revisada;
- colaboración considerada útil;
- participación en caso resuelto.

Los valores concretos se definirán cuando exista comportamiento real de
usuarios y métricas suficientes.

Una regla debe guardar su versión para que una modificación futura no cambie
retroactivamente el significado histórico de los movimientos.

## Reputación

La reputación debería considerar calidad, no solo cantidad.

Indicadores futuros posibles:

- antigüedad de la cuenta;
- porcentaje de aportaciones revisadas;
- aportaciones útiles;
- información descartada;
- fotografías válidas;
- participación en casos resueltos;
- verificación;
- reportes/moderación;
- actividad reciente.

No usar únicamente “número total de colaboraciones”.

## Prevención de abuso

La gamificación puede incentivar comportamientos indeseados si se diseña mal.

El sistema deberá contemplar:

- idempotencia de eventos;
- límites diarios;
- detección de spam;
- aportaciones duplicadas;
- fotos repetidas;
- cuentas coordinadas;
- auto-interacciones;
- creación artificial de avisos;
- reversión de puntos;
- revisión/moderación.

Una acción no debería generar recompensa ilimitada solo por repetirse.

## Perfiles públicos

El perfil público podrá mostrar de forma progresiva:

- alias;
- avatar;
- antigüedad;
- verificación;
- número de colaboraciones;
- insignias;
- nivel;
- impacto agregado;
- estadísticas públicas no sensibles.

Nunca debe exponer por defecto:

- correo;
- teléfono;
- domicilio;
- ubicación exacta;
- datos legales de verificación;
- historial privado de localizaciones.

## Propietario y colaborador

### Propietario

Podrá consultar el perfil público de quien realiza un avistamiento, si el
usuario dispone de perfil público habilitado.

Esto permitirá contextualizar:

- antigüedad;
- verificación;
- reputación;
- colaboraciones previas;
- insignias.

### Colaborador

Podrá consultar el perfil público asociado al aviso, sin recibir datos privados
del propietario.

## Entidades verificadas

La verificación institucional será diferente de la verificación ciudadana.

Tipos previstos:

- protectora/refugio;
- clínica veterinaria;
- policía local;
- ayuntamiento;
- profesional autorizado;
- otros colaboradores institucionales.

Una insignia institucional debe derivarse de un proceso de validación
específico y revocable.

## Niveles e insignias

Fase futura.

Ejemplos conceptuales:

- Nuevo colaborador;
- Colaborador activo;
- Explorador local;
- Colaborador verificado;
- Coordinador de búsqueda;
- Entidad verificada.

Las insignias no deben confundirse con autoridad oficial.

## Recompensas y canje

Los puntos podrán utilizarse en un catálogo futuro.

Posibles recompensas:

- descuentos en comercios asociados;
- clínicas veterinarias;
- tiendas de animales;
- servicios;
- promociones;
- productos BuscoHuella;
- ventajas comunitarias.

El catálogo debe ser independiente del motor de reputación.

## Partners

Un partner no debería poder modificar directamente la reputación.

El flujo previsto:

partner define/financia recompensa
→ BuscoHuella valida elegibilidad
→ usuario canjea
→ se crea movimiento de canje
→ queda trazabilidad.

## Privacidad y RGPD

Los datos públicos de reputación deben estar minimizados.

Debe definirse:

- qué métricas son públicas;
- qué métricas son privadas;
- periodo de retención;
- derecho de rectificación;
- impacto de eliminación de cuenta;
- anonimización histórica;
- tratamiento de datos de verificación.

## Arquitectura que el MVP ya prepara

El MVP actual deja bases útiles:

- usuarios autenticados;
- alias/perfiles;
- autores de avisos;
- autores de avistamientos;
- fotos vinculadas;
- estados de revisión;
- `report_events`;
- trazabilidad temporal;
- roles;
- RLS;
- separación público/privado.

Debe seguirse esta regla:

> Primero registrar hechos fiables. Después convertirlos en reputación,
> puntos o recompensas.

## Roadmap recomendado

### MVP

- hechos y eventos auditables;
- perfiles públicos básicos;
- estados y revisiones;
- privacidad/RLS.

### Post-MVP cercano

- métricas básicas de contribución;
- verificación ciudadana/entidades;
- insignias simples;
- reputación inicial.

### Comunidad

- motor de puntos;
- niveles;
- logros;
- ranking solo si aporta valor y no incentiva spam;
- desafíos comunitarios.

### Ecosistema

- catálogo de recompensas;
- partners;
- descuentos;
- canjes;
- promociones;
- beneficios territoriales.

## Métrica principal

El sistema de gamificación solo tiene sentido si mejora:

- calidad de las aportaciones;
- velocidad de respuesta;
- tasa de reencuentro;
- retención positiva;
- confianza comunitaria.

Nunca debe optimizarse simplemente para generar más actividad.
