---
id: GEOGRAPHIC_NOTIFICATIONS
title: Arquitectura de notificaciones geográficas
version: 0.1.0
status: Proposed
owner: Product, Maps, Notifications, Security & Operations
last_reviewed: 2026-08-05
depends_on:
  - LOCATION_MODEL
  - GEOSPATIAL_GRID_STRATEGY
  - JURISDICTION_AND_ROUTING
  - FD-004
---

# Arquitectura de notificaciones geográficas

## 1. Propósito

Enviar alertas relevantes a personas y organizaciones cercanas sin depender
exclusivamente de fronteras administrativas ni revelar ubicaciones sensibles.

## 2. Señales de selección

```text
distancia
+ celdas
+ territorios
+ zonas operativas
+ preferencias
+ especie
+ tipo de evento
+ urgencia
+ horario
+ confianza
→ audiencia candidata
```

## 3. Expansión progresiva

Un caso puede ampliar su alcance por fases:

1. entorno inmediato;
2. celdas vecinas;
3. radio local;
4. municipios colindantes;
5. comarca o área operativa;
6. expansión manual o automática autorizada.

No todos los casos necesitan la misma expansión.

## 4. Fronteras

Una alerta a 100 metros de un límite municipal debe alcanzar usuarios cercanos
de ambos lados.

Las fronteras sirven como contexto y routing, no como muro de proximidad.

## 5. Audiencias

- ciudadanos con preferencias compatibles;
- responsable del animal;
- colaboradores;
- organizaciones verificadas;
- protectoras;
- veterinarios;
- autoridades;
- moderadores;
- usuarios que siguen un caso.

## 6. Privacidad

La notificación no incluirá por defecto:

- dirección exacta;
- coordenada exacta;
- microchip;
- contacto privado;
- celda privada;
- información que facilite robo o acoso.

El enlace abrirá una vista autorizada según el rol.

## 7. Frecuencia y fatiga

- deduplicación;
- agrupación;
- límites por periodo;
- silencios configurables;
- prioridades;
- resumen frente a alerta inmediata;
- cancelación al resolver;
- no reenviar el mismo evento sin cambio significativo.

## 8. Canales

- in-app;
- correo;
- web push;
- push móvil;
- SMS solo en escenarios futuros justificados;
- integraciones profesionales futuras.

## 9. Accesibilidad

- texto claro;
- prioridad expresada con palabras;
- no depender de sonido;
- no depender de color;
- enlace con nombre comprensible;
- idioma preferido;
- alternativa a mapas;
- horarios y distancias localizados.

## 10. Auditoría

Se conservará:

- evento origen;
- regla aplicada;
- audiencia calculada;
- canal;
- envío;
- entrega cuando esté disponible;
- error;
- reintento;
- apertura cuando sea legítimo y proporcionado;
- cancelación.

## 11. Seguridad y abuso

- rate limiting;
- reputación;
- bloqueo;
- moderación;
- detección de campañas masivas;
- protección frente a enumeración de usuarios;
- revisión de alertas institucionales.

## 12. MVP

En el MVP se implementará solo lo necesario para:

- eventos críticos;
- preferencias básicas;
- proximidad local;
- deduplicación;
- privacidad;
- correo o push cuando proceda.

La expansión avanzada y routing multiorganización serán posteriores.