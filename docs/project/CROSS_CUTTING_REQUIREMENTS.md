# BuscoHuella — Requisitos transversales

> Reglas obligatorias aplicables a todo el producto, independientemente del Feature Pack, plataforma o fase.

## 1. Propósito

BuscoHuella debe crecer sin convertir accesibilidad, privacidad, seguridad, idiomas, temas, responsive o calidad en tareas tardías.

Estos requisitos forman parte de los cimientos del proyecto y se aplican a:

- web pública;
- aplicación web;
- futura aplicación móvil;
- backend;
- base de datos;
- correos;
- documentos;
- paneles de organizaciones;
- integraciones;
- funcionalidades futuras.

No son mejoras opcionales ni tareas de pulido final.

## 2. Principio general

```text
Cada funcionalidad nueva
→ debe diseñarse, implementarse, probarse y documentarse
→ considerando todos los requisitos transversales aplicables.
```

Un Feature Pack no puede considerarse terminado si funciona técnicamente pero excluye usuarios, expone datos, rompe responsive, depende de textos rígidos o introduce deuda visual evitable.

## 3. Accesibilidad

Objetivo mínimo:

```text
WCAG 2.2 nivel AA
```

Cada interfaz debe contemplar:

- HTML semántico;
- navegación completa por teclado;
- orden lógico de foco;
- foco visible;
- etiquetas asociadas a controles;
- nombres accesibles para iconos y botones;
- mensajes anunciados mediante `aria-live` cuando proceda;
- errores vinculados mediante `aria-describedby`;
- contraste suficiente;
- contenido comprensible sin depender únicamente del color;
- objetivos táctiles adecuados;
- zoom hasta 200 % sin pérdida funcional;
- reflow y adaptación a pantallas estrechas;
- reducción de movimiento;
- estados de carga, error, vacío y éxito accesibles;
- compatibilidad razonable con lectores de pantalla;
- lenguaje claro y comprensible.

### Personas consideradas

- personas ciegas;
- personas con baja visión;
- personas con daltonismo;
- personas con movilidad reducida;
- personas con dificultades cognitivas;
- personas sordas cuando exista contenido audiovisual;
- personas que usan teclado, lector de pantalla, voz o dispositivos adaptados;
- personas con conexiones lentas o dispositivos modestos.

No se creará una “versión accesible” separada. La experiencia principal debe ser accesible.

## 4. Internacionalización

Idiomas previstos:

```text
es — español, idioma por defecto
ca — catalán
eu — euskera
gl — gallego
en — inglés
```

Reglas:

- evitar textos de interfaz difíciles de extraer;
- centralizar mensajes cuando se introduzca la capa i18n;
- no concatenar frases traducibles;
- contemplar pluralización;
- contemplar textos más largos;
- usar formatos regionales para fecha, hora y números;
- preparar mensajes de validación, metadatos y correos;
- separar contenido editorial de etiquetas funcionales;
- no asumir que el orden de palabras será igual en todos los idiomas;
- no usar texto incrustado en imágenes.

La arquitectura i18n deberá introducirse antes de que el número de pantallas haga costosa la migración.

## 5. Tema claro y oscuro

Preferencias previstas:

```text
system
light
dark
```

Reglas:

- utilizar tokens semánticos;
- evitar colores directos en componentes;
- validar contraste en ambos temas;
- no usar blanco o negro absolutos sin token cuando afecte a tematización;
- adaptar bordes, superficies, sombras, mapas, gráficas e imágenes;
- respetar preferencia del sistema;
- evitar destellos durante la carga;
- guardar la preferencia del usuario cuando exista configuración;
- mantener estados de foco, error, éxito y desactivado claramente distinguibles.

La implementación completa del modo oscuro puede hacerse por fases, pero cada componente nuevo debe ser compatible con tokens.

## 6. Responsive y dispositivos

Principio:

```text
mobile-first
```

Cada funcionalidad debe validarse en:

- móvil estrecho;
- móvil grande;
- tableta;
- escritorio;
- zoom;
- orientación vertical y horizontal cuando sea relevante.

Reglas:

- evitar anchos fijos innecesarios;
- evitar scroll horizontal accidental;
- adaptar navegación y acciones;
- mantener objetivos táctiles;
- priorizar contenido esencial;
- no ocultar funciones críticas únicamente por tamaño;
- considerar uso con una sola mano;
- considerar áreas seguras en móvil.

