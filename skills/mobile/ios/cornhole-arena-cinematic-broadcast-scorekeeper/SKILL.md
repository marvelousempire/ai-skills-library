---
name: cornhole-arena-cinematic-broadcast-scorekeeper
id: SK-0121
keywords: [build-cornhole, check-arena, build-cinematic]
hash: 30dd96f
relations: []
before: []
governed_by: [global]
meta: dynamic
description: Builds Cornhole Arena, an immersive iOS RealityKit 4 cinematic broadcast scorekeeper using SwiftUI, RealityView, Metal post-processing, HealthKit, WHOOP data, physics, particles, spatial audio, and haptics.
---

# Cornhole Arena — Cinematic Broadcast Scorekeeper

## Purpose

This skill defines the complete iOS app development blueprint for **Cornhole Arena**, a cinematic sports-broadcast scorekeeper where real-world cornhole games become an immersive RealityKit arena.

Use this skill when the user asks to build, plan, scaffold, implement, review, or extend:

- Cornhole Arena
- an iOS RealityKit scorekeeper
- immersive sports broadcast UI
- cinematic SwiftUI + RealityKit apps
- HealthKit-powered game experiences
- WHOOP-connected fitness/game overlays
- RealityView-first iOS apps
- Metal post-processing pipelines
- physics-driven sports visualizations

---

# Product Identity

| Field | Value |
|---|---|
| App Name | Cornhole Arena |
| Version | 1.0 MVP |
| Date | May 12, 2026 |
| Target Platforms | iOS 19+ for iPhone 16 series and later; future iPadOS / visionOS |
| Xcode Target | Xcode 17+ |
| Primary Stack | SwiftUI, RealityKit 4, RealityView, Metal, HealthKit, WHOOP OAuth/webhooks |
| Experience Type | Full-screen immersive cinematic broadcast scorekeeper |

---

# Non-Negotiable Design Philosophy

The app is **immersion-first**.

The full app runs inside a full-screen `RealityView` by default:

```swift
.ignoresSafeArea()
```

Traditional SwiftUI controls must be minimal overlays that auto-hide.

Every score, stat, throw, fitness datum, and play event should feel alive through:

- RealityKit physics
- particles
- holographic materials
- manipulation
- post-processing
- spatial audio
- haptics
- live data binding

Avoid basic dashboard patterns, generic charts, or flat fitness-app animations.

---

# Product Vision

Cornhole Arena is a live ESPN-style broadcast arena for cornhole.

Core experience:

- beanbags fly with real physics
- scores flip like TV lower thirds
- play-by-play scrolls as a holographic ticker
- stats orbit as grab-able holographic orbs
- heart rate, WHOOP strain, and recovery influence the environment in real time
- streaks trigger particles, audio, haptics, and cinematic effects

---

# Mood & Aesthetic

| Area | Requirement |
|---|---|
| Palette | deep blacks, neon cyan, neon orange, glow accents |
| Lighting | cinematic fog, dynamic spotlights, bloom, vignette, film grain |
| Motion | physics-based beanbags, device tilt, subtle camera dolly |
| Effects | confetti, impact sparks, streak trails, HR aura particles |
| Audio | spatial thuds, crowd cheers, score stingers |
| Haptics | impact and collision feedback |
| Performance | 60 fps minimum, 120 fps preferred |

---

# Core Technical Architecture

## Rendering Canvas

Use `RealityView` as the root rendering canvas.

All UI elements should be either:

1. RealityKit entities and components, or
2. `ViewAttachmentComponent` inline SwiftUI HUDs.

## Data Flow

Use an observable model:

```swift
@Observable
final class BroadcastArenaModel {
    var homeScore: Int = 0
    var awayScore: Int = 0
    var currentStreak: Int = 0
    var bestStreak: Int = 0
    var recentPlays: [PlayEvent] = []
    var playerHR: Double = 0.0
    var whoopStrain: Double = 0.0
    var whoopRecovery: Double = 0.0
    var isPlaying: Bool = false
}
```

Model updates should trigger:

- entity updates
- scoreboard updates
- physics replays
- particle bursts
- haptics
- audio cues
- post-processing parameter changes

## Gesture Handling

Use direct gestures on entities where possible:

- SwiftUI gestures
- `GestureComponent`
- entity-attached manipulation

Do not create unnecessary gesture intermediary layers.

## Asset Pipeline

Use Reality Composer Pro to prepare:

- USDZ board assets
- beanbag assets
- physics bodies
- collision shapes
- particle emitters
- holographic materials
- prebuilt animations

