import { mockDelay } from '@/lib/utils';
import { buildMockAnalysis } from '@/mocks/debuggerMockData';
import type { AnalysisResult, AnalyzeErrorRequest } from '@/types/debugger';

/**
 * Analyze a pasted error message / uploaded log.
 *
 * TODO(flask-integration): replace the mock body with:
 *   const { data } = await apiClient.post<AnalysisResult>('/debugger/analyze', request);
 *   return data;
 * The Flask backend is expected to run the request through the RAG + LLM
 * pipeline and return an AnalysisResult shaped payload.
 */
export async function analyzeError(request: AnalyzeErrorRequest): Promise<AnalysisResult> {
  const result = buildMockAnalysis(request.errorMessage);
  return mockDelay(result, 1600);
}
