# Product Requirements Document - Cinematic Fluid Simulation Experience

Status: canonical draft from decanter artifacts  
Source: `../../PRD for Fluid Simulation App.md`  
Route: `Parsing Agent -> Sensemaking Decanter`  
Date: May 18, 2026

## 0. Build Direction

Build this as a staged cinematic fluid product, not as one giant web/iOS/Watch/Blender/Firebase launch.

The first build is a web-only cinematic milk-pour prototype using Vite, React, TypeScript, Three.js, React Three Fiber, Drei, a WebGPU-capability path, shared visual/fluid tokens, pointer/touch pour controls, reduced-motion support, and a performance readout.

The first build proves one thing: can the milk look and feel credible enough to justify the larger product? Native RealityKit/Metal, Apple Watch control, LiDAR/TrueDepth scanning, Blender cleanup, Firebase sync/auth, USDZ/glTF conversion, and 3D printing are roadmap slices after that proof exists.

### Builder Order

| Order | Build | Use | Do Not Add Yet |
|---|---|---|---|
| 1 | Web cinematic milk-pour prototype | Vite, React, TypeScript, Three.js, R3F, Drei, WebGPU check, controlled particle/fluid approximation, tokens, pointer/touch controls, reduced motion, performance readout. | Native app, Watch, Firebase, Blender, scanning, DeviceMotion. |
| 2 | Shared fluid/design token schema | Small token object first; later Style Dictionary or Tokens Studio. | Full ReadyPlay native bridge. |
| 3 | Device Motion tilt | DeviceMotion API after pointer/touch gravity feels good. | Watch companion. |
| 4 | Native RealityKit/Metal prototype | SwiftUI, RealityKit, RealityView, Metal, Core Haptics, AVFoundation. | Scanning/backend until native scene is credible. |
| 5 | Watch companion controller | watchOS Swift, haptics, tilt/simple controls. | Running the full simulation on Watch. |
| 6 | Scanning + Blender pipeline | ARKit, LiDAR, TrueDepth, FastAPI, Blender `bpy`, AI agent. | Treating phone scans as print-ready without cleanup. |
| 7 | Auth, sync, storage, deployment | Firebase/Auth/Firestore, asset conversion, release paths. | Product infrastructure before there is something worth saving. |

### What This Draft Preserves

The repeated source PRD blocks were not deleted from the source file. The clean draft removes duplicate repetition from the reading path, while the explanation was kept in `docs/` as canonical `FSEXP-*` pages. Use this draft for build direction and use `docs/README.md` when you need the "why" behind a direction.

## 1. Product Vision

Build a cinematic, premium, hyper-realistic fluid simulation experience focused on pouring milk. The experience should feel like a high-quality game scene: immersive, tactile, full-screen, visually rich, and satisfying. It must not feel like a basic UI demo, playful toy, or cartoon fluid effect.

The first quality bar is simple: the user should see the milk pour and immediately feel that it is beautiful, physical, and worth touching.

## 2. Product Philosophy

The product is immersion-first. The main surface should be the scene, not panels. UI exists only to support the experience through minimal HUDs, controls, toggles, and state readouts.

The visual language should use dark cinematic depth, premium lighting, soft glow, physical motion, subtle post-processing, and milk-specific material behavior: creamy opacity, visible viscosity, splash/foam hints, and dynamic lighting.

## 3. Target Platforms

| Platform | Role | Timing |
|---|---|---|
| Web | First proof surface for the cinematic milk-pour prototype. | Slice 1 |
| iOS / iPadOS | Native immersive surface using RealityKit, RealityView, Metal, haptics, sensors, and spatial audio. | Later native slice |
| Apple Watch | Companion controller for tilt, triggers, simple controls, and haptics. | Later companion slice |
| Backend / AI pipeline | Scanning, Blender cleanup, saved creations, exports, sync, and auth. | Later product slice |

The first implementation should not attempt all platforms at once. Web proves the core visual and interaction model first; native and backend surfaces should reuse what the web prototype teaches.

## 4. Requirements (Complete From Source PRD)

This section restores the full requirement content from the long source PRD. Repeated final blocks were deduplicated; unique detail was kept. Traceability table: `requirement-table.md`. Deeper rationale: `docs/README.md`.

### 4.1 Vision And Goals

| PRD ID | Requirement | Detail From Source |
|---|---|---|
| PRD-001 | Cinematic, hyper-realistic pouring milk experience. | Users should immediately think “this looks like a video game” or “this is beautiful.” Premium, video game-quality, no playful or cartoonish styling. |
| — | Immersion-first native philosophy. | Full-screen `RealityView` canvas (`ignoresSafeArea()`, system chrome hidden). SwiftUI only for minimal auto-hiding overlays and HUD attachments. Premium, game-like, cinematic, satisfying, addictive. No crummy basic interfaces. |
| — | Milk-specific focus. | Not generic fluid: milky opacity, specific viscosity, creamy look, splashes, foam. |

### 4.2 Platform Strategy

| PRD ID | Requirement | Detail From Source |
|---|---|---|
| PRD-002 | Support Web, iOS, iPadOS, and Apple Watch. | Web: Vite + React + Three.js + React Three Fiber + WebGPU. iOS/iPadOS: SwiftUI + RealityKit 4 + RealityView + Metal + Metal Performance Shaders (target iOS 19+, Xcode 17+, Reality Composer Pro). Watch: companion controller for tilt, haptics, simple controls. |
| PRD-003 | Full visual and behavioral consistency across platforms. | Shared design tokens and shared interaction parameters so fluid motion and visuals feel identical on web and native. |
| — | iPadOS advantages. | Larger screen, better multi-touch, Apple Pencil support, Stage Manager. |
| — | Apple Watch role. | Companion device only: tilt input, haptics, triggers, simple controls. Heavy rendering runs on iPhone, iPad, or web—not on Watch. |

### 4.3 Design System

