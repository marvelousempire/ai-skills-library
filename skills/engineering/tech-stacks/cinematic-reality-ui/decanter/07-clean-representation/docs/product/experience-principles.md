# Experience Principles

Explainer ID: FSEXP-009  
Source lines: 499, 609-611, 747  
Related IDs: PRD-001, PRD-025

## Core Point

The product quality bar is immersion-first: full-screen, premium, cinematic, addictive, and specifically not a crummy basic 2D interface or playful/cartoonish fluid toy.

## Design Meaning

The fluid simulation should feel like a cinematic game scene, not a dashboard with a visual effect embedded inside it. SwiftUI or React UI should support the scene with minimal overlays, HUDs, controls, and state, while the main experience remains the immersive pour.

## Implementation Implication

Every first-slice decision should be checked against this bar:

- Does the scene fill the viewport?
- Does the milk read as premium and physical?
- Are controls minimal and tactile?
- Does the UI avoid distracting panel-heavy layout?
- Does the motion feel satisfying without becoming cartoonish?

## DRY Note

Use this page as the shared quality gate for web, native, and future handoff work instead of restating the aesthetic rules in every feature document.
