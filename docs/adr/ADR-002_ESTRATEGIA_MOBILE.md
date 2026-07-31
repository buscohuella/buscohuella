# ADR-002 — Estrategia Mobile

## BuscoHuella MVP

**Estado:** Aceptado  
**Fecha:** 31 de julio de 2026  
**Decisor:** Xavier Quesada Sevillano — Fundador / Product Owner  
**Ámbito:** Estrategia de producto y arquitectura móvil  
**Revisión prevista:** Después de validar el MVP web y el piloto inicial en Sabadell  

---

## 1. Contexto

BuscoHuella está diseñado para utilizarse principalmente desde dispositivos móviles.

Los casos de uso principales ocurren fuera de casa:

- publicar una mascota perdida;
- comunicar un hallazgo;
- consultar reportes cercanos;
- añadir un avistamiento;
- tomar y subir fotografías;
- utilizar geolocalización;
- recibir alertas;
- actualizar un caso durante una búsqueda.

A pesar de este contexto móvil, el proyecto se encuentra en fase **Pre-MVP**, con un equipo reducido y necesidad de validar primero el producto.

La decisión debe equilibrar:

- experiencia móvil;
- velocidad de lanzamiento;
- coste;
- complejidad;
- mantenimiento;
- acceso sin instalación;
- capacidad de iteración;
- evolución futura hacia aplicaciones nativas.

---

## 2. Problema

La pregunta principal es:

> ¿Debe BuscoHuella desarrollar desde el inicio una aplicación móvil nativa o comenzar con una aplicación web optimizada para móvil y posponer la aplicación nativa?

---

## 3. Restricciones

| Factor | Situación |
|---|---|
| Equipo | Un desarrollador principal |
| Estado | Pre-MVP |
| Presupuesto | Limitado |
| Prioridad | Validar producto |
| Piloto | Sabadell |
| Usuarios objetivo | Principalmente móviles |
| Tiempo | Reducido |
| Tiendas móviles | Añaden procesos y mantenimiento |
| Backend | Supabase compartido |
| Web pública | Necesaria para difusión y SEO |
| App nativa | Deseable, pero no imprescindible para validar |

---

## 4. Criterios de decisión

La estrategia debe evaluarse según:

- tiempo hasta el lanzamiento;
- coste;
- capacidad de validar;
- experiencia móvil;
- instalación;
- distribución;
- SEO;
- enlaces compartibles;
- cámara;
- geolocalización;
- notificaciones;
- mantenimiento;
- reutilización;
- riesgo técnico;
- evolución futura.

---

## 5. Alternativas consideradas

### 5.1 Aplicación móvil nativa desde el inicio

Opciones posibles:

- React Native;
- Expo React Native;
- Flutter;
- desarrollo nativo separado para iOS y Android.

#### Ventajas

- experiencia móvil más integrada;
- acceso amplio a capacidades del dispositivo;
- notificaciones push;
- presencia en tiendas;
- mejor experiencia en campo;
- posibilidad de uso offline avanzado.

#### Inconvenientes

- mayor tiempo de desarrollo;
- mantenimiento adicional;
- publicación en tiendas;
- revisión de Apple y Google;
- certificados;
- builds;
- actualizaciones;
- soporte de dos plataformas;
- menor velocidad para validar;
- riesgo de duplicar trabajo con la web.

#### Resultado

Descartado para la primera entrega del MVP.

---

### 5.2 Aplicación web responsive

#### Ventajas

- desarrollo más rápido;
- acceso mediante URL;
- sin instalación;
- despliegue inmediato;
- actualizaciones instantáneas;
- SEO;
- enlaces compartibles;
- un único cliente inicial;
- menor coste;
- validación más rápida.

#### Inconvenientes

- menor integración con el sistema operativo;
- notificaciones con limitaciones;
- experiencia offline limitada;
- cámara y geolocalización dependen del navegador;
- menor presencia en tiendas.

#### Resultado

Seleccionado como base del MVP.

---

### 5.3 PWA completa desde el inicio

#### Ventajas

- instalable;
- experiencia similar a app;
- soporte offline;
- icono en pantalla;
- algunas notificaciones;
- un único código web.

#### Inconvenientes

- soporte desigual entre plataformas;
- limitaciones en iOS;
- mayor complejidad;
- service workers;
- caché;
- estados difíciles de depurar;
- riesgo de invertir antes de validar.

#### Resultado

No se establece como requisito obligatorio inicial.

La web podrá evolucionar progresivamente hacia capacidades PWA cuando exista una necesidad validada.

