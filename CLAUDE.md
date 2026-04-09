# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Expense Tracker — monorepo with npm workspaces containing a Next.js frontend and NestJS backend.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript, shadcn/ui, react-hook-form, zod
- **Backend**: NestJS 11, Prisma 6, PostgreSQL, TypeScript
- **Package Manager**: npm workspaces (root `package.json` defines `frontend` and `backend` workspaces)

## Commands

### Development
```bash
npm run dev:frontend        # Next.js dev server
npm run dev:backend         # NestJS watch mode
docker compose up -d        # Start PostgreSQL on port 5432
```

### Build
```bash
npm run build:frontend
npm run build:backend
```

### Linting & Formatting
```bash
npm run lint                # Lint all workspaces
npm run format              # Prettier across all files
```

### Prisma (run from backend/)
```bash
npm run prisma:generate     # Generate Prisma client
npm run prisma:migrate      # Run migrations
```

### Install Dependencies
```bash
npm install                 # From root — installs all workspaces
```

## Architecture

- `frontend/` — Next.js App Router. Entry: `src/app/layout.tsx`, `src/app/page.tsx`. Path alias `@/*` maps to `src/*`.
- `backend/` — NestJS. Entry: `src/main.ts`. API prefix `/api`, port 3001. Prisma schema in `prisma/schema.prisma`.
- `docker-compose.yml` — PostgreSQL 16 (db: `expence_tracker`, user/pass: `postgres/postgres`).
- Database URL configured via `DATABASE_URL` env var (see `backend/.env.example`).

## Frontend Architecture — Feature-Sliced Design (FSD)

The frontend follows [Feature-Sliced Design](https://feature-sliced.design/) methodology. Layers (top to bottom, imports only flow downward):

```
src/
├── app/                    # Next.js App Router pages & layouts
│   ├── (auth)/             # Route group — login, register
│   └── (dashboard)/        # Route group — main dashboard (auth guard)
│       ├── page.tsx         # Transactions dashboard
│       ├── categories/      # Categories page
│       └── profile/         # User profile page
├── widgets/                # Composite UI blocks (composed from features/entities)
│   └── sidebar/            # App sidebar with navigation and user info
├── features/               # User-facing features (business logic + UI)
│   ├── auth/               # Login/register
│   └── transaction-list/   # Transaction list with pagination + summary
├── entities/               # Business entities (data models)
│   ├── user/               # User, AuthResponse types
│   ├── transaction/        # Transaction, TransactionType, TransactionSummary
│   └── category/           # Category type
└── shared/                 # Framework-agnostic utilities & UI kit
    ├── api/                # Base HTTP client (api-client.ts) — auto-attaches JWT
    ├── hooks/              # Shared hooks (use-auth.ts)
    ├── lib/utils.ts        # cn() utility (clsx + tailwind-merge)
    └── ui/                 # shadcn/ui components
```

### FSD Rules
- Each layer can only import from layers **below** it: `app` → `widgets` → `features` → `entities` → `shared`
- External imports from a slice go through its `index.ts` (public API)
- shadcn/ui components live in `shared/ui/` — configured via `components.json` (aliases: `@/shared/ui`, `@/shared/lib/utils`)
- Forms use `react-hook-form` + `zod` for validation

## Branching (GitHub Flow)

Используем [GitHub Flow](https://docs.github.com/en/get-started/using-github-docs/github-flow):

- `main` — стабильная ветка, всегда готова к деплою
- Для каждой новой фичи/бага создаётся отдельная ветка от `main`
- Формат имён веток: `feature/<название>` для фич, `fix/<название>` для багфиксов
- После завершения работы — Pull Request в `main`, code review, merge
- После мержа фича-ветка удаляется

Примеры:
```
feature/main-page
feature/transactions
fix/login-validation
```

## Commits

Используем [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): краткое описание на русском языке
```

- **type**: `feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `test`, `perf`, `ci`, `build`
- **scope**: `backend`, `frontend` или конкретный модуль (`auth`, `transactions`, `prisma` и т.д.)
- Описание на русском, с маленькой буквы, без точки в конце
- Body (опционально) — подробности через пустую строку

Примеры:
```
feat(backend): добавить модуль транзакций
fix(frontend): исправить валидацию формы регистрации
refactor(auth): вынести JWT-логику в отдельный сервис
docs: обновить CLAUDE.md
```

### Environment Variables (Frontend)
Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```
