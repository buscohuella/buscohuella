# BuscoHuella — Estrategia de i18n y temas

> Preparación técnica y de producto para idiomas y temas visuales.

## 1. Objetivo

Evitar que la aplicación tenga que reescribirse cuando se incorporen:

- español;
- catalán;
- euskera;
- gallego;
- inglés;
- modo claro;
- modo oscuro;
- preferencia del sistema.

## 2. Idiomas previstos

```text
es
ca
eu
gl
en
```

El español será el idioma por defecto y no necesitará necesariamente prefijo `/es`.

La estrategia definitiva de rutas se decidirá antes del despliegue multilingüe.

## 3. Organización futura

Propuesta por dominios:

```text
locales/
├── es/
│   ├── common.json
│   ├── auth.json
│   ├── profile.json
│   ├── pets.json
│   ├── reports.json
│   ├── map.json
│   └── errors.json
├── ca/
├── eu/
├── gl/
└── en/
```

## 4. Reglas desde ahora

- textos claros y completos;
- evitar concatenación;
- evitar textos dentro de lógica compleja;
- contemplar plural;
- contemplar género gramatical cuando sea necesario;
- aceptar crecimiento del texto;
- usar `Intl`;
- no guardar fechas formateadas;
- no guardar traducciones en base de datos salvo contenido editorial;
- separar códigos internos de etiquetas visibles;
- no usar el texto traducido como identificador;
- contemplar metadatos, correos y notificaciones.

## 5. Preferencia de idioma

Futura prioridad:

```text
preferencia del usuario
→ cookie o almacenamiento local
→ cabecera del navegador
→ español por defecto
```

La preferencia podrá guardarse en `profiles` o una tabla de preferencias cuando el modelo se consolide.

## 6. Contenido generado por usuarios

No se traducirá automáticamente por defecto.

Se guardará:

- contenido original;
- idioma detectado o declarado cuando sea útil;
- traducción opcional futura;
- aviso de traducción automática cuando proceda.

## 7. Tema

Valores canónicos:

```text
system
light
dark
```

La interfaz usará tokens semánticos en CSS.

Ejemplo correcto:

```tsx
className="bg-surface text-foreground"
```

Evitar:

```tsx
className="bg-white text-black"
```

cuando el color represente una superficie tematizable.

## 8. Persistencia del tema

Futura prioridad:

```text
preferencia autenticada
→ cookie
→ localStorage
→ sistema operativo
```

Debe evitarse el parpadeo de tema durante la carga.

## 9. Mapas, gráficas e imágenes

El tema oscuro deberá contemplar:

- estilo de mapa;
- marcadores;
- paneles;
- contraste de controles;
- logos;
- fotografías;
- gráficas;
- skeletons;
- estados de peligro.

## 10. Accesibilidad

Tema e idioma deben mantener:

- contraste WCAG 2.2 AA;
- foco visible;
- lenguaje claro;
- dirección y orden comprensibles;
- fechas localizadas;
- mensajes de error útiles;
- compatibilidad con lector de pantalla.

## 11. Momento de implementación

### Ahora

- tokens;
- componentes adaptables;
- textos no bloqueantes;
- documentación;
- uso de `Intl`;
- evitar deuda evidente.

### Antes de acumular muchas pantallas

- elegir librería i18n;
- crear namespaces;
- migrar textos;
- selector de idioma;
- persistencia;
- pruebas.

### Antes de lanzamiento multilingüe

- traducciones profesionales o revisadas;
- SEO;
- `hreflang`;
- correos;
- legales;
- soporte;
- QA lingüístico.

### Modo oscuro

Se implementará como Feature Pack transversal cuando el sistema visual y los principales componentes estén suficientemente consolidados.
