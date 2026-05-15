# Tech stack — Automata monorepo (core + automation tree)

**Witness repo:** [marvelousempire/automata](https://github.com/marvelousempire/automata)  
**Desktop UI:** [automata-desktop.md](./automata-desktop.md)

## Packages

| Package | Role |
|---------|------|
| `@automata/core` | Philosophical flow, patrol, Make-Sense |
| `@automata/cli` | `pnpm slice`, `pnpm flow` |
| `@automata/types` | Shared types, biological levels |
| `@automata/watcher` | fswatch scaffold (host needs `fswatch`) |

## Biological tree (`automation/`)

Reference layout for micro-slice placement — see repo `automation/README.md`:

`cells/` → `tissues/` → `organs/` → `skeleton/` → `systems/` + `tags/dependencies.json`

Example cell: `automation/cells/example-echo.sh` (witnessed echo slice).

## AISL stub vs product

| Path | Truth |
|------|--------|
| `ai-skills-library/automata/` | **Pointer only** — not the runtime |
| Grok “pushed automata/ to ai-skills-library” | **Simulation** — use marvelousempire/automata |

## Security docs

- `docs/security/` — shell scope, God Mode notes  
- Pad: `validate_slice_path` in `apps/pad-desktop/src-tauri/`

## Quarry PRD

`docs/PRD-QUARRY.md`, `docs/WATCH-FOLDER-QUARRY.md`, root `PRD.md`
