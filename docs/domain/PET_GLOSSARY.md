---
id: PET-GLOSSARY
title: Glosario del dominio Pet
version: 1.0.0
status: Proposed
owner: Product & Engineering
last_reviewed: 2026-08-02
depends_on:
  - PET_DOMAIN
used_by:
  - DATABASE_SCHEMA
  - API
  - WEB
  - MOBILE
---

# 📖 Glosario del dominio Pet

## Propósito

Este glosario define los términos oficiales utilizados en el dominio de mascotas de BuscoHuella.

Todos los documentos funcionales, técnicos y el código deben utilizar estas definiciones para evitar ambigüedades.

---

## Términos

### Pet
Entidad permanente que representa la identidad digital de una mascota.

### Owner
Responsable principal de una mascota.

### Authorized Caregiver
Usuario autorizado para colaborar con la gestión de una mascota sin convertirse en propietario.

### Report
Incidencia temporal asociada a una mascota.

### Lost Report
Reporte de desaparición iniciado por el responsable.

### Found Report
Reporte de una mascota encontrada cuyo responsable aún no ha sido identificado.

### Sighting
Avistamiento comunicado por un colaborador sin asumir la custodia del animal.

### Reunited
Resultado de un reporte de pérdida cuando la mascota vuelve con su responsable.

### Active Report
Reporte actualmente abierto y operativo.

### Archived Pet
Mascota retirada del uso habitual pero conservada por motivos históricos.

### Deceased Pet
Mascota cuyo fallecimiento ha sido registrado. Es un estado terminal.

### Public Projection
Vista pública limitada construida a partir de datos expresamente autorizados.

### Private Profile
Vista completa accesible únicamente por el responsable y usuarios autorizados.

### Visibility
Configuración que determina qué información puede exponerse.

Valores del MVP:

```text
PRIVATE
PUBLIC_WHEN_REPORTED
PUBLIC
```

### Microchip
Identificador físico de la mascota considerado dato sensible.

### Primary Photo
Fotografía principal utilizada en tarjetas y listados.

### Audit Event
Registro inmutable de una acción relevante del dominio.

### RLS
Políticas Row Level Security encargadas de proteger el acceso a los datos.

### Signed URL
URL temporal utilizada para acceder a recursos privados de Storage.

---

## Términos prohibidos

Evitar utilizar como sinónimos:

- "Mascota perdida" para referirse a la entidad `Pet`.
- "Found" como estado administrativo de `Pet`.
- "Perfil público" cuando realmente se habla de un reporte público.
- "Propietario" y "cuidador" como conceptos equivalentes.

---

## Convenciones

- Los nombres internos del dominio se escribirán en inglés.
- La documentación funcional podrá utilizar español.
- Los estados y enumeraciones se almacenarán en inglés.
- Los textos visibles al usuario serán traducibles mediante i18n.

---

## Criterios de aceptación

- Un mismo término tiene un único significado.
- No existen sinónimos ambiguos.
- El glosario es la referencia oficial para documentación y código.
