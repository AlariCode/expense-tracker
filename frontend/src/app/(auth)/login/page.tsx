import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: 'var(--sidebar-bg)' }}
          >
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">Вход в аккаунт</h1>
            <p className="mt-1 text-sm text-muted-foreground">Expense Tracker</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Нет аккаунта?{' '}
            <Link
              href="/register"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
