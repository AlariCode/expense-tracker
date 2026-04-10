## Backend Architecture

NestJS 11, Prisma 6, PostgreSQL. Entry: `src/main.ts`. API prefix `/api`, port 3001. CORS разрешён для `http://localhost:3000`.

### Global Pipes

- `ValidationPipe` с `whitelist`, `forbidNonWhitelisted`, `transform` — невалидные поля отклоняются автоматически

### Modules

```
src/
├── prisma/              # PrismaService — обёртка над Prisma Client
├── auth/                # Аутентификация (JWT)
│   ├── guards/          # JwtAuthGuard
│   ├── decorators/      # @CurrentUser()
│   ├── strategies/      # jwt.strategy.ts
│   └── dto/             # LoginDto, RegisterDto
├── user/                # Пользователи (без контроллера, только CQRS)
│   ├── commands/        # CreateUserCommand
│   ├── queries/         # GetUserByEmail, GetUserById
│   └── dto/             # CreateUserDto
├── category/            # Категории (CQRS)
│   ├── commands/        # Create, Update, Delete
│   ├── queries/         # GetCategoriesByUser
│   └── dto/             # CreateCategoryDto, UpdateCategoryDto
└── transaction/         # Транзакции (CQRS)
    ├── commands/        # Create, Update, Delete
    ├── queries/         # GetTransactions, GetTransactionById, GetSummary
    └── dto/             # CreateTransactionDto, UpdateTransactionDto, GetTransactionsDto, GetSummaryDto
```

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | - | Регистрация |
| POST | /api/auth/login | - | Логин |
| GET | /api/auth/me | JWT | Текущий пользователь |
| GET | /api/categories | JWT | Категории пользователя |
| POST | /api/categories | JWT | Создать категорию |
| PATCH | /api/categories/:id | JWT | Обновить категорию |
| DELETE | /api/categories/:id | JWT | Удалить категорию |
| GET | /api/transactions | JWT | Список транзакций (фильтры, пагинация) |
| GET | /api/transactions/summary | JWT | Сводка по месяцу/году |
| GET | /api/transactions/:id | JWT | Транзакция по ID |
| POST | /api/transactions | JWT | Создать транзакцию |
| PATCH | /api/transactions/:id | JWT | Обновить транзакцию |
| DELETE | /api/transactions/:id | JWT | Удалить транзакцию |

### Patterns

- **CQRS** (CommandBus/QueryBus) в модулях category, transaction, user. Auth использует классический сервисный подход
- **Repository pattern** — каждый модуль с данными имеет `*.repository.ts` для работы с Prisma
- Все защищённые эндпоинты используют `@UseGuards(JwtAuthGuard)` и `@CurrentUser()` для получения пользователя

### Database (Prisma)

Schema: `prisma/schema.prisma`. Models: User, Category, Transaction (enum TransactionType: INCOME, EXPENSE).

```bash
npm run prisma:generate     # Генерация клиента
npm run prisma:migrate      # Применение миграций
```

### Environment Variables

Create `backend/.env`:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expence_tracker
JWT_SECRET=your-secret-key
```
