import type {
  AnalyticsSummary,
  TechnologyProblemDatum,
  ConfidenceTrendDatum,
  TeamActivityDatum,
  ErrorTrendDatum,
} from '@/types/analytics';

export const mockAnalyticsSummary: AnalyticsSummary = {
  totalSessions: 3842,
  resolutionRatePercent: 92,
  avgResolutionTimeMinutes: 2.4,
  activeTeamMembers: 18,
};

export const mockTechnologyProblems: TechnologyProblemDatum[] = [
  { technology: 'Kubernetes', issueCount: 412 },
  { technology: 'Docker', issueCount: 356 },
  { technology: 'Git', issueCount: 298 },
  { technology: 'CI/CD', issueCount: 271 },
];

export const mockConfidenceTrend: ConfidenceTrendDatum[] = [
  { date: 'W1', confidence: 87 },
  { date: 'W2', confidence: 89 },
  { date: 'W3', confidence: 91 },
  { date: 'W4', confidence: 90 },
  { date: 'W5', confidence: 93 },
  { date: 'W6', confidence: 95 },
];

export const mockTeamActivity: TeamActivityDatum[] = [
  { member: 'j.chen', sessions: 214, resolved: 198 },
  { member: 'r.patel', sessions: 187, resolved: 172 },
  { member: 's.moore', sessions: 165, resolved: 149 },
  { member: 'a.kim', sessions: 143, resolved: 138 },
  { member: 'l.garcia', sessions: 121, resolved: 108 },
];

export const mockErrorTrends: ErrorTrendDatum[] = [
  { month: 'Mar', git: 88, docker: 64, kubernetes: 71, cicd: 52 },
  { month: 'Apr', git: 92, docker: 78, kubernetes: 84, cicd: 61 },
  { month: 'May', git: 79, docker: 71, kubernetes: 90, cicd: 58 },
  { month: 'Jun', git: 104, docker: 95, kubernetes: 102, cicd: 74 },
  { month: 'Jul', git: 97, docker: 88, kubernetes: 96, cicd: 69 },
  { month: 'Aug', git: 41, docker: 38, kubernetes: 44, cicd: 29 },
];
