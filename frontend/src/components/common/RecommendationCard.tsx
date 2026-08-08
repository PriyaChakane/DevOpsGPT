import { Lightbulb } from 'lucide-react';
import { SeverityBadge } from './SeverityBadge';
import { CodeBlock } from './CodeBlock';
import type { Severity } from '@/types/common';

interface RecommendationCardProps {
  title: string;
  explanation: string;
  command?: string;
  severity?: Severity;
}

export function RecommendationCard({ title, explanation, command, severity }: RecommendationCardProps) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="mt-0.5 rounded-lg bg-warning-muted p-1.5 text-warning">
            <Lightbulb size={14} />
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{title}</p>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">{explanation}</p>
          </div>
        </div>
        {severity && <SeverityBadge severity={severity} />}
      </div>
      {command && <CodeBlock code={command} language="shell" className="mt-3" />}
    </div>
  );
}
