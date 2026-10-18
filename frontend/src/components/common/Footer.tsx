import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Activity, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  const { metrics, isDemo } = useAuth();

  return (
    <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/60 dark:bg-zinc-950/60 text-zinc-500 dark:text-zinc-400 py-6 text-xs transition-colors">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* System metadata */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Engine: FastAPI + PostgreSQL
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              Stateless JWT Auth
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-zinc-400" />
              Ebbinghaus Decay ($\lambda=0.015$)
            </span>
          </div>

          {/* Distributed Tracing & Observability pill */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
              <Terminal className="w-3 h-3 text-zinc-400" />
              <span>X-Request-ID:</span>
              <span className="text-zinc-900 dark:text-zinc-200 truncate max-w-[140px]">
                {metrics.requestId || (isDemo ? 'req_demo_trace_local' : 'idle_ready')}
              </span>
              {metrics.latencyMs !== null && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 border-l border-zinc-200 dark:border-zinc-800 pl-2">
                  <Activity className="w-3 h-3" />
                  {metrics.latencyMs}ms
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
          <p>
            Job Readiness & Skill Tracking Platform • Designed & Built with Clean Architecture Principles
          </p>
          <div className="flex items-center gap-4 mt-2 sm:mt-0 font-mono">
            <span>OAuth2 Form Auth</span>
            <span>•</span>
            <span>SQLAlchemy ORM</span>
            <span>•</span>
            <span>Alembic Migrations</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
