# AI Skills Library
**managed by the duty and order of AVERY GOODMAN**

> The master product catalog, study system, training system, improvement system, and filing system for all AI-powered work. Every lesson learned becomes a product. Every product has an ID, a name, a description, and keywords. Every session ends by growing the library.

---

## Talking to the library

The library has one front door: **[`nephew`](agents/nephew.md)** — the Orchestrator Agent by Avery Goodman. You don't pick a skill from the catalog. You describe what you're doing, and nephew commissions the right team — its native swarm (researcher, coder, reviewer, witness-curator, federation-coordinator), the chain-of-command chairs (Employee → Asst Mgr → Manager → Director), or one of the utility agents (ledger-orchestrator, migration-author, ship-flow-runner, etc.).

The catalog below is the *under-the-hood* documentation — what products nephew can dispatch and where they live. New here? Start at [`docs/standards/orchestration-hierarchy.md`](docs/standards/orchestration-hierarchy.md) for the one-page map.

---

## What a "Product" Is

Everything in this library is a **product** — a discrete, shippable, identifiable unit of intelligence. Products are not files. Products are not folders. Products are the things the library manufactures and delivers: behaviors, processes, patterns, standards, checklists, templates, and agents.

| Product Type | Prefix | Where It Lives | What It Does |
|---|---|---|---|
| **Skill** | `SK-` | `skills/<category>/<name>/SKILL.md` | An invocable process. AI runs it when the trigger fires or it's called by name. |
| **Rule** | `RL-` | `rules/library/<name>/body.md` | An always-on policy. Fires automatically when the condition applies, without being invoked. |
| **Agent** | `AG-` | `agents/<name>/AGENT.md` | An autonomous actor with its own loop, tools, and responsibilities. |
| **Template** | `TM-` | `templates/<category>/<name>/` | A starter structure. Drop-in files with the right shape already in place. |
| **Doc** | `DK-` | `docs/<name>.md` | Reference material. Not invokable — read by humans and AI for context. |
| **Checklist** | `CK-` | `docs/checklists/<name>.md` | A binary verification list. Every item is Yes/No before something ships. |

---

## The Canonical Product Schema

Every product has the same frontmatter shape — 8 fields. This is what the router reads to match, display, sequence, and deliver a product.

```yaml
---
name: product-name-kebab-case    # Machine ID. Kebab-case. Unique within its type.
id: SK-0042                      # Global unique ID. Type prefix + zero-padded integer.
hash: a3f9b2c                    # Stable 7-char hex. Never changes. Used for cross-references.
keywords: [run-audit, check-gaps, build-leadsheet]  # Max 3. Action-based verb-object tags.
relations: [skill-a, skill-b]    # Skills to use IN SUCCESSION after this one.
before: [skill-c]                # Skills to run BEFORE this one (prerequisites).
governed_by: [RL-0039, global]   # Rules that govern this product.
meta: dynamic                    # Living metadata — updated by the system as it learns.
goal: "One sentence — what this product achieves when it runs."  # The outcome.
description: >-                  # What it does. When it triggers. What it produces.
  One paragraph. Includes 4–6 specific trigger phrases — the exact words a
  user or AI would say that should load this product. Narrow enough not to
  fire on every task. Rich enough for the router to match confidently.
---
```

### The `id` field — global unique product identifier

Format: `{TYPE_PREFIX}-{NNNN}` where `NNNN` is zero-padded to 4 digits.

| Type | Prefix | Example |
|---|---|---|
| Skill | `SK-` | `SK-0042` |
| Rule | `RL-` | `RL-0017` |
| Agent | `AG-` | `AG-0003` |
| Template | `TM-` | `TM-0008` |
| Doc | `DK-` | `DK-0001` |
| Checklist | `CK-` | `CK-0005` |

IDs are **append-only** — never reused, never renumbered. When a product is retired, its ID is retired with it.

Run `scripts/stamp-product-ids.py` to auto-assign IDs and keywords to all products in the library.

### The `keywords` field — domain routing tags

**Max 3 keywords.** Lowercase. No spaces (use hyphens for compound terms).

Keywords describe the **domain** of the product — not what it does (the description covers that), but what world it lives in. They're used by the router to narrow candidates when multiple products match a trigger.

Good keywords:
- `failure-proof-audit` → `audit, boolean, accountability`
- `product-repo-architecture` → `git, architecture, github`
- `cost-annotation-discipline` → `safety, annotations, ux`
- `ai-proposal-review-inbox` → `ai-agent, proposals, curation`
- `applescript-native-ui` → `applescript, macOS, native-ui`

