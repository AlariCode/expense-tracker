'use client';

import { useState } from 'react';
import {
  transactionsApi,
  type CreateTransactionData,
} from '../api/transactions.api';

export function useCreateTransaction(onSuccess?: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: CreateTransactionData) => {
    setIsLoading(true);
    setError(null);
    try {
      await transactionsApi.create(data);
      onSuccess?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка создания');
    } finally {
      setIsLoading(false);
    }
  };

  return { create, isLoading, error };
}
