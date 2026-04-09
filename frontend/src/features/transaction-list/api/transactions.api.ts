import type { Transaction, TransactionSummary } from '@/entities/transaction';
import { apiClient } from '@/shared/api/api-client';

export interface GetTransactionsParams {
  dateFrom?: string;
  dateTo?: string;
  type?: 'INCOME' | 'EXPENSE';
  categoryId?: number;
}

export interface CreateTransactionData {
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description?: string;
  date: string;
  categoryId: number;
}

export const transactionsApi = {
  create: (data: CreateTransactionData) =>
    apiClient<Transaction>('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (params?: GetTransactionsParams) => {
    const searchParams = new URLSearchParams();
    if (params?.dateFrom) searchParams.set('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.set('dateTo', params.dateTo);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.categoryId)
      searchParams.set('categoryId', String(params.categoryId));

    const query = searchParams.toString();
    return apiClient<Transaction[]>(
      `/api/transactions${query ? `?${query}` : ''}`,
    );
  },

  getSummary: (month: number, year: number) =>
    apiClient<TransactionSummary>(
      `/api/transactions/summary?month=${month}&year=${year}`,
    ),
};
