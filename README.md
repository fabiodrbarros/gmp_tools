# GMP Tools — Premium B2B/B2C Website

Premium industrial e-commerce platform for diamond tools, CNC machines, stone/marble/granite/ceramic tools, Thibaut machines, and technical assistance services.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| UI Primitives | Radix UI + custom components |
| ORM | Prisma 7 |
| Database | PostgreSQL 16 |
| Auth | NextAuth v5 (Auth.js) |
| Payments | Stripe |
| Forms | React Hook Form + Zod |
| Container | Docker + Docker Compose |

## Quick Start (Local)

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (or Docker)

### 1. Clone and install
```bash
git clone <repo>
cd gmp-tools
npm install
```

### 2. Environment
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

Minimum required variables for local dev:
```env
DATABASE_URL="postgresql://gmptools:password@localhost:5432/gmptools"
AUTH_SECRET="any-random-string-32-chars"
```

### 3. Database
```bash
# Push schema (no migrations, dev only)
npm run db:push

# Or use migrations
npm run db:migrate

# Seed with demo data
npm run db:seed
```

### 4. Run dev server
```bash
npm run dev
```

Visit `http://localhost:3000`

**Demo credentials (after seed):**
- Admin: `admin@gmptools.pt` / `admin123` → `/admin`
- Customer: `joao@empresa.pt` / `cliente123` → `/cliente`

---

## Docker Setup

### Development (DB only)
Run only PostgreSQL in Docker, app locally:
```bash
docker compose up postgres -d
```
Set `DATABASE_URL=postgresql://gmptools:gmptools_secret@localhost:5432/gmptools`

### Full stack
```bash
# Build and start everything
docker compose up --build -d

# Run migrations inside container
docker compose exec app npx prisma db push
docker compose exec app npx prisma db seed
```

Visit `http://localhost:3000`

### Stop
```bash
docker compose down
# Remove volumes too (wipes DB):
docker compose down -v
```

---

## Project Structure

```
gmp-tools/
├── app/                        # Next.js App Router
│   ├── page.tsx                # Homepage
│   ├── produtos/               # Product catalog + detail
│   ├── maquinas/               # Machines catalog + detail
│   ├── servicos/               # Services
│   ├── assistencia/            # Technical assistance form
│   ├── marcas/                 # Brands + brand detail
│   ├── blog/                   # Blog list + post
│   ├── sobre/                  # About
│   ├── contactos/              # Contact
│   ├── carrinho/               # Cart
│   ├── checkout/               # Checkout
│   ├── cliente/                # Customer area
│   ├── admin/                  # Admin panel
│   └── api/auth/               # NextAuth API routes
├── components/
│   ├── ui/                     # Design system
│   ├── site/                   # Public site components
│   └── admin/                  # Admin panel components
├── lib/
│   ├── db.ts                   # Prisma singleton
│   ├── auth.ts                 # NextAuth config
│   └── utils.ts                # Utilities
├── prisma/
│   ├── schema.prisma           # Full DB schema
│   └── seed.ts                 # Demo data seeder
├── types/index.ts              # Shared TypeScript types
├── Dockerfile                  # Production Docker image
├── docker-compose.yml          # App + PostgreSQL services
└── .env.example                # Environment variables template
```

---

## Pages Overview

### Public Site
| Route | Description |
|-------|-------------|
| `/` | Homepage — hero, categories, products, Thibaut, services, brands, testimonials |
| `/produtos` | Product catalog with search, filters, sort, grid/list toggle |
| `/produtos/[slug]` | Product detail — gallery, specs, cart, quote, WhatsApp |
| `/maquinas` | Machines catalog — featured Thibaut section |
| `/maquinas/[slug]` | Machine detail — gallery, specs, quote form |
| `/servicos` | Services — 6 services with process timeline |
| `/assistencia` | Technical assistance request form |
| `/marcas` | All brands — Thibaut featured |
| `/marcas/[slug]` | Individual brand page |
| `/blog` | Blog listing with categories |
| `/blog/[slug]` | Blog post with markdown rendering |
| `/sobre` | About — mission, timeline, team |
| `/contactos` | Contact page with map |
| `/carrinho` | Cart with cart + quote items |
| `/checkout` | 4-step checkout flow |
| `/categorias/[slug]` | Category-filtered product listing |

### Customer Area
| Route | Description |
|-------|-------------|
| `/cliente` | Dashboard — overview, recent orders |
| `/cliente/encomendas` | Order history with status |
| `/cliente/orcamentos` | Quote requests |
| `/cliente/favoritos` | Wishlist |

### Admin Panel
| Route | Description |
|-------|-------------|
| `/admin` | Dashboard — metrics, charts, recent activity |
| `/admin/produtos` | Products list with filters and bulk actions |
| `/admin/produtos/novo` | New product form |
| `/admin/categorias` | Categories CRUD |
| `/admin/maquinas` | Machines CRUD |
| `/admin/encomendas` | Orders management |
| `/admin/orcamentos` | Quotes management |
| `/admin/assistencia` | Assistance requests with urgency alerts |
| `/admin/clientes` | Customer management |
| `/admin/blog` | Blog posts CRUD |
| `/admin/configuracoes` | Site settings |
| `/admin/utilizadores` | Admin user management |

---

## Design System

### Colors
- **Red**: `#DC2626` (primary action, accents)
- **Black**: `#0A0A0A` (headings, strong text)
- **White**: `#FFFFFF` (backgrounds)
- **Gray scale**: `gray-50` to `gray-950`

### UI Components (`components/ui/`)
- `Button` — 7 variants, 5 sizes, loading state
- `Input` — with label, error, hint, left/right icon
- `Textarea`, `Select` — same pattern
- `Badge` — 7 variants
- `Card`, `Separator`, `Skeleton`, `Toast`

---

## Environment Variables

See [.env.example](.env.example) for all variables.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | NextAuth secret (32+ chars) |
| `STRIPE_SECRET_KEY` | For payments | Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | For payments | Stripe public key |
| `RESEND_API_KEY` | For email | Resend email service |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional | WhatsApp button number |

---

## Production Deployment

### Vercel / other platforms
Set all environment variables in the platform dashboard. `DATABASE_URL` must point to a production PostgreSQL instance (Supabase, Neon, Railway, etc.).

After deploy:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### Docker
```bash
docker compose up --build -d
docker compose exec app npx prisma db push
docker compose exec app npx prisma db seed
```

---

## License

Proprietary — GMP Tools © 2026
