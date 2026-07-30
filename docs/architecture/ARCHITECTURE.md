# BuscoHuella - Arquitectura del Proyecto

## 1. Visión general

BuscoHuella es un ecosistema digital de bienestar animal que conecta ciudadanos,
protectoras, veterinarios, instituciones y tecnología para mejorar la identificación,
recuperación, adopción y protección de animales.

La plataforma combina:

- Aplicación móvil para ciudadanos.
- Plataforma web pública.
- Panel administrativo.
- API centralizada.
- Inteligencia artificial mediante módulos especializados.
- Geolocalización.
- Sistema de identidad animal.
- Comunidad colaborativa.
- Integraciones externas.

La arquitectura está diseñada para ser:

- Escalable.
- Segura.
- Modular.
- Preparada para crecimiento internacional.
- Compatible con futuras integraciones de inteligencia artificial, dispositivos IoT, sistemas inteligentes de identificación y tecnologías descentralizadas cuando aporten valor real al ecosistema.


---

# 2. Objetivo del sistema

El objetivo principal es crear una plataforma universal donde cada animal pueda tener:

- Una identidad digital.
- Un historial verificable.
- Un sistema rápido de recuperación.
- Información sanitaria.
- Documentación.
- Conexión con propietarios, veterinarios y organizaciones.
  
Además, el sistema gestionará eventos asociados al animal:

- Pérdidas.
- Hallazgos.
- Rescates.
- Adopciones.
- Revisiones sanitarias.
- Avistamientos.

El sistema debe permitir:

## Para ciudadanos

- Registrar animales.
- Crear perfiles.
- Gestionar documentos.
- Reportar pérdidas.
- Encontrar animales.
- Participar en rescates.
- Recibir alertas cercanas.

## Para protectoras

- Gestionar animales disponibles.
- Publicar adopciones.
- Gestionar rescates.
- Administrar voluntarios.

## Para veterinarios

- Gestionar historiales sanitarios.
- Registrar vacunas.
- Validar información animal.

## Para instituciones

- Gestionar incidencias.
- Consultar estadísticas.
- Coordinar actuaciones.


---

# 3. Ecosistema de aplicaciones


                    BUSCOHUELLA PLATFORM


                         Usuarios

                            |

        ------------------------------------------------

        |                     |                       |

   Mobile App          Plataforma Web          Panel Admin

 React Native             Angular                Angular


        |                     |                       |

        ------------------------------------------------

                            |

                     API REST / Backend

                         Symfony


                            |

        ------------------------------------------------

        |                     |                       |

     Dominio            Infraestructura          Procesos

    Symfony              PostgreSQL             Queue

    Módulos               Database              Jobs

    Negocio               Storage               Messenger



                            |

                 Servicios e integraciones


        ------------------------------------------------

        |            |             |              |

      Maps        Email/SMS      Push          IA


        |


     Servicios externos

     - Google Maps / OpenStreetMap
     - Firebase Push
     - Proveedores Email/SMS



## Futuro

La arquitectura permitirá incorporar nuevos servicios independientes:

- IoT.
- Collares inteligentes.
- Integraciones institucionales.
- Sistemas avanzados de identificación animal.
- Servicios de inteligencia artificial especializados.


## Principio arquitectónico

La plataforma se diseña con una arquitectura API First donde:

- Mobile consume la API.
- Web consume la API.
- Admin consume la API.
- Servicios futuros pueden integrarse mediante APIs.

El backend Symfony actúa como núcleo del ecosistema.


# 5. Modelo de dominio

## Usuario


Entidad responsable de la identidad dentro del sistema.


Usuario


├── Perfil

├── Roles

├── Permisos

├── Animales asociados

├── Actividad

└── Preferencias

## Animal


Entidad central del ecosistema.


Animal


├── Identidad

│   ├── Perfil

│   ├── Fotografías

│   ├── Características

│   └── QR Identificación


