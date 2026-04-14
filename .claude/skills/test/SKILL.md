---
name: test
description: Добавить Jest-тесты для указанного файла в проекте expense-tracker.
model: sonnet
allowed-tools: Read, Glob, Grep, Write, Bash(npm *), Bash(cat *), Bash(ls *)
user-invocable: true
argument-hint: <filepath>
---

# Test Skill

Сгенерируй Jest-тесты для файла `$0`, соблюдая соглашения проекта.

## Аргументы

- `$0` — путь к файлу, для которого нужно написать тесты (относительный от корня монорепо или абсолютный)

## Алгоритм выполнения

### 1. Прочитай целевой файл

```
Read($0)
```

Разбери:

- Что экспортируется (классы, функции, хуки, компоненты)
- Какие зависимости инжектируются / импортируются
- Какая бизнес-логика требует покрытия

### 2. Определи контекст

**Backend** (`backend/src/...`):

- Фреймворк: NestJS 11 + Jest
- Паттерны: CQRS (CommandHandler, QueryHandler), Repository, Service
- Мокируй зависимости через `jest.fn()` / `jest.mock()`
- Тест-файл: рядом с исходником, `*.spec.ts`
- Запуск: `npm run test --workspace=backend -- --testPathPattern=<имя файла>`

**Frontend** (`frontend/src/...`):

- Фреймворк: Next.js 16 + React 19
- Проверь наличие `@testing-library/react` и `jest` в `frontend/package.json`
- Если не установлены — сообщи пользователю об установке зависимостей (см. раздел «Зависимости»)
- Тест-файл: рядом с исходником, `*.test.tsx` (для компонентов/хуков) или `*.test.ts` (для утилит)
- Запуск: `npm run test --workspace=frontend -- --testPathPattern=<имя файла>`

### 3. Проверь, не существует ли уже тест-файл

Если тест-файл уже существует — сообщи об этом и выведи его путь. Предложи дополнить существующие тесты вместо создания нового файла.

### 4. Сформируй тест-файл

#### Backend (NestJS) — шаблон

```typescript
import { Test, TestingModule } from '@nestjs/testing';
// импорт тестируемого класса и его зависимостей

describe('<ИмяКласса>', () => {
  let sut: <ИмяКласса>;
  // объявления моков

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        <ИмяКласса>,
        {
          provide: <ЗависимостьToken>,
          useValue: {
            <метод>: jest.fn(),
          },
        },
      ],
    }).compile();

    sut = module.get<<ИмяКласса>>(<ИмяКласса>);
  });

  describe('<имяМетода>', () => {
    it('должен <ожидаемое поведение>', async () => {
      // Arrange
      // Act
      // Assert
    });

    it('должен выбросить ошибку, если <условие>', async () => {
      // ...
    });
  });
});
```

#### Frontend (React) — шаблон для компонента

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { <КомпонентИмя> } from './<КомпонентИмя>';

describe('<КомпонентИмя>', () => {
  it('рендерится без ошибок', () => {
    render(<КомпонентИмя />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('отображает <элемент> при <условии>', () => {
    // ...
  });
});
```

#### Frontend — шаблон для хука

```typescript
import { renderHook, act } from '@testing-library/react';
import { <useХук> } from './<useХук>';

describe('<useХук>', () => {
  it('возвращает начальное состояние', () => {
    const { result } = renderHook(() => <useХук>());
    expect(result.current.<поле>).toBe(<ожидание>);
  });
});
```

#### Frontend — шаблон для утилиты/функции

```typescript
import { <функция> } from './<модуль>';

describe('<функция>', () => {
  it('возвращает <ожидание> при <входе>', () => {
    expect(<функция>(<аргументы>)).toBe(<ожидание>);
  });
});
```

### 5. Покрой основные сценарии

Для каждого публичного метода / экспорта напиши тесты:

- **Happy path** — нормальный сценарий
- **Edge cases** — граничные значения, пустые массивы, null/undefined
- **Error cases** — что бросается при невалидных данных или ошибках зависимостей

Описания тестов (`it(...)`) — на **русском языке**, начиная с «должен».

### 6. Запись тест-файла

Определи путь для тест-файла:

- Backend: `<директория исходника>/<имя>.spec.ts`
- Frontend (компонент/хук): `<директория исходника>/<имя>.test.tsx`
- Frontend (утилита): `<директория исходника>/<имя>.test.ts`

Запиши файл с помощью `Write`.

### 7. Проверь наличие тест-скрипта и запусти тесты

Проверь `package.json` воркспейса на наличие скрипта `"test"`.

Если скрипт есть — запусти:

```bash
npm run test --workspace=<backend|frontend> -- --testPathPattern=<имя файла> --passWithNoTests
```

Если тесты упали — разбери ошибку, исправь тест-файл и повтори.

---

## Зависимости

### Backend

NestJS CLI создаёт проект с Jest. Если зависимости отсутствуют — установи:

```bash
npm install --save-dev @nestjs/testing jest @types/jest ts-jest --workspace=backend
```

Добавь в `backend/package.json` скрипт:

```json
"test": "jest"
```

### Frontend

Если `@testing-library/react` не установлен:

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @types/jest ts-jest --workspace=frontend
```

Создай `frontend/jest.config.ts`:

```typescript
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  setupFilesAfterFramework: ['@testing-library/jest-dom'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};

export default config;
```

Добавь в `frontend/package.json` скрипт:

```json
"test": "jest"
```

---

## Правила

- Описания тестов — **на русском языке**
- Мокируй только то, что не тестируется (внешние зависимости, I/O)
- **Не тестируй** реализацию Prisma или NestJS — только бизнес-логику
- Не добавляй тесты для getter/setter без логики
- Один `describe` на класс/функцию/компонент, вложенные `describe` — на методы
- Если файл содержит только типы/интерфейсы — сообщи пользователю, что тесты не нужны
