export type CiProvider = 'GitHub Actions' | 'GitLab CI' | 'Jenkins';

export interface CicdAnalysisResult {
  pipelineName: string;
  provider: CiProvider;
  status: 'Failed' | 'Passed' | 'Cancelled';
  failedStep: string;
  buildDurationSeconds: number;
  failureCategory: string;
  rootCause: string;
  suggestedFix: string;
  correctedYaml: string;
}

export interface PipelineHistoryEntry {
  id: string;
  pipelineName: string;
  provider: CiProvider;
  status: 'Passed' | 'Failed' | 'Cancelled';
  duration: string;
  date: string;
  triggeredBy: string;
}
