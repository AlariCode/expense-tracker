'use client';

import { cn } from '@/shared/lib/utils';
import { formatCurrency } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/ui/pagination';
import { useTransactions } from '../model/use-transactions';

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

interface TransactionListProps {
  refreshTrigger?: number;
}

export function TransactionList({ refreshTrigger }: TransactionListProps) {
  const { transactions, totalPages, page, setPage, isLoading, error } =
    useTransactions(undefined, refreshTrigger);

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
        <Skeleton className="h-5 w-48" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 shadow-sm text-center">
        <p className="text-sm text-muted-foreground">Транзакций пока нет</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm">
      <div className="px-6 py-4 border-b border-border/60">
        <h2 className="text-sm font-semibold text-foreground">Последние транзакции</h2>
      </div>

      <div className="px-2">
        <Table>
          <TableHeader>
            <TableRow className="border-none hover:bg-transparent">
              <TableHead className="text-xs font-medium text-muted-foreground">Дата</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Описание</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Категория</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Тип</TableHead>
              <TableHead className="text-right text-xs font-medium text-muted-foreground">Сумма</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="border-border/40 hover:bg-muted/30">
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(tx.date)}
                </TableCell>
                <TableCell className="text-sm font-medium text-foreground">
                  {tx.description ?? '—'}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="rounded-full text-xs font-medium"
                    style={{
                      borderColor: `${tx.category.color}40`,
                      color: tx.category.color,
                      background: `${tx.category.color}12`,
                    }}
                  >
                    {tx.category.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-full text-xs font-medium',
                      tx.type === 'INCOME'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-rose-200 bg-rose-50 text-rose-600',
                    )}
                  >
                    {tx.type === 'INCOME' ? 'Доход' : 'Расход'}
                  </Badge>
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right text-sm font-semibold',
                    tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-500',
                  )}
                >
                  {tx.type === 'INCOME' ? '+' : '−'}
                  {formatCurrency(Number(tx.amount))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-border/40 px-6 py-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(Math.max(1, page - 1))}
                  className={cn(
                    'text-sm',
                    page === 1 ? 'pointer-events-none opacity-40' : 'cursor-pointer',
                  )}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    onClick={() => setPage(p)}
                    isActive={p === page}
                    className="cursor-pointer text-sm"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  className={cn(
                    'text-sm',
                    page === totalPages
                      ? 'pointer-events-none opacity-40'
                      : 'cursor-pointer',
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