## 7. Seguridad

Cada Feature Pack debe definir:

- quién puede leer;
- quién puede crear;
- quién puede modificar;
- quién puede eliminar;
- qué validación existe en servidor;
- qué límites o protección antifraude necesita;
- qué datos aparecen en URL, logs o analítica;
- qué secretos utiliza;
- qué eventos deben auditarse.

Reglas:

- no confiar únicamente en la interfaz;
- aplicar RLS cuando corresponda;
- validar en servidor;
- evitar enumeración;
- evitar IDs secuenciales públicos;
- no exponer secretos;
- minimizar permisos;
- separar roles editables de permisos privilegiados;
- registrar migraciones;
- considerar abuso y automatización.

## 8. Privacidad y protección de datos

Principios:

- privacidad por defecto;
- minimización de datos;
- propósito explícito;
- consentimiento cuando corresponda;
- control del usuario;
- separación entre datos privados y públicos;
- conservación limitada;
- exportación y eliminación futura;
- no mostrar ubicación exacta sin necesidad;
- no exponer contacto personal como requisito para colaborar.

Cada campo nuevo debe responder:

```text
¿Por qué se necesita?
¿Quién puede verlo?
¿Durante cuánto tiempo?
¿Puede el usuario ocultarlo o eliminarlo?
¿Es necesario para el MVP?
```

## 9. Estados de interfaz

Toda funcionalidad con datos debe contemplar:

- estado inicial;
- carga;
- vacío;
- éxito;
- error recuperable;
- error no recuperable;
- permisos insuficientes;
- conexión lenta o interrumpida;
- datos parciales;
- acción en progreso;
- acción desactivada;
- confirmación cuando exista riesgo.

Los mensajes deben explicar qué ocurrió y qué puede hacer el usuario.

## 10. Rendimiento

Reglas:

- evitar dependencias innecesarias;
- optimizar imágenes;
- paginar o cargar progresivamente;
- reducir JavaScript cliente;
- usar Server Components cuando tenga sentido;
- no bloquear la interfaz;
- contemplar redes móviles;
- evitar consultas duplicadas;
- medir antes de optimizar de forma compleja.

## 11. Calidad y pruebas

Validación mínima web:

```powershell
pnpm --filter @buscohuella/web lint
pnpm --filter @buscohuella/web build
```

Validación manual aplicable:

- flujo principal;
- errores;
- teclado;
- foco;
- lector de pantalla básico;
- contraste;
- responsive;
- zoom;
- sesión;
- permisos;
- RLS;
- privacidad;
- persistencia;
- idioma futuro;
- tema futuro;
- incógnito cuando exista contenido público.

Cuando existan pruebas automatizadas, deberán cubrir reglas de negocio, permisos y regresiones críticas.

## 12. Documentación y trazabilidad

Cada cambio debe identificar:

- documento técnico afectado;
- documento de producto afectado;
- migraciones;
- decisión arquitectónica;
- riesgos;
- tareas futuras;
- actualización de Notion;
- commit o release correspondiente.

GitHub es la fuente técnica de verdad.

Notion es la fuente operativa de verdad.

## 13. Aplicación por fases

No todos los requisitos implican implementar toda la funcionalidad desde el primer día.

Ejemplo:

```text
Modo oscuro
→ no necesariamente completo hoy
→ sí componentes compatibles con tokens desde hoy

Idiomas
→ no necesariamente cinco traducciones hoy
→ sí arquitectura que no bloquee i18n

Insignias
→ no implementadas en MVP
→ sí modelo de perfil ampliable

Accesibilidad
→ sí obligatoria desde el primer componente
```

## 14. Excepciones

Una excepción debe:

- estar justificada;
- documentarse;
- indicar impacto;
- indicar solución futura;
- tener responsable o Feature Pack previsto;
- no afectar funciones críticas sin revisión.

## 15. Decisión canónica

Estos requisitos son parte de la definición de calidad de BuscoHuella.

No se consideran “mejoras futuras”:

- accesibilidad;
- seguridad;
- privacidad;
- responsive;
- preparación razonable para idiomas;
- compatibilidad con temas;
- claridad de estados;
- documentación.

Se aplican desde ahora a todo Feature Pack.
