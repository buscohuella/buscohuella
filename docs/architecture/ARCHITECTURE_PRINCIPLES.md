---
id: ARCHITECTURE_PRINCIPLES
title: Principios de arquitectura de BuscoHuella
version: 1.0.0
status: Accepted
owner: Product, Engineering & Security
last_reviewed: 2026-08-05
---

# Principios de arquitectura de BuscoHuella

Este documento actúa como constitución técnica del proyecto. Toda decisión,
Feature Pack, Foundation Pack, aplicación o integración debe respetarlo.

## 1. Producto multiplataforma

La lógica de negocio no pertenece a una pantalla concreta.

```text
dominio compartido
→ acceso a datos compartido
→ web / app móvil / intranets / procesos automáticos
```

Ninguna funcionalidad central debe obligar a duplicar reglas entre clientes.

## 2. Privacidad antes que precisión pública

La plataforma puede necesitar una ubicación exacta para operar, pero la
ubicación pública será siempre la mínima necesaria.

- ubicación exacta privada;
- ubicación pública separada;
- precisión configurable;
- ocultación para domicilios, animales vulnerables y zonas sensibles;
- ausencia de EXIF/GPS en imágenes públicas.

## 3. El mapa nunca será la única interfaz

Toda información y acción disponible mediante mapa tendrá una alternativa
textual y operable:

- listado;
- búsqueda;
- filtros;
- orden por distancia;
- fichas;
- descripciones de ubicación;
- acciones fuera de los marcadores.

## 4. Accesibilidad desde el diseño

WCAG 2.2 AA es el objetivo mínimo del producto.

Cada flujo debe contemplar:

- teclado;
- lector de pantalla;
- foco;
- zoom y reflow;
- contraste;
- reducción de movimiento;
- lenguaje claro;
- errores comprensibles;
- alternativas a color, sonido, gesto y mapa.

## 5. Todo texto visible debe poder traducirse

- los códigos internos no contienen traducciones;
- el texto visible no se usa como identificador;
- no se concatenan frases traducibles;
- fechas, horas, números y distancias usan `Intl`;
- el contenido generado por usuarios conserva su idioma original;
- español y catalán son prioritarios para el piloto;
- la arquitectura admite `es`, `ca`, `eu`, `gl`, `en` y futuros idiomas.

## 6. España primero, núcleo internacional

España será la primera configuración territorial y legal, pero el núcleo no
dependerá de nombres rígidos como comunidad autónoma, provincia o comarca.

Se modelarán niveles administrativos genéricos y etiquetas locales por país.

## 7. Territorio y proximidad son conceptos diferentes

Una frontera administrativa no detiene una búsqueda ni una notificación.

Las decisiones geográficas combinarán:

- polígonos territoriales;
- distancia;
- celdas geoespaciales;
- zonas operativas;
- territorios colindantes;
- lugares y vías;
- reglas configurables.

## 8. Las competencias no se codifican como verdades eternas

La asignación a autoridades, protectoras o profesionales dependerá de reglas
versionadas, fuentes, vigencia, tipo de caso y cobertura.

El sistema recomendará y enroutará; no inventará competencias legales ni
impedirá revisión humana.

## 9. Seguridad por defecto

- RLS en cada dominio;
- mínimo privilegio;
- funciones controladas para operaciones sensibles;
- auditoría;
- ausencia de secretos en clientes;
- validación en dominio y base de datos;
- trazabilidad de cambios relevantes.

## 10. Proveedor intercambiable

Mapas, geocodificación, correo, IA o notificaciones se encapsulan detrás de
contratos propios. El producto no debe quedar cautivo de un único proveedor.

## 11. Datos con procedencia y vigencia

Límites, lugares, coberturas y reglas deben conservar:

- fuente;
- versión;
- fecha de vigencia;
- fecha de revisión;
- confianza;
- responsable de validación.

## 12. Diseño evolutivo

La presentación puede cambiar sin romper el dominio.

El mismo caso podrá mostrarse como:

- tarjeta;
- lista;
- mapa;
- wizard;
- pantalla móvil urgente;
- intranet profesional;
- notificación;
- API.

## 13. Foundation Packs antes de deuda estructural

Los Foundation Packs definen capacidades transversales. Se activan antes de
que una deuda afecte muchas pantallas o dominios.

## 14. Decisiones importantes mediante ADR

Toda decisión costosa de revertir, transversal o dependiente de proveedor
debe registrarse en una ADR.

## 15. MVP útil, no arquitectura infinita

La preparación futura no justifica construir por adelantado todo el sistema.

Se documenta la dirección, se implementa el mínimo necesario para el siguiente
flujo y se amplía con evidencia real.