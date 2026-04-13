# Code Review Guidelines

Правила проведения code review для проекта Expense Tracker.

## Общие принципы

- PR должен решать одну задачу — одна фича, один баг, один рефакторинг
- Коммиты соответствуют [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): описание на русском`
- Код собирается без ошибок (`npm run build:frontend`, `npm run build:backend`)
- Линтер проходит без предупреждений (`npm run lint`)

## Frontend (Next.js + FSD)

### Архитектура

- Соблюдается FSD-иерархия слоёв: `app` → `widgets` → `features` → `entities` → `shared`
- Импорты идут только сверху вниз — нижний слой не импортирует верхний
- Внешние импорты из slice проходят через `index.ts` (публичный API)
- shadcn/ui компоненты находятся в `shared/ui/`, не дублируются в других слоях

### Компоненты и логика

- Формы используют `react-hook-form` + `zod` для валидации
- Data-fetching через TanStack Query — без `useEffect` для загрузки данных
- Типы описаны явно, `any` не допускается без обоснования
- Стили через Tailwind CSS, без inline `style` и отдельных CSS-файлов (кроме `globals.css`)

### Именование

- Компоненты — PascalCase: `TransactionList.tsx`
- Хуки — camelCase с префиксом `use`: `useAuth.ts`
- Утилиты и хелперы — camelCase: `formatCurrency.ts`
- Файлы с kebab-case допускаются для модулей: `api-client.ts`

## Backend (NestJS + CQRS)

### Архитектура

- Новая бизнес-логика реализуется через CQRS (CommandBus/QueryBus)
- Работа с базой — только через Repository pattern (`*.repository.ts`)
- Прямое использование `PrismaService` в контроллерах и хэндлерах запрещено — только через репозиторий
- Каждый модуль самодостаточен: dto, commands/queries, repository

### Безопасность

- Все защищённые эндпоинты используют `@UseGuards(JwtAuthGuard)`
- Данные пользователя получаются через `@CurrentUser()`, а не из тела запроса
- DTO валидируются через `class-validator` — глобальный `ValidationPipe` с `whitelist` и `forbidNonWhitelisted`
- Пользователь может работать только со своими данными — проверка `userId` обязательна

### Именование

- Контроллеры — `*.controller.ts`
- Команды — `*.command.ts` + `*.handler.ts`
- Запросы — `*.query.ts` + `*.handler.ts`
- DTO — `*.dto.ts`, классы с декораторами `class-validator`

## База данных (Prisma)

- Изменения схемы сопровождаются миграцией (`npm run prisma:migrate`)
- Новые поля с `NOT NULL` имеют значение по умолчанию или миграция содержит backfill
- Индексы добавляются для полей, используемых в фильтрации и сортировке
- Enum-значения добавляются через миграцию, не вручную

## Чек-лист для ревьюера

- [ ] PR title соответствует Conventional Commits
- [ ] Код собирается и линтер проходит
- [ ] FSD-слои не нарушены (фронтенд)
- [ ] CQRS и Repository pattern соблюдены (бэкенд)
- [ ] Эндпоинты защищены `JwtAuthGuard` где нужно
- [ ] Нет утечек данных между пользователями (проверка `userId`)
- [ ] DTO покрывают все входные данные
- [ ] Нет `any`, `console.log`, закомментированного кода
- [ ] Prisma-миграция создана при изменении схемы

## Пропускать

- Сгенерированный файлы миграций в prisma/migrations/\*
- Изменения в \*.lock файлах
