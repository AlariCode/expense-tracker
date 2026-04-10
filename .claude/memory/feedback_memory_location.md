---
name: Memory в папке проекта
description: Все memory-файлы хранить в .claude/memory/ внутри репозитория проекта
type: feedback
---

Все memory хранить в папке `.claude/memory/` внутри репозитория проекта (`/Users/alaricode/Documents/course-code/expence-tracker/.claude/memory/`), а не в `~/.claude/projects/`.

**Why:** Пользователь хочет, чтобы память была привязана к репозиторию проекта напрямую.
**How to apply:** При создании любых memory-файлов использовать путь `.claude/memory/` в корне проекта.
