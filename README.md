# AI Skills Library

**Private repo** — [github.com/marvelousempire/ai-skills-library](https://github.com/marvelousempire/ai-skills-library)

Vendored **Agent Skills** + operating docs: browse on GitHub, sync to any Mac, and keep marketing / Cursor / Claude skills in one place.

---

## Start here

| I want to… | Open |
|------------|------|
| **See every skill file (clickable)** | **[`skills/README.md`](skills/README.md)** → packs |
| **All 41 marketing skills** | **[`skills/marketing/SKILL-CATALOG.md`](skills/marketing/SKILL-CATALOG.md)** |
| **Cursor toolkit (babysit, canvas, …)** | **[`skills/ide/cursor/SKILL-CATALOG.md`](skills/ide/cursor/SKILL-CATALOG.md)** |
| **Marketing by category (SEO, CRO, …)** | **[`skills/marketing/CATEGORIES.md`](skills/marketing/CATEGORIES.md)** |
| **UI/UX Pro Max** | **[`skills/visual/design/ui-ux-pro-max/SKILL.md`](skills/visual/design/ui-ux-pro-max/SKILL.md)** |
| **Red-E Play Claude skills** | **[`skills/project/red-e-play/README.md`](skills/project/red-e-play/README.md)** |
| **READYPLAY positioning (Agent context)** | **[`context/readyplay-product-marketing-context.md`](context/readyplay-product-marketing-context.md)** |
| **Overlap / which skill wins** | [`docs/overlap-rules.md`](docs/overlap-rules.md) |
| **Install & symlink on a new machine** | [`docs/marketingskills.md`](docs/marketingskills.md) |
| **Browse on GitHub** | [`docs/browse-on-github.md`](docs/browse-on-github.md) |
| **Bottlenecks & checklist** | [`docs/process.md`](docs/process.md) |
| **Refresh copies from `~/`** | [`scripts/vendor-skills-from-home.sh`](scripts/vendor-skills-from-home.sh) (run after upstream updates) |
| **Third-party licenses** | [`THIRD_PARTY.md`](THIRD_PARTY.md) |

---

## What’s in the repo

```
ai-skills-library/
├── README.md                 ← you are here
├── SKILL-INDEX.md            ← quick reference table (tools + overlap)
├── THIRD_PARTY.md            ← licenses / attribution
├── context/                  ← product marketing context snapshot
│   ├── README.md
│   └── readyplay-product-marketing-context.md
├── skills/                   ← vendored SKILL.md trees (categorized)
│   ├── README.md             ← taxonomy + counts
│   ├── marketing/            ← 41 skills (Corey Haines pack)
│   │   ├── SKILL-CATALOG.md
│   │   └── CATEGORIES.md     ← SEO, CRO, copy, …
│   ├── visual/
│   │   └── design/
│   │       └── ui-ux-pro-max/  ← UI Pro Max (uipro-cli)
│   ├── ide/
│   │   └── cursor/           ← 13 Cursor skills-cursor + SKILL-CATALOG.md
│   └── project/
│       └── red-e-play/       ← verify-ship, generate-weather-plates
├── docs/                     ← process, install, sync, browse help
└── scripts/
    ├── rescan-skills.sh      ← list unique SKILL.md on a machine
    ├── vendor-skills-from-home.sh
    └── generate-skill-catalogs.py
```

**Counts:** **57** `SKILL.md` files under `skills/` (regenerate catalogs after vendor).

---

## Quick use (agents)

1. Fuzzy task → open **[`SKILL-INDEX.md`](SKILL-INDEX.md)** or **[`skills/marketing/SKILL-CATALOG.md`](skills/marketing/SKILL-CATALOG.md)**.
2. Name the skill in chat: *“Use **page-cro** for this landing section.”*
3. For READYPLAY marketing, align with **[`context/readyplay-product-marketing-context.md`](context/readyplay-product-marketing-context.md)** (canonical edit path: `red-e-play-app/.agents/product-marketing-context.md`).

---

## Sync from your Mac into this repo

```bash
cd ~/Developer/ai-skills-library
./scripts/vendor-skills-from-home.sh
git add -A skills/ context/   # or explicit paths — see session discipline
git commit -m "chore: refresh vendored skills"
git push
```

---

## Repo status

- **Local clone:** `~/Developer/ai-skills-library`
- **Remote:** private — `marvelousempire/ai-skills-library`
- **Created:** 2026-05-10 (skills vendored later the same month)

### New machine: clone + install skills to `~/`

Clone this repo for reference, then install tools per [`docs/marketingskills.md`](docs/marketingskills.md). Optionally copy `skills/*` into `~/.agents/skills/` / `~/.cursor/skills/` using the rsync recipes in [`docs/sync.md`](docs/sync.md).

