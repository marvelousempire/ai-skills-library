---
name: ios-realitykit-4-patterns
id: SK-0128
keywords: [ios, realitykit, patterns]
domain: project/yousirjuan
status: Active
tool: Claude Code
description: >
  SwiftUI + RealityKit 4 component patterns for the You-Sir Juan OS iOS kiosk app.
  Covers AvatarRealityView, KioskMode, EnrollView, ParadigmIcon, and the three
  immersion levels (L1 SwiftUI / L2 hybrid RealityView / L3 full physics).
---

# iOS RealityKit 4 Patterns

## Project setup

```yaml
# apps/yousirjuan-ios/project.yml
options:
  deploymentTarget:
    iOS: "18.0"
    visionOS: "2.0"
```

Run `xcodegen generate` after any `project.yml` change.

## Key component patterns

### AvatarRealityView (L2) — `Sources/Views/AvatarRealityView.swift`

The Associate Agent's visual presence on the home screen. A floating accent-colored orb with physics and light.

```swift
import RealityKit

struct AvatarRealityView: View {
    let accentHex: String
    let greeting: String

    var body: some View {
        RealityView { content in
            // Sphere entity with SimpleMaterial tinted to accent color
            let mesh = MeshResource.generateSphere(radius: 0.1)
            let mat = SimpleMaterial(color: UIColor(Color(hex: accentHex)), isMetallic: false)
            let sphere = ModelEntity(mesh: mesh, materials: [mat])
            sphere.components[PhysicsBodyComponent.self] = PhysicsBodyComponent(mode: .static)

            // Pulsing animation
            let anim = FromToByAnimation<Transform>(
                from: Transform(scale: .init(repeating: 0.95)),
                to:   Transform(scale: .init(repeating: 1.05)),
                duration: 2.0, timing: .easeInOut, isAdditive: false
            )
            sphere.playAnimation(try! AnimationResource.generate(with: anim).repeat())

            // Accent-colored point light
            let light = Entity()
            light.components[PointLightComponent.self] = PointLightComponent(
                color: UIColor(Color(hex: accentHex)),
                intensity: 500
            )
            light.position = [0, 0.3, 0]
            content.add(sphere)
            content.add(light)
        }
        .overlay(alignment: .bottom) {
            Text(greeting).font(.title3).padding()
        }
    }
}
```

### KioskMode — `Sources/Services/KioskMode.swift`

Locks iPad in kiosk mode when no session is active.

```swift
import UIKit

final class KioskMode {
    static func enable()  { UIAccessibility.requestGuidedAccessSession(enabled: true)  { _ in } }
    static func disable() { UIAccessibility.requestGuidedAccessSession(enabled: false) { _ in } }
}
```

Trigger in `YouSirJuanApp.swift`:
```swift
.onChange(of: scenePhase) { _, phase in
    if phase == .active && session.current == nil &&
       UIDevice.current.userInterfaceIdiom == .pad {
        KioskMode.enable()
    }
}
```

### ParadigmIcon — `Sources/Support/ParadigmIcon.swift`

Returns SF Symbol names per paradigm and icon kind.

```swift
enum IconKind { case day, tasks, world, signOut, voice }

func icon(for labelSet: String, kind: IconKind) -> String {
    let map: [String: [IconKind: String]] = [
        "executive": [.day: "calendar.badge.clock", .voice: "waveform.badge.mic", ...],
        "warm":      [.day: "sun.horizon.fill",       .voice: "mic.fill", ...],
        "technical": [.day: "terminal.fill",          .voice: "waveform", ...],
        "sovereign": [.day: "crown.fill",             .voice: "mic.badge.plus", ...],
    ]
    return map[labelSet]?[kind] ?? "circle"
}
```

### EnrollView (face enrollment) — `Sources/Views/EnrollView.swift`

AVCaptureSession + Vision face detection → SHA-256 face ID.

```swift
// Key flow:
// 1. AVCaptureSession with video output
// 2. VNDetectFaceRectanglesRequest on each frame
// 3. When face stable for 0.8s → capture still
// 4. SHA-256(boundingBox + timestamp) → faceId
// 5. POST /api/identity/enroll { faceId, userId, displayName }
```

Trigger via long-press (0.8s) on AddMemberTile in AuthView.

### visionOS ImmersiveSpace

```swift
// YouSirJuanApp.swift
#if os(visionOS)
ImmersiveSpace(id: "AvatarSpace") {
    AvatarRealityView(accentHex: "#7C5CFF", greeting: "Welcome.")
}
#endif
```

## Immersion levels

| Level | When | APIs |
|---|---|---|
| L1 | Auth, onboarding, settings | Pure SwiftUI |
| L2 | Home world, voice screen | RealityView heroes + SwiftUI overlay |
| L3 | Future spatial modes | Full physics scene, no SwiftUI chrome |

## Build command

```bash
cd apps/yousirjuan-ios
xcodegen generate
xcodebuild -project YouSirJuan.xcodeproj \
  -scheme YouSirJuan \
  -destination 'platform=iOS Simulator,name=iPad Pro 13-inch (M5)' \
  -configuration Debug CODE_SIGNING_ALLOWED=NO build \
  2>&1 | grep -E "(error:|BUILD SUCCEEDED|BUILD FAILED)"
```

## Common errors

| Error | Fix |
|---|---|
| `PhysicsBodyComponent` not found | Ensure iOS 18.0 deployment target |
| `ViewAttachmentComponent` not found | Same — iOS 18 API |
| `VNDetectFaceRectanglesRequest` auth crash | Add `NSCameraUsageDescription` to Info.plist |
| Guided Access requires entitlement | Enable `com.apple.developer.accessibility.guided-access` capability |
