import type { CicdAnalysisResult, PipelineHistoryEntry } from '@/types/cicd';

export const mockCicdAnalysis: CicdAnalysisResult = {
  pipelineName: 'build-and-deploy',
  provider: 'GitHub Actions',
  status: 'Failed',
  failedStep: 'run-integration-tests',
  buildDurationSeconds: 1847,
  failureCategory: 'Timeout',
  rootCause:
    'The integration test suite exceeded the 30 minute job timeout. Historical run data shows the suite duration has grown steadily as new test cases were added without corresponding parallelization.',
  suggestedFix:
    'Shard the integration test suite across 4 parallel jobs using a matrix strategy, and add a step-level timeout to fail fast on individual hangs.',
  correctedYaml: `jobs:
  integration-tests:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v4
      - name: Run integration tests (shard \${{ matrix.shard }}/4)
        timeout-minutes: 12
        run: npm run test:integration -- --shard=\${{ matrix.shard }}/4`,
};

export const mockPipelineHistory: PipelineHistoryEntry[] = [
  { id: 'ph_1', pipelineName: 'build-and-deploy', provider: 'GitHub Actions', status: 'Failed', duration: '30m 47s', date: '2026-08-07T18:22:00Z', triggeredBy: 'r.patel' },
  { id: 'ph_2', pipelineName: 'build-and-deploy', provider: 'GitHub Actions', status: 'Passed', duration: '14m 12s', date: '2026-08-06T09:10:00Z', triggeredBy: 'j.chen' },
  { id: 'ph_3', pipelineName: 'deploy-staging', provider: 'GitLab CI', status: 'Passed', duration: '8m 55s', date: '2026-08-05T22:41:00Z', triggeredBy: 's.moore' },
  { id: 'ph_4', pipelineName: 'nightly-e2e', provider: 'Jenkins', status: 'Cancelled', duration: '5m 03s', date: '2026-08-05T02:00:00Z', triggeredBy: 'scheduler' },
  { id: 'ph_5', pipelineName: 'build-and-deploy', provider: 'GitHub Actions', status: 'Passed', duration: '13m 40s', date: '2026-08-04T15:33:00Z', triggeredBy: 'dependabot' },
];
