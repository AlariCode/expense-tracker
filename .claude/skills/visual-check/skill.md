---
name: visual-check
description: Проверить вёрстку frontend-приложения на desktop и mobile через Playwright MCP после изменений в UI.
model: sonnet
allowed-tools: mcp__playwright__browser_navigate, mcp__playwright__browser_resize, mcp__playwright__browser_take_screenshot, mcp__playwright__browser_snapshot, mcp__playwright__browser_wait_for, mcp__playwright__browser_close, Bash(git *), Read, Glob
argument-hint: <страница или пустой аргумент для всех страниц>
---

# Visual Check Skill

Проверь вёрстку frontend-приложения на desktop и mobile. Если передан аргумент `$0` — проверяй только указанную страницу. Если аргумент пустой — проверяй все страницы приложения.

## Контекст выполнения

Изменённые файлы: !`git diff --name-only HEAD`

Frontend запущен на: `http://localhost:3000`

## Страницы приложения

| Маршрут           | URL                                |
| ----------------- | ---------------------------------- |
| Главная (дашборд) | `http://localhost:3000`            |
| Логин             | `http://localhost:3000/login`      |
| Регистрация       | `http://localhost:3000/register`   |
| Категории         | `http://localhost:3000/categories` |
| Профиль           | `http://localhost:3000/profile`    |

## Размеры экранов

| Режим   | Ширина | Высота |
| ------- | ------ | ------ |
| Desktop | 1440   | 900    |
| Mobile  | 390    | 844    |

## Алгоритм выполнения

### 1. Определи список страниц для проверки

- Если `$0` задан — проверяй только соответствующую страницу
- Если `$0` пустой — определи затронутые страницы по изменённым файлам (`git diff --name-only HEAD`). Если изменения в общих компонентах (layout, ui-kit) — проверяй все страницы

Маппинг директорий → маршруты:

- `(auth)/login` → `/login`
- `(auth)/register` → `/register`
- `(dashboard)/categories` → `/categories`
- `(dashboard)/profile` → `/profile`
- `(dashboard)/page.tsx` или общие компоненты → `/` (и все остальные)

### 2. Для каждой страницы выполни проверку

#### Desktop (1440×900)

```
1. browser_resize({ width: 1440, height: 900 })
2. browser_navigate({ url: "<URL страницы>" })
3. browser_wait_for({ time: 1000 })  // дать время на рендер
4. browser_take_screenshot({ filename: "screenshots/desktop-<страница>.png", type: "png", fullPage: true })
5. browser_snapshot()  // получить DOM-снапшот для анализа
```

#### Mobile (390×844)

```
1. browser_resize({ width: 390, height: 844 })
2. browser_navigate({ url: "<URL страницы>" })
3. browser_wait_for({ time: 1000 })
4. browser_take_screenshot({ filename: "screenshots/mobile-<страница>.png", type: "png", fullPage: true })
5. browser_snapshot()
```

### 3. Проанализируй каждый снапшот и скриншот

Проверяй по чеклисту:

**Общее:**

- [ ] Страница загрузилась без ошибок (нет текста 500/404/error)
- [ ] Нет горизонтального переполнения (overflow-x)
- [ ] Текст читаемый, не обрезан и не перекрыт

**Desktop:**

- [ ] Контент корректно заполняет ширину
- [ ] Навигация отображается полностью
- [ ] Нет пустых мест или сломанной сетки

**Mobile:**

- [ ] Нет элементов, выходящих за пределы viewport
- [ ] Кнопки и интерактивные элементы достаточного размера (≥ 44px)
- [ ] Навигация адаптирована (мобильное меню или стек)
- [ ] Формы и инпуты удобны для тача

### 4. Сформируй отчёт

Выведи итоговый отчёт в формате:

```
## Результаты визуальной проверки

### <Название страницы> (`<маршрут>`)

**Desktop** — [✅ OK / ⚠️ Замечания / ❌ Ошибка]
- скриншот: screenshots/desktop-<страница>.png
- <описание проблем или "Вёрстка корректна">

**Mobile** — [✅ OK / ⚠️ Замечания / ❌ Ошибка]
- скриншот: screenshots/mobile-<страница>.png
- <описание проблем или "Вёрстка корректна">

---

### Итог
- Проверено страниц: N
- Критических проблем: N
- Замечаний: N
```

## Правила

- Папка `screenshots/` — в корне проекта, не коммитить (добавь в `.gitignore` при необходимости)
- Если frontend не запущен — сообщи: «Запусти `npm run dev:frontend` и повтори»
- Если страница требует авторизации и редиректит — отметь это в отчёте как информационное, не как ошибку
- Не закрывай браузер между проверками страниц — это замедляет работу
- Фиксируй только реальные UI-проблемы, не предположения
