#!/bin/bash

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Паттерны защищённых файлов
PROTECTED=(
  ".env"
  ".env.local"
  "prisma/migrations/"
  "package-lock.json"
)

for pattern in "${PROTECTED[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Заблокировано: $FILE_PATH — защищённый файл '$pattern'" >&2
    exit 2
  fi
done

exit 0