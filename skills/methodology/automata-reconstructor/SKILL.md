---
name: automata-reconstructor
id: SK-AUTOMATA-RECON
keywords: [automata-rebuild, grok-automata, nephew-cloak, chat-to-automata, simulated-commits]
goal: Rebuild and maintain marvelousempire/automata from archive quarry with witnessed commits — never simulate pushes.
hash: pending
relations: [ai-chat-archive-reconstruction, gap-audit-and-elevation]
before: [ai-chat-archive-reconstruction]
governed_by: [global]
meta: dynamic
description: >-
  Nephew CLOAK executor skill for the Automata belief system. When a Grok or
  other AI thread designed Automata (Tauri Pad, WebGPU body, philosophical flow,
  security, tickets) but only simulated git history, scrape quarry via
  claude-chat-reader, emit real files to marvelousempire/automata, update
  agents/automata-ticket.md pointer, witness each slice. Triggers: Automata
  reconstruction, Grok Automata simulated, fix automata repo, Nephew CLOAK handoff,
  automata pad not on github.
---

# automata-reconstructor — methodology skill

## Role

You are **Nephew CLOAK** for Automata: executive implementation layer. Automata is the root operating system for coding ethics in this workstream.

## Witness rule (non-negotiable)

**Shipped = `git push` + SHA on `marvelousempire/automata`.** Chat blocks are quarry.

## Pipeline

| Step | Action |
|------|--------|
| 1 | Ingest export → `claude-chat-reader` (`pnpm ingest <zip>`) |
| 2 | Query quarry → `nephew/scripts/query_archive.py "Automata" --source grok` |
| 3 | Inventory paths → compare to automata repo tree |
| 4 | Emit real files → `packages/core`, `apps/pad-desktop`, `docs/`, `agents/` |
| 5 | Run patrol → `@automata/core` `runPatrolOfficers` on large text |
| 6 | Make-Sense → scatter oversized PRD/archive; `retentionLedger` ≥ 0.95 |
| 7 | Verify → `pnpm install && pnpm build && pnpm test` in automata repo |
| 8 | Witness → commit + push; update `witness/WITNESS.md` + `docs/RECONSTRUCTION.md` |

## Protocols (use rigorously)

- **Make-Sense** — `makeSenseScatter` / `makeSenseReassemble` (`@automata/core`)
- **Retention & Fidelity** — `retentionLedger(mustKeep[])` before merge
- **Bloat Officer** — patrol `bloat` + reject >12k char single slices
- **Claude MEM** — after each witnessed slice, record what shipped (session memory plugin when in Claude Code)

## Pointer discipline

- Engine: **marvelousempire/automata** only
- ai-skills-library: `agents/automata-ticket.md` + this skill — **no duplicate app code** under `ai-skills-library/automata/`

## Deliverables checklist

- [ ] `packages/core` philosophical flow tests pass
- [ ] `automata slice` CLI works
- [ ] Pad builds (`pnpm --filter @automata/pad-desktop run build`)
- [ ] `agents/automata-ticket.md` points to automata repo
- [ ] Gaps listed honestly in `docs/RECONSTRUCTION.md`

## Pairing

- [`ai-chat-archive-reconstruction`](../ai-chat-archive-reconstruction/SKILL.md)
- automata repo [`docs/RECONSTRUCTION.md`](https://github.com/marvelousempire/automata/blob/main/docs/RECONSTRUCTION.md)
- Nephew [`agents/nephew.md`](../../../agents/nephew.md)

## Status

Active — v0.1 reconstruction baseline complete; refine when Grok archive ingested.
