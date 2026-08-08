import { Terminal, Sparkles, CheckCircle2, Copy } from 'lucide-react';
import { ProgressScore } from '@/components/common/ProgressScore';

export function TerminalPreview() {
  return (
    <div className="glass-panel mx-auto w-full max-w-xl rounded-2xl shadow-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        </div>
        <div className="ml-2 flex items-center gap-1.5 text-xs text-text-muted">
          <Terminal size={12} />
          devopsgpt — troubleshooting session
        </div>
      </div>
      <div className="space-y-4 p-5 font-mono text-[12.5px] leading-relaxed">
        <div>
          <p className="text-danger">$ kubectl apply -f deployment.yaml</p>
          <p className="text-text-muted">Error: ImagePullBackOff — pull access denied for registry.internal/app:latest</p>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary-muted p-3">
          <div className="mb-2 flex items-center gap-1.5 text-primary">
            <Sparkles size={13} />
            <span className="font-sans text-xs font-semibold">AI Reasoning</span>
          </div>
          <ul className="space-y-1 font-sans text-text-secondary">
            <li>1. Parsed Kubernetes event stream for failure signature</li>
            <li>2. Checked imagePullSecrets against registry auth config</li>
            <li>3. Matched 94% against known credential-expiry incidents</li>
          </ul>
        </div>

        <div>
          <p className="font-sans text-xs font-semibold uppercase tracking-wide text-text-muted">Root cause</p>
          <p className="mt-1 font-sans text-text-secondary">
            The service account's registry credentials expired, so the cluster can no longer authenticate pulls from the private registry.
          </p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="font-sans text-xs font-semibold uppercase tracking-wide text-text-muted">Suggested fix</p>
            <Copy size={12} className="text-text-muted" />
          </div>
          <div className="rounded-lg bg-[#0b0f1a] p-3 text-text-primary">
            <p>kubectl create secret docker-registry regcred \</p>
            <p className="pl-4">--docker-server=registry.internal \</p>
            <p className="pl-4">--docker-username=&lt;user&gt; --docker-password=&lt;token&gt;</p>
            <p>kubectl rollout restart deployment/app</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-success">
            <CheckCircle2 size={13} />
            <span className="font-sans text-xs">Fix verified against 3 similar incidents</span>
          </div>
          <ProgressScore score={96} size="sm" />
        </div>
      </div>
    </div>
  );
}
