import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Search, GitFork, ShieldAlert, GitPullRequest, GitCommitVertical } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { RepositoryHealthCard } from '@/components/repositories/RepositoryHealthCard';
import { ChartCard } from '@/components/charts/ChartCard';
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { analyzeRepository } from '@/services/repositoryService';
import { formatDate } from '@/lib/utils';
import type { RepositoryAnalysis, SecurityFinding, RecentCommit } from '@/types/repository';

const chartTooltipStyle = { backgroundColor: '#141a2a', border: '1px solid #232b3d', borderRadius: 8, fontSize: 12, color: '#f1f5f9' };

const findingColumns: DataTableColumn<SecurityFinding>[] = [
  { key: 'package', header: 'Package', render: (row) => <span className="font-mono text-xs text-text-primary">{row.package}</span> },
  { key: 'severity', header: 'Severity', render: (row) => <SeverityBadge severity={row.severity} /> },
  { key: 'description', header: 'Description', render: (row) => <span className="line-clamp-2 max-w-md">{row.description}</span> },
  { key: 'fixedIn', header: 'Fixed In', render: (row) => <span className="font-mono text-xs">{row.fixedIn}</span> },
];

const commitColumns: DataTableColumn<RecentCommit>[] = [
  { key: 'message', header: 'Commit', render: (row) => <span className="line-clamp-1 max-w-sm text-text-primary">{row.message}</span> },
  { key: 'sha', header: 'SHA', render: (row) => <span className="font-mono text-xs">{row.sha}</span> },
  { key: 'author', header: 'Author', render: (row) => row.author },
  { key: 'date', header: 'Date', render: (row) => formatDate(row.date) },
];

export default function GitHubRepositoryPage() {
  const [repoUrl, setRepoUrl] = useState('github.com/acme-corp/payments-platform');
  const [branch, setBranch] = useState('main');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!repoUrl.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeRepository({ repositoryUrl: repoUrl, branch });
      setAnalysis(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      <PageHeader title="GitHub Repository Analyzer" subtitle="Scan a repository for health, security, and quality signals." />

      <div className="card mb-5 flex flex-col gap-3 p-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="repo-url" className="mb-1.5 block text-xs font-medium text-text-secondary">
            GitHub repository URL
          </label>
          <input id="repo-url" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} className="input-field font-mono text-sm" />
        </div>
        <div className="sm:w-48">
          <label htmlFor="branch-select" className="mb-1.5 block text-xs font-medium text-text-secondary">
            Branch
          </label>
          <select id="branch-select" value={branch} onChange={(e) => setBranch(e.target.value)} className="input-field">
            <option value="main">main</option>
            <option value="develop">develop</option>
            <option value="staging">staging</option>
          </select>
        </div>
        <button type="button" onClick={handleAnalyze} disabled={isAnalyzing} className="btn-primary">
          <Search size={16} />
          {isAnalyzing ? 'Analyzing...' : 'Analyze Repository'}
        </button>
      </div>

      {isAnalyzing && (
        <div className="card">
          <LoadingState label="Scanning repository..." />
        </div>
      )}

      {!isAnalyzing && !analysis && (
        <div className="card">
          <EmptyState icon={GitFork} title="No repository analyzed yet" description="Enter a repository URL above and click Analyze Repository to get started." />
        </div>
      )}

      {!isAnalyzing && analysis && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <RepositoryHealthCard label="Repository Health" score={analysis.scores.health} />
            <RepositoryHealthCard label="Security Score" score={analysis.scores.security} />
            <RepositoryHealthCard label="Code Quality" score={analysis.scores.codeQuality} />
            <RepositoryHealthCard label="Documentation" score={analysis.scores.documentation} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="card flex items-center gap-3 p-4">
              <div className="rounded-lg bg-danger-muted p-2.5 text-danger">
                <ShieldAlert size={18} />
              </div>
              <div>
                <p className="text-lg font-semibold text-text-primary">{analysis.issueCounts.critical}</p>
                <p className="text-xs text-text-secondary">Critical issues</p>
              </div>
            </div>
            <div className="card flex items-center gap-3 p-4">
              <div className="rounded-lg bg-warning-muted p-2.5 text-warning">
                <GitCommitVertical size={18} />
              </div>
              <div>
                <p className="text-lg font-semibold text-text-primary">{analysis.issueCounts.warnings}</p>
                <p className="text-xs text-text-secondary">Warnings</p>
              </div>
            </div>
            <div className="card flex items-center gap-3 p-4">
              <div className="rounded-lg bg-primary-muted p-2.5 text-primary">
                <GitPullRequest size={18} />
              </div>
              <div>
                <p className="text-lg font-semibold text-text-primary">{analysis.issueCounts.suggestions}</p>
                <p className="text-xs text-text-secondary">Suggestions</p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-3 text-sm font-semibold text-text-primary">AI Recommendations</h3>
            <ul className="space-y-2.5">
              {analysis.recommendations.map((rec) => (
                <li key={rec} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ChartCard title="Repository Activity" subtitle="Commits & pull requests over time">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis.activity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2135" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#1a2135' }} />
                  <Bar dataKey="commits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pullRequests" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Language Distribution" subtitle="By lines of code">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analysis.languages} dataKey="percent" nameKey="language" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {analysis.languages.map((entry) => (
                      <Cell key={entry.language} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="card grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
            <div>
              <p className="text-lg font-semibold text-text-primary">{analysis.pullRequestSummary.open}</p>
              <p className="text-xs text-text-secondary">Open PRs</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">{analysis.pullRequestSummary.merged}</p>
              <p className="text-xs text-text-secondary">Merged PRs</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">{analysis.pullRequestSummary.closed}</p>
              <p className="text-xs text-text-secondary">Closed PRs</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">{analysis.pullRequestSummary.averageMergeTimeHours}h</p>
              <p className="text-xs text-text-secondary">Avg merge time</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">Recent Commits</h3>
            <DataTable columns={commitColumns} data={analysis.recentCommits} getRowKey={(row) => row.id} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-text-primary">Security Findings</h3>
            <DataTable columns={findingColumns} data={analysis.securityFindings} getRowKey={(row) => row.id} />
          </div>
        </div>
      )}
    </div>
  );
}
