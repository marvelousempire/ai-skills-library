# Placement Map

Purpose: map parsed PRD items to future implementation or documentation destinations. This is not a file move plan; it is a placement recommendation for staged work.

| Item ID | Recommended Destination | Timing | Notes |
|---|---|---|---|
| FSPRD-001 | `docs/product/vision.md` or app README | Now | Use as product quality bar and acceptance criteria. |
| FSPRD-002 | `plans/platform-roadmap.md` | Later | Platform scope is multi-surface and should be phased. |
| FSPRD-003 | `design-system/tokens/` or `src/design/tokens.ts` | Slice 1 minimal | Start with fluid/cinematic tokens only; expand for native later. |
| FSPRD-004 | `apps/web` prototype backlog | Slice 1 | Core visual and interaction proof. |
| FSPRD-005 | `plans/sensor-integration.md` | Later | Device Motion can be slice 2; LiDAR/Watch/Dynamic Island later. |
| FSPRD-006 | `plans/scanning-blender-pipeline.md` | Later | Separate product subsystem; do not mix into first prototype. |
| FSPRD-007 | `apps/web` implementation plan | Slice 1 | Best first implementation surface. |
| FSPRD-008 | `apps/ios` implementation plan | Later | Requires Xcode/RealityKit/Metal/on-device proof. |
| FSPRD-009 | `backend/` or `services/blender-pipeline/` plan | Later | Only needed once saving/scanning/exporting exists. |
| FSPRD-010 | `docs/non-functional-requirements.md` | Now | Convert to measurable checks per slice. |
| FSPRD-011 | `apps/ios/docs/realitykit-architecture.md` | Later | Keep as native architecture seed. |
| FSPRD-012 | `docs/development-environment.md` | Now | Make hardware prerequisites explicit before native work. |
| FSPRD-013 | `docs/agent-handoff.md` | Now | Handoff instructions should become agent-facing implementation constraints. |
| FSPRD-014 | `07-clean-representation/gap-ledger.md` | Now | Earlier gaps still matter even if later PRD says no gaps remain. |
| FSPRD-015 | `07-clean-representation/first-build-slice.md` | Now | Strongest evidence for first slice. |
| FSPRD-016 | `05-similarity-duplicates/duplicate-clusters.md` | Now | Preserve provenance, but prevent agents from treating every final block as separate scope. |

## Recommended Structure For Future App Repo

```text
fluid-simulation-app/
├── apps/
│   ├── web/                 # Vite + React + R3F + WebGPU first slice
│   ├── ios/                 # SwiftUI + RealityKit + Metal later slice
│   └── watch/               # Companion controller later slice
├── packages/
│   └── design-tokens/       # Shared cinematic + fluid parameters
├── services/
│   └── blender-pipeline/    # FastAPI + Blender automation later slice
├── docs/
│   ├── product/
│   ├── non-functional-requirements.md
│   └── development-environment.md
└── plans/
```
