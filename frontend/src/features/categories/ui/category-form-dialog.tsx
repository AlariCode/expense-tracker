'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { cn } from '@/shared/lib/utils';
import type { Category } from '@/entities/category';

const PRESET_COLORS = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#14B8A6', '#3B82F6', '#6366F1', '#A855F7',
  '#EC4899', '#F43F5E', '#64748B', '#0EA5E9',
];

const PRESET_ICONS = [
  '🛒', '🚗', '🏠', '💊', '🎮', '🍕',
  '✈️', '📚', '👕', '💡', '💰', '🎁',
  '💅', '🐾', '🏋️', '🎵', '📱', '🏦',
  '🌿', '☕', '🎓', '🔧', '🛡️', '❤️',
];

const categorySchema = z.object({
  name: z.string().min(1, 'Введите название'),
  color: z.string().min(1, 'Выберите цвет'),
  icon: z.string().min(1, 'Выберите иконку'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormDialogProps {
  trigger: React.ReactNode;
  category?: Category;
  onSave: (data: CategoryFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function CategoryFormDialog({
  trigger,
  category,
  onSave,
  isLoading,
  error,
}: CategoryFormDialogProps) {
  const [open, setOpen] = useState(false);
  const isEditing = !!category;

  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? '',
      color: category?.color ?? PRESET_COLORS[5],
      icon: category?.icon ?? PRESET_ICONS[0],
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: category?.name ?? '',
        color: category?.color ?? PRESET_COLORS[5],
        icon: category?.icon ?? PRESET_ICONS[0],
      });
    }
  }, [open, category, form]);

  const handleSubmit = async (data: CategoryFormData) => {
    await onSave(data);
    setOpen(false);
  };

  const selectedColor = form.watch('color');
  const selectedIcon = form.watch('icon');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Редактировать категорию' : 'Новая категория'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            {/* Preview */}
            <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: `${selectedColor}18` }}>
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
                style={{ background: `${selectedColor}30` }}
              >
                {selectedIcon}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {form.watch('name') || 'Название категории'}
                </p>
                <p className="text-xs text-muted-foreground">Предпросмотр</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Например: Продукты" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Иконка</FormLabel>
                  <div className="grid grid-cols-8 gap-1.5">
                    {PRESET_ICONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => field.onChange(emoji)}
                        className={cn(
                          'flex h-9 w-9 items-center justify-center rounded-lg text-base transition-all',
                          field.value === emoji ? 'scale-110' : 'hover:bg-muted',
                        )}
                        style={field.value === emoji ? { outline: `2px solid ${selectedColor}`, outlineOffset: '2px' } : {}}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цвет</FormLabel>
                  <div className="grid grid-cols-6 gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => field.onChange(color)}
                        className={cn(
                          'h-8 w-8 rounded-lg transition-all',
                          field.value === color && 'ring-2 ring-offset-2 scale-110',
                        )}
                        style={{
                          background: color,
                          outlineColor: color,
                          ...(field.value === color ? { ringColor: color } : {}),
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
              {isLoading ? 'Сохраняем...' : isEditing ? 'Сохранить' : 'Создать'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
