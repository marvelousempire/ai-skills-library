---
name: immersive-cinematic-sports-broadcast-arena-sop
id: SK-0122
keywords: [immersive, cinematic, sports]
description: Reusable SOP and PRD skill for building premium immersive iOS scorekeeping and stats apps for any sport using SwiftUI, RealityKit 4, RealityView, Metal, HealthKit, WHOOP, physics, particles, spatial audio, and haptics.
---

# Immersive Cinematic Sports Broadcast Arena SOP

## Purpose

This skill is a reusable PRD, SOP, and technical handoff template for building premium immersive scorekeeping and stats apps for **any sport**.

Cornhole is only one example. The architecture must support any score-based sport or game.

Use this skill to build apps for:

- basketball
- soccer
- tennis
- golf
- pickleball
- volleyball
- baseball
- football
- cornhole
- darts
- bowling
- table tennis
- any score-based sport or game

The goal is to turn real-world sports scoring and stats tracking into a cinematic TV-broadcast and video-game experience.

---

# Skill Type

| Field | Value |
|---|---|
| Document Type | Reusable Blueprint / LLM Skill Specification / SOP Guide |
| Version | 1.0 |
| Date | May 12, 2026 |
| Platform | iOS 19+ target; future iPadOS and visionOS |
| Xcode | Xcode 17+ |
| Main Stack | SwiftUI, RealityKit 4, RealityView, Metal, HealthKit, WHOOP OAuth/webhooks |
| Core Pattern | Full-screen immersive RealityView sports arena |

---

# Non-Negotiable Principle

The app must be **immersion-first**.

Do not build a flat SwiftUI dashboard.

Do not build basic charts as the main experience.

Do not make the app feel like a website.

The app must feel like:

> ESPN broadcast meets a premium sports video game.

Core requirements:

- full-screen RealityView canvas
- minimal auto-hiding SwiftUI overlays
- real physics
- cinematic camera
- particles
- bloom
- spatial audio
- haptics
- holographic stat displays
- responsive scoring moments
- live fitness-driven environment changes

---

# SOP Overview

When building any sport-specific version, follow this order:

1. Define the sport and scoring rules.
2. Create the reusable `BroadcastArenaModel`.
3. Create the sport-specific `SportArenaConfiguration`.
4. Build a full-screen `RealityView` root.
5. Add the sport-specific 3D object, court, board, field, hoop, goal, lane, or arena.
6. Add physics replay logic.
7. Add scoreboard attachment.
8. Add play-by-play ticker.
9. Add stat orbs with manipulation.
10. Add particles, haptics, audio, and camera motion.
11. Add HealthKit live heart rate.
12. Add WHOOP strain/recovery integration.
13. Add Metal post-processing.
14. Profile on physical device.
15. Package the sport as a reusable module.

---

# Product Vision

Build a cinematic broadcast arena app where real-world game inputs trigger a live 3D sports experience.

Users log plays in real life.

The app renders:

- sport-specific central objects
- dramatic score animations
- physics replays
- holographic stats
- play-by-play ticker
- real-time health overlays
- cinematic lighting
- interactive stat orbs
- highlight-reel moments

---

# Reusable Sports Examples

| Sport | Central Object | Replay Object | Special Visuals |
|---|---|---|---|
| Basketball | hoop / half court | basketball | net swish, rim impact, dunk burst |
| Soccer | pitch / goal | ball | goal explosion, turf streak, crowd flare |
| Tennis | court | tennis ball | speed trail, bounce mark, rally counter |
| Golf | green / hole | golf ball | arc trail, flag glow, putt line |
| Pickleball | court | ball | paddle hit spark, rally ticker |
| Baseball | diamond / strike zone | baseball | bat crack, pitch trail, hit arc |
| Football | field / goalpost | football | throw arc, touchdown flare, yard marker glow |
| Cornhole | board | beanbag | dust, impact sparks, streak confetti |

---

# Target Mood And Aesthetic

