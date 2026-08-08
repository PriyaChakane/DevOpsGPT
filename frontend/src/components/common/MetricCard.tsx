import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  accent?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  isLoading?: boolean;
}

const accentClasses = {
  primary: 'bg-primary-muted text-primary',
  secondary: 'bg-secondary-muted text-secondary',
  success: 'bg-success-muted text-success',
  warning: 'bg-warning-muted text-warning',
  danger: 'bg-danger-muted text-danger',
};

export function MetricCard({ label, value, icon: Icon, trend, trendLabel, accent = 'primary', isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="card space-y-3 p-5">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-8 w-28" />
      </div>
    );
  }

  const isPositive = (trend ?? 0) >= 0;

  return (
    <div className="card p-5 transition-colors hover:border-border/80">
      <div className="flex items-start justify-between">
        <p className="text-sm text-text-secondary">{label}</p>
        <div className={cn('rounded-lg p-2', accentClasses[accent])}>
          <Icon size={16} aria-hidden="true" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">{value}</p>
      {typeof trend === 'number' && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <span className={cn('flex items-center gap-0.5 font-medium', isPositive ? 'text-success' : 'text-danger')}>
            {isPositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(trend)}%
          </span>
          <span className="text-text-muted">{trendLabel ?? 'vs last period'}</span>
        </div>
      )}
    </div>
  );
}
