import { mockDelay } from '@/lib/utils';
import { mockClusterOverview, mockPods, mockKubernetesRecommendations } from '@/mocks/kubernetesMockData';
import type { ClusterOverview, PodRecord, KubernetesRecommendation } from '@/types/kubernetes';

export interface KubernetesSnapshot {
  cluster: ClusterOverview;
  pods: PodRecord[];
  recommendations: KubernetesRecommendation[];
}

// TODO(flask-integration): GET /kubernetes/snapshot?context=<cluster-context>
export async function getKubernetesSnapshot(): Promise<KubernetesSnapshot> {
  return mockDelay(
    { cluster: mockClusterOverview, pods: mockPods, recommendations: mockKubernetesRecommendations },
    1100
  );
}

// TODO(flask-integration): POST /kubernetes/analyze { errorMessage }
export async function analyzeKubernetesIssue(_errorMessage: string): Promise<KubernetesRecommendation[]> {
  return mockDelay(mockKubernetesRecommendations, 1400);
}
