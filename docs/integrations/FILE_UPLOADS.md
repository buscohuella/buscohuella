---
id: FILE-UPLOADS
title: Subida segura de archivos
version: 1.0.0
status: Proposed
owner: Engineering & Security
last_reviewed: 2026-08-02
depends_on:
  - STORAGE_PET_PHOTOS
used_by:
  - WEB
  - MOBILE
  - API
  - TESTING
---

# 📤 Subida Segura de Archivos

## 1. Propósito

Establecer reglas comunes para subir archivos a BuscoHuella.

FP-004 aplica estas reglas a fotografías de mascotas.

---

## 2. Validación por capas

### Cliente

- Número máximo de archivos.
- Tamaño declarado.
- Extensión.
- Vista previa.
- Dimensiones mínimas cuando proceda.

### Servidor o Storage

- Usuario autenticado.
- Propiedad de la mascota.
- Ruta permitida.
- MIME permitido.
- Tamaño máximo del bucket.
- Política RLS.

La validación del cliente mejora la experiencia, pero nunca es una frontera de seguridad.

---

## 3. Formatos admitidos

```text
image/jpeg
image/png
image/webp
```

Extensiones normalizadas:

```text
.jpg
.png
.webp
```

No se aceptan en FP-004:

- SVG.
- GIF animado.
- HEIC sin conversión.
- PDF.
- Vídeo.
- Archivos ejecutables.

---

## 4. Nombre y ruta

La aplicación genera:

```text
photo_id = UUID
storage_path = owner_id/pet_id/photo_id.extension
```

El nombre original:

- No se utiliza como ruta.
- Puede descartarse después de validar.
- No se muestra públicamente.
- No debe incluirse en analítica.

---

## 5. Procesamiento recomendado

Antes o durante la subida:

- Corregir orientación.
- Eliminar EXIF.
- Limitar dimensiones.
- Comprimir de forma razonable.
- Convertir formatos no admitidos.
- Mantener calidad suficiente para reconocer al animal.

El procesamiento no debe bloquear el MVP si aumenta demasiado la complejidad. Como mínimo se aplicarán límites y formatos seguros.

---

## 6. Integridad

La fila `pet_photos` debe registrar:

- Ruta.
- MIME.
- Tamaño.
- Dimensiones.
- Posición.
- Visibilidad.
- Indicador de principal.

No se considera completada una subida hasta que objeto y metadatos estén sincronizados.

---

## 7. Errores

Códigos sugeridos:

```text
PET_PHOTO_UNSUPPORTED_TYPE
PET_PHOTO_TOO_LARGE
PET_PHOTO_LIMIT_REACHED
PET_PHOTO_UPLOAD_FAILED
PET_PHOTO_METADATA_FAILED
PET_PHOTO_NOT_FOUND
PET_PHOTO_FORBIDDEN
PET_PHOTO_PRIMARY_CONFLICT
```

Los mensajes visibles deben ser traducibles y no revelar información privada.

---

## 8. Reintentos

- No repetir automáticamente subidas grandes indefinidamente.
- Utilizar identificadores idempotentes.
- Detectar si el objeto ya existe.
- Limpiar objetos parciales.
- Informar del progreso.

El MVP puede utilizar subidas estándar; TUS o subidas reanudables quedan para archivos grandes o necesidades futuras.

---

## 9. Límite de fotografías

Máximo inicial:

```text
10 fotografías por mascota
```

La restricción se aplicará en la lógica de servidor y se cubrirá con tests.

No se implementa mediante un `CHECK` simple porque depende del número de filas relacionadas.

---

## 10. Fotografía principal

- Solo una fotografía puede ser principal.
- La primera fotografía puede convertirse automáticamente en principal.
- Al eliminarla se seleccionará la siguiente por posición.
- La base de datos impide dos principales simultáneas.

---

## 11. Dependencias

### Utiliza

- `STORAGE.md`
- `PET_PRIVACY.md`
- `PET_BUSINESS_RULES.md`

### Es utilizado por

- Formularios web.
- Aplicación móvil.
- Servicios de subida.
- Tests de integración.
