---
id: PET-PRIVACY
title: Privacidad de mascotas
version: 1.0.0
status: Proposed
owner: Product, Security & Legal
last_reviewed: 2026-08-02
depends_on:
  - PET_DOMAIN
  - PET_BUSINESS_RULES
  - PET_LIFECYCLE
used_by:
  - DATABASE_SCHEMA
  - API
  - WEB
  - MOBILE
  - STORAGE
  - SECURITY
  - LEGAL
---

# 🔐 Privacidad de Mascotas

## 1. Propósito

Este documento define cómo debe protegerse y exponerse la información asociada a una mascota dentro de BuscoHuella.

La privacidad se diseña bajo cuatro principios:

- Privacidad por defecto.
- Exposición mínima.
- Acceso según necesidad.
- Trazabilidad de acciones sensibles.

La existencia de una mascota registrada no implica que su ficha completa sea pública.

---

## 2. Alcance

Este documento cubre:

- Datos de la entidad `Pet`.
- Fotografías de mascotas.
- Información identificativa.
- Datos del responsable.
- Vistas públicas.
- Acceso autenticado.
- Acceso administrativo.
- Storage.
- Logs y analítica.
- Conservación y eliminación.

No sustituye la política legal de privacidad ni el registro de actividades de tratamiento.

---

## 3. Principios

### PR-PET-001 — Privacidad por defecto

Toda mascota se crea con acceso restringido.

### PR-PET-002 — Exposición mínima

Solo se expone la información necesaria para una función legítima.

### PR-PET-003 — Separación de contextos

La vista privada del responsable y la vista pública no deben compartir automáticamente el mismo conjunto de campos.

### PR-PET-004 — Protección reforzada

Los identificadores sensibles nunca deben exponerse públicamente.

### PR-PET-005 — No inferencia

Las respuestas del sistema no deben permitir deducir información privada mediante enumeración, errores o diferencias de comportamiento.

### PR-PET-006 — Revocabilidad

El responsable debe poder reducir la visibilidad de la ficha cuando no exista una obligación que lo impida.

---

## 4. Niveles de acceso

```text
OWNER
AUTHORIZED
AUTHENTICATED
PUBLIC
INTERNAL
```

| Nivel | Descripción |
|---|---|
| `OWNER` | Responsable principal |
| `AUTHORIZED` | Cuidador o colaborador autorizado |
| `AUTHENTICATED` | Usuario con sesión sin relación directa |
| `PUBLIC` | Persona sin sesión |
| `INTERNAL` | Procesos y personal autorizado |

Para FP-004, la implementación mínima requiere:

```text
OWNER
PUBLIC
INTERNAL
```

---

## 5. Modos de visibilidad

```text
PRIVATE
PUBLIC_WHEN_REPORTED
PUBLIC
```

### `PRIVATE`

La ficha solo puede consultarse por su responsable y actores autorizados.

### `PUBLIC_WHEN_REPORTED`

La ficha permanece privada y publica una proyección limitada mientras exista un reporte público activo.

Valor recomendado por defecto:

```text
PUBLIC_WHEN_REPORTED
```

### `PUBLIC`

Mantiene una proyección pública estable.

Puede quedar fuera de la primera entrega del MVP.

---

## 6. Clasificación de datos

### 6.1 Datos públicos potenciales

Pueden formar parte de una proyección pública cuando exista base funcional:

- Nombre o alias.
- Especie.
- Raza.
- Sexo.
- Tamaño.
- Colores.
- Rasgos distintivos.
- Fotografía seleccionada.
- Edad aproximada.
- Descripción visual.

No todos estos campos deben publicarse siempre.

### 6.2 Datos privados del responsable

- Identificador del responsable.
- Nombre real.
- Correo electrónico.
- Teléfono.
- Dirección.
- Ubicación habitual.
- Preferencias de contacto.
- Relación jurídica con la mascota.

### 6.3 Datos sensibles o protegidos

- Número completo de microchip.
- Documentación acreditativa.
- Datos veterinarios.
- Historial clínico.
- Notas privadas.
- Pruebas de propiedad.
- Información antifraude.
- Datos de moderación.
- Historial de auditoría.

### 6.4 Datos internos

- Identificadores técnicos.
- Logs de seguridad.
- Motivos de moderación.
- Señales de riesgo.
- Metadatos operativos.
- Información de soporte.

---

## 7. Matriz de acceso por campo

