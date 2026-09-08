# Estrategia de pruebas R1

Estado: plan. Las pruebas propuestas no han sido ejecutadas por crear este documento.

## Resultado de preparación R1.0

Validación local del 8 de septiembre de 2026 sobre código base ce304aa, con cambios solo documentales y eliminación de la ayuda accidental de less:

| Comprobación | Resultado |
| --- | --- |
| Node 22.12.0 / pnpm 10.32.1; install --frozen-lockfile | Correcto; lockfile sin cambios |
| pnpm lint | Correcto |
| Build de los cuatro paquetes internos | Correcto |
| pnpm typecheck | Correcto |
| pnpm test | Correcto; suites existentes de paquetes |
| pnpm build | Correcto; web con placeholders Supabase equivalentes a CI |
| Siete Markdown, enlaces relativos y git diff --check | Correcto |
| RLS/anon/A-B/Storage/RPC live, E2E y accesibilidad | Pendientes; no ejecutados en R1.0 |

En Windows se usó pnpm.cmd porque el shim PowerShell falla al cargar módulos del entorno. pnpm informó de scripts de instalación omitidos para sharp/unrs-resolver; no se habilitaron ni cambió configuración, y el build terminó correctamente. CI remoto se consulta en el PR: estos resultados son locales.

## Base disponible

`package.json` expone `pnpm lint`, `pnpm typecheck`, `pnpm test` y `pnpm build`. CI instala con lockfile, ejecuta lint, construye los cuatro paquetes internos, typecheck, tests y build web. Hay tests Node en paquetes de dominio/datos; apps/web no declara script test propio.

Usar Node 22.12.0 y pnpm 10.32.1 según la configuración versionada. Una ejecución verde con placeholders de Supabase verifica compilación, no conectividad ni RLS live.

## Entorno y fixtures

Usar local/staging con migraciones versionadas, usuarios sintéticos A/B y sesión anon independiente. No ejecutar pruebas destructivas ni SQL manual en producción. Configurar datos de mascotas, reportes en cada estado, perfiles públicos/privados y fotos en los buckets relevantes. Separar preparación privilegiada de las peticiones que se prueban: estas deben utilizar el rol real, nunca service role.

Registrar commit, entorno, versiones, comandos, resultados y limitaciones. No incluir credenciales, tokens ni datos personales en logs de CI, capturas o artefactos.

## Matriz mínima de seguridad

| Actor/superficie | Caso permitido | Caso denegado |
| --- | --- | --- |
| anon/reportes | Lista/detalle público activo según contrato | Privados, borradores, no publicados, ubicación exacta, microchip y notas |
| anon/perfiles | Perfil público y campos permitidos | Perfil oculto, campos privados y visibilidad desactivada |
| anon/RPC | Allowlist explícita de lectura pública | Helpers/triggers/RPC privadas, firmas alternativas y grants PUBLIC heredados |
| A/B/tablas | A gestiona lo propio | A lee/actualiza/borra datos privados B o reasigna ownership |
| A/B/notificaciones | Destinatario lee/marca las propias | Acceso o mutación sobre notificación ajena |
| Storage | Propietario sube/gestiona; público lee solo lo autorizado | Enumeración, rutas manipuladas, escritura cruzada, objetos privados |
| Fotos/reportes | URLs firmadas según contrato | Acceso a reportes no públicos y firmas generadas sin autorización |

Comprobar HTTP/respuesta/datos resultantes además de grants estáticos. Revocar EXECUTE de un helper no debe romper lectura legítima de fotografías mediante policies.

## Integridad y borrado

- Reporte/mascota con 0, 1 y varias fotos; sightings propios y ajenos; segundo intento.
- Fallos de Storage y DB: error visible, metadatos recuperables y post-check de residuos.
- Borrado solo en estado permitido y por propietario; usuario B no puede borrar.
- Publicar/pausar/reactivar/resolver/cerrar/archivar produce un único evento por cambio; no-op produce cero.
- Notificaciones no duplicadas al repetir una acción o procesar el mismo evento.
- Cuenta: dependencias, aportaciones a terceros, avatar y otros objetos; sesiones/tokens antiguos y reintentos según decisión de producto.
- FOUND_ANIMAL: no marcar cubierto hasta decidir su alcance; si se habilita, validar foto obligatoria también en servidor.

## E2E y calidad de interfaz

Recorrido mínimo: registro/login/recovery → perfil → mascota/foto → reporte perdido → publicar → mapa/lista/detalle público → avistamiento B → revisión A → notificación B → resolver. Añadir carga/vacío/error, sesión expirada y navegación móvil.

SEO: inspeccionar HTML servido, redirects y canonical de /avisos frente a /reportes; noindex privado/auth/recovery; robots/sitemap; metadata e imágenes OG; alternates solo para URLs lingüísticas reales, sin inventarlas.

i18n: comparar claves anidadas ES/CA e interpolaciones; fallar ante faltantes/sobrantes; smoke de ambos idiomas. Accesibilidad: teclado, foco visible, lector de pantalla, labels/errores, contraste, alt y alternativa operable al mapa. Combinar revisión automática y manual.

## Validación del PR documental

Comprobar exactamente los siete Markdown, enlaces internos, formato y diff; verificar que no cambian código, configuración, migraciones ni Maestro. Ejecutar las validaciones disponibles y registrar cualquier fallo de entorno o de la base, sin arreglos ajenos al PR. La limpieza de less debe quedar en commit separado.

## Criterio de cierre

Un issue técnico necesita resultados reproducibles de permiso permitido/denegado y regresión del flujo afectado. No usar mocks como única evidencia de RLS, Storage o RPC. La [checklist Beta](beta-checklist.md) exige distinguir código probado, migración versionada y cambio desplegado.
