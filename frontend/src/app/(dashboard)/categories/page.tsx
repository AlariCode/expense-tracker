'use client';

import { CategoryList } from '@/features/categories';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">Категории</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Управляйте категориями для классификации транзакций
        </p>
      </div>

      <CategoryList />
    </div>
  );
}