| PRD ID | Requirement | Detail From Source |
|---|---|---|
| PRD-004 | Shared design tokens across web and native. | Colors, spacing, animations, cinematic easing curves, glow, blur, fluid parameters, cinematic parameters. Use Style Dictionary or Tokens Studio. |
| — | ReadyPlay 2026 mood and aesthetic. | Premium cinematic experience; dark-mode depth; neon/glow accents. |
| — | Lighting and effects tokens. | Volumetric fog, dynamic spotlights, bloom, vignette, film grain. |
| — | Motion tokens. | Physics impulses, spring collisions, slow-mo on key fluid events, subtle pulses. |
| — | ReadyPlay primitives. | `ReadyPlayCard`, `ReadyPlayStatPill`, `ReadyPlayChip`, `ReadyPlaySectionHeader`, `ReadyPlayActionRow`, `ReadyPlayScreenBackground`, `ReadyPlayDrawerSurface`. |
| — | 2D to 3D bridge. | Every primitive previews its RealityKit counterpart: cards as holographic panels, pills/chips as metallic interactive elements, neon/glow via particles + bloom, live fluid parameters via observable entity binding. |
| — | Hybrid preview requirement. | Optional `RealityView` + `ViewAttachmentComponent` previews in `ReadyPlayArenaBridge.swift` as holographic HUD elements in a cinematic environment. |

### 4.4 Core Experience Features

| PRD ID | Requirement | Detail From Source |
|---|---|---|
| PRD-005 | Hyper-realistic pouring milk simulation. | Pouring, viscosity control, splashes, foam, creamy opacity, realistic fluid behavior. Proper fluid solver path: particle systems, SPH, or GPU-based simulation—not UI animation alone. |
| PRD-006 | Advanced real-time lighting and materials. | PBR, subsurface scattering for milky look, caustics, dynamic shadows, bloom, cinematic depth. This is what makes it go from “cool” to convincing. |
| PRD-007 | Touch and gesture interactions. | Tilt glass, swipe to pour, pinch to adjust viscosity, rotate/inspect. Drag to tilt, swipe to pour, pinch for viscosity—all synced with feedback where available. |
| PRD-008 | Haptic feedback across platforms. | Core Haptics on iOS; Vibration API on web (less precise). Custom high-quality vibration patterns that feel like liquid moving. |
| PRD-009 | Spatial audio system. | Matching pouring, sloshing, and impact sounds. 3D/spatial audio on Apple; Web Audio API or Howler.js on web. Audio tightly synced to fluid events. |
| — | Interactive 3D elements. | Grab/spin glass or fluid containers; inspect parameters in-scene. |

### 4.5 Hardware And Sensor Integration

| PRD ID | Requirement | Detail From Source |
|---|---|---|
| PRD-010 | Device Motion / Accelerometer on web; Core Motion on iOS. | Phone tilt controls gravity and pour angle in the simulation. Add after pointer/touch model is proven. |
| PRD-011 | LiDAR and TrueDepth scanning. | Scan objects, environments, and faces; import scans into fluid scenes or export pipeline. |
| PRD-012 | ARKit / RealityKit World Tracking. | Accurate native motion tracking for AR and spatial experiences. |
| PRD-013 | Core Haptics and Spatial Audio. | Immersive feedback integrated with fluid events—not disconnected UI beeps. |
| PRD-014 | Apple Pencil support on iPadOS. | Precision control and inspection on iPad. |
| — | Metal Performance Shaders. | Fast GPU calculations for fluid simulation and post-processing on Apple platforms. |
| — | Dynamic Island / Live Activities. | Potential live fluid status or lightweight animation on lock screen or Dynamic Island. |
| — | AVFoundation. | High-quality audio recording and playback for pouring sounds on Apple. |

### 4.6 Scanning And 3D Printing Pipeline

| PRD ID | Requirement | Detail From Source |
|---|---|---|
| PRD-015 | Real-world scanning using LiDAR and TrueDepth. | Object, environment, and face scanning from iPhone/iPad. |
| PRD-016 | AI-powered automated post-processing in Blender. | Clean topology, repair holes, smooth surfaces, retopologize, optimize for printing. AI agent drives Blender `bpy` (Claude/GPT/Ollama; Blender MCP candidate). Phone scans are not print-ready without cleanup. |
| PRD-017 | Model export for 3D printing. | Export `.obj` and `.usd` (and downstream printable formats) after cleanup validation. |

### 4.7 Technology Stack Requirements

| PRD ID | Requirement | Detail From Source |
|---|---|---|
| PRD-018 | Web stack. | Vite + React + TypeScript + Three.js + React Three Fiber + `@react-three/drei` + WebGPU (compute shaders, TSL). Fluid: GPU-based (`webgpu_compute_particles_fluid`, r3f-fluid-sim style, Water Pro–style systems, custom viscosity/splashes/caustics/subsurface scattering). State: Zustand or Jotai. Sensors: DeviceMotion API. |
| PRD-019 | iOS/iPadOS stack. | Swift + SwiftUI + RealityKit 4 + RealityView + Reality Composer Pro + Metal + Metal Performance Shaders. Mandatory components: `PhysicsBodyComponent`, `CollisionComponent`, `ManipulationComponent`, `ViewAttachmentComponent`, `ParticleEmitterComponent`, `MeshInstancesComponent`, `EnvironmentResource`, `EnvironmentBlendingComponent`, `GestureComponent`, observable entities. `RealityView.postProcess` with MPS (bloom, vignette, film grain, color grading, distortion). Fluid: Metal Compute Shaders + RealityKit particles (Marching Cubes or custom solvers). Haptics: Core Haptics / `UIImpactFeedbackGenerator`. Audio: AVFoundation + `SpatialAudioComponent` + `AVAudioEngine`. Scanning: ARKit + LiDAR + TrueDepth. |
| PRD-020 | Apple Watch stack. | Swift + Core Haptics + sensor APIs as companion controller only. |
| PRD-021 | Backend and AI. | Python + FastAPI + Claude 3.5/GPT-4o + Blender Python API (`bpy`). Receives scans; returns polished models. |
| PRD-022 | Real-time sync and auth. | Firebase Firestore + Firebase Authentication for cross-device state when product needs accounts or saved creations. Alternatives noted in source: Supabase, Convex. |
| PRD-023 | Shared token tooling. | Style Dictionary or Tokens Studio for cross-platform token distribution. |
| PRD-024 | Primary 3D asset format. | USDZ primary on Apple; glTF/GLB for web via conversion (Reality Converter, USD tooling). |

### 4.8 Non-Functional Requirements

