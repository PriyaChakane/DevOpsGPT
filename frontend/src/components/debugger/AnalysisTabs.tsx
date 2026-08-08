import { useState } from 'react';
import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/common/CodeBlock';
import { ExternalLink, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { AnalysisResult } from '@/types/debugger';

const tabs = ['Analysis', 'Reasoning', 'Sources', 'Fix History'] as const;
type Tab = (typeof tabs)[number];

const sourceTypeLabel: Record<string, string> = {
  documentation: 'Documentation',
  stackoverflow: 'Stack Overflow',
  'github-issue': 'GitHub Issue',
  'internal-runbook': 'Internal Runbook',
};

const outcomeConfig = {
  success: { icon: CheckCircle2, classes: 'text-success' },
  failed: { icon: XCircle, classes: 'text-danger' },
  pending: { icon: Clock, classes: 'text-warning' },
};

export function AnalysisTabs({ result }: { result: AnalysisResult }) {
  const [active, setActive] = useState<Tab>('Analysis');

  return (
    <div>
      <div role="tablist" aria-label="Analysis details" className="mb-4 flex gap-1 rounded-lg border border-border bg-bg-elevated p-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            className={cn(
              'flex-1 rounded-md px-3 py-2 text-xs font-medium transition-colors',
              active === tab ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {active === 'Analysis' && (
        <div className="space-y-5">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Solution</h4>
            <CodeBlock code={result.solutionCommands.join('\n')} language="shell" className="mt-2" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Prevention Tips</h4>
            <ul className="mt-2 space-y-2">
              {result.preventionTips.map((tip) => (
                <li key={tip} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {active === 'Reasoning' && (
        <ol className="space-y-3">
          {result.reasoning.map((step) => (
            <li key={step.step} className="flex gap-3 rounded-lg border border-border bg-bg-elevated p-3.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-muted text-xs font-semibold text-primary">
                {step.step}
              </span>
              <div>
                <p className="text-sm font-medium text-text-primary">{step.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      {active === 'Sources' && (
        <div className="space-y-2.5">
          {result.sources.map((source) => (
            <a
              key={source.id}
              href={source.url}
              className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg-elevated p-3.5 hover:border-primary/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">{source.title}</p>
                <p className="mt-0.5 text-xs text-text-muted">{sourceTypeLabel[source.type]} · {source.relevance}% relevant</p>
              </div>
              <ExternalLink size={14} className="shrink-0 text-text-muted" />
            </a>
          ))}
        </div>
      )}

      {active === 'Fix History' && (
        <div className="space-y-2.5">
          {result.fixHistory.length === 0 && (
            <p className="py-8 text-center text-sm text-text-secondary">No prior fixes recorded for this error pattern yet.</p>
          )}
          {result.fixHistory.map((entry) => {
            const config = outcomeConfig[entry.outcome];
            const Icon = config.icon;
            return (
              <div key={entry.id} className="flex items-center gap-3 rounded-lg border border-border bg-bg-elevated p-3.5">
                <Icon size={16} className={cn('shrink-0', config.classes)} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-text-primary">{entry.action}</p>
                  <p className="text-xs text-text-muted">{formatDate(entry.date)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
