# Accessibility Controls

Explainer ID: FSEXP-020  
Source lines: 63, 572, 695, 820  
Related IDs: PRD-028; FSTECH-012

## Core Point

Accessibility cannot stay as a vague promise. Motion sensitivity and low-vision support need concrete behavior.

## Required Behaviors

| Need | Behavior |
|---|---|
| Motion sensitivity | Add reduced-motion mode that reduces or freezes high-motion fluid effects. |
| Low vision | Keep controls legible, high-contrast, and not dependent only on subtle glow. |
| Assistive tech | Native HUD attachments should support VoiceOver where applicable. |
| Control access | Pointer/touch controls should have clear alternatives where possible. |

## Slice 1 Minimum

The web prototype should include a reduced-motion toggle. It can reduce particle disturbance, slow animation, or freeze nonessential effects while keeping the scene understandable.

## DRY Note

Use one shared accessibility behavior document and one shared token/control pattern instead of inventing separate reduced-motion behavior per platform.
