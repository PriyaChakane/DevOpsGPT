import type { Severity, Technology } from './common';

export type ErrorTypeOption =
  | 'Authentication Error'
  | 'Merge Conflict'
  | 'Build Failure'
  | 'Network Timeout'
  | 'Permission Denied'
  | 'Configuration Error'
  | 'Dependency Error'
  | 'Runtime Exception';

export interface AnalyzeErrorRequest {
  errorMessage: string;
  errorType?: ErrorTypeOption;
  technology: Technology;
  fileName?: string;
}

export interface ReasoningStep {
  step: number;
  title: string;
  description: string;
}

export interface SourceReference {
  id: string;
  title: string;
  type: 'documentation' | 'stackoverflow' | 'github-issue' | 'internal-runbook';
  url: string;
  relevance: number;
}

export interface FixHistoryEntry {
  id: string;
  date: string;
  action: string;
  outcome: 'success' | 'failed' | 'pending';
}

export interface AnalysisResult {
  id: string;
  tool: Technology;
  category: string;
  severity: Severity;
  status: 'Analyzed';
  rootCause: string;
  solutionCommands: string[];
  preventionTips: string[];
  confidenceScore: number;
  reasoning: ReasoningStep[];
  sources: SourceReference[];
  fixHistory: FixHistoryEntry[];
  createdAt: string;
}

export interface ExampleError {
  id: string;
  label: string;
  technology: Technology;
  errorMessage: string;
}
