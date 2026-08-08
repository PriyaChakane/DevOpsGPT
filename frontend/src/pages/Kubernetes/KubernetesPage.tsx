import { useEffect, useState } from 'react';
import { Boxes, Cpu, MemoryStick, AlertTriangle, CheckCircle2, RefreshCcw } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { MetricCard } from '@/components/common/MetricCard';
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable';
import { RecommendationCard } from '@/components/common/RecommendationCard';
import { ErrorState } from '@/components/common/ErrorState';
import { cn } from '@/lib/utils';
import { getKubernetesSnapshot } from '@/services/kubernetesService';
import type { PodRecord, PodStatus } from '@/types/kubernetes';
import type { KubernetesSnapshot } from '@/services/kubernetesService';
import type { AsyncStatus } from '@/types/common';

const podStatusClasses: Record<PodStatus, string> = {
  Running: 'bg-success-muted text-success border-success/20',
  Pending: 'bg-warning-muted text-warning border-warning/20',
  Failed: 'bg-danger-muted text-danger border-danger/20',
  CrashLoopBackOff: 'bg-danger-muted text-danger border-danger/20',
  Succeeded: 'bg-primary-muted text-primary border-primary/20',
};

export default function KubernetesPage() {
  const [data, setData] = useState<KubernetesSnapshot | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('loading');

  const loadData = () => {
    setStatus('loading');
    getKubernetesSnapshot()
      .then((snapshot) => {
        setData(snapshot);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: DataTableColumn<PodRecord>[] = [
    { key: 'name', header: 'Pod Name', render: (row) => <span className="font-mono text-xs text-text-primary">{row.name}</span> },
    { key: 'namespace', header: 'Namespace', render: (row) => row.namespace },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', podStatusClasses[row.status])}>
          {row.status}
        </span>
      ),
    },
    { key: 'cpu', header: 'CPU', render: (row) => <span className="font-mono text-xs">{row.cpu}</span> },
    { key: 'memory', header: 'Memory', render: (row) => <span className="font-mono text-xs">{row.memory}</span> },
    { key: 'restarts', header: 'Restarts', render: (row) => row.restarts },
    { key: 'issue', header: 'Issue', render: (row) => row.issue ? <span className="text-xs text-danger">{row.issue}</span> : <span className="text-xs text-text-muted">—</span> },
    {
      key: 'action',
      header: 'Action',
      render: () => (
        <button type="button" className="text-xs font-medium text-primary hover:underline">
          Investigate
        </button>
      ),
    },
  ];

  if (status === 'error') return <ErrorState onRetry={loadData} />;

  return (
    <div>
      <PageHeader
        title="Kubernetes Monitor"
        subtitle="Live-style overview of your cluster's pod health and resource usage."
        actions={
          <button type="button" onClick={loadData} className="btn-secondary">
            <RefreshCcw size={15} />
            Refresh
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="card flex flex-col items-start gap-2 p-4 xl:col-span-1">
          <div className={cn('rounded-lg p-2', data?.cluster.status === 'Healthy' ? 'bg-success-muted text-success' : 'bg-warning-muted text-warning')}>
            <CheckCircle2 size={16} />
          </div>
          <p className="text-sm font-semibold text-text-primary">{data?.cluster.status ?? '—'}</p>
          <p className="text-xs text-text-secondary">Cluster status</p>
        </div>
        <MetricCard label="Running Pods" value={data ? String(data.cluster.runningPods) : '—'} icon={Boxes} accent="success" isLoading={status === 'loading'} />
        <MetricCard label="Failed Pods" value={data ? String(data.cluster.failedPods) : '—'} icon={AlertTriangle} accent="danger" isLoading={status === 'loading'} />
        <MetricCard label="Warning Events" value={data ? String(data.cluster.warningEvents) : '—'} icon={AlertTriangle} accent="warning" isLoading={status === 'loading'} />
        <MetricCard label="CPU Usage" value={data ? `${data.cluster.cpuUsagePercent}%` : '—'} icon={Cpu} accent="primary" isLoading={status === 'loading'} />
        <MetricCard label="Memory Usage" value={data ? `${data.cluster.memoryUsagePercent}%` : '—'} icon={MemoryStick} accent="secondary" isLoading={status === 'loading'} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-text-primary">Pods</h2>
          <DataTable columns={columns} data={data?.pods ?? []} getRowKey={(row) => row.id} isLoading={status === 'loading'} />
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold text-text-primary">AI Recommendations</h2>
          <div className="space-y-3">
            {data?.recommendations.map((rec) => (
              <RecommendationCard key={rec.id} title={rec.title} explanation={rec.explanation} command={rec.command} severity={rec.severity} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
