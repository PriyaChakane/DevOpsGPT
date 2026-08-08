import { cn } from '@/lib/utils';

interface ProgressScoreProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

function getColor(score: number) {
  if (score >= 85) return { ring: '#22c55e', text: 'text-success' };
  if (score >= 60) return { ring: '#f59e0b', text: 'text-warning' };
  return { ring: '#ef4444', text: 'text-danger' };
}

const sizeMap = { sm: 56, md: 80, lg: 112 };

export function ProgressScore({ score, label, size = 'md', showValue = true }: ProgressScoreProps) {
  const dimension = sizeMap[size];
  const strokeWidth = size === 'sm' ? 5 : size === 'md' ? 6 : 8;
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(score, 100) / 100) * circumference;
  const color = getColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg width={dimension} height={dimension} className="-rotate-90">
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke="#1a2135"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="none"
            stroke={color.ring}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        {showValue && (
          <div className={cn('absolute inset-0 flex items-center justify-center font-semibold', color.text, size === 'lg' ? 'text-xl' : 'text-sm')}>
            {score}
            {size !== 'sm' && <span className="ml-0.5 text-xs text-text-muted">%</span>}
          </div>
        )}
      </div>
      {label && <span className="text-xs text-text-secondary">{label}</span>}
    </div>
  );
}
