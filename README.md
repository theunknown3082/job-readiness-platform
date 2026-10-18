<div align="center">

# 🎯 Job Readiness & Skill Tracking Platform

**A production-grade, mathematically calibrated platform that quantifies software engineering interview readiness through spaced-repetition memory decay, non-linear difficulty weighting, and role benchmark alignment.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.12%2B%20%7C%203.14-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1.svg?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-2.0+-D71F00.svg?style=flat&logo=sqlalchemy&logoColor=white)](https://www.sqlalchemy.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4.svg?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Pytest](https://img.shields.io/badge/Pytest-Passing%20(100%25)-0A9EDC.svg?style=flat&logo=pytest&logoColor=white)](https://docs.pytest.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020.svg?style=flat&logo=cloudflarepages&logoColor=white)](https://job-readiness-platform.pages.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat)](LICENSE)

<br/>

### 🌐 **Live 24/7 Production Deployment**: [https://job-readiness-platform.pages.dev](https://job-readiness-platform.pages.dev)

[![Cloudflare Status](https://img.shields.io/badge/Status-Live%2024%2F7-brightgreen.svg?style=flat&logo=cloudflare&logoColor=white)](https://job-readiness-platform.pages.dev)
[![Demo Mode](https://img.shields.io/badge/Instant%20Evaluation-Demo%20Mode%20Enabled-blueviolet.svg?style=flat)](https://job-readiness-platform.pages.dev)

> 💡 **Instant Testing**: You can evaluate the platform directly via the live Cloudflare deployment! On the login screen, click **"⚡ Explore in Demo Mode (Instant Access)"** for immediate client-side testing, or authenticate with pre-seeded accounts:
> * **Candidate**: `candidate@prep.dev` / `CandidatePass123!`
> * **Admin**: `admin@platform.dev` / `AdminPassSecure123!` *(Unlocks catalog management)*

[Explore Live Deployment](https://job-readiness-platform.pages.dev) • [Architecture Spec](#-system-architecture) • [Mathematical Models](#-core-mathematical-models) • [API Contracts](#-api-specification) • [Interview Justifications](#-engineering-trade-offs--interview-talking-points)

</div>

---

## 📌 Executive Summary & Motivation

Traditional coding trackers treat all solved problems as static, equal milestones. This creates two critical engineering blindspots:

1. **The Flat-Progress Fallacy**: Solving 50 Easy string manipulation problems yields an inflated sense of readiness, while complex Dynamic Programming or System Design implementations carry identical numerical weight.
2. **The Ebbinghaus Memory Trap**: Human memory follows an exponential forgetting curve. A problem solved 90 days ago without active revision does not reflect current interview readiness.

This platform bridges that gap by computing **real-time, decay-adjusted readiness metrics** backed by continuous exponential decay ($R(t) = e^{-\lambda t}$), non-linear difficulty multipliers ($1.0\times, 2.5\times, 5.0\times$), and SDE-1 backend distribution benchmarks.

---

## 🏛️ System Architecture

```mermaid
sequenceDiagram
    autonumber
    actor Client as Frontend (React + Vite)
    participant CORS as CORSMiddleware
    participant ReqCtx as RequestContextMiddleware
    participant Auth as OAuth2 / JWT Auth Gate
    participant Service as Readiness Service
    participant DB as Database (SQLAlchemy)

    Client->>CORS: HTTP Request + Bearer Token
    CORS->>ReqCtx: Pass request
    Note over ReqCtx: Generates unique X-Request-ID (UUID4)<br/>Starts high-resolution timer
    ReqCtx->>Auth: Pass request
    Auth->>Auth: Verify JWT signature & decode user_id/role
    Auth->>Service: Authenticated route execution
    Service->>DB: GROUP BY SQL aggregation (category, difficulty)
    DB-->>Service: Aggregated counts & weights
    Service->>Service: Calculate continuous Ebbinghaus decay R(t) = e^(-0.015*t)
    Service->>Service: Compare against SDE-1 benchmark profile
    Service->>ReqCtx: Return ReadinessReport payload
    Note over ReqCtx: Injects X-Request-ID & calculates latency (ms)
    ReqCtx-->>Client: 200 OK + JSON Body + X-Request-ID Header
```

---

## 🗄️ Relational Database Schema (3NF)

```mermaid
erDiagram
    USERS ||--o{ USER_PROBLEM_PROGRESS : logs
    PROBLEMS ||--o{ USER_PROBLEM_PROGRESS : tracks

    USERS {
        int id PK "Indexed"
        string email UK "Indexed, Unique"
        string hashed_password "Native Bcrypt"
        string full_name "Nullable"
        enum role "candidate | admin"
        datetime created_at "UTC Timezone"
    }

    PROBLEMS {
        int id PK "Indexed"
        string title "Indexed"
        string category "Indexed"
        enum difficulty "Easy (1x) | Medium (2.5x) | Hard (5x)"
        string source_url "Nullable"
    }

    USER_PROBLEM_PROGRESS {
        int id PK "Indexed"
        int user_id FK "Indexed, ON DELETE CASCADE"
        int problem_id FK "Indexed, ON DELETE CASCADE"
        enum status "Todo | In Progress | Completed"
        int time_spent_minutes "Default 0"
        datetime updated_at "UTC Timezone"
    }
```

---

## 📐 Core Mathematical Models

### 1. Non-Linear Cognitive Load Weighting
Problems carry exponential difficulty multipliers reflecting cognitive complexity:
* **Easy:** $1.0\times$
* **Medium:** $2.5\times$
* **Hard:** $5.0\times$

$$\text{Overall Score} = \left(\frac{\sum_{i \in \text{Completed}} \text{Weight}(\text{difficulty}_i)}{\sum_{j \in \text{Catalog}} \text{Weight}(\text{difficulty}_j)}\right) \times 100$$

### 2. Spaced Repetition Retention Decay
Memory retention decays exponentially according to the Ebbinghaus forgetting curve:

$$R(t) = e^{-\lambda \cdot t}$$

* $\lambda = 0.015$ (decay factor calibrated for technical retention)
* $t = \text{days elapsed since last completed review}$

| Days Inactive | Retained Mastery | Retention Impact |
| :--- | :--- | :--- |
| **0 Days** | $100.0\%$ | Peak recall |
| **14 Days** | $81.0\%$ | Minor recall latency |
| **30 Days** | $63.7\%$ | Noticeable decay threshold |
| **60 Days** | $40.6\%$ | High risk of interview stumble |
| **90 Days** | $25.9\%$ | Significant memory loss |

$$\text{Retention Score} = \left(\frac{\sum_{i \in \text{Completed}} (\text{Weight}_i \times R(t_i))}{\sum_{j \in \text{Catalog}} \text{Weight}_j}\right) \times 100$$

### 3. SDE-1 Backend Role Benchmark Distribution
Readiness is benchmarked against standard hiring evaluation profiles:
* **Trees & Graphs:** $25\%$
* **Arrays & Hashing:** $20\%$
* **Dynamic Programming:** $20\%$
* **System Design & DB:** $20\%$
* **Two Pointers & Sliding Window:** $15\%$

$$\text{Target Match} = \sum_{k} \min\left(1.0, \frac{\text{Completed}_k}{\text{Total}_k}\right) \times \text{Weight}_k$$

---

## 💡 Engineering Trade-Offs & Interview Talking Points

### 1. Native `bcrypt` vs. `passlib`
* **Initial State:** Used `passlib.context.CryptContext`.
* **Issue:** `passlib` has been unmaintained since 2020 and throws internal errors on modern `bcrypt>=4.1.0`. It also silently truncates passwords beyond 72 bytes without explicit safeguards.
* **Decision:** Migrated to native `bcrypt` (`gensalt()`, `hashpw()`, `checkpw()`), eliminating unmaintained wrappers and enforcing strict 72-byte string slicing.

### 2. Database `GROUP BY` Aggregations vs. Python Memory Loops
* **Initial State:** Fetched all problem records and user progress rows into Python application memory, looping across datasets to compute category statistics.
* **Issue:** $O(N)$ data transfer over network, high memory pressure, and poor horizontal scalability as catalogs scale.
* **Decision:** Offloaded aggregations directly to the database via SQLAlchemy `func.count()` with SQL `GROUP BY`. Python runtime execution is reserved purely for the continuous mathematical decay formula.

### 3. Timezone Standardization
* **Initial State:** Used `datetime.utcnow()`.
* **Issue:** Deprecated in Python 3.12+ because it produces naive datetimes prone to timezone drift across distributed nodes.
* **Decision:** Standardized on timezone-aware UTC timestamps (`datetime.now(timezone.utc)`) to ensure exact mathematical decay intervals.

### 4. Database Migrations with Alembic
* **Initial State:** Relied on `Base.metadata.create_all(bind=engine)`.
* **Issue:** Incapable of schema alterations, non-destructive rollbacks, or CI/CD migrations.
* **Decision:** Integrated **Alembic** with version-controlled revision scripts for explicit, repeatable schema migrations.

---

## 📡 API Specification

| Method | Endpoint | Access Level | Description | Key Headers / Payloads |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register new candidate or admin account | Body: `UserCreate` (JSON) |
| `POST` | `/api/v1/auth/login` | Public | Authenticate and obtain JWT access token | Form: `username`, `password` (`x-www-form-urlencoded`) |
| `GET` | `/api/v1/readiness/me` | Candidate / Admin | Get decay-adjusted readiness report | Header: `Authorization: Bearer <token>` |
| `GET` | `/api/v1/problems/` | Candidate / Admin | List catalog problems with pagination & filters | Query: `skip`, `limit`, `category` |
| `POST` | `/api/v1/problems/` | **Admin Only** | Create a new catalog problem item | Body: `ProblemCreate` (JSON) |
| `POST` | `/api/v1/progress/` | Candidate / Admin | Log completion status & revision minutes | Body: `ProgressUpdate` (JSON) |
| `GET` | `/health` | Public | Service healthcheck & correlation verification | Header: `X-Request-ID` |

---

## 🚀 Local Development Setup

### Prerequisites
* **Python**: 3.12+ or 3.14
* **Node.js**: 20+ (with npm 10+)

### 1. Backend Service
```powershell
# Navigate to project root
cd c:\Projects\job_readiness_platform

# Activate Virtual Environment & Install Dependencies
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Run Migrations & Database Seeding
alembic upgrade head
python seed.py

# Start Backend Microservice (runs on http://127.0.0.1:8000)
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Dashboard
```powershell
# Open a new terminal in the frontend directory
cd c:\Projects\job_readiness_platform\frontend

# Install dependencies
npm install

# Start Vite Development Server (runs on http://localhost:5173)
npm run dev
```

### 3. Pre-Seeded Test Credentials
Built-in quick-fill buttons on the login screen allow one-click authentication:
* **Candidate**: `candidate@prep.dev` / `CandidatePass123!`
* **Admin**: `admin@platform.dev` / `AdminPassSecure123!` *(Unlocks catalog management)*

---

## 🧪 Automated Testing Suite

The backend includes a comprehensive integration test suite verifying authentication, RBAC boundaries, middleware tracing, and the full readiness lifecycle:

```powershell
# Run all tests with verbose output
pytest -v
```

All 4 test suites execute against in-memory isolated test fixtures with 100% pass rate.

---

## ☁️ Zero-Cost Cloud Deployment

### Frontend (Cloudflare Pages or Vercel)
* **Cloudflare Pages** (Recommended for unlimited free bandwidth):
  * Build command: `npm run build`
  * Output directory: `dist`
  * Root directory: `frontend`
  * Included `frontend/public/_redirects` ensures seamless SPA routing.
* **Vercel**:
  * Root directory: `frontend`
  * Included `frontend/vercel.json` ensures SPA rewrites to `/index.html`.

### Backend (Render, Railway, or Fly.io)
* Deploy with Dockerfile or standard Python environment using `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
* Set `VITE_API_BASE_URL` in the frontend environment variables to point to your live backend.

---

<div align="center">
<sub>Designed and engineered as a showcase of clean REST microservices, mathematical domain modeling, and modern enterprise frontend architecture.</sub>
</div>
