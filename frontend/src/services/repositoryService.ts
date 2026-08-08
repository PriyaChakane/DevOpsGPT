import { mockDelay } from '@/lib/utils';
import { buildMockRepositoryAnalysis } from '@/mocks/repositoryMockData';
import type { RepositoryAnalysis } from '@/types/repository';

export interface AnalyzeRepositoryRequest {
  repositoryUrl: string;
  branch: string;
}

// TODO(flask-integration): POST /repository/analyze
export async function analyzeRepository(request: AnalyzeRepositoryRequest): Promise<RepositoryAnalysis> {
  const result = buildMockRepositoryAnalysis(request.repositoryUrl, request.branch);
  return mockDelay(result, 1800);
}
