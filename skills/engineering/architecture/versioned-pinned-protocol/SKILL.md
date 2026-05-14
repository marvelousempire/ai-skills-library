---
name: versioned-pinned-protocol
id: SK-0012
keywords: [pin-version, lock-dependency, set-version]
goal: Deliver versioned pinned protocol output correctly and completely.
hash: 83c44a0
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  Design a curriculum, rubric, scoring system, or protocol where the version is pinned to each artifact that uses it. Once activated, the version row is read-only — a v2 ships as a new row. Mirrors how Stripe API versions, PostgreSQL pg_dump format versions, and ISO standards work.
trigger: >-
  Use when designing: assessment protocols, scoring rubrics, compliance frameworks, legal templates, attribute-test catalogs, anything where the protocol could change over time but each historical evaluation must remain interpretable.
---

# /versioned-pinned-protocol

## What this skill does

Emits the versioned-protocol schema shape:

```sql
CREATE TABLE assessment_protocols (
  id              BIGSERIAL PRIMARY KEY,
  slug            TEXT NOT NULL,      -- e.g. 'rpfe'
  version         TEXT NOT NULL,      -- e.g. 'v1', 'v2'
  title           TEXT NOT NULL,
  description_md  TEXT,
  drills          JSONB NOT NULL DEFAULT '[]'::jsonb,
  attributes_covered TEXT[] NOT NULL DEFAULT '{}',
  activated_at    TIMESTAMPTZ,
  deactivated_at  TIMESTAMPTZ,
  created_by      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (slug, version)
);
```

Plus the verification row pins the protocol id:

```sql
CREATE TABLE assessments (
  ...
  protocol_id  BIGINT NOT NULL REFERENCES assessment_protocols(id) ON DELETE RESTRICT,
  ...
);
```

## Rules baked into this pattern

1. **Once `activated_at IS NOT NULL`, the row is read-only** — enforced at app layer (admin edit form blocks it).
2. **Version bumps create new rows** — never edit an active row.
3. **Each artifact pins the version it was assessed against** — so historical scores remain interpretable even after v2 ships.
4. **`ON DELETE RESTRICT`** — a protocol row can't be deleted if any artifact references it.
5. **Rollover window** — admin can publish v2 alongside v1 with a documented rollover plan.

## Why this matters

Without version-pinning:
- A change to the v1 drill rubric retroactively changes the meaning of every Sound Score
- "I scored 87 on speed last year" becomes meaningless when "what does speed=87 mean" has shifted
- Disputes have no canonical reference

With version-pinning:
- v1 scores remain v1 scores forever
- v2 introduces a new version row; new assessments use v2
- Operators can compare distributions across versions
- Sports-science review pass on v2 doesn't invalidate v1 data

## Origin

Trainer-marketplace session: RPFE v1 (Ready Play Fitness Evaluation) shipped with 11 drills, one per basketball attribute. Stored in `assessment_protocols` with `version='v1'` + `activated_at=NOW()`. Future v2 will ship as a new row.

## Real-world parallels

- Stripe API versions (`Stripe-Version` header)
- Postgres pg_dump format versions
- ISO standards (ISO/IEC 18013, etc.)
- IRS form revisions (Form 1040 (2024) vs Form 1040 (2025))
