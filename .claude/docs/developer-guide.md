# Гайд для разработчиков

---

## Первый запуск

```bash
git clone <repo-url>
cd expence-tracker

# 1. Зависимости
npm install

# 2. Переменные окружения
cp /dev/null backend/.env
echo 'DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expence_tracker' >> backend/.env
echo 'JWT_SECRET=devsecret' >> backend/.env

echo 'NEXT_PUBLIC_API_URL=http://localhost:3001' > frontend/.env.local

# 3. База данных
docker compose up -d

# 4. Миграции
npm run prisma:migrate --workspace=backend

# 5. Запуск (два терминала)
npm run dev:backend    # порт 3001
npm run dev:frontend   # порт 3000
```

---

## Как добавить новый backend-модуль

Пример: модуль `budget`.

### 1. Создать структуру папок

```
backend/src/budget/
├── commands/
├── queries/
├── dto/
├── budget.repository.ts
├── budget.controller.ts
└── budget.module.ts
```

### 2. Написать Repository

```ts
// budget.repository.ts
@Injectable()
export class BudgetRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { ... }): Promise<Budget> {
    return this.prisma.budget.create({ data });
  }
}
```

### 3. Написать Command + Handler

```ts
// commands/create-budget.command.ts
export class CreateBudgetCommand {
  constructor(
    public readonly userId: number,
    public readonly limit: number,
  ) {}
}

// commands/create-budget.handler.ts
@CommandHandler(CreateBudgetCommand)
export class CreateBudgetHandler implements ICommandHandler<CreateBudgetCommand> {
  constructor(private readonly budgetRepository: BudgetRepository) {}

  async execute(command: CreateBudgetCommand): Promise<Budget> {
    return this.budgetRepository.create({ ... });
  }
}
```

### 4. Написать Controller с Swagger-декораторами

```ts
@ApiTags('budgets')
@ApiBearerAuth('JWT')
@ApiUnauthorizedResponse({ description: 'JWT отсутствует или невалиден' })
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiOperation({ summary: 'Создать бюджет' })
  @ApiCreatedResponse({ description: 'Бюджет создан' })
  @ApiBadRequestResponse({ description: 'Невалидное тело' })
  @Post()
  create(@Body() dto: CreateBudgetDto, @CurrentUser() user: { id: number }) {
    return this.commandBus.execute(new CreateBudgetCommand(user.id, dto.limit));
  }
}
```

### 5. Собрать модуль

```ts
@Module({
  imports: [CqrsModule],
  controllers: [BudgetController],
  providers: [BudgetRepository, CreateBudgetHandler],
})
export class BudgetModule {}
```

### 6. Зарегистрировать в AppModule

```ts
// app.module.ts
imports: [..., BudgetModule]
```

### 7. Обновить документацию

- Добавить JSDoc на все методы контроллера, хэндлеров и репозитория
- Добавить `@ApiProperty` на все поля DTO
- Обновить `backend/CLAUDE.md` — добавить модуль в таблицу эндпоинтов

---

## Как добавить новую frontend-фичу

Пример: фича `budget-form`.

### 1. Определить слой

| Что добавляем | Слой |
|---------------|------|
| Тип `Budget` | `entities/budget/model/types.ts` |
| API-функция `budgetsApi.create()` | `entities/budget/api/budgets.api.ts` |
| Хук `useCreateBudget()` | `features/budget-form/model/` |
| Форма `BudgetForm` | `features/budget-form/ui/` |
| Страница `/budget` | `app/(dashboard)/budget/page.tsx` |

### 2. Создать тип сущности

```ts
// entities/budget/model/types.ts
export interface Budget {
  id: number;
  userId: number;
  limit: number;
  month: number;
  year: number;
}
```

### 3. Создать API-клиент

```ts
// entities/budget/api/budgets.api.ts
import { apiClient } from '@/shared/api/api-client';

export const budgetsApi = {
  create: (data: { limit: number; month: number; year: number }) =>
    apiClient<Budget>('/api/budgets', { method: 'POST', body: JSON.stringify(data) }),
};
```

### 4. Создать хук

```ts
// features/budget-form/model/use-create-budget.ts
export function useCreateBudget() {
  const [isLoading, setIsLoading] = useState(false);

  const createBudget = async (data: CreateBudgetData) => {
    setIsLoading(true);
    try {
      await budgetsApi.create(data);
    } finally {
      setIsLoading(false);
    }
  };

  return { createBudget, isLoading };
}
```

### 5. Создать публичный API через index.ts

```ts
// features/budget-form/index.ts
export { BudgetForm } from './ui/budget-form';
export { useCreateBudget } from './model/use-create-budget';
```

### 6. Правила FSD при написании кода

- Импортировать только из слоёв **ниже** текущего
- Никаких импортов из `../../../entities/user/model/types` — только через `@/entities/user`
- Компоненты страниц (`app/`) могут импортировать из всех слоёв
- `shared/ui` — только shadcn/ui компоненты, без бизнес-логики

