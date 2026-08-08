import { mockDelay } from '@/lib/utils';
import {
  mockAnalyticsSummary,
  mockTechnologyProblems,
  mockConfidenceTrend,
  mockTeamActivity,
  mockErrorTrends,
} from '@/mocks/analyticsMockData';

export interface AnalyticsData {
  summary: typeof mockAnalyticsSummary;
  technologyProblems: typeof mockTechnologyProblems;
  confidenceTrend: typeof mockConfidenceTrend;
  teamActivity: typeof mockTeamActivity;
  errorTrends: typeof mockErrorTrends;
}

// TODO(flask-integration): GET /analytics/overview
export async function getAnalyticsOverview(): Promise<AnalyticsData> {
  return mockDelay(
    {
      summary: mockAnalyticsSummary,
      technologyProblems: mockTechnologyProblems,
      confidenceTrend: mockConfidenceTrend,
      teamActivity: mockTeamActivity,
      errorTrends: mockErrorTrends,
    },
    900
  );
}
