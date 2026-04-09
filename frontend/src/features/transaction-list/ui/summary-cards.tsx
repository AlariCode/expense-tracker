'use client';

import { ArrowDownLeft, ArrowUpRight, Scale } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/format';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { useSummary } from '../model/use-summary';

interface SummaryCardsProps {
  refreshTrigger?: number;
}

export function SummaryCards({ refreshTrigger }: SummaryCardsProps) {
  const { summary, isLoading } = useSummary(undefined, undefined, refreshTrigger);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Доходы',
      value: summary?.totalIncome ?? 0,
      icon: ArrowUpRight,
      color: 'text-green-600',
    },
    {
      title: 'Расходы',
      value: summary?.totalExpense ?? 0,
      icon: ArrowDownLeft,
      color: 'text-red-600',
    },
    {
      title: 'Баланс',
      value: summary?.balance ?? 0,
      icon: Scale,
      color: '',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={cn('h-4 w-4', card.color)} />
          </CardHeader>
          <CardContent>
            <p className={cn('text-2xl font-bold', card.color)}>
              {formatCurrency(card.value)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