---

### 5.4 Web y aplicación móvil en paralelo

#### Ventajas

- disponibilidad simultánea;
- experiencia nativa;
- mayor cobertura.

#### Inconvenientes

- duplicación de trabajo;
- más errores;
- más coordinación;
- mayor coste;
- menor foco;
- riesgo de retrasar el MVP;
- mantenimiento de dos clientes antes de validar.

#### Resultado

Descartado.

---

## 6. Decisión

BuscoHuella adoptará una estrategia **web-first y mobile-first en diseño**.

Esto significa:

- la primera aplicación funcional será web;
- la interfaz se diseñará prioritariamente para móvil;
- la web será responsive;
- la aplicación podrá utilizarse sin instalación;
- la arquitectura preparará la futura app móvil;
- Expo React Native se utilizará en una fase posterior;
- web y móvil compartirán backend, tipos y reglas cuando sea posible.

---

## 7. Distinción importante

### Web-first

La primera implementación será una aplicación web.

### Mobile-first

El diseño, la usabilidad y los flujos priorizarán smartphones.

Ambos conceptos no son contradictorios.

---

## 8. Tecnología móvil futura

La aplicación móvil se desarrollará con:

```text
Expo
React Native
TypeScript
Expo Router
```

Motivos:

- desarrollo multiplataforma;
- TypeScript;
- ecosistema React;
- integración con Supabase;
- acceso a cámara;
- geolocalización;
- notificaciones;
- builds gestionados;
- menor coste que dos aplicaciones nativas separadas.

---

## 9. Relación entre web y móvil

Ambas aplicaciones compartirán:

- Supabase;
- modelo de datos;
- autenticación;
- Storage;
- reglas de seguridad;
- políticas RLS;
- tipos;
- constantes;
- validaciones;
- lógica de dominio reutilizable.

No se compartirá automáticamente:

- toda la UI;
- navegación;
- componentes visuales;
- interacciones específicas;
- lógica dependiente de plataforma.

---

## 10. Estructura prevista

```text
apps/
├── web/
└── mobile/

packages/
├── shared-types/
├── shared-utils/
└── constants/
```

La aplicación móvil no debe duplicar modelos o reglas existentes sin justificación.

---

## 11. Funcionalidades del MVP web

La web inicial debe permitir desde móvil:

- registro;
- login;
- perfil;
- mascotas;
- reportes;
- mapa;
- filtros;
- avistamientos;
- fotografías;
- ubicación;
- notificaciones web;
- resolución de casos.

---

## 12. Capacidades móviles futuras

La aplicación móvil podrá mejorar:

- notificaciones push;
- geolocalización;
- cámara;
- subida de fotografías;
- uso en campo;
- deep links;
- experiencia offline;
- rendimiento;
- interacción con el sistema operativo.

Estas ventajas no justifican retrasar la validación inicial.

---

## 13. PWA

La aplicación web podrá adoptar progresivamente:

- manifest;
- instalación;
- iconos;
- splash;
- service worker;
- caché;
- notificaciones;
- comportamiento offline limitado.

No se considerará obligatorio implementar todas las capacidades PWA en la primera versión.

Toda capacidad PWA debe responder a una necesidad real.

---

## 14. Accesibilidad móvil

La interfaz debe cumplir:

```text
WCAG 2.2 nivel AA
```

Requisitos:

- objetivos táctiles adecuados;
- navegación clara;
- foco visible;
- formularios simples;
- teclado correcto;
- contraste;
- lectores de pantalla;
- mensajes comprensibles;
- reducción de movimiento;
- alternativas al mapa.

---

## 15. Rendimiento móvil

La web debe priorizar:

- carga inicial ligera;
- imágenes optimizadas;
- componentes diferidos;
- consultas eficientes;
- mapas bajo demanda;
- uso controlado de JavaScript;
- estados de carga;
- conexiones lentas;
- ahorro de datos.

---

## 16. Geolocalización

La web podrá solicitar ubicación cuando sea necesaria.

Reglas:

- explicar el motivo;
- solicitar consentimiento;
- permitir uso sin ubicación exacta cuando sea posible;
- limitar precisión;
- proteger domicilios;
- no almacenar ubicaciones innecesarias;
- gestionar denegación y errores.

---

## 17. Cámara y fotografías

La web debe permitir:

- seleccionar fotografías;
- usar cámara cuando el navegador lo permita;
- previsualizar;
- validar formato;
- validar tamaño;
- eliminar antes de enviar;
- comprimir cuando proceda.

