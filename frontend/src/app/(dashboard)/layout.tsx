'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth, UserContext } from '@/entities/user';
import { Sidebar } from '@/widgets/sidebar';
import { Skeleton } from '@/shared/ui/skeleton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-64 space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, logout }}>
      <div className="flex h-screen">
        <Sidebar user={user} onLogout={logout} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </UserContext.Provider>
  );
}