---

# Mandatory RealityKit 4 Components

| Component | Required Use |
|---|---|
| `PhysicsBodyComponent` | beanbags and board interactions |
| `CollisionComponent` | throw and board collision detection |
| `ManipulationComponent.configureEntity(_)` | 6DOF stat-orb grabbing and rotation |
| `ViewAttachmentComponent` | scoreboard HUD and detail popovers |
| `ParticleEmitterComponent` | confetti, sparks, HR aura, streak effects |
| `GestureComponent` | direct entity gestures |
| `PresentationComponent` | optional detail modals from stat orbs |
| `EnvironmentBlendingComponent` | cinematic environment blending |
| `EnvironmentResource` | fog and lighting environment |

---

# Exact Data Models

```swift
@Observable
final class BroadcastArenaModel {
    var homeScore: Int = 0
    var awayScore: Int = 0
    var currentStreak: Int = 0
    var bestStreak: Int = 0
    var recentPlays: [PlayEvent] = []
    var playerHR: Double = 0.0          // Live from HealthKit
    var whoopStrain: Double = 0.0       // 0–21 scale
    var whoopRecovery: Double = 0.0     // 0–100%
    var isPlaying: Bool = false
}

struct PlayEvent: Identifiable, Codable {
    let id = UUID()
    let type: PlayType
    let timestamp: Date
    let hrSnapshot: Double?
}

enum PlayType: String, Codable {
    case make
    case miss
    case streak2
    case streak3
}
```

---

# Main Entity Hierarchy

```text
rootEntity
├── cornholeBoard
├── beanbagTemplate
├── scoreboardPanel
├── playByPlayTicker
├── statOrbs[]
├── hrAuraEmitter
├── cameraRig
├── spotlightRig
└── environmentEffects
```

## Entity Roles

| Entity | Purpose |
|---|---|
| `rootEntity` | main RealityKit scene root |
| `cornholeBoard` | USDZ board or primitive board with hole and wood material |
| `beanbagTemplate` | cloneable dynamic physics beanbag |
| `scoreboardPanel` | ViewAttachment scoreboard HUD |
| `playByPlayTicker` | holographic scrolling event feed |
| `statOrbs` | grab-able metallic/glow stat entities |
| `hrAuraEmitter` | particle aura driven by live heart rate |
| `cameraRig` | subtle dolly and Core Motion tilt |

---

# Physics Replay Pattern

```swift
func replayThrow(wasMake: Bool, in root: Entity, beanbagTemplate: ModelEntity) {
    let bag = beanbagTemplate.clone(recursive: true)
    bag.position = [-3, 2, -6]

    bag.components.set(
        PhysicsBodyComponent(
            massProperties: .default,
            material: .default,
            mode: .dynamic
        )
    )

    bag.components.set(
        CollisionComponent(
            shapes: [.generateBox(size: [0.3, 0.08, 0.3])],
            mode: .default
        )
    )

    root.addChild(bag)

    let impulse: SIMD3<Float> = wasMake
        ? SIMD3<Float>(3, -4, 0)
        : SIMD3<Float>(4, -3, 1)

    bag.applyLinearImpulse(impulse, relativeTo: nil)

    // Subscribe to collision events.
    // Trigger particles, haptics, audio, score effects, and play-by-play updates.
}
```

---

# Score Input & Play-By-Play

Use a minimal SwiftUI overlay:

```swift
.overlay(alignment: .bottom) {
    ScoreInputBar(model: model)
}
```

Required buttons:

- Make
- Miss

Optional:

- voice input through Speech framework
- undo last play
- start/end game
- highlight export

Every tap should:

1. Append a `PlayEvent`.
2. Update score and streak state.
3. Trigger physics replay.
4. Trigger haptics.
5. Trigger audio.
6. Trigger particles if needed.
7. Update ticker.
8. Adjust broadcast environment.

---

# HealthKit Integration

Use:

- `HKWorkoutSession`
- `HKLiveWorkoutBuilder`
- `HKLiveWorkoutDataSource`
- heart-rate quantity type
- custom Cornhole workout session

Flow:

```text
Start Cornhole Workout
   ↓
HKWorkoutSession
   ↓
HKLiveWorkoutBuilder
   ↓
Heart Rate Samples
   ↓
BroadcastArenaModel.playerHR
   ↓
HR Aura + Environment Effects
```

Live heart rate should drive:

