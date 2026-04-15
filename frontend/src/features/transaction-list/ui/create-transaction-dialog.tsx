'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { useCategories } from '@/entities/category';
import { useCreateTransaction } from '../model/use-create-transaction';

const createTransactionSchema = z.object({
  amount: z
    .string()
    .min(1, 'Введите сумму')
    .refine((v) => {
      const n = parseFloat(v);
      return !isNaN(n) && n > 0;
    }, 'Сумма должна быть положительной'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    message: 'Выберите тип',
  }),
  description: z.string().optional(),
  date: z.string().min(1, 'Выберите дату'),
  categoryId: z.string().min(1, 'Выберите категорию'),
});

type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

interface CreateTransactionDialogProps {
  onCreated: () => void;
}

export function CreateTransactionDialog({
  onCreated,
}: CreateTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const { categories, isLoading: categoriesLoading } = useCategories();

  const form = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: '',
      type: undefined,
      description: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
    },
  });

  const { create, isLoading, error } = useCreateTransaction(() => {
    setOpen(false);
    form.reset();
    onCreated();
  });

  const onSubmit = (data: CreateTransactionFormData) => {
    create({
      amount: parseFloat(data.amount),
      type: data.type,
      date: new Date(data.date).toISOString(),
      description: data.description || undefined,
      categoryId: parseInt(data.categoryId, 10),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-xl gap-1.5 text-sm font-medium shadow-sm">
          <Plus className="h-4 w-4" />
          Добавить транзакцию
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Новая транзакция</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INCOME">Доход</SelectItem>
                      <SelectItem value="EXPENSE">Расход</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сумма</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                    disabled={categoriesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            categoriesLoading
                              ? 'Загрузка...'
                              : categories.length === 0
                                ? 'Нет категорий'
                                : 'Выберите категорию'
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание (необязательно)</FormLabel>
                  <FormControl>
                    <Input placeholder="Описание транзакции" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || categories.length === 0}
            >
              {isLoading ? 'Создание...' : 'Создать'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
