# Job Readiness & Technical Interview Preparation Microservice

A backend microservice built with FastAPI, SQLAlchemy, and PostgreSQL/SQLite designed to quantify candidate interview readiness through domain weighting, role benchmark alignment, and spaced-repetition memory retention decay.

---

## Architecture & System Design

                 ┌────────────────────────────────────────┐
                 │          Client / Swagger UI           │
                 └───────────────────┬────────────────────┘
                                     │ HTTP + JWT Bearer
                                     ▼
                 ┌────────────────────────────────────────┐
                 │       RequestContextMiddleware         │
                 │  - Generates & Injects X-Request-ID    │
                 │  - Logs Execution Latency (ms)         │
                 └───────────────────┬────────────────────┘
                                     │
               ┌─────────────────────┴─────────────────────┐
               ▼                                           ▼
  ┌─────────────────────────┐                 ┌─────────────────────────┐
  │  /api/v1/auth & /users  │                 │ /api/v1/problems & /prog│
  └────────────┬────────────┘                 └────────────┬────────────┘
               │                                           │
               └─────────────────────┬─────────────────────┘
                                     ▼
                 ┌────────────────────────────────────────┐
                 │            Readiness Engine            │
                 │  - SQL Aggregations (GROUP BY)         │
                 │  - Ebbinghaus Spaced Decay Modeling    │
                 │  - Target Role Benchmark Indexing      │
                 └───────────────────┬────────────────────┘
                                     ▼
                 ┌────────────────────────────────────────┐
                 │          SQLAlchemy Engine             │
                 │         (SQLite / PostgreSQL)          │
                 └────────────────────────────────────────┘

---

## Core Algorithmic Mechanics

### 1. Difficulty Weighting
Problems are assigned non-linear multipliers based on cognitive complexity:
* **Easy:** $1.0\times$
* **Medium:** $2.5\times$
* **Hard:** $5.0\times$

### 2. Spaced Repetition Retention Decay
To reflect real-world memory decay over time, solved problems degrade in effective readiness value according to an exponential retention curve:
$$R(t) = e^{-\lambda \cdot t}$$
Where $\lambda = 0.015$ and $t$ represents days elapsed since problem completion. An unreviewed problem retains $\sim 63.7\%$ weight after 30 days and $\sim 40.6\%$ after 60 days.

---

## Quickstart

### 1. Local Environment Setup
```powershell
# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
