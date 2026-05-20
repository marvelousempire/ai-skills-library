# Duplicate Clusters

Purpose: separate exact/near duplicate source material from unique requirements. No source material should be deleted without operator approval.

## Cluster D1 - Repeated Final PRD Blocks

Type: near duplicate

Source ranges:

- lines 302-347: "final Product Requirements Document"
- lines 431-480: numbered PRD-001 through PRD-029 block
- lines 488-599: "absolute final" complete edition
- lines 601-849 / 738-849: repeated "absolute final" complete edition

Finding: these blocks mostly repeat the same requirements with increasing detail. The final block at lines 738-849 is the most complete implementation-planning source.

Recommendation: preserve all blocks as source history; use lines 738-849 as the canonical planning basis.

## Cluster D2 - Platform Strategy Repetition

Type: exact/near duplicate

Repeated claims:

- Web: Vite + React + Three.js + React Three Fiber + WebGPU
- iOS/iPadOS: SwiftUI + RealityKit 4 + RealityView + Metal
- Apple Watch: companion controller
- Shared tokens for consistency

Recommendation: collapse into one platform roadmap during future canonical rewrite.

## Cluster D3 - Tech Stack Repetition

Type: near duplicate

Repeated claims:

- WebGPU compute shaders and R3F fluid simulation
- RealityKit/Metal native simulation
- FastAPI + AI + Blender `bpy`
- Firebase sync/auth
- USDZ primary with glTF fallback

Recommendation: keep the latest stack wording, but mark some choices as unresolved until implementation research confirms library viability.

## Cluster D4 - "No Gaps Remain" Claim Versus Earlier Gap Audit

Type: conflict/overconfidence

The document says no gaps remain, but earlier sections list unresolved decisions around fluid approach, backend/AI integration, asset format, sync, and auth/data.

Recommendation: do not accept "no gaps remain" as implementation truth. Use the gap ledger for solvency.