| PRD ID | Requirement | Detail From Source |
|---|---|---|
| PRD-025 | User flow and interaction design. | Define tilt vs pour vs viscosity sliders vs ambient vs interactive modes. Minimal HUD overlays. Apple Watch as companion controller while heavy rendering stays on larger devices. Real-time fluid response. |
| PRD-026 | Asset pipeline. | Models, textures, shaders across web, iOS, Blender. Reality Composer Pro → USDZ workflow. Keep assets in sync across platforms. |
| PRD-027 | Performance optimization. | 60 fps minimum; 120 fps preferred on capable devices. GPU-native via RealityKit 4 and WebGPU. Profile with Instruments. LOD tricks, smart culling, simplified mobile shaders, `MeshInstancesComponent`. Fluid sims are heavy—plan fallbacks. |
| PRD-028 | Accessibility. | Motion sensitivity: reduce or optionally disable fluid motion. Low vision: legible controls, not glow-only affordances. VoiceOver on native HUD attachments. |
| PRD-029 | Deployment strategy. | Web app + native iOS/iPadOS with Watch companion; Firebase when sync/auth needed. Phased implementation—not one launch. |
| — | Sound design implementation. | AVFoundation + Spatial Audio on Apple; Web Audio API / Howler.js on web; event-synced pour/slosh/impact. |
| — | Privacy. | Explicit consents for sensors, camera, scanning, and saved user assets. |
| — | Extensibility. | Architecture should allow later slices without rewriting the core scene model. |

### 4.9 Native Implementation Patterns (From Source Section 9)

| Pattern | Requirement |
|---|---|
| `CinematicFluidArenaView` | Root entity hierarchy: glass/container, fluid particles, HUD attachments, `postProcess` closure. Live updates via `onChange(of: model)`. |
| Physics and fluid interaction | Clone templates; apply impulses/forces from tilt/pour; collision callbacks trigger particle bursts (splashes/foam), haptics, and audio. |
| Design system integration | Runtime design toggle + hybrid previews in `ReadyPlayArenaBridge.swift` + translation tables. |
| On-device testing | Test physics, GPU performance, haptics, and sensors on real devices—not simulator-only for native fidelity claims. |
| Immersion preservation | Never collapse the product into static 2D panel interfaces. |

### 4.10 Development Hardware And Agent Handoff

| Item | Requirement |
|---|---|
| MacBook M1+ | Mandatory for iOS/RealityKit/Xcode development. |
| iPhone 12 Pro+ | LiDAR and on-device sensor testing. |
| iPad Pro | Recommended for iPadOS, Pencil, and larger immersive testing. |
| Apple Watch | Companion controller and haptic testing. |
| Agent handoff order | (1) Design toggle + ReadyPlay primitives + hybrid previews. (2) RealityView fluid scene with component and post-process patterns. (3) On-device verification. (4) Preserve full immersion. |

### 4.11 Early Source Themes Preserved

These appeared in the long PRD before the numbered `PRD-*` block and are kept here so nothing is lost:

| Theme | Requirement |
|---|---|
| Desired tech feel | Cinematic and beautiful without playful styling; Vite on web; Motion/Framer Motion is UI-only, not the simulation engine. |
| Physics and simulation | Proper fluid solver required; hardest technical part of the product. |
| Performance | LOD, simplified shaders on mobile, smart culling from day one of optimization work. |
| User flow question | Experience may be interactive, ambient, or both—must be decided explicitly. |
| Tech stack lock-in | Specific libraries and versions must be chosen per slice so later surfaces do not break. |
| WebGPU rationale | Compute shaders for particle interaction, viscosity, surface tension, splashes, caustics, subsurface scattering at scale. |
| RealityKit limits | Strong for rendering, AR, rigid physics, particles, manipulation, holographic HUDs; full pouring-milk fluid requires custom Metal or particle systems—not built-in fluid solver. |
| Web accessibility path | Three.js + R3F + shader examples + WebGPU compute is the most accessible path for cinematic milk-like fluid today. |
| Native deformation path | Low Level Mesh API or Metal shaders can deform geometry in real time on Apple when particle-only effects are insufficient. |
| Haptics on web | `UIFeedbackGenerator` on iOS; Vibration API on web (less precise than Core Haptics). |
| Bootstrap command | `npm create vite@latest my-app -- --template react` then add `three @react-three/fiber @react-three/drei`. |
| Paid/plugin path | Some pro milk/water results may need shader work or a paid Three.js water plugin—not fully out-of-the-box. |

### 4.12 Recommended Fluid Simulation Libraries (Source Research)

| Platform | Recommended path | Notes |
|---|---|---|
| Web (R3F) | `r3f-fluid-sim`, ardeshiir stable-fluid demo, official `webgpu_compute_particles_fluid` (MLS-MPM) | Combine with `@react-three/drei` and compute shaders for viscosity and splashing. |
| Web (premium) | Three.js Water Pro–style WebGPU shaders + custom particles | FFT waves, physically based shading, caustics, foam, subsurface scattering; ~80% of target quickly per source reality check. |
| Web (open source) | SPH/PIC-FLIP solvers (e.g. jeantimex/fluid), Jos Stam–style grid solvers (kishimisu), custom TSL compute in R3F | Full GPU-accelerated hydrodynamics; higher build cost. |
| Web (legacy/helper) | `GPUComputationRenderer`, ready-made water examples retuned for opaque viscous liquid | Useful before committing to full WebGPU compute stack. |
| iOS / iPadOS | Metal Compute Shaders + RealityKit particles (Marching Cubes or custom solvers) | Pair with RealityKit post-processing for caustics and subsurface scattering. |
| iOS (early note) | NVIDIA Flex–class solvers mentioned as native option in early brainstorming | Treat as research path, not locked stack. |
| Backend cleanup | Blender MCP + Claude 3.5 / GPT-4o / Ollama driving `bpy` | Topology repair, hole fill, smooth, retopologize, print optimization. |
| Backend transport | FastAPI (primary) or lightweight Node backend receiving scans and returning polished models | AI agent controls Blender remotely. |

### 4.13 WebGPU And Milk-Pour Interaction Requirements

Full guide: section **17** and `docs/web-fluid/webgpu-explainer.md`.

| Requirement | Detail |
|---|---|
| Compute performance | Target 10k+ fluid particles in real time on capable hardware; 60 fps minimum with LOD fallbacks. |
| Milk-specific sim params | Opacity, viscosity, surface tension, splashes, caustics, subsurface scattering, dynamic foam. |
| Pour interaction | Rotate container mesh → particles flow out; tilt (Device Motion or pointer) → gravity vector changes. |
| Renderer integration | Three.js `WebGPURenderer` + Three Shading Language (TSL) via R3F—not raw WGSL-only workflow unless needed. |
| Prototype sequence | Vite + R3F + WebGPU template → import official fluid particles example → test Water Pro or free water demo → add glass pour interaction. |
| Reality check | Not 100% Niagara/out-of-box like a game engine; iterative shader tuning required for custom milk viscosity and contact splashes. |

### 4.14 Conversation Gap Audit (Explicitly Required In Source)

