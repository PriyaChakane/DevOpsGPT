import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  hint?: string;
  selectedFileName?: string;
}

export function UploadDropzone({ onFileSelect, accept, hint, selectedFileName }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      aria-label="Upload file"
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
        isDragging ? 'border-primary bg-primary-muted' : 'border-border hover:border-primary/50 hover:bg-bg-hover'
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
      {selectedFileName ? (
        <>
          <FileText size={22} className="text-primary" />
          <p className="text-sm font-medium text-text-primary">{selectedFileName}</p>
          <p className="text-xs text-text-muted">Click or drop to replace</p>
        </>
      ) : (
        <>
          <UploadCloud size={22} className="text-text-muted" />
          <p className="text-sm font-medium text-text-primary">Drag and drop, or click to browse</p>
          {hint && <p className="text-xs text-text-muted">{hint}</p>}
        </>
      )}
    </div>
  );
}
