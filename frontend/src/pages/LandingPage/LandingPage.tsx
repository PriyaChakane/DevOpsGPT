import { Link } from 'react-router-dom';
import {
  Sparkles,
  BrainCircuit,
  Database,
  GitFork,
  Container,
  Workflow,
  ArrowRight,
  User,
  Users,
  Network,
  Quote,
} from 'lucide-react';
import { TerminalPreview } from '@/components/landing/TerminalPreview';

const features = [
  {
    icon: BrainCircuit,
    title: 'AI Error Analysis',
    description: 'Paste any Git, Docker, Kubernetes, or CI/CD error and get an instant root-cause explanation with a confidence score.',
  },
  {
    icon: Database,
    title: 'RAG Knowledge Retrieval',
    description: 'Every answer is grounded in your internal runbooks and official documentation, retrieved from a live vector index.',
  },
  {
    icon: GitFork,
    title: 'GitHub Repository Scanner',
    description: 'Scan a repository for security vulnerabilities, code quality issues, and documentation gaps in seconds.',
  },
  {
    icon: Container,
    title: 'Docker & Kubernetes Debugging',
    description: 'Diagnose crash loops, image pull failures, and resource limits with concrete kubectl and docker commands.',
  },
  {
    icon: Workflow,
    title: 'CI/CD Pipeline Analysis',
    description: 'Upload build logs from GitHub Actions, GitLab CI, or Jenkins to pinpoint the exact failing step and fix.',
  },
];

const testimonials = [
  {
    quote:
      'Our on-call rotation went from dreading Kubernetes pages to resolving them in minutes. The root-cause explanations are shockingly accurate.',
    name: 'Priya Raman',
    role: 'Staff SRE, Fintech scale-up',
  },
  {
    quote:
      "DevOpsGPT cut our average CI debugging time by more than half. It's like having a senior platform engineer available at 3am.",
    name: 'Marcus Bello',
    role: 'Engineering Manager, Platform Team',
  },
  {
    quote:
      'The repository scanner caught a critical dependency vulnerability our security review missed. Paid for itself in the first week.',
    name: 'Elena Kovacs',
    role: 'Head of DevOps, Enterprise SaaS',
  },
];

const architectureSteps = [
  { icon: User, label: 'User' },
  { icon: BrainCircuit, label: 'AI Engine' },
  { icon: Network, label: 'RAG' },
  { icon: Database, label: 'Vector Database' },
  { icon: Sparkles, label: 'Solution' },
];

export default function LandingPage() {
  return (
    <div>
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
              <Sparkles size={16} />
            </div>
            <span className="text-sm font-semibold tracking-tight text-text-primary">DevOpsGPT</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">
              Log in
            </Link>
            <Link to="/signup" className="btn-primary text-sm">
              Start Debugging
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-muted px-3 py-1 text-xs font-medium text-primary">
              <Sparkles size={12} />
              Powered by LLM + RAG
            </div>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl">
              AI-Powered DevOps Troubleshooting Assistant
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
              Debug Git, Docker, Kubernetes and CI/CD issues instantly with AI-powered root cause analysis and intelligent fixes.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/signup" className="btn-primary px-5 py-3 text-sm">
                Start Debugging
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-secondary px-5 py-3 text-sm">
                View Demo
              </Link>
            </div>
          </div>
          <TerminalPreview />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-bg-surface/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Everything you need to resolve incidents faster
            </h2>
            <p className="mt-3 text-text-secondary">
              One assistant across your entire DevOps toolchain — no more context switching between five different dashboards.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="card p-5">
                <div className="mb-3 inline-flex rounded-lg bg-primary-muted p-2.5 text-primary">
                  <feature.icon size={18} />
                </div>
                <h3 className="text-sm font-semibold text-text-primary">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">How it works</h2>
            <p className="mt-3 text-text-secondary">
              Your question flows through a retrieval-augmented pipeline grounded in real documentation.
            </p>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            {architectureSteps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div className="card flex flex-col items-center gap-2 px-6 py-5">
                  <div className="rounded-lg bg-primary-muted p-2.5 text-primary">
                    <step.icon size={18} />
                  </div>
                  <span className="text-xs font-medium text-text-primary">{step.label}</span>
                </div>
                {i < architectureSteps.length - 1 && (
                  <ArrowRight size={18} className="hidden text-text-muted sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-bg-surface/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Trusted by platform teams
            </h2>
          </div>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="card flex flex-col gap-4 p-5">
                <Quote size={20} className="text-primary/50" />
                <p className="flex-1 text-sm leading-relaxed text-text-secondary">{t.quote}</p>
                <div className="flex items-center gap-2.5 border-t border-border pt-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-elevated text-xs font-semibold text-text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{t.name}</p>
                    <p className="text-xs text-text-secondary">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Users size={28} className="mx-auto text-primary" />
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
            Ready to stop debugging alone?
          </h2>
          <p className="mt-3 text-text-secondary">
            Join engineering teams who resolve incidents in minutes, not hours.
          </p>
          <Link to="/signup" className="btn-primary mx-auto mt-6 w-fit px-5 py-3 text-sm">
            Start Debugging
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
              <Sparkles size={14} />
            </div>
            <span className="text-sm font-medium text-text-primary">DevOpsGPT</span>
          </div>
          <div className="flex gap-6 text-sm text-text-secondary">
            <a href="https://github.com" className="hover:text-text-primary">GitHub</a>
            <a href="#" className="hover:text-text-primary">Documentation</a>
            <a href="#" className="hover:text-text-primary">Contact</a>
          </div>
          <p className="text-xs text-text-muted">© 2026 DevOpsGPT. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
