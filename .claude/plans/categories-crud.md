# Категории трат — план реализации

## Context

В приложении Expense Tracker реализована авторизация (JWT). Следующий шаг — добавить сущность **Category** (категория трат), привязанную к пользователю, с полным CRUD. Проект использует CQRS паттерн (CommandBus/QueryBus), репозиторий для работы с Prisma, JWT guard для защиты роутов и class-validator для валидации DTO.

## 1. Prisma-схема — добавить модель Category

**Файл:** `backend/prisma/schema.prisma`

```prisma
model Category {
  id     Int    @id @default(autoincrement())
  name   String
  color  String
  icon   String
  userId Int

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("categories")
}
```

Добавить обратную связь в модель `User`:
```prisma
categories Category[]
```

После изменения запустить: `npm run prisma:migrate` и `npm run prisma:generate` из `backend/`.

## 2. Category Repository

**Файл:** `backend/src/category/category.repository.ts`

Методы:
- `create(data: { name, color, icon, userId })` — создание
- `findAllByUserId(userId: number)` — все категории пользователя
- `findById(id: number)` — одна категория
- `update(id: number, data: Partial<{ name, color, icon }>)` — обновление
- `delete(id: number)` — удаление

## 3. CQRS — Commands и Queries

### Commands
- `CreateCategoryCommand` + `CreateCategoryHandler` — создание категории
- `UpdateCategoryCommand` + `UpdateCategoryHandler` — обновление (с проверкой владельца)
- `DeleteCategoryCommand` + `DeleteCategoryHandler` — удаление (с проверкой владельца)

### Queries
- `GetCategoriesByUserQuery` + `GetCategoriesByUserHandler` — все категории пользователя

**Структура папок:**
```
backend/src/category/
├── category.module.ts
├── category.controller.ts
├── category.repository.ts
├── commands/
│   ├── create-category.command.ts
│   ├── create-category.handler.ts
│   ├── update-category.command.ts
│   ├── update-category.handler.ts
│   ├── delete-category.command.ts
│   └── delete-category.handler.ts
├── queries/
│   ├── get-categories-by-user.query.ts
│   └── get-categories-by-user.handler.ts
└── dto/
    ├── create-category.dto.ts
    └── update-category.dto.ts
```

## 4. DTO с валидацией (class-validator)

**CreateCategoryDto:**
```typescript
@IsString() @IsNotEmpty() name: string
@IsString() @IsNotEmpty() color: string
@IsString() @IsNotEmpty() icon: string
```

**UpdateCategoryDto:**
```typescript
@IsString() @IsOptional() name?: string
@IsString() @IsOptional() color?: string
@IsString() @IsOptional() icon?: string
```

## 5. Controller

**Файл:** `backend/src/category/category.controller.ts`

Все эндпоинты защищены `@UseGuards(JwtAuthGuard)`. Получение userId через `@CurrentUser()`.

| Метод  | Путь              | Описание                    |
|--------|-------------------|-----------------------------|
| POST   | /api/categories   | Создать категорию           |
| GET    | /api/categories   | Получить все свои категории |
| PATCH  | /api/categories/:id | Обновить категорию        |
| DELETE | /api/categories/:id | Удалить категорию         |

## 6. Module

**Файл:** `backend/src/category/category.module.ts`

Импортирует `CqrsModule`, регистрирует repository, все handlers. Добавить `CategoryModule` в `AppModule`.

## 7. Ключевые файлы для изменения

- `backend/prisma/schema.prisma` — новая модель + связь с User
- `backend/src/app.module.ts` — импорт CategoryModule
- Новые файлы в `backend/src/category/` (см. структуру выше)

## 8. Переиспользуемые компоненты

- `JwtAuthGuard` из `backend/src/auth/guards/jwt-auth.guard.ts`
- `CurrentUser` декоратор из `backend/src/auth/decorators/current-user.decorator.ts`
- `PrismaService` из `backend/src/prisma/prisma.service.ts` (глобальный)
- `CqrsModule` из `@nestjs/cqrs`

## 9. Чеклист задач

- [x] **Шаг 1.** Обновить Prisma-схему: добавить модель `Category` и связь `categories` в `User`
- [x] **Шаг 2.** Запустить `prisma:migrate` и `prisma:generate`
- [x] **Шаг 3.** Создать `category.repository.ts` с методами CRUD
- [x] **Шаг 4.** Создать DTO: `create-category.dto.ts` и `update-category.dto.ts`
- [x] **Шаг 5.** Создать command `CreateCategoryCommand` + handler
- [x] **Шаг 6.** Создать command `UpdateCategoryCommand` + handler (с проверкой владельца)
- [x] **Шаг 7.** Создать command `DeleteCategoryCommand` + handler (с проверкой владельца)
- [x] **Шаг 8.** Создать query `GetCategoriesByUserQuery` + handler
- [x] **Шаг 9.** Создать `category.controller.ts` с CRUD эндпоинтами, защищёнными `JwtAuthGuard`
- [x] **Шаг 10.** Создать `category.module.ts` и зарегистрировать в `AppModule`
- [x] **Шаг 11.** Проверить сборку: `npm run build:backend`

## 10. Проверка

1. `npm run prisma:migrate` — миграция проходит без ошибок
2. `npm run prisma:generate` — Prisma client сгенерирован
3. `npm run build:backend` — проект компилируется
4. Ручная проверка через curl/Postman:
   - POST /api/categories с JWT токеном → 201 + категория создана
   - GET /api/categories → список категорий текущего пользователя
   - PATCH /api/categories/:id → обновление (только своей)
   - DELETE /api/categories/:id → удаление (только своей)
   - Запросы без токена → 401
