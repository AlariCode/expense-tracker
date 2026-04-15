'use client';

import { ArrowDownLeft, ArrowUpRight, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/shared/lib/format';
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
          <div key={i} className="rounded-2xl bg-white p-5 shadow-sm">
            <Skeleton className="mb-3 h-4 w-24" />
            <Skeleton className="h-8 w-36" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Доходы',
      value: summary?.totalIncome ?? 0,
      icon: ArrowUpRight,
      cardBg: '#edfaf4',
      iconBg: '#c8f0dc',
      iconColor: '#1a9e5a',
      valueColor: '#0f7a42',
      labelColor: '#5a7a68',
    },
    {
      title: 'Расходы',
      value: summary?.totalExpense ?? 0,
      icon: ArrowDownLeft,
      cardBg: '#fff3f0',
      iconBg: '#ffdbd4',
      iconColor: '#d94030',
      valueColor: '#b83228',
      labelColor: '#7a5a58',
    },
    {
      title: 'Баланс',
      value: summary?.balance ?? 0,
      icon: TrendingUp,
      cardBg: '#eef6ff',
      iconBg: '#c5dfff',
      iconColor: '#1a6ede',
      valueColor: '#0f52b0',
      labelColor: '#5a6a7a',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl p-5"
          style={{ background: card.cardBg }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="mb-3 text-sm font-medium" style={{ color: card.labelColor }}>
                {card.title}
              </p>
              <p className="text-2xl font-bold tracking-tight" style={{ color: card.valueColor }}>
                {formatCurrency(card.value)}
              </p>
            </div>
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: card.iconBg }}
            >
              <card.icon className="h-5 w-5" style={{ color: card.iconColor }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
