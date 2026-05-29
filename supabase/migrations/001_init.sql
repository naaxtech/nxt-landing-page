-- =====================================================================
-- YES Template — Initial Database Schema
-- Migration: 001_init
-- Created: 2026-05-29
-- =====================================================================
-- Infrastructure layer only: multi-tenancy, auth, audit, async jobs,
-- API keys, notifications.
-- Domain tables (the actual feature your app builds) go in 002_*.sql.
--
-- Every table follows this pattern — no exceptions:
--   1. CREATE TABLE with org_id FK, NOT NULL constraints, updated_at
--   2. CREATE INDEX — FK columns + hot query composites + partial indexes
--   3. CREATE TRIGGER for updated_at (where applicable)
--   4. [After all tables] CREATE helper functions
--   5. ALTER TABLE ENABLE ROW LEVEL SECURITY
--   6. CREATE POLICY — separate per operation (SELECT/INSERT/UPDATE/DELETE)
--   7. GRANT EXECUTE on helper functions
-- =====================================================================


-- =====================================================================
-- SECTION 1: EXTENSIONS
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- =====================================================================
-- SECTION 2: UTILITY TRIGGER FUNCTION
-- =====================================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


-- =====================================================================
-- SECTION 3: TABLE DEFINITIONS + INDEXES + TRIGGERS
-- RLS is enabled later (after helper functions are defined).
-- =====================================================================

