import { AlertTriangle, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We ran into a problem loading this data. Please try again.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 rounded-xl border border-danger/20 bg-danger-muted py-16 px-6 text-center', className)}>
      <div className="rounded-full bg-bg-surface p-3">
        <AlertTriangle size={22} className="text-danger" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-text-primary">{title}</p>
        <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      </div>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn-secondary mt-1">
          <RotateCw size={14} />
          Try again
        </button>
      )}
    </div>
  );
}