Bad keywords:
- Generic: `tool`, `process`, `method`, `skill`, `guide` — too broad, no routing value
- Verbs: `build`, `create`, `improve` — keywords are domains, not actions
- Repeating the name: `product` for `product-repo-architecture` — redundant

---

## The Distribution Model

This is how the AI Skills Library routes a user request, applies policies, invokes the right product, and delivers a structured output.

```
╔═══════════════════════════════════════════════════════════════════════╗
║               AI SKILLS LIBRARY — DISTRIBUTION MODEL                 ║
╚═══════════════════════════════════════════════════════════════════════╝

  ┌──────────────────────────────────────────────────────────────────┐
  │  INPUT — user request, task, question, or condition              │
  │  "audit this repo before we ship"                                │
  └──────────────────────────────┬───────────────────────────────────┘
                                 │
                                 ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  ROUTER — reads all product metadata                             │
  │                                                                  │
  │  For every product (SK, RL, AG, TM, DK, CK):                    │
  │    reads: id · name · description · keywords                    │
  │                                                                  │
  │  Matches by:                                                     │
  │    1. Explicit invocation ("use failure-proof-audit")            │
  │    2. Trigger phrase match (description field)                   │
  │    3. Keyword domain match (keywords field)                      │
  │    4. Category/type filter (SK vs RL vs AG)                      │
  │                                                                  │
  │  Returns: [applicable rules] + [matched skills]                  │
  └─────────┬────────────────────────────────┬────────────────────────┘
            │                                │
            ▼                                ▼
  ┌─────────────────────┐        ┌──────────────────────────────────┐
  │  RULE LAYER         │        │  SKILL LAYER                     │
  │  (fires first,      │        │  (fires when matched)            │
  │   always-on)        │        │                                  │
  │                     │        │  ┌──────────────────────────┐    │
  │  RL-0032 applies?   │        │  │  SK-0042                 │    │
  │  → plan-first-for   │        │  │  failure-proof-audit     │    │
  │    substantive      │        │  │  keywords: audit,        │    │
  │                     │        │  │  boolean, accountability │    │
  │  RL-0043 applies?   │        │  └──────────────────────────┘    │
  │  → verification-    │        │                                  │
  │    before-ship      │        │  Skill's 4 audit passes          │
  │                     │        │  + Boolean lead sheet            │
  │  Constraints added  │        │  + Chain of command review       │
  │  to execution ctx   │        └──────────────────────────────────┘
  └─────────┬───────────┘                        │
            │        Rules constrain             │
            │        HOW skills execute          │
            └──────────────┬─────────────────────┘
                           │
                           ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  EXECUTION                                                        │
  │                                                                  │
  │  Skill runs with rule constraints active in context.             │
  │  Rules inject pre-conditions, shape the output format,          │
  │  and run post-conditions before delivery.                        │
  │                                                                  │
  │  Example:                                                        │
  │    Rule RL-0043 (verify-before-ship) requires a Boolean         │
  │    checklist in the output → failure-proof-audit already        │
  │    produces one → rules and skills are compatible.              │
  └──────────────────────────────┬───────────────────────────────────┘
                                 │
                                 ▼
  ┌──────────────────────────────────────────────────────────────────┐
  │  DELIVERY — structured output + metadata package                 │
  │                                                                  │
  │  ┌────────────────────────────────────────────────────────────┐  │
  │  │  PRODUCT CARD                                              │  │
  │  │  ─────────────────────────────────────────────────────    │  │
  │  │  id:          SK-0042                                      │  │
  │  │  name:        failure-proof-audit                         │  │
  │  │  keywords:    audit · boolean · accountability            │  │
  │  │  description: Multi-pass audit methodology for any        │  │
  │  │               repo or system...                           │  │
  │  │  result:      [full audit output from skill execution]    │  │
  │  │  rules-applied: RL-0032, RL-0043                          │  │
  │  └────────────────────────────────────────────────────────────┘  │
  │                                                                  │
  │  → Product display  → Teaser card  → Presentation slide         │
  │  → System integration  → API response  → UI component           │
  └──────────────────────────────────────────────────────────────────┘
```

### How rules and skills interact

**Rules** are policies. They fire based on conditions (scope of a change, type of task, presence of a certain file). Rules shape the execution context — they don't produce outputs themselves, they constrain and augment what skills produce.

**Skills** are procedures. They are called (explicitly or by trigger match) and produce outputs. Skills are unaware of which rules are active — that's the router's job.