├── Relaciones

│   ├── Usuarios asociados

│   ├── Protectoras

│   ├── Veterinarios

│   └── Instituciones


├── Información clínica

│   ├── Salud

│   ├── Vacunas

│   ├── Medicación

│   └── Documentación


├── Geolocalización

│   ├── Ubicaciones

│   ├── Avistamientos

│   └── Eventos


└── Historial

    ├── Cambios propietario

    ├── Adopciones

    ├── Rescates

    └── Alertas



## Datos principales


### Perfil

- Nombre
- Especie
- Raza
- Sexo
- Edad
- Fotografías
- Características físicas


### Propietario

- Usuario asociado.
- Datos contacto.
- Preferencias privacidad.


### QR


Sistema de identificación rápida asociado al animal.


Usos:

- Collar.
- Placa identificativa.
- Cartilla digital.
- Perfil público de emergencia.


Funciones:

- Acceso rápido a información básica.
- Contacto propietario.
- Reporte de animal encontrado.
- Actualización de ubicación.
  
Seguridad:

- QR único por animal.
- Control de acceso.
- Protección de datos propietario.
- Registro de escaneos.

### Documentos

- Microchip.
- Vacunas.
- Pasaporte animal.
- Certificados.


### Salud

- Veterinarios.
- Revisiones.
- Medicación.
- Enfermedades.


### Historial

Registro completo:

- Cambios propietarios.
- Adopciones.
- Rescates.
- Revisiones.
- Alertas.


---

# 6. Mapa colaborativo


Sistema geográfico basado en comunidad.


## Tipos de eventos


### Animal perdido

Información:

- Localización.
- Fecha.
- Fotos.
- Características.
- Nivel urgencia.


### Animal encontrado

Información:

- Ubicación.
- Fotografías.
- Estado.
- Contacto.


### Riesgo

Ejemplos:

- Avisos de seguridad animal.
- Zonas con incidencias registradas.
- Riesgos comunitarios.
- Zonas con abandono.
- Accidentes.


### Servicios

Puntos de interés:

- Veterinarios.
- Protectoras.
- Tiendas.
- Parques.
- Hoteles animales.


### Comunidad

Elementos:

- Usuarios cercanos.
- Voluntarios.
- Rastreadores.
- Eventos.


---

# 7. Tecnologías


## Aplicación móvil

### React Native + Expo


Responsabilidades:

- Aplicación usuario final.
- Gestión animales.
- Geolocalización.
- Cámara.
- Escaneo QR.
- Notificaciones push.
- Comunicación entre usuarios (futuro).


---

## Aplicación Web


### Angular


Usos:

- Plataforma pública.
- Gestión usuarios.
- Consultas.
- Comunidad.


---

## Panel Administración


### Angular


Funciones:

- Gestión usuarios.
- Moderación.
- Estadísticas.
- Auditoría.
- Configuración.


---

## Backend


### Symfony API


Responsabilidades:

- Lógica negocio.
- Autenticación.
- Seguridad.
- Gestión permisos.
- Comunicación externa.


Componentes:

- Symfony Framework.
- API Platform.
- Doctrine ORM.
- Messenger.
- Security Bundle.


---

## Base de datos


### PostgreSQL


Motivos:

- Alta capacidad geoespacial.
- Escalabilidad.
- Integración PostGIS.
- Consultas complejas.


---

## Storage


Almacenamiento:

- Fotografías.
- Documentos.
- Archivos veterinarios.


Tecnología prevista:

- S3 compatible.
- MinIO en desarrollo.


---

## Queue / Jobs


Procesos asíncronos:

- Envío emails.
- Notificaciones.
- Procesamiento IA.
- Generación informes.


Tecnologías:

- Symfony Messenger.
- Redis/RabbitMQ.


---

# 8. Módulos principales del sistema


## Módulo usuarios

Responsable de la identidad del sistema.


Funciones:

