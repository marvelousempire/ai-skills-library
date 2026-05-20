# Parsed Items Ledger

Source: [`../../doctrine/docs/product/canonical-prd.md`](../../doctrine/docs/product/canonical-prd.md) (archive: [`../../doctrine/archive/`](../../doctrine/archive/))

## Extraction Contract

Each item records the stable requirement, source range, content type, and destination candidate. The Parsing Agent does not decide final implementation order; it only extracts stable material for the Sensemaking Decanter.

## Items

| Item ID | Source | Heading Path | Type | Extracted Item | Destination Candidate |
|---|---|---|---|---|---|
| FSPRD-001 | lines 743-747 | Final PRD > Vision & Goals | requirement | Build a cinematic, premium, hyper-realistic pouring milk experience with no playful/basic UI. | product vision / design principles |
| FSPRD-002 | lines 749-756 | Final PRD > Platform Strategy | requirement | Support Web, iOS, iPadOS, and Apple Watch with shared behavior and visual consistency. | platform roadmap |
| FSPRD-003 | lines 758-768 | Final PRD > Design System | requirement | Use shared design tokens plus ReadyPlay-style primitives and 2D-to-3D RealityKit previews. | design system package |
| FSPRD-004 | lines 770-776 | Final PRD > Core Features | feature | Implement milk simulation, PBR lighting, gestures, haptics, spatial audio, and interactive 3D elements. | core experience backlog |
| FSPRD-005 | lines 778-786 | Final PRD > Hardware & Sensor Integration | feature | Use Device Motion/Core Motion, LiDAR/TrueDepth, ARKit, haptics, spatial audio, Dynamic Island, and Apple Pencil. | sensor/native capability backlog |
| FSPRD-006 | lines 788-792 | Final PRD > Scanning & 3D Printing Pipeline | feature | Scan objects, clean them in Blender, and export `.obj`/`.usd` for 3D printing. | scanning/export pipeline |
| FSPRD-007 | lines 797-800 | Final PRD > Tech Stack > Web Platform | tech-stack | Build web surface with Vite, React, TypeScript, Three.js, R3F, drei, WebGPU/TSL, Zustand or Jotai, and DeviceMotion. | web app slice |
| FSPRD-008 | lines 802-809 | Final PRD > Tech Stack > Apple Platforms | tech-stack | Build native surface with SwiftUI, RealityKit 4, RealityView, Reality Composer Pro, Metal, RealityKit components, Core Haptics, and AVFoundation. | iOS/iPadOS slice |
| FSPRD-009 | lines 810-813 | Final PRD > Tech Stack > Backend & AI Pipeline | tech-stack | Use Python, FastAPI, Claude/GPT, Blender `bpy`, Firebase Auth/Firestore, USDZ, and glTF conversion. | backend/AI pipeline slice |
| FSPRD-010 | lines 815-823 | Final PRD > Non-Functional Requirements | non-functional | Hit 60fps minimum, handle accessibility, preserve privacy consents, sync audio, define deployment, and phase implementation. | non-functional requirements |
| FSPRD-011 | lines 825-828 | Final PRD > Core Implementation Patterns | implementation pattern | Use `CinematicFluidArenaView`, root entity hierarchy, `postProcess`, collision-driven particles/haptics/audio, and ReadyPlay bridge. | native architecture notes |
| FSPRD-012 | lines 830-834 | Final PRD > Hardware Required | environment | Development requires M1+ MacBook, LiDAR-capable iPhone, iPad Pro, and Apple Watch for testing. | environment checklist |
| FSPRD-013 | lines 836-840 | Final PRD > Handoff Instructions | handoff | Start with design toggle and ReadyPlay primitives, then build RealityView scene, test on device, and preserve immersion. | implementation handoff |
| FSPRD-014 | lines 204-265 | Earlier Audit > Tech Stack Gaps | claim seed | Earlier draft identified unresolved choices: fluid simulation approach, AI/Blender integration, asset format, sync, and auth/data. | gap ledger |
| FSPRD-015 | lines 267-300 | WebGPU Recommendation | claim seed | WebGPU is the strongest practical web path for high-quality real-time milk simulation; start with Vite/R3F/WebGPU and prototype pouring glass. | first build slice |
| FSPRD-016 | lines 431-480 and 601-849 | Repeated Final PRD Blocks | duplicate signal | The document contains multiple final/absolute-final PRD blocks with overlapping content. | duplicate clusters |

## Source Preservation

No source text was deleted or rewritten. The original PRD remains the retained draft; this ledger is the parsed handoff to the Sensemaking Decanter.
