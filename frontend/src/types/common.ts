export type Technology = 'Git' | 'Docker' | 'Kubernetes' | 'CI/CD' | 'GitHub';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export type IssueStatus = 'resolved' | 'unresolved' | 'in-progress' | 'analyzed';

export interface SelectOption {
  label: string;
  value: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';
