import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
  height?: number;
}

export function ChartCard({ title, subtitle, children, actions, className, height = 280 }: ChartCardProps) {
  return (
    <div className={cn('card p-5', className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-text-secondary">{subtitle}</p>}
        </div>
        {actions}
      </div>
      <div style={{ height }}>{children}</div>
    </div>
  );
}
