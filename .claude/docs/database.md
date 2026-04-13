# Схема базы данных

СУБД: **PostgreSQL 16**. ORM: **Prisma 6**. Схема: `backend/prisma/schema.prisma`.

---

## Диаграмма связей

```
User (1) ──────< Category (N)
 │                    │
 └──────< Transaction (N) >──── Category (1)
```

- User → Category: один ко многим (у пользователя много категорий)
- User → Transaction: один ко многим (у пользователя много транзакций)
- Category → Transaction: один ко многим (у категории много транзакций)
- Удаление User каскадно удаляет его Category и Transaction (`onDelete: Cascade`)

---

## Модель `User`

Таблица: `users`

| Поле        | Тип           | Ограничения              | Описание                                  |
|-------------|---------------|--------------------------|-------------------------------------------|
| `id`        | Int           | PK, autoincrement        | Числовой идентификатор пользователя       |
| `name`      | String        | NOT NULL                 | Имя пользователя (отображается в UI)      |
| `email`     | String        | NOT NULL, UNIQUE         | Email — используется как логин            |
| `password`  | String        | NOT NULL                 | Хэш пароля (bcrypt, 10 раундов)          |
| `createdAt` | DateTime      | default: now()           | Дата регистрации                          |
| `updatedAt` | DateTime      | auto-update              | Дата последнего изменения записи          |

**Индексы:** уникальный индекс на `email` (быстрый поиск при логине).

---

## Модель `Category`

Таблица: `categories`

| Поле        | Тип      | Ограничения              | Описание                                      |
|-------------|----------|--------------------------|-----------------------------------------------|
| `id`        | Int      | PK, autoincrement        | Числовой идентификатор категории              |
| `name`      | String   | NOT NULL                 | Название категории (например, «Продукты»)     |
| `color`     | String   | NOT NULL                 | HEX-цвет для отображения в UI (например, `#FF5733`) |
| `icon`      | String   | NOT NULL                 | Строковый идентификатор иконки (например, `shopping-cart`) |
| `userId`    | Int      | NOT NULL, FK → users.id  | Владелец категории                            |
| `createdAt` | DateTime | default: now()           | Дата создания                                 |
| `updatedAt` | DateTime | auto-update              | Дата последнего изменения                    |

**Связи:**
- `user` → `User` (`userId`, onDelete: Cascade) — при удалении пользователя удаляются его категории
- `transactions` → `Transaction[]` — транзакции этой категории

**Примечание:** формат `color` и `icon` — произвольные строки, backend их не валидирует по формату. Соглашение по формату поддерживается на уровне фронтенда.

---

## Модель `Transaction`

Таблица: `transactions`

| Поле          | Тип             | Ограничения              | Описание                                      |
|---------------|-----------------|--------------------------|-----------------------------------------------|
| `id`          | String (UUID)   | PK, default: uuid()      | UUID транзакции (генерируется Prisma/Postgres) |
| `amount`      | Decimal         | NOT NULL                 | Сумма транзакции. Тип Decimal — точная арифметика для денег (не Float) |
| `type`        | TransactionType | NOT NULL                 | Тип: `INCOME` (доход) или `EXPENSE` (расход) |
| `description` | String          | NULL                     | Опциональное текстовое описание транзакции    |
| `date`        | DateTime        | NOT NULL                 | Дата совершения операции (не дата создания записи) |
| `categoryId`  | Int             | NOT NULL, FK → categories.id | Категория транзакции                      |
| `userId`      | Int             | NOT NULL, FK → users.id  | Владелец транзакции                           |
| `createdAt`   | DateTime        | default: now()           | Дата создания записи в БД                     |

**Связи:**
- `category` → `Category` (`categoryId`) — нет cascade, категорию нельзя удалить пока есть транзакции
- `user` → `User` (`userId`, onDelete: Cascade) — при удалении пользователя удаляются его транзакции

**Важно про `amount`:**
Prisma возвращает `Decimal` как объект, а не как `number`. В репозитории при агрегации (`groupBy`) нужен явный вызов `.toNumber()`:
```ts
result.find((r) => r.type === 'INCOME')?._sum.amount?.toNumber() ?? 0
```

---

## Enum `TransactionType`

```prisma
enum TransactionType {
  INCOME   // Доход
  EXPENSE  // Расход
}
```

Хранится в PostgreSQL как нативный enum. При добавлении новых значений необходима миграция.

---

## Каскадное удаление

| Действие                  | Результат                                      |
|---------------------------|------------------------------------------------|
| Удаление `User`           | Удаляются все его `Category` и `Transaction`   |
| Удаление `Category`       | Удаление заблокировано, если есть `Transaction` (нет cascade) |
| Удаление `Transaction`    | Удаляется только сама запись                   |

---

## Команды Prisma

```bash
# Применить миграции и обновить БД
npm run prisma:migrate --workspace=backend

# Сгенерировать Prisma Client после изменения схемы
npm run prisma:generate --workspace=backend

# Открыть Prisma Studio (GUI для БД)
npx prisma studio --schema=backend/prisma/schema.prisma
```

---

## Подключение к БД

Строка подключения задаётся в `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expence_tracker
```

Формат: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

При использовании Docker Compose из этого репозитория дефолтные значения совпадают.
