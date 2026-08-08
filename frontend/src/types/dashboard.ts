import type { Severity, IssueStatus, Technology } from './common';

export interface DashboardMetrics {
  totalErrorsAnalyzed: number;
  problemsSolved: number;
  avgResolutionTimeMinutes: number;
  successRatePercent: number;
  errorsTrend: number;
  solvedTrend: number;
  resolutionTrend: number;
  successTrend: number;
}

export interface ErrorCategoryDatum {
  category: string;
  count: number;
  color: string;
}

export interface DailyActivityDatum {
  date: string;
  analyzed: number;
  resolved: number;
}

export interface CommonErrorDatum {
  name: string;
  occurrences: number;
}

export interface ResolutionSuccessDatum {
  week: string;
  successRate: number;
}

export interface RecentIssue {
  id: string;
  errorType: string;
  tool: Technology;
  severity: Severity;
  status: IssueStatus;
  solution: string;
  date: string;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  errorCategories: ErrorCategoryDatum[];
  dailyActivity: DailyActivityDatum[];
  commonErrors: CommonErrorDatum[];
  resolutionSuccess: ResolutionSuccessDatum[];
  recentIssues: RecentIssue[];
}
