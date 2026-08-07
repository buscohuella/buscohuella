# BUSCOHUELLA – CONTEXTO DE CONTINUIDAD

## Rol
Actúa como CTO virtual. Revisa la documentación antes de implementar y evita romper decisiones ya tomadas.

## Estado actual del MVP
- Autenticación y perfiles.
- Gestión de mascotas.
- Crear, editar, pausar, reactivar, resolver y archivar avisos.
- Fotos del aviso y foto principal.
- Historial.
- Avisos públicos y ficha pública.
- Compartir aviso.
- Crear avistamientos.
- Fotos del avistamiento.
- Revisión por el propietario.
- Mis avistamientos.
- Avistamientos recibidos.
- Timeline del colaborador.
- Centro de 'Avisos' reorganizado.

Todo debe seguir funcionando en ES/CA, TypeScript estricto, lint y build sin errores.

## Último bloque terminado
FP-018 consolidado:
- Navegación:
  - Inicio
  - Mapa
  - Avisos
  - Mascotas
  - Perfil
- Dentro de Avisos:
  - Explorar avisos
  - Mis avisos
  - Avistamientos recibidos
  - Mis avistamientos
- Corregidas fotos públicas, historial, traducciones, duplicados y estados.

## Bloque actual
FP-019 – Centro de notificaciones internas.

Objetivo:
Crear una infraestructura reutilizable de notificaciones.

Debe incluir:
- notifications
- RLS
- RPC
- contador en campana
- bandeja
- marcar leídas
- marcar todas
- filtros
- paginación
- backfill histórico

Eventos:
- Nuevo avistamiento
- Avistamiento revisado
- Pausa
- Reactivación
- Resuelto
- Cerrado
- Archivado

No implementar todavía:
- Push
- Realtime
- Alertas por proximidad
- Entidades

## Arquitectura
report_events sigue siendo la fuente de verdad.
notifications representa entregas a usuarios.
Push y Realtime consumirán notifications.

## Próximos bloques
1. Push Notifications
2. Realtime
3. Alertas por proximidad
4. Radio geográfico
5. Preferencias de notificaciones
6. Perfil público
7. Reputación
8. Voluntarios
9. Protectores
10. Ayuntamientos
11. Policía
12. IA de coincidencias
13. Gamificación
14. Recompensas

## Documentación obligatoria
- Documento Maestro
- ADR
- docs/frontend/FUNCTIONAL_DELIVERY_ROADMAP.md
- docs/frontend/MVP_SCOPE_AND_ROADMAP.md
- docs/frontend/MVP_CONTROLLED_DEBT.md
- docs/frontend/COMMUNITY_NOTIFICATIONS_VISION.md
- docs/frontend/FP-018*.md
- docs/frontend/FP-019_INTERNAL_NOTIFICATIONS.md

Usar estos documentos como fuente de verdad y continuar desde FP-019.
