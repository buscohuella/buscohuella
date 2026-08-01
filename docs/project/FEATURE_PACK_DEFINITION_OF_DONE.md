# BuscoHuella — Definition of Done de Feature Packs

> Lista obligatoria para considerar completado un Feature Pack.

## 1. Uso

Cada Feature Pack debe abrirse con criterios de aceptación y cerrarse verificando esta lista.

Estados posibles:

```text
No aplica
Pendiente
Validado
Excepción documentada
```

“No aplica” requiere una razón cuando no sea evidente.

## 2. Producto

- [ ] El problema está definido.
- [ ] El objetivo está definido.
- [ ] El alcance está delimitado.
- [ ] El fuera de alcance está registrado.
- [ ] Los criterios de aceptación están escritos.
- [ ] La funcionalidad aporta valor al MVP o a una dependencia aprobada.
- [ ] No se han introducido funciones futuras accidentalmente.

## 3. Experiencia de usuario

- [ ] Existe un flujo principal claro.
- [ ] Existen estados de carga.
- [ ] Existen estados vacíos.
- [ ] Existen estados de éxito.
- [ ] Existen errores comprensibles.
- [ ] Las acciones peligrosas requieren confirmación cuando procede.
- [ ] La navegación es coherente con la sesión y el contexto.
- [ ] La interfaz no muestra acciones imposibles o irrelevantes.

## 4. Accesibilidad

- [ ] HTML semántico.
- [ ] Encabezados ordenados.
- [ ] Navegación por teclado.
- [ ] Foco visible.
- [ ] Orden de foco lógico.
- [ ] Labels asociados.
- [ ] Botones e iconos con nombre accesible.
- [ ] Errores vinculados al campo.
- [ ] Mensajes dinámicos anunciados.
- [ ] No depende solo del color.
- [ ] Contraste WCAG 2.2 AA.
- [ ] Zoom y reflow comprobados.
- [ ] `prefers-reduced-motion` respetado cuando existe movimiento.
- [ ] Revisión básica con lector de pantalla cuando el flujo lo requiera.

## 5. Responsive

- [ ] Móvil.
- [ ] Tableta.
- [ ] Escritorio.
- [ ] Sin scroll horizontal accidental.
- [ ] Acciones táctiles adecuadas.
- [ ] Navegación coherente en cada breakpoint.
- [ ] Contenido crítico visible.

## 6. Internacionalización

- [ ] Los textos pueden extraerse a traducciones.
- [ ] No existen frases concatenadas problemáticas.
- [ ] Fechas y números usan formato regional.
- [ ] La interfaz tolera textos más largos.
- [ ] No hay texto funcional dentro de imágenes.
- [ ] Se han identificado correos o metadatos traducibles.

## 7. Tema

- [ ] Se usan tokens semánticos.
- [ ] No se añaden colores arbitrarios sin documentar.
- [ ] El componente es compatible con futuro modo oscuro.
- [ ] Estados de foco, error, éxito y desactivado conservan claridad.

## 8. Seguridad

- [ ] Autenticación requerida donde corresponde.
- [ ] Autorización validada en servidor.
- [ ] RLS revisada.
- [ ] Validación de entrada en servidor.
- [ ] No se exponen secretos.
- [ ] No se filtran datos mediante errores.
- [ ] Se han revisado enumeración, spam y abuso.
- [ ] Se aplican límites cuando corresponde.
- [ ] Las redirecciones son seguras.

## 9. Privacidad

- [ ] Solo se recogen datos necesarios.
- [ ] Está definido quién ve cada dato.
- [ ] Privacidad por defecto.
- [ ] No se muestra ubicación exacta innecesaria.
- [ ] No se expone contacto privado.
- [ ] La información pública está separada de la privada.
- [ ] Se ha documentado conservación cuando procede.

## 10. Datos y backend

- [ ] Migración versionada.
- [ ] Migración aplicada y comprobada.
- [ ] Restricciones de base de datos.
- [ ] Índices necesarios.
- [ ] Triggers documentados.
- [ ] RLS y políticas.
- [ ] Datos existentes regularizados.
- [ ] Modelo compatible con evolución futura.
- [ ] No existe divergencia entre Supabase y Git.

## 11. Código

- [ ] Tipado estricto.
- [ ] Componentes reutilizables.
- [ ] Sin duplicación innecesaria.
- [ ] Arquitectura por dominio respetada.
- [ ] Server/Client Components utilizados con intención.
- [ ] Nombres claros.
- [ ] Sin secretos ni archivos generados.
- [ ] Sin errores conocidos ocultos.

## 12. Rendimiento

- [ ] Consultas necesarias únicamente.
- [ ] Sin cargas duplicadas evidentes.
- [ ] Imágenes optimizadas cuando aplica.
- [ ] JavaScript cliente limitado.
- [ ] Flujo usable con conexión lenta.
- [ ] No existe bloqueo visible innecesario.

## 13. Validación

- [ ] `lint` correcto.
- [ ] `build` correcto.
- [ ] Tests automatizados correctos cuando existen.
- [ ] Flujo manual principal.
- [ ] Flujo manual de error.
- [ ] Sesión e incógnito cuando aplica.
- [ ] Permisos entre usuarios cuando aplica.
- [ ] Persistencia tras recarga.
- [ ] Regresión de funcionalidades relacionadas.

## 14. Documentación

- [ ] Documentación técnica actualizada.
- [ ] Roadmap actualizado si cambia alcance.
- [ ] Documento Maestro actualizado si cambia la fuente única de verdad.
- [ ] ADR creado si existe decisión arquitectónica relevante.
- [ ] Riesgos y pendientes registrados.
- [ ] Notion actualizado.
- [ ] Commits enlazados o registrados.

## 15. Entrega

- [ ] `git status` revisado.
- [ ] `git diff` revisado.
- [ ] Commit coherente.
- [ ] Push realizado.
- [ ] Rama sincronizada.
- [ ] Working tree limpio.
- [ ] Siguiente Feature Pack definido.

## 16. Regla de cierre

Un Feature Pack no se marca como completado únicamente porque:

- compile;
- se vea bien;
- funcione en el caso feliz;
- esté desplegado;
- el fundador lo haya probado una vez.

Debe cumplir esta Definition of Done o registrar explícitamente las excepciones.