-- ------------------------------------------------------------------
-- organizations — tenant root
-- ------------------------------------------------------------------
CREATE TABLE organizations (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text        NOT NULL,
  slug                text        NOT NULL,
  tier                text        NOT NULL DEFAULT 'free'
                                  CHECK (tier IN ('free','starter','pro','enterprise')),
  stripe_customer_id  text,
  settings            jsonb       NOT NULL DEFAULT '{}',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- slug must be unique and fast to look up (URL routing)
CREATE UNIQUE INDEX organizations_slug_idx    ON organizations(slug);
-- Partial: only rows that have a Stripe customer
CREATE        INDEX organizations_stripe_idx  ON organizations(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE TRIGGER trg_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ------------------------------------------------------------------
-- members — links auth.users to an org with a role
-- ------------------------------------------------------------------
CREATE TABLE members (
  id          uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id      uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  role        text        NOT NULL DEFAULT 'viewer'
                          CHECK (role IN ('owner','admin','viewer')),
  full_name   text,
  email       text        NOT NULL,
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX members_org_id_idx   ON members(org_id);
CREATE INDEX members_email_idx    ON members(email);
-- Composite: used by role guards and team management queries
CREATE INDEX members_org_role_idx ON members(org_id, role);

CREATE TRIGGER trg_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ------------------------------------------------------------------
-- invitations — pending team invites (token accepted via backend)
-- ------------------------------------------------------------------
CREATE TABLE invitations (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email       text        NOT NULL,
  role        text        NOT NULL DEFAULT 'viewer'
                          CHECK (role IN ('owner','admin','viewer')),
  -- 64-char hex token generated at insert; requires pgcrypto extension
  token       text        NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  invited_by  uuid        REFERENCES members(id) ON DELETE SET NULL,
  expires_at  timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Token must be globally unique (used as a secret URL param)
CREATE UNIQUE INDEX invitations_token_idx       ON invitations(token);
CREATE        INDEX invitations_org_id_idx      ON invitations(org_id);
-- "Has this email already been invited to this org?"
CREATE        INDEX invitations_email_org_idx   ON invitations(email, org_id);
-- Partial: only pending invites (the common read path)
CREATE        INDEX invitations_org_pending_idx ON invitations(org_id)
  WHERE accepted_at IS NULL;

CREATE TRIGGER trg_invitations_updated_at
  BEFORE UPDATE ON invitations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ------------------------------------------------------------------
-- audit_logs — immutable compliance trail
-- No updated_at: rows are append-only by policy (no UPDATE/DELETE allowed).
-- ------------------------------------------------------------------
CREATE TABLE audit_logs (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id         uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_id       uuid        REFERENCES members(id) ON DELETE SET NULL,
  action         text        NOT NULL,
  resource_type  text,
  resource_id    uuid,
  metadata       jsonb       NOT NULL DEFAULT '{}',
  ip_address     inet,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Most common query: all events for an org in reverse time order
CREATE INDEX audit_logs_org_created_idx ON audit_logs(org_id, created_at DESC);
CREATE INDEX audit_logs_actor_id_idx    ON audit_logs(actor_id);
-- "Show history for this resource"
CREATE INDEX audit_logs_resource_idx    ON audit_logs(resource_type, resource_id);


-- ------------------------------------------------------------------
-- jobs — async background job tracking (LangGraph pipelines)
-- Written exclusively by service_role (backend workers, not users).
-- ------------------------------------------------------------------
CREATE TABLE jobs (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by    uuid        REFERENCES members(id) ON DELETE SET NULL,
  type          text        NOT NULL,
  status        text        NOT NULL DEFAULT 'queued'
                            CHECK (status IN ('queued','running','completed','failed')),
  input         jsonb       NOT NULL DEFAULT '{}',
  output        jsonb,
  error         text,
  started_at    timestamptz,
  completed_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX jobs_org_id_idx      ON jobs(org_id);
CREATE INDEX jobs_created_by_idx  ON jobs(created_by);
-- "Show my active jobs" — most common dashboard query
CREATE INDEX jobs_org_status_idx  ON jobs(org_id, status);
-- Partial: used by lifespan startup stuck-job recovery scan
CREATE INDEX jobs_stuck_idx       ON jobs(status, created_at)
  WHERE status IN ('queued','running');

CREATE TRIGGER trg_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ------------------------------------------------------------------
-- api_keys — programmatic access (pro/enterprise tier)
-- key_hash: SHA-256 of the full key (never store plaintext).
-- key_prefix: first 8 chars for safe display in the UI.
-- ------------------------------------------------------------------
CREATE TABLE api_keys (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id        uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  created_by    uuid        REFERENCES members(id) ON DELETE SET NULL,
  name          text        NOT NULL,
  key_hash      text        NOT NULL,
  key_prefix    text        NOT NULL,
  is_active     boolean     NOT NULL DEFAULT true,
  rate_limit    integer     NOT NULL DEFAULT 1000,
  last_used_at  timestamptz,
  expires_at    timestamptz,
  revoked_at    timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Lookup by hash during API authentication (hot path)
CREATE UNIQUE INDEX api_keys_key_hash_idx   ON api_keys(key_hash);
CREATE        INDEX api_keys_org_id_idx     ON api_keys(org_id);
-- "List active keys for this org"
CREATE        INDEX api_keys_org_active_idx ON api_keys(org_id, is_active);

CREATE TRIGGER trg_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ------------------------------------------------------------------
-- notifications — in-app inbox (per-user, org-scoped)
-- No updated_at: read_at is the only mutable field; a dedicated column
-- is cleaner than a generic updated_at here.
-- ------------------------------------------------------------------
CREATE TABLE notifications (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid        NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  type        text        NOT NULL,
  title       text        NOT NULL,
  body        text,
  metadata    jsonb       NOT NULL DEFAULT '{}',
  read_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX notifications_user_id_idx  ON notifications(user_id);
CREATE INDEX notifications_org_id_idx   ON notifications(org_id);
-- Partial: unread badge count and inbox queries (extremely hot path)
CREATE INDEX notifications_unread_idx   ON notifications(user_id, created_at DESC)
  WHERE read_at IS NULL;


-- =====================================================================
-- SECTION 4: RLS HELPER FUNCTIONS
-- Defined after tables (they reference members) but before policies
-- (policies call them at query evaluation time).
-- SECURITY DEFINER: bypass RLS when reading members to avoid circular dep.
-- STABLE: allows Postgres to call once per query instead of per row.
-- =====================================================================

CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT org_id FROM members WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT role FROM members WHERE id = auth.uid() LIMIT 1;
$$;


-- =====================================================================
-- SECTION 5: ENABLE ROW LEVEL SECURITY
-- =====================================================================

ALTER TABLE organizations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE members        ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys       ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;


-- =====================================================================
-- SECTION 6: RLS POLICIES
-- One policy per operation per table.
-- Roles: owner > admin > viewer.
-- System writes use service_role (bypasses RLS entirely).
-- =====================================================================

-- ------------------------------------------------------------------
-- organizations
-- ------------------------------------------------------------------
-- Any authenticated user may create an org (onboarding flow creates it before member row exists)
CREATE POLICY organizations_select ON organizations FOR SELECT TO authenticated
  USING (id = get_user_org_id());

CREATE POLICY organizations_insert ON organizations FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY organizations_update ON organizations FOR UPDATE TO authenticated
  USING    (id = get_user_org_id() AND get_user_role() IN ('owner','admin'))
  WITH CHECK (id = get_user_org_id() AND get_user_role() IN ('owner','admin'));

CREATE POLICY organizations_delete ON organizations FOR DELETE TO authenticated
  USING (id = get_user_org_id() AND get_user_role() = 'owner');


-- ------------------------------------------------------------------
-- members
-- ------------------------------------------------------------------
CREATE POLICY members_select ON members FOR SELECT TO authenticated
  USING (org_id = get_user_org_id());

CREATE POLICY members_insert ON members FOR INSERT TO authenticated
  WITH CHECK (org_id = get_user_org_id() AND get_user_role() IN ('owner','admin'));

CREATE POLICY members_update ON members FOR UPDATE TO authenticated
  USING    (org_id = get_user_org_id() AND get_user_role() IN ('owner','admin'))
  WITH CHECK (org_id = get_user_org_id() AND get_user_role() IN ('owner','admin'));

-- Owner cannot delete themselves (guards against locking out the last owner)
CREATE POLICY members_delete ON members FOR DELETE TO authenticated
  USING (
    org_id = get_user_org_id()
    AND get_user_role() = 'owner'
    AND id != auth.uid()
  );


-- ------------------------------------------------------------------
-- invitations
-- Token validation for the accept flow goes through the backend
-- (service_role) — no anon policy needed here.
-- ------------------------------------------------------------------
CREATE POLICY invitations_select ON invitations FOR SELECT TO authenticated
  USING (org_id = get_user_org_id());

CREATE POLICY invitations_insert ON invitations FOR INSERT TO authenticated
  WITH CHECK (org_id = get_user_org_id() AND get_user_role() IN ('owner','admin'));

CREATE POLICY invitations_update ON invitations FOR UPDATE TO authenticated
  USING    (org_id = get_user_org_id() AND get_user_role() IN ('owner','admin'))
  WITH CHECK (org_id = get_user_org_id() AND get_user_role() IN ('owner','admin'));

CREATE POLICY invitations_delete ON invitations FOR DELETE TO authenticated
  USING (org_id = get_user_org_id() AND get_user_role() IN ('owner','admin'));


-- ------------------------------------------------------------------
-- audit_logs — read-only for org members; service_role appends only
-- No UPDATE or DELETE policy: rows are permanently immutable.
-- ------------------------------------------------------------------
CREATE POLICY audit_logs_select ON audit_logs FOR SELECT TO authenticated
  USING (org_id = get_user_org_id());

CREATE POLICY audit_logs_insert ON audit_logs FOR INSERT TO service_role
  WITH CHECK (true);


-- ------------------------------------------------------------------
-- jobs — org members read; service_role controls the full lifecycle
-- ------------------------------------------------------------------
CREATE POLICY jobs_select ON jobs FOR SELECT TO authenticated
  USING (org_id = get_user_org_id());

CREATE POLICY jobs_insert ON jobs FOR INSERT TO service_role
  WITH CHECK (true);

CREATE POLICY jobs_update ON jobs FOR UPDATE TO service_role
  USING (true) WITH CHECK (true);

-- Owner can hard-delete completed/failed jobs for housekeeping
CREATE POLICY jobs_delete ON jobs FOR DELETE TO authenticated
  USING (org_id = get_user_org_id() AND get_user_role() = 'owner');

-- Service role can delete for automated retention/cleanup jobs
CREATE POLICY jobs_delete_service ON jobs FOR DELETE TO service_role
  USING (true);


-- ------------------------------------------------------------------
-- api_keys — owner/admin only (viewers must not see key metadata)
-- ------------------------------------------------------------------
CREATE POLICY api_keys_select ON api_keys FOR SELECT TO authenticated
  USING (org_id = get_user_org_id() AND get_user_role() IN ('owner','admin'));

CREATE POLICY api_keys_insert ON api_keys FOR INSERT TO authenticated
  WITH CHECK (org_id = get_user_org_id() AND get_user_role() IN ('owner','admin'));

CREATE POLICY api_keys_update ON api_keys FOR UPDATE TO authenticated
  USING    (org_id = get_user_org_id() AND get_user_role() IN ('owner','admin'))
  WITH CHECK (org_id = get_user_org_id() AND get_user_role() IN ('owner','admin'));

CREATE POLICY api_keys_delete ON api_keys FOR DELETE TO authenticated
  USING (org_id = get_user_org_id() AND get_user_role() = 'owner');


-- ------------------------------------------------------------------
-- notifications — each user sees only their own; service_role creates them
-- ------------------------------------------------------------------
CREATE POLICY notifications_select ON notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid() AND org_id = get_user_org_id());

CREATE POLICY notifications_insert ON notifications FOR INSERT TO service_role
  WITH CHECK (true);

-- Users can only mark their own notifications as read
CREATE POLICY notifications_update ON notifications FOR UPDATE TO authenticated
  USING    (user_id = auth.uid() AND org_id = get_user_org_id())
  WITH CHECK (user_id = auth.uid() AND org_id = get_user_org_id());

CREATE POLICY notifications_delete ON notifications FOR DELETE TO authenticated
  USING (user_id = auth.uid() AND org_id = get_user_org_id());


-- =====================================================================
-- SECTION 7: GRANTS
-- Required: authenticated role cannot call SECURITY DEFINER functions
-- without an explicit GRANT, even though RLS policies reference them.
-- =====================================================================

GRANT EXECUTE ON FUNCTION get_user_org_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role()   TO authenticated;


-- =====================================================================
-- END OF MIGRATION 001_init
-- Next: add your domain tables in 002_[feature].sql following this
-- exact pattern: table → indexes → trigger → RLS enable → policies.
-- =====================================================================
