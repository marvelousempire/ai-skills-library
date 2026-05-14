-- NNNN_seed_<plan-slug>_plan.sql
--
-- Registers the <Plan Name> plan + N feature rows in the admin ledger
-- (CLAUDE.md "every feature is a product — log it in the admin ledger
-- BEFORE you start coding").
--
-- Background: <one paragraph why this plan exists>
--
-- Adjacent / not superseded: <list adjacent plans/features that stay 'next'>
--
-- See docs/Plan-<Name>.md for the long-form spec including consensus rules,
-- anti-fraud design, platform-fee math, and out-of-scope items.
--
-- Feature ID range: <min>–<max> (<N> features). <Highest prior claim>
-- was on the <prior-plan>; this range sits comfortably above all current
-- claims per Pain Journal Migration-1's "pick IDs above the current prod
-- max" guidance.
--
-- Idempotent. Safe to re-run.

INSERT INTO plans (id, name, status, summary_md, why_it_matters_md, owner, is_public)
VALUES (
  '<plan-slug>',
  '<Plan Name>',
  'active',
  '<summary>',
  '<why it matters>',
  'claude:<branch>',
  TRUE   -- IMPORTANT: defaults FALSE per migration 0093; set TRUE explicitly
)
ON CONFLICT (id) DO UPDATE
SET name             = EXCLUDED.name,
    status           = EXCLUDED.status,
    summary_md       = EXCLUDED.summary_md,
    why_it_matters_md = EXCLUDED.why_it_matters_md,
    is_public        = EXCLUDED.is_public;

-- ── <Section A> features (N) ─────────────────────────────────────────────
-- section_idx X → display_order X000+numeric_id

INSERT INTO features (
    id, name, section, description_md, why_it_matters_md,
    status, is_mvp, display_order, owner, created_by
) VALUES
('NNN',
 '<Feature name>',
 '<Section name>',  -- must be in features.section CHECK constraint
 '<Description>',
 '<Why it matters>',
 'next', FALSE, <display_order>, 'plan:<plan-slug>', 'claude:<plan-slug>'),

('NNN+1', ...)

ON CONFLICT (id) DO NOTHING;

-- ── Surfaces ─────────────────────────────────────────────────────────────

INSERT INTO feature_surfaces (feature_id, surface) VALUES
  ('NNN', 'backend'), ('NNN', 'admin'),
  ('NNN+1', 'ios'), ...
ON CONFLICT (feature_id, surface) DO NOTHING;

-- ── Plan ↔ Features linkage ──────────────────────────────────────────────

INSERT INTO plan_features (plan_id, feature_id, position) VALUES
  ('<plan-slug>', 'NNN', <position>),
  ('<plan-slug>', 'NNN+1', <position>)
ON CONFLICT (plan_id, feature_id) DO NOTHING;

-- ── Bootstrap change-log entry per feature (one-time, marks the seed) ────

INSERT INTO feature_changes (feature_id, kind, body_md, status_to, author)
SELECT
    id,
    'note',
    'Seeded via migration NNNN_seed_<plan-slug>_plan.sql. See docs/Plan-<Name>.md for the long-form spec.',
    status,
    'migration:NNNN'
FROM features
WHERE id BETWEEN '<min>' AND '<max>'
  AND NOT EXISTS (
    SELECT 1 FROM feature_changes
    WHERE feature_changes.feature_id = features.id
      AND feature_changes.author = 'migration:NNNN'
  );
