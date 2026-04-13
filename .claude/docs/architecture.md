# Архитектура проекта

## Обзор

Expense Tracker — монорепозиторий на **npm workspaces** с двумя приложениями:

- `frontend/` — Next.js 16 (App Router), клиентский SPA
- `backend/` — NestJS 11, REST API

Связь между ними: фронтенд делает HTTP-запросы к `/api/*` через `apiClient`, бэкенд слушает на порту `3001`.

---

## Backend

### Слои приложения

```
HTTP Request
    ↓
Controller          # Маршрутизация, валидация входных DTO, извлечение пользователя
    ↓
CommandBus / QueryBus  # CQRS-диспетчер
    ↓
Handler             # Бизнес-логика: проверки прав, преобразования
    ↓
Repository          # Единственная точка доступа к БД через Prisma
    ↓
PrismaService       # Обёртка над PrismaClient, подключение к PostgreSQL
```

### Паттерн CQRS

Модули `transaction`, `category`, `user` используют **CQRS** (`@nestjs/cqrs`):

- **Command** — объект с данными на запись (create/update/delete)
- **CommandHandler** — выполняет команду, содержит бизнес-логику
- **Query** — объект с параметрами чтения
- **QueryHandler** — возвращает данные, не меняет состояние
- `CommandBus.execute()` / `QueryBus.execute()` — диспетчеризация по типу класса

Модуль `auth` использует классический сервисный подход (`AuthService`) — там нет сложной бизнес-логики.

### Паттерн Repository

Каждый модуль с данными имеет `*.repository.ts`. Правила:

- Хэндлеры работают только с репозиторием, **не с PrismaService напрямую**
- Репозиторий — единственное место, где есть Prisma-запросы
- Это изолирует бизнес-логику от деталей хранилища

### Аутентификация

Схема: **JWT Bearer Token** через `passport-jwt`.

1. POST `/api/auth/login` или `/api/auth/register` → возвращает `accessToken`
2. Клиент кладёт токен в `localStorage` и отправляет в заголовке `Authorization: Bearer <token>`
3. `JwtStrategy` декодирует токен, кладёт `{ id, email }` в `request.user`
4. `@CurrentUser()` извлекает `request.user` в контроллере

Токен содержит payload: `{ sub: userId, email }`. Секрет читается из `JWT_SECRET`.

### Структура модулей

Каждый модуль самодостаточен:

```
module/
├── commands/
│   ├── *.command.ts      # Класс команды (данные)
│   └── *.handler.ts      # Обработчик команды
├── queries/
│   ├── *.query.ts        # Класс запроса (параметры)
│   └── *.handler.ts      # Обработчик запроса
├── dto/
│   └── *.dto.ts          # Валидация входных данных (class-validator)
├── *.repository.ts       # Работа с Prisma
├── *.controller.ts       # HTTP-маршруты
└── *.module.ts           # NestJS-модуль
```

### Глобальные настройки (main.ts)

- **Префикс**: все маршруты под `/api`
- **ValidationPipe**: `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true` — лишние поля отклоняются, типы приводятся автоматически
- **CORS**: разрешён для `http://localhost:3000`
- **Swagger UI**: доступен по `/api/docs`

---

## Frontend

### Архитектура — Feature-Sliced Design (FSD)

Слои (импорты только сверху вниз):

```
app          # Страницы, layouts, провайдеры
  ↓
widgets      # Сложные блоки UI из нескольких фич (Sidebar)
  ↓
features     # Юзер-стори с UI и логикой (auth, transaction-list)
  ↓
entities     # Типы и базовые хуки (user, transaction, category)
  ↓
shared       # Утилиты, UI-кит, api-client
```

**Правило публичного API**: внешние импорты из слайса только через `index.ts`. Прямые импорты из внутренних файлов запрещены.

### Слой `shared/api` — apiClient

Единый HTTP-клиент (`shared/api/api-client.ts`):

- Автоматически добавляет `Authorization: Bearer <token>` из `localStorage`
- При `401` очищает токен и редиректит на `/login`
- Выбрасывает `Error` с сообщением из ответа при `!response.ok`
- Базовый URL читается из `NEXT_PUBLIC_API_URL`

### Управление состоянием

- **Серверные данные**: хуки на `useEffect` + `useState` (`useTransactions`, `useSummary`, `useCategories`)
- **Аутентификация**: `UserContext` + `useAuth()` — проверка токена при монтировании через `/api/users/me`
- **Формы**: `react-hook-form` + `zod` — схемы валидации описываются в DTO-подобных объектах

### Роутинг и защита страниц

- `(auth)/` — публичные страницы: `/login`, `/register`
- `(dashboard)/` — защищённые страницы: `layout.tsx` проверяет `isAuthenticated`, редирект на `/login`
- Страницы: `/` (дашборд транзакций), `/categories`, `/profile`

### Pagination на фронтенде

Транзакции загружаются целиком, постраничная навигация реализована **на клиенте**: `useTransactions` разрезает массив по `PAGE_SIZE = 10`.

---

## Взаимодействие компонентов

```
[Browser]
  └── Next.js App
        ├── UserContext (проверяет /api/users/me при загрузке)
        ├── (dashboard)/layout.tsx → guard: redirect if !isAuthenticated
        └── pages
              ├── / (дашборд)
              │     ├── useTransactions() → GET /api/transactions
              │     ├── useSummary()      → GET /api/transactions/summary
              │     └── useCategories()   → GET /api/categories
              ├── /categories
              │     └── useCategories()   → GET /api/categories
              └── /profile
                    └── useAuth()         → GET /api/users/me

[NestJS API :3001]
  └── /api/*
        ├── AuthController    → AuthService (сервисный подход)
        ├── UserController    → UserService → QueryBus
        ├── CategoryController → CommandBus / QueryBus → CategoryRepository
        └── TransactionController → CommandBus / QueryBus → TransactionRepository
              └── PrismaService → PostgreSQL :5432
```
