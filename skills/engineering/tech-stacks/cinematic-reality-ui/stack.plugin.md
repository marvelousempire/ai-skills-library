# Cinematic Reality UI — Stack plugin

**Slug:** `cinematic-reality-ui`  
**Type:** Sealed tech stack (construction kit + ledger)

## What it feels like

Immersive **cinematic reality UI**: broadcast-grade dark surfaces, ACES filmic color, screen-space fluid on web, RealityKit 4 on iOS. Premium motion without gimmick scale-from-zero. The product is **mood + doctrine + ledger** — reference apps under `decanter/` are examples, not the kit itself.

## When to install

- Building a **web** hero with WebGPU + Three.js/R3F + postprocessing + Motion.
- Aligning **iOS** work to RealityKit 4 arena / kiosk patterns in doctrine.
- You need a **closed allowlist** so agents cannot add random npm UI frameworks.

## What you get

| Piece | Path |
|-------|------|
| Constitution | `stack.ledger.yaml` → `ledger/*.yaml` |
| SRIC gate | `SRIC.md` |
| Quality bible | `doctrine/docs/quality/` |
| Reference apps | `decanter/apps/` |
| Guardian | `agents/cinematic-reality-ui-guardian.md` |

## What you must not expect

- Adding **Next.js**, **Tailwind**, or off-ledger packages without a ledger PR.
- **TestFlight / App Store ship** from this kit alone (no `ios_build` payload unless registered).
- A single “drop in” app — you adopt **constraints**, then build in allowed languages.

## Install (agents)

```
stack_bible_path: skills/engineering/tech-stacks/cinematic-reality-ui/stack.ledger.yaml
```

Validate every dependency and capability against `ledger/` before saying yes.
