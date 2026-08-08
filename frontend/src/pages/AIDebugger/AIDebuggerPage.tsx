import { useState } from 'react';
import { Bug, Wand2, Eraser, FileWarning, FileCode, FileJson, FileTerminal } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { UploadDropzone } from '@/components/common/UploadDropzone';
import { AIResponseCard } from '@/components/common/AIResponseCard';
import { AnalysisTabs } from '@/components/debugger/AnalysisTabs';
import { LoadingState } from '@/components/common/LoadingState';
import { EmptyState } from '@/components/common/EmptyState';
import { useToast } from '@/hooks/useToast';
import { analyzeError } from '@/services/debuggerService';
import { exampleErrors } from '@/mocks/debuggerMockData';
import type { AnalysisResult, ErrorTypeOption } from '@/types/debugger';
import type { Technology } from '@/types/common';

const errorTypeOptions: ErrorTypeOption[] = [
  'Authentication Error',
  'Merge Conflict',
  'Build Failure',
  'Network Timeout',
  'Permission Denied',
  'Configuration Error',
  'Dependency Error',
  'Runtime Exception',
];

const technologyOptions: Technology[] = ['Git', 'Docker', 'Kubernetes', 'CI/CD', 'GitHub'];

const uploadTypes = [
  { label: 'Log file', icon: FileTerminal, accept: '.log,.txt' },
  { label: 'Dockerfile', icon: FileCode, accept: 'Dockerfile,.dockerfile' },
  { label: 'Kubernetes YAML', icon: FileJson, accept: '.yaml,.yml' },
  { label: 'GitHub Actions log', icon: FileWarning, accept: '.log,.txt' },
];

export default function AIDebuggerPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState<ErrorTypeOption>('Authentication Error');
  const [technology, setTechnology] = useState<Technology>('Git');
  const [uploadType, setUploadType] = useState(uploadTypes[0]);
  const [fileName, setFileName] = useState<string | undefined>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { showToast } = useToast();

  const handleAnalyze = async () => {
    if (!errorMessage.trim()) {
      showToast({ variant: 'warning', title: 'Nothing to analyze', description: 'Paste an error message or upload a file first.' });
      return;
    }
    setIsAnalyzing(true);
    setResult(null);
    try {
      const analysis = await analyzeError({ errorMessage, errorType, technology, fileName });
      setResult(analysis);
    } catch {
      showToast({ variant: 'error', title: 'Analysis failed', description: 'Please try again in a moment.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setErrorMessage('');
    setFileName(undefined);
    setResult(null);
  };

  return (
    <div>
      <PageHeader title="AI Debugger" subtitle="Paste an error or upload a log to get an instant root-cause analysis." />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Left panel */}
        <div className="card space-y-5 p-5">
          <div>
            <label htmlFor="error-input" className="mb-2 block text-sm font-medium text-text-primary">
              Paste your error message here
            </label>
            <textarea
              id="error-input"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
              rows={8}
              placeholder="fatal: Authentication failed for 'https://github.com/org/repo.git/'"
              className="input-field resize-none font-mono text-[13px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="error-type" className="mb-1.5 block text-xs font-medium text-text-secondary">
                Error type
              </label>
              <select
                id="error-type"
                value={errorType}
                onChange={(e) => setErrorType(e.target.value as ErrorTypeOption)}
                className="input-field"
              >
                {errorTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="technology" className="mb-1.5 block text-xs font-medium text-text-secondary">
                Technology
              </label>
              <select
                id="technology"
                value={technology}
                onChange={(e) => setTechnology(e.target.value as Technology)}
                className="input-field"
              >
                {technologyOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-text-secondary">Upload instead</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {uploadTypes.map((type) => (
                <button
                  key={type.label}
                  type="button"
                  onClick={() => setUploadType(type)}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    uploadType.label === type.label
                      ? 'border-primary/40 bg-primary-muted text-primary'
                      : 'border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <type.icon size={13} />
                  {type.label}
                </button>
              ))}
            </div>
            <UploadDropzone
              accept={uploadType.accept}
              hint={`Accepted: ${uploadType.label}`}
              selectedFileName={fileName}
              onFileSelect={(file) => {
                setFileName(file.name);
                const reader = new FileReader();
                reader.onload = () => setErrorMessage(String(reader.result ?? ''));
                reader.readAsText(file);
              }}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-text-secondary">Or try an example</p>
            <div className="flex flex-wrap gap-2">
              {exampleErrors.map((example) => (
                <button
                  key={example.id}
                  type="button"
                  onClick={() => {
                    setErrorMessage(example.errorMessage);
                    setTechnology(example.technology);
                    setFileName(undefined);
                  }}
                  className="btn-secondary !px-3 !py-1.5 text-xs"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={handleAnalyze} disabled={isAnalyzing} className="btn-primary flex-1">
              <Wand2 size={16} />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Error'}
            </button>
            <button type="button" onClick={handleClear} className="btn-secondary">
              <Eraser size={16} />
              Clear
            </button>
          </div>
        </div>

        {/* Right panel */}
        <div>
          {isAnalyzing && (
            <div className="card">
              <LoadingState label="Analyzing your error against the knowledge base..." />
            </div>
          )}

          {!isAnalyzing && !result && (
            <div className="card">
              <EmptyState
                icon={Bug}
                title="No analysis yet"
                description="Paste an error message on the left and click Analyze Error to see the AI's root cause analysis, solution, and confidence score."
              />
            </div>
          )}

          {!isAnalyzing && result && (
            <div className="space-y-4">
              <AIResponseCard result={result} />
              <div className="card p-5">
                <AnalysisTabs result={result} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
