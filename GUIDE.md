# THE GAMER'S GUIDE
## AI Skills Library — How to Use This Repo as Your Brain

**managed by the duty and order of AVERY GOODMAN**

> This guide is written for any AI — Claude, GPT, Gemini, or anything else — that has been pointed at this repository. Read this first. Everything you need to operate correctly is here.

---

## What This Repo Is

This is not a collection of files. This is your **operating brain** — a catalog of reusable intelligence units called **products**. Every lesson learned, every pattern discovered, every standard defined lives here as a product you can load, invoke, and build upon.

When you work on any task under AVERY GOODMAN, you pull from this library. You do not guess. You do not improvise from scratch. You check here first.

The library is:
- The **rule source** — policies that govern how you behave
- The **skill source** — processes you invoke to do specific work
- The **standard** — the single source of truth for tone, schema, and structure

---

## The Mental Model (read this once, understand it forever)

```
┌──────────────────────────────────────────────────────────────────┐
│                        YOUR BRAIN                                │
│                                                                  │
│  RULES (RL-XXXX)          SKILLS (SK-XXXX)                      │
│  ─────────────────         ──────────────────                    │
│  Always-on policies.       Invocable processes.                  │
│  Fire automatically.       Called by name or trigger.            │
│  Govern HOW you work.      Define WHAT gets done.                │
│                                                                  │
│  Examples:                 Examples:                             │
│  RL-0039 schema valid?     SK-0021 write a skill                 │
│  RL-0043 verify before     SK-0112 run a full audit              │
│          shipping          SK-0018 annotate action costs         │
│                                                                  │
│         Rules constrain HOW skills execute.                      │
│         Skills produce the outputs users see.                    │
└──────────────────────────────────────────────────────────────────┘
```

**Rules** are always running in the background. You do not need to be asked to apply them.
**Skills** are loaded when a trigger fires or the user says "use skill-name."

---

## Boot Sequence — How to Start Any Session

Run these three checks at the start of every session:

```
1. LOAD RULES   — scan rules/library/ for rules that apply to this session's scope
2. MATCH SKILLS — find skills whose description/keywords match the user's intent  
3. CHECK BEFORE — for each matched skill, check its `before:` field and run prerequisites
```

When in doubt: **rules before skills, prerequisites before the skill itself.**

---

## The Order of Operations

```
USER REQUEST
     ↓
RULES CHECK          Which RL-XXXX rules apply to this task?
  Apply constraints from all matching rules.
     ↓
SKILL MATCH          Which SK-XXXX skill matches the intent?
  Match by: exact name → trigger phrase → keywords → category
     ↓
BEFORE CHECK         Does this skill have prerequisites?
  Run each skill in before: [] first, in listed order.
     ↓
EXECUTE SKILL        Run the skill with rule constraints in context.
     ↓
RELATIONS CHECK      What should be offered next?
  Surface skills from relations: [] as natural next steps.
     ↓
DELIVER OUTPUT       Product card + skill result.
  Always include: what ran, what it produced, what comes next.
```

---

## The Product Types — What Everything Is

| Type | ID Prefix | File | What It Does |
|---|---|---|---|
| **Skill** | `SK-` | `skills/.../SKILL.md` | An invocable process. Load it when a trigger fires. |
| **Rule** | `RL-` | `rules/library/.../body.md` | An always-on policy. Never needs to be invoked. |
| **Agent** | `AG-` | `agents/.../AGENT.md` | An autonomous actor with its own loop and tools. |
| **Template** | `TM-` | `templates/.../` | A drop-in starter structure. |
| **Doc** | `DK-` | `docs/...md` | Reference material. Read by humans and AI, not invoked. |
| **Checklist** | `CK-` | `docs/checklists/...md` | Binary verification — every item is Yes/No. |

---

## The 8-Field Product Schema — What Every Product Contains

Every product in this library has exactly these 8 frontmatter fields. This is non-negotiable.

