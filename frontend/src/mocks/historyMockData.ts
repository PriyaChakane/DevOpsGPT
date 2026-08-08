import type { HistoryEntry } from '@/types/history';

export const mockHistoryEntries: HistoryEntry[] = [
  { id: 'h_1', date: '2026-08-07T09:12:00Z', error: 'Authentication failed for HTTPS remote', technology: 'Git', severity: 'medium', solution: 'Regenerated personal access token', status: 'resolved', resolutionTimeMinutes: 3.2 },
  { id: 'h_2', date: '2026-08-07T07:40:00Z', error: 'ImagePullBackOff on production deployment', technology: 'Kubernetes', severity: 'high', solution: 'Fixed image tag in deployment manifest', status: 'resolved', resolutionTimeMinutes: 5.1 },
  { id: 'h_3', date: '2026-08-06T22:05:00Z', error: 'Docker layer cache invalidated on every build', technology: 'Docker', severity: 'low', solution: 'Reordered Dockerfile COPY instructions', status: 'in-progress', resolutionTimeMinutes: 0 },
  { id: 'h_4', date: '2026-08-06T18:22:00Z', error: 'Integration test pipeline exceeded 30 min timeout', technology: 'CI/CD', severity: 'critical', solution: 'Pending investigation', status: 'unresolved', resolutionTimeMinutes: 0 },
  { id: 'h_5', date: '2026-08-06T14:51:00Z', error: 'Merge conflict in shared config module', technology: 'Git', severity: 'medium', solution: 'Rebased feature branch onto main', status: 'resolved', resolutionTimeMinutes: 6.4 },
  { id: 'h_6', date: '2026-08-05T11:03:00Z', error: 'CrashLoopBackOff on payments-worker', technology: 'Kubernetes', severity: 'critical', solution: 'Increased memory limits on deployment', status: 'resolved', resolutionTimeMinutes: 9.8 },
  { id: 'h_7', date: '2026-08-05T08:44:00Z', error: 'pip install failing on native extension build', technology: 'Docker', severity: 'medium', solution: 'Pinned base image and added build-essential', status: 'resolved', resolutionTimeMinutes: 4.6 },
  { id: 'h_8', date: '2026-08-04T20:12:00Z', error: 'Detached HEAD after checkout of tag', technology: 'Git', severity: 'low', solution: 'Checked out a proper branch and cherry-picked commit', status: 'resolved', resolutionTimeMinutes: 2.1 },
  { id: 'h_9', date: '2026-08-04T16:38:00Z', error: 'GitHub Actions cache restore failure', technology: 'CI/CD', severity: 'low', solution: 'Updated cache key to include lockfile hash', status: 'resolved', resolutionTimeMinutes: 3.7 },
  { id: 'h_10', date: '2026-08-03T13:55:00Z', error: 'Pod stuck Pending due to insufficient CPU', technology: 'Kubernetes', severity: 'medium', solution: 'Scaled staging node pool', status: 'resolved', resolutionTimeMinutes: 7.3 },
  { id: 'h_11', date: '2026-08-03T09:20:00Z', error: 'Rejected push due to non-fast-forward', technology: 'Git', severity: 'low', solution: 'Pulled with rebase before pushing', status: 'resolved', resolutionTimeMinutes: 1.9 },
  { id: 'h_12', date: '2026-08-02T19:04:00Z', error: 'Docker image size exceeds registry quota', technology: 'Docker', severity: 'high', solution: 'Switched to slim base image and multi-stage build', status: 'resolved', resolutionTimeMinutes: 11.2 },
];
