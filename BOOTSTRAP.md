# Bootstrap Guide — How to use this template

## Step 1: Copy and rename

```bash
cp -r stack-template/ my-app-name/
cd my-app-name/
```

## Step 2: Fill in project identity

Edit `CLAUDE.md`:
- Replace `APP_NAME` with your app name
- Fill in the "What to customise per project" section

Edit `memory/people.md`:
- Add team members and stakeholders

Edit `memory/decisions.md`:
- Add context to ADR-001 through ADR-004 dates

## Step 3: First Claude Code session

Open a terminal in the project root and run:
```bash
claude
```

Paste this as your first message:

```
Read CLAUDE.md fully. Then read memory/decisions.md and memory/progress.md.

We are starting a new app called [APP NAME]. Here is the product brief:

[PASTE YOUR ONE-PARAGRAPH PRODUCT BRIEF]

Start with the domain model. Ask me one question if the entities aren't clear.
Then write supabase/migrations/001_init.sql with:
- organizations + members tables (multi-tenancy base)
- [your core domain tables]
- RLS policies for all tables
- FK indexes for all foreign keys
- updated_at trigger for all tables

Do not write any application code until the schema is complete and I confirm it.
```

## Step 4: Session workflow from there

Every subsequent Claude Code session starts with:
```
Read CLAUDE.md, memory/decisions.md, and memory/progress.md before doing anything.
```

That's it. The memory files will tell Claude Code where you left off.

## Step 5: Adding a new feature

Use this prompt pattern:
```
I want to add [FEATURE NAME]. Here's what it does: [1-2 sentences].

Walk the 13 layers for this feature before writing any code. 
Tell me what each layer means for this feature and whether it needs new work.
Then, starting with the schema, build it.
```

## Stage 2 checklist (run when any trigger fires)

When you hit a Stage 2 trigger from CLAUDE.md:

- [ ] Move APScheduler job to Railway Cron (single trigger, no duplicate runs)
- [ ] Add PgBouncer/Supavisor connection pooling
- [ ] Add read replica if query load justifies it
- [ ] Review Redis usage — still Upstash or dedicated instance?
- [ ] Add structured log aggregation (Logtail, Axiom, or Datadog)

---

## Quick reference: what goes where

| Thing | Where |
|---|---|
| Why we chose X | `memory/decisions.md` |
| What's done / what's next | `memory/progress.md` |
| Reusable code patterns | `memory/patterns.md` |
| Team / stakeholder context | `memory/people.md` |
| Architecture rules | `CLAUDE.md` |
| DB schema + RLS + indexes | `supabase/migrations/` |
| Business logic | `backend/app/services/` |
| API surface | `backend/app/routers/` |
| Shared FE utilities | `frontend/src/shared/` |
| Feature UI | `frontend/src/features/[domain]/` |
