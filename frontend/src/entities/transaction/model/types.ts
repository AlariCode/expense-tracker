export type TransactionType = 'INCOME' | 'EXPENSE';

export interface TransactionCategory {
  id: number;
  name: string;
  color: string;
  icon: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  date: string;
  categoryId: number;
  userId: number;
  createdAt: string;
  category: TransactionCategory;
}

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}
