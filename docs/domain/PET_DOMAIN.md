# 🐾 Dominio de Mascotas

> **Documento:** `PET_DOMAIN.md`  
> **Área:** Dominio de producto  
> **Estado:** Propuesta para FP-004  
> **Versión:** 1.0  
> **Última actualización:** Agosto de 2026  
> **Ámbito:** MVP web responsive  
> **Fuente superior:** `docs/master/DOCUMENTO_MAESTRO.md`

---

## 1. Propósito

Este documento define el dominio funcional de la entidad `Pet` dentro de BuscoHuella.

Una mascota representa una **identidad digital estable y permanente**, independiente de las incidencias que puedan producirse durante su vida.

La entidad `Pet` permite:

- Registrar la identidad básica de una mascota.
- Mantener su información descriptiva e identificativa.
- Gestionar fotografías.
- Establecer quién puede verla o modificarla.
- Asociarla posteriormente con reportes de pérdida, hallazgo o avistamiento.
- Conservar su historial sin crear una identidad nueva por cada incidencia.

---

## 2. Principio fundamental

Una mascota no es un reporte.

La mascota representa la identidad del animal. Un reporte representa una situación concreta ocurrida en un momento determinado.

Por tanto:

```text
Pet
 ├── LostReport
 ├── FoundReport
 ├── Sighting
 └── Future incidents
```

Una misma mascota puede perderse más de una vez durante su vida y generar varios reportes sin que se cree una nueva entidad `Pet`.

---

## 3. Definición de la entidad

`Pet` representa una mascota registrada dentro de BuscoHuella por una persona responsable o, en determinados casos futuros, por una organización autorizada.

La entidad mantiene:

- Identidad funcional.
- Datos descriptivos.
- Información identificativa.
- Fotografías.
- Estado administrativo.
- Preferencias de privacidad.
- Relación con responsables.
- Fechas de creación y actualización.

---

## 4. Identidad de la mascota

Cada mascota dispone de un identificador interno único e inmutable:

```text
pet.id
```

Este identificador:

- Es generado por el sistema.
- No contiene información personal.
- No cambia aunque se modifique el nombre, propietario o estado.
- Se utiliza para relacionar la mascota con fotografías, responsables, reportes y eventos.
- No debe sustituirse cuando la mascota se pierde o aparece.

El nombre de la mascota no constituye una identidad única.

Dos mascotas diferentes pueden tener el mismo nombre.

---

## 5. Diferencia entre mascota y reporte

### Mascota

Contiene información relativamente estable:

- Nombre.
- Especie.
- Raza o cruce.
- Sexo.
- Fecha de nacimiento aproximada.
- Tamaño.
- Peso.
- Colores.
- Rasgos distintivos.
- Información identificativa.
- Fotografías habituales.

### Reporte

Contiene información contextual y temporal:

- Tipo de incidencia.
- Fecha y hora.
- Ubicación.
- Circunstancias.
- Estado de resolución.
- Fotografías de la incidencia.
- Avistamientos relacionados.
- Datos públicos de contacto habilitados.

Los datos de una incidencia no deben almacenarse directamente como estado permanente de la mascota.

---

## 6. Actores relacionados

### Responsable principal

Persona autenticada que registra inicialmente la mascota y mantiene la responsabilidad principal sobre su ficha.

Puede:

- Consultar la información completa.
- Editar la ficha.
- Añadir o retirar fotografías.
- Gestionar privacidad.
- Iniciar reportes asociados.
- Incorporar otros responsables cuando esta función esté disponible.
- Archivar la mascota.

### Responsable autorizado

Persona que recibe permiso para colaborar en la gestión de la mascota.

Esta capacidad puede incorporarse después del MVP inicial.

Según los permisos concedidos podrá:

- Consultar información privada.
- Editar determinados datos.
- Iniciar o actualizar reportes.
- Colaborar durante una pérdida.

### Usuario público

Puede consultar únicamente la información que se haya definido como pública y que sea necesaria para reconocer a la mascota.

### Organización

En fases posteriores, protectoras, refugios, clínicas veterinarias u otras entidades verificadas podrán gestionar mascotas bajo custodia.

La primera versión del MVP podrá limitar la creación de mascotas a perfiles personales.

---

## 7. Atributos funcionales

### 7.1 Identificación interna

| Campo | Descripción |
|---|---|
| `id` | Identificador único de la mascota |
| `owner_id` | Responsable principal |
| `created_at` | Fecha de creación |
| `updated_at` | Fecha de última modificación |
| `archived_at` | Fecha de archivo, si procede |

### 7.2 Información básica

