-- NNNN_<descriptive_slug>.sql
--
-- <One-paragraph purpose>
--
-- Tables introduced:
--   • table_a — <purpose>
--   • table_b — <purpose>
--
-- What is INTENTIONALLY NOT here (registered features, future PRs):
--   • <thing 1>
--   • <thing 2>
--
-- Feature ledger flips: features <list> all flip 'next' → 'partial'.
--
-- Idempotent. Safe to re-run.

-- ── 0. Enum extensions (OUTSIDE the main BEGIN/COMMIT block) ──────────────
-- ALTER TYPE ADD VALUE has historical pg restrictions; safer outside the
-- transaction wrapper. Mirrors how 0056_credit_ledger_kinds.sql ships.

ALTER TYPE my_enum ADD VALUE IF NOT EXISTS 'value_1';

BEGIN;

-- ── 1. <Section name> ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS table_a (
  id           BIGSERIAL PRIMARY KEY,
  player_id    UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
              -- ⚠️  players.id is UUID. Always grep parent type before declaring FK column.
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_table_a_player ON table_a (player_id);

-- ── 2. Triggers (reuse existing function) ─────────────────────────────────

DROP TRIGGER IF EXISTS trg_table_a_updated_at ON table_a;
CREATE TRIGGER trg_table_a_updated_at
  BEFORE UPDATE ON table_a
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── 3. Status flips ───────────────────────────────────────────────────────

UPDATE features SET status = 'partial' WHERE id IN ('NNN', 'NNN+1') AND status = 'next';

INSERT INTO feature_changes (feature_id, kind, body_md, status_from, status_to, author)
SELECT
  id, 'status_change',
  'Schema foundation landed via migration NNNN.',
  'next', 'partial', 'migration:NNNN'
FROM features
WHERE id IN ('NNN', 'NNN+1') AND status = 'partial'
  AND NOT EXISTS (
    SELECT 1 FROM feature_changes
    WHERE feature_changes.feature_id = features.id
      AND feature_changes.author = 'migration:NNNN'
  );

COMMIT;
