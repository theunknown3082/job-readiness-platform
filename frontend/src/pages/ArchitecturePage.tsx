import React, { useState } from 'react';
import {
  Cpu,
  Database,
  Shield,
  Layers,
  Terminal,
  Activity,
  Code2,
  FileCheck2,
  Sparkles,
  ArrowRight,
  Calculator,
  Binary,
  CheckCircle2,
  TableProperties,
} from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  // Interactive Ebbinghaus Decay Simulator State
  const [simulatorDays, setSimulatorDays] = useState<number>(14);

  // Retention calculation: R(t) = e^(-0.015 * t)
  const simulatedRetention = Math.round(Math.exp(-0.015 * simulatorDays) * 1000) / 10;

  return (
    <div className="max-w-[1536px] mx-auto px-3 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-8 sm:space-y-12 animate-in fade-in duration-300">
      {/* Hero / Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6 sm:pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          System Low-Level Design & Mathematical Spec
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          How the Platform Works: Architecture & Algorithms
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 max-w-3xl leading-relaxed">
          An in-depth technical walk-through of the backend service architecture, relational database schemas, memory retention decay models, and production design decisions.
        </p>
      </div>

      {/* SECTION 1: Core Architectural Pillars */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Core Architectural Pillars & Verification
          </h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Core engineering patterns and operational safeguards implemented across the platform.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Claim 1 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple dark:shadow-apple-dark space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-mono">1</span>
              Modular RESTful Service & Scoring
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <strong>Architected:</strong> Structured with clean separation of concerns across <code className="text-[11px]">routers/</code>, <code className="text-[11px]">schemas/</code>, and <code className="text-[11px]">services/</code>.
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-2 font-mono">
              Verified in: <span className="text-brand-600 dark:text-brand-400">app/services/readiness_service.py</span>
            </p>
          </div>

          {/* Claim 2 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple dark:shadow-apple-dark space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-mono">2</span>
              Normalized Schemas, Indexed FKs, & Pagination
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <strong>Designed:</strong> 3NF normalized tables (<code className="text-[11px]">users</code>, <code className="text-[11px]">problems</code>, <code className="text-[11px]">user_problem_progress</code>). Indexed foreign keys for O(log N) joins.
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-2 font-mono">
              Verified in: <span className="text-brand-600 dark:text-brand-400">app/models/models.py</span> (index=True, limit/offset)
            </p>
          </div>

          {/* Claim 3 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple dark:shadow-apple-dark space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-mono">3</span>
              Stateless JWT, Native Bcrypt, & RBAC
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <strong>Secured:</strong> OAuth2 password grant (<code className="text-[11px]">x-www-form-urlencoded</code>). Native Bcrypt hashing with 72-byte truncation protection. Role-based dependency gates.
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-2 font-mono">
              Verified in: <span className="text-brand-600 dark:text-brand-400">app/core/security.py</span> & <span className="text-brand-600 dark:text-brand-400">app/routers/auth.py</span>
            </p>
          </div>

          {/* Claim 4 */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple dark:shadow-apple-dark space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              <span className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-mono">4</span>
              Pydantic Schemas & Pytest Automated Suite
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <strong>Validated:</strong> Strict data contracts across all boundaries via Pydantic v2 <code className="text-[11px]">BaseModel</code>. Pytest suite testing status codes (200, 201, 401, 403, 404).
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 pt-2 font-mono">
              Verified in: <span className="text-brand-600 dark:text-brand-400">tests/test_endpoints.py</span> (100% passing)
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: Mathematical Models & Interactive Simulator */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Core Mathematical Models
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formula 1: Ebbinghaus Decay + Simulator */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple dark:shadow-apple-dark space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                1. Spaced Repetition Memory Decay
              </h3>
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 rounded">
                Continuous Decay
              </span>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-center text-zinc-800 dark:text-zinc-200">
              R(t) = e^{`{-0.015 \\cdot t}`}
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Where <code className="font-mono text-[11px]">t</code> is the number of days elapsed since the problem was last revised. As time increases without active practice, effective retained mastery decays continuously.
            </p>

            {/* Interactive Slider */}
            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Simulate Days Inactive:</span>
                <span className="font-mono font-bold text-purple-600 dark:text-purple-400">
                  {simulatorDays} {simulatorDays === 1 ? 'day' : 'days'}
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="90"
                value={simulatorDays}
                onChange={(e) => setSimulatorDays(Number(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />

              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
                <span className="text-zinc-600 dark:text-zinc-300 font-medium">
                  Estimated Retained Mastery:
                </span>
                <span className="text-lg font-bold font-mono text-purple-600 dark:text-purple-400">
                  {simulatedRetention}%
                </span>
              </div>
            </div>
          </div>

          {/* Formula 2: Difficulty Weighting & Role Match */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-apple dark:shadow-apple-dark space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              2. Non-Linear Difficulty & Role Match Alignment
            </h3>

            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
              <p>
                Problems carry exponential weights reflecting cognitive load:
              </p>
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  Easy: 1.0x
                </div>
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                  Medium: 2.5x
                </div>
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400">
                  Hard: 5.0x
                </div>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 font-mono text-[11px] text-zinc-700 dark:text-zinc-300 space-y-1">
                <div>Overall Score = (Earned Weighted Pts / Total Weighted Pts) * 100</div>
                <div>Retention Score = (Decayed Weighted Pts / Total Weighted Pts) * 100</div>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Target SDE-1 Benchmark Distribution:
                </span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-[11px] font-mono">
                  <span>• Trees & Graphs: 25%</span>
                  <span>• Arrays & Hashing: 20%</span>
                  <span>• Dynamic Programming: 20%</span>
                  <span>• System Design & DB: 20%</span>
                  <span>• Two Pointers & Window: 15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Relational Schema & Low-Level Design (LLD) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Relational Database Schema (3NF)
          </h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Normalized relational structure managed by SQLAlchemy ORM with indexed foreign keys for performant joins.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Table: users */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-subtle">
            <div className="bg-zinc-100 dark:bg-zinc-800/80 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">users</span>
              <span className="text-[10px] text-zinc-400">Entity</span>
            </div>
            <div className="p-4 space-y-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span className="text-amber-600 dark:text-amber-400 font-bold">id (PK)</span>
                <span>Integer</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span className="text-brand-600 dark:text-brand-400">email (IDX, UQ)</span>
                <span>String</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span>hashed_password</span>
                <span>String</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span>role</span>
                <span>Enum(candidate, admin)</span>
              </div>
              <div className="flex justify-between">
                <span>created_at</span>
                <span>DateTime (UTC)</span>
              </div>
            </div>
          </div>

          {/* Table: problems */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-subtle">
            <div className="bg-zinc-100 dark:bg-zinc-800/80 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">problems</span>
              <span className="text-[10px] text-zinc-400">Catalog</span>
            </div>
            <div className="p-4 space-y-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span className="text-amber-600 dark:text-amber-400 font-bold">id (PK)</span>
                <span>Integer</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span className="text-brand-600 dark:text-brand-400">title (IDX)</span>
                <span>String</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span className="text-brand-600 dark:text-brand-400">category (IDX)</span>
                <span>String</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span>difficulty</span>
                <span>Enum(Easy, Med, Hard)</span>
              </div>
              <div className="flex justify-between">
                <span>source_url</span>
                <span>String (Nullable)</span>
              </div>
            </div>
          </div>

          {/* Table: user_problem_progress */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-subtle">
            <div className="bg-zinc-100 dark:bg-zinc-800/80 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-zinc-900 dark:text-zinc-100">user_problem_progress</span>
              <span className="text-[10px] text-zinc-400">Junction</span>
            </div>
            <div className="p-4 space-y-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span className="text-amber-600 dark:text-amber-400 font-bold">id (PK)</span>
                <span>Integer</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span className="text-emerald-600 dark:text-emerald-400">user_id (FK, IDX)</span>
                <span>users.id (CASCADE)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span className="text-emerald-600 dark:text-emerald-400">problem_id (FK, IDX)</span>
                <span>problems.id (CASCADE)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span>status</span>
                <span>Enum(Todo, Prog, Done)</span>
              </div>
              <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-1">
                <span>time_spent_minutes</span>
                <span>Integer</span>
              </div>
              <div className="flex justify-between">
                <span>updated_at</span>
                <span>DateTime (UTC)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Request Pipeline & Distributed Tracing */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            FastAPI Pipeline & Observability Flow
          </h2>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900 text-zinc-100 font-mono text-xs overflow-x-auto shadow-apple dark:shadow-apple-dark">
          <div className="flex items-center gap-2 text-zinc-400 mb-4 pb-2 border-b border-zinc-800">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] ml-2">Request Lifecycle Flowchart</span>
          </div>

          <pre className="text-zinc-300 leading-relaxed">
{`Client HTTP Request
      |
      v
+-------------------------------------------------------------+
| 1. CORSMiddleware (allow_origins=["*"], expose: X-Request-ID) |
+-------------------------------------------------------------+
      |
      v
+-------------------------------------------------------------+
| 2. RequestContextMiddleware                                 |
|    - Injects unique X-Request-ID uuid4                      |
|    - Tracks execution duration (process_time ms)             |
|    - Emits response header: X-Request-ID                     |
+-------------------------------------------------------------+
      |
      v
+-------------------------------------------------------------+
| 3. Auth & RBAC Dependency Injection (FastAPI Depends)        |
|    - Decodes JWT Bearer token                               |
|    - Checks user exists & verifies role (Candidate / Admin) |
+-------------------------------------------------------------+
      |
      v
+-------------------------------------------------------------+
| 4. Readiness Service (SQLAlchemy Aggregation)               |
|    - SQL GROUP BY (category, difficulty) via DB func.count() |
|    - Computes Ebbinghaus decay: R(t) = e^(-0.015 * t)       |
|    - Matches against backend SDE role distribution          |
+-------------------------------------------------------------+
      |
      v
JSON Response with X-Request-ID Header`}
          </pre>
        </div>
      </section>

      {/* SECTION 5: Production Engineering Decisions & Architecture Trade-offs */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Key Architecture Decisions & Production Trade-offs
          </h2>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-subtle">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1">
              Why Native `bcrypt` Instead of `passlib`?
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              `passlib` has been unmaintained since 2020 and conflicts with modern `bcrypt &gt;= 4.1.0` due to internal regex inspection bugs and silent 72-byte truncation issues. We implemented direct hashing via the official `bcrypt` library (`gensalt()`, `hashpw()`, `checkpw()`), eliminating unmaintained abstractions while explicitly slicing inputs to 72 bytes.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-subtle">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1">
              Database Grouping vs. Python Runtime Loops
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Pulling all catalog items and submissions into Python memory requires transferring $O(N)$ rows over the network and scales poorly. By leveraging SQLAlchemy `func.count(Problem.id)` with SQL `GROUP BY`, category aggregation is performed inside the database engine in milliseconds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-subtle">
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider mb-1">
              Timezone Standardization & Drift Prevention
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              `datetime.utcnow()` was deprecated in Python 3.12 because it generates naive datetimes without tzinfo, leading to timezone drift when deployed across distributed servers. We standardized on timezone-aware UTC timestamps (`datetime.now(UTC)` / `timezone.utc`) to ensure accurate mathematical decay calculations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