**The router** is the mediator. It checks all rules first (do any apply here?), then finds the matching skill, merges the rule constraints into the execution context, and runs the skill. The skill sees the constraint context; the user sees the combined output.

**Example flow:**
```
User: "audit this repo before we ship"

Router reads:
  RL-0043 (verification-before-ship) → applies (user said "before ship")
  RL-0032 (plan-first-for-substantive) → not applicable (this is a review task)
  SK-0042 (failure-proof-audit) → matches "audit" + keywords [audit, boolean]

Execution:
  RL-0043 constraint: output must include a Boolean checklist
  SK-0042 runs: 4-pass audit + Boolean lead sheet + chain-of-command
  Both requirements already satisfied → no conflict

Delivery:
  Product card with id=SK-0042, keywords=[audit, boolean, accountability]
  + Full audit output
  + RL-0043 compliance confirmed
```

---

## Folder Taxonomy (where products live)

```
skills/
├── engineering/             Engineering patterns and tools
│   ├── architecture/        Structural system decisions (bones, load-bearing patterns)
│   ├── tech-stacks/         Witnessed product stacks (Tauri, Vite, etc.) — reference docs
│   └── [flat]               Implementation skills, workflow skills, tooling skills
├── visual/
│   └── design/
│       ├── architecture/    Visual system structure (design systems, token hierarchy)
│       ├── ux/              Mood + method (flows, psychology, how it feels)
│       ├── ui/              Cosmetic interface layer (what it looks like)
│       └── paint/           Pure decoration (color, branding, surface identity)
├── methodology/             Thinking and process frameworks
├── marketing/               Copy, SEO, CRO, launch, research
├── infra/                   Infrastructure and self-hosting
├── mobile/                  iOS, Android, mobile-specific patterns
├── ide/cursor/              Cursor IDE skills and hooks
├── project/                 Project-specific skills (not globally applicable)
└── external/                Generated bridges to third-party tools

rules/library/               Always-on policies, one folder per rule
agents/                      Autonomous actors with their own loops
templates/                   Starter files with the right structure
docs/                        Reference material, master plans, checklists
```

---

## The Product Schema in Full

Every SKILL.md and body.md must have all four frontmatter fields. Use the template at `templates/engineering/skill-md/SKILL.template.md`.

```yaml
---
name: product-name-kebab-case
id: SK-0042
description: >-
  [Purpose in plain language. Specific trigger phrases the router uses to match
  this product. 4–6 specific phrases. Narrow enough not to steal every task.]
keywords: [keyword1, keyword2, keyword3]
---

# [Title] — [one-line tagline]

[One sentence: the failure mode this product prevents or the friction it removes.]

## When to use this product
## [The mechanism / workflow / pattern]
## What this is NOT for
## Anti-patterns
## Invocation
## Reference implementation
```

---

## How to Add a New Product

1. **Assign the type.** Is it a skill (invocable), rule (always-on), agent (autonomous), template, doc, or checklist?

2. **Create the folder and file** using the correct location from the taxonomy above.

3. **Write the frontmatter** with all four fields:
   - `name`: kebab-case, unique within type
   - `id`: run `scripts/stamp-product-ids.py` — it auto-assigns the next available ID
   - `description`: what it does + 4–6 trigger phrases
   - `keywords`: max 3, domain tags (not actions, not generic words)

4. **Write the body** using the eight-section template.

5. **Validate:** `python3 scripts/validate-skill-frontmatter.py` → OK

6. **Update the index:** `./scripts/finalize-skills-index.sh`

7. **Run the stamper:** `python3 scripts/stamp-product-ids.py` to ensure IDs/keywords are correct.

---

## Quick Reference

| Want to… | Do this |
|---|---|
| Find a product by ID | `grep -r "id: SK-0042" skills/` |
| Find all products by keyword | `grep -r "keywords:.*audit" skills/ rules/` |
| Find all rules that apply to git work | `grep -r "keywords:.*git" rules/` |
| Add IDs/keywords to new products | `python3 scripts/stamp-product-ids.py` |
| Validate all frontmatter | `python3 scripts/validate-skill-frontmatter.py` |
| Sync SKILL-INDEX.md count | `./scripts/finalize-skills-index.sh` |
| Add the pre-push hook | `./scripts/install-hooks.sh` |

---

*This library grows every session. Run `conversation-retrospective-extraction` (SK-0017) after every significant session. Filter with `skill-nutrients-decanter` (SK-0120) — only nutrients get filed.*
