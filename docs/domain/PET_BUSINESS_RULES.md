# 🐾 Reglas de Negocio de Mascotas

> **Documento:** `PET_BUSINESS_RULES.md`  
> **Área:** Dominio de producto  
> **Estado:** Propuesta para FP-004  
> **Versión:** 1.0  
> **Última actualización:** Agosto de 2026  
> **Ámbito:** MVP web responsive  
> **Documento principal relacionado:** `PET_DOMAIN.md`

---

## 1. Propósito

Este documento define las reglas de negocio aplicables a la entidad `Pet`.

Las reglas aquí descritas deben poder traducirse posteriormente a:

- Validaciones de interfaz.
- Validaciones de servidor.
- Restricciones de base de datos.
- Políticas RLS.
- Reglas de Storage.
- Pruebas automatizadas.
- Eventos de auditoría.
- Mensajes de error consistentes.

---

## 2. Principios generales

### BR-PET-001 — Identidad única

Cada mascota debe disponer de una única identidad digital estable dentro de BuscoHuella.

Crear un nuevo reporte no debe crear una nueva mascota.

### BR-PET-002 — Separación entre mascota y reporte

La identidad `Pet` representa al animal.

Los estados de pérdida, hallazgo, avistamiento o reencuentro pertenecen al dominio de reportes.

### BR-PET-003 — Privacidad por defecto

Toda mascota se considera privada salvo que exista una configuración explícita o un reporte público activo que habilite una vista limitada.

### BR-PET-004 — Propiedad trazable

Toda mascota debe estar asociada a un responsable principal válido y autenticado.

### BR-PET-005 — Conservación histórica

Los reportes, fotografías y eventos históricos no deben perderse por una modificación ordinaria de la ficha.

### BR-PET-006 — Mínima exposición

Solo se publicará la información necesaria para reconocer a la mascota y colaborar en un reencuentro seguro.

---

## 3. Reglas de creación

### BR-PET-CREATE-001 — Usuario autenticado

Solo un usuario autenticado puede crear una mascota.

### BR-PET-CREATE-002 — Responsable principal

El usuario que crea la mascota se asigna como responsable principal.

### BR-PET-CREATE-003 — Campos mínimos

Para crear una mascota activa se requiere:

- Nombre o alias.
- Especie.
- Responsable principal.
- Aceptación de las condiciones aplicables.

### BR-PET-CREATE-004 — Nombre

El nombre:

- No necesita ser único.
- Debe tener entre 1 y 80 caracteres.
- Debe eliminar espacios sobrantes.
- No puede contener únicamente símbolos.
- Puede utilizarse un alias cuando se desconozca el nombre real.

### BR-PET-CREATE-005 — Especie

La especie debe pertenecer al catálogo permitido.

Valor inicial:

```text
DOG
CAT
BIRD
RABBIT
RODENT
REPTILE
OTHER
```

### BR-PET-CREATE-006 — Especie “OTHER”

Cuando la especie sea `OTHER`, podrá requerirse una descripción complementaria.

### BR-PET-CREATE-007 — Fotografía opcional al crear

La mascota puede crearse sin fotografía.

Sin embargo, una fotografía podrá ser obligatoria antes de publicar un reporte de pérdida o hallazgo vinculado.

### BR-PET-CREATE-008 — Ficha borrador

Si el producto incorpora guardado parcial, una ficha incompleta debe permanecer en estado `DRAFT`.

Si no existe guardado parcial, la creación se completa únicamente cuando se cumplen los campos mínimos.

---

## 4. Reglas de propiedad y responsabilidad

### BR-PET-OWNER-001 — Responsable principal obligatorio

Toda mascota activa debe tener un responsable principal.

### BR-PET-OWNER-002 — Responsable autenticado

El responsable principal debe corresponder a un usuario válido del sistema.

### BR-PET-OWNER-003 — Varias mascotas por usuario

Un usuario puede registrar varias mascotas.

### BR-PET-OWNER-004 — Una mascota, un responsable principal

Durante el MVP, una mascota solo puede tener un responsable principal.

### BR-PET-OWNER-005 — Responsables adicionales

Los responsables autorizados quedan preparados como evolución futura y no son obligatorios para FP-004.

### BR-PET-OWNER-006 — Cambio de responsable

El responsable principal no puede modificarse mediante la edición ordinaria de la ficha.

El cambio requiere un flujo específico, trazable y seguro.

### BR-PET-OWNER-007 — Cuenta eliminada

La eliminación de una cuenta no debe borrar automáticamente mascotas con:

- Reportes activos.
- Historial relevante.
- Fotografías vinculadas a incidencias.
- Obligaciones de conservación.

