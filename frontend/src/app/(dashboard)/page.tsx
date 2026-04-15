'use client';

import { useCallback, useState } from 'react';
import {
  CreateTransactionDialog,
  SummaryCards,
  TransactionList,
} from '@/features/transaction-list';

const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export default function DashboardPage() {
  const now = new Date();
  const currentMonth = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreated = useCallback(() => {
    setRefreshTrigger((k) => k + 1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">Транзакции</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{currentMonth}</p>
        </div>
        <CreateTransactionDialog onCreated={handleCreated} />
      </div>

      <SummaryCards refreshTrigger={refreshTrigger} />

      <TransactionList refreshTrigger={refreshTrigger} />
    </div>
  );
}
