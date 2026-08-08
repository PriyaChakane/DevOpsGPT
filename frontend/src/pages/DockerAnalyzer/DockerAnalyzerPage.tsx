import { useState } from 'react';
import { Container, Wand2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { UploadDropzone } from '@/components/common/UploadDropzone';
import { ProgressScore } from '@/components/common/ProgressScore';
import { CodeBlock } from '@/components/common/CodeBlock';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { analyzeDockerfile } from '@/services/dockerService';
import type { DockerAnalysisResult, DockerIssue } from '@/types/docker';

const sampleDockerfile = `FROM python:3.11

WORKDIR /app
COPY . .
RUN pip install -r requirements.txt

CMD ["python", "app.py"]`;

const categoryLabel: Record<DockerIssue['category'], string> = {
  security: 'Security Issues',
  optimization: 'Layer Optimization',
  dependency: 'Dependency Issues',
  'best-practice': 'Best Practices',
};

export default function DockerAnalyzerPage() {
  const [dockerfileContent, setDockerfileContent] = useState(sampleDockerfile);
  const [fileName, setFileName] = useState<string | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DockerAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!dockerfileContent.trim()) return;
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeDockerfile({ dockerfileContent });
      setResult(analysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const groupedIssues = result
    ? (['security', 'optimization', 'dependency', 'best-practice'] as const).map((category) => ({
        category,
        issues: result.issues.filter((issue) => issue.category === category),
      }))
    : [];

  return (
    <div>
      <PageHeader title="Docker Analyzer" subtitle="Analyze a Dockerfile for security, size, and optimization issues." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card space-y-4 p-5">
          <UploadDropzone
            accept="Dockerfile,.dockerfile"
            hint="Accepts a Dockerfile"
            selectedFileName={fileName}
            onFileSelect={(file) => {
              setFileName(file.name);
              const reader = new FileReader();
              reader.onload = () => setDockerfileContent(String(reader.result ?? ''));
              reader.readAsText(file);
            }}
          />
          <div>
            <label htmlFor="dockerfile-content" className="mb-1.5 block text-sm font-medium text-text-primary">
              Or paste your Dockerfile
            </label>
            <textarea
              id="dockerfile-content"
              value={dockerfileContent}
              onChange={(e) => setDockerfileContent(e.target.value)}
              rows={12}
              className="input-field resize-none font-mono text-[13px]"
            />
          </div>
          <button type="button" onClick={handleAnalyze} disabled={isAnalyzing} className="btn-primary w-full">
            <Wand2 size={16} />
            {isAnalyzing ? 'Analyzing...' : 'Analyze Dockerfile'}
          </button>
        </div>

        <div>
          {isAnalyzing && (
            <div className="card">
              <LoadingState label="Analyzing Dockerfile..." />
            </div>
          )}

          {!isAnalyzing && !result && (
            <div className="card">
              <EmptyState icon={Container} title="No analysis yet" description="Paste or upload a Dockerfile, then click Analyze Dockerfile." />
            </div>
          )}

          {!isAnalyzing && result && (
            <div className="space-y-4">
              <div className="card grid grid-cols-2 gap-4 p-5 sm:grid-cols-4">
                <div className="flex flex-col items-center gap-2">
                  <ProgressScore score={result.scores.imageScore} size="sm" />
                  <span className="text-xs text-text-secondary">Image Score</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ProgressScore score={result.scores.securityScore} size="sm" />
                  <span className="text-xs text-text-secondary">Security</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <ProgressScore score={result.scores.optimizationScore} size="sm" />
                  <span className="text-xs text-text-secondary">Optimization</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 text-center">
                  <p className="text-lg font-semibold text-text-primary">{(result.scores.estimatedImageSizeMb / 1024).toFixed(2)} GB</p>
                  <span className="text-xs text-text-secondary">Est. image size</span>
                </div>
              </div>

              {groupedIssues.map(
                (group) =>
                  group.issues.length > 0 && (
                    <div key={group.category} className="card p-5">
                      <h3 className="mb-3 text-sm font-semibold text-text-primary">{categoryLabel[group.category]}</h3>
                      <div className="space-y-3">
                        {group.issues.map((issue) => (
                          <div key={issue.id} className="rounded-lg border border-border bg-bg-elevated p-3.5">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm font-medium text-text-primary">{issue.problem}</p>
                              <SeverityBadge severity={issue.severity} />
                            </div>
                            <p className="mt-1 text-xs text-text-secondary">
                              <span className="font-medium text-text-muted">Impact:</span> {issue.impact}
                            </p>
                            <p className="mt-1 text-xs text-text-secondary">
                              <span className="font-medium text-text-muted">Fix:</span> {issue.fix}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}

              <div className="card p-5">
                <h3 className="mb-3 text-sm font-semibold text-text-primary">Fixed Dockerfile</h3>
                <CodeBlock code={result.fixedDockerfileSnippet} language="Dockerfile" fileName="Dockerfile" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
