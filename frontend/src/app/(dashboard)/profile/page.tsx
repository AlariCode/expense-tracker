'use client';

import { LogOut } from 'lucide-react';
import { useUserContext } from '@/entities/user';
import { getInitials } from '@/shared/lib/format';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';

export default function ProfilePage() {
  const { user, logout } = useUserContext();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Профиль</h1>

      <Card className="max-w-md">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Выйти из аккаунта
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
