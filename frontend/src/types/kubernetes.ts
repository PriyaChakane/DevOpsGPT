export type PodStatus = 'Running' | 'Pending' | 'Failed' | 'CrashLoopBackOff' | 'Succeeded';

export interface ClusterOverview {
  status: 'Healthy' | 'Degraded' | 'Critical';
  runningPods: number;
  failedPods: number;
  warningEvents: number;
  cpuUsagePercent: number;
  memoryUsagePercent: number;
}

export interface PodRecord {
  id: string;
  name: string;
  namespace: string;
  status: PodStatus;
  cpu: string;
  memory: string;
  restarts: number;
  issue?: string;
}

export interface KubernetesRecommendation {
  id: string;
  title: string;
  explanation: string;
  command: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}
