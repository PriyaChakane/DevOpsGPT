import { Sparkles } from 'lucide-react';
import { ProgressScore } from './ProgressScore';
import { StatusBadge } from './StatusBadge';
import { SeverityBadge } from './SeverityBadge';
import type { AnalysisResult } from '@/types/debugger';

export function AIResponseCard({ result }: { result: AnalysisResult }) {
  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary-muted p-2 text-primary">
            <Sparkles size={16} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">{result.category}</p>
            <p className="text-xs text-text-secondary">{result.tool} · Detected automatically</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SeverityBadge severity={result.severity} />
          <StatusBadge status="analyzed" />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex-1 space-y-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Root Cause</h4>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{result.rootCause}</p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1 sm:border-l sm:border-border sm:pl-5">
          <ProgressScore score={result.confidenceScore} label="AI Confidence" size="md" />
        </div>
      </div>
    </div>
  );
}
