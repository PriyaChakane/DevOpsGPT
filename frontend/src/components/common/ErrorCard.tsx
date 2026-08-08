import { AlertOctagon } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import type { Severity } from '@/types/common';

interface ErrorCardProps {
  title: string;
  description: string;
  severity: Severity;
  onClick?: () => void;
}

export function ErrorCard({ title, description, severity, onClick }: ErrorCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card group flex w-full flex-col gap-2.5 p-4 text-left transition-colors hover:border-primary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertOctagon size={15} className="text-text-muted group-hover:text-primary" />
          <span className="text-sm font-medium text-text-primary">{title}</span>
        </div>
        <SeverityBadge severity={severity} />
      </div>
      <p className="text-xs leading-relaxed text-text-secondary">{description}</p>
    </button>
  );
}
