# Fluid Simulation PRD Requirement Table

Source: `../../PRD for Fluid Simulation App.md`  
Canonical basis: final PRD block near the end of the source document, with duplicate/source hygiene tracked in `../05-similarity-duplicates/duplicate-clusters.md`.

Full expanded requirement prose: `canonical-prd-draft.md` section 4.  
Exhaustive 37-item conversation inventory (different `PRD-*` numbering): `complete-inventory-table.md` (authoritative; semantic dedup applied) and `canonical-prd-draft.md` section 16.

## Canonical Requirements

| PRD ID | Decanter ID | Area | Requirement | Implementation / Notes | Phase |
|---|---|---|---|---|---|
| PRD-001 | FSPRD-001 | Vision & Goals | Create a cinematic, premium, hyper-realistic pouring milk experience. | Game-quality bar; immersion-first full-screen native canvas; minimal HUD; no playful/cartoonish UI; milk-specific opacity/viscosity/foam. | Slice 1 quality bar |
| PRD-002 | FSPRD-002 | Platform Strategy | Support Web, iOS, iPadOS, and Apple Watch. | Web first; native RealityKit 4 + RealityView + Metal later; Watch companion only (no full sim on Watch). | Roadmap |
| PRD-003 | FSPRD-002 | Platform Strategy | Maintain visual and behavioral consistency across platforms. | Shared tokens + interaction parameters; iPadOS multi-touch/Pencil/Stage Manager; identical fluid feel web/native. | Roadmap |
| PRD-004 | FSPRD-003 | Design System | Implement shared design tokens. | Colors, spacing, easing, glow, blur, fluid/cinematic parameters; ReadyPlay primitives; 2D→3D bridge; `ReadyPlayArenaBridge.swift` hybrid previews; Style Dictionary or Tokens Studio. | Slice 1 minimal |
| PRD-005 | FSPRD-004 | Core Features | Build hyper-realistic pouring milk simulation. | GPU/particle/SPH-class solver path; pouring, viscosity, splashes, foam, creamy opacity; interactive grab/spin/inspect containers. | Slice 1 |
| PRD-006 | FSPRD-004 | Core Features | Add advanced real-time lighting and materials. | PBR, subsurface scattering, caustics, dynamic shadows, bloom, vignette, film grain, volumetric fog. | Slice 1 / later polish |
| PRD-007 | FSPRD-004 | Core Features | Add touch and gesture interactions. | Tilt glass, swipe pour, pinch viscosity, rotate/inspect; sync with haptics where available. | Slice 1 pointer/touch first |
| PRD-008 | FSPRD-004 | Core Features | Add haptic feedback across platforms. | Core Haptics on Apple; Vibration API on web; liquid-feeling custom patterns. | Later platform slice |
| PRD-009 | FSPRD-004 | Core Features | Add matching spatial audio. | Slosh/pour/impact; Spatial Audio on Apple; Web Audio API/Howler on web; event-synced. | Later polish |
| PRD-010 | FSPRD-005 | Hardware & Sensors | Support Device Motion / accelerometer on web and Core Motion on iOS. | Tilt/gravity pour control; add after pointer/touch model works. | Slice 2 |
| PRD-011 | FSPRD-005 / FSPRD-006 | Hardware & Sensors | Use LiDAR and TrueDepth scanning for objects, environments, and faces. | Import into fluid scenes; feeds 3D printing pipeline; not print-ready raw. | Later subsystem |
| PRD-012 | FSPRD-005 | Hardware & Sensors | Use ARKit / RealityKit World Tracking. | Accurate native spatial tracking for AR experiences. | Later native slice |
| PRD-013 | FSPRD-005 / FSPRD-008 | Hardware & Sensors | Integrate Core Haptics and Spatial Audio. | Plus Metal Performance Shaders, AVFoundation, Dynamic Island/Live Activities potential. | Later native slice |
| PRD-014 | FSPRD-005 | Hardware & Sensors | Support Apple Pencil on iPadOS. | Precision iPad control and inspection workflows. | Later native slice |
| PRD-015 | FSPRD-006 | Scanning & 3D Printing | Scan real-world objects using LiDAR and TrueDepth. | Requires native capture flow and user permission handling. | Later subsystem |
| PRD-016 | FSPRD-006 / FSPRD-009 | Scanning & 3D Printing | Add AI-powered Blender cleanup. | Clean topology, repair holes, smooth surfaces, and retopologize using Blender `bpy`. | Later backend/AI slice |
| PRD-017 | FSPRD-006 / FSPRD-009 | Scanning & 3D Printing | Export models as `.obj` and `.usd` for 3D printing. | Export validation belongs after scan cleanup quality is proven. | Later subsystem |
| PRD-018 | FSPRD-007 | Web Tech Stack | Build the web surface with Vite, React, TypeScript, Three.js, R3F, Drei, and WebGPU. | WebGPU/TSL/compute shaders; fluid options include official particle fluid, r3f-fluid-sim, Water Pro–style; Zustand/Jotai; DeviceMotion later. | Slice 1 |
| PRD-019 | FSPRD-008 | Apple Tech Stack | Build iOS/iPadOS with Swift, SwiftUI, RealityKit 4, RealityView, Metal, and Metal Performance Shaders. | Mandatory RK4 components + postProcess MPS; Metal compute + particles; verify iOS 19+/Xcode 17+ locally. | Later native slice |
| PRD-020 | FSPRD-008 | Apple Watch Tech Stack | Build Apple Watch as a companion controller. | Use Swift, Core Haptics, and sensor APIs; do not run the full fluid sim on Watch. | Later native slice |
| PRD-021 | FSPRD-009 | Backend & AI | Use Python, FastAPI, Claude/GPT, and Blender Python API. | Only needed when scanning, cleanup, saved creations, or exports exist. | Later backend slice |
| PRD-022 | FSPRD-009 | Sync / Auth | Use Firebase for real-time sync and authentication. | Defer until cross-device state, accounts, or saved creations are required. | Later product slice |
| PRD-023 | FSPRD-003 / FSPRD-007 | Shared Tokens | Use Style Dictionary or Tokens Studio for shared design tokens. | First slice should define a small fluid/cinematic token schema. | Slice 1 minimal |
| PRD-024 | FSPRD-009 | Asset Format | Use USDZ as primary 3D format with glTF conversion for web. | Preserve Apple-native quality while serving Three.js-compatible assets. | Later asset pipeline |
| PRD-025 | FSPRD-010 | User Flow | Define detailed user flow and interaction design. | Interactive vs ambient modes; tilt/pour/pinch/sliders; Watch companion; minimal HUD; real-time fluid response. | Slice 1 |
| PRD-026 | FSPRD-010 | Asset Pipeline | Build a robust asset pipeline across platforms. | Reality Composer Pro → USDZ; sync web/iOS/Blender; textures/shaders/models. | Later pipeline |
| PRD-027 | FSPRD-010 | Performance | Optimize for 60 fps minimum, with 120 fps preferred on capable devices. | LOD, culling, simplified mobile shaders, Instruments profiling, MeshInstancesComponent, WebGPU scale. | Slice 1 onward |
| PRD-028 | FSPRD-010 | Accessibility | Support motion sensitivity and low vision. | Reduce/disable fluid motion; VoiceOver on attachments; legible non-glow-only controls. | Slice 1 minimal |
| PRD-029 | FSPRD-010 | Deployment | Define deployment strategy across web and Apple platforms. | Phased web + native + Watch; Firebase when needed; privacy consents; extensibility. | Later release planning |

