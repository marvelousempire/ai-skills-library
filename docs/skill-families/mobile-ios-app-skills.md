# 14 — Mobile & iOS App Development Skills Family

## Purpose

This family covers premium iOS, iPadOS, and future visionOS app-development skills.

Use this family when the task involves:

- SwiftUI app development
- RealityKit app development
- RealityView-first immersive apps
- iOS scorekeeping apps
- cinematic mobile apps
- HealthKit integrations
- WHOOP integrations
- Metal post-processing
- Core Motion
- Core Haptics
- Reality Composer Pro assets
- iPhone-native immersive experiences
- sport-specific app modules

---

# Core Skills

| Skill | Path | Purpose |
|---|---|---|
| Immersive Cinematic Sports Broadcast Arena SOP | `skills/mobile/ios/immersive-cinematic-sports-broadcast-arena-sop/SKILL.md` | reusable any-sport SOP for cinematic sports scorekeeping/stat apps |
| Cornhole Arena Cinematic Broadcast Scorekeeper | `skills/mobile/ios/cornhole-arena-cinematic-broadcast-scorekeeper/SKILL.md` | sport-specific implementation example using cornhole as the first proof-of-concept |

---

# Important Distinction

The **Immersive Cinematic Sports Broadcast Arena SOP** is the master reusable pattern.

The **Cornhole Arena** skill is an example implementation of that pattern.

Cornhole must not be treated as the only use case.

The reusable system supports:

- basketball
- soccer
- tennis
- golf
- pickleball
- volleyball
- baseball
- football
- cornhole
- bowling
- darts
- table tennis
- custom sports

---

# Inputs

- sport name
- scoring rules
- game events
- visual style
- scoreboard requirements
- stat requirements
- wearable data requirements
- asset requirements
- app target version
- hardware target

---

# Outputs

- PRD
- SOP guide
- Xcode project plan
- Swift data models
- RealityView architecture
- sport module protocol
- HealthKit integration plan
- WHOOP integration plan
- Reality Composer Pro asset spec
- Metal post-processing plan
- phased build roadmap

---

# Required Apple Stack

| Layer | Technology |
|---|---|
| UI | SwiftUI |
| 3D / Immersive | RealityKit 4 |
| Canvas | RealityView |
| Effects | Metal + MPS |
| Assets | Reality Composer Pro + USDZ |
| Fitness | HealthKit |
| Wearables | WHOOP OAuth + webhooks |
| Motion | Core Motion |
| Haptics | Core Haptics + UIImpactFeedbackGenerator |
| Audio | RealityKit spatial audio + AVAudioEngine |
| Export | AVFoundation |

---

# AI Routing Note

Use this family when a user asks to build a premium mobile app that should feel cinematic, immersive, spatial, sports-broadcast-like, game-like, or RealityKit-powered.

For any sport, start with:

```text
skills/mobile/ios/immersive-cinematic-sports-broadcast-arena-sop/SKILL.md
```

Then create or adapt a sport-specific implementation skill only if needed.
