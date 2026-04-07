'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, type RegisterData } from '../api/auth.api';

export function useRegister() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.register(data);
      localStorage.setItem('accessToken', response.accessToken);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}