La aplicación móvil podrá mejorar este flujo posteriormente.

---

## 18. Notificaciones

### MVP web

- notificaciones web cuando sean viables;
- email para casos necesarios;
- avisos dentro de la aplicación.

### Aplicación móvil futura

- push nativo;
- control por categorías;
- deep links;
- mejor gestión en segundo plano.

---

## 19. Offline

El MVP no requiere funcionamiento offline completo.

Puede contemplarse:

- caché básica;
- borradores locales;
- reintentos;
- estados pendientes;
- mensajes de conexión.

La sincronización offline avanzada queda fuera del MVP inicial.

---

## 20. Distribución

### Web

```text
URL pública
Vercel
Sin revisión de tienda
Actualización inmediata
```

### Móvil futuro

```text
Google Play
Apple App Store
Expo Application Services
```

La publicación en tiendas se realizará cuando el producto esté validado y exista una propuesta móvil suficiente.

---

## 21. Consecuencias positivas

### 21.1 Menor tiempo de lanzamiento

Se implementa un solo cliente inicial.

### 21.2 Menor coste

No se mantienen dos aplicaciones antes de validar.

### 21.3 Mayor accesibilidad inicial

Cualquier persona puede acceder mediante un enlace.

### 21.4 Difusión

Los reportes públicos pueden compartirse.

### 21.5 SEO

Las páginas públicas pueden indexarse.

### 21.6 Actualización rápida

Las mejoras se publican sin esperar revisiones de tiendas.

---

## 22. Consecuencias negativas

### 22.1 Menor integración nativa

Algunas capacidades estarán limitadas.

### 22.2 Notificaciones

El soporte web puede variar.

### 22.3 Offline

La experiencia será inferior a una app nativa.

### 22.4 Percepción

Algunos usuarios pueden preferir una app en tienda.

### 22.5 Trabajo futuro

Será necesario desarrollar posteriormente la app móvil.

---

## 23. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---:|---:|---|
| Experiencia móvil deficiente | Media | Alta | Diseño mobile-first |
| Rendimiento de mapa | Media | Alta | Carga diferida y optimización |
| Limitaciones de notificaciones | Media | Media | Email e in-app |
| Usuarios exigen app | Media | Media | Validar demanda |
| Duplicación futura | Media | Media | Paquetes compartidos |
| PWA sobredimensionada | Media | Media | Implementación progresiva |
| Acceso limitado a dispositivo | Baja/Media | Media | App futura |

---

## 24. Condiciones para iniciar la app móvil

Se considerará iniciar `apps/mobile` cuando se cumplan varias de estas condiciones:

- MVP web operativo;
- pilotos reales;
- usuarios activos;
- casos documentados;
- demanda móvil demostrable;
- necesidad clara de push;
- necesidad de experiencia offline;
- necesidad de cámara más integrada;
- recursos suficientes;
- backend estable;
- flujos principales validados.

---

## 25. Criterios de revisión

Esta decisión se revisará si:

- la web no permite un flujo crítico;
- existe demanda clara de aplicación nativa;
- las notificaciones web son insuficientes;
- el uso en campo exige capacidades nativas;
- el piloto demuestra alta recurrencia;
- existen recursos para mantener dos clientes;
- una alianza requiere distribución en tiendas.

---

## 26. Decisiones descartadas

No se desarrollará inicialmente:

- Swift nativo;
- Kotlin nativo;
- Flutter;
- dos aplicaciones separadas;
- app móvil antes de la web;
- offline avanzado;
- PWA completa como requisito de lanzamiento.

---

## 27. Impacto en el repositorio

La estructura reservará:

```text
apps/mobile/
```

pero no debe contener una implementación prematura.

La lógica compartida se preparará en:

```text
packages/shared-types/
packages/shared-utils/
packages/constants/
```

No se crearán abstracciones móviles sin uso real.

---

## 28. Documentación relacionada

```text
docs/master/DOCUMENTO_MAESTRO.md
docs/adr/ADR-001_STACK_TECNOLOGICO.md
docs/adr/ADR-004_FRONTEND_WEB.md
docs/mobile/
docs/architecture/ARCHITECTURE.md
docs/technical/TECHNOLOGY_STACK.md
AGENTS.md
```

---

## 29. Estado de la decisión

**Aceptado.**

BuscoHuella comenzará con una aplicación web responsive, diseñada mobile-first. La aplicación nativa con Expo React Native se desarrollará después de validar el MVP web.

---

## 30. Regla final

> Diseñar primero para móviles no obliga a desarrollar primero una aplicación nativa.