The source PRD audited the conversation and flagged these as **must not be lost**. All are now requirements:

| Gap item | Requirement |
|---|---|
| Design tokens | Shared colors, easing, glow intensity, blur, fluid parameters, cinematic parameters across web and native. |
| Milk-specific characteristics | Pouring milk only: opacity, viscosity, creamy look, splashes, foam—not generic water. |
| Sound design implementation | AVFoundation + Spatial Audio on Apple; Web Audio API or Howler.js on web; event-synced pour/slosh/impact. |
| Performance optimization | Explicit LOD, smart culling, simplified mobile shaders, Instruments profiling, `MeshInstancesComponent`. |
| User flow and interactions | Tilt vs pour vs viscosity sliders vs ambient vs interactive modes—define concretely (open: G1 in gap ledger). |
| Asset pipeline | Models, textures, shaders synced across web, iOS, Blender; Reality Composer Pro → USDZ. |
| Scan quality honesty | Phone LiDAR/TrueDepth scans are not print-ready without Blender cleanup. |
| Sync alternatives | Firebase primary; Supabase and Convex noted as alternatives if avoiding Google stack. |
| Auth alternatives | Firebase Auth or Supabase Auth with Apple Sign-In for saved scans/creations. |

### 4.15 Development Toolchain And Hardware Constraints

| Category | Requirement |
|---|---|
| Web development | VS Code, Node.js, TypeScript, Vite, React, Three.js, R3F, Drei, WebGPU. |
| Apple development | MacBook M1+ mandatory; Xcode; Swift, SwiftUI, RealityKit 4, Reality Composer Pro, Metal, MPS. |
| Backend / AI | Python, FastAPI, Blender with `bpy`, Claude 3.5 / GPT-4o API (or local Ollama). |
| Token tooling | Style Dictionary or Tokens Studio. |
| Test hardware | iPhone 12 Pro+ (LiDAR), iPad Pro recommended, Apple Watch for companion testing. |
| Constraint | iOS/iPadOS/RealityKit builds cannot be done without a Mac. Web can be built on Mac or Windows. |
| On-device testing | Physics, GPU, haptics, and sensors must be validated on real devices—not simulator-only for native fidelity claims. |

The indexed trace lives in `requirement-table.md`. Explainer pages live under `docs/`.

## 5. Recommended First Slice

The first build should be a web cinematic milk-pour prototype.

### Why This Slice First

The long PRD repeatedly says the web path is the most accessible way to prove realistic milk-like fluid because Three.js, React Three Fiber, WebGPU, shader examples, and browser iteration speed give the fastest route to visual proof. Native RealityKit/Metal and the scan/Blender/export system are important, but they multiply work before the central illusion is proven.

Build:

- Vite + React + TypeScript app.
- Three.js + React Three Fiber scene.
- Drei helpers where useful.
- WebGPU capability check with clear fallback messaging.
- Controlled particle/fluid approximation or official WebGPU fluid example.
- Full-viewport cinematic scene.
- Glass/container mesh with pointer/touch tilt controls.
- Milk-like material cues: opaque off-white color, creamy softness, viscosity, splash/foam hints.
- Minimal shared token object for colors, glow, easing, and fluid parameters.
- Reduced-motion toggle.
- Basic performance readout.

### First Technical Direction

Use a controlled particle/fluid approximation or the simplest available Three.js WebGPU fluid example first. Do not wait for a perfect SPH/PIC-FLIP/Marching-Cubes-quality solver. The first prototype only needs to prove credible milk behavior:

- opaque off-white material with soft subsurface-like feel;
- visible viscosity difference from water;
- splash or foam hints on impact;
- lighting and shadows that sell depth;
- stable interactive frame rate on the target browser.

Defer:

- Native iOS/iPadOS.
- Apple Watch.
- Device Motion.
- Firebase/auth/sync.
- Blender/scanning/3D printing.
- USDZ/glTF conversion.

### First Folder Shape

```text
fluid-simulation-app/
├── apps/
│   └── web/                 # Vite + React + R3F + WebGPU prototype
├── packages/
│   └── design-tokens/       # Can start as a tiny token object
├── docs/
│   └── product/             # Product vision and acceptance notes
└── plans/
```

## 6. Tech Stack

### Web Slice

| Layer | Technology |
|---|---|
| App shell | Vite |
| UI | React |
| Language | TypeScript |
| 3D engine | Three.js |
| React 3D bridge | React Three Fiber |
| Helpers | `@react-three/drei` |
| GPU / simulation path | WebGPU, Three.js TSL, compute shaders, or controlled particle approximation |
| State | Zustand or Jotai |
| Accessibility | Reduced-motion support |
| Performance | Browser performance tools and frame-rate readout |

### Web Tech Rationale

Framer Motion can support UI polish, but it is not the simulation engine. The milk pour needs Three.js/R3F for the scene and WebGPU/compute-style work for particle or shader behavior. WebGPU matters because the expensive parts of the illusion are parallel: particle interaction, viscosity, splashes, caustics, and subsurface-like milk visuals.

For implementation options, read:

- `docs/web-fluid/web-fluid-rationale.md`
- `docs/web-fluid/webgpu-explainer.md`
- `docs/web-fluid/implementation-options.md`
- `docs/web-fluid/milk-interaction-model.md`

### Native Roadmap

| Layer | Technology |
|---|---|
| Language | Swift |
| UI / app structure | SwiftUI |
| 3D / AR | RealityKit 4, RealityView |
| GPU | Metal, Metal Performance Shaders |
| Fluid approximation | Metal Compute Shaders + RealityKit particle system |
| Haptics | Core Haptics / feedback generators |
| Audio | AVFoundation, Spatial Audio, AVAudioEngine |
| Sensors | Core Motion, ARKit, LiDAR, TrueDepth |
| Watch | watchOS Swift + haptics + sensor APIs |

### Native Tech Rationale

RealityKit is the native scene host, not a magic complete milk-fluid solver. It is strong for rendering, AR, physics, particles, manipulation, attachments, and spatial experiences. The fluid-specific work still needs Metal, custom particles, compute shaders, or a controlled solver approach.

Native work should start only after the web prototype teaches the interaction parameters and visual target. Before building native, verify local Xcode/iOS SDK support for the RealityKit and RealityView features named here.

For implementation details, read:

- `docs/realitykit-metal/native-fluid-rationale.md`
- `docs/realitykit-metal/scene-architecture.md`
- `docs/realitykit-metal/component-map.md`

### Backend / Asset Roadmap