| Campo | Obligatorio | Descripción |
|---|---:|---|
| `name` | Sí | Nombre habitual o alias |
| `species` | Sí | Especie normalizada |
| `breed` | No | Raza principal |
| `is_mixed_breed` | No | Indica si es mestiza |
| `sex` | No | Sexo conocido |
| `birth_date` | No | Fecha de nacimiento |
| `birth_date_precision` | No | Exacta, aproximada o desconocida |
| `size` | No | Tamaño general |
| `weight_kg` | No | Peso aproximado |
| `primary_color` | No | Color principal |
| `secondary_colors` | No | Colores adicionales |
| `description` | No | Descripción general |
| `distinctive_features` | No | Rasgos útiles para reconocerla |

### 7.3 Identificación protegida

| Campo | Obligatorio | Descripción |
|---|---:|---|
| `has_microchip` | No | Indica si dispone de microchip |
| `microchip_number` | No | Número completo protegido |
| `identification_notes` | No | Información identificativa adicional |

El número completo de microchip nunca debe mostrarse públicamente.

### 7.4 Estado administrativo

| Campo | Descripción |
|---|---|
| `status` | Estado interno de la ficha |
| `visibility` | Nivel de visibilidad |
| `is_public_profile_enabled` | Permite o impide una ficha pública estable |

---

## 8. Especies admitidas en el MVP

El catálogo inicial debe ser cerrado y ampliable.

```text
DOG
CAT
BIRD
RABBIT
RODENT
REPTILE
OTHER
```

Los valores se almacenarán mediante códigos internos estables y se traducirán en la interfaz.

No se guardarán textos traducidos directamente en la base de datos.

Cuando se seleccione `OTHER`, podrá solicitarse una descripción adicional.

---

## 9. Estado administrativo de la mascota

El estado de la identidad `Pet` no debe confundirse con el estado de un reporte.

Estados propuestos:

```text
DRAFT
ACTIVE
ARCHIVED
DECEASED
```

### `DRAFT`

La ficha se ha iniciado, pero todavía no cumple los requisitos mínimos para considerarse operativa.

En el MVP puede evitarse este estado si el formulario se guarda únicamente al completarse.

### `ACTIVE`

La mascota está registrada y puede utilizarse en las funciones permitidas.

### `ARCHIVED`

La ficha ha sido retirada de la gestión cotidiana, pero se conserva por integridad histórica.

Una mascota archivada:

- No aparece en el listado principal.
- No puede iniciar nuevos reportes.
- Mantiene sus reportes e historial.
- Puede restaurarse cuando proceda.

### `DECEASED`

Indica que la mascota ha fallecido.

La información se conserva con sensibilidad y no debe eliminar automáticamente su historial.

---

## 10. Situación de pérdida

La situación `LOST`, `FOUND` o `REUNITED` no debe formar parte del ciclo administrativo principal de `Pet`.

Estas situaciones corresponden al dominio de reportes.

El estado visible de una mascota podrá derivarse de la existencia de un reporte activo:

```text
Pet administrativo: ACTIVE
Reporte asociado: LOST + ACTIVE
Estado calculado en interfaz: Perdida
```

Cuando el reporte se resuelva:

```text
Pet administrativo: ACTIVE
Reporte asociado: LOST + RESOLVED
Resultado: REUNITED
Estado calculado en interfaz: En casa
```

Esto evita inconsistencias entre la ficha y los reportes.

---

## 11. Fotografías

Una mascota puede disponer de varias fotografías.

Cada fotografía deberá tener:

- Identificador.
- Referencia a la mascota.
- Ruta segura en Storage.
- Orden de presentación.
- Indicador de fotografía principal.
- Fecha de creación.
- Estado de moderación cuando corresponda.
- Texto alternativo o descripción opcional.

Reglas principales:

- Una mascota puede tener una sola fotografía principal.
- La fotografía principal se utiliza en listados y tarjetas.
- El propietario puede cambiar la fotografía principal.
- Eliminar una fotografía no debe dejar referencias rotas.
- Las imágenes deben validarse por tipo, tamaño y dimensiones.
- Deben eliminarse metadatos sensibles cuando sea técnicamente viable.
- Una fotografía privada no debe servirse mediante una URL pública permanente.

Para el MVP podrá exigirse al menos una fotografía para publicar un reporte, aunque no necesariamente para crear la ficha inicial.

---

## 12. Privacidad

La privacidad se aplica por defecto.

La existencia de una ficha no implica que toda su información sea pública.

### Información potencialmente pública

- Nombre o alias.
- Especie.
- Raza.
- Sexo.
- Tamaño.
- Colores.
- Rasgos distintivos.
- Fotografía seleccionada.
- Información necesaria durante un reporte activo.

### Información restringida

