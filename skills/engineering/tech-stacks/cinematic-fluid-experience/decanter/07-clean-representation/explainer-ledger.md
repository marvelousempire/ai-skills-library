# Fluid Simulation Explainer Ledger

Source: `../../PRD for Fluid Simulation App.md`  
Parsing route: `Parsing Agent -> Sensemaking Decanter`  
Companion maps: `requirement-table.md`, `tech-stack-table.md`

## Purpose

This ledger preserves the explanatory material from the source PRD: rationale, tutorials, warnings, implementation notes, and "why this matters" context. Requirements live in `requirement-table.md`; stack choices live in `tech-stack-table.md`. This file keeps the explainer layer DRY so future agents do not need to re-read the whole 849-line PRD to understand the reasoning.

## Explainer Items

| Explainer ID | Source Lines | Family | Title | Extracted Explainer | Related IDs | Destination |
|---|---:|---|---|---|---|---|
| FSEXP-001 | 25-31 | Web fluid / WebGPU | R3F over Framer Motion | Framer Motion is useful for UI motion, but cinematic milk physics needs Three.js/R3F plus shader or plugin work. | PRD-005, PRD-018; FSTECH-004-FSTECH-009 | `docs/web-fluid/web-fluid-rationale.md` |
| FSEXP-002 | 27-30, 714 | Web fluid / WebGPU | Starter web tutorial | Start with Vite React, add `three`, `@react-three/fiber`, and `@react-three/drei`, then investigate GPU fluid examples and opaque viscous shader tweaks. | PRD-018; FSTECH-001-FSTECH-009 | `docs/web-fluid/first-prototype-tutorial.md` |
| FSEXP-003 | 267-300+ | Web fluid / WebGPU | WebGPU fluid guide (May 2026) | WebGPU + TSL path; MLS-MPM official example; Water Pro; open-source options; milk fit; quick start; ~70–80% reality check. Also `canonical-prd-draft.md` §17. | PRD-011, PRD-018, PRD-027; FSTECH-007-FSTECH-009, FSTECH-035 | `docs/web-fluid/webgpu-explainer.md` |
| FSEXP-004 | 274-285+ | Web fluid / WebGPU | 2026 repo comparison table | Ranked: Water Pro ($149), MLS-MPM official, WebGPU-Ocean, jeantimex/fluid, kishimisu, R3F-WaterSurface; recommend Water Pro + MLS-MPM combo. Also `canonical-prd-draft.md` §18. | PRD-011, PRD-018; FSTECH-008-FSTECH-009 | `docs/web-fluid/implementation-options.md` |
| FSEXP-005 | 287-295 | Web fluid / WebGPU | Milk interaction model | Tilt maps to gravity, container rotation releases particles, opacity/scattering sells milk, and 60fps requires LOD fallbacks. | PRD-005, PRD-006, PRD-007, PRD-010, PRD-027; FSTECH-007-FSTECH-011, FSTECH-035 | `docs/web-fluid/milk-interaction-model.md` |
| FSEXP-006 | 34-36, 709-716 | RealityKit / Metal | RealityKit is rendering, not the fluid solver | RealityKit is strong for AR, rendering, physics, particles, manipulation, and HUDs, but true fluid simulation still needs custom Metal or particle/GPU work. | PRD-005, PRD-019; FSTECH-016-FSTECH-021 | `docs/realitykit-metal/native-fluid-rationale.md` |
| FSEXP-007 | 577-580, 700-707, 825-828 | RealityKit / Metal | Native scene architecture pattern | Native implementation centers on `CinematicFluidArenaView`, root entities, glass/container, fluid particles, HUD attachments, `postProcess`, and model-driven updates. | PRD-019, PRD-025; FSTECH-016-FSTECH-021 | `docs/realitykit-metal/scene-architecture.md` |
| FSEXP-008 | 671-680 | RealityKit / Metal | RealityKit component roles | RealityKit components have specific jobs: collisions, manipulation, HUD attachments, particle effects, instancing, environment blending, gestures, and observable state. | PRD-019; FSTECH-016-FSTECH-021 | `docs/realitykit-metal/component-map.md` |
| FSEXP-009 | 499, 609-611, 747 | Design system bridge | Immersion-first philosophy | The experience should be full-screen, premium, cinematic, addictive, and avoid crummy basic 2D interfaces or playful/cartoonish styling. | PRD-001, PRD-025 | `docs/product/experience-principles.md` |
| FSEXP-010 | 41-45, 512-520, 621-638 | Design system bridge | Shared tokens as cross-platform glue | Tokens should unify colors, timing, easing, glow, blur, shader/fluid parameters, and interaction feel across web and native. | PRD-003, PRD-004, PRD-023; FSTECH-034 | `docs/design-system/token-bridge.md` |
| FSEXP-011 | 514-520, 624-638, 762-768 | Design system bridge | ReadyPlay 2D to 3D bridge | 2D primitives should preview their RealityKit counterparts through `RealityView` and `ViewAttachmentComponent` as holographic HUD elements. | PRD-004, PRD-019, PRD-023; FSTECH-016-FSTECH-017, FSTECH-034 | `docs/design-system/readyplay-arena-bridge.md` |
| FSEXP-012 | 47-55, 60-64, 691-698 | Implementation handoff | User flow needs definition | The PRD asks whether the experience is tilt-based, viscosity-slider based, ambient, or interactive; this must become concrete flow design. | PRD-007, PRD-025; FSTECH-010-FSTECH-011 | `docs/implementation-handoff/user-flow-questions.md` |
| FSEXP-013 | 111-119 | Sensors, Watch, haptics, audio | Underused iPhone capabilities | TrueDepth, LiDAR, ARKit, Core Haptics, Metal Performance Shaders, Spatial Audio, AVFoundation, Dynamic Island, and Live Activities are leverage points. | PRD-010-PRD-014; FSTECH-022-FSTECH-026 | `docs/sensors-watch-audio/apple-capabilities.md` |
| FSEXP-014 | 129-138, 507-508, 619 | Sensors, Watch, haptics, audio | Watch is companion, not renderer | Apple Watch should control, trigger, sense tilt, and provide haptics while iPhone/iPad/web run the heavy simulation. | PRD-002, PRD-020; FSTECH-027 | `docs/sensors-watch-audio/watch-controller.md` |
| FSEXP-015 | 41-43, 115-118, 573, 696, 821 | Sensors, Watch, haptics, audio | Haptics and audio immersion rationale | Liquid realism depends on synced sloshing/pouring audio and haptic feel; web vibration is weaker, Apple Core Haptics is richer. | PRD-008, PRD-009, PRD-013; FSTECH-013, FSTECH-022-FSTECH-023 | `docs/sensors-watch-audio/haptics-audio-sync.md` |
| FSEXP-016 | 140-148 | Scanning, Blender, 3D printing | Phone scans need cleanup | Phone scans are useful for AR/visual use but generally not print-ready without Blender cleanup: topology repair, hole filling, smoothing, and print prep. | PRD-011, PRD-015, PRD-016, PRD-017; FSTECH-025, FSTECH-030 | `docs/scanning-blender/print-readiness.md` |
| FSEXP-017 | 252-255 | Scanning, Blender, 3D printing | Blender agent architecture | Blender MCP or a backend-controlled `bpy` agent can let Claude/GPT/Ollama clean topology, repair meshes, retopologize, and optimize scans. | PRD-016, PRD-021; FSTECH-028-FSTECH-030 | `docs/scanning-blender/ai-blender-architecture.md` |
| FSEXP-018 | 256-258, 571, 694, 819 | Scanning, Blender, 3D printing | USDZ to glTF bridge | USDZ is the Apple-native primary format; web should use glTF/GLB conversion via Reality Converter or USD tooling. | PRD-024, PRD-026; FSTECH-032-FSTECH-033 | `docs/scanning-blender/asset-format-bridge.md` |
| FSEXP-019 | 54, 291-295, 569, 692, 817 | Performance, accessibility, deployment | Performance reality check | Fluid sims are heavy; target 60fps, prefer 120fps where possible, profile GPU cost, and use LOD, culling, simplified shaders, and fallbacks. | PRD-027; FSTECH-035 | `docs/non-functional/performance-delivery.md` |
| FSEXP-020 | 63, 572, 695, 820 | Performance, accessibility, deployment | Accessibility behavior needs detail | Motion sensitivity and low-vision support need concrete behavior: reduce/freeze fluid motion, accessible HUD attachments, and low-vision-aware controls. | PRD-028; FSTECH-012 | `docs/non-functional/accessibility-controls.md` |
| FSEXP-021 | 216-242, 243-265 | Implementation handoff | Earlier gap recommendations | Earlier sections identify unresolved choices around fluid approach, AI/Blender backend, asset format, state sync, auth, and data. | PRD-018, PRD-021, PRD-022, PRD-024; FSTECH-007-FSTECH-009, FSTECH-028-FSTECH-033 | `docs/implementation-handoff/open-decisions.md` |
| FSEXP-022 | 386-393, 425-429, 582-586, 718-722, 830-834 | Implementation handoff | Hardware prerequisite rationale | Native iOS/RealityKit development requires a Mac; LiDAR, iPad Pro, and Watch are test hardware for later native/scanning/controller work. | PRD-011, PRD-014, PRD-019, PRD-020; FSTECH-014-FSTECH-027 | `docs/implementation-handoff/development-hardware.md` |
| FSEXP-023 | 588-592, 724-728, 836-840 | Implementation handoff | Agent handoff constraints | Start with design toggle and primitives, then native scene patterns, test on device for GPU/haptics/sensors, and preserve immersion. | PRD-001, PRD-019, PRD-025, PRD-027; FSTECH-016-FSTECH-023, FSTECH-035 | `docs/implementation-handoff/agent-handoff.md` |
| FSEXP-024 | 348-372 | Implementation handoff | Missing-item audit | Earlier audit says design tokens, performance details, sound implementation, milk-specific traits, user flow, and asset pipeline were lightly represented. | PRD-004-PRD-006, PRD-009, PRD-025-PRD-027; FSTECH-013, FSTECH-034-FSTECH-035 | `docs/implementation-handoff/source-audit-notes.md` |

