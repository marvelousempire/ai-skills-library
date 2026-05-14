---
name: create-skill
id: SK-0021
keywords: [skill, authoring, schema]
description: >-
  The step-by-step guide for authoring a new product in the AI Skills Library —
  writing the frontmatter, assigning an ID, choosing keywords, and filling the
  eight body sections. Use this when creating a new skill, writing a new rule,
  adding a product to the library, or when someone asks "how do I write a skill",
  "how should this skill be structured", "what goes in a SKILL.md", "what are
  the required sections", "skill frontmatter format", "how do I add a product".
---

# write-skill-product — author any product for the AI Skills Library

A product without complete metadata is invisible to the distribution model. A product without the eight body sections is unusable by a future AI or human. This skill walks through writing a product that is complete, correctly formatted, and immediately useful.

---

## When to use this skill

- Writing a new `SKILL.md`, `body.md` (rule), or `AGENT.md` for the library
- Reformatting an existing product that's missing fields or sections
- Someone asks "how do I write a skill" / "what goes in a SKILL.md"
- After `conversation-retrospective-extraction` surfaces a new skill candidate
- After the `skill-nutrients-decanter` confirms a nutrient is worth filing

---

## Step 1 — Decide the product type

| Type | File | Where | When |
|---|---|---|---|
| **Skill** | `SKILL.md` | `skills/<category>/<name>/` | Invocable process with a trigger |
| **Rule** | `body.md` | `rules/library/<name>/` | Always-on policy, no invocation needed |
| **Agent** | `AGENT.md` | `agents/<name>/` | Autonomous actor with its own loop |
| **Template** | any file | `templates/<category>/<name>/` | Starter structure for reuse |
| **Doc** | `*.md` | `docs/` | Reference material, master plans |
| **Checklist** | `*.md` | `docs/checklists/` | Binary verification list |

---

## Step 2 — Choose the folder location

Use the folder taxonomy from `README.md`:

```
skills/engineering/           Implementation and workflow patterns
skills/engineering/architecture/  Structural system decisions
skills/visual/design/ux/      UX mood + method
skills/visual/design/ui/      Cosmetic interface layer
skills/visual/design/paint/   Decoration and branding
skills/methodology/           Thinking and process frameworks
skills/marketing/             Copy, SEO, CRO, launch, research
skills/infra/                 Infrastructure and self-hosting
```

When in doubt: if it's about how systems are structured → `engineering/architecture/`. If it's about a process or methodology → `methodology/`. If it's about making something look or feel a certain way → `visual/design/`.

---

## Step 3 — Write the frontmatter (all four fields required)

```yaml
---
name: product-name-kebab-case
id: SK-XXXX
keywords: [keyword1, keyword2, keyword3]
description: >-
  What this product does. When it triggers. 4–6 specific trigger phrases —
  the exact words a user or AI would say that should load this product.
  Narrow enough not to fire on every task. Rich enough to match confidently.
---
```

### `name` — the machine identifier

- Exact match of the containing folder slug
- Lowercase, kebab-case, no spaces, no capitals

### `id` — the global unique product ID

Run the stamper — it auto-assigns the next available number:

```bash
cd ~/Developer/ai-skills-library
python3 scripts/stamp-product-ids.py
```

Format: `SK-NNNN` for skills, `RL-NNNN` for rules. Zero-padded to 4 digits.

### `keywords` — max 3 domain routing tags

Domain tags. What world does this product live in? Max 3. Lowercase. No verbs.

| Good | Bad |
|---|---|
| `[audit, boolean, accountability]` | `[audit, run, checklist]` — verb |
| `[git, architecture, github]` | `[repo, git, architecture, github]` — too many |
| `[macOS, native-ui, applescript]` | `[tool, script, mac]` — too generic |

### `description` — the trigger surface

This is what the router reads. It must contain 4–6 specific trigger phrases embedded naturally in the text. Phrases should be things a real user would actually type or say.

```yaml
description: >-
  A multi-pass audit methodology for any repo, project, or system. Triggers on
  "audit this repo", "failure-proof audit", "run a full audit", "Boolean lead
  sheet", "find hidden gaps", "what would break after six months".
```

---

## Step 4 — Write the eight body sections

