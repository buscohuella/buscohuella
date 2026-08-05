---
id: JURISDICTION_AND_ROUTING
title: Jurisdicción, cobertura y routing territorial
version: 0.1.0
status: Proposed
owner: Product, Legal, Operations & Engineering
last_reviewed: 2026-08-05
---

# Jurisdicción, cobertura y routing territorial

## Principio

BuscoHuella no codificará una única autoridad como responsable eterna de un
punto geográfico.

Las competencias pueden depender de:

- país;
- territorio;
- tipo de caso;
- especie;
- riesgo;
- horario;
- convenio;
- naturaleza urbana o rural;
- vigencia de la regla.

## Regla de routing

```text
tipo de incidente
+ territorio
+ ubicación
+ prioridad
+ horario
+ cobertura
+ vigencia
→ destinos candidatos ordenados
```

## Destinos

- ayuntamiento;
- policía local;
- cuerpo autonómico;
- servicio estatal;
- protectora;
- refugio;
- veterinario;
- servicio de emergencias;
- moderación interna;
- organización colaboradora.

## Resultado

El sistema puede:

- recomendar;
- notificar;
- crear una asignación;
- escalar;
- mostrar alternativas;
- solicitar revisión.

No debe afirmar responsabilidad legal sin una fuente válida.

## Trazabilidad

Cada asignación conservará:

- regla utilizada;
- versión;
- fecha;
- destinos candidatos;
- destino elegido;
- actor;
- reasignaciones;
- resultado.

## Límites y zonas ambiguas

En montaña, carreteras o fronteras municipales se tendrán en cuenta:

- territorio primario;
- territorios colindantes;
- distancia al límite;
- municipios cercanos;
- zonas naturales;
- coberturas operativas;
- celdas vecinas.