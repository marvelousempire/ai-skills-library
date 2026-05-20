# Development Hardware

Explainer ID: FSEXP-022  
Source lines: 386-393, 425-429, 582-586, 718-722, 830-834  
Related IDs: PRD-011, PRD-014, PRD-019, PRD-020; FSTECH-014-FSTECH-027

## Core Point

Native iOS and RealityKit development requires a Mac. LiDAR, iPad Pro, and Apple Watch are test hardware for later native, scanning, and companion-controller slices.

## Hardware Checklist

| Hardware | Why |
|---|---|
| MacBook M1 or newer | Required for Xcode, SwiftUI, RealityKit, and native Apple builds. |
| iPhone 12 Pro or newer | Needed for LiDAR testing and high-quality on-device sensor work. |
| iPad Pro | Recommended for iPadOS layout, Apple Pencil, and larger immersive testing. |
| Apple Watch | Needed for companion controller and haptic testing. |
| Web-capable dev machine | Enough for the first Vite/R3F prototype. |

## Build Order

Web Slice 1 can start without the full native hardware stack. Native, Watch, LiDAR, and Pencil work should wait until the relevant hardware is available for verification.
