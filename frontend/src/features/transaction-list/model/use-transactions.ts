'use client';

import { useEffect, useState } from 'react';
import type { Transaction } from '@/entities/transaction';
import { transactionsApi, type GetTransactionsParams } from '../api/transactions.api';

const PAGE_SIZE = 10;

export function useTransactions(
  params?: GetTransactionsParams,
  refreshTrigger?: number,
) {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Serialize params to avoid object reference instability as a useEffect dependency
  const paramsKey = JSON.stringify(params ?? null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    // params is captured from the same render that computed paramsKey,
    // so it's safe to use directly — paramsKey is only for dep stability
    transactionsApi
      .getAll(params)
      .then((data) => {
        setAllTransactions(data);
        setPage(1);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : 'Ошибка загрузки');
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, refreshTrigger]);

  const totalPages = Math.max(1, Math.ceil(allTransactions.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const transactions = allTransactions.slice(start, start + PAGE_SIZE);

  return {
    transactions,
    totalCount: allTransactions.length,
    totalPages,
    page,
    setPage,
    isLoading,
    error,
  };
}
