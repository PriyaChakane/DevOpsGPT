import type { DockerAnalysisResult } from '@/types/docker';

export const mockDockerAnalysis: DockerAnalysisResult = {
  scores: { imageScore: 71, securityScore: 68, optimizationScore: 64, estimatedImageSizeMb: 1240 },
  issues: [
    {
      id: 'di_1',
      problem: 'Large image size',
      impact: 'Slow deployment',
      fix: 'Use python:slim instead of a full Python image',
      severity: 'high',
      category: 'optimization',
    },
    {
      id: 'di_2',
      problem: 'Running container as root',
      impact: 'Increases blast radius of a container compromise',
      fix: 'Add a non-root USER instruction before the final CMD',
      severity: 'critical',
      category: 'security',
    },
    {
      id: 'di_3',
      problem: 'No .dockerignore file present',
      impact: 'Build context includes unnecessary files, slowing builds',
      fix: 'Add a .dockerignore excluding node_modules, .git, and local env files',
      severity: 'medium',
      category: 'best-practice',
    },
    {
      id: 'di_4',
      problem: 'Unpinned base image tag',
      impact: 'Non-reproducible builds across environments',
      fix: 'Pin the base image to a specific digest or version tag',
      severity: 'medium',
      category: 'dependency',
    },
  ],
  layerSuggestions: [
    'Combine consecutive RUN apt-get install commands into a single layer to reduce image size.',
    'Move frequently-changing COPY instructions (source code) after less volatile dependency installs to maximize cache hits.',
    'Use multi-stage builds to discard build-time toolchains from the final runtime image.',
  ],
  fixedDockerfileSnippet: `FROM python:3.12-slim AS base

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd --create-home appuser
USER appuser

EXPOSE 8000
CMD ["gunicorn", "app:server", "--bind", "0.0.0.0:8000"]`,
};
