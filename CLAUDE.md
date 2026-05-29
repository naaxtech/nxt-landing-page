# CLAUDE.md — Edge Stack App Template
# Architecture-first. Stage 1 by default. Production from day one.

## What this is

A reusable monorepo template for building production SaaS and AI-native apps.
Derived from PAVI (Philippine AI Visibility Index) — a production system — with its
three known gaps fixed:
  1. Redis for distributed rate limiting + caching (replaces in-memory)
  2. Supabase migrations include RLS policies + FK indexes (not manual steps)
  3. Tier limit enforcement is wired (not set to -1/unlimited)

Stage 1 stack (edge by default). Graduate to Stage 2 only when a named trigger fires.

---

## Memory system

At session start, read:
  memory/decisions.md   — ADRs: why we chose X over Y
  memory/progress.md    — what's built, what's next
  memory/patterns.md    — reusable patterns discovered during the build
  memory/people.md      — team, stakeholders, context

Update these files after any significant decision or completed feature.

---

## Monorepo layout

```
/
├── CLAUDE.md                  ← you are here (read first every session)
├── Makefile                   ← dev/test/lint/docker shortcuts
├── docker-compose.yml         ← local dev (backend + frontend + redis)
├── docker-compose.prod.yml    ← production smoke-test
├── .env.example               ← all env vars documented
├── .nvmrc                     ← Node version pin
├── .python-version            ← Python version pin
├── memory/                    ← persistent context (update after work)
│   ├── decisions.md
│   ├── progress.md
│   ├── patterns.md
│   └── people.md
├── backend/
│   ├── app/
│   │   ├── main.py            ← FastAPI app, middleware stack, lifespan
│   │   ├── config.py          ← Pydantic Settings, tier limits, feature flags
│   │   ├── deps.py            ← DI: supabase clients, current_user, role guards
│   │   ├── agents/            ← LangGraph pipelines (if AI features)
│   │   │   ├── graph.py       ← StateGraph definition + run_* convenience fn
│   │   │   ├── nodes.py       ← node functions (init, collect, score, etc.)
│   │   │   └── state.py       ← TypedDict state definitions
│   │   ├── middleware/
│   │   │   └── rate_limit.py  ← Redis sliding-window rate limiter (tier-based)
│   │   ├── models/            ← Pydantic response/request models
│   │   ├── providers/         ← AI provider abstraction (base + per-provider)
│   │   │   ├── base.py
│   │   │   ├── circuit_breaker.py
│   │   │   └── [openai|anthropic|gemini|perplexity]_provider.py
│   │   ├── routers/           ← one file per domain
│   │   │   ├── auth.py
│   │   │   ├── health.py      ← /health, /ready endpoints
│   │   │   ├── onboarding.py
│   │   │   └── [domain].py    ← add per feature
│   │   └── services/
│   │       ├── cache.py       ← Redis TTL cache (replaces in-memory)
│   │       ├── supabase_client.py  ← singleton manager, anon + service role
│   │       ├── tier_checker.py     ← enforce tier limits (not -1)
│   │       └── [domain].py    ← business logic per domain
│   ├── tests/
│   │   ├── conftest.py        ← FastAPI DI overrides, shared fixtures
│   │   └── test_[domain].py
│   ├── Dockerfile
│   ├── pyproject.toml         ← deps, pytest config, ruff, mypy, black
│   └── requirements.txt       ← pinned deps for Docker
├── frontend/
│   ├── src/
│   │   ├── features/          ← feature-modular: auth, dashboard, [domain]...
│   │   │   └── [domain]/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       └── index.ts
│   │   ├── shared/
│   │   │   ├── lib/
│   │   │   │   ├── api.ts     ← fetchApi() + fetchApiAuth() with JWT + 401 retry
│   │   │   │   └── supabase.ts ← Supabase client singleton
│   │   │   ├── components/    ← ProtectedRoute, layouts, ErrorBoundary
│   │   │   └── hooks/         ← useAuth, useDebounce, useLocalStorage
│   │   └── routes.tsx         ← all routes, lazy-loaded, public vs protected
│   ├── e2e/                   ← Playwright tests per feature
│   ├── package.json
│   └── vite.config.ts         ← /api proxy → backend in dev
└── supabase/
    ├── migrations/            ← numbered SQL files (001_, 002_, ...)
    │   └── 001_init.sql       ← schema + RLS policies + indexes in one file
    └── seed.sql               ← dev seed data
```

---

## Tech stack (locked)

