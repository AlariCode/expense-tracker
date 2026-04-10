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

### Install Dependencies

```bash
npm install                 # From root — installs all workspaces
```

## Architecture

- `frontend/` — Next.js App Router, FSD architecture. See `frontend/CLAUDE.md`
- `backend/` — NestJS, CQRS + Repository pattern. See `backend/CLAUDE.md`
- `docker-compose.yml` — PostgreSQL 16 (db: `expence_tracker`, user/pass: `postgres/postgres`)

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

<important if="Нужно написать commit">
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

</important>

## Pull Requests (GitHub Flow)

- Title по Conventional Commits: `feat(scope): описание на русском`
- Перед созданием PR запустить `git diff main...HEAD` для составления описания
- Описание PR включает: что реализовано, затронутые эндпоинты, инструкцию по тестированию
- PR создаётся командой: `gh pr create --title "..." --body "..."`
- Ветка удаляется после мержа
