import type { Severity, IssueStatus, Technology } from './common';

export interface HistoryEntry {
  id: string;
  date: string;
  error: string;
  technology: Technology;
  severity: Severity;
  solution: string;
  status: IssueStatus;
  resolutionTimeMinutes: number;
}

export interface HistoryFilters {
  technologies: Technology[];
  severities: Severity[];
  statuses: IssueStatus[];
  search: string;
  dateFrom?: string;
  dateTo?: string;
}
