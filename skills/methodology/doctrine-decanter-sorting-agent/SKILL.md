---
name: doctrine-decanter-sorting-agent
keywords: [audit-doctrine, check-decanter, build-sorting]
hash: abc37c9
relations: []
before: []
governed_by: [global]
meta: dynamic
goal: Deliver doctrine decanter sorting agent output correctly and completely.
description: >-
  Sorts messy PRDs, doctrine dumps, and chat-export planning files into a
  professional docs tree: re-number stable IDs, de-duplicate (canonical on top,
  duplicates at bottom with clear spacing), split monoliths into bible/shaders/
  product folders, preserve archives, and wire README indexes. Use when the user
  asks to structure a project folder, break into folders, split a PRD, decanter,
  de-duplicate, re-number requirements, move doubles to the bottom, organize
  cinematic fluid experience-style docs, or clean up combined single-file dumps.
disable-model-invocation: true
---

# Doctrine Decanter Sorting Agent

One agent workflow that combines **folder explosion**, **page splitting**, **stable re-numbering**, and **visual de-duplication** — the same discipline used to turn flat `cinematic_fluid_experience/` dumps into `docs/product`, `docs/quality/bible|shaders|fluid-sim`, and `archive/`.

## When to use

- Long PRD, PRD Journal, chat export, or doctrine file merged into one markdown
- User says: structure this project, break into folders, split pages, decanter, dedupe, re-number
- User says: put non-doubles at the top, move duplicates to the bottom with space
- Multi-agent / skills depository cleanup (tech stack, quality bible, arena blueprints)

## Non-negotiable outcomes

1. **Readable tree** — top `README.md`, `docs/` areas, per-topic folders, one section per file where substance warrants it
2. **Stable re-numbering** — every requirement/item gets a consistent ID (`PRD-001`, `FSPRD-012`, `§3.8`, folder `01-`, `02-`)
3. **De-duplication without deletion** — canonical content **at the top**; duplicate/near-duplicate blocks **at the bottom**, separated by a visible cleared zone
4. **DRY canonical paths** — one source of truth per topic; cross-links, not copy-paste
5. **Archive preserved** — originals land in `archive/`; never silently delete conversation history

## Phase 1 — Ingest and inventory

1. Read the **entire** source (all files if a folder).
2. List discovered **topics/pages** (headings, repeated PRD drafts, bible versions, tech-stack iterations).
3. List **duplicate clusters** (same vision block, same token table, same PRD section re-pasted).
4. Pick **one canonical version** per cluster (prefer: latest date, has stable IDs, most complete, user-marked "final").
5. Emit a short **inventory table** before editing:

```markdown
| ID | Topic | Canonical? | Action |
|----|-------|------------|--------|
| PRD-001 | Vision | yes | → docs/product/canonical-prd.md |
| dup-A | Vision (draft 2) | no | → bottom cleared zone |
```

## Phase 2 — Re-number everything

Apply **one numbering scheme** across the target corpus:

| Asset type | Pattern | Example |
|------------|---------|---------|
| Product requirements | `PRD-NNN` zero-padded | `PRD-001` … `PRD-029` |
| Feature / inventory rows | Project prefix + number | `FSPRD-001`, `FSEXP-003` |
| Plans / folders | `NNNN-kebab-title` | `0036-cinematic-fluid-hero` |
| Doc sections inside a bible | `§` or folder order | `bible/`, `shaders/`, `fluid-sim/` |
| Split page folders | `01-topic/`, `02-topic/` | `01-product/`, `02-quality/` |

Rules:

- Continue from **highest existing** number in the repo; never reuse IDs for different meaning
- Renumber **in canonical files only** first; duplicates keep old numbers in the cleared zone for traceability
- Tables and requirement ledgers must have **one row per unique requirement** in the canonical section

## Phase 3 — De-duplicate (user rule — follow verbatim)

Do your best to re-number everything and then de-duplicate so when you duplicate what you're gonna do is just move all of the ones that are double all the way to the bottom all the way to the bottom with a bunch of space so I can know that they're cleared out and I want you to put all the ones that are not doubles at the top.

### How to apply inside a file

```markdown
# Canonical Document Title

> Canonical body: only non-duplicate sections below.

## 1. Section (canonical)
…

## 2. Section (canonical)
…

---

<!-- CLEARED DUPLICATES — moved to bottom for review; not deleted -->

<br><br><br>

---

# Cleared duplicates (superseded)

The following blocks are **duplicate or superseded** copies kept for audit. Do not implement from this zone unless recovering lost nuance.

## [dup] Vision (draft from line ~350)
…

## [dup] Vision (draft from line ~738)
…
```