- Registro.
- Login.
- Gestión perfiles.
- Roles.
- Permisos.
- Preferencias.


---


## Módulo animales


Módulo principal del ecosistema.


Funciones:

- Crear perfiles animales.
- Gestionar propietarios.
- Gestionar QR.
- Documentación.
- Historial.
- Salud.


---


## Módulo mapa


Gestiona información geográfica.


Funciones:

- Animales perdidos.
- Animales encontrados.
- Avistamientos.
- Servicios cercanos.
- Alertas geográficas.


---


## Módulo comunidad


Gestiona interacción entre usuarios.


Funciones:

- Publicaciones.
- Eventos.
- Voluntariado.
- Colaboración ciudadana.


---


## Módulo adopciones


Gestiona procesos de adopción.


Funciones:

- Publicación animales.
- Solicitudes.
- Seguimiento.
- Estados adopción.


---


## Módulo notificaciones


Gestiona comunicaciones.


Funciones:

- Push.
- Email.
- SMS.
- Alertas cercanas.
- Avisos de estado.


---


## Módulo IA HuellaIA (futuro)

Módulo inteligente preparado para integración futura.

Estado:

- Fuera del MVP inicial.
- Diseñado para funcionar como servicio independiente.

Funciones:

- Reconocimiento animal mediante imágenes.
- Comparación fotográfica.
- Ayuda en identificación.
- Predicción de zonas de búsqueda.
  
# 9. Comunicación entre sistemas


## Arquitectura de comunicación


Todos los clientes se comunican con el backend mediante una API REST.

          CLIENTES

  Mobile / Web / Admin


            |

            |

      HTTPS / JSON API


            |

            |

      Symfony Backend


            |

-----------------------------

|             |             |

PostgreSQL / Storage / Queues

Database / Archivos / Jobs


---


## API REST


Formato principal:

- JSON.
- HTTPS.
- Arquitectura API First.


Ejemplos:


GET /api/animals

POST /api/lost-reports

GET /api/map/events

POST /api/auth/login

POST /api/adoptions/request


---

## Comunicación interna del backend

Symfony organiza la lógica mediante módulos independientes:

Symfony Backend

├── Usuarios
├── Animales
├── Mapa
├── Comunidad
├── Adopciones
├── Notificaciones
├── Auditoría
└── Administración

Cada módulo contiene:

Entidades.
Servicios.
Casos de uso.
Reglas de negocio.
Eventos internos.

Servicios externos
Maps

Responsable de:

Geolocalización.
Mapas interactivos.
Cálculo de distancias.
Búsquedas cercanas.

Posibles proveedores:

Google Maps.
OpenStreetMap.
Notificaciones

Sistema de comunicación con usuarios.

Canales:

Push.
Email.
SMS.

Usos:

Alertas animales perdidos.
Avisos cercanos.
Cambios de estado.
Comunicaciones importantes.
IA HuellaIA

Servicio inteligente futuro.

Funciones previstas:

Reconocimiento mediante imágenes.
Comparación fotográfica.
Identificación asistida.
Predicción de zonas de búsqueda.
Recomendaciones inteligentes.

Diseñado para poder separarse como servicio independiente.

QR Identificación

Sistema asociado al animal.

Funciones:

Identificación rápida.
Acceso al perfil público.
Reporte de animal encontrado.
Actualización de información.

Características:

QR único por animal.
Control de acceso.
Registro de escaneos.

## Comunicación principal

React Native
  |

  |

  HTTPS

  |

  |

  Symfony API

  

---

## API


Formato:

JSON REST API



Ejemplo:

GET /api/animals

POST /api/lost-reports

GET /api/map/events

POST /api/auth/login



---

## Servicios externos


## Maps

Uso:

- Localización.
- Rutas.
- Radio búsqueda.


Ejemplos:

- Google Maps.
- OpenStreetMap.


---

## Notificaciones


Tipos:

