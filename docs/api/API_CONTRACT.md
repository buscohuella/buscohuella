# BUSCOHUELLA — API CONTRACT
## Versión MVP (v1.0)

**Base URL**: `https://api.buscohuella.es/api/v1`  
**Formato**: JSON  
**Auth**: Bearer Token (JWT)  
**Content-Type**: `application/json`

---

## AUTENTICACIÓN

### POST /auth/register
Registro de nuevo usuario.

**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Minimo8Chars!",
  "displayName": "María García",
  "phone": "+34600123456",
  "neighborhood": "Eixample",
  "city": "Sabadell"
}
```

**Response 201:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@ejemplo.com",
    "displayName": "María García",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### POST /auth/login
Inicio de sesión.

**Request:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "Minimo8Chars!"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@ejemplo.com",
    "displayName": "María García"
  }
}
```

### POST /auth/refresh
Renovar token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## USUARIOS

### GET /users/me
Obtener perfil del usuario autenticado.

**Headers:** Authorization: Bearer <token>

**Response 200:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "usuario@ejemplo.com",
  "displayName": "María García",
  "phone": "+34600123456",
  "avatarUrl": "https://...",
  "neighborhood": "Eixample",
  "city": "Sabadell",
  "isVerified": false,
  "createdAt": "2026-07-29T10:00:00Z"
}
```

### PUT /users/me
Actualizar perfil.

**Request:**
```json
{
  "displayName": "María G.",
  "phone": "+34600999888",
  "neighborhood": "Centre"
}
```

## MASCOTAS

### GET /pets
Listar mascotas del usuario autenticado.

**Response 200:**
```json
{
  "data": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Luna",
      "species": "perro",
      "breed": "Labrador",
      "color": "Dorado",
      "size": "grande",
      "photoUrls": ["https://..."],
      "isLost": false,
      "createdAt": "2026-07-29T10:00:00Z"
    }
  ]
}
```

### POST /pets
Crear nueva mascota.

**Request:**
```json
{
  "name": "Luna",
  "species": "perro",
  "breed": "Labrador",
  "color": "Dorado",
  "size": "grande",
  "photoUrls": ["https://..."],
  "birthDate": "2020-03-15",
  "microchip": "123456789012345",
  "distinctiveMarks": "Cicatriz en oreja izquierda"
}
```

### GET /pets/{id}
Obtener detalle de una mascota.

### PUT /pets/{id}
Actualizar mascota.

### DELETE /pets/{id}
Eliminar mascota (soft delete).

## REPORTES (CORE)

### GET /reports
Listar reportes activos.

**Query params:**
- `type` (opcional): perdido, encontrado, avistamiento, peligro
- `lat`, `lng`, `radius` (opcional): filtrar por proximidad (km)
- `limit` (opcional): default 20, max 100
- `offset` (opcional): default 0

**Response 200:**
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "type": "perdido",
      "status": "activo",
      "title": "Perro labrador perdido en Parc del Nord",
      "description": "Luna se escapó durante el paseo. Lleva collar rojo.",
      "photoUrls": ["https://..."],
      "lat": 41.5463,
      "lng": 2.1086,
      "locationName": "Parc del Nord, Sabadell",
      "contactPhone": "+34600123456",
      "contactEmail": "maria@ejemplo.com",
      "createdAt": "2026-07-29T10:00:00Z",
      "reporter": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "displayName": "María García"
      },
      "pet": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Luna",
        "species": "perro"
      }
    }
  ],
  "meta": {
    "total": 150,
    "limit": 20,
    "offset": 0
  }
}
```

### POST /reports
Crear nuevo reporte.

**Request:**
```json
{
  "type": "perdido",
  "title": "Perro labrador perdido en Parc del Nord",
  "description": "Luna se escapó durante el paseo. Lleva collar rojo.",
  "photoUrls": ["https://..."],
  "lat": 41.5463,
  "lng": 2.1086,
  "locationName": "Parc del Nord, Sabadell",
  "contactPhone": "+34600123456",
  "contactEmail": "maria@ejemplo.com",
  "petId": "660e8400-e29b-41d4-a716-446655440001"
}
```

**Response 201:**
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "type": "perdido",
  "status": "activo",
  "createdAt": "2026-07-29T10:00:00Z"
}
```

### GET /reports/{id}
Obtener detalle de un reporte.

### PUT /reports/{id}
Actualizar reporte (solo el reporter).

### POST /reports/{id}/resolve
Marcar reporte como resuelto.

**Request:**
```json
{
  "resolutionNotes": "¡Encontrada! Estaba en el veterinario de la esquina."
}
```

## AVISTAMIENTOS

### GET /reports/{reportId}/sightings
Listar avistamientos de un reporte.

### POST /reports/{reportId}/sightings
Añadir avistamiento.

**Request:**
```json
{
  "lat": 41.5470,
  "lng": 2.1090,
  "photoUrl": "https://...",
  "notes": "La vi corriendo por la calle Mayor, dirección norte.",
  "seenAt": "2026-07-29T12:30:00Z"
}
```

## MAPA

### GET /map/nearby
Obtener reportes cercanos a una ubicación.

**Query params:**
- `lat` (requerido): latitud
- `lng` (requerido): longitud
- `radius` (opcional): radio en km, default 5, max 50
- `type` (opcional): filtrar por tipo

**Response 200:**
```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "type": "perdido",
      "lat": 41.5463,
      "lng": 2.1086,
      "title": "Perro labrador perdido...",
      "distanceKm": 0.5
    }
  ]
}
```

## NOTIFICACIONES

### GET /notifications
Listar notificaciones del usuario.

**Query params:**
- `unreadOnly` (opcional): boolean
- `limit`: default 20

### PUT /notifications/{id}/read
Marcar notificación como leída.

### PUT /notifications/read-all
Marcar todas como leídas.

## PROTECTORAS

### GET /shelters
Listar protectoras.

**Query params:**
- `lat`, `lng`, `radius`: filtrar por proximidad
- `isVerified`: boolean

**Response 200:**
```json
{
  "data": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "name": "Protectora Sabadell",
      "phone": "937123456",
      "address": "Carrer de la Protectora, 1",
      "lat": 41.5463,
      "lng": 2.1086,
      "isVerified": true
    }
  ]
}
```

## CÓDIGOS DE ERROR

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| 400 | Bad Request | Datos inválidos |
| 401 | Unauthorized | Token inválido o expirado |
| 403 | Forbidden | No tienes permiso |
| 404 | Not Found | Recurso no existe |
| 409 | Conflict | Email ya registrado |
| 422 | Unprocessable | Validación fallida |
| 429 | Too Many Requests | Rate limit |
| 500 | Server Error | Error interno |

**Formato de Error:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El campo email es obligatorio",
    "details": {
      "email": ["Este campo no puede estar vacío"]
    }
  }
}
```

## RATE LIMITING
- **Auth**: 5 intentos/minuto
- **API general**: 100 requests/minuto por IP
- **Crear reportes**: 10/hora por usuario

## VERSIONADO
- La API usa versionado en URL: `/api/v1/...`
- Versiones futuras: `/api/v2/...` (mantener v1 durante 6 meses de deprecación)

