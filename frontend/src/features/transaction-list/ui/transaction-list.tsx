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
      <div className="rounded-md border border-destructive/50 p-4 text-destructive">
        {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Транзакций пока нет
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Дата</TableHead>
            <TableHead>Описание</TableHead>
            <TableHead>Категория</TableHead>
            <TableHead>Тип</TableHead>
            <TableHead className="text-right">Сумма</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="whitespace-nowrap">
                {formatDate(tx.date)}
              </TableCell>
              <TableCell>{tx.description ?? '—'}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  style={{
                    borderColor: tx.category.color,
                    color: tx.category.color,
                  }}
                >
                  {tx.category.name}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={tx.type === 'INCOME' ? 'default' : 'destructive'}
                >
                  {tx.type === 'INCOME' ? 'Доход' : 'Расход'}
                </Badge>
              </TableCell>
              <TableCell
                className={cn(
                  'text-right font-medium',
                  tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600',
                )}
              >
                {tx.type === 'INCOME' ? '+' : '-'}
                {formatCurrency(Number(tx.amount))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
                className={cn(
                  page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer',
                )}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  onClick={() => setPage(p)}
                  isActive={p === page}
                  className="cursor-pointer"
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                className={cn(
                  page === totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer',
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
