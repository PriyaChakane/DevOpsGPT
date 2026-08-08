import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
            <Sparkles size={18} />
          </div>
          <span className="text-base font-semibold tracking-tight text-text-primary">DevOpsGPT</span>
        </Link>
        <div className="card p-7">
          <div className="mb-6 text-center">
            <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
            <p className="mt-1.5 text-sm text-text-secondary">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
