import { useEffect, useState } from 'react';
import { Workflow, Wand2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { UploadDropzone } from '@/components/common/UploadDropzone';
import { CodeBlock } from '@/components/common/CodeBlock';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { analyzeCICDLogs, getPipelineHistory } from '@/services/cicdService';
import { formatDate } from '@/lib/utils';
import type { CicdAnalysisResult, CiProvider, PipelineHistoryEntry } from '@/types/cicd';

const providers: CiProvider[] = ['GitHub Actions', 'GitLab CI', 'Jenkins'];

const historyColumns: DataTableColumn<PipelineHistoryEntry>[] = [
  { key: 'pipelineName', header: 'Pipeline', render: (row) => <span className="font-medium text-text-primary">{row.pipelineName}</span> },
  { key: 'provider', header: 'Provider', render: (row) => row.provider },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <StatusBadge status={row.status === 'Passed' ? 'resolved' : row.status === 'Failed' ? 'unresolved' : 'in-progress'} />
    ),
  },
  { key: 'duration', header: 'Duration', render: (row) => row.duration },
  { key: 'triggeredBy', header: 'Triggered By', render: (row) => row.triggeredBy },
  { key: 'date', header: 'Date', render: (row) => formatDate(row.date) },
];

export default function CICDPage() {
  const [pipelineName, setPipelineName] = useState('build-and-deploy');
  const [provider, setProvider] = useState<CiProvider>('GitHub Actions');
  const [logs, setLogs] = useState('');
  const [fileName, setFileName] = useState<string | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CicdAnalysisResult | null>(null);
  const [history, setHistory] = useState<PipelineHistoryEntry[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    getPipelineHistory()
      .then(setHistory)
      .finally(() => setHistoryLoading(false));
  }, []);

  const handleAnalyze = async () => {
    if (!logs.trim()) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeCICDLogs({ pipelineName, provider, logs });
      setResult(analysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      <PageHeader title="CI/CD Logs" subtitle="Analyze pipeline logs from GitHub Actions, GitLab CI, or Jenkins." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pipeline-name" className="mb-1.5 block text-xs font-medium text-text-secondary">
                Pipeline
              </label>
              <input id="pipeline-name" value={pipelineName} onChange={(e) => setPipelineName(e.target.value)} className="input-field text-sm" />
            </div>
            <div>
              <label htmlFor="provider" className="mb-1.5 block text-xs font-medium text-text-secondary">
                Provider
              </label>
              <select id="provider" value={provider} onChange={(e) => setProvider(e.target.value as CiProvider)} className="input-field">
                {providers.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <UploadDropzone
            accept=".log,.txt"
            hint="Accepts a pipeline log file"
            selectedFileName={fileName}
            onFileSelect={(file) => {
              setFileName(file.name);
              const reader = new FileReader();
              reader.onload = () => setLogs(String(reader.result ?? ''));
              reader.readAsText(file);
            }}
          />

          <div>
            <label htmlFor="logs" className="mb-1.5 block text-sm font-medium text-text-primary">
              Or paste pipeline logs
            </label>
            <textarea
              id="logs"
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              rows={10}
              placeholder="Paste your CI/CD build logs here..."
              className="input-field resize-none font-mono text-[13px]"
            />
          </div>

          <button type="button" onClick={handleAnalyze} disabled={isAnalyzing} className="btn-primary w-full">
            <Wand2 size={16} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Pipeline'}
          </button>
        </div>

        <div>
          {isAnalyzing && (
            <div className="card">
              <LoadingState label="Analyzing pipeline logs..." />
            </div>
          )}

          {!isAnalyzing && !result && (
            <div className="card">
              <EmptyState icon={Workflow} title="No analysis yet" description="Paste or upload pipeline logs, then click Analyze Pipeline." />
            </div>
          )}

          {!isAnalyzing && result && (
            <div className="space-y-4">
              <div className="card p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{result.pipelineName}</p>
                    <p className="text-xs text-text-secondary">{result.provider}</p>
                  </div>
                  <StatusBadge status={result.status === 'Passed' ? 'resolved' : 'unresolved'} />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-text-muted">Failed step</p>
                    <p className="mt-0.5 font-mono text-xs text-text-primary">{result.failedStep}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Duration</p>
                    <p className="mt-0.5 text-text-primary">{Math.floor(result.buildDurationSeconds / 60)}m {result.buildDurationSeconds % 60}s</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted">Category</p>
                    <p className="mt-0.5 text-text-primary">{result.failureCategory}</p>
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-text-muted">Root Cause</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{result.rootCause}</p>
                <h3 className="mt-4 text-xs font-semibold uppercase tracking-wide text-text-muted">Suggested Fix</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{result.suggestedFix}</p>
              </div>

              <div className="card p-5">
                <h3 className="mb-3 text-sm font-semibold text-text-primary">Corrected YAML</h3>
                <CodeBlock code={result.correctedYaml} language="yaml" fileName="workflow.yml" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5">
        <h2 className="mb-3 text-sm font-semibold text-text-primary">Pipeline History</h2>
        <DataTable columns={historyColumns} data={history} getRowKey={(row) => row.id} isLoading={historyLoading} />
      </div>
    </div>
  );
}
