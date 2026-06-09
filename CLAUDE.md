# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend (`/frontend`)
```bash
pnpm dev          # Dev server (compiles WASM first, then Vite on :5173)
pnpm build        # Production build (compiles WASM first)
pnpm preview      # Preview production build
pnpm wasm:build   # Compile C++ particles to WASM via Emscripten
pnpm format       # Prettier + C++ formatting
```

### Backend (`/backend`)
```bash
pnpm dev          # Local Cloudflare Worker dev server on :8787
pnpm deploy       # Deploy to Cloudflare (minified)
pnpm db:generate  # Generate Drizzle migrations from schema changes
pnpm db:migrate   # Run pending migrations against Neon DB
pnpm db:studio    # Open Drizzle Studio UI
pnpm cf-typegen   # Regenerate Cloudflare bindings types
pnpm auth:hash-password  # Hash a password for admin auth setup
pnpm format       # Prettier
```

## Architecture

This is a TypeScript monorepo with a React SPA frontend and a Cloudflare Workers backend. The frontend proxies `/api` → `localhost:8787` in dev; production uses `VITE_API_BASE_URL`.

### Frontend (`/frontend/src`)
- **Routing**: TanStack Router with filesystem-based routes in `src/routes/`. Routes auto-generate; run dev server to pick up new route files.
- **Data fetching**: TanStack Query v5. Query hooks live in `src/api/`. The `apiFetch()` client handles JSON/FormData and forwards credentials.
- **Forms**: React Hook Form v7.
- **Styling**: SCSS modules + global variables. Global styles in `src/assets/styles/` are injected into every file via Vite's `preprocessorOptions.scss.additionalData`. Use `index.module.scss` per component directory.
- **UI primitives**: Base UI React v1.4 (headless).
- **Path alias**: `@/` → `src/`.
- **Special subsystems**:
  - `src/wasm/` — Emscripten-compiled C++ particle system (`particles.cpp`). Rebuild with `pnpm wasm:build` after C++ changes.
  - `src/gpu/` — WebGPU canvas initialization.
  - `src/providers/` — React context tree: `GlobalProvider` wraps `ThemeProvider`, `ApiProvider`, `AuthProvider`.

### Backend (`/backend/src`)
- **Runtime**: Hono 4 on Cloudflare Workers.
- **Routes**: mounted in `src/index.ts`. Features are in `src/features/` (auth, posts, media, contact, admin).
- **Database**: PostgreSQL via Neon (serverless), accessed through Drizzle ORM. Schema in `src/db/schema.ts`; migrations in `drizzle/`.
- **Auth**: Cookie-based JWT. PBKDF2 password hashing. Admin-only; no public registration.
- **Storage**: Cloudflare R2 bound as `MEDIA_BUCKET`. Public media URL from `PUBLIC_MEDIA_URL` env var.
- **Validation**: Zod v4 + Hono Zod validator middleware.

### API surface
```
POST /auth/login          Admin login (sets JWT cookie)
GET  /auth/logout         Clear JWT cookie
GET  /posts               List published posts
GET  /posts/:slug         Single post
POST /contact             Contact form submission
GET  /media               List media assets
/admin/posts/*            Admin post CRUD
/admin/media/*            Admin media management
```

### Database schema (Neon PostgreSQL)
Key tables: `posts`, `post_revisions`, `post_tags`, `post_media`, `tags`, `media_assets`, `contact_requests`. Enums: `post_type`, `post_status`, `contact_status`, `media_usage_type`.

### Environment / secrets
- Backend secrets (`DATABASE_URL`, `AUTH`, `JWT`) live in `backend/.dev.vars` locally and Wrangler secrets in production — never committed.
- Backend env vars (`PUBLIC_APP_ORIGIN`, `PUBLIC_MEDIA_URL`) are in `wrangler.jsonc`.
- Frontend env: `VITE_API_BASE_URL` (optional; dev proxy covers local).