### Backend
| Concern | Choice | Notes |
|---|---|---|
| Framework | FastAPI + Pydantic v2 | `redirect_slashes=False` always |
| Runtime | Python 3.11+ | pin in `.python-version` |
| Database | Supabase (Postgres) | RLS on every table, no exceptions |
| Cache + rate limit | Redis (upstash in prod, local docker in dev) | NOT in-memory |
| AI orchestration | LangGraph (stateful) | CrewAI for fast prototypes only |
| AI providers | OpenAI · Anthropic · Gemini · Perplexity | circuit breaker on each |
| PDF | WeasyPrint + Jinja2 | for report export |
| Scheduler | APScheduler → Railway Cron at Stage 2 | 1 instance only at Stage 1 |
| Error tracking | Sentry (both FE + BE) | |
| Lint / format | ruff + black + mypy | strict mypy |

### Frontend
| Concern | Choice |
|---|---|
| Framework | React 18 + Vite 6 + TypeScript 5.7 |
| UI | shadcn/ui (Radix) + Tailwind 3 |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| Forms | React Hook Form + Zod |
| i18n | i18next + react-i18next |
| Routing | React Router v6 (lazy-loaded) |
| Charts | Recharts |
| Animations | Framer Motion |
| Testing | Vitest (unit) + Playwright (E2E) |
| Error tracking | @sentry/react |

### Infra (Stage 1)
| Service | Use |
|---|---|
| Vercel | Frontend |
| Railway | Backend (Docker) |
| Supabase | Postgres + Auth + Storage |
| Upstash Redis | Rate limiting + caching (serverless Redis) |
| Cloudflare | DNS + CDN + WAF (add early) |

---

## The 13 production layers — status per new app

When starting a new app, walk these and mark each DONE / DEFERRED (with reason) / TODO:

| # | Layer | Default status |
|---|---|---|
| 1 | Frontend | DONE when scaffold exists |
| 2 | API & backend | DONE when FastAPI app boots |
| 3 | Database + storage | DONE when migrations + RLS run |
| 4 | Auth + permissions | DONE when JWT + RBAC wired |
| 5 | Hosting + deploy | DONE when Vercel + Railway configured |
| 6 | Cloud + compute | Stage 1: Vercel/Railway/Supabase |
| 7 | CI/CD | DONE when GH Actions pipeline passes |
| 8 | Security + RLS | DONE when RLS policies cover all tables |
| 9 | Rate limiting | DONE when Redis rate limiter is live |
| 10 | Caching + CDN | DONE when Redis cache + Cloudflare live |
| 11 | Load balancing | DEFERRED — Railway handles at Stage 1 |
| 12 | Error tracking + logs | DONE when Sentry + request-ID live |
| 13 | Availability + recovery | DEFERRED — Supabase backups at Stage 1 |

**Stage 2 triggers (when to graduate from Railway/Supabase):**
- APScheduler job needs to run reliably across multiple instances → move to Railway Cron
- Rate limiter state must survive deploys → already using Redis, no change needed
- DB connection pool exhausted → add PgBouncer / Supavisor
- Multi-region or SOC 2 requirement → Stage 3

---

## Architecture rules (non-negotiable)

### Backend
1. `redirect_slashes=False` on every FastAPI app — avoids 307s stripping auth headers
2. All routers mounted under `/api/[domain]` prefix
3. Auth: JWT via Supabase, `get_current_user()` in `deps.py` — validate with anon client, fetch member with service role to break RLS circular dep
4. Every DB table has `org_id` column + RLS policy scoping reads/writes to that org
5. RLS policies written in the migration file, not applied manually
6. FK indexes in the migration file (`CREATE INDEX IF NOT EXISTS`)
7. Rate limiting via Redis sliding window, server-side — never trust client
8. Tier limits enforced in `tier_checker.py` — not set to -1/unlimited in prod
9. AI pipeline: LangGraph StateGraph, TypedDict state, 80% error threshold routes to error node
10. Circuit breaker on every AI provider (pybreaker, 5 failures → open, 60s recovery)
11. Stuck job recovery in lifespan startup hook
12. Sentry initialized before app starts (if `SENTRY_DSN` set)
13. Feature flags gate router inclusion at startup: `if settings.enable_[feature]:`
14. All secrets from environment — never hardcoded, never in git
15. `docs_url` and `redoc_url` disabled in production

### Frontend
1. All API calls via `fetchApi()` (public) or `fetchApiAuth()` (auth) — never raw `fetch()`
2. `fetchApiAuth()` auto-injects Supabase JWT + retries on 401 with token refresh
3. Feature-modular structure: `features/[domain]/components|hooks|index.ts`
4. Routes defined in `routes.tsx`, lazy-loaded, public vs protected split
5. `ProtectedRoute` wraps all dashboard routes
6. Zustand for client state, TanStack Query for server state — never mix concerns
7. Zod schemas for all form validation
8. i18n from day one — no hardcoded strings in components
9. E2E tests for every user flow (auth, onboarding, core feature, settings)

