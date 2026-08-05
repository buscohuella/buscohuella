---
id: LOCATION_MODEL
title: Modelo unificado de ubicación
version: 1.0.0
status: Proposed
owner: Maps, Product, Engineering & Security
last_reviewed: 2026-08-05
depends_on:
  - ARCHITECTURE_PRINCIPLES
  - MAP_ARCHITECTURE
  - TERRITORIAL_MODEL
  - PLACES_AND_ADDRESSES
  - GEOSPATIAL_GRID_STRATEGY
  - REPORT_PRIVACY
---

# Modelo unificado de ubicación

## 1. Propósito

Una ubicación en BuscoHuella no es solamente una coordenada. Es un conjunto
de datos privados, públicos, territoriales, descriptivos y operativos que
permiten buscar, proteger, enrutar y notificar un caso.

## 2. Agregado conceptual

```text
Location
├── exact point
├── public point or public area
├── public precision
├── address reference
├── nearby places
├── territorial memberships
├── grid cells
├── operational coverages
├── routing candidates
├── risk and sensitivity
├── source and confidence
└── snapshot and timestamps
```

## 3. Identidad de ubicación

La ubicación no tendrá una única etiqueta humana como identidad. Las
coordenadas, direcciones y nombres pueden cambiar o ser ambiguos.

Se utilizarán:

- coordenadas canónicas WGS84;
- identificadores internos;
- referencias del proveedor;
- códigos oficiales cuando existan;
- snapshots para conservar el contexto histórico.

## 4. Componentes privados

Pueden incluir:

- coordenada exacta;
- dirección exacta;
- número o portal;
- celda de alta resolución;
- ruta de acceso;
- indicaciones privadas;
- fuente original;
- precisión medida;
- datos necesarios para autoridades autorizadas.

Estos datos no pasan automáticamente a vistas públicas.

## 5. Componentes públicos

Pueden incluir:

- punto desplazado;
- centroide de área;
- calle sin número;
- cruce;
- parque o lugar;
- barrio;
- municipio;
- radio aproximado;
- precisión declarada;
- texto de ubicación accesible.

La representación pública debe ser útil sin permitir reconstruir un domicilio
o una posición sensible.

## 6. Precisión y confianza

Se separan dos conceptos:

```text
accuracy
→ precisión técnica del dato capturado

public precision
→ precisión que decidimos mostrar
```

La confianza indica cuánto sabemos sobre el contexto:

- `VERIFIED`;
- `HIGH`;
- `MEDIUM`;
- `LOW`;
- `USER_PROVIDED`;
- `INFERRED`.

## 7. Fuentes

Una ubicación puede proceder de:

- GPS;
- selección manual de mapa;
- búsqueda de dirección;
- búsqueda de lugar;
- geocodificación inversa;
- importación profesional;
- dato oficial;
- corrección moderada.

Cada resultado debe poder conservar proveedor, versión, fecha y atribución.

## 8. Snapshot territorial

Un reporte conservará un snapshot mínimo del momento:

- país;
- niveles administrativos relevantes;
- municipio candidato;
- barrio/distrito cuando exista;
- lugar principal;
- texto legible;
- celda o celdas operativas;
- fuente;
- fecha de resolución.

El snapshot no sustituye las entidades territoriales canónicas.

## 9. Ubicaciones ambiguas

Si un punto cae cerca de un límite o la geocodificación no es concluyente:

- se conservarán candidatos;
- no se fingirá certeza;
- podrá pedirse confirmación;
- se incluirán territorios colindantes;
- el routing podrá considerar varios destinos.

## 10. Lugar, dirección y territorio

```text
Territory
→ área con límites y jerarquía

Address
→ referencia vial o postal

Place
→ entidad conocida o punto de interés

Location
→ agregado operativo que los relaciona
```

## 11. Casos naturales y rurales

Se contemplan:

- senderos;
- carreteras;
- bosques;
- montañas;
- ríos;
- playas;
- parques naturales;
- zonas sin dirección postal;
- áreas entre municipios.

En estos casos, el texto público prioriza referencias comprensibles y
coordenadas aproximadas, no una dirección inventada.

## 12. Contrato mínimo para reportes

Un reporte necesita como mínimo al publicarse:

- `exact_location`;
- `public_location` o área pública oculta;
- `public_precision`;
- descripción pública accesible;
- país;
- snapshot territorial básico;
- fuente y fecha;
- indicador de sensibilidad.

## 13. Evolución

El modelo admite posteriormente:

- recorridos y trayectorias;
- polígonos de búsqueda;
- corredores;
- zonas de riesgo;
- localizaciones múltiples;
- histórico de movimientos;
- cálculos predictivos;
- asignaciones profesionales.