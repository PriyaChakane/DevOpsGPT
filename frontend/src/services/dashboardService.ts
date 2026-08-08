import { mockDelay } from '@/lib/utils';
import { dashboardMockData } from '@/mocks/dashboardMockData';
import type { DashboardData } from '@/types/dashboard';

// TODO(flask-integration): GET /dashboard/metrics
export async function getDashboardMetrics(): Promise<DashboardData> {
  return mockDelay(dashboardMockData, 900);
}
