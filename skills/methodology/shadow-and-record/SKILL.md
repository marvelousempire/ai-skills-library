---
name: shadow-and-record
keywords: [audit-shadow, check-record, file-shadow]
hash: 0ba41b9
relations: []
before: []
governed_by: [global]
meta: dynamic
goal: Deliver shadow and record output correctly and completely.
description: >-
  General pattern for tracking your relationship to anything outside your
  control. Two surfaces that work together: a live shadow (auto-refreshed
  snapshot of the external thing) and a curated record (human-maintained
  ledger of how you intentionally differ). One file you read to know what
  it is right now; another you read to know what you'll never let it
  overwrite. Use whenever you need both awareness and intent persisted in
  one unified system. Triggers on "track upstream", "shadow X", "watch for
  changes", "record our deviations", "we forked / vendored / depend on X
  and want to know when it changes."
trigger: >-
  Use when there's an external source of truth you don't control (a
  forked repo, an upstream API, a vendored doc, a third-party schema, an
  inherited dataset) AND you have your own version of it that
  intentionally deviates in specific ways. Fires when the user asks
  for a way to (a) know when the external thing changes AND (b) preserve
  their conscious deviations so a future sync can't silently erase them.
  Examples: fork-divergence tracking (canonical), API contract drift
  detection, vendored-docs version watch, schema-pin + override ledger.
---

# shadow-and-record — live awareness + persisted intent in one unified system

## The metaphor (the user explanation that produced this skill)

> **Symlink** = a live pointer. Whatever the external thing is right now, we see it. No copy, no drift in the awareness layer.
>
> **Rsync** = an explicit, persisted copy/delta. What we have differs from what they have, and we keep a careful record of every difference and why.
>
> **Their hybrid baby** = a tracker that does both in one unified surface. One file you read to know what the external thing looks like right now (symlink-side: refreshed continuously) and where we consciously deviated and why (rsync-side: curated, persistent, intentional).

## The pattern in plain terms

Whenever your work has a relationship to something external — and that external thing might change while your version doesn't, OR your version intentionally differs and that intent must survive future syncs — you need two surfaces working together:

| Surface | What it gives you | Who maintains it | Refresh cadence |
|---|---|---|---|
| **Live shadow** | A current snapshot of the external thing. Updated automatically. Always answers "what is it right now?" | A scheduled job (cron, GitHub Action, watcher) | Continuous (daily / hourly / on-event) |
| **Curated record** | A human-readable ledger of every conscious deviation from the external thing, with reasons. Answers "what will we never let it overwrite?" | Humans, when shipping a deviation | Manual, on every intentional difference |

Together they form one unified system: a *shadow-and-record*. Read either file → understand the whole relationship.

## When to invoke this skill

Any time the user has one of these intent fingerprints:

- "We forked X to Y; can we shadow X so we know when X changes" *(→ canonical case: fork-divergence-tracker)*
- "Vendor Z's API changes sometimes — when does it, and what do we override locally?"
- "We have our own copy of [docs / schema / dataset] from external source; track when upstream changes but keep our edits"
- "We depend on X but configured it ourselves; preserve our config when X ships a new default"
- "Watch this thing for me but remember why we did things differently"

Every one of those is the same pattern under different domains.

## When NOT to use this skill

- The external thing is dead / abandoned — no shadow needed, no future syncs to defend against
- Your version is identical to the external thing — there's nothing to record
- The external thing is fully internal (a repo you control end-to-end) — use normal version control + plan-mode discipline
- You only need ONE surface — if you just want awareness without curated intent, a watcher is enough; if you only want a record without live awareness, a CHANGELOG entry is enough. The pattern's value is in the PAIR.

## What this skill produces (the six pieces)

When invoked, build all six. Skipping any breaks the unified surface:

1. **A live-shadow file** at the project root (or canonical doc home). Markdown. Auto-refreshed by the scheduled job. Includes: latest snapshot of the external thing's state, divergence stats, recent activity each direction. Naming convention: `<EXTERNAL>_TRACKER.md` or `<EXTERNAL>_SNAPSHOT.md`.

2. **A curated-record file** at the project root. Markdown. Human-maintained. Sections: branding/naming differences, native surface that must never be lost, the boundary of what we deliberately auto-inherit, deviations that closed, triage rules for sync events. Naming convention: `WE_DIFFER_HERE.md` or `<EXTERNAL>_DELTA.md`.

3. **A machine-readable payload** at `data/<external>-tracker.json` (or equivalent). Powers the markdown. Schema documented inline.

4. **A scheduled job** (GitHub Action / cron / watcher). Runs the shadow refresh on a regular cadence. When the shadow detects change, opens an issue/PR/notification pointing at the curated record's triage rules.

