# Bitácora de desarrollo

Registro breve y verificable de los bloques de trabajo del proyecto BuscoHuella.
GitHub conserva el detalle técnico; Notion conserva el seguimiento operativo.

## 2026-09-03 — Legal interno y coherencia visual

### Completado

- Se incorporaron las páginas internas de privacidad, términos y cookies para la aplicación web.
- Se corrigió la carga de traducciones legales y se cubrieron español y catalán.
- Se mejoró la navegación legal con pestañas, índice lateral responsive, numeración e iconos contextuales.
- Se añadieron resúmenes por documento, tarjetas de lectura rápida y acción de imprimir/PDF.
- Se ajustó el contraste de la pestaña legal activa para mantener legibilidad y accesibilidad.
- Se aplicó el wordmark de BuscoHuella con `Busco` en verde y `Huella` en naranja.
- El selector de idioma muestra bandera y abreviatura (`ES`/`CA`), manteniendo el nombre completo dentro del selector.
- Se mantienen los enlaces legales internos desde la aplicación y el enlace de copyright hacia la web pública.

### Criterios transversales

- Diseño responsive para escritorio y móvil.
- Textos preparados para internacionalización.
- Contraste y foco revisados según el objetivo WCAG 2.2 AA.
- Las páginas legales indican que su contenido queda pendiente de revisión jurídica final.
- No se han añadido servicios de analítica, cookies no esenciales ni proveedores que no estén implementados en la aplicación.

### Referencias

- Últimos commits: `0eaa3a5`, `08cfac8`, `8363bab`, `b583758`, `d0a27e5`, `048c484`.
- Repositorio: https://github.com/buscohuella/buscohuella

### Siguiente bloque

- Revisar el contenido jurídico definitivo antes del lanzamiento público.
- Completar la auditoría transversal de responsive, accesibilidad, i18n, SEO/Open Graph, seguridad y pruebas manuales.
- Mantener sincronizados este registro, el historial Git y la página operativa de Notion.

## 2026-09-03 — Revisión desde móvil

- Se añadió la flecha de volver arriba también al `AppShell` privado y se hizo visible antes en páginas largas.
- Se respetó el área segura inferior del móvil y la reducción de movimiento.
- Se generalizaron las transiciones de color, borde, sombra y transformación para que los estados interactivos sean suaves.
- Se reforzaron los estados hover y focus del índice legal, incluida la animación de sus indicadores.
- El mapa mantiene un mensaje recuperable cuando no está disponible y permite continuar usando el listado.

### Bloqueo de entorno

- El acceso al mapa requiere configurar `NEXT_PUBLIC_MAPBOX_TOKEN` en el entorno local.
- Para probar desde la IP LAN, el token público de desarrollo debe permitir ese origen o no tener una restricción incompatible con la red local.
- No se versionan tokens ni credenciales.

### Referencia técnica

- Commit: `e7ba749` — correcciones de mapa, scroll y estados interactivos.
