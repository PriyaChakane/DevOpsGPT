import { mockDelay, generateId } from '@/lib/utils';
import { mockKnowledgeDocuments, mockKnowledgeBaseStatus } from '@/mocks/knowledgeBaseMockData';
import type { KnowledgeBaseStatus, KnowledgeDocument } from '@/types/knowledgeBase';

// TODO(flask-integration): GET /knowledge-base/status
export async function getKnowledgeBaseStatus(): Promise<KnowledgeBaseStatus> {
  return mockDelay(mockKnowledgeBaseStatus, 600);
}

// TODO(flask-integration): GET /knowledge-base/documents
export async function getKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
  return mockDelay(mockKnowledgeDocuments, 700);
}

// TODO(flask-integration): POST /knowledge-base/documents (multipart upload)
// The Flask backend is expected to chunk, embed, and index the document into Qdrant.
export async function uploadKnowledgeDocument(file: File, category: KnowledgeDocument['category']): Promise<KnowledgeDocument> {
  const newDoc: KnowledgeDocument = {
    id: generateId('doc'),
    name: file.name,
    category,
    sizeKb: Math.round(file.size / 1024),
    uploadedAt: new Date().toISOString(),
    status: 'indexing',
    chunks: 0,
  };
  return mockDelay(newDoc, 1200);
}

// TODO(flask-integration): DELETE /knowledge-base/documents/:id
export async function deleteKnowledgeDocument(_id: string): Promise<{ success: boolean }> {
  return mockDelay({ success: true }, 500);
}

// TODO(flask-integration): POST /knowledge-base/documents/:id/reindex
export async function reindexKnowledgeDocument(_id: string): Promise<{ success: boolean }> {
  return mockDelay({ success: true }, 900);
}
