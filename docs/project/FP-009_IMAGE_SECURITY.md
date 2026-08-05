# FP-009 — Procesamiento seguro de fotografías

## Estado

Entrega preparada para validación.

## Objetivo

Normalizar todas las fotografías antes de guardarlas para reducir riesgos,
proteger la privacidad y mejorar rendimiento.

## Reglas implementadas

- máximo de entrada: 8 MB;
- formatos de entrada: JPEG, PNG y WebP;
- firma binaria validada antes de procesar;
- mínimo: 300 × 300 píxeles;
- máximo: 10.000 píxeles por lado;
- máximo: 25 megapíxeles;
- imágenes animadas rechazadas;
- orientación EXIF aplicada automáticamente;
- metadatos EXIF y GPS eliminados al generar la salida;
- dimensión máxima almacenada: 2.048 píxeles por lado;
- formato almacenado: WebP;
- calidad adaptativa: 82, 76, 70 o 64;
- tamaño máximo almacenado: 2 MB;
- no se amplían imágenes pequeñas;
- compensación automática si Storage tiene éxito y falla la base de datos.

## Pruebas automatizadas añadidas

- si falla la creación de metadatos, se elimina el objeto de Storage;
- si falla Storage, no se insertan metadatos ni se intenta compensar.

## Pendiente de validación

- instalación de `sharp`;
- typecheck, lint, tests y build;
- fotografía con orientación EXIF;
- fotografía corrupta;
- imagen inferior a 300 × 300;
- imagen superior a 25 megapíxeles;
- comprobación de conversión a WebP;
- comprobación de eliminación de metadatos GPS;
- prueba manual de calidad visual.

## Decisión sobre detección animal

No se bloquea la subida mediante IA en el MVP. La detección automática puede
generar falsos negativos con animales pequeños, oscuros, parcialmente ocultos
o especies menos comunes.

Queda prevista como advertencia asistida o moderación posterior, no como
requisito para guardar una fotografía.