- Identidad del propietario.
- Dirección exacta habitual.
- Microchip completo.
- Datos veterinarios.
- Documentos acreditativos.
- Notas privadas.
- Historial interno.
- Información de moderación.
- Datos de seguridad y auditoría.

### Principio de exposición mínima

Solo se hará pública la información necesaria para:

- Reconocer a la mascota.
- Colaborar en una búsqueda.
- Facilitar un reencuentro seguro.
- Verificar legítimamente una reclamación.

---

## 13. Visibilidad

Niveles funcionales propuestos:

```text
PRIVATE
PUBLIC_WHEN_REPORTED
PUBLIC
```

### `PRIVATE`

La ficha solo puede ser consultada por su responsable y usuarios expresamente autorizados.

### `PUBLIC_WHEN_REPORTED`

La ficha permanece privada normalmente y muestra una versión pública limitada mientras exista un reporte público activo.

Este será el valor recomendado por defecto.

### `PUBLIC`

Mantiene una ficha pública estable con información limitada.

Esta función puede quedar fuera de la primera entrega de FP-004 si no es necesaria para el MVP.

---

## 14. Reglas de propiedad

- Toda mascota debe tener un responsable principal válido.
- El responsable debe ser un usuario autenticado.
- Un usuario puede registrar varias mascotas.
- Una mascota no puede quedar sin responsable principal durante el MVP.
- El cambio de responsable debe ser explícito, trazable y seguro.
- El responsable principal no debe modificarse mediante una edición ordinaria.
- La eliminación de una cuenta no debe borrar silenciosamente una mascota con reportes activos.
- Las futuras organizaciones deberán utilizar relaciones de custodia diferenciadas de la propiedad personal.

---

## 15. Prevención de duplicados

El sistema debe reducir la creación accidental de varias identidades para una misma mascota.

Se considerarán señales de posible duplicidad:

- Mismo responsable.
- Mismo número de microchip.
- Nombre y especie coincidentes.
- Fotografías similares.
- Datos descriptivos coincidentes.
- Registro creado durante una incidencia ya existente.

En el MVP:

- No se bloqueará automáticamente una creación únicamente por nombre.
- El microchip completo, cuando exista, deberá ser único entre registros activos verificables.
- Se advertirá al usuario cuando ya tenga una mascota con datos similares.
- La fusión automática de mascotas queda fuera del alcance inicial.

---

## 16. Mascotas encontradas sin propietario conocido

Una persona puede encontrar una mascota cuyo propietario todavía no esté identificado.

Ese caso no debe obligar a crear inmediatamente una mascota personal propiedad del usuario que la encontró.

Debe gestionarse mediante el futuro dominio `FoundReport`.

Cuando se identifique al responsable legítimo:

- El reporte podrá vincularse con una mascota existente.
- Podrá crearse una nueva ficha bajo el control del responsable.
- No se transferirá automáticamente la propiedad al usuario que realizó el hallazgo.

---

## 17. Eliminación y archivo

Las mascotas no deben eliminarse físicamente de forma ordinaria cuando tengan relaciones históricas relevantes.

Se aplicará preferentemente un archivo lógico.

### Puede archivarse cuando:

- El usuario ya no desea verla en su panel principal.
- La mascota ha fallecido.
- La ficha fue creada por error y no tiene actividad relevante.
- Existe una identidad duplicada pendiente de resolución.

### No debe eliminarse directamente cuando:

- Tiene reportes activos.
- Tiene avistamientos relacionados.
- Forma parte de una investigación o proceso de moderación.
- Existe una obligación de conservación.
- Su eliminación rompería métricas o trazabilidad.

---

## 18. Auditoría

Las operaciones sensibles deberán ser trazables.

Como mínimo:

- Creación.
- Cambio de responsable.
- Modificación del microchip.
- Cambio de visibilidad.
- Archivo o restauración.
- Eliminación de fotografías.
- Vinculación con reportes.
- Acciones administrativas.

El MVP puede registrar inicialmente esta información mediante timestamps y logs técnicos, dejando un sistema de auditoría avanzado para una fase posterior.

---

## 19. Eventos del dominio

Eventos relevantes:

```text
PetCreated
PetUpdated
PetArchived
PetRestored
PetMarkedAsDeceased
PetPhotoAdded
PetPhotoRemoved
PetPrimaryPhotoChanged
PetVisibilityChanged
PetOwnerChanged
```

En el MVP no es obligatorio implementar una arquitectura completa orientada a eventos.

Estos nombres sirven para identificar acciones que podrán producir:

- Logs.
- Métricas.
- Notificaciones.
- Auditoría.
- Integraciones futuras.

---

## 20. Relaciones previstas

