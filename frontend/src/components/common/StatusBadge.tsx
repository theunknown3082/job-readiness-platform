import React from 'react';
import { ProblemStatus } from '../../types';
import { CheckCircle2, Clock, CircleDot } from 'lucide-react';

interface StatusBadgeProps {
  status?: ProblemStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status = 'Todo', className = '' }) => {
  if (status === 'Completed') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 ${className}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        Completed
      </span>
    );
  }

  if (status === 'In Progress') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800/60 ${className}`}
      >
        <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
        In Progress
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700/60 ${className}`}
    >
      <CircleDot className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
      Todo
    </span>
  );
};
