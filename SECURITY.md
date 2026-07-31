# Política de seguridad

## Versiones soportadas

BuscoHuella se encuentra actualmente en fase **Pre-MVP**.

Mientras no exista una versión pública estable, solo se considerará soportada la versión más reciente disponible en la rama principal del repositorio.

| Versión | Soporte |
|---|---|
| Rama `main` | ✅ Soportada |
| Versiones o ramas antiguas | ❌ No soportadas |

---

## Cómo reportar una vulnerabilidad

No publiques vulnerabilidades de seguridad en:

- Issues públicos;
- Pull Requests públicos;
- discusiones públicas;
- redes sociales;
- canales comunitarios.

Envía el reporte de forma privada a:

```text
xavier@buscohuella.es
```

Asunto recomendado:

```text
[SEGURIDAD] Vulnerabilidad en BuscoHuella
```

---

## Información que debe incluir el reporte

Incluye, cuando sea posible:

- descripción clara del problema;
- componente afectado;
- pasos para reproducirlo;
- impacto potencial;
- versión o commit afectado;
- entorno utilizado;
- capturas, logs o prueba de concepto;
- posible mitigación;
- datos de contacto para responder.

No incluyas:

- credenciales reales;
- datos personales de terceros;
- tokens activos;
- claves privadas;
- información obtenida mediante acceso no autorizado.

---

## Respuesta esperada

Se intentará:

1. confirmar la recepción;
2. revisar el impacto;
3. reproducir el problema;
4. priorizar la corrección;
5. comunicar el estado al informante;
6. publicar una solución cuando sea seguro.

Los tiempos dependerán de:

- gravedad;
- reproducibilidad;
- alcance;
- disponibilidad del equipo;
- fase del proyecto.

---

## Divulgación responsable

Se solicita no divulgar públicamente la vulnerabilidad hasta que:

- exista una corrección;
- se haya desplegado;
- se haya acordado una fecha de divulgación;
- o el responsable del proyecto lo autorice expresamente.

La divulgación coordinada ayuda a proteger:

- usuarios;
- mascotas;
- ubicaciones;
- datos personales;
- organizaciones colaboradoras;
- infraestructura.

---

## Alcance prioritario

Se consideran especialmente relevantes las vulnerabilidades relacionadas con:

- autenticación;
- sesiones;
- autorización;
- Row Level Security;
- Supabase;
- exposición de claves;
- datos personales;
- ubicaciones;
- fotografías;
- subida de archivos;
- permisos entre usuarios;
- suplantación;
- borrado o modificación no autorizada;
- inyección;
- ejecución remota;
- acceso administrativo;
- filtración de información.

---

## Buenas prácticas para investigadores

Se solicita:

- actuar de buena fe;
- utilizar cuentas y datos propios;
- evitar interrupciones del servicio;
- no acceder a datos ajenos;
- no descargar información innecesaria;
- no realizar ingeniería social;
- no ejecutar ataques destructivos;
- detener las pruebas si existe riesgo para terceros.

---

## Recompensas

BuscoHuella no dispone actualmente de un programa formal de recompensas por vulnerabilidades.

El envío de un reporte no implica compensación económica.

Podrá reconocerse públicamente la colaboración si:

- el informante lo autoriza;
- la divulgación es segura;
- el reporte es válido;
- no existe impedimento legal o contractual.

---

## Protección de secretos

Nunca deben publicarse en el repositorio:

- archivos `.env`;
- tokens;
- contraseñas;
- service role keys;
- claves privadas;
- credenciales de Supabase;
- secretos de Vercel;
- secretos de GitHub Actions;
- claves de Mapbox;
- credenciales de terceros.

Si un secreto se publica accidentalmente:

1. revócalo inmediatamente;
2. genera uno nuevo;
3. revisa los logs;
4. elimina su uso;
5. documenta el incidente;
6. no confíes únicamente en borrar el commit.

---

## Documentación relacionada

```text
docs/security/SECURITY_POLICY.md
docs/security/RLS_POLICIES.md
docs/security/THREAT_MODEL.md
docs/security/AUDIT_LOG.md
docs/master/DOCUMENTO_MAESTRO.md
AGENTS.md
```

---

## Contacto

```text
Xavier Quesada Sevillano
BuscoHuella
xavier@buscohuella.es
https://buscohuella.es
```

> La seguridad, la privacidad y la protección de ubicaciones forman parte del diseño del producto.
