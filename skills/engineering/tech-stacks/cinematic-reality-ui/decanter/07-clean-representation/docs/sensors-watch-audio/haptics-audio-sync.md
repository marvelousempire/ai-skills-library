# Haptics And Audio Sync

Explainer ID: FSEXP-015  
Source lines: 41-43, 115-118, 573, 696, 821  
Related IDs: PRD-008, PRD-009, PRD-013; FSTECH-013, FSTECH-022-FSTECH-023

## Core Point

Liquid realism is not only visual. Sloshing, pouring, impact sounds, and haptic feel make the simulation feel physical.

## Platform Meaning

| Platform | Approach |
|---|---|
| Web | Web Audio API or Howler.js for sound; Vibration API only where available and useful. |
| iOS / iPadOS | AVFoundation, Spatial Audio, AVAudioEngine, Core Haptics, and feedback generators. |
| Watch | Haptic companion feedback for tilt, pour, or trigger events. |

## Sync Rule

Audio and haptics should be driven by fluid events: pour start, impact, splash, collision, viscosity change, and stop. They should not feel like disconnected UI beeps or generic taps.

## Build Order

Web visual interaction comes first. Add sound and haptics after the core scene has reliable events to bind against.