### BR-PET-OWNER-008 — Custodia no equivale a propiedad

Una organización o persona que custodia temporalmente una mascota no se convierte automáticamente en responsable principal.

---

## 5. Reglas de edición

### BR-PET-EDIT-001 — Autorización

Solo el responsable principal o un actor autorizado puede editar una mascota.

### BR-PET-EDIT-002 — Identidad inmutable

El identificador interno `pet.id` no puede modificarse.

### BR-PET-EDIT-003 — Responsable protegido

`owner_id` no puede cambiarse desde el formulario general.

### BR-PET-EDIT-004 — Fecha de nacimiento

La fecha de nacimiento:

- No puede ser futura.
- Puede ser exacta, aproximada o desconocida.
- Debe acompañarse de una precisión cuando sea aproximada.

### BR-PET-EDIT-005 — Peso

El peso:

- Es opcional.
- Debe ser mayor que cero.
- Debe respetar un límite razonable definido por el sistema.

### BR-PET-EDIT-006 — Texto libre

Las descripciones:

- Deben tener longitud limitada.
- Deben almacenarse sin HTML ejecutable.
- Deben limpiarse para evitar contenido malicioso.

### BR-PET-EDIT-007 — Campos protegidos

Los datos sensibles no deben editarse desde vistas públicas ni endpoints públicos.

---

## 6. Reglas de microchip

### BR-PET-CHIP-001 — Dato sensible

El número de microchip es privado.

### BR-PET-CHIP-002 — No exposición

El microchip completo nunca debe mostrarse:

- En fichas públicas.
- En reportes públicos.
- En URLs.
- En logs de cliente.
- En analítica.
- En mensajes de error.

### BR-PET-CHIP-003 — Normalización

Antes de almacenarse, el microchip debe:

- Eliminar espacios y separadores no significativos.
- Convertirse a un formato normalizado.
- Validarse según longitud y caracteres permitidos.

### BR-PET-CHIP-004 — Unicidad condicionada

Cuando exista un microchip válido, el sistema debe evitar duplicados activos verificables.

### BR-PET-CHIP-005 — No confianza absoluta

La coincidencia de microchip es una señal fuerte, pero no sustituye la verificación de legitimidad del responsable.

### BR-PET-CHIP-006 — Edición auditada

Toda modificación del microchip debe quedar registrada.

---

## 7. Reglas de duplicidad

### BR-PET-DUP-001 — Nombre no único

No se debe bloquear una creación por coincidencia de nombre.

### BR-PET-DUP-002 — Señales de duplicidad

El sistema puede detectar similitudes por:

- Mismo responsable.
- Misma especie.
- Mismo nombre.
- Mismo microchip.
- Fotografías similares.
- Rasgos descriptivos coincidentes.

### BR-PET-DUP-003 — Advertencia

Cuando existan señales suficientes, se mostrará una advertencia antes de crear una nueva mascota.

### BR-PET-DUP-004 — Bloqueo por microchip

Un microchip normalizado no debería asociarse simultáneamente a varias mascotas activas verificadas.

### BR-PET-DUP-005 — Fusión fuera del MVP

La fusión automática de mascotas duplicadas queda fuera de FP-004.

### BR-PET-DUP-006 — Resolución administrativa

Los duplicados confirmados podrán marcarse para revisión y resolución manual futura.

---

## 8. Reglas de estado

### BR-PET-STATUS-001 — Estados válidos

Estados administrativos permitidos:

```text
DRAFT
ACTIVE
ARCHIVED
DECEASED
```

### BR-PET-STATUS-002 — Estado por defecto

Una mascota creada correctamente se establece como `ACTIVE`.

### BR-PET-STATUS-003 — Archivo

Una mascota archivada:

- No aparece en el listado principal.
- No puede iniciar nuevos reportes.
- Conserva historial.
- Puede restaurarse.

### BR-PET-STATUS-004 — Fallecimiento

El estado `DECEASED`:

- No elimina la ficha.
- No elimina fotografías o reportes.
- Debe tratarse con sensibilidad.
- Impide iniciar nuevas incidencias ordinarias.

### BR-PET-STATUS-005 — Pérdida no es estado administrativo

`LOST`, `FOUND` y `REUNITED` no son estados principales de `Pet`.

### BR-PET-STATUS-006 — Estado calculado

La interfaz puede mostrar un estado contextual derivado de reportes activos.

---

## 9. Reglas de visibilidad

### BR-PET-VIS-001 — Valores permitidos

```text
PRIVATE
PUBLIC_WHEN_REPORTED
PUBLIC
```

### BR-PET-VIS-002 — Valor por defecto

El valor recomendado por defecto es `PUBLIC_WHEN_REPORTED`.

