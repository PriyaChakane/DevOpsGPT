import { cn } from '@/lib/utils';
import type { IssueStatus } from '@/types/common';

const statusConfig: Record<IssueStatus, { label: string; classes: string; dot: string }> = {
  resolved: { label: 'Resolved', classes: 'bg-success-muted text-success border-success/20', dot: 'bg-success' },
  unresolved: { label: 'Unresolved', classes: 'bg-danger-muted text-danger border-danger/20', dot: 'bg-danger' },
  'in-progress': { label: 'In Progress', classes: 'bg-warning-muted text-warning border-warning/20', dot: 'bg-warning' },
  analyzed: { label: 'Analyzed', classes: 'bg-primary-muted text-primary border-primary/20', dot: 'bg-primary' },
};

export function StatusBadge({ status, className }: { status: IssueStatus; className?: string }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        config.classes,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} aria-hidden="true" />
      {config.label}
    </span>
  );
}