| Layer | Technology |
|---|---|
| Backend | Python + FastAPI |
| AI cleanup | Claude/GPT/local model controlling Blender |
| 3D automation | Blender Python API (`bpy`) |
| Auth / sync | Firebase Auth + Firestore when product scope requires it |
| Native asset format | USDZ |
| Web asset format | glTF / GLB |

### Backend And Asset Rationale

The backend is not part of Slice 1. Add it when the product has scans, saved creations, sync, exports, or user accounts. Phone scans are useful but not automatically print-ready; Blender cleanup exists to repair topology, fill holes, smooth surfaces, retopologize, and prepare export.

For implementation details, read:

- `docs/scanning-blender/print-readiness.md`
- `docs/scanning-blender/ai-blender-architecture.md`
- `docs/scanning-blender/asset-format-bridge.md`

The full stack trace lives in `tech-stack-table.md`.

## 7. Design System

Shared tokens are required to make the web and native surfaces feel like the same product. The first slice should define a small token object for:

- Background depth and milk color.
- Glow and bloom intensity.
- Easing and motion timing.
- Fluid parameters such as viscosity, opacity, foam, splash scale, and gravity multiplier.
- Interaction sensitivity and reduced-motion behavior.

Later native work can expand this into Style Dictionary, Tokens Studio, and ReadyPlay 2D-to-3D bridge previews.

## 8. Interaction Model

The first interaction model should be direct and tactile:

- User tilts or rotates a container with pointer/touch.
- Tilt changes the apparent gravity or pour angle.
- Milk responds visibly with flow, viscosity, and disturbance.
- Splash or foam hints appear on impact.
- Minimal HUD exposes only necessary controls such as reset, reduced motion, and performance.

Device Motion and Watch control should come after this model works with pointer/touch.

## 9. Native Implementation Direction

The native product should use RealityKit as the immersive scene host and Metal for heavy simulation or post-processing. RealityKit is strong for AR, rendering, particles, physics, manipulation, and HUD attachments, but it is not a complete out-of-the-box milk solver.

The native architecture seed is `CinematicFluidArenaView`:

- Root entity hierarchy.
- Glass/container entity.
- Fluid particles/effects.
- HUD attachments.
- `postProcess` effects.
- Model-driven updates.
- Collision-driven particles, haptics, and audio.

Native planning must verify SDK availability before assuming RealityKit 4, RealityView post-processing, and named components are available locally.

## 10. Scanning And 3D Printing Direction

The source PRD includes a scanning and 3D printing subsystem:

- Use LiDAR and TrueDepth to scan objects, environments, and faces.
- Clean scans in Blender using AI-guided or scripted `bpy` workflows.
- Repair topology, fill holes, smooth surfaces, retopologize, and prepare exports.
- Export `.obj`, `.usd`, or downstream printable formats.

This subsystem is real but later. It should not block the first milk-pour prototype.

## 11. Non-Functional Requirements

| Area | Requirement |
|---|---|
| Performance | Target 60 fps minimum; prefer 120 fps on capable devices. Use LOD, smart culling, simplified shaders, profiling, and GPU-native paths. |
| Accessibility | Provide reduced-motion behavior and low-vision-aware controls. Native HUD attachments should support VoiceOver where applicable. |
| Privacy | Sensor, camera, scanning, and saved-asset flows require explicit consent. |
| Deployment | Web can deploy first. Native, backend, sync, and export deploy paths should be planned only when those slices are active. |
| Source hygiene | Use clean decanter artifacts as planning truth; keep the original source PRD as provenance. |

## 12. Open Decisions

| Decision | Current Answer |
|---|---|
| First web fluid technique | Start with the simplest controlled particle/fluid approximation or official Three.js WebGPU fluid example. |
| Backend in Slice 1 | No. Add backend only when scanning, saved creations, sync, or exports exist. |
| Device Motion in Slice 1 | No. Add after pointer/touch tilt works. |
| Native SDK assumptions | Verify Xcode/iOS SDK before native planning. |
| Asset conversion | Defer USDZ/glTF workflow until real assets must cross surfaces. |
| Milk realism acceptance | Use opacity, viscosity, splash/foam hints, lighting depth, and stable interaction as the first credible bar. |

## 13. Acceptance Criteria For The First Build

- App runs locally with one command.
- Scene fills the viewport and reads as cinematic.
- User can tilt/pour with pointer or touch.
- Milk reads as opaque, creamy, and more viscous than water.
- Interaction creates visible motion response, splash/foam hint, or particle disturbance.
- Reduced-motion mode lowers or freezes high-motion effects.
- WebGPU unsupported path explains the requirement instead of crashing.
- Performance readout gives a basic signal for frame-rate or rendering health.

## 14. Handoff

Future agents should start with this order:

1. Read `README.md`.
2. Read this draft (sections 0–4 for build truth; section 15 for the source’s final consolidated block; sections 17–18 for WebGPU path and repo picks).
3. Check `gap-ledger.md`.
4. Use `first-build-slice.md` for implementation scope.
5. Use `docs/README.md` for explainer details.

## 15. Final Comprehensive PRD Block (Source Edition 1.0)

This section preserves the source document’s **absolute final, fully mended** PRD block verbatim in structure and content. It is the conversation-scraped blueprint the original chat marked as 100% complete. Use it alongside section 4 (indexed tables), `requirement-table.md`, and `gap-ledger.md`.

**Decanter truth contract:** The source block’s claim that “no gaps remain” is preserved as historical wording. For implementation sign-off, open items in `gap-ledger.md` still govern what is actually decided (user flow mode, exact fluid library lock-in, SDK verification, etc.). Section 0 **Build Direction** still defines the first solvable slice as web-only.

**Source attestation (from original PRD chat):**

> Here is the absolute final, fully mended, 100% complete PRD.
>
> I have gone through every message in our entire conversation history, cross-checked every bullet point, every feature, every tech detail, and every requirement we ever mentioned. All gaps have been closed. Nothing is missing. Everything is consolidated, polished, and consistent.

---

**Product Requirements Document - Cinematic Fluid Experience**  
**Document Type:** Final Comprehensive Reusable Blueprint / LLM Skill Specification (`skill.md` equivalent)  
**Version:** 1.0 – 100% Complete Edition (Scraped & Synthesized from Full Conversation)  
**Date:** May 18, 2026

### 1. Vision & Goals

**PRD-001**  
Create a stunning, cinematic web and Apple ecosystem experience featuring hyper-realistic fluid simulation — specifically pouring milk that moves and looks completely real. The goal is for users to see it and immediately think “this looks like a video game” or “this is beautiful.”

