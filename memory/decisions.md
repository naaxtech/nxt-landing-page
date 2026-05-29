# Architecture Decision Records

## Template — copy this block for each decision

### ADR-[N]: [Title]
**Date:** YYYY-MM-DD
**Status:** decided | superseded by ADR-X
**Context:** [what forced this decision]
**Decision:** [what we chose]
**Rationale:** [why]
**Tradeoffs:** [what we gave up]
**Trigger to revisit:** [what would make us change this]

---

## ADR-001: Stage 1 edge stack (Vercel + Railway + Supabase)
**Date:** 2026-05-29
**Status:** decided
**Context:** New app, no traffic, 1-2 person team, need to ship fast.
**Decision:** Vercel (frontend) + Railway (backend Docker) + Supabase (Postgres + Auth + Storage) + Upstash Redis (rate limit + cache).
**Rationale:** Near-zero ops, generous free tiers, RLS and auth built in, ships in days not weeks.
**Tradeoffs:** Can't run background jobs reliably across multiple Railway instances at scale.
**Trigger to revisit:** APScheduler job needs to run once across N replicas, OR DB connection pool exhausted, OR per-user cost exceeds dedicated infra cost.

## ADR-002: Redis for rate limiting and caching (not in-memory)
**Date:** 2026-05-29
**Status:** decided
**Context:** PAVI used in-memory rate limiter (threading.Lock + defaultdict) and in-memory LRU cache (OrderedDict). Both break when the backend scales to >1 Railway instance — state is per-process.
**Decision:** Upstash Redis (serverless, no persistent connection) for all rate limit state and cache entries.
**Rationale:** Survives restarts, works across instances, Upstash free tier is sufficient for Stage 1.
**Tradeoffs:** One more service dependency; adds ~2ms latency per rate limit check.
**Trigger to revisit:** Latency budget is tight → switch to local Redis sidecar on Railway.

## ADR-003: RLS policies in migration files (not manual, not split)
**Date:** 2026-05-29
**Status:** decided
**Context:** PAVI split schema (001) from RLS (002). The gap between migration runs is a window where tables are unprotected. Also, manual RLS application is a deployment step that gets skipped.
**Decision:** Every CREATE TABLE in a migration file is immediately followed (in the same file, same transaction) by its indexes, trigger, ENABLE ROW LEVEL SECURITY, and CREATE POLICY.
**Rationale:** Schema + access control in the same atomic migration. Fresh deploy is always correctly secured.
**Tradeoffs:** Migration files are longer and require more thought upfront.
**Trigger to revisit:** Never — this is a hard rule.

## ADR-004: Tier limits wired from day one
**Date:** 2026-05-29
**Status:** decided
**Context:** PAVI set all TIER_LIMITS to -1 (unlimited) across all tiers. This is a revenue gap: paying customers get the same as free users.
**Decision:** TIER_LIMITS in config.py has real values for each tier. tier_checker.py enforces them at the router layer before any DB write.
**Rationale:** Correctness from the start. Changing limits later requires a migration + backfill.
**Tradeoffs:** Need to decide real limit values before launch — placeholder values in the template.
**Trigger to revisit:** Product decision to change limits → update TIER_LIMITS only, no code changes needed.

## ADR-005: get_user_role() helper function in all apps
**Date:** 2026-05-29
**Status:** decided
**Context:** PAVI defined get_user_org_id() but not get_user_role() in the initial migration. Role checks in policies were added ad-hoc and inconsistently. Fine-grained per-operation policies (owner vs admin vs viewer) require role access in every policy.
**Decision:** Both get_user_org_id() and get_user_role() are defined in 001_init.sql, both STABLE + SECURITY DEFINER, both GRANTed to authenticated. Used in every policy that differentiates roles.
**Rationale:** Eliminates ad-hoc role checks, consistent policy authoring pattern, no future migration needed to add role granularity.
**Tradeoffs:** Two extra function calls per query (negligible; both are STABLE so called once per query by the planner).
**Trigger to revisit:** Never for the pattern; revisit values if roles expand beyond owner/admin/viewer.

## ADR-006: updated_at from day one, named triggers
**Date:** 2026-05-29
**Status:** decided
**Context:** PAVI added updated_at columns and set_updated_at() triggers in migration 014 — a painful retrofit across 12 tables. Also used generic trigger name "set_updated_at" which required DROP TRIGGER before recreation.
**Decision:** Every table with updated_at gets the column in 001_init.sql. Trigger function is set_updated_at(). Individual triggers are named trg_[table]_updated_at to avoid conflicts on re-run.
**Rationale:** No retrofit migrations needed. Named triggers can be created idempotently without DROP.
**Tradeoffs:** Slightly more verbose migration file.
**Trigger to revisit:** Never.

## ADR-007: slug and stripe_customer_id on organizations from day one
**Date:** 2026-05-29
**Status:** decided
**Context:** PAVI added slug in migration 011 (backfill was awkward — existing orgs needed slugs generated). stripe_customer_id was also missing initially.
**Decision:** Both columns present in 001_init.sql. slug has UNIQUE index. stripe_customer_id has partial index (WHERE NOT NULL).
**Rationale:** Eliminates backfill migrations. Slug enables clean URL routing immediately.
**Tradeoffs:** Slug must be populated during onboarding (generated from org name, deduplicated).
**Trigger to revisit:** Never.

## ADR-008: service_role owns job/audit_log/notification writes
**Date:** 2026-05-29
**Status:** decided
**Context:** PAVI had RLS gaps discovered in migration 012 (missing service_role UPDATE/DELETE policies on score_history and prompt_runs). Backend workers need to write to system tables without going through user RLS.
**Decision:** jobs, audit_logs, notifications all have INSERT (and UPDATE/DELETE where applicable) restricted to service_role only. Authenticated users can read but never write directly. All writes go through the FastAPI backend using the service role client.
**Rationale:** Clean separation — users interact via API, API uses service role for system state. No RLS gap migrations needed later.
**Tradeoffs:** Frontend cannot write to these tables directly via Supabase client — must go through backend.
**Trigger to revisit:** Never for the pattern.
