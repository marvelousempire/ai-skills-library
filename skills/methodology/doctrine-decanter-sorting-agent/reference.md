# Reference — cinematic_fluid_experience sort (May 2026)

Example of this skill applied end-to-end. **Canonical (AISL):**

`skills/engineering/tech-stacks/cinematic-fluid-experience/doctrine/`

Nephew stub: `skills/new-tech-stack-depository/README.md` (redirect only).

## Before

```text
cinematic_fluid_experience/
├── PRD for Fluid Simulation App.md          # 849 lines, 4× duplicate PRD
├── Master Cinematic Quality Bible.md      # rules + shaders + fluid in one file
├── Hard Rules the AI Must Follow.md       # overlapping style-bible merges
├── ACES Filmic Tone Mapping – Full Invest.md
├── Screen-Space Fluid Rendering Implementation.md
├── Cinematic Fluid Experience Tech Stack.md
├── Cinematic Interactive Experience 1 Tech Stack.md
├── Cinematic Interactive Experience 2 Tech Stack.md
└── cinematic-broadcast-arena.md
```

## After (phase 1 — explode)

```text
cinematic_fluid_experience/
├── README.md
├── archive/
└── docs/
    ├── product/          # canonical-prd.md (PRD-001…029 extract)
    ├── prd-variants/     # three iteration snapshots
    ├── quality/          # bible, shaders, fluid-sim split later
    ├── rendering/
    └── arena/
```

## After (phase 2 — bible split)

```text
docs/quality/
├── master-cinematic-quality-bible.md   # index only
├── bible/        # hard-rules, design-tokens, post-processing-pipeline
├── shaders/      # metal-cinematic-lmt, wgsl-aces-pipeline
└── fluid-sim/    # mls-mpm-*, webgpu-compute
```

## Dedup actions taken

| Cluster | Canonical | Cleared / archive |
|---------|-----------|-------------------|
| PRD vision (4 drafts) | `canonical-prd.md` (last `PRD-*` block) | Full file in `archive/` + conversation-source-archive |
| Style bible vs hard rules | `bible/` + `shaders/` | `hard-rules-for-ai.md` marked archive; monolith in `archive/` |
| Tech stack docs | `prd-variants/` (labeled iterations) | Not merged into canonical PRD |

## Renumbering

- Product: `PRD-001` … `PRD-029` in canonical PRD only
- Decanter cross-links updated in `fluid-simulation-decanter/`

## Invoke

```text
@doctrine-decanter-sorting-agent Structure and de-duplicate
skills/new-tech-stack-depository/<target-folder>/
```