- Push.
- Email.
- SMS.


Uso:

- Alertas pérdida.
- Avisos cercanos.
- Cambios estado.


---

## IA HuellaIA


Futuro módulo inteligente.


Funciones previstas:

- Reconocimiento de animales mediante imágenes.
- Comparación fotográfica.
- Ayuda en identificación.
- Asistencia inteligente a usuarios.
- Análisis de patrones de pérdida.
- Recomendaciones de búsqueda.


---

## QR


Sistema:

- Identificación rápida.
- Acceso perfil público.
- Emergencias.


---

# 10. Seguridad


## Autenticación


Sistema:

- JWT.
- Refresh tokens.
- OAuth futuro.


---

---

## Control de acceso


Sistema basado en roles:

- Usuario particular.
- Protectora.
- Veterinario.
- Ayuntamiento.
- Administrador.


Cada rol tendrá:

- Permisos específicos.
- Acceso limitado a información sensible.
- Registro de actividad.

## Protección datos


Cumplimiento:

- RGPD.
- LOPDGDD.
- Privacidad por diseño.


---

## Seguridad backend


Medidas:

- Validación entradas.
- Rate limiting.
- Logs.
- Auditoría.
- Roles.


---

## Datos sensibles


Protección:

- Cifrado.
- Anonimización.
- Control acceso.


---

# 11. Usuarios y permisos


## Tipos de usuarios


## Particular


Puede:

- Crear animales.
- Gestionar perfiles propios.
- Reportar pérdidas.
- Reportar animales encontrados.
- Participar en comunidad.
- Solicitar adopciones.


---

## Protectora


Puede:

- Gestionar animales.
- Publicar adopciones.
- Gestionar rescates.
- Administrar voluntarios.


---

## Veterinario


Puede:

- Validar salud.
- Añadir informes.
- Gestionar historiales.


---

## Ayuntamiento


Puede:

- Consultar estadísticas.
- Gestionar campañas.
- Crear alertas municipales.


---

## Administrador


Puede:

- Gestionar plataforma.
- Moderar contenido.
- Gestionar permisos.
- Auditar actividad.


---

# 12. Roadmap del producto


## Fase 1 - MVP


Objetivo:

Validación local.


Incluye:

- Usuarios.
- Animales.
- QR.
- Mapa.
- Alertas.
- Comunidad.


---

## Fase 2 - Crecimiento


Añadir:

- Protectoras.
- Veterinarios.
- Adopciones.
- IA básica.


---

## Fase 3 - Ecosistema


Añadir:

- IoT.
- Collares inteligentes.
- APIs públicas.
- Integración institucional.


---
 
## Fase 4 - Internacionalización


Añadir:

- Identidad animal internacional.
- APIs públicas.
- Integraciones gubernamentales.
- Sistemas de certificación.
- Tecnologías descentralizadas si aportan valor real.


---

# 13. Decisiones iniciales


## Arquitectura modular


BuscoHuella comenzará como un monolito modular.


Esta decisión permite:

- Desarrollo más rápido.
- Menor complejidad inicial.
- Separación clara de dominios.
- Evolución futura hacia microservicios cuando sea necesario.


La prioridad inicial es mantener una arquitectura mantenible antes de distribuir servicios.


---

## Backend API First


La API será el núcleo del ecosistema.

Ventajas:

- Mobile independiente.
- Web independiente.
- Integraciones futuras.


---

## PostgreSQL como base principal


Decisión:

Utilizar PostgreSQL desde el inicio.

Motivos:

- Escalabilidad.
- Datos geográficos.
- Open source.
- Preparado para grandes volúmenes.


---

## React Native para Mobile


Motivos:

- Desarrollo multiplataforma.
- Menor coste.
- Comunidad amplia.


---

## Angular para Web


Motivos:

- Arquitectura empresarial.
- Escalabilidad.
- Tipado.
- Mantenimiento.


---

