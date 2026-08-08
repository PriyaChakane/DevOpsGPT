import type { KnowledgeDocument, KnowledgeBaseStatus } from '@/types/knowledgeBase';

export const mockKnowledgeBaseStatus: KnowledgeBaseStatus = {
  vectorDatabase: 'Qdrant',
  documentsIndexed: 25000,
  embeddingsStatus: 'Healthy',
  lastIndexingTime: '2026-08-08T03:15:00Z',
  retrievalAccuracyPercent: 93.4,
};

export const mockKnowledgeDocuments: KnowledgeDocument[] = [
  { id: 'doc_1', name: 'git-authentication-guide.md', category: 'Git Documentation', sizeKb: 48, uploadedAt: '2026-07-12T10:00:00Z', status: 'indexed', chunks: 32 },
  { id: 'doc_2', name: 'dockerfile-best-practices.md', category: 'Docker Documentation', sizeKb: 112, uploadedAt: '2026-07-15T14:20:00Z', status: 'indexed', chunks: 74 },
  { id: 'doc_3', name: 'k8s-troubleshooting-runbook.pdf', category: 'Kubernetes Documentation', sizeKb: 890, uploadedAt: '2026-07-20T09:45:00Z', status: 'indexed', chunks: 156 },
  { id: 'doc_4', name: 'github-actions-patterns.md', category: 'CI/CD Documentation', sizeKb: 64, uploadedAt: '2026-07-28T11:30:00Z', status: 'indexed', chunks: 41 },
  { id: 'doc_5', name: 'incident-response-runbook.pdf', category: 'Internal Runbooks', sizeKb: 340, uploadedAt: '2026-08-01T16:10:00Z', status: 'indexed', chunks: 98 },
  { id: 'doc_6', name: 'kubernetes-oom-guide.md', category: 'Kubernetes Documentation', sizeKb: 28, uploadedAt: '2026-08-05T08:00:00Z', status: 'indexing', chunks: 0 },
  { id: 'doc_7', name: 'ci-pipeline-security.md', category: 'CI/CD Documentation', sizeKb: 52, uploadedAt: '2026-08-06T13:25:00Z', status: 'failed', chunks: 0 },
];