| Campo | Owner | Authenticated | Public | Internal |
|---|---:|---:|---:|---:|
| `id` | Sí | Solo identificador público indirecto | No recomendado | Sí |
| `name` | Sí | Según visibilidad | Según visibilidad | Sí |
| `species` | Sí | Según visibilidad | Según visibilidad | Sí |
| `breed` | Sí | Según visibilidad | Según visibilidad | Sí |
| `sex` | Sí | Según visibilidad | Según visibilidad | Sí |
| `size` | Sí | Según visibilidad | Según visibilidad | Sí |
| `colors` | Sí | Según visibilidad | Según visibilidad | Sí |
| `distinctive_features` | Sí | Según visibilidad | Según visibilidad | Sí |
| `description` | Sí | Según visibilidad | Según visibilidad | Sí |
| `birth_date` | Sí | No exacta | No exacta | Sí |
| `weight_kg` | Sí | No por defecto | No | Sí |
| `owner_id` | Sí | No | No | Sí |
| `microchip_number` | Sí | No | No | Acceso restringido |
| `identification_notes` | Sí | No | No | Acceso restringido |
| `private_notes` | Sí | No | No | Acceso restringido |
| `status` | Sí | Derivado cuando proceda | Derivado cuando proceda | Sí |
| `visibility` | Sí | No | No | Sí |
| `created_at` | Sí | No por defecto | No | Sí |
| `updated_at` | Sí | No por defecto | No | Sí |

---

## 8. Proyección pública

La información pública debe exponerse mediante una proyección explícita.

No debe utilizarse:

```text
SELECT *
FROM pets
```

para construir fichas públicas.

Proyección conceptual:

```text
PublicPetProfile
- public_id
- name
- species
- breed
- sex
- size
- colors
- distinctive_features
- public_description
- primary_photo
- active_report_summary
```

La proyección pública no debe incluir:

- `owner_id`
- `microchip_number`
- `private_notes`
- datos de contacto directos
- timestamps internos innecesarios
- rutas privadas de Storage

---

## 9. Identificadores públicos

El identificador interno de base de datos no debería utilizarse necesariamente como identificador público permanente.

Opciones válidas:

- UUID interno no secuencial.
- Identificador público separado.
- Slug opaco.
- Identificador específico del reporte.

Requisito:

```text
Un identificador público no debe permitir enumerar registros privados.
```

Para el MVP, un UUID no secuencial puede ser suficiente siempre que RLS y las proyecciones públicas estén correctamente implementadas.

---

## 10. Microchip

### PR-PET-CHIP-001 — Nunca público

El número completo de microchip nunca debe aparecer en:

- Fichas públicas.
- Reportes públicos.
- HTML.
- URLs.
- Logs de navegador.
- Analítica.
- Notificaciones.
- Errores.
- Metadatos de imágenes.

### PR-PET-CHIP-002 — Acceso restringido

Solo puede consultarlo:

- El responsable.
- Personal autorizado con motivo legítimo.
- Procesos internos necesarios.

### PR-PET-CHIP-003 — Visualización parcial

Cuando sea útil, podrá mostrarse de forma enmascarada:

```text
***********1234
```

La visualización parcial no debe utilizarse como prueba suficiente de propiedad.

### PR-PET-CHIP-004 — Almacenamiento

El valor debe:

- Normalizarse.
- Evitar exposición en respuestas genéricas.
- Estar protegido por RLS.
- Excluirse de vistas públicas.
- Evaluarse para cifrado adicional a nivel de aplicación.

### PR-PET-CHIP-005 — Búsqueda

Las búsquedas internas por microchip deben evitar registrar el valor completo en logs.

---

## 11. Fotografías

### PR-PET-PHOTO-001 — Clasificación

Cada fotografía debe tener un contexto de visibilidad.

Valores conceptuales:

```text
PRIVATE
PUBLIC_PROFILE
PUBLIC_REPORT
```

### PR-PET-PHOTO-002 — Principal

La fotografía principal no es pública automáticamente.

Su visibilidad depende de la ficha o reporte que la utilice.

### PR-PET-PHOTO-003 — Storage

Las fotografías privadas deben almacenarse en buckets privados.

El acceso debe realizarse mediante:

- Políticas de Storage.
- URLs firmadas de duración limitada.
- Procesos autorizados.

### PR-PET-PHOTO-004 — Metadatos

Deben eliminarse metadatos sensibles cuando sea técnicamente viable:

