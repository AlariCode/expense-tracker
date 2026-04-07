'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, type LoginData } from '../api/auth.api';

export function useLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(data);
      localStorage.setItem('accessToken', response.accessToken);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
