# BuscoHuella — Estrategia de accesibilidad

> Estrategia transversal para construir una plataforma inclusiva conforme a WCAG 2.2 AA.

## 1. Visión

BuscoHuella es una plataforma comunitaria y de utilidad pública. La accesibilidad forma parte de su misión, no de una fase de pulido.

El objetivo es que una persona pueda:

- consultar reportes;
- escanear un QR;
- comunicar un avistamiento;
- registrar una mascota;
- gestionar su cuenta;
- recibir alertas;
- colaborar con una búsqueda;

independientemente de que utilice pantalla, teclado, lector de pantalla, ampliación, voz u otra tecnología de apoyo.

## 2. Estándar

Objetivo mínimo:

```text
WCAG 2.2 AA
```

Referencias complementarias:

- HTML semántico;
- WAI-ARIA cuando HTML no sea suficiente;
- buenas prácticas de accesibilidad móvil;
- EN 301 549 cuando resulte aplicable;
- legislación europea y española vigente en cada lanzamiento.

## 3. Principios

### Perceptible

- alternativas textuales;
- contraste;
- zoom;
- reflow;
- subtítulos y transcripciones futuras;
- no depender únicamente del color.

### Operable

- teclado;
- foco visible;
- objetivos táctiles;
- tiempo suficiente;
- reducción de movimiento;
- evitar contenido que provoque convulsiones.

### Comprensible

- lenguaje claro;
- navegación consistente;
- errores específicos;
- instrucciones;
- confirmaciones;
- prevención de errores.

### Robusto

- semántica;
- estados accesibles;
- compatibilidad con tecnologías de apoyo;
- validación de componentes.

## 4. Componentes

Todo componente compartido debe definir:

- elemento semántico;
- nombre accesible;
- estados;
- teclado;
- foco;
- mensajes;
- contraste;
- comportamiento con zoom;
- reducción de movimiento.

Un componente inaccesible reutilizado multiplica el problema. Por eso la accesibilidad se valida primero en `components/ui`.

## 5. Formularios

Reglas:

- `label` visible;
- `id` estable;
- instrucciones antes del error;
- `aria-invalid`;
- `aria-describedby`;
- errores próximos al campo;
- resumen general cuando sea útil;
- conservar datos tras error;
- no usar placeholder como etiqueta;
- autocompletado apropiado;
- validación comprensible;
- no bloquear pegado de contraseñas;
- indicar requisitos antes del envío.

## 6. Navegación

- landmark `nav`;
- `main` único;
- títulos de página;
- jerarquía de encabezados;
- skip link futuro;
- estado activo identificable;
- navegación consistente según sesión;
- foco gestionado en modales y cambios críticos;
- rutas públicas utilizables sin cuenta cuando la urgencia lo requiera.

## 7. Mapas

El mapa nunca puede ser el único medio para consultar información.

Debe existir alternativa mediante:

- listado;
- búsqueda;
- filtros;
- fichas textuales;
- orden por distancia cuando sea posible;
- acciones accesibles fuera de marcadores;
- descripciones de ubicación;
- navegación por teclado de controles.

## 8. Imágenes y mascotas

- texto alternativo útil;
- posibilidad de indicar descripción visual;
- no depender únicamente de fotografías para identificar;
- permitir zoom;
- controlar recortes;
- contemplar baja visión;
- evitar texto incrustado.

## 9. Alertas y urgencias

- lenguaje directo;
- prioridad semántica;
- no depender de animación;
- no depender de sonido;
- no depender de rojo;
- ofrecer descripción textual;
- evitar parpadeos;
- permitir cerrar avisos no críticos;
- mantener accesibles los avisos críticos.

## 10. Movimiento

- respetar `prefers-reduced-motion`;
- evitar animaciones automáticas permanentes;
- permitir detener contenido;
- usar movimiento solo para feedback o continuidad;
- no ocultar información esencial durante transiciones.

## 11. Pruebas

Por Feature Pack:

- teclado;
- foco;
- zoom 200 %;
- viewport estrecho;
- contraste;
- lector de pantalla básico;
- errores;
- carga;
- estados vacíos.

Pruebas periódicas:

- axe o herramienta equivalente;
- Lighthouse como señal, no como garantía;
- NVDA + Firefox/Chrome en Windows;
- VoiceOver en iOS/macOS cuando esté disponible;
- TalkBack en Android cuando exista app móvil;
- pruebas con usuarios reales.

## 12. Investigación con usuarios

Las encuestas y pruebas deben incluir, cuando sea posible:

- personas mayores;
- personas con discapacidad visual;
- personas con movilidad reducida;
- personas con dificultades cognitivas;
- personas con baja alfabetización digital;
- profesionales y voluntariado bajo presión.

## 13. Declaración de accesibilidad

Antes del lanzamiento público estable se preparará:

- declaración de accesibilidad;
- canal para reportar barreras;
- proceso de respuesta;
- registro de incidencias;
- roadmap de correcciones;
- fecha de revisión.

## 14. Responsabilidad

Cada persona o agente que diseñe, programe o documente una funcionalidad es responsable de aplicar esta estrategia.

La accesibilidad no pertenece únicamente a diseño o QA.