**Non-Negotiable Philosophy:** Immersion-first. Full-screen `RealityView` canvas (`ignoresSafeArea()`, system chrome hidden). SwiftUI used only for minimal auto-hiding overlays and HUD attachments. Everything must feel premium, game-like, cinematic, satisfying, and addictive. No “crummy basic” interfaces and no playful or cartoonish styling.

### 2. Platform Strategy

**PRD-002** • **PRD-003**

- **Web**: Vite + React + Three.js + React Three Fiber + WebGPU
- **iOS & iPadOS**: SwiftUI + RealityKit 4 + RealityView + Metal + Metal Performance Shaders (target iOS 19+ with Xcode 17+ and Reality Composer Pro)
- **Apple Watch**: Companion controller for tilt input, haptics, and simple controls

Full visual and behavioral consistency across all platforms using shared design tokens.  
iPadOS advantages: larger screen real estate, better multi-touch gestures, Apple Pencil support, Stage Manager. Apple Watch acts as companion device (tilt/haptics controller) while heavy rendering runs on iPhone/iPad/web.

### 3. Design System

**PRD-004**  
Implement shared Design Tokens across web and native for colors, spacing, animations, cinematic easing curves, glow, blur, fluid parameters, and visual consistency so the fluid motion and visuals feel identical across platforms. Use **Style Dictionary** or **Tokens Studio**.

**Mood, Aesthetic & Design System Bridge (ReadyPlay 2026)**  
**Core Feeling:** Premium cinematic experience with dark-mode depth and neon/glow accents.  
**Lighting & Effects:** Volumetric fog, dynamic spotlights, bloom, vignette, film grain.  
**Motion:** Physics impulses, spring collisions, slow-mo on key fluid events, subtle pulses.  
**Design System Rules (ReadyPlay Primitives):** `ReadyPlayCard`, `ReadyPlayStatPill`, `ReadyPlayChip`, `ReadyPlaySectionHeader`, `ReadyPlayActionRow`, `ReadyPlayScreenBackground`, `ReadyPlayDrawerSurface`.  
**Bridge to 3D Arena (2D → 3D):** Every primitive must preview its RealityKit counterpart.  
**Hybrid Preview Requirement:** All primitives must have optional `RealityView` + `ViewAttachmentComponent` previews in `ReadyPlayArenaBridge.swift`.

### 4. Core Features

**PRD-005** • **PRD-006** • **PRD-007** • **PRD-008** • **PRD-009**

- Hyper-realistic pouring milk simulation (milky opacity, realistic viscosity, splashes, foam, creamy look)
- Advanced real-time lighting and materials (PBR, subsurface scattering for milky look, caustics, dynamic shadows)
- Touch/gesture interactions (tilt glass, swipe to pour, pinch to adjust viscosity, rotate/inspect) with haptics
- Matching spatial audio (sloshing, pouring, impact sounds)
- Interactive 3D elements (grab/spin glass or fluid containers, inspect parameters)

### 5. Hardware & Sensor Integration

**PRD-010** • **PRD-011** • **PRD-012** • **PRD-013** • **PRD-014**

- Device Motion / Accelerometer on web and Core Motion on iOS for tilt control
- LiDAR and TrueDepth scanning for objects, environments, and faces (import into fluid scenes)
- ARKit / RealityKit World Tracking
- Core Haptics and Spatial Audio
- Metal Performance Shaders
- Dynamic Island / Live Activities
- Apple Pencil support on iPadOS

### 6. Scanning & 3D Printing Pipeline

**PRD-015** • **PRD-016** • **PRD-017**

- Object scanning using LiDAR and TrueDepth camera
- AI-powered post-processing that cleans and optimizes scanned models in Blender (fixing topology, repairing holes, smoothing surfaces, retopologizing)
- Export scanned models as .obj or .usd for high-quality 3D printing

### 7. Tech Stack

**PRD-018** • **PRD-019** • **PRD-020** • **PRD-021** • **PRD-022** • **PRD-023** • **PRD-024**

**Web Platform**

- Vite + React + TypeScript + Three.js + React Three Fiber + @react-three/drei + WebGPU (compute shaders, TSL)
- Fluid Simulation: GPU-based (r3f-fluid-sim style, official `webgpu_compute_particles_fluid`, Water Pro–style systems with custom viscosity, splashes, caustics, subsurface scattering)
- State Management: Zustand or Jotai

**Apple Platforms – RealityKit 4 (Primary Canvas)**

- Swift + SwiftUI + RealityKit 4 + RealityView + Reality Composer Pro
- **Mandatory RealityKit 4 Components:** `PhysicsBodyComponent`, `CollisionComponent`, `ManipulationComponent`, `ViewAttachmentComponent`, `ParticleEmitterComponent`, `MeshInstancesComponent`, `EnvironmentBlendingComponent`, `GestureComponent`, Observable entities
- **Metal Post-Processing:** `RealityView.postProcess` closure with Metal Performance Shaders (bloom, vignette, film grain, color grading, distortion)
- Fluid Simulation: Metal Compute Shaders + RealityKit particle system
- Haptics: Core Haptics / `UIImpactFeedbackGenerator`
- Audio: AVFoundation + `SpatialAudioComponent` + `AVAudioEngine`

**Backend & AI Pipeline**

- Python + FastAPI + Claude 3.5/GPT-4o + Blender Python API (`bpy`)
- Real-time Sync: Firebase (Firestore + Authentication)
- Primary 3D format: USDZ (with glTF conversion for web)

### 8. Non-Functional Requirements & Performance Delivery

**PRD-025** • **PRD-026** • **PRD-027** • **PRD-028** • **PRD-029**

- **Performance:** 60 fps minimum (120 fps preferred on capable devices). Full GPU-native rendering via RealityKit 4 and WebGPU. Profile with Instruments. Use LOD, smart culling, `MeshInstancesComponent`, and simplified shaders on mobile.
- **User Flow & Interactions:** Intuitive tilt/pour/pinch gestures, real-time fluid response, Apple Watch companion control, immersive full-screen experience with minimal HUD overlays.
- **Asset Pipeline:** Reality Composer Pro → USDZ workflow for models, textures, and shaders. Keep everything in sync across web, iOS, and Blender.
- **Accessibility:** Motion sensitivity options (reduce fluid motion), VoiceOver support on attachments, low vision considerations.
- **Sound Design Implementation:** AVFoundation + Spatial Audio on Apple; Web Audio API on web. Audio tightly synced to fluid events.
- **Deployment Strategy:** Web app + native iOS/iPadOS (with Watch companion) connected via Firebase.
- Privacy (explicit consents for sensors/scanning), extensibility, and phased implementation.

