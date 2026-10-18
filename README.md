# Job Readiness & Skill Tracking Platform

A production-grade backend microservice built with **FastAPI**, **SQLAlchemy**, and **PostgreSQL/SQLite**. It quantifies software engineering interview readiness using domain-specific weighted scoring, target role benchmark alignment, and spaced-repetition memory retention decay.

---

## 1. Project Motivation & Evolution

### The Problem
Most coding progress trackers treat all solved problems equally. Solving 50 Easy Two-Sum variations yields an inflated sense of readiness, while complex Dynamic Programming problems or system design implementations carry identical numerical weight. Furthermore, human memory follows an exponential forgetting curve: a problem solved 90 days ago without active recall does not represent current interview readiness.

### Architecture Evolution & Engineering Decisions

1. **Password Hashing: Moving from `passlib` to Native `bcrypt`**
   * **Initial State:** Built using `passlib.context.CryptContext`.
   * **Problem:** `passlib` has been unmaintained since 2020 and is incompatible with modern `bcrypt>=4.1.0`, triggering internal attribute inspection errors and 72-byte truncation exceptions during startup checks.
   * **Decision:** Implemented direct hashing and verification using the official `bcrypt` library (`gensalt()`, `hashpw()`, `checkpw()`), eliminating unmaintained abstraction layers while enforcing strict 72-byte string slicing.

2. **Readiness Engine: Python Memory Loops vs. Database Aggregations**
   * **Initial State:** Pulled all problems and user progress rows into Python application memory, looping across datasets to compute counts and percentages.
   * **Problem:** High memory overhead ($O(N)$ data transfer over network) and poor horizontal scalability as problem catalogs expand.
   * **Decision:** Offloaded category and difficulty grouping directly to the database via SQLAlchemy `func.count()` with SQL `GROUP BY`. Python's runtime is reserved purely for the continuous mathematical decay formula.

3. **Timezone Standardization**
   * **Initial State:** Used `datetime.utcnow()`.
   * **Problem:** Deprecated in Python 3.12+ because it produces naive datetime objects prone to timezone drift.
   * **Decision:** Replaced with timezone-aware `datetime.now(timezone.utc)` and dynamic model lambda factories to ensure cross-database timestamp consistency.

4. **Schema Migrations: Declarative vs. Version-Controlled**
   * **Initial State:** Relied on `Base.metadata.create_all(bind=engine)`.
   * **Problem:** Cannot alter existing columns, add constraints, or rollback breaking changes in staging/production environments.
   * **Decision:** Integrated **Alembic** for explicit, tracked, and reversible schema migration versions.

---

## 2. System Architecture

```text
[ Client / Frontend Dashboard ]
               |
               | HTTP + JWT Bearer
               v
+-------------------------------------------------------------+
|                  CORSMiddleware & Security                  |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                  RequestContextMiddleware                   |
|   - Generates & Injects X-Request-ID Header                 |
|   - Emits Latency Metrics (ms)                              |
+-------------------------------------------------------------+
                               |
        +----------------------+----------------------+
        |                                             |
        v                                             v
+-----------------------------+               +-----------------------------+
|    /api/v1/auth & Users     |               |   /api/v1/problems & Prog   |
|    - OAuth2 / JWT Flow      |               |   - Role-Protected CRUD     |
|    - Candidate vs Admin     |               |   - Status & Time Logging   |
+--------------+--------------+               +--------------+--------------+
               |                                             |
               +----------------------+----------------------+
                                      |
                                      v
+-------------------------------------------------------------+
|                      Readiness Engine                       |
|   - Grouped SQL Aggregations (GROUP BY)                     |
|   - Ebbinghaus Spaced Memory Retention Decay                |
|   - Target Role Distribution Match Index                    |
+-------------------------------------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                   SQLAlchemy Engine (ORM)                   |
|               SQLite (Dev) / PostgreSQL (Prod)              |
+-------------------------------------------------------------+
```

---

## 3. Core Mathematical Models

### A. Non-Linear Difficulty Weighting
Problems carry exponential difficulty multipliers reflecting cognitive load:
* **Easy:** $1.0\times$
* **Medium:** $2.5\times$
* **Hard:** $5.0\times$

$$\text{Weighted Points} = \sum_{i=1}^{N} \text{Weight}(\text{difficulty}_i)$$

### B. Spaced Repetition Retention Decay
Memory retention decays exponentially according to the Ebbinghaus forgetting curve:

$$R(t) = e^{-\lambda \cdot t}$$

* $\lambda = 0.015$ (decay constant)
* $t = \text{days elapsed since last completed revision}$

| Days Inactive | Estimated Retention |
| :--- | :--- |
| **0 Days** | $100.0\%$ |
| **14 Days** | $81.0\%$ |
| **30 Days** | $63.7\%$ |
| **60 Days** | $40.6\%$ |
| **90 Days** | $25.9\%$ |

### C. Target Role Benchmark Alignment
Readiness compares category distributions against target profiles for backend engineering roles:
* **Arrays & Hashing:** $20\%$
* **Two Pointers & Sliding Window:** $15\%$
* **Trees & Graphs:** $25\%$
* **Dynamic Programming:** $20\%$
* **System Design & DB:** $20\%$

---

## 4. API Endpoints

### Authentication
* `POST /api/v1/auth/register` — Register user account (`candidate` or `admin`).
* `POST /api/v1/auth/login` — Authenticate and receive signed JWT bearer token.

### Problems & Progress
* `POST /api/v1/problems/` — Create new catalog item (**Admin only**).
* `GET /api/v1/problems/` — Filter and list catalog problems (Supports pagination and category filtering).
* `POST /api/v1/progress/` — Record candidate completion status (`Todo`, `In Progress`, `Completed`) and logged time.

### Readiness Engine & System
* `GET /api/v1/readiness/me` — Generate full readiness report with category-by-category retention and benchmark match.
* `GET /health` — Microservice healthcheck returning correlation headers.

---

## 5. Local Setup & Seeding

```powershell
# 1. Environment & Dependencies
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 2. Database Migrations & Seeding
alembic upgrade head
python seed.py

# 3. Start Local Microservice
uvicorn app.main:app --reload --port 8000
```
API Documentation: `http://127.0.0.1:8000/docs`

### Seed Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@platform.dev` | `AdminPassSecure123!` |
| **Candidate** | `candidate@prep.dev` | `CandidatePass123!` |

---

## 6. Testing & Containerization

```powershell
# Run automated integration tests with in-memory SQLite fixtures
pytest -v

# Run via Docker Compose (FastAPI + PostgreSQL 16)
docker compose up --build
```

---

## 7. Roadmap & Future Improvements

1. **Redis Caching:** Cache candidate readiness scores with automated cache invalidation upon progress updates.
2. **Dynamic Spaced Repetition Reminders:** Background celery worker calculating items entering high decay ($<50\%$) and dispatching review notifications.
3. **Company Customization:** Candidate-selectable target templates (e.g., *Frontend Heavy*, *Data Platform*, *FAANG Generalist*).
