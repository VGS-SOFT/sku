# SKU Generator - Backend

NestJS + TypeORM + MySQL backend for the SKU Generator system.

## Prerequisites

- Node.js v18+
- MySQL 8.x running
- NestJS CLI: `npm install -g @nestjs/cli`

## Setup

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Create the MySQL database (one time only)
mysql -u root -p
# Then run:
CREATE DATABASE sku_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;

# 4. The .env file is already configured
# DB_SYNC=true will auto-create all tables on first run

# 5. Start development server
npm run start:dev
```

Server runs at: **http://localhost:3001/api**

## Architecture

```
src/
├── common/
│   ├── entities/base.entity.ts      # id, createdAt, updatedAt, deletedAt
│   ├── filters/http-exception.filter.ts  # Global error handler
│   └── response/api-response.ts     # Consistent API response shape
├── modules/
│   ├── category/                    # N-level category tree + attribute schema
│   ├── code-registry/              # Global immutable short-code store
│   ├── product/                     # Product catalog
│   └── sku-engine/                  # Pure SKU assembly logic
└── app.module.ts
```

## API Endpoints

### Code Registry
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/code-registry | Register a new short code |
| GET | /api/code-registry | List all codes (filter by ?type=COLOR) |
| GET | /api/code-registry/:id | Get single code |
| PATCH | /api/code-registry/:id | Update label/description (code is immutable) |
| DELETE | /api/code-registry/:id | Delete (only if not yet used in any SKU) |

### Categories
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/categories | Create category or sub-category |
| GET | /api/categories | List root categories |
| GET | /api/categories/tree | Full N-level tree |
| GET | /api/categories/:id | Single category with children |
| GET | /api/categories/:id/path | Root-to-node path (used for SKU) |
| PATCH | /api/categories/:id | Update category |
| DELETE | /api/categories/:id | Delete (if no children) |

### Products
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/products | Create product + auto-generate SKU |
| GET | /api/products | List all products (search with ?search=query) |
| GET | /api/products/:id | Single product |
| GET | /api/products/by-sku/:sku | Find by SKU |
| PATCH | /api/products/:id | Update title/desc only (SKU immutable) |
| DELETE | /api/products/:id | Soft delete |

### SKU Engine
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/sku-engine/preview | Preview SKU without saving |

## SKU Format

```
[CAT1]-[CAT2]-...[CATn]-[ATTR1]-[ATTR2]-...[ATTRn]

Example:
VST-CTN-PVA-WHTCLR-04
└───┘ └──┘ └──┘ └─────┘ └┘
Vastra Cotton PlainVagha WhiteColor Size4
```

## Key Design Rules

1. **Codes are globally unique** - enforced at CodeRegistry creation
2. **Codes are immutable once used** - enforced before any SKU appears
3. **Schema locks attribute order** - defined per leaf category
4. **Optional attributes use placeholder `na`** - never skip a segment
5. **Soft deletes only** - nothing is ever physically deleted
6. **SKU is immutable** - changing product attributes = new product
