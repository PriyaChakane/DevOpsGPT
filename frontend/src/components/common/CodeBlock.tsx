import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { copyToClipboard, cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  fileName?: string;
}

export function CodeBlock({ code, language = 'bash', className, fileName }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div className={cn('overflow-hidden rounded-lg border border-border bg-[#0b0f1a]', className)}>
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-mono text-xs text-text-muted">{fileName ?? language}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="btn-ghost !px-2 !py-1 text-xs"
        >
          {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code className="font-mono text-text-primary">{code}</code>
      </pre>
    </div>
  );
}
