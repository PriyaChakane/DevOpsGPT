import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TableSkeleton } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  isLoading,
  emptyTitle = 'No results found',
  emptyDescription = 'Try adjusting your filters or search terms.',
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="card p-2">
        <TableSkeleton />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn('whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-text-muted', col.className)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={getRowKey(row)} className="border-b border-border/60 last:border-0 hover:bg-bg-hover/50">
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3.5 align-middle text-text-secondary', col.className)}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
