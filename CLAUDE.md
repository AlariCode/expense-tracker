## Project Overview

Expense Tracker — приложение для учёта личных финансов. Монорепозиторий на npm workspaces: Next.js фронтенд + NestJS бэкенд.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript, shadcn/ui, react-hook-form, zod
- **Backend**: NestJS 11, Prisma 6, PostgreSQL 16, TypeScript, CQRS, Passport JWT, Swagger
- **Package Manager**: npm workspaces (root `package.json` defines `frontend` and `backend` workspaces)

## Environment Variables

**`backend/.env`:**
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expence_tracker
JWT_SECRET=your-secret-key
```

**`frontend/.env.local`:**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Commands

### Development

```bash
docker compose up -d        # Запустить PostgreSQL (порт 5432)
npm run dev:frontend        # Next.js dev server → http://localhost:3000
npm run dev:backend         # NestJS watch mode  → http://localhost:3001
```

### Build

```bash
npm run build:frontend
npm run build:backend
```

### Database

```bash
npm run prisma:migrate --workspace=backend   # Применить миграции
npm run prisma:generate --workspace=backend  # Обновить Prisma Client
```

### Linting & Formatting

```bash
npm run lint                # ESLint по всем воркспейсам
npm run format              # Prettier по всем файлам
```

### Install Dependencies

```bash
npm install                 # Из корня — устанавливает все воркспейсы
```

## Architecture

- `frontend/` — Next.js App Router, FSD-архитектура. See `frontend/CLAUDE.md`
- `backend/` — NestJS, CQRS + Repository pattern. See `backend/CLAUDE.md`
- `docker-compose.yml` — PostgreSQL 16 (db: `expence_tracker`, user/pass: `postgres/postgres`)
- Swagger UI: `http://localhost:3001/api/docs`

## Documentation

Внутренняя документация проекта находится в `.claude/docs/`:

| Файл | Содержание |
|------|------------|
| [`architecture.md`](.claude/docs/architecture.md) | Архитектура backend (CQRS, Repository, JWT) и frontend (FSD, apiClient) |
| [`api.md`](.claude/docs/api.md) | Детальное описание всех API-эндпоинтов |
| [`database.md`](.claude/docs/database.md) | Схема БД, цель каждого поля, каскады удаления |
| [`developer-guide.md`](.claude/docs/developer-guide.md) | Гайд по добавлению модулей, соглашения, отладка |

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

## Обновление docs

При добавлении функционала, проверяй документацию в @.claude/docs/\* и актуализируй