---

## Как изменить схему базы данных

1. Отредактировать `backend/prisma/schema.prisma`
2. Создать и применить миграцию:
   ```bash
   npm run prisma:migrate --workspace=backend
   # Введите название миграции, например: add-budget-model
   ```
3. Сгенерировать Prisma Client:
   ```bash
   npm run prisma:generate --workspace=backend
   ```
4. Если новое поле `NOT NULL` без default — добавить `backfill` в миграцию вручную

---

## Соглашения по коду

### Именование файлов

| Что                  | Формат              | Пример                        |
|----------------------|---------------------|-------------------------------|
| NestJS-контроллер    | `*.controller.ts`   | `transaction.controller.ts`   |
| NestJS-сервис        | `*.service.ts`      | `auth.service.ts`             |
| Репозиторий          | `*.repository.ts`   | `transaction.repository.ts`   |
| CQRS-команда         | `*.command.ts`      | `create-transaction.command.ts` |
| CQRS-хэндлер         | `*.handler.ts`      | `create-transaction.handler.ts` |
| DTO                  | `*.dto.ts`          | `create-transaction.dto.ts`   |
| React-компонент      | PascalCase `.tsx`   | `TransactionList.tsx`         |
| React-хук            | `use-*.ts`          | `use-transactions.ts`         |
| API-модуль фронтенда | `*.api.ts`          | `transactions.api.ts`         |
| Типы фронтенда       | `types.ts`          | `entities/transaction/model/types.ts` |

### Безопасность

- Все защищённые эндпоинты используют `@UseGuards(JwtAuthGuard)` + `@CurrentUser()`
- `userId` всегда берётся из JWT (`@CurrentUser()`), **не из тела запроса**
- Перед изменением/удалением чужих данных — проверка `entity.userId !== userId` → `ForbiddenException`
- DTO используют `class-validator` + `whitelist: true` — лишние поля отбрасываются автоматически
- Пароли хэшируются через `bcrypt` (10 раундов) перед сохранением

### Документирование кода

После добавления или изменения любого публичного метода — обязательно:

1. **JSDoc** с `@param`, `@returns`, `@throws` на каждый метод контроллера, хэндлера и репозитория
2. **`@ApiProperty`/`@ApiPropertyOptional`** на все поля DTO
3. **Swagger-декораторы** на все методы контроллера: `@ApiOperation`, `@ApiOkResponse`/`@ApiCreatedResponse`, `@ApiBadRequestResponse` и т.д.

---

## Коммиты и ветки

Используем [Conventional Commits](https://www.conventionalcommits.org/) и GitHub Flow.

### Формат коммита

```
type(scope): краткое описание на русском языке
```

Примеры:
```
feat(backend): добавить модуль бюджетов
fix(frontend): исправить валидацию формы транзакции
refactor(auth): вынести JWT-логику в отдельный сервис
docs(backend): добавить JSDoc для репозитория транзакций
```

### Workflow

```bash
# 1. Создать ветку от main
git checkout -b feature/budget-module

# 2. Работать, коммитить
git add <files>
git commit -m "feat(backend): добавить модуль бюджетов"

# 3. Создать PR
git push -u origin feature/budget-module
gh pr create --title "feat(backend): добавить модуль бюджетов" --body "..."

# 4. После merge — удалить ветку
git branch -d feature/budget-module
```

---

## Полезные команды

```bash
# Разработка
npm run dev:frontend              # Next.js dev server → http://localhost:3000
npm run dev:backend               # NestJS watch mode → http://localhost:3001
docker compose up -d              # Запустить PostgreSQL

# Сборка
npm run build:frontend
npm run build:backend

# Качество кода
npm run lint                      # ESLint по всем воркспейсам
npm run format                    # Prettier по всем файлам

# Prisma
npm run prisma:migrate --workspace=backend    # Применить миграции
npm run prisma:generate --workspace=backend   # Обновить Prisma Client
npx prisma studio --schema=backend/prisma/schema.prisma  # GUI для БД

# Swagger UI
open http://localhost:3001/api/docs
```

---

## Отладка

### Backend не стартует

- Проверить, что PostgreSQL запущен: `docker compose ps`
- Проверить `backend/.env` — наличие `DATABASE_URL` и `JWT_SECRET`
- Проверить применение миграций: `npm run prisma:migrate --workspace=backend`

### Frontend не получает данные

- Проверить `frontend/.env.local` — `NEXT_PUBLIC_API_URL=http://localhost:3001`
- Убедиться, что бэкенд запущен и доступен: `curl http://localhost:3001/api/auth/login`
- Проверить DevTools → Network на наличие заголовка `Authorization`

### Ошибка 401 на защищённых эндпоинтах

- Токен в `localStorage` отсутствует или просрочен
- `JWT_SECRET` на бэкенде не совпадает с тем, которым подписан токен
- Проверить через Swagger UI (`http://localhost:3001/api/docs`) — нажать Authorize и вставить токен