### BR-PET-VIS-003 — Privada

Una mascota `PRIVATE` solo es visible para su responsable y actores autorizados.

### BR-PET-VIS-004 — Pública durante reporte

Una mascota `PUBLIC_WHEN_REPORTED` expone únicamente una vista pública limitada cuando existe un reporte público activo.

### BR-PET-VIS-005 — Pública permanente

La visibilidad `PUBLIC` puede dejarse fuera del primer alcance técnico si no es necesaria para el MVP.

### BR-PET-VIS-006 — Datos sensibles siempre privados

La visibilidad pública nunca incluye:

- Microchip completo.
- Dirección habitual.
- Datos veterinarios.
- Notas privadas.
- Identidad interna del propietario.
- Datos de auditoría.

---

## 10. Reglas de fotografías

### BR-PET-PHOTO-001 — Propiedad

Toda fotografía debe pertenecer a una mascota válida.

### BR-PET-PHOTO-002 — Autorización

Solo el responsable o actor autorizado puede añadir, ordenar o eliminar fotografías.

### BR-PET-PHOTO-003 — Fotografía principal

Una mascota puede tener como máximo una fotografía principal.

### BR-PET-PHOTO-004 — Reasignación

Al eliminar la fotografía principal:

- Debe seleccionarse otra automáticamente; o
- La mascota debe quedar sin fotografía principal de forma controlada.

### BR-PET-PHOTO-005 — Límites

El sistema debe limitar:

- Cantidad de fotografías.
- Tamaño por archivo.
- Tipos MIME.
- Dimensiones.
- Frecuencia de subida.

### BR-PET-PHOTO-006 — Formatos permitidos

El MVP podrá aceptar:

```text
image/jpeg
image/png
image/webp
```

### BR-PET-PHOTO-007 — Rutas seguras

Las rutas de Storage no deben permitir que un usuario sobrescriba archivos de otra mascota.

### BR-PET-PHOTO-008 — Metadatos

Deben eliminarse metadatos sensibles cuando sea técnicamente viable.

### BR-PET-PHOTO-009 — URLs

Las imágenes privadas no deben depender de URLs públicas permanentes.

### BR-PET-PHOTO-010 — Reportes

Las fotografías propias de una incidencia deben diferenciarse de las fotografías permanentes de la mascota.

---

## 11. Reglas de acceso

### BR-PET-ACCESS-001 — Lectura privada

El responsable puede leer toda la información de sus mascotas.

### BR-PET-ACCESS-002 — Escritura privada

El responsable puede modificar únicamente sus mascotas.

### BR-PET-ACCESS-003 — Usuario ajeno

Un usuario ajeno no puede:

- Enumerar mascotas privadas.
- Consultar datos privados.
- Modificar una mascota.
- Gestionar fotografías.
- Cambiar visibilidad.

### BR-PET-ACCESS-004 — Acceso público controlado

Las vistas públicas deben utilizar campos explícitamente seleccionados, no exponer la fila completa.

### BR-PET-ACCESS-005 — Service role

Las claves administrativas no deben utilizarse en el cliente.

### BR-PET-ACCESS-006 — RLS obligatoria

Las tablas del dominio deben disponer de RLS activa antes de utilizarse en producción.

---

## 12. Reglas de archivo y eliminación

### BR-PET-DELETE-001 — Archivo preferente

El archivo lógico es la operación ordinaria recomendada.

### BR-PET-DELETE-002 — Eliminación física restringida

La eliminación física solo puede contemplarse cuando:

- La ficha fue creada por error.
- No tiene reportes.
- No tiene historial relevante.
- No está sometida a conservación.
- No rompe integridad referencial.

### BR-PET-DELETE-003 — Reportes activos

Una mascota con reportes activos no puede eliminarse.

### BR-PET-DELETE-004 — Fotografías

Al eliminar físicamente una mascota elegible, sus fotografías deben tratarse mediante un proceso controlado.

### BR-PET-DELETE-005 — Auditoría

El archivo, restauración y eliminación deben registrarse.

---

## 13. Reglas de relación con reportes

### BR-PET-REPORT-001 — Historial múltiple

Una mascota puede tener múltiples reportes a lo largo de su vida.

### BR-PET-REPORT-002 — Reporte activo

El sistema puede limitar la creación de reportes incompatibles simultáneos para la misma mascota.

### BR-PET-REPORT-003 — Nueva pérdida

Una nueva pérdida crea un nuevo reporte, no una nueva mascota.

### BR-PET-REPORT-004 — Mascota encontrada desconocida

Una mascota encontrada sin responsable conocido debe gestionarse desde `FoundReport`, no como propiedad del hallador.

### BR-PET-REPORT-005 — Vinculación posterior