- GPS.
- Modelo de dispositivo.
- Fecha original.
- Miniaturas embebidas.
- Información del software.

### PR-PET-PHOTO-005 — Contenido accidental

Las imágenes pueden contener:

- Personas.
- Menores.
- Domicilios.
- Matrículas.
- Documentos.
- Ubicaciones reconocibles.

La interfaz debe advertir al usuario y permitir sustituir imágenes inapropiadas.

### PR-PET-PHOTO-006 — Eliminación

La eliminación lógica de una referencia no debe dejar una imagen públicamente accesible sin necesidad.

---

## 12. Datos de contacto

Los datos personales del responsable no forman parte de la ficha pública de la mascota.

La comunicación pública debe utilizar mecanismos controlados, por ejemplo:

- Formulario intermediado.
- Contacto asociado a un reporte.
- Alias.
- Canal temporal.
- Datos explícitamente autorizados.

No debe exponerse automáticamente:

- Correo personal.
- Teléfono.
- Dirección.
- Identificador de usuario.
- Ubicación habitual.

---

## 13. Ubicación

La ficha permanente de una mascota no debe publicar su domicilio habitual ni coordenadas exactas.

La ubicación de una incidencia pertenece al reporte.

Cuando se publique una ubicación:

- Debe limitarse a la precisión necesaria.
- Puede redondearse.
- Puede desplazarse visualmente.
- Debe evitar revelar domicilios.
- Debe considerar riesgos de robo o fraude.

---

## 14. RLS esperada

### Lectura privada

```text
Actor:
Owner

Permission:
pet.read.private

Condition:
pet.owner_id == auth.uid()

Result:
ALLOW
```

### Edición

```text
Actor:
Owner

Permission:
pet.update

Condition:
pet.owner_id == auth.uid()

Result:
ALLOW
```

### Lectura ajena

```text
Actor:
AuthenticatedUser

Permission:
pet.read.private

Condition:
pet.owner_id != auth.uid()

Result:
DENY
```

### Lectura pública

La lectura pública no debe concederse directamente sobre la tabla privada `pets`.

Debe resolverse mediante:

- Vista segura.
- Función controlada.
- Proyección de reporte.
- API del servidor.

---

## 15. Storage esperado

Estructura conceptual:

```text
pets/{owner_id}/{pet_id}/{photo_id}
```

Requisitos:

- El propietario solo puede escribir dentro de sus rutas autorizadas.
- Un usuario no puede sobrescribir archivos ajenos.
- Las rutas no sustituyen la validación de propiedad.
- Las políticas deben verificar relación con la mascota.
- Las URLs firmadas deben caducar.
- Los buckets públicos solo deben utilizarse cuando la exposición sea intencional.

---

## 16. API y respuestas

### PR-PET-API-001 — DTO separados

Deben existir modelos de salida diferentes:

```text
PrivatePetDTO
PublicPetDTO
InternalPetDTO
```

### PR-PET-API-002 — Exclusión explícita

Los campos sensibles deben excluirse explícitamente de respuestas públicas.

### PR-PET-API-003 — Errores uniformes

Un acceso no autorizado no debe revelar si una mascota privada existe.

Respuesta recomendada:

```text
404 Not Found
```

o una respuesta uniforme equivalente, según arquitectura.

### PR-PET-API-004 — Caché

Las respuestas privadas deben impedir caché pública.

---

## 17. Logs y observabilidad

No deben registrarse:

- Microchip completo.
- Notas privadas.
- Datos veterinarios.
- URLs firmadas activas.
- Teléfonos.
- Correos personales.
- Direcciones exactas.
- Tokens.
- Contenido completo de formularios sensibles.

Los logs deben utilizar:

- Identificadores técnicos.
- Códigos de evento.
- Resultado.
- Actor interno cuando proceda.
- Datos mínimos para diagnóstico.

---

## 18. Analítica

La analítica de producto debe evitar datos personales innecesarios.

Eventos permitidos:

```text
pet_created
pet_updated
pet_archived
pet_photo_added
pet_visibility_changed
```

Propiedades recomendadas:

```text
species
has_photo
photo_count_bucket
profile_completeness_bucket
visibility
```

Propiedades prohibidas:

```text
pet_name
microchip_number
owner_email
owner_phone
private_notes
exact_address
```

---

## 19. Moderación y soporte

El acceso interno debe aplicar:

- Mínimo privilegio.
- Motivo legítimo.
- Registro de acceso.
- Separación de roles.
- Caducidad de permisos cuando proceda.

