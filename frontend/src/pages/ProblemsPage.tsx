import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { problemsService, progressService } from '../services/api';
import { DifficultyLevel, Problem, ProblemStatus } from '../types';
import { DifficultyBadge } from '../components/common/DifficultyBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import {
  Search,
  Plus,
  ExternalLink,
  Clock,
  Filter,
  CheckCircle,
  AlertCircle,
  Shield,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  'All Categories',
  'Arrays & Hashing',
  'Two Pointers & Sliding Window',
  'Trees & Graphs',
  'Dynamic Programming',
  'System Design & DB',
];

export const ProblemsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin, isDemo } = useAuth();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [userProgressMap, setUserProgressMap] = useState<Record<number, { status: ProblemStatus; time: number }>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All Categories');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All Difficulties');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  // Modal states: Progress Log modal & Admin Add Problem modal
  const [selectedProblemForLog, setSelectedProblemForLog] = useState<Problem | null>(null);
  const [logStatus, setLogStatus] = useState<ProblemStatus>('Completed');
  const [logTimeSpent, setLogTimeSpent] = useState<number>(30);
  const [isLogging, setIsLogging] = useState(false);

  // Admin Add Problem state
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Arrays & Hashing');
  const [newDifficulty, setNewDifficulty] = useState<DifficultyLevel>('Medium');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [isCreatingProblem, setIsCreatingProblem] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Load problem catalog
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await problemsService.list(
        selectedCategory === 'All Categories' ? undefined : selectedCategory
      );
      setProblems(data);

      if (isDemo) {
        const demoMap = progressService.getDemoProgress();
        const mapped: Record<number, { status: ProblemStatus; time: number }> = {};
        Object.values(demoMap).forEach((p: any) => {
          mapped[p.problem_id] = { status: p.status, time: p.time_spent_minutes };
        });
        setUserProgressMap(mapped);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, isDemo]);

  // Handle category change & sync with query param
  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    if (cat === 'All Categories') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  // Log progress action
  const handleLogProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblemForLog) return;
    setIsLogging(true);

    try {
      const res = await progressService.log({
        problem_id: selectedProblemForLog.id,
        status: logStatus,
        time_spent_minutes: Number(logTimeSpent) || 0,
      });

      setUserProgressMap((prev) => ({
        ...prev,
        [selectedProblemForLog.id]: {
          status: res.status,
          time_spent_minutes: res.time_spent_minutes,
        } as any,
      }));

      setSelectedProblemForLog(null);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || 'Failed to update progress.');
    } finally {
      setIsLogging(false);
    }
  };

  // Admin add new problem action
  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingProblem(true);
    setAdminError(null);

    try {
      const created = await problemsService.create({
        title: newTitle,
        category: newCategory,
        difficulty: newDifficulty,
        source_url: newSourceUrl || undefined,
      });

      setProblems((prev) => [created, ...prev]);
      setIsAdminModalOpen(false);
      setNewTitle('');
      setNewSourceUrl('');
    } catch (err: any) {
      console.error(err);
      setAdminError(err.response?.data?.detail || 'Only users with admin role can create problems.');
    } finally {
      setIsCreatingProblem(false);
    }
  };

  // Filtered problems list
  const filteredProblems = problems.filter((prob) => {
    const matchesSearch =
      prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'All Difficulties' || prob.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  const totalPages = Math.ceil(filteredProblems.length / pageSize) || 1;
  const paginatedProblems = filteredProblems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Problem Catalog & Tracker
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Curated engineering interview topics. Track progress and log revision time.
          </p>
        </div>

        {/* Admin Action Button */}
        {isAdmin && (
          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Problem</span>
            <Shield className="w-3.5 h-3.5 ml-1 opacity-70" />
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-zinc-900 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-subtle">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems by title or category..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full appearance-none pl-3 pr-8 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Difficulty Dropdown */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full sm:w-auto pl-3 pr-8 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all"
          >
            <option value="All Difficulties">All Difficulties</option>
            <option value="Easy">Easy (1.0x)</option>
            <option value="Medium">Medium (2.5x)</option>
            <option value="Hard">Hard (5.0x)</option>
          </select>
        </div>
      </div>

      {/* Problems Data Container */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-apple dark:shadow-apple-dark overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-zinc-400 text-sm">
            <div className="inline-block w-6 h-6 border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100 rounded-full animate-spin mb-2" />
            <p>Loading problems catalog...</p>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="py-12 text-center text-zinc-400 text-sm">
            No problems found matching the selected filters.
          </div>
        ) : (
          <>
            {/* Mobile Cards View (Phones & Small screens) */}
            <div className="block md:hidden divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
              {paginatedProblems.map((prob) => {
                const userProg = userProgressMap[prob.id];
                const status = userProg?.status || 'Todo';
                const timeSpent = userProg?.time || 0;

                return (
                  <div key={prob.id} className="p-4 space-y-3 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                          <span>{prob.title}</span>
                          {prob.source_url && (
                            <a
                              href={prob.source_url}
                              target="_blank"
                              rel="noreferrer"
                              title="Open original problem"
                              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                          {prob.category}
                        </p>
                      </div>
                      <DifficultyBadge difficulty={prob.difficulty} />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={status} />
                        {timeSpent > 0 && (
                          <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeSpent}m
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProblemForLog(prob);
                          setLogStatus(status === 'Todo' ? 'Completed' : status);
                          setLogTimeSpent(30);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all shadow-subtle"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Update</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop & Tablet Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                  <tr>
                    <th className="py-3.5 px-6">Problem</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Difficulty</th>
                    <th className="py-3.5 px-6">Your Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/70 dark:divide-zinc-800/70">
                  {paginatedProblems.map((prob) => {
                    const userProg = userProgressMap[prob.id];
                    const status = userProg?.status || 'Todo';
                    const timeSpent = userProg?.time || 0;

                    return (
                      <tr
                        key={prob.id}
                        className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition-colors group"
                      >
                        {/* Problem Title & Source */}
                        <td className="py-4 px-6 font-medium text-zinc-900 dark:text-zinc-100">
                          <div className="flex items-center gap-2">
                            <span>{prob.title}</span>
                            {prob.source_url && (
                              <a
                                href={prob.source_url}
                                target="_blank"
                                rel="noreferrer"
                                title="Open original problem"
                                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400 text-xs">
                          {prob.category}
                        </td>

                        {/* Difficulty Badge */}
                        <td className="py-4 px-6">
                          <DifficultyBadge difficulty={prob.difficulty} />
                        </td>

                        {/* User Progress Status */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <StatusBadge status={status} />
                            {timeSpent > 0 && (
                              <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {timeSpent}m
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Action Button */}
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => {
                              setSelectedProblemForLog(prob);
                              setLogStatus(status === 'Todo' ? 'Completed' : status);
                              setLogTimeSpent(30);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-zinc-900 transition-all shadow-subtle"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Update</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Table Footer Count & Pagination */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            Showing {filteredProblems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, filteredProblems.length)} of {filteredProblems.length} catalog items
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-subtle"
            >
              Previous
            </button>
            <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 disabled:opacity-40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-subtle"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Progress Update Modal */}
      <Modal
        isOpen={!!selectedProblemForLog}
        onClose={() => setSelectedProblemForLog(null)}
        title="Log Problem Progress"
        description={`Record completion status and practice time for "${selectedProblemForLog?.title}".`}
      >
        {selectedProblemForLog && (
          <form onSubmit={handleLogProgress} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Todo', 'In Progress', 'Completed'] as ProblemStatus[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setLogStatus(st)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                      logStatus === st
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Time Spent (Minutes)
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="0"
                  max="600"
                  required
                  value={logTimeSpent}
                  onChange={(e) => setLogTimeSpent(parseInt(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>

              {/* Quick increment pills */}
              <div className="flex items-center gap-2 mt-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setLogTimeSpent(mins)}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    +{mins}m
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedProblemForLog(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLogging}
                className="px-5 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
              >
                {isLogging ? 'Saving...' : 'Save Progress'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Admin Add Problem Modal */}
      <Modal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        title="Add New Catalog Problem (Admin)"
        description="Creates a new catalog problem via POST /api/v1/problems/."
      >
        <form onSubmit={handleCreateProblem} className="space-y-4 pt-2">
          {adminError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{adminError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Problem Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Subarray Sum Equals K"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Category
            </label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            >
              {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setNewDifficulty(d)}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                    newDifficulty === d
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Source URL (Optional)
            </label>
            <input
              type="url"
              value={newSourceUrl}
              onChange={(e) => setNewSourceUrl(e.target.value)}
              placeholder="https://leetcode.com/problems/..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdminModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingProblem}
              className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50"
            >
              {isCreatingProblem ? 'Creating...' : 'Create Problem'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
