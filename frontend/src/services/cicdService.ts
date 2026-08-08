import { mockDelay } from '@/lib/utils';
import { mockCicdAnalysis, mockPipelineHistory } from '@/mocks/cicdMockData';
import type { CicdAnalysisResult, CiProvider, PipelineHistoryEntry } from '@/types/cicd';

export interface AnalyzeCicdLogsRequest {
  pipelineName: string;
  provider: CiProvider;
  logs: string;
}

// TODO(flask-integration): POST /cicd/analyze
export async function analyzeCICDLogs(_request: AnalyzeCicdLogsRequest): Promise<CicdAnalysisResult> {
  return mockDelay(mockCicdAnalysis, 1600);
}

// TODO(flask-integration): GET /cicd/history
export async function getPipelineHistory(): Promise<PipelineHistoryEntry[]> {
  return mockDelay(mockPipelineHistory, 700);
}