## Symfony como Backend


Motivos:

- Seguridad.
- Arquitectura limpia.
- Código mantenible.
- Ecosistema PHP empresarial.


---

# Conclusión


BuscoHuella se construye como una plataforma tecnológica preparada para evolucionar desde un MVP local hasta un ecosistema global de bienestar animal.


La arquitectura permite incorporar progresivamente:

- Inteligencia Artificial.
- Geolocalización avanzada.
- Sistemas IoT.
- Integraciones institucionales.
- Automatización inteligente.


La estrategia inicial se basa en construir una plataforma sólida, segura y escalable donde cada animal disponga de una identidad digital y donde la comunidad pueda colaborar para mejorar su protección y recuperación.


## Diagrama de flujo de trabajo de un usuario particular

```mermaid
flowchart LR
    A[Inicio - Usuario decide usar BuscoHuella] --> B{¿Tiene cuenta?}

    B -- No --> C[Crear cuenta / Registrarse]
    C --> D[Ver tutorial / Onboarding]
    C --> E[Configurar perfil]
    C --> F[Añadir primer animal]

    B -- Sí --> G[Iniciar sesión]
    G --> H{¿Qué quiere hacer?}

    subgraph "Flujo: Reportar Animal Perdido"
        H -- "Reportar animal perdido" --> I[Seleccionar animal]
        I --> J[Rellenar formulario de reporte]
        J --> K[Añadir ubicación actual]
        K --> L[Subir fotos]
        L --> M[Añadir descripción y características]
        M --> N{¿Tiene QR?}
        N -- Sí --> O[Escanear QR]
        N -- No --> P[Generar QR / Actualizar datos]
        O --> Q[Confirmar reporte]
        P --> Q
        Q --> R[Recibir confirmación y número de caso]
    end

    subgraph "Flujo: Reportar Animal Encontrado"
        H -- "Reportar animal encontrado" --> S[Seleccionar "Reportar encontrado"]
        S --> T[Tomar o subir fotos del animal]
        T --> U[Añadir ubicación donde se encontró]
        U --> V[Añadir descripción]
        V --> W{¿Animal identificado?}
        W -- Sí --> X[Escanear QR]
        W -- No --> Y[Dejar datos de contacto]
        X --> Z[Enviar reporte]
        Y --> Z
        Z --> AA[Recibir número de caso]
    end

    subgraph "Flujo: Buscar Animales"
        H -- "Buscar animales" --> AB[Ver mapa interactivo]
        AB --> AC[Filtrar por especie / raza / estado]
        AC --> AD{Encontró animal relevante?}
        AD -- Sí --> AE[Ver perfil del animal]
        AD -- No --> AF[Ajustar filtros]
        AF --> AB
    end

    subgraph "Flujo: Adoptar"
        H -- "Adoptar" --> AG[Explorar animales en adopción]
        AG --> AH[Ver perfil completo]
        AH --> AI[Contactar protectora]
        AI --> AJ{Protectora responde?}
        AJ -- Sí --> AK[Seguir pasos de adopción]
        AJ -- No --> AL[Contactar otra protectora]
        AL --> AI
    end

    subgraph "Flujo: Comunidad"
        H -- "Ver comunidad" --> AM[Ver eventos locales]
        AM --> AN[Unirse a voluntariado]
        AN --> AO[Participar en campañas]
        AO --> AP[Ver estadísticas personales]
    end

    %% Conexiones finales de los flujos principales
    R --> AQ[Recibir notificaciones de actualizaciones]
    AA --> AQ
    AE --> AQ
    AK --> AQ
    AP --> AQ

    AQ --> H

    %% Estilos
    classDef user fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef action fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef decision fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef process fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    class A,G user;
    class B,N,W decision;
    class C,D,E,F,I,J,K,L,M,O,P,Q,R,S,T,U,V,X,Y,Z,AA,AB,AC,AD,AE,AF,AG,AH,AI,AJ,AK,AL,AM,AN,AO,AP,AQ process;
```