- aura pulse rate
- particle intensity
- score ambience
- broadcast lower-third detail
- optional stat orb size/brightness

---

# WHOOP Integration

Use:

- OAuth 2.0
- server-side client secret storage
- App Attest or backend secret protection
- webhooks for recovery, strain, and workout events
- push to app or polling fallback

WHOOP values:

| Value | Range | Effect |
|---|---|---|
| Strain | 0–21 | bloom, fog density, energy effects |
| Recovery | 0–100% | color grading, aura tone, broadcast stat styling |
| Workout Events | event stream | ticker and highlight context |

---

# Metal Post-Processing

Use RealityView post-processing with Metal/MPS for:

- bloom
- vignette
- film grain
- color grading
- glow intensity

Conceptual pattern:

```swift
RealityView { content in
    // Build scene.
    // Configure post-processing pipeline.
    // Tie bloom and grain intensity to model.whoopStrain.
}
```

Effects should be data-bound:

```text
Higher WHOOP strain
   ↓
stronger bloom
   ↓
heavier fog
   ↓
more intense particle energy
```

---

# Haptics, Audio & Camera

## Haptics

Use:

- `UIImpactFeedbackGenerator`
- Core Haptics for stronger moments

Trigger on:

- collision
- score
- streak
- game win

## Spatial Audio

Use:

- `AudioResource`
- RealityKit entity audio
- `SpatialAudioComponent`
- optional `AVAudioEngine`

Audio types:

- beanbag thud
- board impact
- crowd cheer
- streak stinger
- broadcast whoosh

## Camera

Use `CMMotionManager` for subtle tilt.

Use transform animation for:

- auto-dolly
- score emphasis
- streak shake
- replay focus

---

# Non-Functional Requirements

| Requirement | Standard |
|---|---|
| Performance | 60 fps minimum, 120 fps preferred |
| Device Testing | must run on device; simulator is insufficient for full RealityKit physics/GPU validation |
| Privacy | HealthKit entitlement, WHOOP consent, minimal on-device storage |
| Assets | all USDZ assets created in Reality Composer Pro with pre-baked physics/particles where possible |
| Accessibility | ViewAttachment views support VoiceOver and high contrast |
| Optimization | use instancing and avoid heavy per-frame SwiftUI overlays |

---

# Implementation Roadmap

## Phase 1 — MVP, 4–6 Weeks

- RealityView scene
- board entity
- beanbag physics replay
- manual make/miss buttons
- basic scoreboard HUD
- play event model

## Phase 2 — Immersive Stats

- manipulation stat orbs
- play-by-play ticker
- particle emitter bursts
- HealthKit live HR aura

## Phase 3 — Broadcast Polish

- WHOOP OAuth/webhooks
- Metal post-processing
- haptics
- spatial audio
- highlight reel export with AVFoundation / RealityKit capture

## Phase 4 — Expansion

- multiplayer
- clip export
- visual presets
- visionOS spatial expansion
- iPadOS support
- avatar commentator

---

# AI Coding Agent Instructions

When building this app:

1. Start with the data model.
2. Build the full-screen RealityView root.
3. Add primitive board and beanbag physics before importing final assets.
4. Add manual scoring before HealthKit/WHOOP.
5. Add particles and haptics after scoring works.
6. Add HealthKit live HR.
7. Add WHOOP last.
8. Add Metal post-processing only after core performance is stable.
9. Test on physical device early.
10. Do not turn the app into a normal SwiftUI dashboard.

---

# Common Mistakes To Avoid

| Mistake | Correction |
|---|---|
| Building a flat scoreboard app | Use RealityView as the core experience |
| Using basic SwiftUI charts | Convert stats into living RealityKit entities |
| Adding WHOOP before scoring works | Build manual game loop first |
| Overusing overlays | Keep SwiftUI minimal and auto-hiding |
| Ignoring frame rate | Profile RealityKit and Metal early |
| Making motion decorative only | Tie motion to score, streak, HR, or strain |
| Testing only in simulator | Test RealityKit physics on device |

---

# Platform Placement

This skill belongs in:

```text
Mobile & iOS App Development Skills
```

It also connects to:

- Design & UI Skills
- Media Intelligence
- Voice, Speech & Audio
- Evaluation & Observability
- Hardware & Compute
- You-Sir Juan platform skills taxonomy

---

# Strategic Goal

Cornhole Arena should feel like stepping into a live sports broadcast video game.

It should prove that iOS apps can be cinematic, spatial, alive, and data-reactive instead of flat dashboards.
