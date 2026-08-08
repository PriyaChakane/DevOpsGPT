import { mockDelay } from '@/lib/utils';
import { mockDockerAnalysis } from '@/mocks/dockerMockData';
import type { DockerAnalysisResult } from '@/types/docker';

export interface AnalyzeDockerfileRequest {
  dockerfileContent: string;
}

// TODO(flask-integration): POST /docker/analyze (multipart if a file was uploaded)
export async function analyzeDockerfile(_request: AnalyzeDockerfileRequest): Promise<DockerAnalysisResult> {
  return mockDelay(mockDockerAnalysis, 1500);
}
