# Milk Pour — Web Cinematic Fluid Prototype

Plan **0034** slice 1: Vite + React + TypeScript + React Three Fiber proof for the cinematic milk-pour experience.

## Run

```bash
cd skills/engineering/tech-stacks/cinematic-reality-ui/decanter/apps/milk-pour
pnpm install
pnpm dev
```

Or:

```bash
make ui
```

Opens **http://127.0.0.1:5178** (Vite).

## Controls

- **Pointer move** — tilt gravity inside the glass
- **Hold click / touch** — pour (spawn particles from above)
- **Drag** — orbit camera (drei `OrbitControls`)
- **Reduce motion** — fewer particles, slower simulation

## Stack

- Vite, React 19, TypeScript
- Three.js, `@react-three/fiber`, `@react-three/drei`
- WebGL instanced particle approximation (slice 1)
- WebGPU **capability probe** + fallback banner (MLS-MPM compute path deferred)

## Planning docs

- `../../../../plans/0034-web-cinematic-milk-pour-prototype.md`
- `../../07-clean-representation/canonical-prd-draft.md`
- `../../07-clean-representation/first-build-slice.md`

## Verify

```bash
pnpm build
```

Expected: TypeScript clean, `dist/` produced.
