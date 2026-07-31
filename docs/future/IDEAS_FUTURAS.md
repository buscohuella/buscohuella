# BUSCOHUELLA — IDEAS FUTURAS
## Documento de Aparcamiento Estratégico

**Versión**: 1.0  
**Fecha**: Julio 2026  
**Estado**: NINGUNA de estas ideas entra en el MVP. Se revisitan por fases.  
**Regla de oro**: No añadir nada de aquí hasta que el MVP tenga 500 usuarios activos.

---

## ÍNDICE DE IDEAS POR FASE

- [Fase 2 — Crecimiento (Meses 7-18)](#fase-2--crecimiento-meses-7-18)
- [Fase 3 — Escala Técnica (Año 2)](#fase-3--escala-técnica-año-2)
- [Fase 4 — Ecosistema (Año 3+)](#fase-4--ecosistema-año-3)
- [Fase 5 — Innovación (Año 4+)](#fase-5--innovación-año-4)
- [Ideas Descartadas](#ideas-descartadas)

---

## FASE 2 — CRECIMIENTO (Meses 7-18)
> **Trigger**: MVP con 500 usuarios activos + 2 protectoras integradas

### F2.1 — Suscripción Premium "BuscoHuella Pro"
- **Precio**: €4.99/mes
- **Features**:
  - Historial ilimitado de reportes
  - Alertas avanzadas (radio configurable, filtros por especie)
  - Estadísticas personales (mapa de calor de paseos)
  - Modo "Familia" (compartir mascota con pareja/hijos)
  - Prioridad en notificaciones
- **Justificación**: Monetización B2C cuando hay tracción

### F2.2 — Panel para Protectoras
- **Precio**: €19.99-49.99/mes
- **Features**:
  - Gestión de animales en adopción
  - Estadísticas de visitas y contactos
  - Comunicación directa con adoptantes
  - Verificación de protectora (sello azul)
- **Justificación**: Revenue B2B recurrente

### F2.3 — App Nativa (React Native)
- **Por qué aparcar ahora**: PWA cubre el 80% del MVP. React Native añade:
  - Notificaciones push nativas (mejor que Web Push)
  - Cámara optimizada
  - GPS en background
  - Acceso a contactos
- **Coste estimado**: 3-4 meses de desarrollo

### F2.4 — Chat Básico entre Usuarios
- Chat simple vinculado a un reporte (no chat general)
- Sin historial persistente (30 días)
- Moderación automática por palabras clave

### F2.5 — Sistema de Reputación
- Puntos por ayudar en reencuentros
- Medallas: "Guardián del Barrio", "Explorador", "Rescatista"
- Sin token ni blockchain (solo gamificación ligera)

---

## FASE 3 — ESCALA TÉCNICA (Año 2)
> **Trigger**: 2.000 usuarios + presencia en 3 ciudades

### F3.1 — Dashboard para Ayuntamientos (B2G)
- **Precio**: €500-2.000/año según población
- **Features**:
  - Censo digital de mascotas en el municipio
  - Mapa de calor de incidencias
  - Estadísticas de abandonos y reencuentros
  - Gestión de denuncias ciudadanas
  - Exportación de informes trimestrales
- **Justificación**: Cumplimiento Ley 7/2023, revenue B2G estable

### F3.2 — Integración REIAC
- Conexión con el Registro de Identificación Animal de Compañía
- Validación automática de microchips
- Sincronización de datos oficiales

### F3.3 — IA Básica (Matching Fotográfico)
- **NO es reconocimiento facial avanzado**
- Comparación de similitud visual básica (color, tamaño, patrones)
- Sugerencia automática: "Este animal encontrado podría ser el tuyo"
- Tecnología: OpenCV + embeddings simples (no deep learning)

### F3.4 — Panel de Administración
- Moderación de reportes
- Gestión de usuarios
- Estadísticas globales
- Auditoría de actividad

### F3.5 — Notificaciones Avanzadas
- Firebase Cloud Messaging (push nativo)
- Email transaccional (SendGrid/Mailgun)
- SMS para alertas críticas (Twilio)

---

## FASE 4 — ECOSISTEMA (Año 3+)
> **Trigger**: 10.000 usuarios + presencia en 5 ciudades + revenue positivo

### F4.1 — Marketplace de Servicios
- Veterinarios, paseadores, peluquerías, hoteles pet-friendly
- Reservas integradas
- Comisiones del 5-8%
- Verificación de profesionales

### F4.2 — Adopción Inteligente
- Matching básico entre adoptante y mascota
- Filtros: "tengo jardín", "soy runner", "tengo niños"
- Sin IA compleja: solo filtros inteligentes

### F4.3 — Turismo Pet-Friendly
- Guías de viaje con alojamientos y rutas
- Mapa de zonas pet-friendly por ciudad
- Reservas integradas

### F4.4 — API Pública
- API documentada (OpenAPI/Swagger)
- Acceso para desarrolladores externos
- Rate limiting, API keys
- Casos de uso: integraciones con apps de terceros, investigación universitaria

### F4.5 — Expansión Internacional
- Traducción a catalán, euskera, inglés, portugués, francés
- Adaptación a legislación local
- Partnerships con protectoras en Portugal, Italia, Francia

---

## FASE 5 — INNOVACIÓN (Año 4+)
> **Trigger**: 50.000 usuarios + revenue > €100k/año + equipo de 5+ personas

### F5.1 — HuellaIA (Reconocimiento Visual Avanzado)
- Entrenamiento de modelo propio con dataset de miles de fotos
- Reconocimiento facial de mascotas (>90% precisión)
- Comparación automática perdido vs. encontrado
- **Requiere**: Dataset grande, GPU, científico de datos

### F5.2 — Token $HUE (Reevaluación)
- **Reconsiderar solo si**:
  - Hay comunidad de 100.000+ usuarios
  - Existe utilidad real (descuentos, votaciones DAO)
  - Marco legal claro (MiCA en UE)
  - **NO es un token especulativo**
- **Alternativa**: Sistema de puntos tradicional (no blockchain)

### F5.3 — IoT / Collares Inteligentes
- Collar GPS económico (<€30)
- Geovallas personalizables
- Alerta de escape en tiempo real
- **Requiere**: Hardware, certificación CE, logística

### F5.4 — Smart City Animal
- Sensores IoT en parques (pipicans)
- Puntos de rehidratación inteligentes
- Monitoreo ambiental (temperatura, calidad del aire)
- **Requiere**: Acuerdos municipales, hardware, mantenimiento

### F5.5 — Telemedicina Veterinaria
- Videoconsultas con veterinarios
- Pre-diagnóstico por IA (síntomas, fotos)
- Recetas digitales
- **Requiere**: Colegio de Veterinarios, compliance legal

---

## IDEAS DESCARTADAS

| Idea | Razón de descarte | Alternativa |
|------|-------------------|-------------|
| **Blockchain para identidad animal** | Sin utilidad real para el usuario. Overkill técnico. | Microchip + QR tradicional |
| **NFT de mascotas** | Especulativo, sin valor funcional. | Foto + perfil digital |
| **Gestión ganadera** | Mercado completamente diferente. Spin-off posible. | App separada en el futuro |
| **Cosmética ecológica** | Fuera del core. Sin expertise. | Partnership con marca existente |
| **Logística sostenible** | Over-engineering. Sin demanda validada. | Sin alternativa por ahora |
| **Bolsa de trabajo verde** | Fuera del scope. Sin recursos. | Sin alternativa por ahora |
| **DAO / Gobernanza descentralizada** | Sin comunidad madura. Riesgo legal. | Votaciones simples en app |
| **Economía circular completa** | Demasiado ambicioso. Sin validación. | Marketplace simple Fase 4 |

---

## CRITERIOS PARA DESBLOQUEAR CADA FASE

| Fase | Métrica mínima | Recurso mínimo |
|------|---------------|----------------|
| Fase 2 | 500 usuarios activos | 1 dev adicional |
| Fase 3 | 2.000 usuarios + revenue €1k/mes | 2 devs + 1 community |
| Fase 4 | 10.000 usuarios + revenue €5k/mes | Equipo de 5 personas |
| Fase 5 | 50.000 usuarios + revenue €100k/año | Equipo de 10+ + inversión |

---

## NOTA FINAL

> Este documento existe para que las ideas buenas no se pierdan, pero también para recordar que **el éxito de una startup no se mide por la cantidad de features, sino por la profundidad con la que resuelve UN problema**.
>
> BuscoHuella resuelve: **"Encontrar mascotas perdidas en tu barrio rápidamente"**.
>
> Todo lo demás es un bonus que solo tiene sentido cuando eso funciona.

---

*Documento vivo. Revisar trimestralmente.*