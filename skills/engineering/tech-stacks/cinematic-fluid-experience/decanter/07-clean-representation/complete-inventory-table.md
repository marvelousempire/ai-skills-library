# Cinematic Fluid Experience - Complete Inventory Table

Status: source conversation inventory (**37 unique items**; **40 archived duplicate rows** from F-ledgers)  
Source: final inventory block from `../../PRD for Fluid Simulation App.md` conversation  
Date: May 18, 2026

## ID Scheme Note

**Top section** — canonical semantic inventory: `PRD-001` through `PRD-037` (one row per unique feature, idea, requirement, or decision).  
**Bottom section** — cleared duplicates: historical `F-*` ledger rows preserved for traceability only.

That numbering is **not** the same as the decanter traceability table in `requirement-table.md`, which maps **29 consolidated requirements** (`PRD-001`–`PRD-029`) to `FSPRD-*` parsed items. Use this file for exhaustive coverage checks; use `requirement-table.md` + `canonical-prd-draft.md` section 4 for implementation traceability.

**Source attestation:**

> Here is the complete inventory table — a pure, exhaustive list of every single feature, idea, requirement, and decision we discussed from the very first message to now.

## Canonical Inventory (Unique Items Only)

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
| PRD-037 | Platform | Progressive Web App (PWA) | Installable web application with offline support; users can add to home screen and use like a native app |

**Total unique items: 37**

This table is the canonical semantic inventory — every unique idea, feature, platform, technical decision, and requirement from the conversation, with near-duplicate F-ledger rows cleared to the archive below.

## Optional Extensions (From Source Chat)

The source offered these follow-ups; not applied in this file unless requested:

- Add a **Status** or **Priority** column per row.
- Split into separate tables by **Category**.
- Map inventory rows to implementation phases (`first-build-slice.md`, `canonical-prd-draft.md` section 0).

## Related Artifacts

| File | Use |
|---|---|
| `requirement-table.md` | 29-row decanter traceability (`PRD-*` ↔ `FSPRD-*`) |
| `canonical-prd-draft.md` §4 | Expanded requirement prose |
| `canonical-prd-draft.md` §15 | Final consolidated PRD block |
| `gap-ledger.md` | Open decisions not closed by inventory alone |

---

## Cleared duplicates (archive)

Rows below are semantic or literal duplicates removed from the canonical inventory above.  
Original IDs are preserved for traceability. **F-ledger-A** and **F-ledger-B** are the two near-identical feature ledgers from the source conversation.


### Duplicate intro prose

> This is the merged, complete version you asked for. It combines the detail and clarity from both previous tables…

> Here's the full, honest, and detailed Feature Ledger you asked for. I went back through everything we discussed…

> This is now a **complete, deep list** based on everything we've talked about — including specific components like `ManipulationComponent` and `ViewAttachmentComponent`.

> Would you like me to add a **Priority** column or a **Platform** column (Web / Native / Both) to this table?




### Cluster: Full-screen immersion → PRD-030

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-001 | F-ledger-A | Immersive Full-Screen 3D Canvas | Full-screen 3D, no browser chrome; immersive game-like feel |
| F-001 | F-ledger-B | Immersive Full-Screen 3D Canvas | Full-screen 3D, no browser UI; immersive game-like feel |




### Cluster: WebGPU → PRD-004, PRD-011

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-002 | F-ledger-A | WebGPU + Compute Shaders | Modern GPU API; fast rendering/physics in browser |
| F-002 | F-ledger-B | WebGPU + Compute Shaders | Modern GPU API; 60fps+ scenes with particles/physics |
| F-003 | F-ledger-A | React Three Fiber | React declarative 3D scenes |
| F-003 | F-ledger-B | React Three Fiber | React-based Three.js; build 3D like normal UI |




### Cluster: Device tilt / motion → PRD-017

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-004 | F-ledger-A | Device Tilt Control (Accelerometer) | Phone motion controls 3D scene |
| F-004 | F-ledger-B | Device Tilt Control (DeviceMotion API) | Accelerometer/gyroscope pour/roll control |




