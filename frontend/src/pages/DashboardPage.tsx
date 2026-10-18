import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { readinessService } from '../services/api';
import { ReadinessReport } from '../types';
import {
  Trophy,
  Brain,
  CheckSquare2,
  Target,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { isAuthenticated, isDemo } = useAuth();
  const [report, setReport] = useState<ReadinessReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopySummary = () => {
    if (!report) return;
    const summary = `🎯 SDE-1 Interview Readiness Summary
Overall Score: ${report.overall_score}%
Retention Score (Decay-Adjusted): ${report.retention_score}%
Problems Mastered: ${report.total_solved}/${report.total_problems}
Backend SDE-1 Benchmark Match: ${report.target_role_match_pct}%
Model: Ebbinghaus exponential decay (lambda=0.015, non-linear weights 1x/2.5x/5x)
Evaluated at: https://job-readiness-platform.pages.dev`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const fetchReadiness = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await readinessService.getReport();
      setReport(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.status === 401
          ? 'Session expired or unauthenticated. Please log in or enable Demo Mode.'
          : 'Unable to reach backend service. You can toggle Demo Mode in the top bar to inspect simulated data.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadiness();
  }, [isAuthenticated, isDemo]);

  const chartData = report?.category_breakdown.map((cat) => ({
    name: cat.category.length > 14 ? cat.category.slice(0, 12) + '...' : cat.category,
    fullName: cat.category,
    completion: cat.completion_rate,
    retention: cat.effective_score,
  })) || [];

  return (
    <div className="max-w-[1536px] mx-auto px-3 sm:px-8 lg:px-12 py-6 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Candidate Readiness
            </h1>
            {isDemo && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                Live Demo
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Quantified technical preparation metrics incorporating Ebbinghaus memory retention decay.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={handleCopySummary}
            disabled={!report || loading}
            title="Copy SDE-1 readiness stats to clipboard"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all shadow-subtle disabled:opacity-50 whitespace-nowrap"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{copied ? 'Copied!' : 'Export Summary'}</span>
          </button>
          <button
            onClick={fetchReadiness}
            disabled={loading}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all shadow-subtle disabled:opacity-50 whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Recalculate</span>
          </button>
          <NavLink
            to="/problems"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
          >
            <span>Log Practice</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>
      </div>

      {/* Error / Offline Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-800 dark:text-amber-300 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>{error}</span>
          </div>
          {!isDemo && (
            <NavLink
              to="/auth"
              className="px-3 py-1 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Sign In
            </NavLink>
          )}
        </div>
      )}

      {/* Empty State Banner if 0 solved */}
      {report && report.total_solved === 0 && !loading && (
        <div className="p-5 rounded-2xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Welcome to your Readiness Dashboard
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              You haven't logged any solved problems yet. Head to the NeetCode 150 Catalog to record your first solution and start computing your spaced-repetition retention score!
            </p>
          </div>
          <NavLink
            to="/problems"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shrink-0 transition-colors"
          >
            Explore Catalog →
          </NavLink>
        </div>
      )}

      {/* 4 Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple dark:shadow-apple-dark transition-all">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Overall Score</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {loading ? '--' : `${report?.overall_score ?? 0}%`}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            Difficulty-weighted mastery (1x/2.5x/5x)
          </p>
        </div>

        {/* Retention Score (With Decay) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple dark:shadow-apple-dark transition-all">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Retention Score</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
              {loading ? '--' : `${report?.retention_score ?? 0}%`}
            </span>
            <span className="text-xs text-zinc-400 font-medium">after decay</span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2 flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-500" />
            Decays via $R(t) = e^{'{-\\lambda t}'}$
          </p>
        </div>

        {/* Total Solved / Total Problems */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple dark:shadow-apple-dark transition-all">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Problems Solved</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <CheckSquare2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {loading ? '--' : report?.total_solved ?? 0}
            </span>
            <span className="text-sm text-zinc-400">
              / {loading ? '--' : report?.total_problems ?? 0}
            </span>
          </div>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${
                  report && report.total_problems > 0
                    ? Math.min(100, (report.total_solved / report.total_problems) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        {/* Target Role Match */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple dark:shadow-apple-dark transition-all">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Role Benchmark</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {loading ? '--' : `${report?.target_role_match_pct ?? 0}%`}
            </span>
            <span className="text-xs text-zinc-400">Backend SDE</span>
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-2">
            Weighted against standard hiring distributions
          </p>
        </div>
      </div>

      {/* Main Section: Category Breakdown Cards + Interactive Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Progress Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Category Readiness & Retention Decay
            </h2>
            <span className="text-xs text-zinc-400">
              {report?.category_breakdown.length ?? 0} Domains Tracked
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report?.category_breakdown.map((cat) => {
              const decayDelta = Math.max(0, cat.completion_rate - cat.effective_score);
              return (
                <div
                  key={cat.category}
                  className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-subtle hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {cat.category}
                      </h3>
                      <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                        {cat.completed_problems}/{cat.total_problems}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      {/* Completion rate bar */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-zinc-500 dark:text-zinc-400">Solved Ratio</span>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {cat.completion_rate}%
                          </span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-zinc-900 dark:bg-zinc-100 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, cat.completion_rate)}%` }}
                          />
                        </div>
                      </div>

                      {/* Effective score after decay */}
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1">
                            <Brain className="w-3 h-3" />
                            Effective Retention
                          </span>
                          <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {cat.effective_score}%
                          </span>
                        </div>
                        <div className="w-full bg-purple-100/50 dark:bg-purple-950/40 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-600 dark:bg-purple-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, cat.effective_score)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                    <span>
                      {decayDelta > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400">
                          -{decayDelta.toFixed(1)}% decay loss
                        </span>
                      ) : (
                        'Full retention'
                      )}
                    </span>
                    <NavLink
                      to={`/problems?category=${encodeURIComponent(cat.category)}`}
                      className="text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-0.5"
                    >
                      Filter category <ArrowUpRight className="w-3 h-3" />
                    </NavLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Column (1 col) */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple dark:shadow-apple-dark flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                Retention vs Completion
              </h2>
              <NavLink to="/architecture" title="Inspect decay formula">
                <HelpCircle className="w-4 h-4 text-zinc-400 hover:text-zinc-600 transition-colors" />
              </NavLink>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#888' }}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(24, 24, 27, 0.95)',
                      borderColor: '#3f3f46',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '11px',
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
                  />
                  <Bar dataKey="completion" name="Solved %" fill="#71717a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="retention" name="Decayed %" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs text-zinc-600 dark:text-zinc-400">
            <p className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 mb-1">
              <Brain className="w-3.5 h-3.5 text-purple-500" />
              Ebbinghaus Spaced Repetition
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              When problems are not revised, effective retention decays to ~63% at 30 days and ~40% at 60 days. Logging reviews resets the decay curve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
