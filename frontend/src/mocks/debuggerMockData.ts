import type { AnalysisResult, ExampleError } from '@/types/debugger';

export const exampleErrors: ExampleError[] = [
  {
    id: 'ex_1',
    label: 'Git authentication failure',
    technology: 'Git',
    errorMessage:
      'remote: Support for password authentication was removed on August 13, 2021.\nfatal: Authentication failed for \'https://github.com/org/repo.git/\'',
  },
  {
    id: 'ex_2',
    label: 'Docker build failure',
    technology: 'Docker',
    errorMessage:
      'ERROR [4/6] RUN pip install -r requirements.txt\nfailed to solve: process "/bin/sh -c pip install -r requirements.txt" did not complete successfully: exit code 1',
  },
  {
    id: 'ex_3',
    label: 'Kubernetes ImagePullBackOff',
    technology: 'Kubernetes',
    errorMessage:
      'Failed to pull image "registry.internal/app:latest": rpc error: code = Unknown desc = Error response from daemon: pull access denied',
  },
  {
    id: 'ex_4',
    label: 'CI/CD pipeline timeout',
    technology: 'CI/CD',
    errorMessage:
      'Error: The operation was canceled.\nJob exceeded maximum execution time of 30 minutes and was terminated.',
  },
];

export function buildMockAnalysis(errorMessage: string): AnalysisResult {
  const lower = errorMessage.toLowerCase();

  if (lower.includes('image') || lower.includes('pull')) {
    return {
      id: 'analysis_k8s_001',
      tool: 'Kubernetes',
      category: 'Image Pull Error',
      severity: 'high',
      status: 'Analyzed',
      rootCause:
        'The container runtime could not pull the specified image because the registry credentials attached to the service account are missing or expired, or the image tag does not exist in the target registry.',
      solutionCommands: [
        'kubectl get secret regcred -n default',
        'kubectl create secret docker-registry regcred --docker-server=registry.internal --docker-username=<user> --docker-password=<token>',
        'kubectl patch serviceaccount default -p \'{"imagePullSecrets": [{"name": "regcred"}]}\'',
        'kubectl rollout restart deployment/app',
      ],
      preventionTips: [
        'Use imagePullSecrets consistently across all namespaces that deploy this image.',
        'Set up automated credential rotation with a monitored expiry alert.',
        'Add a CI step that verifies the image tag exists before deployment.',
      ],
      confidenceScore: 94,
      reasoning: [
        { step: 1, title: 'Parsed error signature', description: 'Identified "ImagePullBackOff" pattern in the Kubernetes event stream.' },
        { step: 2, title: 'Checked registry auth', description: 'Cross-referenced service account secrets against the target registry configuration.' },
        { step: 3, title: 'Matched known pattern', description: 'Found a 91% match against similar incidents in the knowledge base.' },
        { step: 4, title: 'Generated remediation', description: 'Constructed a kubectl-based fix using the retrieved best-practice runbook.' },
      ],
      sources: [
        { id: 'src_1', title: 'Kubernetes: Pull an Image from a Private Registry', type: 'documentation', url: 'https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/', relevance: 96 },
        { id: 'src_2', title: 'Internal Runbook: Registry Credential Rotation', type: 'internal-runbook', url: '#', relevance: 88 },
        { id: 'src_3', title: 'ImagePullBackOff megathread', type: 'stackoverflow', url: '#', relevance: 74 },
      ],
      fixHistory: [
        { id: 'fh_1', date: '2026-07-28T10:00:00Z', action: 'Applied similar fix on payments-service', outcome: 'success' },
        { id: 'fh_2', date: '2026-06-14T10:00:00Z', action: 'Applied similar fix on notifications-worker', outcome: 'success' },
      ],
      createdAt: new Date().toISOString(),
    };
  }

  if (lower.includes('pip') || lower.includes('docker') || lower.includes('build')) {
    return {
      id: 'analysis_docker_001',
      tool: 'Docker',
      category: 'Build Failure',
      severity: 'medium',
      status: 'Analyzed',
      rootCause:
        'The RUN step failed while installing Python dependencies, most likely due to a missing system-level build dependency or a version conflict inside requirements.txt.',
      solutionCommands: [
        'docker build --no-cache -t app:debug .',
        'docker run --rm app:debug pip install -r requirements.txt -v',
        'apt-get install -y build-essential libpq-dev  # add to Dockerfile if native extensions are required',
      ],
      preventionTips: [
        'Pin exact dependency versions in requirements.txt to avoid resolver drift.',
        'Use multi-stage builds to isolate build-time dependencies from the runtime image.',
        'Cache pip downloads with BuildKit cache mounts to speed up rebuilds.',
      ],
      confidenceScore: 89,
      reasoning: [
        { step: 1, title: 'Parsed build log', description: 'Located the failing layer at step 4/6 in the Docker build output.' },
        { step: 2, title: 'Classified failure', description: 'Exit code 1 during pip install indicates a dependency resolution or compilation error.' },
        { step: 3, title: 'Cross-checked knowledge base', description: 'Matched against common native-extension build failures.' },
      ],
      sources: [
        { id: 'src_1', title: 'Docker: Best practices for writing Dockerfiles', type: 'documentation', url: 'https://docs.docker.com/develop/develop-images/dockerfile_best-practices/', relevance: 91 },
        { id: 'src_2', title: 'Internal Runbook: Python Build Failures', type: 'internal-runbook', url: '#', relevance: 85 },
      ],
      fixHistory: [
        { id: 'fh_1', date: '2026-07-30T09:20:00Z', action: 'Added build-essential to base image', outcome: 'success' },
      ],
      createdAt: new Date().toISOString(),
    };
  }

  if (lower.includes('timeout') || lower.includes('pipeline') || lower.includes('cancel')) {
    return {
      id: 'analysis_cicd_001',
      tool: 'CI/CD',
      category: 'Pipeline Timeout',
      severity: 'critical',
      status: 'Analyzed',
      rootCause:
        'The job exceeded its configured maximum runtime, most likely because the test suite grew significantly or a step is hanging on an unresponsive network call without a timeout.',
      solutionCommands: [
        'gh run view <run-id> --log-failed',
        '# Add explicit timeouts to slow steps in the workflow YAML',
        '# Split the test suite into parallel shards using a matrix strategy',
      ],
      preventionTips: [
        'Set per-step timeout-minutes to fail fast instead of hitting the global timeout.',
        'Parallelize long-running test suites using a job matrix.',
        'Add alerting when average pipeline duration trends upward over time.',
      ],
      confidenceScore: 91,
      reasoning: [
        { step: 1, title: 'Detected cancellation signal', description: 'Log shows the job was force-cancelled by the runner after exceeding its time budget.' },
        { step: 2, title: 'Checked historical durations', description: 'Compared against the last 20 runs of this pipeline; duration has grown 40%.' },
        { step: 3, title: 'Recommended mitigation', description: 'Suggested sharding tests and adding step-level timeouts.' },
      ],
      sources: [
        { id: 'src_1', title: 'GitHub Actions: Usage limits, billing, and administration', type: 'documentation', url: 'https://docs.github.com/actions', relevance: 87 },
        { id: 'src_2', title: 'Internal Runbook: CI Pipeline Performance', type: 'internal-runbook', url: '#', relevance: 90 },
      ],
      fixHistory: [],
      createdAt: new Date().toISOString(),
    };
  }

  return {
    id: 'analysis_git_001',
    tool: 'Git',
    category: 'Authentication Error',
    severity: 'medium',
    status: 'Analyzed',
    rootCause:
      'GitHub removed support for password-based authentication over HTTPS in 2021. The credentials being used are a plaintext password rather than a personal access token or SSH key, causing the remote to reject the connection.',
    solutionCommands: [
      'git remote set-url origin git@github.com:org/repo.git',
      'ssh-keygen -t ed25519 -C "you@example.com"',
      'gh auth login --hostname github.com --git-protocol ssh',
      'git push origin main',
    ],
    preventionTips: [
      'Switch to SSH keys or a fine-grained personal access token for all remotes.',
      'Store credentials in the OS keychain via git credential-manager.',
      'Rotate tokens on a schedule and document expiry dates in your team runbook.',
    ],
    confidenceScore: 96,
    reasoning: [
      { step: 1, title: 'Parsed error signature', description: 'Detected the "password authentication was removed" message unique to GitHub HTTPS auth.' },
      { step: 2, title: 'Identified auth method', description: 'Determined the remote URL uses HTTPS with legacy credential storage.' },
      { step: 3, title: 'Retrieved best practice', description: 'Matched against the internal runbook for Git authentication migrations.' },
      { step: 4, title: 'Generated fix sequence', description: 'Produced a step-by-step SSH migration with verification command.' },
    ],
    sources: [
      { id: 'src_1', title: 'GitHub: Token authentication requirements', type: 'documentation', url: 'https://docs.github.com/authentication', relevance: 97 },
      { id: 'src_2', title: 'Internal Runbook: Git Credential Migration', type: 'internal-runbook', url: '#', relevance: 92 },
      { id: 'src_3', title: 'Fatal: Authentication failed thread', type: 'stackoverflow', url: '#', relevance: 81 },
    ],
    fixHistory: [
      { id: 'fh_1', date: '2026-08-01T15:30:00Z', action: 'Migrated origin remote to SSH', outcome: 'success' },
      { id: 'fh_2', date: '2026-05-19T09:10:00Z', action: 'Rotated expired PAT for CI bot account', outcome: 'success' },
    ],
    createdAt: new Date().toISOString(),
  };
}
