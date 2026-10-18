import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Lock, Mail, User, Shield, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('candidate');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSlowLoading, setIsSlowLoading] = useState(false);

  useEffect(() => {
    let timer: any;
    if (loading) {
      timer = setTimeout(() => setIsSlowLoading(true), 3500);
    } else {
      setIsSlowLoading(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const { login, register, toggleDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, fullName, role);
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      const detail =
        err.response?.data?.detail ||
        err.message ||
        'Authentication failed. Please verify your credentials or server connection.';
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setIsLogin(true);
    setError(null);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 items-center justify-center text-white dark:text-zinc-900 font-bold text-lg shadow-sm mb-4">
            JR
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {isLogin
              ? 'Sign in to access your interview readiness dashboard'
              : 'Start tracking preparation with retention decay metrics'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-apple dark:shadow-apple-dark transition-all">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-zinc-100 dark:bg-zinc-800/60 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                isLogin
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                !isLogin
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex River"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@prep.dev"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('candidate')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      role === 'candidate'
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                      role === 'admin'
                        ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100'
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white dark:border-zinc-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            {isSlowLoading && (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 text-center animate-pulse mt-2">
                ⏳ Connecting to cloud microservice (free-tier servers wake up in ~20-30s on cold start)...
              </p>
            )}
          </form>

          {/* Quick Credential Helpers */}
          <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2 text-center">
              Quick Fill Seeded Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillQuickCredentials('candidate@prep.dev', 'CandidatePass123!')}
                className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-left text-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                <div className="font-medium text-zinc-800 dark:text-zinc-200">Candidate</div>
                <div className="text-[10px] text-zinc-400 truncate">candidate@prep.dev</div>
              </button>
              <button
                type="button"
                onClick={() => fillQuickCredentials('admin@platform.dev', 'AdminPassSecure123!')}
                className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-left text-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
              >
                <div className="font-medium text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  Admin
                </div>
                <div className="text-[10px] text-zinc-400 truncate">admin@platform.dev</div>
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  toggleDemoMode();
                  navigate('/');
                }}
                className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Or explore without signing in (Demo Mode)
              </button>
            </div>
          </div>
        </div>

        {/* OAuth2 Form note */}
        <p className="text-center text-[11px] text-zinc-400 dark:text-zinc-500 mt-4 font-mono">
          OAuth2PasswordRequestForm • application/x-www-form-urlencoded
        </p>
      </div>
    </div>
  );
};
