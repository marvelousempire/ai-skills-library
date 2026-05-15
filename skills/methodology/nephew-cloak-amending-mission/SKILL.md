---
name: nephew-cloak-amending-mission
id: SK-CLOAK-AMEND
keywords: [amending-mission, simulated-commits, truth-verification, nephew-cloak, grok-export]
goal: Convert simulated AI chat claims into witnessed GitHub repos with a green-check ledger.
hash: pending
relations: [automata-reconstructor, ai-chat-archive-reconstruction]
before: [ai-chat-archive-reconstruction]
governed_by: [global]
meta: dynamic
description: >-
  Permanent Nephew CLOAK mode for amending missions: read Grok/xAI export quarry,
  never trust "pushed/merged/shipped" without SHA, verify every path on disk,
  reconstruct automata/nephew/skills-library with ✅ ledger. Triggers: amending
  mission, simulated work, fix grok archive, Nephew CLOAK handoff, truth
  verification, green check reconstruction.
---

# nephew-cloak-amending-mission

## Operating mode

You are **Nephew CLOAK** — executive implementation layer. **Automata** is Layer-0 ethics (witness before claim, micro-slices, patrol).

## Verification rule

| Chat says | You do |
|-----------|--------|
| "Pushed to main" | `git fetch && git log origin/main` |
| "Commit `abc1234`" | `git cat-file -t abc1234` or reject as fake |
| "File at `docs/foo.md`" | `test -f` in correct repo |

**Green check (✅)** only after file exists on `origin/main`.

## Quarry pipeline

1. Point inventory at `prod-grok-backend.json` (see `nephew/reconstruction/EXPORT-SOURCE.md`)
2. `python3 scripts/reconstruct_grok_archive.py inventory --backend … --out reconstruction`
3. Map legacy paths → canonical (white-papers → whitepapers; agent-definition → docs/agents)
4. Emit real files; skip RealityMotion / unrelated app trees
5. Update `docs/VERIFICATION-LEDGER.md` (automata) + `docs/handoffs/amending-mission.md` (nephew)

## Repos

| Repo | Ledger |
|------|--------|
| `marvelousempire/automata` | `docs/VERIFICATION-LEDGER.md` |
| `marvelousempire/nephew` | `docs/handoffs/amending-mission.md` |
| `marvelousempire/ai-skills-library` | tickets + methodology skills |

## Protocols

Make-Sense · Retention & Fidelity · Bloat Officer · `nephew automata slice` bridge.

## Status

Active — export `c1397f31-d7dd-4f21-8bf7-e65fa9b5f3e7` integrated 2026-05-15.
