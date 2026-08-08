import type { DashboardData } from '@/types/dashboard';

export const dashboardMockData: DashboardData = {
  metrics: {
    totalErrorsAnalyzed: 1250,
    problemsSolved: 980,
    avgResolutionTimeMinutes: 2.4,
    successRatePercent: 92,
    errorsTrend: 8.2,
    solvedTrend: 6.4,
    resolutionTrend: -12.5,
    successTrend: 3.1,
  },
  errorCategories: [
    { category: 'Git', count: 412, color: '#3b82f6' },
    { category: 'Docker', count: 318, color: '#a855f7' },
    { category: 'Kubernetes', count: 276, color: '#22c55e' },
    { category: 'CI/CD', count: 244, color: '#f59e0b' },
  ],
  dailyActivity: [
    { date: 'Mon', analyzed: 62, resolved: 54 },
    { date: 'Tue', analyzed: 78, resolved: 70 },
    { date: 'Wed', analyzed: 55, resolved: 48 },
    { date: 'Thu', analyzed: 91, resolved: 83 },
    { date: 'Fri', analyzed: 84, resolved: 76 },
    { date: 'Sat', analyzed: 32, resolved: 29 },
    { date: 'Sun', analyzed: 21, resolved: 19 },
  ],
  commonErrors: [
    { name: 'Auth token expired', occurrences: 142 },
    { name: 'Merge conflict', occurrences: 118 },
    { name: 'ImagePullBackOff', occurrences: 97 },
    { name: 'Pipeline timeout', occurrences: 84 },
    { name: 'Detached HEAD', occurrences: 61 },
  ],
  resolutionSuccess: [
    { week: 'W1', successRate: 88 },
    { week: 'W2', successRate: 90 },
    { week: 'W3', successRate: 87 },
    { week: 'W4', successRate: 92 },
    { week: 'W5', successRate: 94 },
    { week: 'W6', successRate: 92 },
  ],
  recentIssues: [
    { id: 'iss_1001', errorType: 'Authentication Error', tool: 'Git', severity: 'medium', status: 'resolved', solution: 'Regenerated personal access token', date: '2026-08-07T09:12:00Z' },
    { id: 'iss_1002', errorType: 'ImagePullBackOff', tool: 'Kubernetes', severity: 'high', status: 'resolved', solution: 'Fixed image tag in deployment manifest', date: '2026-08-07T07:40:00Z' },
    { id: 'iss_1003', errorType: 'Layer Cache Miss', tool: 'Docker', severity: 'low', status: 'in-progress', solution: 'Reordered Dockerfile COPY instructions', date: '2026-08-06T22:05:00Z' },
    { id: 'iss_1004', errorType: 'Pipeline Timeout', tool: 'CI/CD', severity: 'critical', status: 'unresolved', solution: 'Pending investigation of test suite runtime', date: '2026-08-06T18:22:00Z' },
    { id: 'iss_1005', errorType: 'Merge Conflict', tool: 'Git', severity: 'medium', status: 'resolved', solution: 'Rebased feature branch onto main', date: '2026-08-06T14:51:00Z' },
    { id: 'iss_1006', errorType: 'CrashLoopBackOff', tool: 'Kubernetes', severity: 'critical', status: 'resolved', solution: 'Increased memory limits on deployment', date: '2026-08-05T11:03:00Z' },
    { id: 'iss_1007', errorType: 'Dependency Conflict', tool: 'Docker', severity: 'medium', status: 'resolved', solution: 'Pinned base image version', date: '2026-08-05T08:44:00Z' },
  ],
};
