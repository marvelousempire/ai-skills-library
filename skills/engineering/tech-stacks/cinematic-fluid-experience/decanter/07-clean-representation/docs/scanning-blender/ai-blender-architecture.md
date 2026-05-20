# AI Blender Architecture

Explainer ID: FSEXP-017  
Source lines: 252-255  
Related IDs: PRD-016, PRD-021; FSTECH-028-FSTECH-030

## Core Point

The PRD describes an AI-controlled Blender cleanup path: an agent can drive Blender's Python API to repair and optimize scans.

## Architecture Shape

| Piece | Role |
|---|---|
| FastAPI or lightweight backend | Receives scans and coordinates processing. |
| Claude / GPT / local model | Decides cleanup steps or runs scripted repair workflows. |
| Blender Python API (`bpy`) | Executes topology cleanup, smoothing, retopology, and export prep. |
| Model export pipeline | Returns polished `.obj`, `.usd`, or downstream formats. |

## MCP Note

The source mentions Blender MCP as one possible bridge. Treat it as an integration candidate, not a hard dependency until implementation research confirms the best local workflow.

## Build Order

Only build this once scanning or saved asset workflows exist.
