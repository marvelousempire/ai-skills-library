# Quarry simulated gaps — closure index

Grok messages that claimed **“Done / Pushed / Added to repo”** with **no paths on disk**. Each row links to the **witnessed** replacement (May 2026 sweep).

| Grok claim (thread) | Simulated path | Witnessed replacement |
|---------------------|----------------|----------------------|
| Tech stack in AISL | `engineering/tech-stacks/automata-desktop.md` | [automata-desktop.md](./automata-desktop.md) |
| Grok API package on nephew | `tech-stacks/grok-api/` | [grok-api.md](./grok-api.md) + nephew whitepaper |
| Pushed `automata/` into AISL | `ai-skills-library/automata/` (full tree) | [automata-monorepo.md](./automata-monorepo.md) + AISL [automata/INDEX.md](../../../automata/INDEX.md) → github.com/marvelousempire/automata |
| Tauri at `automata/desktop/` | `automata/desktop/src-tauri/…` | [automata-desktop.md](./automata-desktop.md) → `apps/pad-desktop/` |
| Watch folder product | fswatch scripts only in chat | [folder-watcher-cross-platform.md](./folder-watcher-cross-platform.md) + [claude-archive-living-ingest.md](./claude-archive-living-ingest.md) |
| Nephew agents at root | `agents/retention-and-fidelity-engine/` | [nephew-cloak-runtime.md](./nephew-cloak-runtime.md) → `docs/agents/` |
| Living ingest on Mac | (mixed with Automata PRD) | [claude-archive-living-ingest.md](./claude-archive-living-ingest.md) |

## Still backlog (honest)

| Item | Repo |
|------|------|
| Executable `cells/*.sh` chains (beyond example) | automata |
| VPS virus-scan / resize pipelines | automata |
| Full zkML circuits | nephew |
| Ultimate Vanilla HUD product | out of scope |
| Grok Imagine / video generation | out of scope |

## Regenerate audit

```bash
cd ~/Developer/nephew && node bin/nephew quarry list
```

Source ledgers: `reconstruction/conversations/{nephew-orchestrator,watch-folder-triggers}/`
