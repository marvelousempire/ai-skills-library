# First Prototype Tutorial

Explainer ID: FSEXP-002  
Source lines: 27-30, 714  
Related IDs: PRD-018; FSTECH-001-FSTECH-009

## Core Point

The fastest first prototype starts with a Vite React app, then adds Three.js, React Three Fiber, and Drei before testing a GPU fluid or particle approach.

## Starter Shape

```sh
npm create vite@latest my-app -- --template react
npm install three @react-three/fiber @react-three/drei
```

## What To Explore First

Use simple GPU fluid examples, particle systems, or shader demos as the first milk approximation. The goal is not final physical correctness; the goal is to prove opaque, viscous, interactive liquid can feel cinematic in the browser.

## Slice Boundary

Do not add Firebase, Blender, Watch, or native code to this first tutorial path. Those belong after the visual prototype proves the core illusion.
