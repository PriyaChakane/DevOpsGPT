export type DocumentCategory =
  | 'Git Documentation'
  | 'Docker Documentation'
  | 'Kubernetes Documentation'
  | 'CI/CD Documentation'
  | 'Internal Runbooks';

export interface KnowledgeDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  sizeKb: number;
  uploadedAt: string;
  status: 'indexed' | 'indexing' | 'failed';
  chunks: number;
}

export interface KnowledgeBaseStatus {
  vectorDatabase: string;
  documentsIndexed: number;
  embeddingsStatus: 'Healthy' | 'Degraded' | 'Offline';
  lastIndexingTime: string;
  retrievalAccuracyPercent: number;
}