### Cluster: Touch & gestures → PRD-014

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-005 | F-ledger-A | Gesture Controls (Drag, Pinch, Swipe) | Multi-touch manipulation of 3D objects |
| F-005 | F-ledger-B | Gesture Controls (Drag, Pinch, Swipe) | Grab, rotate, scale, throw with fingers |
| F-008 | F-ledger-A | Interactive 3D Objects + Manipulation | Grab, spin, throw, inspect in 3D |
| F-008 | F-ledger-B | Interactive 3D Objects + Manipulation | Touch and move objects in 3D space |




### Cluster: Haptic feedback → PRD-015

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-006 | F-ledger-A | Haptic Feedback System | Vibration API + Core Haptics synced to interactions |
| F-006 | F-ledger-B | Haptic Feedback | Vibration API + Core Haptics on grab/collision |




### Cluster: Spatial / reactive audio → PRD-016

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-007 | F-ledger-A | Spatial Reactive Audio | 3D sound by object position/movement |
| F-007 | F-ledger-B | Spatial / Reactive Audio | Web Audio + spatial audio by motion |




### Cluster: Lighting & PBR → PRD-013

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-009 | F-ledger-A | Cinematic Lighting & PBR Materials | Reflections, shadows, realistic materials |
| F-009 | F-ledger-B | Cinematic Lighting & PBR Materials | High-quality realistic object rendering |




### Cluster: Particles & fluid effects → PRD-011, PRD-012, PRD-033

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-010 | F-ledger-A | Particle Systems | GPU particles: sparks, glows, splashes, trails |
| F-010 | F-ledger-B | Particle Systems | WebGPU + RealityKit particles |
| F-018 | F-ledger-B | ParticleEmitterComponent (RealityKit) | **ID collision** — same ID as Metal in ledger A; native iOS particle emitter |




### Cluster: LiDAR scanning → PRD-018, PRD-022

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-011 | F-ledger-A | LiDAR Object Scanning | Scan real objects into 3D scene (iOS) |
| F-011 | F-ledger-B | LiDAR Object Scanning (Native only) | iPhone LiDAR → 3D models in scene |




### Cluster: AI model cleanup → PRD-023

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-012 | F-ledger-A | AI Model Post-Processing | Cleanup/optimize scanned models |
| F-012 | F-ledger-B | AI Model Cleanup Pipeline | Blender + AI repair of scans |




### Cluster: Progressive Web App → PRD-037

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-013 | F-ledger-A | Progressive Web App (PWA) | Installable web app, offline, home screen |
| F-013 | F-ledger-B | Progressive Web App (PWA) | Installable offline web app |




### Cluster: Shared design tokens → PRD-008

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-014 | F-ledger-A | Shared Design Tokens | Colors, motion, effects across web/native |
| F-014 | F-ledger-B | Shared Design Tokens | Centralized styling/animation values |




### Cluster: RealityKit stack → PRD-005, PRD-033

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-015 | F-ledger-A | RealityKit 4 + RealityView | Apple 3D framework; 120fps on device |
| F-015 | F-ledger-B | RealityKit 4 + RealityView | High-performance iOS 3D framework |
| F-016 | F-ledger-A | ManipulationComponent | Native grab/move 3D objects |
| F-016 | F-ledger-B | ManipulationComponent (RealityKit) | Grab and move objects on iOS |
| F-017 | F-ledger-A | ViewAttachmentComponent | UI elements attached in 3D space |
| F-017 | F-ledger-B | ViewAttachmentComponent (RealityKit) | SwiftUI UI on 3D objects |




### Cluster: Metal post-processing → PRD-034

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-018 | F-ledger-A | Metal Post-Processing Effects | **ID collision** — bloom, vignette, film grain, color grading |
| F-019 | F-ledger-B | Metal Post-Processing | Same semantic row as F-018(A); ledger B renumbered |




### Cluster: Performance optimization → PRD-028

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-019 | F-ledger-A | Performance Optimization System | **ID collision** — LOD, culling, efficient shaders |
| F-020 | F-ledger-B | Performance Optimization (LOD, Culling) | Maintain high frame rate across devices |




### Cluster: Asset pipeline → PRD-025

| Original ID | Source | Feature Name | Cleared detail (abbrev.) |
|---|---|---|---|
| F-020 | F-ledger-A | Asset Pipeline & Format Conversion | **ID collision** — USDZ ↔ glTF conversion across platforms |

**Total archived duplicate rows: 40** (34 near-duplicate pairs for F-001–F-017, plus 6 ID-collision variants for F-018–F-020)
