import type { ClusterOverview, PodRecord, KubernetesRecommendation } from '@/types/kubernetes';

export const mockClusterOverview: ClusterOverview = {
  status: 'Healthy',
  runningPods: 142,
  failedPods: 3,
  warningEvents: 7,
  cpuUsagePercent: 62,
  memoryUsagePercent: 74,
};

export const mockPods: PodRecord[] = [
  { id: 'p1', name: 'api-gateway-7d9f8b', namespace: 'production', status: 'Running', cpu: '120m', memory: '256Mi', restarts: 0 },
  { id: 'p2', name: 'payments-worker-5c6d7', namespace: 'production', status: 'CrashLoopBackOff', cpu: '340m', memory: '512Mi', restarts: 14, issue: 'OOMKilled repeatedly, memory limit too low' },
  { id: 'p3', name: 'auth-service-2f3e1a', namespace: 'production', status: 'Running', cpu: '85m', memory: '198Mi', restarts: 1 },
  { id: 'p4', name: 'notifications-9b8c7d', namespace: 'staging', status: 'Pending', cpu: '-', memory: '-', restarts: 0, issue: 'Insufficient CPU on eligible nodes' },
  { id: 'p5', name: 'ml-inference-4a5b6c', namespace: 'production', status: 'Failed', cpu: '-', memory: '-', restarts: 6, issue: 'ImagePullBackOff: registry auth expired' },
  { id: 'p6', name: 'cache-redis-1d2e3f', namespace: 'production', status: 'Running', cpu: '45m', memory: '128Mi', restarts: 0 },
  { id: 'p7', name: 'billing-cron-8e7f6d', namespace: 'production', status: 'Succeeded', cpu: '-', memory: '-', restarts: 0 },
];

export const mockKubernetesRecommendations: KubernetesRecommendation[] = [
  {
    id: 'kr_1',
    title: 'Increase memory limits for payments-worker',
    explanation: 'The pod is being OOMKilled and restarted 14 times because the configured memory limit (512Mi) is consistently exceeded during peak load.',
    command: 'kubectl set resources deployment payments-worker -n production --limits=memory=1Gi',
    severity: 'critical',
  },
  {
    id: 'kr_2',
    title: 'Refresh registry credentials for ml-inference',
    explanation: 'ImagePullBackOff indicates the imagePullSecret used by this deployment has expired or was rotated without updating the cluster secret.',
    command: 'kubectl create secret docker-registry regcred --docker-server=registry.internal --docker-username=<user> --docker-password=<token> -n production',
    severity: 'high',
  },
  {
    id: 'kr_3',
    title: 'Scale node pool for staging',
    explanation: 'notifications pod is stuck Pending due to insufficient CPU across eligible nodes in the staging node pool.',
    command: 'kubectl scale nodepool staging-pool --nodes=4',
    severity: 'medium',
  },
];
