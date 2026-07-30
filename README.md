# 🐾 BuscoHuella

> **La aplicación colaborativa que encuentra mascotas perdidas en tu barrio.**

[![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)]()
[![Web](https://img.shields.io/badge/web-buscohuella.es-00C896)](https://buscohuella.es)
[![Licencia](https://img.shields.io/badge/licencia-propietaria-red)]()

---

## 📖 Qué es BuscoHuella

BuscoHuella es una plataforma web progresiva (PWA) que conecta a dueños de mascotas, vecinos, protectoras y ayuntamientos para localizar animales perdidos o encontrados en tiempo real mediante un mapa interactivo colaborativo.

**Piloto actual**: Sabadell, Vallès Occidental, Cataluña.

---

## 🚀 Estado del Proyecto

| Componente | Estado | Notas |
|------------|--------|-------|
| Landing page | ✅ En producción | https://buscohuella.es |
| Backend API | 🚧 En desarrollo | Symfony + PostgreSQL |
| Web App (PWA) | 🚧 En desarrollo | Angular / Next.js |
| Base de datos | 🚧 En desarrollo | PostgreSQL + PostGIS |
| App móvil nativa | 📋 Planificado | Fase 2 (React Native) |
| Panel admin | 📋 Planificado | Fase 2 |

**Waitlist**: 170+ personas esperando.

---

## 🏗️ Arquitectura

```text
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│   Web PWA   │──────▶│   Symfony   │──────▶│   PostgreSQL    │
│  (Angular)  │◄──────│     API     │◄──────│   + PostGIS     │
└─────────────┘       └─────────────┘       └─────────────────┘
       │
       ├─────────────────────┐
       ▼                     ▼
┌─────────────┐       ┌─────────────┐
│    MinIO    │       │    Redis    │
│   Storage   │       │    Cache    │
└─────────────┘       └─────────────┘
```

### Stack Técnico

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Backend | Symfony 6+, API Platform, Doctrine ORM | PHP 8.2 |
| Base de datos | PostgreSQL 15+, PostGIS | |
| Frontend Web | Angular / Next.js | PWA |
| App Móvil | PWA (Fase 1) → React Native (Fase 2) | |
| Mapas | Leaflet + OpenStreetMap | |
| Auth | JWT (LexikJWTAuthenticationBundle) | |
| Storage | MinIO (S3-compatible) | |
| Cache | Redis | |
| CI/CD | GitHub Actions | |

---

## 📁 Estructura del Proyecto

```text
buscohuella/
├── apps/                    # Aplicaciones desplegables
│   ├── web/                 # Web PWA
│   └── mobile/              # App móvil (futuro)
│
├── backend/                 # API Symfony
│   ├── src/
│   │   ├── Entity/          # Entidades Doctrine
│   │   ├── Controller/      # Controladores API
│   │   ├── Repository/      # Repositorios
│   │   ├── Service/         # Lógica de negocio
│   │   └── Security/        # Auth, Voters
│   ├── migrations/          # Migraciones de BD
│   └── tests/
│
├── docs/                    # Documentación
│   ├── architecture/        # Decisiones arquitectónicas
│   ├── api/                 # Contratos API
│   ├── database/            # Esquema de BD
│   ├── business/            # Visión y modelo de negocio
│   └── roadmap/             # Plan de desarrollo
│
├── frontend/                # Frontend web
│   ├── src/
│   │   ├── app/             # Páginas/rutas
│   │   ├── components/      # Componentes reutilizables
│   │   ├── services/        # Llamadas a API
│   │   └── assets/          # Imágenes, fuentes
│   └── public/
│
├── infra/                   # Infraestructura
│   ├── docker/              # Docker Compose
│   ├── nginx/               # Configuración nginx
│   └── scripts/             # Scripts de deploy
│
└── scripts/                 # Scripts de utilidad
    ├── setup.sh             # Setup inicial
    ├── migrate.sh           # Ejecutar migraciones
    └── seed.sh              # Datos de prueba
```

## 🛠️ Setup de Desarrollo

### Requisitos
- PHP 8.2+
- Composer
- PostgreSQL 15+ con PostGIS
- Node.js 18+
- Redis (opcional para Fase 1)
- Docker (opcional)

### Backend (Symfony)

```bash
cd backend
cp .env.example .env.local
composer install
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate
php bin/console doctrine:fixtures:load
symfony server:start
```

### Frontend (Angular)

```bash
cd frontend
npm install
npm run dev
```

### Con Docker (recomendado)

```bash
docker-compose up -d
# Acceso: http://localhost:8080
```

## 📚 Documentación

| Documento | Descripción | Ubicación |
|-----------|-------------|-----------|
| Documento Maestro | Visión completa del proyecto | `docs/business/DOCUMENTO_MAESTRO_v2.0.md` |
| Arquitectura | Decisiones técnicas y diagramas | `docs/architecture/ARCHITECTURE.md` |
| API Contract | Endpoints y contratos | `docs/api/API_CONTRACT.md` |
| Base de datos | Esquema ER y migraciones | `docs/database/DATABASE_SCHEMA.md` |
| Roadmap | Plan de desarrollo | `docs/roadmap/ROADMAP.md` |
| Ideas Futuras | Funcionalidades aparcadas | `docs/roadmap/IDEAS_FUTURAS.md` |

## 🤝 Cómo Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Guías de Contribución
- Seguir PSR-12 en PHP
- Seguir Angular Style Guide o Next.js conventions
- Todos los PRs requieren revisión de código
- Tests obligatorios para nuevas funcionalidades
- Documentación actualizada con cada cambio

### Guías de Contribución
- Seguir PSR-12 en PHP.
- Seguir Angular Style Guide o Next.js conventions.
- Todos los PRs requieren revisión de código.
- Tests obligatorios para nuevas funcionalidades.
- Documentación actualizada con cada cambio.

## 📜 Licencia

Proyecto propietario. Todos los derechos reservados.

## 📞 Contacto

- **Web**: https://buscohuella.es
- **Email**: [xavier@buscohuella.es]
- **LinkedIn**: Xavier Quesada Sevillano

> "Cada minuto cuenta. Todos merecen volver a casa."