After the closing `---`, every `SKILL.md` has these sections in this order:

### 1. Title + tagline

```markdown
# [Title] — [one-line tagline]

[One sentence: what failure this product prevents, or what friction it removes.]
```

The tagline is not the description. The description is for routing. The tagline is for humans scanning a list.

### 2. When to use this product

```markdown
## When to use this product

- [Specific trigger condition — "the user says X"]
- [Specific trigger condition — "you notice Y"]
- [Exact phrase the user would say]
```

Be specific. "When working on a repo" is not specific. "When the user says 'audit this before we ship'" is specific.

### 3. The mechanism

```markdown
## [Name it after what the skill teaches — not "How it works"]

[The actual pattern, with runnable code or a paste-ready template.]
[Not vague principles. Concrete implementation.]
```

Examples of good section names: "The four receipts", "The six-step decanting process", "The canonical implementation", "The Boolean lead sheet format".

### 4. What this is NOT for

```markdown
## What this is NOT for

- Not for [common misapplication]
- Not for [adjacent use case — name the right skill instead]
```

This prevents scope creep and misuse. If a neighboring skill handles a related case, name it explicitly here.

### 5. Anti-patterns

```markdown
## Anti-patterns

- ❌ [Specific wrong approach] — [brief reason why]
- ❌ [Another wrong approach] — [brief reason]
- ❌ [Third wrong approach] — [brief reason]
```

Minimum 3 anti-patterns. Always use `❌` prefix. Always give a reason.

### 6. Invocation

```markdown
## Invocation

- "Use **skill-name**."
- "[Natural phrase that triggers this]"
- "[Another phrase]"
```

Always include the canonical `"Use **name**."` form first.

### 7. Reference implementation

```markdown
## Reference implementation

[Link to the real-world repo, file, PR, or commit that demonstrates this.]
[Why it's the canonical example.]
```

A reference without a link is just a claim. Always link.

---

## Step 5 — Validate and stamp

```bash
# Auto-assign id + keywords if not done manually
python3 scripts/stamp-product-ids.py

# Validate all frontmatter
python3 scripts/validate-skill-frontmatter.py

# Sync SKILL-INDEX.md count (for new skills)
./scripts/finalize-skills-index.sh
```

All three must pass before committing.

---

## Step 6 — The four-gate filter (pass before filing)

Before committing any new skill, verify all four:

| Gate | The question |
|---|---|
| **Scope** | Does it apply beyond this specific project? |
| **Trigger** | Is the trigger narrow enough not to fire on every "improve" task? |
| **Substance** | Does it contain concrete runnable code or a paste-ready template? |
| **Origin** | Can you name the specific bug, pain, or moment that made this worth filing? |

If it fails even one gate, it's not ready. See `docs/what-makes-a-good-skill.md` for the full filter.

---

## What this is NOT for

- Not for general Cursor IDE skill authoring (the old `create-skill` covered that — this is library-specific)
- Not for editing existing product metadata (run `stamp-product-ids.py` instead)
- Not for deciding WHAT to file (use `conversation-retrospective-extraction` or `skill-nutrients-decanter` first)

---

## Anti-patterns

- ❌ Writing a product without running the stamper — missing `id` breaks the router
- ❌ Keywords that are verbs (`create`, `build`, `improve`) — keywords are domains, not actions
- ❌ A `description` with no trigger phrases — the router can't match a product without them
- ❌ A body with "How it works" as a section name — name it after what it teaches
- ❌ No reference implementation — a claim without a link is noise
- ❌ Filing a product without the four-gate filter — the library gets diluted

---

## Invocation

- "Use **create-skill**."
- "How do I write a skill for this library?"
- "What goes in a SKILL.md?"
- "How should this be structured?"
- "What are the required sections for a skill?"

---

## Reference implementation

Every skill filed during the DustPan v0.21–v0.27 arc demonstrates this pattern:
- `skills/methodology/failure-proof-audit/SKILL.md` (SK-0042) — the full eight sections
- `skills/engineering/cost-annotation-discipline/SKILL.md` (SK-0018) — strong trigger phrases
- `skills/engineering/architecture/product-repo-architecture/SKILL.md` (SK-0007) — good keywords

The governance document: `README.md` (root of this repo) — the schema + distribution model in full.