Un reporte de hallazgo puede vincularse posteriormente a una mascota existente.

### BR-PET-REPORT-006 — Integridad histórica

Resolver un reporte no modifica ni sustituye la identidad `Pet`.

---

## 14. Reglas de validación

### BR-PET-VALID-001 — Validación doble

Toda entrada debe validarse tanto en cliente como en servidor.

### BR-PET-VALID-002 — Base de datos

Las invariantes críticas deben reforzarse mediante:

- Tipos.
- `CHECK`.
- `NOT NULL`.
- Índices únicos.
- Claves foráneas.
- Triggers únicamente cuando aporten valor real.

### BR-PET-VALID-003 — Errores

Los mensajes deben:

- Ser comprensibles.
- No revelar información sensible.
- Mantener códigos internos estables.
- Poder traducirse.

### BR-PET-VALID-004 — Catálogos

Los valores controlados no deben guardarse como textos libres arbitrarios.

---

## 15. Reglas de auditoría

### BR-PET-AUDIT-001 — Acciones sensibles

Deben poder auditarse:

- Creación.
- Modificación.
- Cambio de visibilidad.
- Cambio de microchip.
- Archivo.
- Restauración.
- Fallecimiento.
- Gestión de fotografías.
- Cambio de responsable.

### BR-PET-AUDIT-002 — Datos mínimos

Un evento de auditoría debe poder identificar:

- Actor.
- Acción.
- Mascota.
- Fecha.
- Resultado.
- Contexto técnico mínimo.

### BR-PET-AUDIT-003 — Datos sensibles

Los logs no deben incluir valores sensibles completos.

---

## 16. Reglas de rendimiento y seguridad

### BR-PET-SEC-001 — Consultas indexadas

Las consultas por responsable, estado y fechas deben disponer de índices adecuados.

### BR-PET-SEC-002 — Enumeración

La API no debe permitir enumerar mascotas privadas mediante identificadores secuenciales o respuestas diferenciadas inseguras.

### BR-PET-SEC-003 — Rate limiting

Las operaciones de subida, eliminación y consulta pública intensiva podrán estar sujetas a límites.

### BR-PET-SEC-004 — Archivos

Los archivos deben validarse antes de considerarse disponibles.

### BR-PET-SEC-005 — Caché

Las respuestas con información privada no deben almacenarse en cachés públicas.

---

## 17. Reglas fuera del MVP

Quedan fuera de FP-004:

- Custodia compartida avanzada.
- Transferencias complejas de propiedad.
- Verificación documental automatizada.
- Fusión automática de duplicados.
- Reconocimiento visual.
- Historial clínico completo.
- Integración con registros oficiales.
- Seguimiento GPS.
- Dispositivos físicos.
- Genealogía.
- Pedigrí certificado.
- Marketplace.
- Seguros.

---

## 18. Matriz de aplicación técnica

| Regla | Cliente | Servidor | Base de datos | RLS | Storage | Tests |
|---|---:|---:|---:|---:|---:|---:|
| Usuario autenticado | Sí | Sí | No | Sí | Sí | Sí |
| Campos mínimos | Sí | Sí | Sí | No | No | Sí |
| Propiedad | No | Sí | Sí | Sí | Sí | Sí |
| Microchip privado | Sí | Sí | Sí | Sí | No | Sí |
| Una foto principal | Sí | Sí | Sí | No | No | Sí |
| Visibilidad | Sí | Sí | Sí | Sí | Sí | Sí |
| Archivo lógico | Sí | Sí | Sí | Sí | Sí | Sí |
| Estados permitidos | Sí | Sí | Sí | No | No | Sí |
| No eliminar con reportes | No | Sí | Sí | No | No | Sí |

---

## 19. Criterios de aceptación

Este documento se considera listo para implementación cuando:

- Cada regla relevante tiene un identificador estable.
- Las reglas críticas pueden convertirse en restricciones técnicas.
- La privacidad está definida por defecto.
- La propiedad y autorización están diferenciadas.
- Los estados de mascota no se mezclan con los de reportes.
- Las fotografías tienen reglas independientes.
- Se contempla archivo, restauración y eliminación.
- Las reglas fuera del MVP están explícitamente separadas.
- Las reglas pueden convertirse en casos de prueba.

---

## 20. Documentos relacionados

- `PET_DOMAIN.md`
- `PET_LIFECYCLE.md`
- `PET_PRIVACY.md`
- `PET_GLOSSARY.md`
- `REPORT_DOMAIN.md`
- `USER_DOMAIN.md`
- `DATABASE_SCHEMA.md`
- `DATA_DICTIONARY.md`
- `AUTH_SECURITY.md`
- `MVP_SCOPE.md`