### How to apply across a folder

| Layer | Non-duplicates (top) | Duplicates (bottom) |
|-------|----------------------|---------------------|
| Repo | `docs/` canonical tree | `archive/` + `*/superseded/` or `docs/*/cleared-duplicates.md` |
| Index README | Links to canonical paths only | Link to archive with "superseded / duplicate" label |
| Requirement table | Unique rows at top | Duplicate rows after spacer + heading `## Cleared duplicate rows` |

Use **at least 3 blank lines + horizontal rule + HTML `<br>` breaks** before the cleared zone so it is visually obvious in preview.

## Phase 4 — Explode into folders (structure exploder + page splitter)

Default tree for a doctrine / tech-stack depository:

```text
<project-name>/
├── README.md                 # purpose, read order, DRY table, folder map
├── archive/                  # flat originals + monolithic pre-split files
│   └── README.md
└── docs/
    ├── README.md
    ├── product/              # canonical PRD, gap audits, research extracts
    ├── prd-variants/         # iteration snapshots (not SSOT)
    ├── quality/
    │   ├── master-….md       # INDEX only after split
    │   ├── bible/            # rules, tokens, pipeline order
    │   ├── shaders/          # copy-paste shader source
    │   └── fluid-sim/        # compute + MLS-MPM (or domain equivalent)
    ├── rendering/            # deep technical supplements
    └── arena/                # platform-specific blueprints (e.g. iOS arena)
```

Workflow:

1. **One major concept → one folder** (`product/`, `quality/bible/`, not one 800-line file)
2. **One meaningful section → one kebab-case `.md`**
3. **Every folder gets `README.md`** with links to children
4. **Monolith becomes index** — e.g. `master-cinematic-quality-bible.md` links into `bible/`, `shaders/`, `fluid-sim/`
5. **Split PRD**: extract final `PRD-*` block → `docs/product/canonical-prd.md`; full dump → `conversation-source-archive.md`

### Page detection (from PRD journal splitter)

Treat as page/topic boundaries:

- H1–H3 headings, bold standalone labels, numbered sections
- Repeated "final PRD" / "here's the updated PRD" chat blocks
- File-path headings (`.md`, `.tsx`, workflow names)
- Durable artifacts: maps, manifests, checklists, tech stacks, bibles

Group related sections in the **same folder** (all GitHub actions together, all maps together, all shader code in `shaders/`).

## Phase 5 — DRY and cross-links

| Topic | Single canonical file |
|-------|------------------------|
| Product scope | `docs/product/canonical-prd.md` |
| Visual rules | `docs/quality/bible/hard-rules.md` |
| Design tokens | `docs/quality/bible/design-tokens.md` |
| Shader source | `docs/quality/shaders/*.md` |
| Deep research | `docs/rendering/*.md` (link from bible, do not duplicate) |

Update **downstream references** (other folders, apps, `AI_AGENT_RULES`, bridge docs) to canonical paths.

Add a **redirect stub** at old flat paths if links exist elsewhere:

```markdown
# Moved

Canonical: [new/path](new/path)
```

## Phase 6 — Verification checklist

```text
- [ ] Every major source section mapped in README inventory
- [ ] IDs renumbered consistently in canonical files
- [ ] Non-duplicates at top; duplicates in bottom cleared zone or archive/
- [ ] No second canonical copy of same tokens/shaders/PRD vision
- [ ] archive/ contains pre-split monoliths
- [ ] Folder READMEs + top README read order present
- [ ] Downstream links updated or redirect stubs added
```

Report to user:

```markdown
## Sorting complete

**Canonical entry:** `<path>`
**Archive:** `<path>`
**Cleared duplicates:** `<count>` blocks → `<where>`
**Renumbering:** `<scheme>` (`PRD-001`…)
**Open review:** <ambiguous clusters>
```

## Safety

- **Do not delete** source material unless the user explicitly asks
- Follow repo **plan-first** rules when the sort touches code or architecture
- Scope edits to the target depository unless updating explicit cross-links
- Prefer **smallest correct diff** — structure and move, not rewrite prose

## Related skills

- [`prd-journal-page-splitter`](../prd-journal-page-splitter/) — page detection; use alone when you only need folder split without renumber/dedupe
- `document-structure-exploder` (personal `~/.cursor/skills/`) — folder-per-page explosion reference

**Prefer this skill** when the user wants numbering + dedupe + folder structure in one pass.

## Reference

Worked example: Nephew `skills/new-tech-stack-depository/cinematic_fluid_experience/` — see [reference.md](reference.md).
