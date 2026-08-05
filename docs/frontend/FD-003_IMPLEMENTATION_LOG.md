---
id: FD-003_IMPLEMENTATION_LOG
title: Registro de implementación de FD-003
version: 1.0.0
status: Active
owner: Frontend, Design & Accessibility
last_reviewed: 2026-08-06
---

# Registro de implementación de FD-003

## Propósito

Conservar decisiones, incidencias, validaciones y próximos pasos sin cargar
el roadmap general con detalle técnico.

## Estado operativo

```text
Bloque activo
→ FD-003 Entrega 4

Completado
→ tokens, temas, primitivas y Auth

Siguiente
→ infraestructura i18n mínima

Después
→ Perfil y Mascotas
```

## Commits de referencia

```text
a338982 — completar primitivas accesibles
8bd8dd6 — migrar login al Design System
f88c049 — mejorar registro y experiencia pública
```

La recuperación y el cambio de contraseña también están publicadas y
validadas mediante flujos reales. El historial Git es la referencia canónica
para consultar sus hashes exactos.

## Incidencias resueltas

### ThemeProvider y React 19

- se eliminó `setState` síncrono dentro de efectos;
- se migró a un store compatible con `useSyncExternalStore`;
- se mantuvieron persistencia y SSR.

### Selector de tema

- se eliminó la opción visible `Sistema`;
- la primera visita detecta claro u oscuro;
- después el usuario cambia directamente entre ambos;
- se evitaron duplicidades y micro movimientos.

### Compatibilidad de Card

- una instalación inicial eliminó API existente;
- se restauraron `elevated`, `CardTitle` y `CardDescription`;
- se conservaron los nuevos tokens.

### AlertProps

- se resolvió el conflicto entre la prop visual `title` y el atributo HTML.

### FormErrorSummary

- se corrigió la inferencia de TypeScript evitando arrays temporales con
  elementos `null`;
- los errores se construyen de forma explícita.

### Registro

- el servidor pasó de comprobar solo correo no vacío a validar estructura,
  dominio y extensión;
- no se restringieron Gmail, Hotmail ni dominios corporativos;
- Supabase mantiene la confirmación real de existencia del buzón;
- se eliminó el mensaje duplicado;
- el registro redirige al login.

### Contraste y tema público

- se sustituyeron colores fijos por tokens semánticos;
- el selector de tema se añadió a navegación pública y Auth.

## Validaciones superadas

- typecheck web;
- lint web;
- build global;
- registro y confirmación mediante correo real;
- login y logout;
- recuperación de contraseña;
- actualización de contraseña;
- redirecciones;
- carga;
- claro y oscuro;
- móvil básico;
- diálogos y devolución de foco.

## Regla de implementación

```text
analizar
→ modificar pocos archivos
→ typecheck
→ lint
→ build
→ prueba manual
→ documentar
→ commit
→ push
```

## Próximos pasos

1. infraestructura i18n mínima;
2. Perfil;
3. Mascotas;
4. patrones restantes;
5. catálogo;
6. auditoría final;
7. cierre de FD-003.

## Futuro registrado

FD-005 cubrirá observabilidad y operaciones:

- logger estructurado;
- sanitización;
- códigos de incidencia;
- correlation ID;
- error boundaries;
- métricas;
- alertas;
- panel administrativo;
- retención y privacidad.
