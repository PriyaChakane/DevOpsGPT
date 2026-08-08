import { cn } from '@/lib/utils';
import type { Severity } from '@/types/common';

const severityConfig: Record<Severity, { label: string; classes: string }> = {
  critical: { label: 'Critical', classes: 'bg-danger-muted text-danger border-danger/20' },
  high: { label: 'High', classes: 'bg-warning-muted text-warning border-warning/20' },
  medium: { label: 'Medium', classes: 'bg-primary-muted text-primary border-primary/20' },
  low: { label: 'Low', classes: 'bg-bg-elevated text-text-secondary border-border' },
};

export function SeverityBadge({ severity, className }: { severity: Severity; className?: string }) {
  const config = severityConfig[severity];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
}
