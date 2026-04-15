'use client';

import { useCallback, useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Skeleton } from '@/shared/ui/skeleton';
import { useCategories, categoriesApi, type Category } from '@/entities/category';
import type { CreateCategoryDto, UpdateCategoryDto } from '@/entities/category';
import { CategoryFormDialog } from './category-form-dialog';
import { DeleteCategoryDialog } from './delete-category-dialog';

export function CategoryList() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { categories, isLoading } = useCategories(refreshTrigger);

  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const refresh = useCallback(() => setRefreshTrigger((k) => k + 1), []);

  const handleCreate = async (data: CreateCategoryDto) => {
    setCreateLoading(true);
    setCreateError(null);
    try {
      await categoriesApi.create(data);
      refresh();
    } catch {
      setCreateError('Не удалось создать категорию');
      throw new Error('create failed');
    } finally {
      setCreateLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <h2 className="text-sm font-semibold text-foreground">
          Категории{' '}
          <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {categories.length}
          </span>
        </h2>
        <CategoryFormDialog
          trigger={
            <Button size="sm" className="gap-1.5 rounded-xl text-sm font-medium shadow-sm">
              <Plus className="h-4 w-4" />
              Добавить
            </Button>
          }
          onSave={handleCreate}
          isLoading={createLoading}
          error={createError}
        />
      </div>

      <div className="p-6">
        {categories.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">Категорий пока нет</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Добавьте первую категорию, чтобы начать учёт расходов
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} onChanged={refresh} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface CategoryCardProps {
  category: Category;
  onChanged: () => void;
}

function CategoryCard({ category, onChanged }: CategoryCardProps) {
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const handleEdit = async (data: UpdateCategoryDto) => {
    setEditLoading(true);
    setEditError(null);
    try {
      await categoriesApi.update(category.id, data);
      onChanged();
    } catch {
      setEditError('Не удалось сохранить изменения');
      throw new Error('edit failed');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div
      className="group flex items-center gap-3 rounded-xl p-4 transition-all"
      style={{ background: `${category.color}12` }}
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg"
        style={{ background: `${category.color}28` }}
      >
        {category.icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{category.name}</p>
        <div className="mt-1 flex items-center gap-1.5">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: category.color }}
          />
          <span className="text-xs text-muted-foreground">{category.color}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <CategoryFormDialog
          trigger={
            <button
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-white/60 hover:text-foreground"
              title="Редактировать"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          }
          category={category}
          onSave={handleEdit}
          isLoading={editLoading}
          error={editError}
        />
        <DeleteCategoryDialog category={category} onDeleted={onChanged} />
      </div>
    </div>
  );
}
