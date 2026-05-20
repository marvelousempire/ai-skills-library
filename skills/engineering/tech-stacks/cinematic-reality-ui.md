# Tech stack — Cinematic Reality UI

**Canonical tree:** [`cinematic-reality-ui/`](./cinematic-reality-ui/README.md)  
**Ledger:** [`cinematic-reality-ui/stack.ledger.yaml`](./cinematic-reality-ui/stack.ledger.yaml)  
**Witness / plans:** [nephew](https://github.com/marvelousempire/nephew) plans `0036`, `0037`, `0046`, `0047`  
**Guardian agent:** [`cinematic-reality-ui-guardian`](../../agents/cinematic-reality-ui-guardian.md) — SRIC + sealed ledger.

> Former slug: `cinematic-fluid-experience` → redirect at [`cinematic-fluid-experience/README.md`](./cinematic-fluid-experience/README.md).

## Summary

| Layer | Choice | Notes |
|-------|--------|--------|
| Web UI | **Vite + React 19 + TypeScript** | Reference: `decanter/apps/cinematic-fluid-hero/` |
| GPU | **WebGPU** | Screen-space fluid, post-processing |
| Color | **ACES filmic** | `doctrine/docs/rendering/aces-tone-mapping.md` |
| Fluid surface | **Screen-space fluid** | `doctrine/docs/rendering/screen-space-fluid-rendering.md` |
| Quality SSOT | **Master Cinematic Quality Bible** | `doctrine/docs/quality/master-cinematic-quality-bible.md` |
| Native arena | **RealityKit 4** (iOS) | `doctrine/docs/arena/cinematic-broadcast-arena.md` |
| Enforcement | **Sealed ledger** | `ledger/*.yaml` — closed allowlist |

## Read order

1. [`cinematic-reality-ui/stack.plugin.md`](./cinematic-reality-ui/stack.plugin.md) — what installing this kit means.
2. [`cinematic-reality-ui/SRIC.md`](./cinematic-reality-ui/SRIC.md) — agent law.
3. [`cinematic-reality-ui/ledger/dependencies.yaml`](./cinematic-reality-ui/ledger/dependencies.yaml) — allowed packages.
4. [`doctrine/docs/product/canonical-prd.md`](./cinematic-reality-ui/doctrine/docs/product/canonical-prd.md)

## Development (reference hero app)

```sh
cd skills/engineering/tech-stacks/cinematic-reality-ui/decanter/apps/cinematic-fluid-hero
pnpm install && make ui-local
```

## SRIC + ledger

Agents bound to this stack use **SRIC** with the **ledger as constitution**. Bishop manifests: `stack_bible_path` → `stack.ledger.yaml`; `sric_capabilities` ⊆ `ledger/capabilities.yaml`.
