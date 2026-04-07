import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { LoginForm } from '@/features/auth';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Вход</CardTitle>
          <CardDescription>Войдите в свой аккаунт Expense Tracker</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Нет аккаунта?{' '}
            <Link href="/register" className="text-primary underline-offset-4 hover:underline">
              Зарегистрироваться
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
