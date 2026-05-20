# Fluid Simulation Explainer Docs

Source PRD: [`../../../doctrine/docs/product/canonical-prd.md`](../../../doctrine/docs/product/canonical-prd.md)  
Explainer ledger: `../explainer-ledger.md`  
Requirements: `../requirement-table.md`  
Tech stack: `../tech-stack-table.md`

## Purpose

This docs tree expands the `FSEXP-*` explainer ledger into readable, focused markdown pages. Each page owns one rationale, tutorial, warning, or handoff concept from the huge PRD, while the original source stays unchanged.

## Read Order

1. `web-fluid/` - why the first solvable slice is a web/R3F/WebGPU milk-pour prototype.
2. `design-system/` and `product/` - how the experience should feel and how tokens keep platforms aligned.
3. `realitykit-metal/` - how the later native scene should be structured.
4. `sensors-watch-audio/` - device capability, Watch, haptics, and audio explainers.
5. `scanning-blender/` - the separate scan-cleanup-export subsystem.
6. `non-functional/` - performance and accessibility behavior.
7. `implementation-handoff/` - open questions, hardware, audit notes, and agent constraints.

## Folder Map

| Folder | Owns |
|---|---|
| `product/` | Immersion-first product principles. |
| `web-fluid/` | Web/R3F/WebGPU rationale, options, and prototype guidance. |
| `realitykit-metal/` | Native RealityKit/Metal rationale and scene architecture. |
| `design-system/` | Shared token and ReadyPlay 2D-to-3D bridge explainers. |
| `sensors-watch-audio/` | Apple capability, Watch, haptics, and audio rationale. |
| `scanning-blender/` | Scanning, AI Blender cleanup, and asset format bridge explainers. |
| `non-functional/` | Performance and accessibility delivery guidance. |
| `implementation-handoff/` | Open decisions, hardware prerequisites, agent handoff, and source audit notes. |

## Coverage

Every section page cites its `FSEXP-*` ID and source line range from `explainer-ledger.md`. Duplicate PRD blocks are not copied here; canonical ranges are used where the ledger identified repeated explainers.
