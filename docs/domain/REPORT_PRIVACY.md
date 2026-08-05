---
id: REPORT_PRIVACY
title: Privacidad y seguridad de reportes
version: 0.1.0
status: Proposed
owner: Security & Product
last_reviewed: 2026-08-05
---

# Privacidad y seguridad de reportes

## 1. Ubicaciones

Cada reporte y avistamiento mantiene dos representaciones:

```text
exact_location
→ privada; solo creador y procesos autorizados

public_location
→ degradada; utilizada por mapa y listados públicos
```

Nunca se calcula la ubicación pública en el cliente como única protección.

## 2. Precisión pública

```text
EXACT_AREA
APPROXIMATE_100M
APPROXIMATE_500M
APPROXIMATE_1KM
MUNICIPALITY_ONLY
HIDDEN
```

Para domicilios, refugios temporales, colonias sensibles o riesgo de robo se
debe utilizar una precisión más restrictiva.

## 3. Contacto

Modos iniciales:

```text
PLATFORM_ONLY
PUBLIC_PHONE
PUBLIC_EMAIL
HIDDEN
```

El valor real de teléfono o correo no se copia al reporte salvo decisión
explícita. Por defecto se usa contacto mediado por plataforma.

## 4. Datos que nunca son públicos

- microchip;
- notas privadas de mascota;
- ubicación exacta;
- dirección residencial;
- correo o teléfono sin consentimiento;
- identificadores internos;
- datos de sesión;
- metadatos EXIF/GPS de fotografías.

## 5. RLS esperada

### Propietario/creador

Puede leer y modificar sus reportes, salvo campos controlados por funciones.

### Público autenticado o anónimo

No consulta tablas base directamente. Utiliza una proyección o RPC pública.

### Avistamientos

El autor puede crear. El creador del reporte puede consultar los detalles
privados necesarios. La exposición pública se limita a una proyección segura.

## 6. Abuso

El diseño debe permitir posteriormente:

- rate limiting;
- bloqueo de usuarios;
- moderación;
- ocultación urgente;
- trazabilidad;
- conservación legal;
- denuncia de contenido.
