# Fluid Simulation Tech Stack Table

Source: `../../PRD for Fluid Simulation App.md`  
Companion requirement map: `requirement-table.md`

## Stack Items

| Stack ID | PRD ID | Decanter ID | Layer | Technology | Purpose | Phase |
|---|---|---|---|---|---|---|
| FSTECH-001 | PRD-018 | FSPRD-007 | Web app shell | Vite | Fast React app scaffold and local dev server. | Slice 1 |
| FSTECH-002 | PRD-018 | FSPRD-007 | Web UI | React | Component model for controls, HUD, settings, and scene shell. | Slice 1 |
| FSTECH-003 | PRD-018 | FSPRD-007 | Web language | TypeScript | Safer shared types for scene state, tokens, and interaction parameters. | Slice 1 |
| FSTECH-004 | PRD-018 | FSPRD-007 | Web 3D engine | Three.js | Core browser 3D rendering engine. | Slice 1 |
| FSTECH-005 | PRD-018 | FSPRD-007 | Web 3D React bridge | React Three Fiber | React renderer for Three.js scenes. | Slice 1 |
| FSTECH-006 | PRD-018 | FSPRD-007 | Web 3D helpers | `@react-three/drei` | Cameras, controls, environment helpers, and useful R3F primitives. | Slice 1 |
| FSTECH-007 | PRD-018 | FSPRD-007 / FSPRD-015 | Web GPU rendering | WebGPU | GPU-native rendering and compute path for real-time fluid behavior. | Slice 1 |
| FSTECH-008 | PRD-018 | FSPRD-007 / FSPRD-015 | Web shaders | Three.js TSL / compute shaders | Particle interactions, viscosity, splashes, caustics, and milk-like material behavior. | Slice 1 / research |
| FSTECH-009 | PRD-018 | FSPRD-007 / FSPRD-015 | Web fluid prototype | Three.js `webgpu_compute_particles_fluid` or controlled custom particle approximation | First practical milk-pour visual proof. | Slice 1 |
| FSTECH-010 | PRD-018 | FSPRD-007 | Web state | Zustand or Jotai | Lightweight state for controls, reduced-motion mode, scene parameters, and performance readout. | Slice 1 |
| FSTECH-011 | PRD-010 | FSPRD-005 | Web sensors | DeviceMotion API | Phone tilt input for gravity/pour controls after pointer controls work. | Slice 2 |
| FSTECH-012 | PRD-028 | FSPRD-010 | Web accessibility | Reduced Motion API / app toggle | Reduce or freeze high-motion fluid effects for motion-sensitive users. | Slice 1 |
| FSTECH-013 | PRD-009 | FSPRD-004 / FSPRD-010 | Web audio | Web Audio API or Howler.js | Pouring, sloshing, and impact sounds synced to fluid events. | Later polish |
| FSTECH-014 | PRD-019 | FSPRD-008 | Apple language | Swift | Native app language for iOS, iPadOS, and Watch surfaces. | Later native slice |
| FSTECH-015 | PRD-019 | FSPRD-008 | Apple UI | SwiftUI | Minimal overlays, HUD attachments, settings, and native app structure. | Later native slice |
| FSTECH-016 | PRD-019 | FSPRD-008 / FSPRD-011 | Apple 3D / AR | RealityKit 4 | Native 3D scene, physics, particles, manipulation, and AR integration. | Later native slice |
| FSTECH-017 | PRD-019 | FSPRD-008 / FSPRD-011 | Apple immersive canvas | RealityView | Full-screen immersive scene container with attachments and live updates. | Later native slice |
| FSTECH-018 | PRD-019 | FSPRD-008 | Apple asset authoring | Reality Composer Pro | Native scene, model, material, and USDZ workflow. | Later asset pipeline |
| FSTECH-019 | PRD-019 | FSPRD-008 | Apple GPU | Metal | Low-level GPU rendering, compute shaders, and post-processing. | Later native slice |
| FSTECH-020 | PRD-019 | FSPRD-008 | Apple GPU helpers | Metal Performance Shaders | Bloom, vignette, color grading, distortion, and performance-friendly effects. | Later native slice |
| FSTECH-021 | PRD-019 | FSPRD-008 / FSPRD-011 | Apple fluid sim | Metal Compute Shaders + RealityKit particle system | Native milk simulation, splashes, particles, and possible Marching Cubes/custom solver path. | Later native slice |
| FSTECH-022 | PRD-013 | FSPRD-005 / FSPRD-008 | Apple haptics | Core Haptics / `UIImpactFeedbackGenerator` | Liquid-feeling vibration and interaction feedback. | Later native slice |
| FSTECH-023 | PRD-009 / PRD-013 | FSPRD-004 / FSPRD-008 | Apple audio | AVFoundation, `SpatialAudioComponent`, `AVAudioEngine` | Spatial slosh/pour/impact sound on Apple devices. | Later native slice |
| FSTECH-024 | PRD-010 | FSPRD-005 | Apple sensors | Core Motion | Native tilt and motion data for gravity/pour controls. | Later native slice |
| FSTECH-025 | PRD-011 / PRD-012 / PRD-015 | FSPRD-005 / FSPRD-006 | Apple scanning / AR | ARKit, LiDAR, TrueDepth | Object/environment/face scanning and world tracking. | Later subsystem |
| FSTECH-026 | PRD-014 | FSPRD-005 | iPad input | Apple Pencil APIs | Precision iPad controls and inspection workflows. | Later native slice |
| FSTECH-027 | PRD-020 | FSPRD-008 | Watch companion | watchOS Swift + Core Haptics + sensor APIs | Tilt, haptics, and simple controls for the larger-device simulation. | Later native slice |
| FSTECH-028 | PRD-021 | FSPRD-009 | Backend runtime | Python + FastAPI | Upload/processing API for scans and Blender automation. | Later backend slice |
| FSTECH-029 | PRD-021 | FSPRD-009 | AI agent | Claude / GPT | Agent brain for guiding Blender cleanup and model repair. | Later backend slice |
| FSTECH-030 | PRD-016 / PRD-021 | FSPRD-006 / FSPRD-009 | 3D automation | Blender Python API (`bpy`) | Topology cleanup, hole repair, smoothing, retopology, export prep. | Later backend slice |
| FSTECH-031 | PRD-022 | FSPRD-009 | Auth / database / realtime | Firebase Auth + Firestore | Accounts, saved creations, and cross-device sync when product scope needs it. | Later product slice |
| FSTECH-032 | PRD-024 | FSPRD-009 | Apple asset format | USDZ | Primary native 3D asset format. | Later asset pipeline |
| FSTECH-033 | PRD-024 | FSPRD-009 | Web asset format | glTF / GLB | Web-friendly converted 3D format for Three.js. | Later asset pipeline |
| FSTECH-034 | PRD-023 | FSPRD-003 / FSPRD-007 | Design tokens | Style Dictionary or Tokens Studio | Shared colors, easing, glow, blur, and fluid parameters across web/native. | Slice 1 minimal |
| FSTECH-035 | PRD-027 | FSPRD-010 | Profiling | Browser performance tools + Instruments | Verify frame rate, GPU cost, shader cost, and native performance. | Slice 1 onward |