| Area | Rule |
|---|---|
| Environment | dark volumetric arena |
| Colors | neon accents, cyan/orange highlights, deep blacks |
| UI | holographic, high contrast, broadcast-style |
| Motion | satisfying, physics-based, cinematic |
| Lighting | dynamic spotlights, fog, bloom, vignette |
| Audio | spatial crowd, impact sounds, score stingers |
| Haptics | every collision and score feels physical |

---

# Mandatory Technical Stack

| Layer | Required Technology |
|---|---|
| Root Rendering | `RealityView` full screen |
| App UI | SwiftUI minimal overlays |
| 3D Engine | RealityKit 4 |
| Post Processing | Metal + Metal Performance Shaders |
| Fitness | HealthKit live workout sessions |
| Wearable Data | WHOOP OAuth + webhooks |
| Assets | Reality Composer Pro + USDZ |
| Audio | RealityKit spatial audio + AVAudioEngine where needed |
| Haptics | UIImpactFeedbackGenerator + Core Haptics |
| Camera | Core Motion + transform animation |

---

# Mandatory RealityKit Components

| Component | Purpose |
|---|---|
| `PhysicsBodyComponent` | sport object replay physics |
| `CollisionComponent` | hit/impact/score detection |
| `ManipulationComponent` | 6DOF stat-orb grabbing and rotating |
| `ViewAttachmentComponent` | SwiftUI scoreboard and detail panels inside RealityKit |
| `ParticleEmitterComponent` | impacts, streaks, HR aura, confetti |
| `MeshInstancesComponent` | performance for repeated objects and effects |
| `EnvironmentBlendingComponent` | cinematic environment blending |
| `EnvironmentResource` | fog and lighting environment |
| `GestureComponent` | direct gestures on entities |
| Observable entities | live updates from app model |

---

# Required Core Data Model

```swift
@Observable
final class BroadcastArenaModel {
    var homeScore: Int = 0
    var awayScore: Int = 0
    var currentStreak: Int = 0
    var bestStreak: Int = 0
    var recentPlays: [PlayEvent] = []
    var playerHR: Double = 0.0
    var whoopStrain: Double = 0.0      // 0-21
    var whoopRecovery: Double = 0.0    // 0-100
    var sportType: SportType
    var isPlaying: Bool = false
}

struct PlayEvent: Identifiable, Codable {
    let id = UUID()
    let type: PlayType
    let timestamp: Date
    let hrSnapshot: Double?
    let sportSpecificData: [String: AnyCodable]?
}

enum SportType: String, Codable {
    case basketball
    case soccer
    case tennis
    case golf
    case pickleball
    case baseball
    case football
    case cornhole
    case custom
}

enum PlayType: String, Codable {
    case score
    case miss
    case streak
    case special
}
```

---

# Required Sport Extensibility Protocol

Each sport must implement a configuration layer.

```swift
protocol SportArenaConfiguration {
    var sportType: SportType { get }
    var arenaAssetName: String { get }
    var replayObjectAssetName: String { get }
    var scoreboardTitle: String { get }

    func impulse(for play: PlayEvent) -> SIMD3<Float>
    func particlePreset(for play: PlayEvent) -> String
    func audioCue(for play: PlayEvent) -> String
    func cameraMove(for play: PlayEvent) -> CameraMove
}
```

Use this to avoid hard-coding one sport into the core app.

---

# RealityView Scene SOP

## Entity Hierarchy

```text
rootEntity
├── sportArenaEntity
├── replayObjectTemplate
├── scoreboardPanel
├── playByPlayTicker
├── statOrbs[]
├── fitnessAuraEmitter
├── cameraRig
├── spotlightRig
├── environmentEffects
└── replayContainer
```

## Required Entities