```yaml
---
name: product-name-kebab-case     # Machine ID. Lowercase kebab-case. Matches folder slug exactly.
id: SK-0042                       # Global unique ID. Type prefix + 4-digit zero-padded number.
hash: a3f9b2c                     # Stable 7-char hex. Never changes. The rename-proof pointer.
keywords: [run-audit, check-gaps, build-leadsheet]  # Action tags. Verb leads. Max 3. Max 2 words.
relations: [skill-a, skill-b]     # Skills to use IN SUCCESSION after this one.
before: [skill-c]                 # Skills to run BEFORE this one (prerequisites).
governed_by: [RL-0039, global]    # Rules that govern this product.
meta: dynamic                     # These fields are living — updated as the system learns.
description: >-
  What it does. 4–6 specific trigger phrases embedded in natural sentences.
  These are the exact words a user would say. Narrow enough not to fire on
  every task. Rich enough for you to match confidently.
---
```

### The keywords rule
Keywords are **action-based verb-object tags**, not domain labels.
- ✅ `[run-audit, check-gaps, build-leadsheet]` — actions
- ❌ `[audit, boolean, accountability]` — nouns
- Format: `verb-object`, hyphenated, verb leads, max 2 words, max 3 per product

### The meta: dynamic rule
`keywords`, `relations`, and `before` are living fields. A future CI workflow keeps them fresh. When you see `meta: dynamic`, treat those fields as best-current-knowledge, not permanent fixtures.

---

## Folder Taxonomy — Where Everything Lives

```
skills/
├── engineering/              Technical implementation and workflow patterns
│   └── architecture/         Structural decisions (load-bearing choices, how systems connect)
├── visual/design/
│   ├── ux/                   Mood + method (flows, psychology, how it feels)
│   ├── ui/                   Cosmetic interface layer (what it looks like)
│   ├── paint/                Decoration, branding, surface identity
│   └── architecture/         Design systems, component hierarchies
├── methodology/              Thinking and process frameworks
├── marketing/                Copy, SEO, CRO, launch, research
├── infra/                    Infrastructure and self-hosting
├── mobile/                   iOS, Android, mobile patterns
├── ide/                      IDE-specific skills (Cursor, etc.)
├── project/                  Project-specific skills (not globally applicable)
└── external/                 Generated bridges to third-party tools

rules/library/                One folder per rule, body.md inside
agents/                       Autonomous actors with their own loops
templates/                    Starter files with the right structure
docs/                         Reference material, master plans, checklists
```

---

## How to Find the Right Skill

Three ways, in priority order:

1. **Explicit invocation** — user says "use failure-proof-audit" → load it directly
2. **Trigger phrase match** — user says "audit this repo before shipping" → scan all `description:` fields for "audit this" → find SK-0112
3. **Keyword match** — user's request contains "audit" → scan `keywords:` for matching action tags → find candidates → pick the closest

When multiple skills match: pick the one whose `governed_by:` rules best overlap with rules currently in context.

---

## How to Create a New Skill (the 7-step checklist)

When you discover a pattern worth filing:

```
1. GATE CHECK     — Pass the four gates: scope / trigger / substance / origin.
                    All four must pass. See docs/what-makes-a-good-skill.md.

2. PICK TYPE      — Skill (invocable) or Rule (always-on)?

3. PICK FOLDER    — Use the taxonomy above. Engineering? Methodology? Visual?

4. WRITE FRONTMATTER — All 8 fields. Action keywords. Good trigger phrases.

5. WRITE BODY     — Eight sections in order:
                    title + tagline / when to use / the mechanism /
                    what this is NOT for / anti-patterns / invocation /
                    reference implementation

6. STAMP          — python3 scripts/stamp-product-ids.py
                    python3 scripts/validate-skill-frontmatter.py → OK
                    ./scripts/finalize-skills-index.sh (for new skills)

7. SHIP           — commit → PR → squash merge
```

The complete guide: **SK-0021** (`create-skill`) — the unified authoring standard.

---

## How to Create a New Rule

