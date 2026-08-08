import type { RepositoryAnalysis } from '@/types/repository';

export function buildMockRepositoryAnalysis(repositoryUrl: string, branch: string): RepositoryAnalysis {
  return {
    repositoryUrl,
    branch,
    scores: { health: 82, security: 74, codeQuality: 88, documentation: 65 },
    issueCounts: { critical: 5, warnings: 12, suggestions: 20 },
    recommendations: [
      'Upgrade "requests" from 2.25.0 to 2.32.3 to resolve a known SSRF vulnerability.',
      'Add branch protection rules requiring at least one review before merging to main.',
      'Increase test coverage for the /api/payments module, currently at 41%.',
      'Add a CODEOWNERS file to clarify review ownership across packages.',
    ],
    activity: [
      { month: 'Mar', commits: 142, pullRequests: 28 },
      { month: 'Apr', commits: 168, pullRequests: 34 },
      { month: 'May', commits: 121, pullRequests: 22 },
      { month: 'Jun', commits: 189, pullRequests: 41 },
      { month: 'Jul', commits: 205, pullRequests: 38 },
      { month: 'Aug', commits: 97, pullRequests: 19 },
    ],
    languages: [
      { language: 'TypeScript', percent: 58, color: '#3b82f6' },
      { language: 'Python', percent: 22, color: '#a855f7' },
      { language: 'YAML', percent: 11, color: '#22c55e' },
      { language: 'Shell', percent: 6, color: '#f59e0b' },
      { language: 'Other', percent: 3, color: '#64748b' },
    ],
    recentCommits: [
      { id: 'c1', sha: 'a1b2c3d', message: 'fix: resolve race condition in webhook retry queue', author: 'j.chen', date: '2026-08-07T16:20:00Z' },
      { id: 'c2', sha: 'e4f5g6h', message: 'feat: add rate limiting middleware to public API', author: 'r.patel', date: '2026-08-07T10:05:00Z' },
      { id: 'c3', sha: 'i7j8k9l', message: 'chore: bump dependencies for security patches', author: 'dependabot', date: '2026-08-06T22:40:00Z' },
      { id: 'c4', sha: 'm1n2o3p', message: 'refactor: extract auth logic into shared package', author: 's.moore', date: '2026-08-06T14:12:00Z' },
      { id: 'c5', sha: 'q4r5s6t', message: 'docs: update deployment runbook for staging', author: 'j.chen', date: '2026-08-05T09:30:00Z' },
    ],
    pullRequestSummary: { open: 14, merged: 187, closed: 23, averageMergeTimeHours: 18.4 },
    securityFindings: [
      { id: 'sf_1', package: 'requests', severity: 'high', description: 'Improper certificate validation may allow SSRF via crafted redirects.', fixedIn: '2.32.3' },
      { id: 'sf_2', package: 'lodash', severity: 'medium', description: 'Prototype pollution in merge and mergeWith functions.', fixedIn: '4.17.21' },
      { id: 'sf_3', package: 'pyyaml', severity: 'critical', description: 'Arbitrary code execution via unsafe yaml.load usage.', fixedIn: '6.0.1' },
      { id: 'sf_4', package: 'axios', severity: 'low', description: 'Server-side request forgery in proxy configuration handling.', fixedIn: '1.7.4' },
    ],
  };
}
