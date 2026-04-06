# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Expense Tracker — monorepo with npm workspaces containing a Next.js frontend and NestJS backend.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript
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
