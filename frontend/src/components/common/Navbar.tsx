import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sun,
  Moon,
  Shield,
  User,
  LogOut,
  Sparkles,
  BarChart3,
  ListTodo,
  Network,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, isDemo, toggleDemoMode, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sliding pill indicator state & refs
  const navRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const updatePill = () => {
    let activeIdx = 0;
    if (location.pathname.startsWith('/problems')) activeIdx = 1;
    else if (location.pathname.startsWith('/architecture')) activeIdx = 2;

    const el = tabRefs.current[activeIdx];
    if (el && navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      setPillStyle({
        left: elRect.left - navRect.left,
        width: elRect.width,
        opacity: 1,
      });
    }
  };

  useEffect(() => {
    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [location.pathname]);

  const getIsActive = (idx: number) => {
    if (idx === 0) return location.pathname === '/' || location.pathname === '/dashboard';
    if (idx === 1) return location.pathname.startsWith('/problems');
    if (idx === 2) return location.pathname.startsWith('/architecture');
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-[1536px] mx-auto px-3 sm:px-8 lg:px-12 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-6 shrink-0">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-bold text-sm tracking-wider shadow-sm group-hover:scale-105 transition-transform shrink-0">
              JR
            </div>
            <div className="hidden md:block">
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight text-sm">
                JobReadiness
              </span>
              <span className="text-zinc-400 dark:text-zinc-500 text-xs ml-1 font-mono">
                Platform
              </span>
            </div>
          </NavLink>

          {/* Interactive Sliding Pill Navigation */}
          <div className="py-1">
            <nav
              ref={navRef}
              className="relative flex items-center p-1 rounded-full bg-zinc-100 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800/80"
            >
              {/* Animated Sliding Pill Highlight */}
              <div
                className="absolute top-1 bottom-1 bg-zinc-900 dark:bg-zinc-100 rounded-full shadow-sm transition-all duration-300 ease-out pointer-events-none"
                style={{
                  transform: `translateX(${pillStyle.left}px)`,
                  width: `${pillStyle.width}px`,
                  opacity: pillStyle.opacity,
                }}
              />

              <NavLink
                to="/"
                end
                ref={(el) => { tabRefs.current[0] = el; }}
                className={`relative z-10 inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  getIsActive(0)
                    ? 'text-white dark:text-zinc-900 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">Readiness</span>
                <span className="sm:hidden text-[11px]">Stats</span>
              </NavLink>

              <NavLink
                to="/problems"
                ref={(el) => { tabRefs.current[1] = el; }}
                className={`relative z-10 inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  getIsActive(1)
                    ? 'text-white dark:text-zinc-900 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <ListTodo className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">Catalog</span>
                <span className="sm:hidden text-[11px]">NC150</span>
              </NavLink>

              <NavLink
                to="/architecture"
                ref={(el) => { tabRefs.current[2] = el; }}
                className={`relative z-10 inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  getIsActive(2)
                    ? 'text-white dark:text-zinc-900 font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                }`}
              >
                <Network className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">System LLD</span>
                <span className="sm:hidden text-[11px]">LLD</span>
                <span
                  className={`hidden sm:inline px-1.5 py-0.2 text-[10px] font-semibold uppercase tracking-wider rounded ${
                    getIsActive(2)
                      ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900'
                      : 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                  }`}
                >
                  Spec
                </span>
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Demo Mode Toggle */}
          <button
            onClick={toggleDemoMode}
            title={isDemo ? 'Disable Demo Mode' : 'Enable Demo Mode'}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              isDemo
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                : 'bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDemo ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
              }`}
            />
            <Sparkles className="w-3 h-3" />
            <span className="hidden md:inline">Demo Mode</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 sm:p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          </button>

          {/* User & Auth Pill */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1 sm:gap-2 pl-0.5 sm:pl-1">
              <div className="hidden xl:flex flex-col text-right">
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                  {user?.email}
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500 capitalize">
                  {user?.role}
                </span>
              </div>

              {isAdmin ? (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  <Shield className="w-3 h-3" />
                  Admin
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  <User className="w-3 h-3" />
                  Candidate
                </span>
              )}

              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 sm:p-2 rounded-full text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-opacity shadow-sm whitespace-nowrap"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
