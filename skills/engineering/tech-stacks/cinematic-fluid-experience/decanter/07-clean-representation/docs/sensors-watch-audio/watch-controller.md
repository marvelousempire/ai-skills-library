# Watch Controller

Explainer ID: FSEXP-014  
Source lines: 129-138, 507-508, 619  
Related IDs: PRD-002, PRD-020; FSTECH-027

## Core Point

Apple Watch is a companion controller, not the renderer. It should provide tilt input, simple controls, triggers, and haptic feedback while the heavy simulation runs on iPhone, iPad, or web.

## Why

Watch has a tiny screen and limited performance compared with the target render surfaces. Its strength is intimate input and haptics, not running a cinematic milk simulation.

## Good Watch Jobs

- Tilt control.
- Start/stop pour.
- Trigger effects.
- Haptic confirmation.
- Simplified status display.

## Boundary

Do not design Watch as a full simulation surface. Treat it as a later companion slice after the main interaction model works.
