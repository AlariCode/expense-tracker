---
name: pr
description: Создать Pull Request на GitHub с заданными названием и веткой.
model: sonnet
allowed-tools: Bash(git *), Bash(gh *)
user-invocable: true
argument-hint: <title> <base-branch, default main>
---

# PR Skill

Создай Pull Request на GitHub, соблюдая соглашения проекта.

## Аргументы

- $0 - название PR
- $1 - целевая ветка

## Подготовка

1. Проверь что ветка готова:
   !`bash ${CLAUDE_SKILL_DIR}/scripts/validate.sh`
2. Получи diff от базовой ветки:
   !`git diff ${ARGUMENTS:-main}..HEAD`
3. Получи список коммитов:
   !`git log ${ARGUMENTS:-main}..HEAD --oneline`

## Задача

Используя данные выше — заполни шаблон
из @template.md.
Посмотри пример хорошего PR: @examples/good-pr.md

## Создание PR

Создай PR командой:
gh pr create \
 --title "$0 или сгенерированный title" \
 --body "заполненный шаблон" \
 --base "${ARGUMENTS:-main}"

## Правила

- Заголовок по conventional commits
- Если ветка не запушена:
  git push --set-upstream origin HEAD
