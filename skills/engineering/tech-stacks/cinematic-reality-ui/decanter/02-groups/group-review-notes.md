# Group Review Notes

Source ledger: `../01-parsed-items/parsed-items-ledger.md`

## Group A - Product Vision And Experience Quality

Items: FSPRD-001, FSPRD-004, FSPRD-010, FSPRD-013

The PRD is clearest about the intended feeling: premium, cinematic, immersive, full-screen, game-quality, and specifically about realistic pouring milk. This should become the product quality bar for every slice. The build should not start as a generic fluid toy or static 2D dashboard.

Decision: preserve "milk realism" and "cinematic immersion" as acceptance criteria for the first prototype.

## Group B - Web Prototype Path

Items: FSPRD-004, FSPRD-007, FSPRD-010, FSPRD-015

The web path is the smallest solvable first implementation because the PRD repeatedly identifies Vite + React Three Fiber + Three.js + WebGPU as the most accessible route for proving the fluid simulation. Web can validate visual style, interaction model, performance budgets, and shader feasibility before native surfaces multiply the work.

Decision: first build slice should be a web-only R3F/WebGPU milk-pour prototype with graceful fallback messaging if WebGPU is unavailable.

## Group C - Native RealityKit/Metal Path

Items: FSPRD-002, FSPRD-008, FSPRD-011, FSPRD-012, FSPRD-013

The native path is important but heavier. RealityKit 4, RealityView, Metal compute shaders, Core Haptics, Spatial Audio, on-device testing, and LiDAR hardware make this a separate phase. The native implementation should borrow parameters, visual tokens, and interaction decisions proven in the web prototype.

Decision: do not start native and web in the same slice. Stage native after the fluid interaction model is proven.

## Group D - Cross-Platform Design System

Items: FSPRD-002, FSPRD-003, FSPRD-010, FSPRD-011

Shared tokens are a real architectural requirement, not decoration. The PRD calls for colors, easing, glow, blur, fluid parameters, and ReadyPlay primitive bridges. This can start early as a small token schema, but full RealityKit bridge previews belong with the native slice.

Decision: first slice should include a minimal `fluidParameters` and cinematic token schema, not the full ReadyPlay bridge.

## Group E - Sensors, Watch, And Hardware Integration

Items: FSPRD-005, FSPRD-008, FSPRD-012

Device Motion/Core Motion, Apple Watch, Dynamic Island, Apple Pencil, LiDAR, TrueDepth, and ARKit are platform capability slices. They should not block the first visual simulation. Device Motion may be introduced after mouse/touch controls prove the gravity/tilt model.

Decision: first slice uses pointer/touch controls; Device Motion is next, Watch/native sensors later.

## Group F - Scanning, Blender, Backend, And 3D Printing

Items: FSPRD-006, FSPRD-009, FSPRD-014

The scanning and Blender pipeline is a different product subsystem from cinematic pouring. It requires auth, storage, uploads, model processing, safety checks, and export validation. It should remain in the roadmap but not in the first fluid prototype.

Decision: defer backend/AI/scanning until the core experience has a reason to save or process user assets.

## Group G - Repetition And Source Hygiene

Items: FSPRD-016

The PRD includes several "final" versions, then an "absolute final" version. The final section at lines 738-849 is the most complete and should be treated as the working source of truth, while earlier sections remain provenance.

Decision: preserve the full source file, but use the final block as the canonical input for implementation planning.
