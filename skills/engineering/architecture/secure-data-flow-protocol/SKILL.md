---
name: secure-data-flow-protocol
id: SK-0009
keywords: [secure-flow, encrypt-data, validate-transfer]
goal: Deliver secure data flow protocol output correctly and completely.
hash: 4aeed7c
relations: []
before: []
governed_by: [global]
meta: dynamic
description: >-
  Walk the 8-question checklist for any new field that flows iOS → API → DB → API → reader. Catches the "doesn't show up everywhere" gap. Adopted from red-e-play's Plan-Secure-Data-Flow-Protocol after 5 back-to-back PRs hit the same root cause.
trigger: >-
  Use when adding ANY new field to a player/user model — name, phone, attribute, status, badge, anything that should appear on iOS + admin + public web. Also fires when a "iOS edit doesn't show on admin/web" bug is reported.
---

# /secure-data-flow-protocol

## What this skill does

Walks the 8-question pipeline-closure checklist:

1. **Schema** — Postgres column or table exists?
2. **Write allowlist** — backend write endpoint accepts the field?
3. **Read serializers symmetric** — `rowToPlayer` + `formatPlayer` + `rowToPublicProfile` all return it?
4. **Admin renders** — admin player-detail page shows the field?
5. **Public profile correctly includes/excludes** — privacy semantics correct?
6. **iOS save awaits server response** — no fire-and-forget that leaves local state divergent?
7. **No local-only store needs drain** — if there's local persistence, is it pushed to the API?
8. **Audit log** — does `recordAudit` (or equivalent) capture the change?

For each question, the skill greps the relevant files and reports ✅ / 🔜 / ❌ with the file path.

## How to invoke

```
/secure-data-flow-protocol <field-name>
```

Or, more naturally, when adding a field:

> "Walk the SDF checklist for the new 'background_check_status' column."

## Common gaps caught

- Schema column exists but `rowToPublicProfile` silently drops it
- Backend write accepts it but iOS doesn't `PUT` it
- iOS persists locally but no sync drains it
- Admin doesn't render it (operators can't see it)
- Public profile leaks a private field (or hides a public one)

## Origin

Adopted from red-e-play's `docs/Plan-Secure-Data-Flow-Protocol.md` (Section 3 checklist). That doc itself was written after the bug fired 5 times in a row (PRs #641 / #654 / #656 / #657 / #659). This skill makes the checklist invocable.

## Related

- [`rules/library/feature-ledger-first`](../../../rules/library/feature-ledger-first/body.md)
- Pain Journal `Data-1` in red-e-play's CLAUDE.md