| Entity | Purpose |
|---|---|
| `rootEntity` | main scene root |
| `sportArenaEntity` | court, field, board, hoop, green, lane, or other sport arena |
| `replayObjectTemplate` | ball, beanbag, puck, dart, or sport object cloned for physics replays |
| `scoreboardPanel` | RealityKit-attached SwiftUI scoreboard |
| `playByPlayTicker` | 3D or attachment-based broadcast ticker |
| `statOrbs` | grab-able holographic stat displays |
| `fitnessAuraEmitter` | HR / strain / recovery particle system |
| `cameraRig` | cinematic camera motion |
| `replayContainer` | temporary replay objects and cleanup |

---

# Scoring And Replay SOP

Every score input must trigger:

1. Model update.
2. Play event creation.
3. Physics replay.
4. Collision subscription.
5. Particle burst.
6. Haptic feedback.
7. Spatial audio.
8. Scoreboard animation.
9. Play-by-play ticker update.
10. Camera motion.
11. Environment mood update if streak or fitness state changes.

---

# Physics Replay Pattern

```swift
func replayAction(
    play: PlayEvent,
    config: SportArenaConfiguration,
    root: Entity,
    replayObjectTemplate: ModelEntity
) {
    let object = replayObjectTemplate.clone(recursive: true)
    object.position = [-3, 2, -6]

    object.components.set(
        PhysicsBodyComponent(
            massProperties: .default,
            material: .default,
            mode: .dynamic
        )
    )

    object.components.set(
        CollisionComponent(
            shapes: [.generateBox(size: [0.3, 0.08, 0.3])],
            mode: .default
        )
    )

    root.addChild(object)

    let impulse = config.impulse(for: play)
    object.applyLinearImpulse(impulse, relativeTo: nil)

    // Subscribe to collision events.
    // Trigger particles, haptics, audio, camera, and UI updates.
}
```

---

# Scoreboard SOP

Use `ViewAttachmentComponent` for scoreboard HUD.

Scoreboard must include:

- home score
- away score
- sport label
- current streak
- best streak
- optional HR / strain / recovery strip
- broadcast-style lower-third animation

Rules:

- scoreboard floats in scene
- scoreboard should feel like a TV graphic
- scoreboard can use SwiftUI internally
- scoreboard must not dominate the screen
- scoreboard should auto-hide or reduce when inactive

---

# Stat Orb SOP

Stat orbs should be RealityKit entities.

Each stat orb should:

- use holographic material
- support `ManipulationComponent`
- show a detail popover through `ViewAttachmentComponent` or `PresentationComponent`
- update live from `BroadcastArenaModel`
- scale or glow based on value change

Examples:

- score differential orb
- streak orb
- heart-rate orb
- strain orb
- recovery orb
- sport-specific metric orb

---

# HealthKit SOP

Use:

- `HKWorkoutSession`
- `HKLiveWorkoutBuilder`
- `HKLiveWorkoutDataSource`

Steps:

1. Request HealthKit permissions.
2. Start a custom sport workout.
3. Attach live workout builder.
4. Collect heart-rate samples.
5. Update `model.playerHR`.
6. Bind heart rate to particles and UI.

Flow:

```text
Apple Watch / iPhone Workout
   ↓
HKWorkoutSession
   ↓
HKLiveWorkoutBuilder
   ↓
Heart Rate Sample
   ↓
BroadcastArenaModel.playerHR
   ↓
Fitness Aura + Broadcast Effects
```

---

# WHOOP SOP

Use:

- OAuth 2.0
- backend-side secret storage
- App Attest where applicable
- webhooks for recovery, strain, and workout events
- push to app or polling fallback

WHOOP integration effects:

| Data | Visual Effect |
|---|---|
| Strain 0-21 | bloom, fog, particle intensity |
| Recovery 0-100 | color grade, aura tone, stat styling |
| Workout event | ticker, highlight context, summary |

---

# Metal Post-Processing SOP

Use RealityView post-processing with Metal and MPS for:

- bloom
- vignette
- film grain
- color grading
- glow intensity

Data-bound rule:

```text
Higher strain -> stronger bloom + denser fog + more energetic particles
Higher recovery -> cleaner color grade + calmer aura tone
```

---

# Audio, Haptics, Camera SOP

