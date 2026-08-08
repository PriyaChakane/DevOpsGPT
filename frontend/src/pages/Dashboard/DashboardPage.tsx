import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import { AlertCircle, CheckCircle2, Clock, TrendingUp, Bug } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { MetricCard } from '@/components/common/MetricCard';
import { ChartCard } from '@/components/charts/ChartCard';
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { ErrorState } from '@/components/common/ErrorState';
import { useAuth } from '@/hooks/useAuth';
import { getDashboardMetrics } from '@/services/dashboardService';
import { formatDate, formatNumber } from '@/lib/utils';
import type { DashboardData, RecentIssue } from '@/types/dashboard';
import type { AsyncStatus } from '@/types/common';

const chartTooltipStyle = {
  backgroundColor: '#141a2a',
  border: '1px solid #232b3d',
  borderRadius: 8,
  fontSize: 12,
  color: '#f1f5f9',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [status, setStatus] = useState<AsyncStatus>('loading');

  const loadData = () => {
    setStatus('loading');
    getDashboardMetrics()
      .then((result) => {
        setData(result);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns: DataTableColumn<RecentIssue>[] = [
    { key: 'errorType', header: 'Error Type', render: (row) => <span className="font-medium text-text-primary">{row.errorType}</span> },
    { key: 'tool', header: 'Tool', render: (row) => row.tool },
    { key: 'severity', header: 'Severity', render: (row) => <SeverityBadge severity={row.severity} /> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    { key: 'solution', header: 'Solution', render: (row) => <span className="line-clamp-1 max-w-xs">{row.solution}</span> },
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date) },
    {
      key: 'action',
      header: 'Action',
      render: () => (
        <Link to="/debugger" className="text-xs font-medium text-primary hover:underline">
          View details
        </Link>
      ),
    },
  ];

  if (status === 'error') {
    return <ErrorState onRetry={loadData} />;
  }

  return (
    <div>
      <PageHeader
        title={`Good morning, ${user?.fullName?.split(' ')[0] ?? 'Developer'}`}
        subtitle="All systems operational — 3 active debugging sessions across your team."
        actions={
          <Link to="/debugger" className="btn-primary">
            <Bug size={16} />
            Start Debugging
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Errors Analyzed"
          value={data ? formatNumber(data.metrics.totalErrorsAnalyzed) : '—'}
          icon={AlertCircle}
          trend={data?.metrics.errorsTrend}
          accent="primary"
          isLoading={status === 'loading'}
        />
        <MetricCard
          label="Problems Solved"
          value={data ? formatNumber(data.metrics.problemsSolved) : '—'}
          icon={CheckCircle2}
          trend={data?.metrics.solvedTrend}
          accent="success"
          isLoading={status === 'loading'}
        />
        <MetricCard
          label="Avg. Resolution Time"
          value={data ? `${data.metrics.avgResolutionTimeMinutes} min` : '—'}
          icon={Clock}
          trend={data?.metrics.resolutionTrend}
          trendLabel="faster than last period"
          accent="secondary"
          isLoading={status === 'loading'}
        />
        <MetricCard
          label="Success Rate"
          value={data ? `${data.metrics.successRatePercent}%` : '—'}
          icon={TrendingUp}
          trend={data?.metrics.successTrend}
          accent="warning"
          isLoading={status === 'loading'}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Error Category Distribution" subtitle="Breakdown by technology, last 30 days">
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.errorCategories} dataKey="count" nameKey="category" innerRadius={60} outerRadius={90} paddingAngle={3}>
                  {data.errorCategories.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Daily Debugging Activity" subtitle="Errors analyzed vs. resolved">
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dailyActivity}>
                <defs>
                  <linearGradient id="analyzedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2135" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="analyzed" stroke="#3b82f6" fill="url(#analyzedGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" fill="url(#resolvedGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Most Common Errors" subtitle="Top 5 recurring issues">
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.commonErrors} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2135" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11.5} tickLine={false} axisLine={false} width={120} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#1a2135' }} />
                <Bar dataKey="occurrences" fill="#a855f7" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Resolution Success Rate" subtitle="Weekly trend">
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.resolutionSuccess}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2135" vertical={false} />
                <XAxis dataKey="week" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[70, 100]} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="successRate" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3, fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <div className="mt-4">
        <h2 className="mb-3 text-sm font-semibold text-text-primary">Recent Issues</h2>
        <DataTable
          columns={columns}
          data={data?.recentIssues ?? []}
          getRowKey={(row) => row.id}
          isLoading={status === 'loading'}
          emptyTitle="No recent issues"
          emptyDescription="Once you start debugging, recent issues will show up here."
        />
      </div>
    </div>
  );
}
