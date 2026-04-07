'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { useRegister, type RegisterFormData } from '../model/use-register';

const registerSchema = z.object({
  name: z.string().min(1, 'Введите имя'),
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  terms: z.boolean().refine((v) => v === true, {
    message: 'Необходимо принять соглашение',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register, isLoading, error } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', terms: false },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(register as (data: RegisterFormValues) => void)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1">
              <div className="flex items-start gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="terms"
                    className="mt-0.5"
                  />
                </FormControl>
                <label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground leading-snug cursor-pointer"
                >
                  Согласен с{' '}
                  <Link
                    href="/terms"
                    className="text-foreground underline underline-offset-4 hover:text-primary"
                    target="_blank"
                  >
                    пользовательским соглашением
                  </Link>{' '}
                  и{' '}
                  <Link
                    href="/privacy"
                    className="text-foreground underline underline-offset-4 hover:text-primary"
                    target="_blank"
                  >
                    политикой обработки данных
                  </Link>
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Регистрируем...' : 'Зарегистрироваться'}
        </Button>
      </form>
    </Form>
  );
}
