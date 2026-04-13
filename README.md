# Expense Tracker

Приложение для учёта личных финансов. Монорепозиторий с Next.js-фронтендом и NestJS-бэкендом.

## Стек технологий

| Часть       | Технологии                                                              |
|-------------|-------------------------------------------------------------------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui, react-hook-form, Zod, TanStack Query |
| **Backend**  | NestJS 11, TypeScript, CQRS, Prisma 6, PostgreSQL 16, Passport JWT     |
| **Инфра**    | Docker Compose (PostgreSQL), npm workspaces                            |

---

## Требования

- **Node.js** >= 20
- **npm** >= 10
- **Docker** и **Docker Compose** (для PostgreSQL)

---

## Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone <repo-url>
cd expence-tracker
```

### 2. Установить зависимости

```bash
npm install
```

### 3. Настроить переменные окружения

**Backend** — создать файл `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expence_tracker
JWT_SECRET=your-secret-key
```

**Frontend** — создать файл `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Запустить базу данных

```bash
docker compose up -d
```

PostgreSQL запустится на порту `5432`. База данных: `expence_tracker`, пользователь/пароль: `postgres/postgres`.

### 5. Применить миграции

```bash
npm run prisma:migrate --workspace=backend
```

### 6. Запустить приложения

```bash
# В двух отдельных терминалах:
npm run dev:backend    # NestJS API  → http://localhost:3001
npm run dev:frontend   # Next.js UI  → http://localhost:3000
```

---

## Переменные окружения

### Backend (`backend/.env`)

| Переменная     | Пример                                                              | Описание                                         |
|----------------|---------------------------------------------------------------------|--------------------------------------------------|
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/expence_tracker`     | Строка подключения к PostgreSQL (Prisma формат)  |
| `JWT_SECRET`   | `supersecretkey`                                                    | Секрет для подписи JWT-токенов                   |

### Frontend (`frontend/.env.local`)

| Переменная              | Пример                    | Описание                              |
|-------------------------|---------------------------|---------------------------------------|
| `NEXT_PUBLIC_API_URL`   | `http://localhost:3001`   | Базовый URL бэкенда (без `/api`)      |

---

## Структура проекта

```
expence-tracker/
├── frontend/                  # Next.js приложение (FSD-архитектура)
│   └── src/
│       ├── app/               # Страницы и layouts (App Router)
│       │   ├── (auth)/        # Логин, регистрация
│       │   └── (dashboard)/   # Дашборд, категории, профиль
│       ├── widgets/           # Составные UI-блоки (sidebar)
│       ├── features/          # Фичи: auth, transaction-list
│       ├── entities/          # Типы: user, transaction, category
│       └── shared/            # api-client, хуки, утилиты, shadcn/ui
│
├── backend/                   # NestJS приложение
│   └── src/
│       ├── auth/              # Регистрация, логин, JWT-стратегия
│       ├── user/              # Профиль пользователя
│       ├── category/          # CRUD категорий (CQRS)
│       ├── transaction/       # CRUD транзакций + сводка (CQRS)
│       └── prisma/            # PrismaService
│
├── docker-compose.yml         # PostgreSQL 16
└── package.json               # npm workspaces
```

---

## API эндпоинты

Базовый URL: `http://localhost:3001/api`

Swagger UI: `http://localhost:3001/api/docs`

### Auth

| Метод  | Путь               | Auth | Описание                         |
|--------|--------------------|------|----------------------------------|
| POST   | `/auth/register`   | —    | Регистрация, возвращает JWT      |
| POST   | `/auth/login`      | —    | Вход, возвращает JWT             |

Пример ответа:
```json
{
  "accessToken": "eyJhbGci...",
  "user": { "id": 1, "name": "Иван", "email": "user@example.com" }
}
```

### Users

| Метод | Путь          | Auth | Описание                   |
|-------|---------------|------|----------------------------|
| GET   | `/users/me`   | JWT  | Профиль текущего пользователя |

### Categories

| Метод  | Путь                  | Auth | Описание              |
|--------|-----------------------|------|-----------------------|
| GET    | `/categories`         | JWT  | Список категорий      |
| POST   | `/categories`         | JWT  | Создать категорию     |
| PATCH  | `/categories/:id`     | JWT  | Обновить категорию    |
| DELETE | `/categories/:id`     | JWT  | Удалить категорию     |

### Transactions

| Метод  | Путь                        | Auth | Описание                            |
|--------|-----------------------------|------|-------------------------------------|
| GET    | `/transactions`             | JWT  | Список транзакций (с фильтрами)     |
| POST   | `/transactions`             | JWT  | Создать транзакцию                  |
| GET    | `/transactions/summary`     | JWT  | Сводка (доходы/расходы) за месяц   |
| GET    | `/transactions/:id`         | JWT  | Транзакция по ID                    |
| PATCH  | `/transactions/:id`         | JWT  | Обновить транзакцию                 |
| DELETE | `/transactions/:id`         | JWT  | Удалить транзакцию                  |

#### Фильтры GET `/transactions`

| Параметр     | Тип                  | Описание                          |
|--------------|----------------------|-----------------------------------|
| `dateFrom`   | ISO-8601 строка      | Нижняя граница периода            |
| `dateTo`     | ISO-8601 строка      | Верхняя граница периода           |
| `type`       | `INCOME` / `EXPENSE` | Тип транзакции                    |
| `categoryId` | number               | ID категории                      |

#### Параметры GET `/transactions/summary`

| Параметр | Тип    | Описание             |
|----------|--------|----------------------|
| `month`  | 1–12   | Номер месяца         |
| `year`   | ≥ 2000 | Год                  |

Пример ответа:
```json
{
  "totalIncome": 120000,
  "totalExpense": 85000,
  "balance": 35000
}
```

---

## Полезные команды

```bash
# Разработка
npm run dev:frontend              # Next.js dev server (порт 3000)
npm run dev:backend               # NestJS watch mode (порт 3001)
docker compose up -d              # Запустить PostgreSQL

# Сборка
npm run build:frontend
npm run build:backend

# База данных
npm run prisma:migrate --workspace=backend   # Применить миграции
npm run prisma:generate --workspace=backend  # Сгенерировать Prisma Client

# Качество кода
npm run lint                      # ESLint по всем воркспейсам
npm run format                    # Prettier по всем файлам
```

---

## База данных

Схема содержит три модели:

- **User** — пользователь (id, name, email, password)
- **Category** — категория транзакции (name, color, icon), принадлежит User
- **Transaction** — транзакция (amount, type: `INCOME`/`EXPENSE`, date, description), привязана к Category и User

Все каскадные удаления настроены: удаление пользователя удаляет его категории и транзакции.
