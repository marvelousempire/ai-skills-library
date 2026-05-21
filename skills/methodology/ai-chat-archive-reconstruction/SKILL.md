---
name: ai-chat-archive-reconstruction
id: SK-ARCH-RECON
keywords: [audit-chat, check-archive, build-reconstruction]
goal: Rebuild a target repo from ingested AI chat exports with witnessed git commits — never claim push without SHA.
hash: pending
relations: [gap-audit-and-elevation, plan-first, nephew-cloak-amending-mission]
before: []
governed_by: [global]
meta: dynamic
description: "Corrective reconstruction when an AI (Grok, ChatGPT, etc.) simulated git pushes but work lived only in chat. Ingest export into claude-chat-reader, run Nephew's reconstruct_grok_archive.py, emit meta-library + docs, commit witnessed slices to marvelousempire/nephew. Triggers: Grok archive, simulated commits, rebuild nephew from chat, archive reconstruction."
---

# ai-chat-archive-reconstruction — methodology skill

## When to use

- Long AI thread claimed files/commits that **never landed on GitHub**
- Official **xAI / Grok data export ZIP** or similar JSON archive
- **claude-chat-reader** already ingested the export (`source = 'grok'`)
- Rebuilding **Nephew CLOAK** doctrine, whitepapers, agents, meta-library

## Witness rule (non-negotiable)

**Shipped = `git push` + real SHA on `origin/main`.** Chat, fake short hashes, and “I pushed” language are **quarry only**.

## Toolchain

| Step | Command |
|------|---------|
| 1. Ingest | `cd claude-chat-reader && pnpm ingest ~/Downloads/grok-export.zip` |
| 2. Inventory | `cd nephew && python3 scripts/reconstruct_grok_archive.py inventory --backend <path-to-prod-grok-backend.json> --out reconstruction` |
| 3. Meta-library | `python3 scripts/reconstruct_grok_archive.py emit-meta --backend <same> --out docs/meta-library` |
| 4. Curate | `python3 scripts/reconstruct_grok_archive.py curate --root docs/meta-library` (strip simulated commits) |
| 5. Stubs (optional) | `python3 scripts/reconstruct_grok_archive.py emit-stubs --manifest reconstruction/manifest.json` |
| 6. Quarry search | `python3 scripts/query_archive.py "Witness AND Bloat" --source grok` |
| 7. CI verify | `bash scripts/ci/fidelity-check.sh` && `bash scripts/ci/bloat-officer-scan.sh` |
| 8. Witness | `git add … && git commit && git push` — one slice per phase |

Script lives in **[marvelousempire/nephew](https://github.com/marvelousempire/nephew)** → `scripts/reconstruct_grok_archive.py`.

Audit doc: `docs/handoffs/grok-archive-reconstruction.md`.

## Make-Sense micro-slices

1. **Inventory** — conversations, paths, components, simulation-claim count  
2. **Path normalize** — `docs/white-papers/` → `docs/whitepapers/`; do not duplicate legacy tree  
3. **Extract** — user vs assistant ledger; richest assistant block per target path  
4. **Emit** — meta-library first, then explainers/rules, then agent code (separate phases)  
5. **Catalog** — update `docs/catalog.md` status only when content is real  

## Out of scope

- RealityMotion / unrelated app `src/` from mixed archive threads  
- Claiming **running** engines when only **draft** specs exist — mark catalog honestly  

## Pairing

- Nephew SOP: `docs/standing-operating-procedures.md`  
- Phase 1 audit: `docs/handoffs/grok-archive-reconstruction.md`  
- Retention: claude-mem + meta-library entries after each witnessed slice  

## Status

Active. Body grows as reconstruction phases complete.