Rules are always-on policies. They fire based on conditions, not invocations.

```
1. DEFINE THE CONDITION — when exactly does this fire?
2. STATE WHAT IT ENFORCES — precise requirement, not vague advice
3. SHOW COMPLIANT vs VIOLATION examples
4. EXPLAIN WHY — what happened when this wasn't a rule?
5. FILE AT rules/library/<name>/body.md
6. ADD FRONTMATTER — same 8 fields, id: RL-XXXX, keywords: [enforce-X, check-Y, validate-Z]
```

---

## The Writing Voice — How Everything Must Sound

Every product is written like a **plain-language command file**. Not an essay. A command file.

**The eight-answer test** — every product must answer these before it ships:
1. **When** — when exactly does this apply?
2. **Input** — what does it need?
3. **Output** — what does it produce, in what format?
4. **Rules** — what constraints govern it?
5. **Steps** — what happens, in what order?
6. **Checks** — how does it verify the work is correct?
7. **Never** — what must it never do?
8. **Done** — how does it confirm completion?

**DO:** Write complete direct sentences. Give clear orders. Use plain words. Define every error path.

**DO NOT:** Use "might", "consider", "generally speaking", "you might want to". Every instruction closes with a definite outcome.

The full voice standard: **RL-0044** (`skill-writing-voice`) → points to **SK-0021** for the complete guide.

---

## The Core Methodologies (apply these to every plan)

Before executing any significant plan, run both:

**`gap-audit-and-elevation`** (SK-0113) — audit what's incomplete, then elevate:
- Gap audit: list every incomplete, fragile, or deferred item with file + function names
- Elevation pass: propose the most ambitious version beyond what was asked

**`failure-proof-audit`** (SK-0112) — 4-pass audit:
- Pass 1: Primary gaps
- Pass 2: Hidden gap double-check
- Pass 3: Six-month failure simulation
- Pass 4: Future-proofing

Run both BEFORE starting any plan. Run both AFTER each ship.

---

## Maintenance Commands — Keep the Library Healthy

```bash
# Add/refresh all 8 schema fields on every product
python3 scripts/stamp-product-ids.py

# Stamp DustPan AppleScript docs
python3 scripts/stamp-product-ids.py --dustpan ~/Developer/xcode-cleanup-shortcut

# Validate all frontmatter
python3 scripts/validate-skill-frontmatter.py    # must say OK

# Sync SKILL-INDEX.md count after adding skills
./scripts/finalize-skills-index.sh

# Wire the pre-push hook (run once per clone)
./scripts/install-hooks.sh
```

---

## Quick Reference

| Task | Where to look |
|---|---|
| Understand what the library IS | `README.md` — the governance document |
| Find a skill by ID | `grep -r "id: SK-0042" skills/` |
| Find all products by keyword | `grep -r "keywords:.*run-audit" skills/ rules/` |
| Write a new skill | SK-0021 (`create-skill`) |
| Understand the schema | `README.md` → "The Canonical Product Schema" |
| After every ship | `gap-audit-and-elevation` (SK-0113) + `post-ship-elevation-pass` (SK-0049) |
| Before any plan | `failure-proof-audit` (SK-0112) + `gap-audit-and-elevation` (SK-0113) |
| Add IDs/keywords to new products | `python3 scripts/stamp-product-ids.py` |
| Extract lessons from a session | `conversation-retrospective-extraction` (SK-0017) |
| Filter what's worth filing | `skill-nutrients-decanter` (SK-0120) |
| Understand the AVERY GOODMAN brand | `avery-goodman-repo-standard` (SK-0003) |

---

## The Golden Rule

> Before you improvise, check the library.
> Before you add to the library, check if it already exists.
> Before you ship, run the gap audit.
> After you ship, run the elevation pass.

This library compounds. Every session that ends by growing it makes the next session smarter. That is the only goal.

---

*This guide is itself a product of the library. It was written for the first time on 2026-05-14 during the DustPan v0.21–v0.27 arc. Update it as the library grows.*
