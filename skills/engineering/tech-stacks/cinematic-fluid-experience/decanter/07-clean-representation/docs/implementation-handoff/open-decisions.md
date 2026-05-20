# Open Decisions

Explainer ID: FSEXP-021  
Source lines: 216-242, 243-265  
Related IDs: PRD-018, PRD-021, PRD-022, PRD-024; FSTECH-007-FSTECH-009, FSTECH-028-FSTECH-033

## Core Point

Earlier PRD sections correctly identified unresolved implementation choices. Later "no gaps remain" claims should not erase those decisions.

## Decision Ledger

| Area | Open Decision | Recommended First Answer |
|---|---|---|
| Fluid simulation | Which web fluid technique starts Slice 1? | Use the simplest controlled WebGPU particle/fluid approximation or official example. |
| Backend / AI | How does an AI control Blender? | Defer; later evaluate FastAPI + `bpy`, Blender MCP, and local/cloud model options. |
| Asset format | How do assets move between Apple, web, and Blender? | Use USDZ primary for Apple and glTF/GLB for web when assets exist. |
| State sync | How do Watch, iPhone, iPad, and web talk? | Defer until companion control or saved state exists. |
| Auth / data | Are user accounts needed? | No for Slice 1; yes later for saved scans, creations, sync, or exports. |

## Rule

Do not treat architecture choices as solved until there is an acceptance criterion and verification path.
