---
id: INCLUSIVE_DESIGN
title: Diseño inclusivo
version: 1.0.0
status: Proposed
owner: Product, UX, Accessibility & Frontend
last_reviewed: 2026-08-05
depends_on:
  - ACCESSIBILITY_STRATEGY
  - FD-002
---

# Diseño inclusivo

## 1. Propósito

La accesibilidad normativa es el mínimo. El diseño inclusivo busca que
BuscoHuella funcione para personas con diferentes capacidades, experiencia,
dispositivos y contextos de estrés.

## 2. Contexto de emergencia emocional

Perder o encontrar un animal puede provocar:

- ansiedad;
- prisa;
- dificultad para concentrarse;
- errores;
- uso en la calle;
- uso con una sola mano;
- poca batería o conexión.

Los flujos críticos deben reducir carga cognitiva y permitir recuperación.

## 3. Perfiles y situaciones consideradas

- ceguera y baja visión;
- daltonismo;
- sordera;
- movilidad reducida;
- temblores;
- dislexia;
- TDAH;
- dificultades cognitivas;
- personas mayores;
- baja alfabetización digital;
- idioma no dominante;
- uso bajo el sol;
- conexión lenta;
- móvil antiguo;
- una sola mano;
- tecnologías de apoyo.

## 4. Principios

### Reducir decisiones

- una acción principal clara;
- opciones avanzadas progresivas;
- formularios por pasos cuando ayuden;
- valores seguros por defecto;
- no pedir datos que puedan inferirse o añadirse después.

### Prevenir y recuperar errores

- borradores;
- autoguardado cuando proceda;
- conservar campos tras error;
- confirmar acciones destructivas;
- permitir volver atrás;
- explicar cómo corregir.

### Comunicación multimodal

La información importante no dependerá solo de:

- color;
- icono;
- sonido;
- vibración;
- mapa;
- fotografía;
- movimiento.

### Lenguaje claro

- frases directas;
- una idea por bloque;
- términos cotidianos;
- explicar precisión y privacidad;
- evitar jerga administrativa;
- adaptar mensajes profesionales sin confundir al ciudadano.

## 5. Formularios críticos

- progreso comprensible;
- título por paso;
- instrucciones antes de actuar;
- etiquetas visibles;
- ejemplos;
- errores próximos;
- resumen antes de publicar;
- posibilidad de editar;
- foco gestionado;
- anuncio de cambios;
- teclado móvil apropiado.

## 6. Mapas

- alternativa textual completa;
- búsqueda por dirección o lugar;
- posición confirmable sin precisión visual extrema;
- controles grandes;
- zoom accesible;
- no exigir arrastrar;
- descripción del área seleccionada;
- posibilidad de indicar que no se conoce el punto exacto.

## 7. Color y temas

- contraste AA;
- formas y texto además del color;
- tema oscuro no puramente negro;
- estados de riesgo distinguibles;
- foco visible en ambos temas;
- fotografías sin perder legibilidad de controles;
- pruebas de daltonismo.

## 8. Movimiento y atención

- respetar `prefers-reduced-motion`;
- evitar mapas o paneles en movimiento constante;
- no usar temporizadores innecesarios;
- no hacer desaparecer mensajes importantes demasiado pronto;
- evitar animaciones que compitan con acciones urgentes.

## 9. Rendimiento como inclusión

- interfaz útil con conexión lenta;
- skeletons comprensibles;
- reintentos;
- compresión de imágenes;
- carga progresiva;
- no bloquear el flujo por recursos decorativos;
- estados offline futuros para móvil.

## 10. Validación por Feature Pack visible

- teclado;
- foco;
- lector de pantalla básico;
- zoom 200 %;
- viewport estrecho;
- contraste;
- tema oscuro;
- lenguaje claro;
- estrés y errores;
- red lenta;
- objetivos táctiles;
- alternativa a gestos complejos.