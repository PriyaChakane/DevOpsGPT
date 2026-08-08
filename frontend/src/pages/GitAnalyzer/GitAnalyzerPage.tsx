import { useState } from 'react';
import { GitBranch, Wand2, GitMerge, ShieldAlert, GitCommitVertical, GitPullRequestArrow, RefreshCcw } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { ErrorCard } from '@/components/common/ErrorCard';
import { AIResponseCard } from '@/components/common/AIResponseCard';
import { AnalysisTabs } from '@/components/debugger/AnalysisTabs';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { analyzeError } from '@/services/debuggerService';
import type { AnalysisResult } from '@/types/debugger';

const commonGitIssues = [
  { title: 'Merge conflict', description: 'Two branches modified the same lines and Git cannot auto-merge them.', severity: 'medium' as const, icon: GitMerge, sample: 'CONFLICT (content): Merge conflict in src/index.ts' },
  { title: 'Authentication failure', description: 'HTTPS password auth was rejected by the remote host.', severity: 'high' as const, icon: ShieldAlert, sample: "fatal: Authentication failed for 'https://github.com/org/repo.git/'" },
  { title: 'Detached HEAD', description: 'You checked out a commit or tag instead of a branch.', severity: 'low' as const, icon: GitCommitVertical, sample: 'You are in \'detached HEAD\' state at commit a1b2c3d.' },
  { title: 'Rejected push', description: 'The remote has commits your local branch does not.', severity: 'medium' as const, icon: GitPullRequestArrow, sample: '! [rejected] main -> main (non-fast-forward)' },
  { title: 'Rebase conflict', description: 'A conflict occurred while replaying commits during rebase.', severity: 'medium' as const, icon: RefreshCcw, sample: 'error: could not apply a1b2c3d... commit message' },
];

export default function GitAnalyzerPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [branch, setBranch] = useState('feature/checkout-redesign');
  const [commitHash, setCommitHash] = useState('a1b2c3d');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!errorMessage.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    try {
      const analysis = await analyzeError({ errorMessage, technology: 'Git' });
      setResult(analysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      <PageHeader title="Git Analyzer" subtitle="Diagnose Git errors with branch and commit-aware context." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="card space-y-4 p-5">
            <div>
              <label htmlFor="git-error" className="mb-1.5 block text-sm font-medium text-text-primary">
                Git error message
              </label>
              <textarea
                id="git-error"
                value={errorMessage}
                onChange={(e) => setErrorMessage(e.target.value)}
                rows={5}
                placeholder="Paste the Git error output here..."
                className="input-field resize-none font-mono text-[13px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="branch" className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Repository branch
                </label>
                <input id="branch" value={branch} onChange={(e) => setBranch(e.target.value)} className="input-field font-mono text-xs" />
              </div>
              <div>
                <label htmlFor="commit" className="mb-1.5 block text-xs font-medium text-text-secondary">
                  Commit hash
                </label>
                <input id="commit" value={commitHash} onChange={(e) => setCommitHash(e.target.value)} className="input-field font-mono text-xs" />
              </div>
            </div>
            <button type="button" onClick={handleAnalyze} disabled={isAnalyzing} className="btn-primary w-full">
              <Wand2 size={16} />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Git Error'}
            </button>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-text-primary">Common Git Issues</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {commonGitIssues.map((issue) => (
                <ErrorCard
                  key={issue.title}
                  title={issue.title}
                  description={issue.description}
                  severity={issue.severity}
                  onClick={() => setErrorMessage(issue.sample)}
                />
              ))}
            </div>
          </div>
        </div>

        <div>
          {isAnalyzing && (
            <div className="card">
              <LoadingState label="Analyzing Git error..." />
            </div>
          )}
          {!isAnalyzing && !result && (
            <div className="card">
              <EmptyState icon={GitBranch} title="No analysis yet" description="Select a common issue or paste a Git error message, then click Analyze." />
            </div>
          )}
          {!isAnalyzing && result && (
            <div className="space-y-4">
              <AIResponseCard result={result} />
              <div className="card p-5">
                <AnalysisTabs result={result} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
