# Cinematic Fluid Experience

Structured knowledge base for the **Cinematic Interactive Experience** multi-agent project: product requirements, visual quality doctrine, rendering pipelines, PRD variants, and the native **Cinematic Broadcast Arena** blueprint.

## Read order

1. [`docs/product/canonical-prd.md`](docs/product/canonical-prd.md) — **Single source of truth** for product scope (`PRD-001` … `PRD-029`).
2. [`docs/quality/master-cinematic-quality-bible.md`](docs/quality/master-cinematic-quality-bible.md) — Visual quality index → [`bible/`](docs/quality/bible/README.md), [`shaders/`](docs/quality/shaders/README.md), [`fluid-sim/`](docs/quality/fluid-sim/README.md).
3. [`docs/rendering/`](docs/rendering/README.md) — ACES tone mapping + screen-space fluid rendering deep dives.
4. [`docs/arena/cinematic-broadcast-arena.md`](docs/arena/cinematic-broadcast-arena.md) — Native iOS broadcast-arena framework (RealityKit 4).
5. [`docs/prd-variants/`](docs/prd-variants/README.md) — Iteration snapshots when you need history.

## Folder map

```text
doctrine/
├── README.md                 ← you are here
├── archive/                  ← original flat filenames (immutable history)
│   └── PRD for Fluid Simulation App.md
└── docs/
    ├── product/              ← canonical PRD + research extracts
    ├── prd-variants/         ← three PRD/tech-stack iteration docs
    ├── quality/              ← bible/, shaders/, fluid-sim/, AI prompts
    ├── rendering/            ← ACES + screen-space fluid
    └── arena/                ← cinematic broadcast arena (iOS)
```

## Related implementation

| Surface | Path |
|--------|------|
| Fluid decanter + clean PRD | [`../decanter/`](../decanter/) |
| Web hero app | [`../decanter/apps/cinematic-fluid-hero/`](../decanter/apps/cinematic-fluid-hero/) |
| Arena ↔ web bridge | [`../decanter/07-clean-representation/docs/product/cinematic-broadcast-arena-bridge.md`](../decanter/07-clean-representation/docs/product/cinematic-broadcast-arena-bridge.md) |

## DRY contract

| Topic | Canonical file |
|-------|------------------|
| Product requirements | `docs/product/canonical-prd.md` |
| Visual / shader quality | `docs/quality/master-cinematic-quality-bible.md` → `bible/`, `shaders/`, `fluid-sim/` |
| Copy-paste AI prompts | `docs/quality/ai-prompt-templates.md` |
| ACES math + shaders | `docs/rendering/aces-tone-mapping.md` |
| Fluid surface rendering | `docs/rendering/screen-space-fluid-rendering.md` |
| Native sports/broadcast arena | `docs/arena/cinematic-broadcast-arena.md` |
| Full conversation PRD dump | `docs/product/conversation-source-archive.md` |

Do not fork long checklists into other repos without cross-linking here.

## Sorting skill

This tree was produced with **doctrine-decanter-sorting-agent** ([`skills/methodology/doctrine-decanter-sorting-agent/`](../../../methodology/doctrine-decanter-sorting-agent/)).

## Status

**Reorganized:** May 19, 2026 — flat combined markdown files split into `docs/` tree; originals preserved under `archive/`.
