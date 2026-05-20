# Asset Format Bridge

Explainer ID: FSEXP-018  
Source lines: 256-258, 571, 694, 819  
Related IDs: PRD-024, PRD-026; FSTECH-032-FSTECH-033

## Core Point

USDZ is the Apple-native primary format, while glTF/GLB is the web-friendly Three.js format.

## Bridge Strategy

| Format | Use |
|---|---|
| USDZ | RealityKit/iOS/iPadOS asset loading and Apple ecosystem workflows. |
| glTF / GLB | Web rendering in Three.js and R3F. |
| `.obj` | 3D printing and broad interchange where needed. |

## Conversion Meaning

The future asset pipeline should support USDZ to glTF/GLB conversion using Reality Converter, USD tooling, or another verified conversion path.

## Build Order

Do not build conversion first. Add it when real assets need to cross Apple, web, Blender, and export surfaces.