### Database
1. Every table: `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`, `org_id uuid NOT NULL REFERENCES organizations(id)`, `created_at timestamptz DEFAULT now()`, `updated_at timestamptz DEFAULT now()`
2. RLS: enable on every table, policy for SELECT/INSERT/UPDATE/DELETE using `auth.uid()` → org scope
3. Indexes: FK columns + hot WHERE/ORDER BY columns in same migration as table creation
4. Migrations numbered sequentially: `001_init.sql`, `002_add_[feature].sql`
5. Never alter production DB manually — always via migration
6. Files go to Supabase Storage with signed URLs — never as blobs in Postgres

---

## Multi-tenancy pattern

Every app is multi-tenant from day one. The pattern:

```sql
-- organizations table (root of the tenant tree)
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier text NOT NULL DEFAULT 'free' CHECK (tier IN ('free','starter','pro','enterprise')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- members table (links auth.users to organizations with a role)
CREATE TABLE members (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner','admin','viewer')),
  full_name text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- helper function for RLS
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT org_id FROM members WHERE id = auth.uid()
$$;

-- RLS pattern for any tenant-scoped table
ALTER TABLE [table] ENABLE ROW LEVEL SECURITY;
CREATE POLICY "[table]_org_isolation" ON [table]
  USING (org_id = get_user_org_id());
```

In Python, `deps.py` resolves `UserInfo.org_id` from the JWT, and every service function receives it explicitly — no globals.

---

## Redis pattern (fixes PAVI gap #1)

Use Upstash Redis in prod (serverless, no persistent connection needed).
Local dev: `redis` service in `docker-compose.yml`.

```python
# services/cache.py — Redis-backed TTL cache
import redis.asyncio as aioredis
from app.config import settings

_redis: aioredis.Redis | None = None

async def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    return _redis

async def cache_get(key: str) -> str | None:
    r = await get_redis()
    return await r.get(key)

async def cache_set(key: str, value: str, ttl: int = 3600) -> None:
    r = await get_redis()
    await r.setex(key, ttl, value)

# middleware/rate_limit.py — Redis sliding window
async def is_rate_limited(key: str, limit: int, window: int = 3600) -> tuple[bool, int]:
    r = await get_redis()
    pipe = r.pipeline()
    now = int(time.time())
    window_start = now - window
    pipe.zremrangebyscore(key, 0, window_start)
    pipe.zadd(key, {str(now): now})
    pipe.zcard(key)
    pipe.expire(key, window)
    results = await pipe.execute()
    count = results[2]
    return count > limit, count
```

Env vars to add to `.env.example`:
```
REDIS_URL=redis://localhost:6379  # local
# REDIS_URL=rediss://:[password]@[host]:6379  # Upstash prod
```

---

## Tier enforcement pattern (fixes PAVI gap #3)

```python
# config.py
TIER_LIMITS: dict[str, dict] = {
    "free":       {"items": 3,   "reports_per_month": 5,   "api_access": False},
    "starter":    {"items": 10,  "reports_per_month": 20,  "api_access": False},
    "pro":        {"items": 50,  "reports_per_month": 100, "api_access": True},
    "enterprise": {"items": -1,  "reports_per_month": -1,  "api_access": True},
}

# services/tier_checker.py
from app.config import TIER_LIMITS
from fastapi import HTTPException, status

def check_item_limit(tier: str, current_count: int, resource: str) -> None:
    limit = TIER_LIMITS.get(tier, TIER_LIMITS["free"]).get(resource, 0)
    if limit == -1:
        return  # unlimited
    if current_count >= limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Your {tier} plan allows {limit} {resource}. Upgrade to add more.",
        )

def check_feature_access(tier: str, feature: str) -> None:
    allowed = TIER_LIMITS.get(tier, TIER_LIMITS["free"]).get(feature, False)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"This feature requires a higher plan. Current plan: {tier}.",
        )
```

---

## RLS migration pattern (fixes PAVI gap #2)

Every migration file includes the full table definition, indexes, AND RLS policies together:

```sql
-- supabase/migrations/001_init.sql

-- Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier text NOT NULL DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "org_self_read" ON organizations
  FOR SELECT USING (id = get_user_org_id());

-- Members
CREATE TABLE members (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'viewer',
  full_name text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS members_org_id_idx ON members(org_id);
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members_org_isolation" ON members
  FOR ALL USING (org_id = get_user_org_id());

-- Repeat this pattern for every domain table:
-- 1. CREATE TABLE with org_id FK
-- 2. CREATE INDEX on org_id + any hot filter columns
-- 3. ALTER TABLE ENABLE ROW LEVEL SECURITY
-- 4. CREATE POLICY scoped to get_user_org_id()
```

---

## CI/CD pipeline (GH Actions)

Four jobs that all must pass before merge:

```
frontend-lint    → tsc --noEmit + eslint
frontend-test    → vitest run
frontend-build   → vite build (verify no build errors)
backend-lint     → ruff check
backend-test     → pytest with coverage
backend-docker   → docker build (verify image builds)
```

