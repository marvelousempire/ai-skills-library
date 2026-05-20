# Tech stacks (engineering reference)

Canonical stack docs for shipped repos. **Not** skills — use these when bootstrapping or auditing a product surface.

| Doc | Repo | Stack |
|-----|------|--------|
| [automata-desktop.md](./automata-desktop.md) | [automata](https://github.com/marvelousempire/automata) | Tauri 2 + Vite + React 19 + WebGPU |
| [automata-monorepo.md](./automata-monorepo.md) | automata | core, CLI, watcher, `automation/` tree |
| [claude-archive-living-ingest.md](./claude-archive-living-ingest.md) | [claude-chat-reader](https://github.com/marvelousempire/claude-chat-reader) | `pnpm watch`, `pnpm harvest` |
| [claude-archive-ui-patterns.md](./claude-archive-ui-patterns.md) | claude-chat-reader | Conversations list, Docker dev, SK-0141 |
| [folder-watcher-cross-platform.md](./folder-watcher-cross-platform.md) | ccr + automata | fswatch, LaunchAgent, WireGuard/rsync |
| [nephew-cloak-runtime.md](./nephew-cloak-runtime.md) | [nephew](https://github.com/marvelousempire/nephew) | witness, patrol, dispatch, quarry |
| [nephew-operator-lora.md](./nephew-operator-lora.md) | [nephew](https://github.com/marvelousempire/nephew) | DGX LoRA export, Ollama register, local DSMRP stack |
| [grok-api.md](./grok-api.md) | nephew + ccr | xAI export ingest + reconstruction |
| [cinematic-fluid-experience.md](./cinematic-fluid-experience.md) | AISL + nephew plans | WebGPU fluid, Master Cinematic Quality Bible, SRIC guardian |

**Simulated → witnessed map:** [QUARRY-SIMULATED-GAPS.md](./QUARRY-SIMULATED-GAPS.md)

**Quarry note:** Grok asked for `engineering/tech-stacks/` at repo root; canonical path is `skills/engineering/tech-stacks/` (this folder).
