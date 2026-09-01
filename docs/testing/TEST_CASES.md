# Matriz de pruebas del MVP web

Esta matriz sirve para la validación interna y para la primera beta local de BuscoHuella. Se ejecuta con el idioma español y se repite, cuando se indica, en catalán y en móvil.

## Criterio de resultado

- **OK**: el flujo termina y la interfaz muestra un estado comprensible.
- **Bloqueo**: impide continuar, pierde datos, expone información privada o muestra un error técnico.
- **Mejora**: funciona, pero necesita ajuste de claridad, diseño o comodidad.

## Pruebas públicas

| ID | Flujo | Pasos | Resultado esperado | Resultado |
|---|---|---|---|---|
| PUB-01 | Inicio | Abrir `/` sin sesión | La propuesta, mapa, avisos y llamadas a la acción son visibles; no exige registro para explorar. | ☐ |
| PUB-02 | Avisos | Abrir `/avisos`, cambiar entre perdidas y todas, ordenar y abrir un aviso | El listado responde, el detalle es accesible y volver devuelve a avisos. | ☐ |
| PUB-03 | Mapa | Abrir `/mapa`, buscar una dirección, borrar con la X, marcar un punto y aplicar distancia | Se ve el punto seleccionado, la dirección se actualiza y el radio filtra los avisos sin recargar de forma inesperada. | ☐ |
| PUB-04 | Responsive | Repetir PUB-01, PUB-02 y PUB-03 en móvil | No hay desbordamiento horizontal; controles y tarjetas se pueden usar con teclado táctil. | ☐ |
| PUB-05 | SEO básico | Revisar título, descripción y encabezado principal de inicio, avisos y detalle | Cada página tiene título y descripción coherentes y un único `h1` principal. | ☐ |

## Pruebas de autenticación

| ID | Flujo | Pasos | Resultado esperado | Resultado |
|---|---|---|---|---|
| AUTH-01 | Registro por correo | Registrar una cuenta con datos válidos y confirmar el correo si Supabase lo solicita | Se informa del siguiente paso y se puede iniciar sesión. | ☐ |
| AUTH-02 | Login por correo | Iniciar sesión con una cuenta existente | Redirige al inicio privado y muestra “Sesión iniciada correctamente”. | ☐ |
| AUTH-03 | Google | Entrar con una cuenta Google nueva y con una ya existente | El callback vuelve a BuscoHuella sin error; una cuenta sin nombre suficiente pasa por perfil. | ☐ |
| AUTH-04 | Error de login | Usar contraseña incorrecta o cancelar Google | El mensaje es comprensible y no se muestran detalles internos. | ☐ |
| AUTH-05 | Protección | Abrir una ruta privada sin sesión | Redirige al login conservando el destino seguro. | ☐ |
| AUTH-06 | Cerrar sesión | Cerrar sesión y volver atrás en el navegador | La sesión queda invalidada y las rutas privadas vuelven a exigir acceso. | ☐ |

## Flujo principal autenticado

| ID | Flujo | Pasos | Resultado esperado | Resultado |
|---|---|---|---|---|
| MVP-01 | Perfil | Completar nombre, alias opcional y visibilidad; guardar | Aparece confirmación, los valores persisten y la foto sigue siendo opcional. | ☐ |
| MVP-02 | Mascota | Crear una mascota con los datos mínimos, abrirla, editarla y archivarla/restaurarla | Los cambios persisten y el estado se refleja en el listado. | ☐ |
| MVP-03 | Aviso perdido | Crear aviso, completar ubicación aproximada, descripción, fotos, revisar y publicar | El aviso aparece en “Mis avisos”, en avisos públicos y en el mapa según su visibilidad. | ☐ |
| MVP-04 | Avistamiento | Abrir un aviso público, enviar un avistamiento con ubicación y foto opcional | El propietario puede verlo en avistamientos recibidos; el colaborador lo ve en sus avistamientos. | ☐ |
| MVP-05 | Gestión del caso | Revisar, pausar/reactivar y resolver un aviso propio | El estado se actualiza, deja de aparecer como activo cuando corresponde y no se pierde el historial. | ☐ |
| MVP-06 | Privacidad | Revisar aviso público con usuario anónimo y ubicación aproximada | No se expone correo, teléfono, coordenada exacta ni información privada. | ☐ |

## Idiomas y accesibilidad

| ID | Revisión | Resultado esperado | Resultado |
|---|---|---|---|
| A11Y-01 | Teclado | Todos los controles tienen foco visible y orden lógico; no hay acción dependiente solo del color. | ☐ |
| A11Y-02 | Formularios | Cada campo tiene etiqueta, ayuda y error asociado; los mensajes se entienden sin depender del placeholder. | ☐ |
| A11Y-03 | Lectores de pantalla | Estados de carga, vacío, error y éxito tienen texto anunciable. | ☐ |
| I18N-01 | Catalán | Repetir autenticación, mapa, avisos y creación de aviso | No aparecen claves de traducción ni textos en español dentro de una pantalla catalana. | ☐ |
| I18N-02 | Inglés | Revisar las pantallas disponibles | Las claves faltantes quedan registradas como limitación; no se bloquea el MVP español/catalán. | ☐ |

## Datos para betatesters

Usar cuentas separadas y datos ficticios o autorizados. No compartir contraseñas, coordenadas exactas, teléfonos ni fotografías de menores. Registrar para cada fallo: cuenta o rol, ruta, pasos, resultado esperado, resultado real, dispositivo/navegador, idioma, hora aproximada y captura sin datos sensibles.
