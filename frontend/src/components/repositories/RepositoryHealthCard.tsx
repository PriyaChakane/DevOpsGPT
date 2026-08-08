import { ProgressScore } from '@/components/common/ProgressScore';

interface RepositoryHealthCardProps {
  label: string;
  score: number;
}

export function RepositoryHealthCard({ label, score }: RepositoryHealthCardProps) {
  return (
    <div className="card flex flex-col items-center gap-3 p-5">
      <ProgressScore score={score} size="lg" />
      <p className="text-sm font-medium text-text-primary">{label}</p>
    </div>
  );
}