---

## Diagrama de flujo de trabajo de una protectora de animales

```mermaid
flowchart LR
    A[Inicio - Protectora inicia operación] --> B[Crear cuenta / Verificar estado legal]
    B --> C[Configurar perfil de la protectora]
    C --> D[Añadir animales a la plataforma]

    subgraph "Flujo: Gestión Animal"
        D --> E{Animal necesita adopción?}
        E -- Sí --> F[Marcar como "En adopción"]
        E -- No --> G[Marcar como "Bajo cuidado"]
        F --> H[Subir fotos y descripción detallada]
        G --> I[Añadir información médica]
        H --> J[Publicar perfil]
        I --> J
        J --> K[Recibir solicitudes de adopción]
    end

    subgraph "Flujo: Adopciones"
        K --> L{Solicitud válida?}
        L -- Sí --> M[Contactar adoptante]
        L -- No --> N[Rechazar con motivo]
        M --> O[Agendar visita / entrevista]
        O --> P{Adopción aprobada?}
        P -- Sí --> Q[Firmar contrato de adopción]
        P -- No --> R[Rechazar con explicación]
        Q --> S[Actualizar estado del animal]
        R --> S
        S --> T[Enviar informe post-adopción]
    end

    subgraph "Flujo: Rescates"
        D --> U[Marcar como "Rescate en progreso"]
        U --> V[Registrar detalles del rescate]
        V --> W{Requiere atención veterinaria inmediata?}
        W -- Sí --> X[Contactar veterinario asociado]
        W -- No --> Y[Trasladar a la protectora]
        X --> Z[Realizar evaluación médica]
        Y --> Z
        Z --> AA[Inicio de recuperación]
    end

    subgraph "Flujo: Voluntariado"
        C --> AB[Publicar oportunidades de voluntariado]
        AB --> AC[Gestionar solicitudes de voluntarios]
        AC --> AD{Voluntario aprobado?}
        AD -- Sí --> AE[Asignar tareas]
        AD -- No --> AF[Comunicar decisión]
        AE --> AG[Seguimiento y evaluaciones]
    end

    subgraph "Flujo: Comunidad"
        C --> AH[Publicar eventos]
        AH --> AI[Recibir donaciones / patrocinios]
        AI --> AJ[Participar en campañas]
        AJ --> AK[Colaborar con ayuntamientos]
    end

    %% Conexiones finales
    T --> AL[Ver estadísticas de adopciones]
    S --> AL
    AG --> AL
    AK --> AL
    AL --> H

    %% Estilos
    classDef user fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef action fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;
    classDef decision fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px;
    classDef process fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;

    class A,B,C,D,G,J,K,M,P,S,U,V,Y,Z,AA,S user;
    class E,L,W,AD decision;
    class F,H,I,M,N,O,Q,R,T,X,Z,AA,AB,AC,AD,AE,AF,AG,AH,AI,AJ,AK process;
```

# 14. Arquitectura evolutiva


BuscoHuella comienza como un monolito modular basado en Symfony.


Esta decisión permite:

- Desarrollo más rápido.
- Menor complejidad inicial.
- Separación clara de dominios.
- Fácil mantenimiento.
- Evolución progresiva.


La arquitectura evita crear microservicios prematuramente.


---


# Fase inicial


## Symfony Modular Monolith


# Módulo usuarios


Responsable de la identidad del sistema.


Funciones:

- Registro.
- Autenticación.
- Gestión de perfiles.
- Roles.
- Permisos.
- Preferencias.
- Configuración privacidad.


---


# Módulo animales


Módulo principal del ecosistema.


Funciones:

- Creación de perfiles animales.
- Gestión propietarios.
- Identificación QR.
- Fotografías.
- Documentación.
- Historial.
- Información sanitaria.


---


