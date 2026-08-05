---
id: PLACES_AND_ADDRESSES
title: Lugares, vías y direcciones
version: 0.1.0
status: Proposed
owner: Maps, Product & Privacy
last_reviewed: 2026-08-05
---

# Lugares, vías y direcciones

## Separación

```text
Territory
→ área con límites

Address
→ referencia postal o vial

Place
→ punto, instalación o espacio conocido
```

## Lugares previstos

- calles y tramos;
- plazas;
- parques;
- pipicanes;
- estaciones;
- colegios;
- hospitales;
- clínicas veterinarias;
- refugios;
- protectoras;
- comercios;
- polígonos industriales;
- carreteras;
- áreas de servicio;
- playas;
- ríos;
- bosques;
- montañas;
- senderos;
- espacios naturales;
- puntos de interés.

## Relaciones con un reporte

- `INSIDE`;
- `NEAR`;
- `ON_BOUNDARY`;
- `ON_ROUTE`;
- `COVERED_BY`;
- `USER_CONFIRMED`.

## Direcciones

La dirección exacta es privada por defecto.

La descripción pública puede usar:

- calle sin número;
- tramo;
- cruce;
- parque;
- barrio;
- municipio;
- distancia aproximada.

## Proveedores y datos propios

No se copiará indiscriminadamente todo el catálogo de lugares a Supabase.

Se guardarán:

- referencias utilizadas;
- lugares operativamente importantes;
- correcciones;
- lugares propios;
- caché estable;
- fuente y licencia.