### 9. Core Implementation Patterns (iOS/RealityKit)

**RealityView Structure (`CinematicFluidArenaView`):** Root Entity hierarchy with glass/container, fluid particles, HUD attachments, and `postProcess` closure. Live updates via `onChange(of: model)`.  
**Physics & Fluid Interaction Pattern:** Clone templates, apply impulses/forces based on tilt/pour gestures, collision callbacks → particle bursts (splashes/foam), haptics, and audio.  
**Design System Integration:** Runtime toggle + hybrid previews in `ReadyPlayArenaBridge.swift`.

### 10. Hardware Required for Development

- MacBook (M1 or newer) — mandatory for iOS/RealityKit development
- iPhone 12 Pro or newer (for LiDAR)
- iPad Pro (recommended)
- Apple Watch (for testing companion features)

### Handoff Instructions for Developers / AI Agents

1. Start with design system toggle + ReadyPlay primitives + hybrid previews.
2. Build RealityView fluid scene following exact component and post-process patterns.
3. Test exclusively on-device for physics, GPU performance, haptics, and sensors.
4. Preserve full immersion — never reduce to static 2D interfaces.

---

This document is now the **single source of truth** within this clean-representation package. Every single thing discussed in the source chat is present here, tracked with IDs in `requirement-table.md`, and integrated with expanded research in section 4.12–4.15.

You can treat this block as the master PRD body for copy/export; pair it with `first-build-slice.md` and `gap-ledger.md` before claiming implementation is fully specified.

**Suggested next steps from the source PRD:**

- Break into implementation phases (see section 0 **Builder Order** and `first-build-slice.md`).
- Create GitHub issues from `PRD-*` rows.
- Start the first code skeleton (web cinematic milk-pour prototype).

## 16. Complete Inventory Table (36 Items — Snapshot)

Pure exhaustive inventory from the source conversation — one row per feature, idea, requirement, or decision. **Inventory `PRD-001`–`PRD-036` are not the same IDs** as the 29-row decanter table in `requirement-table.md`.

**Authoritative table:** `complete-inventory-table.md` — semantic dedup applied (**37 unique** rows `PRD-001`–`PRD-037`; duplicate F-ledgers cleared to archive at bottom of that file).

**Source attestation:**

> Here is the complete inventory table — a pure, exhaustive list of every single feature, idea, requirement, and decision we discussed from the very first message to now.

| ID | Category | Feature / Idea | Description / Details |
|---|---|---|---|
| PRD-001 | Vision | Hyper-realistic pouring milk simulation | Milk that looks and moves realistically (opacity, viscosity, splashes, foam, creamy look) |
| PRD-002 | Vision | Cinematic / Video game quality feel | Beautiful, fluid, immersive, "wow this looks like a game" |
| PRD-003 | Vision | Non-playful, premium aesthetic | No cartoonish or basic styling — purely cinematic |
| PRD-004 | Platform | Web Platform | Vite + React + Three.js + React Three Fiber + WebGPU |
| PRD-005 | Platform | iOS & iPadOS | SwiftUI + RealityKit 4 + RealityView + Metal |
| PRD-006 | Platform | Apple Watch | Companion controller (tilt, haptics, simple controls) |
| PRD-007 | Platform | Android | Nice-to-have (Phase 2) — currently parked |
| PRD-008 | Design | Shared Design Tokens | Colors, spacing, easing, glow, blur, fluid parameters across all platforms |
| PRD-009 | Design | ReadyPlay Design System | ReadyPlayCard, StatPill, Chip, SectionHeader, ActionRow, etc. + 2D→3D bridge |
| PRD-010 | Design | Hybrid Preview System | RealityView + ViewAttachmentComponent previews in ReadyPlayArenaBridge.swift |
| PRD-011 | Core Feature | Fluid Simulation (Web) | WebGPU compute shaders + Water Pro style (viscosity, splashes, caustics, subsurface scattering) |
| PRD-012 | Core Feature | Fluid Simulation (iOS) | Metal Compute Shaders + RealityKit particle system |
| PRD-013 | Core Feature | Advanced Lighting & Materials | PBR, subsurface scattering, caustics, dynamic shadows, volumetric fog, bloom |
| PRD-014 | Core Feature | Touch & Gesture Interactions | Tilt glass, swipe to pour, pinch viscosity, rotate/inspect |
| PRD-015 | Core Feature | Haptic Feedback | Core Haptics (iOS), Vibration API (web), synced to fluid events |
| PRD-016 | Core Feature | Spatial Audio | Sloshing, pouring, impact sounds (AVFoundation + SpatialAudioComponent on Apple) |
| PRD-017 | Hardware | Device Motion / Accelerometer | On web + Core Motion on iOS for tilt control |
| PRD-018 | Hardware | LiDAR + TrueDepth Camera | Object, environment, and face scanning |
| PRD-019 | Hardware | ARKit / RealityKit World Tracking | Accurate motion tracking |
| PRD-020 | Hardware | Apple Pencil Support | On iPadOS |
| PRD-021 | Hardware | Dynamic Island / Live Activities | iOS feature support |
| PRD-022 | Scanning & Printing | Real-world Scanning | Import scanned objects into fluid scenes |
| PRD-023 | Scanning & Printing | AI-powered Blender Post-Processing | Auto cleanup, repair topology, retopologize, optimize for printing |
| PRD-024 | Scanning & Printing | Model Export | .obj and .usd formats for 3D printing |
| PRD-025 | Tech Architecture | Asset Pipeline | Reality Composer Pro → USDZ workflow, sync across web/iOS/Blender |
| PRD-026 | Tech Architecture | Real-time State Sync | Firebase (Firestore + Authentication) |
| PRD-027 | Tech Architecture | Backend & AI | Python + FastAPI + Claude 3.5 / GPT-4o controlling Blender |
| PRD-028 | Non-Functional | Performance Optimization | 60fps (120fps preferred), LOD, smart culling, MeshInstancesComponent |
| PRD-029 | Non-Functional | Accessibility | Motion sensitivity reduction, VoiceOver, low vision support |
| PRD-030 | Non-Functional | Full-screen Immersion | ignoresSafeArea(), hidden system chrome, minimal HUD |
| PRD-031 | Non-Functional | User Flow & Interactions | Intuitive gestures, real-time response, Watch companion control |
| PRD-032 | Non-Functional | Deployment Strategy | Web app + native iOS/iPadOS + Watch companion via Firebase |
| PRD-033 | Implementation | RealityKit 4 Mandatory Components | PhysicsBody, Collision, Manipulation, ViewAttachment, ParticleEmitter, MeshInstances, EnvironmentBlending, GestureComponent |
| PRD-034 | Implementation | Metal Post-Processing | postProcess closure with bloom, vignette, film grain, color grading |
| PRD-035 | Implementation | RealityView Structure | CinematicFluidArenaView with root entity hierarchy |
| PRD-036 | Development Hardware | Required Hardware | MacBook (M1+), iPhone 12 Pro+, iPad Pro, Apple Watch |

