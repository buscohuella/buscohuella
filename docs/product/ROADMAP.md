# BuscoHuella — Roadmap de producto

> Roadmap operativo y técnico de alto nivel. El Documento Maestro mantiene la visión global y Notion el seguimiento diario.

> **Roadmap de implementación:** el orden detallado de construcción del MVP se mantiene en [`MVP_IMPLEMENTATION_ROADMAP.md`](./MVP_IMPLEMENTATION_ROADMAP.md).

## 1. Principios

- Validar primero el problema local.
- Construir un MVP útil, no una demo.
- Priorizar reencuentros.
- Mantener privacidad y seguridad.
- Accesibilidad desde el inicio.
- Arquitectura preparada para web y móvil.
- No retrasar el piloto por funciones futuras.
- Documentar cada Feature Pack.
- Medir impacto real.

## 2. Requisitos transversales

Aplican a todas las fases:

- WCAG 2.2 AA;
- responsive;
- seguridad;
- privacidad;
- RLS;
- preparación i18n;
- compatibilidad con temas;
- estados de interfaz;
- rendimiento;
- analítica responsable;
- documentación;
- pruebas;
- sincronización GitHub–Notion.

Documentos canónicos:

```text
docs/project/CROSS_CUTTING_REQUIREMENTS.md
docs/project/FEATURE_PACK_DEFINITION_OF_DONE.md
docs/ux/ACCESSIBILITY_STRATEGY.md
docs/frontend/I18N_AND_THEME_STRATEGY.md
```

## 3. Fase 0 — Fundamentos

### FP-001 — App Shell

Estado:

```text
Completado
```

Incluye:

- sistema visual;
- layout responsive;
- sidebar;
- navegación móvil;
- rutas base;
- documentación.

### FP-002 — Autenticación

Estado:

```text
Completado
```

Incluye:

- registro;
- confirmación;
- login;
- logout;
- recuperación;
- protección de rutas;
- Supabase SSR;
- SMTP;
- documentación.

### FP-003 — Perfiles

Estado:

```text
En desarrollo
```

Incluye:

- tabla `profiles`;
- trigger;
- RLS;
- perfil privado;
- alias;
- municipio;
- biografía;
- visibilidad pública;
- `/u/[alias]`;
- navegación coherente por sesión.

Pendiente posible dentro o después de FP-003:

- avatar;
- preferencias;
- baja de cuenta;
- exportación;
- cambio de correo;
- ajustes de privacidad detallados.

No todo lo pendiente debe bloquear el cierre del MVP inicial de perfiles.

## 4. Fase 1 — Núcleo MVP

### Gestión de mascotas

- crear;
- editar;
- listar;
- detalle;
- fotos;
- estado;
- identificación;
- datos físicos;
- privacidad;
- RLS.

### Reportes

- perdida;
- encontrada;
- avistamiento;
- estados;
- detalle público;
- cierre y resolución;
- relación con mascota;
- ubicación segura.

### Mapa

- casos públicos;
- filtros;
- ubicación;
- radio;
- marcadores;
- alternativa accesible en listado;
- fichas;
- permisos.

### Avistamientos

- añadir;
- adjuntar evidencia;
- ubicación aproximada;
- historial;
- validación;
- notificación al responsable.

### Notificaciones

- eventos críticos;
- correo;
- web push cuando proceda;
- preferencias;
- límites;
- privacidad.

### Reencuentros

- resolución;
- evidencia;
- métricas;
- historia opcional;
- North Star Metric.

## 5. Fase 2 — Piloto local

- Sabadell;
- pruebas en calle;
- entrevistas;
- protectora colaboradora;
- veterinarios;
- ayuntamiento;
- policía local;
- materiales;
- presentaciones;
- redes;
- soporte;
- métricas;
- accesibilidad con usuarios reales.

## 6. Fase 3 — Aplicación móvil

La app móvil se construirá cuando los flujos centrales y contratos backend estén validados.

Incluye progresivamente:

- Expo React Native;
- autenticación compartida;
- mascotas;
- reportes;
- mapa;
- cámara;
- ubicación;
- notificaciones;
- QR;
- flujos de urgencia.

## 7. Fase 4 — Organizaciones

- protectoras;
- refugios;
- veterinarios;
- profesionales;
- administraciones;
- membresías;
- verificación;
- permisos;
- paneles;
- campañas.

## 8. Fase 5 — Comunidad y reputación

Según:

```text
docs/community/GAMIFICATION_AND_REPUTATION.md
```

Incluye por fases:

- contribuciones;
- insignias;
- voluntariado;
- acogidas;
- rutas;
- misiones;
- rankings opt-in;
- recompensas;
- patrocinio.

Fuera del MVP inicial.

## 9. Fase 6 — Funciones avanzadas

- IA de coincidencias;
- reconocimiento visual;
- chat;
- QR avanzado;
- integraciones;
- analítica avanzada;
- B2G;
- marketplace;
- economía futura.

Sujetas a validación.

## 10. Roadmap transversal

### Accesibilidad

- aplicada en cada Feature Pack;
- auditorías periódicas;
- pruebas con usuarios;
- declaración antes de lanzamiento estable.

### Idiomas

- preparación desde ahora;
- infraestructura antes de acumular pantallas;
- traducción antes del piloto ampliado o expansión.

### Modo oscuro

- tokens desde ahora;
- implementación cuando se consoliden componentes;
- pruebas completas antes de considerarlo terminado.

### Seguridad y privacidad

- RLS por dominio;
- auditorías;
- antifraude;
- exportación;
- eliminación;
- sesiones;
- MFA futura.

### Calidad

- lint;
- build;
- tests;
- CI/CD;
- observabilidad;
- monitorización;
- documentación.

## 11. Regla de priorización

Prioridad:

```text
Seguridad y bienestar
→ flujos críticos
→ valor MVP
→ validación local
→ calidad transversal
→ retención
→ monetización
→ funciones experimentales
```

## 12. Gestión operativa

GitHub:

- código;
- documentación técnica;
- esquemas;
- migraciones;
- ADR;
- tests.

Notion:

- tareas;
- responsables;
- fechas;
- estado;
- bloqueos;
- pilotos;
- reuniones;
- entregables.

## 13. Revisión

Este roadmap se revisará:

- al cerrar cada fase;
- cuando cambie el alcance del MVP;
- tras investigación relevante;
- antes del piloto;
- trimestralmente como mínimo.
