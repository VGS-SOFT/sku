# SKU Engine — Backend API

Production-grade automated SKU generation engine.

## Stack
- **Framework**: NestJS 10 (TypeScript)
- **ORM**: Prisma 5 + MySQL 8.0
- **Cache**: Redis 7
- **Auth**: JWT access (15min) + refresh (7d) via httpOnly cookies
- **Docs**: Swagger at `/api/docs` (dev/staging only)

## Environments

| Env | Command | Notes |
|-----|---------|-------|
| Development | `npm run start:dev` | Hot reload, verbose logs |
| Test | `npm run test` / `npm run test:e2e` | Jest + Supertest |
| Production | `npm run start:prod` | Compiled dist |

## Quick Start
```bash
cp .env.example .env          # fill in values
docker-compose up -d           # MySQL 8 + Redis 7 + Adminer
npm install
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
# API: http://localhost:3001
# Docs: http://localhost:3001/api/docs
# Adminer: http://localhost:8080
```

## Project Structure
```
src/
├── modules/
│   ├── auth/          # JWT login, refresh, logout
│   ├── masters/       # Top-level catalog masters
│   ├── categories/    # N-level category tree
│   ├── variants/      # Variant types & values
│   ├── skus/          # SKU engine (core algorithm)
│   ├── import/        # Bulk import + keyword mapper
│   ├── audit/         # Audit log
│   ├── templates/     # SKU templates
│   └── health/        # Health check endpoint
├── common/
│   ├── config/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
└── prisma/
prisma/
├── schema.prisma
└── seed.ts
```

## Hostinger VPS Deploy
See `docs/DEPLOY.md`
