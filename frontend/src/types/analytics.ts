export interface AnalyticsSummary {
  totalSessions: number;
  resolutionRatePercent: number;
  avgResolutionTimeMinutes: number;
  activeTeamMembers: number;
}

export interface TechnologyProblemDatum {
  technology: string;
  issueCount: number;
}

export interface ConfidenceTrendDatum {
  date: string;
  confidence: number;
}

export interface TeamActivityDatum {
  member: string;
  sessions: number;
  resolved: number;
}

export interface ErrorTrendDatum {
  month: string;
  git: number;
  docker: number;
  kubernetes: number;
  cicd: number;
}