## Slice 1 Tech Stack

| Keep | Technology | Why |
|---|---|---|
| Yes | Vite + React + TypeScript | Fastest path to an inspectable browser prototype. |
| Yes | Three.js + React Three Fiber + Drei | Matches the PRD's strongest web recommendation. |
| Yes | WebGPU capability check | Prevents unsupported browsers from crashing. |
| Yes | Controlled particle/fluid approximation | Proves milk-like interaction before expensive solver work. |
| Yes | Minimal shared token object | Keeps color, glow, easing, and fluid parameters explicit from day one. |
| Yes | Zustand or Jotai | Small state layer for controls and scene parameters. |
| Yes | Reduced-motion toggle | Meets the first accessibility requirement. |
| Defer | DeviceMotion API | Add after pointer/touch tilt works. |
| Defer | Firebase | No backend is needed until saving/sync exists. |
| Defer | RealityKit / Metal / Watch | Native surfaces should reuse lessons from the web prototype. |
| Defer | Blender / scanning / 3D printing | Separate subsystem after core visual experience is proven. |

## Open Tech Decisions

| Decision ID | Area | Question | Recommended First Answer |
|---|---|---|---|
| FSTDEC-001 | Web fluid approach | Which WebGPU fluid technique should slice 1 use? | Start with the simplest controlled particle/fluid approximation or official Three.js WebGPU fluid example, then iterate toward milk-specific viscosity and scattering. |
| FSTDEC-002 | Native SDK target | Are RealityKit 4, RealityView post-processing, and named components available locally? | Verify Xcode/iOS SDK before native planning. |
| FSTDEC-003 | Backend timing | Does slice 1 need FastAPI, Firebase, or auth? | No; add backend only when scans, saved creations, sync, or exports exist. |
| FSTDEC-004 | Asset workflow | Should USDZ/glTF conversion be built immediately? | No; defer until real 3D assets need to cross Apple/web boundaries. |