5. **A local runner script** at `scripts/<external>-shadow.sh` (or equivalent). Same logic as the scheduled job, runnable on-demand by humans. Flags: `--dry-run` (preview), `--json` (machine output only). Idempotent.

6. **Top-level documentation** — a README section explaining the symlink+rsync framing, what the two surfaces give you, and the local-run commands.

## Required sections in the curated-record file

The shadow file is mechanical (the script produces it). The curated record needs deliberate human curation. Every shadow-and-record implementation must include these sections in the curated record:

| Section | Purpose |
|---|---|
| **Branding/naming/identity differences** | Where we use different names than the external thing. Aspirational vs current state. |
| **Native surface — must not be lost** | The deviations that are nephew-only features (or local-only docs, or our-only schema). These MUST be preserved on every future sync from the external thing. |
| **Auto-inherit boundary** | What we deliberately pass through to the external thing. Changes in the external auto-flow into our version. No cherry-pick needed. |
| **Closed deviations** | Deviations the external thing absorbed (or that we abandoned). Each row: date closed + reason. |
| **Triage rules for sync events** | The procedure a human (or agent) follows when the live shadow reports a change. Concrete steps: cherry-pick / skip / record / preserve. |

## Anti-patterns this skill blocks

- **One surface only.** If you only ship the shadow, you'll lose intent on the next sync. If you only ship the record, you won't know when to sync. Both, always.
- **Auto-refreshing the curated record.** Humans curate it. The scheduled job touches the shadow only.
- **Conflating "deviation" with "stale."** A deviation is intentional. Stale is "we forgot to sync." The curated record only documents the former; the live shadow exposes the latter.
- **Silent acceptance of upstream changes.** When the shadow detects upstream change, the scheduled job must open a notification (issue / PR / Slack ping) — not just commit and move on. Awareness without action surface = invisible work.
- **Copying the external thing's content.** The live shadow is a *pointer*, not a vendor. Per `rules/library/add-agent-to-skills-library/body.md` (pointer-not-replica), the shadow references the external thing's git state / API version / version-tag, not its source.

## Related skills + rules

- **Skill:** [`fork-divergence-tracker`](../fork-divergence-tracker/SKILL.md) — the canonical instance of this pattern, applied to forks of git repos. Use when the external thing is an upstream git repo and yours is a fork.
- **Rule:** [`rules/library/add-agent-to-skills-library/body.md`](../../../rules/library/add-agent-to-skills-library/body.md) — pointer-not-replica. The shadow must be a pointer, not a copy.
- **Rule:** [`rules/library/plugin-economy/body.md`](../../../rules/library/plugin-economy/body.md) — documented dependencies. If the external thing is a package, both the shadow file AND the relevant agent's spec must declare it.
- **Skill:** [`cross-reference-rippling`](../cross-reference-rippling/SKILL.md) — when you ship a new deviation, ripple the cross-references downstream.

## Reference implementation

The canonical instance is `marvelousempire/nephew` shadowing `ruvnet/ruflo`:

- Live shadow: [`UPSTREAM_TRACKER.md`](https://github.com/marvelousempire/nephew/blob/main/UPSTREAM_TRACKER.md)
- Curated record: [`WE_DIFFER_HERE.md`](https://github.com/marvelousempire/nephew/blob/main/WE_DIFFER_HERE.md)
- Machine payload: [`data/upstream-tracker.json`](https://github.com/marvelousempire/nephew/blob/main/data/upstream-tracker.json)
- Scheduled job: [`.github/workflows/upstream-tracker.yml`](https://github.com/marvelousempire/nephew/blob/main/.github/workflows/upstream-tracker.yml)
- Local runner: [`scripts/track-upstream.sh`](https://github.com/marvelousempire/nephew/blob/main/scripts/track-upstream.sh)
- README section: see [`README.md` §"Upstream"](https://github.com/marvelousempire/nephew/blob/main/README.md#upstream)

If you're applying this pattern to a different domain — API contract tracking, vendored docs, schema mirroring — model your file layout on the nephew implementation but adapt the divergence stats to your domain (e.g., for an API, "fields differing" + "breaking-change count" replaces "files differing" + "lines added/removed").

## Origin

The metaphor surfaced during the 2026-05-14 brokerage-make-shim-docker-colima session when discussing how nephew should relate to upstream Ruflo. The user framed it precisely: "Symlink and rsync had a hybrid baby that met the needs of both in one unified way." That framing became `fork-divergence-tracker` (the specific implementation) and now this skill (the general pattern).

Recorded as a separate skill from `fork-divergence-tracker` because the pattern is more general than forks — anywhere two related-but-not-identical things need both awareness and intent, this is the shape.