## Supporting Implementation Seeds

| ID | Area | Item | Notes |
|---|---|---|---|
| FSPRD-011 | Native architecture | Use `CinematicFluidArenaView`, root entity hierarchy, `postProcess`, collision-driven particles, haptics, audio, and ReadyPlay bridge. | Architecture seed for the RealityKit/Metal phase. |
| FSPRD-012 | Development environment | Development requires M1+ MacBook, LiDAR-capable iPhone, iPad Pro, and Apple Watch for testing. | Hardware checklist before native work. |
| FSPRD-013 | Agent handoff | Start with design toggle and ReadyPlay primitives, build the RealityView scene, test on device, and preserve immersion. | Agent-facing implementation constraint. |
| FSPRD-014 | Gap seed | Earlier drafts identify unresolved choices for fluid approach, AI/Blender integration, asset format, sync, and auth/data. | Keep in the gap ledger; do not treat "no gaps remain" as implementation truth. |
| FSPRD-015 | First slice evidence | WebGPU/R3F is the strongest first path for proving high-quality real-time milk simulation. | Basis for the web cinematic milk-pour prototype. |
| FSPRD-016 | Source hygiene | Multiple final PRD blocks are near-duplicates. | Preserve the source draft; use this table and the decanter artifacts for planning. |

## Recommended Build Order

| Order | Slice | IDs Covered | Why |
|---|---|---|---|
| 1 | Web cinematic milk-pour prototype | PRD-001, PRD-004, PRD-005, PRD-006, PRD-007, PRD-018, PRD-023, PRD-025, PRD-027, PRD-028 | Proves the central visual and interaction illusion before platform scope expands. |
| 2 | Shared fluid/design token schema | PRD-003, PRD-004, PRD-023 | Keeps future web/native surfaces visually consistent without overbuilding. |
| 3 | Device Motion tilt on web | PRD-010 | Adds sensor realism after pointer/touch gravity controls work. |
| 4 | Native RealityKit/Metal prototype | PRD-008, PRD-012, PRD-013, PRD-014, PRD-019 | Ports proven interaction and visual parameters into Apple-native rendering. |
| 5 | Watch companion controller | PRD-002, PRD-020 | Adds companion tilt/haptic control after native foundations exist. |
| 6 | Scanning and Blender cleanup pipeline | PRD-011, PRD-015, PRD-016, PRD-017, PRD-021 | Separate subsystem with capture, upload, cleanup, export, and validation needs. |
| 7 | Auth, sync, storage, and deployment | PRD-022, PRD-024, PRD-026, PRD-029 | Product infrastructure only after the prototype has save/share/export reasons. |
