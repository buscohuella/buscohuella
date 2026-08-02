---
id: STORAGE-PET-PHOTOS
title: Storage de fotografías de mascotas
version: 1.0.0
status: Proposed
owner: Engineering & Security
last_reviewed: 2026-08-02
depends_on:
  - PET_PRIVACY
  - DATABASE_SCHEMA_PETS
used_by:
  - WEB
  - MOBILE
  - API
  - TESTING
---

# 🗂️ Storage de Fotografías de Mascotas

## 1. Objetivo

Definir el almacenamiento seguro de fotografías asociadas a mascotas.

Las imágenes se almacenan en Supabase Storage y sus metadatos funcionales se registran en `public.pet_photos`.

---

## 2. Bucket

```text
pet-photos
```

Configuración:

| Propiedad | Valor |
|---|---|
| Acceso | Privado |
| Tamaño máximo | 8 MiB |
| MIME permitidos | JPEG, PNG y WebP |
| Descarga | Sesión autorizada o URL firmada |
| Listado público | No permitido |

Los buckets privados aplican RLS también a las descargas. Las imágenes compartidas temporalmente se servirán mediante URLs firmadas con caducidad corta.

---

## 3. Estructura de rutas

```text
{owner_id}/{pet_id}/{photo_id}.{extension}
```

Ejemplo:

```text
2d82.../6b57.../98c1....webp
```

Reglas:

- El primer segmento debe coincidir con `auth.uid()`.
- El segundo segmento debe identificar una mascota propiedad del usuario.
- El nombre final debe ser generado por la aplicación.
- No se utilizará el nombre original del archivo.
- La ruta almacenada en `pet_photos.storage_path` es relativa al bucket.

---

## 4. Modelo de acceso

### Propietario

Puede:

- Subir fotografías de sus mascotas.
- Leerlas.
- Reemplazarlas cuando el flujo lo permita.
- Eliminarlas.

### Usuario ajeno

No puede:

- Listar rutas.
- Descargar imágenes privadas.
- Subir dentro de carpetas ajenas.
- Modificar o eliminar objetos ajenos.

### Público

No tiene acceso directo al bucket.

Las futuras imágenes de reportes públicos se entregarán mediante una proyección controlada o URL firmada.

---

## 5. Políticas RLS

Las políticas sobre `storage.objects` comprobarán:

```text
bucket_id = pet-photos
folder[0] = auth.uid()
folder[1] = pet.id
pet.owner_id = auth.uid()
```

Se crearán políticas para:

- `SELECT`
- `INSERT`
- `UPDATE`
- `DELETE`

La política `SELECT` es necesaria también durante determinadas respuestas de subida del API de Storage.

---

## 6. URLs firmadas

Las URLs firmadas:

- Se generan únicamente después de comprobar autorización.
- Tienen una duración limitada.
- No se guardan en base de datos.
- No se registran en logs.
- No sustituyen las políticas RLS.
- No pueden revocarse individualmente antes de expirar.

Duración inicial recomendada:

```text
300 segundos
```

Para vistas prolongadas, la aplicación solicitará una nueva URL.

---

## 7. Sincronización entre Storage y base de datos

Flujo recomendado de alta:

```text
1. Validar archivo en cliente y servidor
2. Crear identificador photo_id
3. Construir storage_path
4. Subir objeto
5. Insertar fila pet_photos
6. Si falla el paso 5, eliminar el objeto subido
```

Flujo recomendado de eliminación:

```text
1. Verificar propiedad
2. Eliminar objeto de Storage
3. Eliminar fila pet_photos
4. Reasignar fotografía principal si procede
```

Las operaciones deberán manejar archivos huérfanos.

---

## 8. Límites iniciales

| Límite | Valor |
|---|---:|
| Fotografías por mascota | 10 |
| Tamaño máximo por archivo | 8 MiB |
| Longitud máxima de ruta | 500 caracteres |
| URL firmada | 5 minutos |
| Tipos MIME | JPEG, PNG, WebP |

Estos límites podrán modificarse sin cambiar el dominio.

---

## 9. Seguridad

- Nunca se utiliza una clave `service_role` en el cliente.
- El cliente no decide la propiedad mediante campos editables.
- Las rutas deben generarse con UUID.
- Se validará el MIME real además de la extensión.
- Se eliminarán metadatos EXIF cuando sea viable.
- No se registrarán URLs firmadas.
- No se utilizarán buckets públicos para fotografías privadas.
- Los errores no revelarán la existencia de mascotas ajenas.

---

## 10. Evolución futura

Podrán añadirse buckets separados para:

```text
report-photos
organization-documents
moderation-evidence
```

No deben mezclarse documentos sensibles y fotografías públicas dentro del mismo modelo de acceso.

---

## 11. Casos de prueba mínimos

- Un propietario puede subir a su mascota.
- No puede subir a una mascota ajena.
- No puede utilizar una carpeta de otro usuario.
- Puede leer una fotografía propia.
- No puede listar ni leer fotografías ajenas.
- Puede eliminar una fotografía propia.
- Se rechaza un MIME no permitido.
- Se rechaza un archivo superior a 8 MiB.
- Una URL firmada caduca.
- Una ruta sin mascota válida se rechaza.

---

## 12. Dependencias

### Utiliza

- `PET_PRIVACY.md`
- `DATABASE_SCHEMA.md`
- `FILE_UPLOADS.md`

### Es utilizado por

- Web.
- Aplicación móvil.
- API.
- Tests.
- Reportes futuros.
