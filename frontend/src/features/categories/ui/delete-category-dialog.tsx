'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { categoriesApi, type Category } from '@/entities/category';

interface DeleteCategoryDialogProps {
  category: Category;
  onDeleted: () => void;
}

export function DeleteCategoryDialog({ category, onDeleted }: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await categoriesApi.remove(category.id);
      setOpen(false);
      onDeleted();
    } catch {
      setError('Не удалось удалить категорию. Возможно, она используется в транзакциях.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
          title="Удалить"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Удалить категорию</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: `${category.color}12` }}>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-base"
              style={{ background: `${category.color}28` }}
            >
              {category.icon}
            </div>
            <p className="text-sm font-medium text-foreground">{category.name}</p>
          </div>

          <p className="text-sm text-muted-foreground">
            Вы уверены, что хотите удалить эту категорию? Это действие нельзя отменить.
          </p>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-xl"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Удаляем...' : 'Удалить'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
