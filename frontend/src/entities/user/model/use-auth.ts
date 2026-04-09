'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/shared/api/api-client';
import type { User } from './types';

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }

    apiClient<User>('/api/auth/me')
      .then(setUser)
      .catch(() => {
        localStorage.removeItem('accessToken');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    router.push('/login');
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };
}
