'use client';

import { useEffect, useState } from 'react';
import type { TransactionSummary } from '@/entities/transaction';
import { transactionsApi } from '../api/transactions.api';

export function useSummary(month?: number, year?: number, refreshTrigger?: number) {
  const now = new Date();
  const m = month ?? now.getMonth() + 1;
  const y = year ?? now.getFullYear();

  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    transactionsApi
      .getSummary(m, y)
      .then(setSummary)
      .catch(() => setSummary(null))
      .finally(() => setIsLoading(false));
  }, [m, y, refreshTrigger]);

  return { summary, isLoading };
}