## Haptics

Use:

- `UIImpactFeedbackGenerator`
- Core Haptics

Trigger on:

- collision
- score
- streak
- special play
- game win

## Spatial Audio

Use:

- `AudioResource`
- entity-attached audio
- `SpatialAudioComponent`
- optional `AVAudioEngine`

Audio types:

- impact
- crowd cheer
- score stinger
- broadcast whoosh
- sport-specific sound

## Camera

Use:

- `CMMotionManager`
- subtle tilt
- auto-dolly
- score emphasis
- streak shake
- replay focus

---

# Export SOP

Use:

- RealityKit capture where available
- AVFoundation composition
- score overlays
- play-by-play metadata
- generated highlight reels

Exports should support:

- single play clips
- end-of-game recap
- streak highlight
- social-ready vertical clips
- broadcast-style widescreen clips

---

# Non-Functional Requirements

| Requirement | Standard |
|---|---|
| Immersion | RealityView dominant; SwiftUI minimal |
| Performance | 60 fps minimum, 120 fps preferred |
| Testing | physical device required |
| Privacy | full HealthKit and WHOOP consent |
| Accessibility | VoiceOver on attachments; high-contrast holographics |
| Extensibility | sport modules, not one hardcoded sport |
| Assets | Reality Composer Pro USDZ assets with baked materials/components |

---

# Phased Build SOP

## Phase 1 — Core Arena

- new SwiftUI iOS project
- full-screen RealityView
- primitive arena object
- primitive replay object
- manual scoring
- scoreboard attachment
- basic physics replay

## Phase 2 — Immersive Interaction

- sport-specific assets
- stat orbs
- manipulation
- particles
- ticker
- haptics
- spatial audio

## Phase 3 — Fitness And Broadcast Effects

- HealthKit live HR
- WHOOP strain/recovery
- Metal bloom/vignette/grain
- environment mood binding
- highlight capture

## Phase 4 — Productization

- multiple sports
- saved games
- player profiles
- exports
- sharing
- iPadOS
- visionOS

---

# Developer Handoff SOP

When building from this skill:

1. Start a new SwiftUI Xcode project.
2. Set iOS 19+ as the target.
3. Import SwiftUI, RealityKit, HealthKit, AVFoundation, CoreMotion, CoreHaptics, Metal.
4. Implement `BroadcastArenaModel`.
5. Implement `SportArenaConfiguration`.
6. Build the full-screen `RealityView`.
7. Add one sport module first.
8. Prove manual scoring and physics replay.
9. Add scoreboard attachment.
10. Add particles, haptics, and audio.
11. Add HealthKit.
12. Add WHOOP.
13. Add Metal post-processing.
14. Profile on device.
15. Extract reusable sport modules.

---

# AI Agent Instructions

When an AI coding agent uses this skill, it must:

- ask what sport is being implemented if not provided
- keep the architecture sport-agnostic
- create sport-specific modules
- avoid flat dashboard UI
- use RealityView as the core canvas
- keep SwiftUI overlays minimal
- build manual scoring first
- add fitness integrations later
- test on device early
- protect HealthKit and WHOOP privacy

---

# Common Mistakes To Avoid

| Mistake | Correction |
|---|---|
| Hardcoding cornhole | build a sport-agnostic core with sport modules |
| Building a flat scoreboard | use RealityView as the main experience |
| Using basic charts | convert stats into interactive holographic objects |
| Adding WHOOP too early | build the scoring loop first |
| Overusing SwiftUI overlays | keep overlays minimal and auto-hiding |
| Ignoring performance | profile RealityKit and Metal early |
| Testing only in simulator | test on physical device |
| Making effects decorative only | bind effects to score, streak, HR, strain, or recovery |

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

This SOP lets AI agents and developers build consistent premium iOS sports experiences for any sport.

The output should feel alive, cinematic, spatial, and broadcast-ready.

The app should feel like entering a live sports broadcast arena, not opening a normal scorekeeping app.
