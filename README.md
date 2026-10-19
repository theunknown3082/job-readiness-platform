<div align="center">

# 🎯 Job Readiness & Skill Tracking Platform

**A real-time skill analytics platform that models technical preparation using continuous spaced-repetition memory decay, non-linear difficulty weighting, and role benchmark profiles.**

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

### 🌐 **Live Application**: [https://job-readiness-platform.pages.dev](https://job-readiness-platform.pages.dev)

[![Cloudflare Status](https://img.shields.io/badge/Status-Live%2024%2F7-brightgreen.svg?style=flat&logo=cloudflare&logoColor=white)](https://job-readiness-platform.pages.dev)
[![Demo Mode](https://img.shields.io/badge/Demo%20Mode-Available-blueviolet.svg?style=flat)](https://job-readiness-platform.pages.dev)

> 💡 **Live Demo & Sandbox Access**: The application is deployed globally with zero configuration required. You can test it via **"⚡ Explore in Demo Mode"** on the login screen for instant offline evaluation, or sign in with pre-seeded sandbox accounts:
> * **Candidate**: `candidate@prep.dev` / `CandidatePass123!`
> * **Admin**: `admin@platform.dev` / `AdminPassSecure123!` *(Catalog management)*

[Live Application](https://job-readiness-platform.pages.dev) • [System Architecture](#-system-architecture) • [Database Schema](#-relational-database-schema-3nf) • [Mathematical Models](#-core-mathematical-models) • [Engineering Decisions](#-architecture--engineering-decisions) • [API Specification](#-api-specification)

</div>

---

## 📌 Motivation & Problem Statement

Most coding and skill trackers treat completed problems as static, permanent achievements. In reality, this creates two fundamental flaws in assessing technical preparedness:

1. **The Flat-Progress Bias**: Solving 50 basic array manipulation exercises yields an inflated completion score, even though complex Graph or Dynamic Programming problems require vastly different cognitive effort and time.
2. **Exponential Memory Decay**: Human recall follows an exponential forgetting curve. An algorithmic problem solved three months ago without spaced revision does not represent current retained capability.

This platform bridges that gap by computing **real-time, decay-adjusted readiness metrics** driven by continuous exponential decay ($R(t) = e^{-\lambda t}$), non-linear difficulty weighting ($1.0\times, 2.5\times, 5.0\times$), and target role benchmark profiles.

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

| Days Inactive | Retained Recall | Retention Status |
| :--- | :--- | :--- |
| **0 Days** | $100.0\%$ | Complete recall |
| **14 Days** | $81.0\%$ | Minor recall latency |
| **30 Days** | $63.7\%$ | Moderate retention threshold |
| **60 Days** | $40.6\%$ | Significant retention degradation |
| **90 Days** | $25.9\%$ | Critical recall loss |

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

## 💡 Architecture & Engineering Decisions

### 1. Direct `bcrypt` Integration vs. Unmaintained Wrappers
* **Context**: Many Python templates use `passlib.context.CryptContext` for password hashing.
* **Problem**: `passlib` has been unmaintained since 2020 and raises internal regex errors with modern `bcrypt >= 4.1.0` under Python 3.12+. Furthermore, bcrypt natively caps passwords at 72 bytes.
* **Solution**: Standardized directly on the official `bcrypt` package (`gensalt()`, `hashpw()`, `checkpw()`), removing unnecessary abstraction layers and explicitly enforcing 72-byte slicing to avoid silent truncation.

### 2. Database-Level Aggregations vs. Application Memory Loops
* **Context**: Computing category completion ratios and effective retention across large problem catalogs.
* **Problem**: Fetching all catalog rows and user submissions into Python memory incurs $O(N)$ network transfer overhead and increases memory pressure on horizontal microservice workers.
* **Solution**: Delegated aggregations directly to the database engine using SQLAlchemy `func.count()` and SQL `GROUP BY (category, difficulty)`. Python processes only the mathematical retention curve over the pre-aggregated results.

### 3. Explicit Timezone-Aware UTC Serialization
* **Context**: Tracking completion timestamps and calculating elapsed days $t$ for exponential decay.
* **Problem**: `datetime.utcnow()` was officially deprecated in Python 3.12 because it returns naive datetime objects that risk silent timezone drift across distributed cloud instances.
* **Solution**: Standardized on timezone-aware UTC timestamps (`datetime.now(timezone.utc)`) across all database columns and mathematical calculations.

### 4. Version-Controlled Migrations via Alembic
* **Context**: Schema evolution and multi-environment synchronization.
* **Problem**: Relying on raw `Base.metadata.create_all()` is non-deterministic in production, incapable of altering existing tables, and prevents automated rollbacks.
* **Solution**: Integrated **Alembic** with versioned migration scripts to ensure declarative, repeatable database upgrades across local development and cloud production.

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
<sub>An open-source skill readiness and spaced-repetition analytics platform built with clean architecture and modern web standards.</sub>
</div>
