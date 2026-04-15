#!/bin/bash

branch=$(git branch --show-current)

# Нельзя создавать PR из main или develop
if [ "$branch" = "main" ] || [ "$branch" = "develop" ]; then
  echo "ERROR: нельзя создавать PR из ветки '$branch'"
  echo "Создай feature ветку: git checkout -b feature/название"
  exit 1
fi

# Проверяем что есть коммиты отличные от main
commits=$(git log main..HEAD --oneline 2>/dev/null | wc -l)
if [ "$commits" -eq 0 ]; then
  echo "ERROR: нет коммитов отличных от main"
  echo "Сделай хотя бы один коммит перед созданием PR"
  exit 1
fi

echo "OK: ветка '$branch' готова к PR ($commits коммитов)"