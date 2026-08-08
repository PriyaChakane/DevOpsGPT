import { useEffect, useState } from 'react';
import { Database, Upload, Trash2, RefreshCw, BookOpen } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { FilterDropdown } from '@/components/common/FilterDropdown';
import { UploadDropzone } from '@/components/common/UploadDropzone';
import { DataTable, type DataTableColumn } from '@/components/tables/DataTable';
import { Modal, ConfirmDialog } from '@/components/common/Modal';
import { useToast } from '@/hooks/useToast';
import {
  getKnowledgeBaseStatus,
  getKnowledgeDocuments,
  uploadKnowledgeDocument,
  deleteKnowledgeDocument,
  reindexKnowledgeDocument,
} from '@/services/knowledgeBaseService';
import { formatDate, formatFileSize } from '@/lib/utils';
import type { KnowledgeBaseStatus, KnowledgeDocument, DocumentCategory } from '@/types/knowledgeBase';

const categories: DocumentCategory[] = [
  'Git Documentation',
  'Docker Documentation',
  'Kubernetes Documentation',
  'CI/CD Documentation',
  'Internal Runbooks',
];

const statusClasses: Record<KnowledgeDocument['status'], string> = {
  indexed: 'bg-success-muted text-success border-success/20',
  indexing: 'bg-warning-muted text-warning border-warning/20',
  failed: 'bg-danger-muted text-danger border-danger/20',
};

export default function KnowledgeBasePage() {
  const [status, setStatus] = useState<KnowledgeBaseStatus | null>(null);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory>('Git Documentation');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<KnowledgeDocument | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([getKnowledgeBaseStatus(), getKnowledgeDocuments()]).then(([s, docs]) => {
      setStatus(s);
      setDocuments(docs);
      setIsLoading(false);
    });
  }, []);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(doc.category);
    return matchesSearch && matchesCategory;
  });

  const handleUpload = async () => {
    if (!pendingFile) return;
    setIsUploading(true);
    try {
      // TODO(flask-integration): the Flask backend will chunk, embed, and index this file into Qdrant.
      const newDoc = await uploadKnowledgeDocument(pendingFile, uploadCategory);
      setDocuments((prev) => [newDoc, ...prev]);
      showToast({ variant: 'success', title: 'Document uploaded', description: `${newDoc.name} is now indexing.` });
      setUploadOpen(false);
      setPendingFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (doc: KnowledgeDocument) => {
    await deleteKnowledgeDocument(doc.id);
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    showToast({ variant: 'success', title: 'Document deleted', description: `${doc.name} was removed from the index.` });
  };

  const handleReindex = async (doc: KnowledgeDocument) => {
    await reindexKnowledgeDocument(doc.id);
    showToast({ variant: 'info', title: 'Re-indexing started', description: `${doc.name} will be re-embedded shortly.` });
  };

  const columns: DataTableColumn<KnowledgeDocument>[] = [
    { key: 'name', header: 'Document', render: (row) => <span className="font-medium text-text-primary">{row.name}</span> },
    { key: 'category', header: 'Category', render: (row) => row.category },
    { key: 'size', header: 'Size', render: (row) => formatFileSize(row.sizeKb) },
    { key: 'uploadedAt', header: 'Uploaded', render: (row) => formatDate(row.uploadedAt) },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${statusClasses[row.status]}`}>
          {row.status}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => handleReindex(row)} aria-label={`Re-index ${row.name}`} className="text-text-muted hover:text-primary">
            <RefreshCw size={14} />
          </button>
          <button type="button" onClick={() => setDeleteTarget(row)} aria-label={`Delete ${row.name}`} className="text-text-muted hover:text-danger">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Knowledge Base"
        subtitle="Documents indexed for retrieval-augmented generation (RAG)."
        actions={
          <button type="button" onClick={() => setUploadOpen(true)} className="btn-primary">
            <Upload size={16} />
            Upload document
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <div className="card p-4">
          <p className="text-xs text-text-secondary">Vector Database</p>
          <p className="mt-1 text-lg font-semibold text-text-primary">{status?.vectorDatabase ?? '—'}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-secondary">Documents Indexed</p>
          <p className="mt-1 text-lg font-semibold text-text-primary">{status?.documentsIndexed.toLocaleString() ?? '—'}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-secondary">Embeddings Status</p>
          <p className="mt-1 text-lg font-semibold text-success">{status?.embeddingsStatus ?? '—'}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-secondary">Last Indexing</p>
          <p className="mt-1 text-sm font-medium text-text-primary">{status ? formatDate(status.lastIndexingTime) : '—'}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-text-secondary">Retrieval Accuracy</p>
          <p className="mt-1 text-lg font-semibold text-text-primary">{status?.retrievalAccuracyPercent ?? '—'}%</p>
        </div>
      </div>

      <div className="my-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Search knowledge base..." className="sm:max-w-sm" />
        <FilterDropdown
          label="Document type"
          options={categories.map((c) => ({ label: c, value: c }))}
          selected={categoryFilter}
          onChange={setCategoryFilter}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredDocs}
        getRowKey={(row) => row.id}
        isLoading={isLoading}
        emptyTitle="No documents found"
        emptyDescription="Upload a document or clear your filters."
      />

      <Modal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload document"
        description="Add a new document to the knowledge base for RAG retrieval."
        footer={
          <>
            <button type="button" onClick={() => setUploadOpen(false)} className="btn-secondary">Cancel</button>
            <button type="button" onClick={handleUpload} disabled={!pendingFile || isUploading} className="btn-primary">
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="upload-category" className="mb-1.5 block text-xs font-medium text-text-secondary">
              Category
            </label>
            <select
              id="upload-category"
              value={uploadCategory}
              onChange={(e) => setUploadCategory(e.target.value as DocumentCategory)}
              className="input-field"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <UploadDropzone
            hint="PDF, Markdown, or text files"
            selectedFileName={pendingFile?.name}
            onFileSelect={setPendingFile}
          />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="Delete document"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? It will be removed from the vector index.`}
        confirmLabel="Delete"
      />

      {documents.length === 0 && !isLoading && (
        <div className="mt-4">
          <EmptyStatePlaceholder />
        </div>
      )}
    </div>
  );
}

function EmptyStatePlaceholder() {
  return (
    <div className="card p-8 text-center text-sm text-text-secondary">
      <BookOpen className="mx-auto mb-2 text-text-muted" size={22} />
      <Database className="hidden" />
      No documents indexed yet.
    </div>
  );
}