**Total items tracked: 36**

Copy/export: use `complete-inventory-table.md` (not this embedded snapshot — it predates PWA row `PRD-037` and F-ledger dedup). Optional follow-ups from source chat: Status/Priority column, tables split by category, or phase mapping to section 0 **Builder Order**.

## 17. WebGPU Fluid Simulation Guide (May 2026)

Expanded explainer from the source conversation. Full canonical page: `docs/web-fluid/webgpu-explainer.md`.

**WebGPU fluid simulation is currently one of the strongest paths for the cinematic pouring milk experience on the web.** It gives direct GPU access via compute shaders, enabling thousands of particles or grid-based solvers to run in real time with realistic viscosity, splashes, foam, and subsurface scattering for that creamy milk look.

### Current State (as of May 2026)

WebGPU is mature and widely supported. Three.js integrates via **WebGPURenderer** and **Three Shading Language (TSL)** — node-based, easier than raw WGSL. React Three Fiber works well with both.

**Key strengths for this project:**

- 10k+ particles on modern devices.
- Compute shaders for viscosity, surface tension, collisions.
- PBR, caustics, reflections, bloom, subsurface scattering.
- Device Motion tilt maps cleanly to simulation gravity.

### Best Options Right Now

| Priority | Option | Why |
|---|---|---|
| Start here | Three.js `webgpu_compute_particles_fluid` (MLS-MPM) | Official compute-shader liquid base; pouring, splashes, container interaction. |
| Most cinematic | Three.js **Water Pro** (WebGPU + TSL) | FFT waves, foam, caustics, subsurface scattering; adapt for contained milk (viscosity, opacity); WebGL fallback. |
| Open source | `matsuoka-601/WebGPU-Ocean`, **Splash**, `kishimisu/WebGPU-Fluid-Simulation` | Particle 3D fluids or Jos Stam grid solvers. |
| R3F helpers | `R3F-WaterSurface`, Codrops-style TSL fluid demos | Reflections, distortion, reveal effects. |

Full ranked comparison (cost, difficulty, weaknesses): section **18**.

### How It Fits Pouring Milk

- **Tilt/pour:** Device Motion (after pointer/touch) applies gravity/forces.
- **Milk look:** Custom TSL — subsurface scattering, opacity, foam.
- **Interactions:** Pinch viscosity, swipe pour, glass mesh collisions.
- **Performance:** LOD + simplified mobile shaders; 60–120 fps on capable hardware.

**Reality check:** Not 100% drop-in for perfect milk — plan shader tweaks. Water Pro or MLS-MPM gets ~70–80% there quickly.

### Quick Start

```bash
npm create vite@latest my-fluid-app -- --template react-ts
cd my-fluid-app
npm install three @react-three/fiber @react-three/drei
```

Import `WebGPURenderer`; start from official fluid particles or Water Pro. See `first-build-slice.md` and `docs/web-fluid/first-prototype-tutorial.md`.

**Repo comparison:** section **18** and `docs/web-fluid/implementation-options.md`.

**Suggested follow-ups (from source chat):** starter template (tilting glass + pour), phase mapping to section 0 **Builder Order**.

## 18. WebGPU Fluid Repo Comparison (2026)

Side-by-side comparison of repos and payloads for WebGPU fluid in the cinematic milk-pour project (R3F). Full table: `docs/web-fluid/implementation-options.md`.

| Rank & Resource | Type | Strengths for Milk Pouring | Weaknesses | Difficulty | Cost | Best For |
|---|---|---|---|---|---|---|
| **1. Three.js Water Pro** (Dan Greenheck) | Commercial WebGPU ocean system | Cinematic production quality; FFT waves, foam, caustics, subsurface scattering, reflections, buoyancy; TSL + WebGPU; R3F-friendly; WebGL fallback | Paid asset | Medium (drop-in + tweak) | $149 one-time | **Top pick** for video-game cinematic feel |
| **2. Three.js `webgpu_compute_particles_fluid`** | Official MLS-MPM example | Compute particle fluid; thousands of particles; viscosity, splashes, pour into container; open source | “Particle soup” vs polished surface; custom milk rendering needed | Medium–high | Free | Physics + pouring behavior |
| **3. matsuoka-601 / WebGPU-Ocean** | Open 3D fluid sim | Real-time 3D fluid in box; MLS-MPM + screen-space rendering; strong waves/splashes | Box-contained; adapt for free pour | Medium | Free | Open 3D fluid base |
| **4. jeantimex / fluid** | SPH + PIC/FLIP | Sebastian Lague–style GPU physics; interactive pour and splashes | Technical rendering; less out-of-box beauty | High | Free | Most physically accurate behavior |
| **5. kishimisu / WebGPU-Fluid-Simulation** | Jos Stam stable fluids | Fast grid solver; WebGPU/TSL learning | 2D-ish; weak for 3D milk pour | Low | Free | Prototyping / background effects |
| **6. R3F-WaterSurface** + TSL | R3F components | React integration; reflections/distortion; Codrops-style reveals | Surface effects, not full physics | Low–medium | Free | UI + surface beauty layer |

### Recommendation

**Start with #1 (Water Pro) + #2 (MLS-MPM particles).**

- **Water Pro** — surface beauty, caustics, foam, subsurface scattering (creamy milk).
- **MLS-MPM** — pour physics, viscosity, splash on contact.
- Fastest path to convincing realism inside R3F.

### Quick Start Payload

```bash
npm create vite@latest milk-pour -- --template react-ts
cd milk-pour
npm install three @react-three/fiber @react-three/drei
# Then add Water Pro or start from official fluid example
```

### Additional Resources (2026)

- **Codrops WebGPU fluid tutorials** — TSL + ping-pong simulation guides.
- **Wawasensei WebGPU/TSL course** — structured R3F + WebGPU shader learning.
- **Three.js official examples** — up-to-date WebGPU patterns.
