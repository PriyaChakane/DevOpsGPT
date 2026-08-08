export interface RepositoryScores {
  health: number;
  security: number;
  codeQuality: number;
  documentation: number;
}

export interface RepositoryIssueCounts {
  critical: number;
  warnings: number;
  suggestions: number;
}

export interface RepositoryActivityDatum {
  month: string;
  commits: number;
  pullRequests: number;
}

export interface LanguageDatum {
  language: string;
  percent: number;
  color: string;
}

export interface RecentCommit {
  id: string;
  sha: string;
  message: string;
  author: string;
  date: string;
}

export interface PullRequestSummary {
  open: number;
  merged: number;
  closed: number;
  averageMergeTimeHours: number;
}

export interface SecurityFinding {
  id: string;
  package: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  fixedIn: string;
}

export interface RepositoryAnalysis {
  repositoryUrl: string;
  branch: string;
  scores: RepositoryScores;
  issueCounts: RepositoryIssueCounts;
  recommendations: string[];
  activity: RepositoryActivityDatum[];
  languages: LanguageDatum[];
  recentCommits: RecentCommit[];
  pullRequestSummary: PullRequestSummary;
  securityFindings: SecurityFinding[];
}
