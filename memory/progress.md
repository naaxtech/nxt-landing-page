# Build Progress

## App: YES Template
## Current stage: Stage 1 — Edge stack (Vercel + Railway + Supabase + Upstash Redis)

## 13-layer status
| Layer | Status | Notes |
|---|---|---|
| 1 Frontend | TODO | |
| 2 API & backend | TODO | |
| 3 Database + storage | IN PROGRESS | 001_init.sql written, not yet applied |
| 4 Auth + permissions | TODO | RLS written in migration; backend deps.py next |
| 5 Hosting + deploy | TODO | |
| 6 Cloud + compute | Stage 1 | Vercel/Railway/Supabase |
| 7 CI/CD | TODO | |
| 8 Security + RLS | IN PROGRESS | All 7 tables covered in 001_init.sql |
| 9 Rate limiting | TODO | Redis sliding window (not in-memory) |
| 10 Caching + CDN | TODO | Redis + Cloudflare |
| 11 Load balancing | DEFERRED | Railway handles at Stage 1 |
| 12 Error tracking | TODO | Sentry FE + BE |
| 13 Availability | DEFERRED | Supabase backups at Stage 1 |

## Completed
- `supabase/migrations/001_init.sql` — 7 tables, full RLS, indexes, triggers

## In progress
- Awaiting confirmation to proceed to backend scaffold (main.py, config.py, deps.py)

## Up next (ordered)
1. Backend scaffold — main.py + config.py + deps.py (FastAPI boot against Supabase)
2. Auth router + onboarding router
3. Redis rate limiter + cache (services/cache.py, middleware/rate_limit.py)
4. Frontend scaffold — routes.tsx, fetchApiAuth(), ProtectedRoute
5. CI/CD — GH Actions pipeline
6. Deploy — Vercel + Railway + Upstash

## Known debt / watch items
- slug population during onboarding must be implemented (generated from org name, deduplicated with suffix if collision)
- TIER_LIMITS in config.py are placeholder values — must be set to real limits per product decision before launch
- Invitation accept flow is service_role only (no anon RLS) — backend endpoint required
