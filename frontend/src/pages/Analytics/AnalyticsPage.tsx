import { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import { Users, CheckCircle2, Clock, Activity } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { MetricCard } from '@/components/common/MetricCard';
import { ChartCard } from '@/components/charts/ChartCard';
import { getAnalyticsOverview, type AnalyticsData } from '@/services/analyticsService';

const chartTooltipStyle = { backgroundColor: '#141a2a', border: '1px solid #232b3d', borderRadius: 8, fontSize: 12, color: '#f1f5f9' };

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAnalyticsOverview().then((result) => {
      setData(result);
      setIsLoading(false);
    });
  }, []);

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Team-wide debugging performance and trends." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Total Debugging Sessions" value={data ? data.summary.totalSessions.toLocaleString() : '—'} icon={Activity} accent="primary" isLoading={isLoading} />
        <MetricCard label="Resolution Rate" value={data ? `${data.summary.resolutionRatePercent}%` : '—'} icon={CheckCircle2} accent="success" isLoading={isLoading} />
        <MetricCard label="Avg. Resolution Time" value={data ? `${data.summary.avgResolutionTimeMinutes} min` : '—'} icon={Clock} accent="secondary" isLoading={isLoading} />
        <MetricCard label="Active Team Members" value={data ? String(data.summary.activeTeamMembers) : '—'} icon={Users} accent="warning" isLoading={isLoading} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Most Problematic Technologies" subtitle="Total issues by tool">
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.technologyProblems} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2135" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="technology" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={90} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#1a2135' }} />
                <Bar dataKey="issueCount" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="AI Confidence Over Time" subtitle="Weekly average confidence score">
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.confidenceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2135" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[80, 100]} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Line type="monotone" dataKey="confidence" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3, fill: '#a855f7' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Team Debugging Activity" subtitle="Sessions vs. resolved issues per member">
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.teamActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2135" vertical={false} />
                <XAxis dataKey="member" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: '#1a2135' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="sessions" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Sessions" />
                <Bar dataKey="resolved" fill="#22c55e" radius={[4, 4, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Error Trends" subtitle="Monthly error volume by technology">
          {data && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.errorTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2135" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="git" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Area type="monotone" dataKey="docker" stackId="1" stroke="#a855f7" fill="#a855f7" fillOpacity={0.5} />
                <Area type="monotone" dataKey="kubernetes" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.5} />
                <Area type="monotone" dataKey="cicd" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
