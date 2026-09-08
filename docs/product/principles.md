# Principios de producto, ética, identidad y diseño

Estado: documento estable del proyecto. Corte inicial: 8 de septiembre de 2026.

Este documento recoge principios que deben orientar producto, tecnología, contenido y diseño de BuscoHuella. No sustituye todavía al Documento Maestro; será una de sus fuentes canónicas cuando se cree la nueva versión.

## Valores éticos

- **Privacidad por defecto.** Los perfiles, datos de contacto, identificadores y ubicaciones empiezan protegidos. La publicación requiere una decisión clara y limitada de la persona usuaria.
- **Ubicación aproximada en público.** La ubicación exacta de una mascota, una persona o un avistamiento no se expone públicamente. Las vistas públicas usan una referencia aproximada y honesta.
- **Seguridad animal antes que engagement.** La prioridad es ayudar a proteger y reunir mascotas; no se optimizarán interacción, viralidad o retención a costa de decisiones seguras.
- **Transparencia.** Se explican los límites del producto, el uso de los datos, los estados de los casos y los errores. No se presenta una función futura como disponible.
- **No vender datos sensibles.** BuscoHuella no venderá datos sensibles ni usará la urgencia de una pérdida para forzar monetización agresiva.
- **Accesibilidad real.** La accesibilidad se valida en flujos y componentes reales: teclado, foco, contraste, etiquetas, errores, lectura asistida, idioma y uso en móvil.
- **Impacto social y local antes que monetización agresiva.** El MVP prioriza utilidad ciudadana, colaboración local y confianza antes de ampliar ingresos, premium o escala.

## Decisiones inamovibles de producto y operación

- El **MVP ciudadano web** es la prioridad antes de ampliar producto.
- Expo móvil, Dashboard PRO, IA matching, premium, chat, pagos, blockchain/token/DAO y Web Push real están fuera de R1.
- Microchip, notas privadas, correo, teléfono, dirección, identificadores internos y ubicación exacta nunca forman parte de una proyección pública por defecto.
- Toda modificación estructural de Supabase se entrega mediante **migración versionada**, con rama, PR y pruebas en entorno seguro.
- No se aplica SQL manual en producción.
- Todo cambio de código o documentación versionada pasa por rama y PR; no se trabaja directamente sobre `main`.
- Las decisiones que cambien alcance, seguridad, privacidad o identidad deben quedar registradas y revisadas antes de implementarse.

## Identidad visual y diseño actualmente detectados

Esta sección describe el sistema existente; no autoriza cambios de UI.

### Tipografía

- La interfaz usa `var(--font-geist-sans)` con fallback `Arial, Helvetica, sans-serif`.
- El layout carga la familia sans de Geist. No se ha detectado una familia display separada como token estable.

### Tema

- Existen modos `light` y `dark`, persistidos con la clave `buscohuella-theme`.
- Hay preferencias de accesibilidad independientes para tamaño de texto, contraste y reducción de movimiento.
- El CSS mantiene tokens semánticos compartidos para primario, acción pública, acento, superficies, texto, bordes, foco, estados, radios, sombras y movimiento.

### Tokens cromáticos oficiales actuales

Los valores siguientes se extraen de `apps/web/src/app/globals.css` y deben tratarse como identidad vigente hasta una decisión explícita:

| Rol | Claro | Oscuro |
| --- | --- | --- |
| Primario | `#047857` | `#34d399` |
| Primario hover/activo | `#065f46` / `#064e3b` | `#6ee7b7` / `#a7f3d0` |
| Acción pública | `#006f61` | `#006f61` |
| Acento | `#c45f0a` | `#fb923c` |
| Fondo | `#ffffff` | `#111513` |
| Superficie | `#f5f6f7` | `#181e1b` |
| Texto principal | `#1c1c1e` | `#f4f7f5` |
| Texto secundario | `#4b5563` | `#c5cec9` |
| Foco | `#047857` | `#6ee7b7` |
| Peligro | `#b91c1c` | `#f87171` |
| Información | `#1d4ed8` | `#60a5fa` |

También existen tokens completos para hover, activo, fondos suaves, foreground, bordes, disabled, overlay, radios, sombras, duraciones y curvas de transición. Deben reutilizarse por rol semántico; no se deben inventar colores equivalentes dentro de componentes.

### Qué no cambiar sin decisión explícita

- La paleta primaria verde, la acción pública teal, el acento naranja y sus estados claro/oscuro.
- La tipografía Geist Sans y sus fallbacks.
- La existencia y semántica de los modos claro/oscuro.
- Los tokens de foco y contraste, que forman parte de accesibilidad además de identidad.
- Los nombres y roles semánticos de los tokens CSS.

Una futura evolución visual debe registrar motivo, impacto en accesibilidad, capturas o pruebas necesarias y aprobación en una decisión o PR revisado.

## Fuente y mantenimiento

La implementación actual es la referencia factual de tokens: `apps/web/src/app/globals.css`, `apps/web/src/app/layout.tsx` y `apps/web/src/features/theme`. Las reglas de seguridad, privacidad, ramas y migraciones se alinean con `AGENTS.md`, el handoff R1 y `docs/r1/`.

Este documento no congela copy, componentes, layout ni una futura marca completa. Congela los principios anteriores y la identidad base mientras no exista una decisión explícita que los revise.