Plus:
- `deploy-backend.yml` — Railway deploy on main merge, health check after, failure creates GH issue
- `deploy-frontend.yml` — Vercel deploy (automatic via integration, workflow for status)
- `security.yml` — dependency audit
- `performance.yml` — Lighthouse CI on frontend
- `smoke-tests.yml` — post-deploy curl health checks

Concurrency: `cancel-in-progress: true` on CI, `cancel-in-progress: false` on deploy.

---

## AI agent pipeline pattern (LangGraph)

Standard pipeline shape for any AI evaluation/generation task:

```
init → [domain_collect] → conditional_check → [domain_process] → score/aggregate → END
                                    ↓
                                  error → END
```

```python
# agents/state.py
class AppState(TypedDict, total=False):
    # Input
    job_id: str
    org_id: str
    user_id: str
    # Results
    results: list[dict]
    errors: list[dict]
    # Output
    status: Literal["queued", "running", "completed", "failed"]
    completed_at: str | None

# agents/graph.py
def should_continue(state: AppState) -> Literal["continue", "error"]:
    errors = state.get("errors", [])
    results = state.get("results", [])
    total = len(errors) + len(results)
    if total == 0 or len(results) == 0:
        return "error"
    if len(errors) > total * 0.8:
        return "error"
    return "continue"
```

Stuck job recovery always in lifespan:
```python
@asynccontextmanager
async def lifespan(app):
    # Recover stuck jobs from crashed processes
    sb = get_supabase_service_client()
    for stuck in ("queued", "running"):
        rows = sb.table("jobs").select("id").eq("status", stuck).execute()
        for row in rows.data or []:
            sb.table("jobs").update({
                "status": "failed",
                "completed_at": datetime.now(UTC).isoformat(),
                "description": f"Recovered from stuck '{stuck}' state"
            }).eq("id", row["id"]).execute()
    yield
```

---

## Specialized agents for Claude Code

When working in Claude Code, spin up sub-agents for focused work:

| Agent | Scope | Start with |
|---|---|---|
| `architect` | Schema, migrations, RLS, types | "Read CLAUDE.md and memory/decisions.md" |
| `api-engineer` | Routers, services, validation | "Read CLAUDE.md, then backend/app/routers/[domain].py" |
| `frontend-core` | Layout, routing, shared lib | "Read CLAUDE.md, then frontend/src/routes.tsx" |
| `frontend-feature` | One feature domain | "Read CLAUDE.md, then frontend/src/features/[domain]/" |
| `auth-security` | Auth, middleware, RLS | "Read CLAUDE.md, then backend/app/deps.py" |
| `qa-testing` | Tests, CI, fixtures | "Read CLAUDE.md, then backend/tests/conftest.py" |

Agent ordering for new features:
1. `architect` — schema + migration first
2. `api-engineer` — router + service
3. `frontend-feature` — UI consuming the API
4. `qa-testing` — tests for the above

---

## Starting a new app with this template

Run these steps in order. Don't skip any.

1. **Copy template**: `cp -r stack-template/ my-new-app/`
2. **Fill in project context**: update `CLAUDE.md` header, `memory/people.md`, `memory/decisions.md` with the product name and context
3. **Domain model first**: open `memory/decisions.md`, write the entity list and relationships before any code
4. **Schema**: write `supabase/migrations/001_init.sql` with tables + indexes + RLS
5. **Backend scaffold**: `main.py` + `config.py` + `deps.py` — boot the FastAPI app against Supabase
6. **Auth flow**: onboarding router, `get_current_user`, tier_checker
7. **Core feature router + service**: first domain
8. **Frontend scaffold**: `routes.tsx`, `fetchApiAuth()`, `ProtectedRoute`
9. **First feature UI**: consuming the API from step 7
10. **CI**: wire GH Actions before any other feature
11. **Deploy**: Vercel + Railway + Upstash Redis — get to production before adding more features

---

## What to customise per project

Replace these in every new app:
- `APP_NAME` throughout
- `TIER_LIMITS` in `config.py` — set real limits, not -1
- `organizations.tier` CHECK constraint — match your actual tiers
- Domain tables in migrations
- Feature flags in `config.py`
- Sentry DSN, CORS origins
- Agent names in this file's "specialized agents" section

---

## Rules for Claude Code sessions

- Read `CLAUDE.md` and `memory/decisions.md` at the start of every session — no exceptions
- Schema changes (architect) always before API changes
- API changes always before frontend changes
- Never alter production DB directly — always a migration
- All tests use FastAPI DI overrides, not `unittest.mock.patch` on dependencies
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`, `chore:`
- Update `memory/progress.md` after completing any feature
- When uncertain about a decision, write the tradeoff in `memory/decisions.md` before proceeding