## Explainer Families

| Family | Items | What It Owns |
|---|---|---|
| Web fluid / WebGPU | FSEXP-001-FSEXP-005 | Why the first slice should use web/R3F/WebGPU, what prototype options exist, and how milk interaction should work. |
| RealityKit / Metal | FSEXP-006-FSEXP-008 | Why native work needs Metal/custom simulation and how the RealityKit scene should be structured. |
| Design system bridge | FSEXP-009-FSEXP-011 | The premium cinematic philosophy, token bridge, and ReadyPlay 2D-to-3D mapping. |
| Sensors, Watch, haptics, audio | FSEXP-013-FSEXP-015 | Device capability rationale and why Watch/audio/haptics are companion immersion layers. |
| Scanning, Blender, 3D printing | FSEXP-016-FSEXP-018 | The scan-cleanup-export subsystem, intentionally separate from the first fluid prototype. |
| Performance, accessibility, deployment | FSEXP-019-FSEXP-020 | How broad non-functional requirements become behavior and verification guidance. |
| Implementation handoff | FSEXP-012, FSEXP-021-FSEXP-024 | Open questions, hardware constraints, source audit notes, and agent-facing handoff rules. |

## Canonical Source Ranges For Repeated Explainers

| Theme | Repeated Ranges | Canonical Range | Handling |
|---|---|---:|---|
| Final PRD blocks | 302-347, 431-480, 488-599, 601-849, 738-849 | 738-849 | Do not extract requirements again; only keep unique rationale, bridge, component, and handoff context. |
| WebGPU / R3F rationale | 25-31, 267-300, 709-716 | 267-300 | Use as canonical WebGPU explainer; keep 25-31 as early proof that Framer Motion is not enough. |
| RealityKit needs Metal/custom fluid | 34-36, 249-250, 709-716 | 709-716 | Use as concise combined web/native rationale. |
| Shared design tokens | 41-43, 365, 512, 621-638, 758-768 | 621-638 | Use because it includes token categories and concrete 2D-to-3D bridge mappings. |
| Apple Watch companion role | 131-138, 507-508, 619, 693 | 131-138 | Use for explanatory rationale; later ranges are summaries. |
| Scan cleanup / print readiness | 140-148, 543-544, 657-659, 790-792 | 140-148 | Use because it explains why Blender cleanup is required. |
| Performance constraints | 54, 293-295, 569, 692, 817 | 692 | Use because it combines FPS target, profiling, LOD/culling, shader simplification, and WebGPU scale. |
| Handoff instructions | 588-592, 724-728, 836-840 | 836-840 | Use as the clean final handoff, with earlier ranges as duplicate provenance. |

