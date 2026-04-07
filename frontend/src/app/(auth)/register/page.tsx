import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { RegisterForm } from '@/features/auth';

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Регистрация</CardTitle>
          <CardDescription>Создайте аккаунт для управления расходами</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Уже есть аккаунт?{' '}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              Войти
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