```text
UserProfile 1 ─── N Pet
Pet 1 ─── N PetPhoto
Pet 1 ─── N Report
Pet N ─── N AuthorizedCaregiver
Pet 1 ─── N AuditEvent
```

Para el MVP inicial pueden implementarse únicamente:

```text
UserProfile 1 ─── N Pet
Pet 1 ─── N PetPhoto
```

La relación con reportes se añadirá durante el hito correspondiente.

---

## 21. Permisos esperados

### Propietario

Puede:

- Crear mascotas.
- Consultar sus mascotas.
- Editar sus mascotas.
- Gestionar fotografías.
- Archivar y restaurar.
- Configurar privacidad.

### Usuario ajeno

No puede:

- Consultar fichas privadas.
- Modificar mascotas ajenas.
- Acceder a información identificativa.
- Enumerar mascotas privadas mediante la API.

### Administrador o moderador

Solo podrá acceder a la información necesaria para una tarea legítima de soporte, seguridad o moderación.

El uso de una clave administrativa nunca debe realizarse desde el cliente.

---

## 22. Requisitos mínimos de creación

Para crear una mascota activa se requerirá:

- Responsable autenticado.
- Nombre o alias.
- Especie.
- Confirmación de aceptación del tratamiento de datos aplicable.

Los demás campos serán opcionales durante la creación inicial.

Antes de iniciar un reporte público podrá exigirse información adicional:

- Fotografía.
- Descripción.
- Color.
- Tamaño.
- Rasgos distintivos.

---

## 23. Validaciones principales

- El nombre debe tener una longitud limitada y segura.
- La especie debe pertenecer al catálogo permitido.
- El peso no puede ser negativo.
- La fecha de nacimiento no puede ser futura.
- El microchip debe normalizarse antes de almacenarse.
- Las cadenas deben limpiarse y limitarse.
- Los identificadores relacionados deben pertenecer al usuario autorizado.
- La visibilidad debe utilizar valores controlados.
- Solo puede existir una fotografía principal por mascota.
- Una mascota archivada no puede utilizarse para iniciar nuevos reportes.

---

## 24. Fuera del alcance de FP-004

No se implementará inicialmente:

- Reconocimiento visual mediante inteligencia artificial.
- Genealogía.
- Historial clínico completo.
- Telemedicina.
- Seguimiento GPS.
- Dispositivos físicos.
- Seguros.
- Transferencias complejas de propiedad.
- Custodia compartida avanzada.
- Pedigrí certificado.
- Blockchain.
- Marketplace.
- Fusión automática de duplicados.
- Integraciones con registros administrativos externos.

---

## 25. Criterios de aceptación del dominio

El dominio se considerará correctamente definido cuando:

- La mascota se modele como identidad independiente del reporte.
- Los estados administrativos estén separados de las incidencias.
- Los datos públicos y privados estén claramente diferenciados.
- La propiedad y los permisos estén definidos.
- Las fotografías tengan un modelo propio.
- Las reglas puedan convertirse en restricciones, validaciones y políticas RLS.
- El diseño permita enlazar reportes sin modificar la identidad de la mascota.
- Los campos del MVP estén separados de las ampliaciones futuras.

---

## 26. Decisiones abiertas

Antes de cerrar la implementación deberán confirmarse:

- Si las fichas públicas permanentes entran en el MVP.
- Si el microchip se cifra adicionalmente a nivel de aplicación.
- Número máximo de fotografías por mascota.
- Tamaño máximo permitido por imagen.
- Si se admite la creación sin fotografía.
- Si `DECEASED` será estado o fecha independiente.
- Si la raza se guarda inicialmente como texto controlado o mediante catálogo.
- Política exacta para borrado de cuenta y transferencia de mascotas.

---

## 27. Documentos relacionados

- `PET_BUSINESS_RULES.md`
- `PET_LIFECYCLE.md`
- `PET_PRIVACY.md`
- `PET_GLOSSARY.md`
- `USER_DOMAIN.md`
- `REPORT_DOMAIN.md`
- `DATABASE_SCHEMA.md`
- `DATA_DICTIONARY.md`
- `AUTH_SECURITY.md`
- `MVP_SCOPE.md`
- `FUNCTIONAL_REQUIREMENTS.md`

---

## 28. Resumen ejecutivo

La entidad `Pet` es la identidad digital permanente de una mascota dentro de BuscoHuella.

No representa una pérdida, un hallazgo ni un avistamiento.

Su diseño debe garantizar:

- Continuidad de identidad.
- Privacidad por defecto.
- Propiedad y permisos claros.
- Historial preservado.
- Compatibilidad con múltiples reportes.
- Protección de información sensible.
- Evolución futura sin inflar el MVP.
