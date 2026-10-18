import React from 'react';
import { DifficultyLevel } from '../../types';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  className?: string;
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, className = '' }) => {
  const styles = {
    Easy: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
    Medium: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    Hard: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
  }[difficulty] || 'bg-zinc-500/10 text-zinc-600 border-zinc-500/20';

  const dotColor = {
    Easy: 'bg-emerald-500',
    Medium: 'bg-amber-500',
    Hard: 'bg-rose-500',
  }[difficulty] || 'bg-zinc-500';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      {difficulty}
    </span>
  );
};