El personal de soporte no debe consultar datos sensibles si la incidencia puede resolverse sin ellos.

---

## 20. Conservación

La conservación depende del tipo de dato y de las obligaciones aplicables.

Principios:

- No conservar más tiempo del necesario.
- Mantener integridad histórica cuando existan reportes.
- Separar archivo de eliminación.
- Eliminar archivos huérfanos.
- Conservar auditoría de acciones sensibles durante el periodo definido.
- Documentar excepciones legales o de seguridad.

Los plazos concretos deben definirse en `DATA_RETENTION.md`.

---

## 21. Eliminación

### Eliminación solicitada

Cuando proceda una eliminación:

- Debe comprobarse si existen reportes activos.
- Deben tratarse fotografías.
- Deben eliminarse o anonimizarse datos personales.
- Debe preservarse la información mínima legalmente necesaria.
- Debe evitarse romper integridad estadística o de seguridad.

### Archivo

El archivo no elimina datos.

Reduce su uso y visibilidad manteniendo historial.

---

## 22. Amenazas principales

### Enumeración

Intento de descubrir mascotas privadas probando identificadores.

Mitigación:

- UUID no secuencial.
- RLS.
- Respuestas uniformes.
- Rate limiting.

### Exposición por caché

Datos privados almacenados en CDN o caché compartida.

Mitigación:

- Cabeceras adecuadas.
- Separación de rutas.
- Revisión de renderizado estático.

### Exposición de Storage

URLs públicas permanentes o políticas permisivas.

Mitigación:

- Buckets privados.
- URLs firmadas.
- Políticas por propietario y mascota.

### Fuga en logs

Datos sensibles incluidos en errores o trazas.

Mitigación:

- Redacción.
- Estructuras de logging.
- Revisión de payloads.

### Exposición por relaciones

Una consulta pública devuelve perfiles, responsables o relaciones internas.

Mitigación:

- DTO públicos.
- Vistas específicas.
- Selección explícita de columnas.

---

## 23. Casos de prueba mínimos

### TC-PET-PRIV-001

Un usuario puede consultar todos los datos de su mascota.

### TC-PET-PRIV-002

Un usuario ajeno no puede consultar una mascota privada.

### TC-PET-PRIV-003

Una persona sin sesión no puede enumerar mascotas privadas.

### TC-PET-PRIV-004

Una respuesta pública nunca contiene `owner_id`.

### TC-PET-PRIV-005

Una respuesta pública nunca contiene el microchip.

### TC-PET-PRIV-006

Una fotografía privada requiere acceso autorizado.

### TC-PET-PRIV-007

Una URL firmada caduca.

### TC-PET-PRIV-008

Los logs no contienen el microchip completo.

### TC-PET-PRIV-009

La vista pública muestra solo campos permitidos.

### TC-PET-PRIV-010

Reducir la visibilidad retira el acceso público correspondiente.

---

## 24. Decisiones para FP-004

Se recomienda aprobar:

- Visibilidad por defecto: `PUBLIC_WHEN_REPORTED`.
- Tabla `pets` privada mediante RLS.
- Sin lectura anónima directa sobre `pets`.
- Fotografías en bucket privado.
- URLs firmadas.
- DTO privado separado del público.
- Microchip excluido de vistas, logs y analítica.
- Ficha pública permanente fuera del primer incremento, salvo necesidad confirmada.
- Datos públicos derivados posteriormente desde el dominio de reportes.

---

## 25. Criterios de aceptación

Este documento se considera listo para implementación cuando:

- Los campos están clasificados.
- Existe una matriz de acceso.
- La vista pública está separada del modelo privado.
- El microchip dispone de reglas reforzadas.
- Storage privado está definido.
- RLS esperada está documentada.
- Logs y analítica excluyen datos sensibles.
- Los casos de prueba principales están definidos.
- Las decisiones del MVP están identificadas.

---

## 26. Documentos relacionados

- `PET_DOMAIN.md`
- `PET_BUSINESS_RULES.md`
- `PET_LIFECYCLE.md`
- `PET_GLOSSARY.md`
- `AUTH_SECURITY.md`
- `DATA_PRIVACY.md`
- `DATA_RETENTION.md`
- `STORAGE.md`
- `FILE_UPLOADS.md`
- `DATABASE_SCHEMA.md`
- `THREAT_MODEL.md`
- `PRIVACY_POLICY_v2.0.md`
