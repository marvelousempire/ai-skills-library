# Tech stack — Automata Pad (desktop)

**Witness repo:** [marvelousempire/automata](https://github.com/marvelousempire/automata)  
**App path:** `apps/pad-desktop/`  
**Quarry:** Watch-folder Grok thread (Tauri + React + Vite); closes simulated `engineering/tech-stacks/` claim.

## Summary

| Layer | Choice | Version / notes |
|-------|--------|-----------------|
| Desktop shell | **Tauri** | 2.x (`tauri`, `tauri-plugin-shell`, `@tauri-apps/cli`) |
| UI | **React** | 19.x |
| Bundler / HMR | **Vite** | dev server port **5174** (`strictPort`) |
| 3D body | **WebGPU** | `src/body/WebGPUBody.ts` |
| Monorepo | **pnpm** workspaces | `@automata/core`, `@automata/types` |
| Backend commands | **Rust** | `src-tauri/` — path validation invoke |
| Ethics / flow | **@automata/core** | philosophical flow, patrol, Make-Sense |

**Why Tauri + React:** Vite HMR in dev; native shell + restricted shell plugin in prod. Grok’s old `automata/desktop/` paths are **obsolete** — use `apps/pad-desktop/`.

## Directory layout (witnessed)

```
apps/pad-desktop/
├── src/                    # React UI (App, panels, WebGPU body)
├── src-tauri/
│   ├── tauri.conf.json
│   ├── Cargo.toml
│   ├── capabilities/default.json
│   └── src/
│       ├── main.rs
│       ├── lib.rs          # shell plugin + invoke_handler
│       └── security/mod.rs # validate_slice_path
├── vite.config.ts
└── package.json
```

## Development

```sh
cd ~/Developer/automata
pnpm install
pnpm build
make ui-dev    # Tauri + Vite (Rust toolchain required)
```

`tauri.conf.json` runs `pnpm run dev` before dev and `pnpm run build` before release; `devUrl` is `http://127.0.0.1:5174`.

## Security (v1)

- **CSP** in `tauri.conf.json` — `default-src 'self'`, limited script/style/img  
- **Rust:** `validate_slice_path` rejects `..`, absolute paths, multi-colon drive paths  
- **Shell plugin:** enabled — tighten scopes before production micro-slice execution (see automata `docs/security/`)  
- Platform sandboxes (Seatbelt / etc.) — bundle-time; see Grok quarry backlog in nephew `watch-folder-triggers` ledger  

## Frontend integration

- Intent MCQ gate (90%) — `src/App.tsx`  
- Panels: `MidiPadBoard`, `OctopusPanel`, `ThemeToggle`  
- Invoke from UI: `@tauri-apps/api` → `validate_slice_path` (when wired)

## Nephew / CLOAK

| Tool | Use |
|------|-----|
| `nephew automata slice\|flow\|scatter` | Layer-0 CLI bridge |
| `nephew dispatch evaluate "<task>"` | Patrol + intent + fidelity before ship |
| `nephew quarry list` | Export thread audit status |

## Related

- Automata: `docs/BELIEF-SYSTEM.md`, `PRD.md`, `docs/NEPHEW-INTEGRATION.md`  
- AISL: [`agents/automata-ticket.md`](../../../agents/automata-ticket.md)  
- Nephew: `docs/handoffs/watch-folder-to-living-ingest.md`

## Out of scope (quarry only — not in this stack doc)

- Full “God Mode” sidecar / Seccomp binaries from Grok paste  
- `automata/desktop/` path (never existed on `origin/main`)  
- ai-skills-library copy of every Grok code block — this doc is **truth from repo**