## Recommended Future Folder Map

If this decanter gets expanded into a documentation tree, split the explainer items like this:

```text
docs/
├── web-fluid/
│   ├── web-fluid-rationale.md
│   ├── first-prototype-tutorial.md
│   ├── webgpu-explainer.md
│   ├── implementation-options.md
│   └── milk-interaction-model.md
├── realitykit-metal/
│   ├── native-fluid-rationale.md
│   ├── scene-architecture.md
│   └── component-map.md
├── design-system/
│   ├── token-bridge.md
│   └── readyplay-arena-bridge.md
├── sensors-watch-audio/
│   ├── apple-capabilities.md
│   ├── watch-controller.md
│   └── haptics-audio-sync.md
├── scanning-blender/
│   ├── print-readiness.md
│   ├── ai-blender-architecture.md
│   └── asset-format-bridge.md
├── non-functional/
│   ├── performance-delivery.md
│   └── accessibility-controls.md
└── implementation-handoff/
    ├── user-flow-questions.md
    ├── open-decisions.md
    ├── development-hardware.md
    ├── agent-handoff.md
    └── source-audit-notes.md
```

## Coverage Note

The source PRD remains unchanged. This ledger captures explainer material as stable references only; future canonical docs should be generated from these `FSEXP-*` items instead of copying repeated prose directly from the source document.