# Módulo mapa


Gestiona toda la información geográfica.


Funciones:

- Animales perdidos.
- Animales encontrados.
- Avistamientos.
- Alertas geográficas.
- Servicios cercanos.
- Eventos comunitarios.


---


# Módulo comunidad


Gestiona la colaboración ciudadana.


Funciones:

- Publicaciones.
- Comentarios.
- Eventos.
- Voluntariado.
- Participación comunitaria.


---


# Módulo adopciones


Gestiona el proceso completo de adopción.


Funciones:

- Publicación de animales.
- Solicitudes.
- Validaciones.
- Seguimiento.
- Estados de adopción.


---


# Módulo notificaciones


Gestiona las comunicaciones del sistema.


Funciones:

- Notificaciones push.
- Emails.
- SMS.
- Alertas geográficas.
- Comunicaciones automáticas.


---


# Módulo auditoría


Responsable del seguimiento y trazabilidad.


Funciones:

- Registro de actividad.
- Cambios importantes.
- Acciones administrativas.
- Historial de modificaciones.
- Control de seguridad.


---


# Módulo administración


Gestiona la plataforma interna.


Funciones:

- Gestión usuarios.
- Moderación.
- Configuración global.
- Estadísticas.
- Control operativo.


---


# Módulo IA HuellaIA


Módulo futuro independiente.


Estado:

- Fuera del MVP inicial.
- Preparado para integración futura.


Funciones:

- Reconocimiento animal mediante imágenes.
- Comparación fotográfica.
- Asistencia inteligente.
- Análisis predictivo.
- Recomendaciones de búsqueda.


## Módulo usuarios

Responsable de:

- Registro.
- Autenticación.
- Roles.
- Permisos.


## Módulo animales

Responsable de:

- Perfil animal.
- Relaciones.
- Documentación.
- Historial.


## Módulo mapa

Responsable de:

- Ubicaciones.
- Eventos.
- Alertas.
- Servicios cercanos.


## Módulo comunidad

Responsable de:

- Publicaciones.
- Eventos.
- Voluntariado.
- Colaboración.


## Módulo adopciones

Responsable de:

- Publicación animales.
- Solicitudes.
- Seguimiento.


## Módulo notificaciones

Responsable de:

- Push.
- Email.
- SMS.
- Alertas geográficas.


## Módulo IA HuellaIA


Módulo inteligente preparado para futuras versiones.


Responsable de:

- Reconocimiento de animales mediante imágenes.
- Comparación fotográfica.
- Ayuda en identificación.
- Recomendaciones inteligentes.
- Análisis de patrones de pérdida.


Estado inicial:

- Fuera del MVP.
- Preparado como servicio independiente futuro.
- 

# 14. Arquitectura evolutiva


BuscoHuella comienza como un monolito modular basado en Symfony.


Esta decisión permite:

- Desarrollo más rápido.
- Menor complejidad inicial.
- Separación clara de dominios.
- Fácil mantenimiento.
- Evolución progresiva.


La arquitectura evita crear microservicios prematuramente.


---


# Fase inicial


## Symfony Modular Monolith


Todos los módulos viven dentro del mismo backend:


Symfony Backend

├── Usuarios
├── Animales
├── Mapa
├── Comunidad
├── Adopciones
├── Notificaciones
├── Auditoría
└── Administración



Cada módulo tendrá:

- Entidades propias.
- Servicios.
- Casos de uso.
- Reglas de negocio.
- Eventos internos.


---


# Evolución futura


Cuando exista una necesidad real de escalabilidad, algunos módulos podrán extraerse como servicios independientes:


Posibles servicios:


- Servicio IA HuellaIA.
- Servicio Notificaciones.
- Servicio Analytics.
- Servicio IoT.
- Servicio Integraciones institucionales.
- Servicio Identidad Animal.


La extracción se realizará únicamente cuando aporte ventajas técnicas o de negocio.