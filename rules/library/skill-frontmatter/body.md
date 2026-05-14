---
name: skill-frontmatter
id: RL-0039
keywords: [validate-schema, enforce-fields, check-frontmatter]
goal: Every product file has valid, complete frontmatter before it is committed.
hash: e121d8f
relations: []
before: []
governed_by: [global]
meta: dynamic
---

# Every product in this library follows the canonical schema

## When this fires

Any time a `SKILL.md`, `body.md` (rule), `AGENT.md`, or product file is being authored, edited, reviewed, or committed. No exceptions.

## What it enforces

Every product file must have all four frontmatter fields — in this order, immediately after the opening `---`:

```yaml
---
name: product-name-kebab-case
id: SK-0042
keywords: [keyword1, keyword2, keyword3]
description: >-
  What this product does. When it triggers. 4–6 specific trigger phrases
  — the exact words a user or AI would say that should load this product.
---
```

### Field rules

**`name`**
- Must exactly match the containing folder slug
- Lowercase kebab-case only — no spaces, no capitals, no underscores
- ✅ `failure-proof-audit` (folder: `failure-proof-audit/`)
- ❌ `Failure-Proof Audit` — wrong case, spaces
- ❌ `failureProofAudit` — camelCase

**`id`**
- Format: `{TYPE_PREFIX}-{NNNN}` — type prefix + zero-padded 4-digit integer
- Skills: `SK-0001` through `SK-9999`
- Rules: `RL-0001` through `RL-9999`
- Agents: `AG-0001` — Templates: `TM-0001` — Docs: `DK-0001`
- Run `python3 scripts/stamp-product-ids.py` to auto-assign the next available ID
- IDs are append-only — never reuse, never renumber a retired product
- ❌ `SK-42` — not zero-padded
- ❌ `skill-0042` — wrong prefix format

**`keywords`**
- Inline YAML array: `[keyword1, keyword2, keyword3]`
- Maximum 3 keywords. Minimum 1.
- Lowercase only. Hyphens allowed for compounds: `native-ui`, `ai-agent`
- Must describe the **domain** — what world this product lives in
- Must NOT be: actions (`build`, `create`), the product name repeated, generic words (`tool`, `process`, `guide`, `skill`)
- ✅ `[audit, boolean, accountability]` — three domain tags for failure-proof-audit
- ✅ `[git, architecture, github]` — domain tags for product-repo-architecture
- ❌ `[create, skill, writing]` — verbs + generic words
- ❌ `[product, product-repo, architecture]` — repeating the name

**`description`**
- Multi-line YAML block scalar (`>-` format for single-paragraph, `|` for multi-paragraph)
- Must include 4–6 specific trigger phrases — the exact words a person or AI would say to load this product
- Phrases live naturally in the sentence, not as a bulleted list
- ✅ `Triggers on "set up this git repo", "GitHub repo architecture", "auto-release on merge".`
- ❌ `A skill for improving repos.` — too short, no trigger phrases
- ❌ `Use when: improving repos, setting up git` — wrong format, too vague

## The eight body sections (SKILL.md)

After the frontmatter, every SKILL.md must have these sections in this order:

```markdown
# [Title] — [one-line tagline that names the failure mode prevented]

[One sentence: the failure mode this product prevents or the friction it removes.]

## When to use this product
[Specific trigger conditions — including exact phrases that fire this skill]

## [The mechanism / workflow / pattern]
[Name this after what the skill teaches — not "How it works"]
[Must include concrete code or a paste-ready template — not just principles]

## What this is NOT for
[Prevents misuse. Names adjacent skills that handle neighboring cases.]

## Anti-patterns
[3+ specific wrong approaches, each with ❌ prefix and brief reason why]

## Invocation
["Use **skill-name**." + 2-3 natural-language phrases]

## Reference implementation
[Link to real-world repo + file + PR that demonstrates this in practice]
```

## Checklist before committing any product file

- [ ] `name` matches folder slug exactly (lowercase, kebab-case)
- [ ] `id` is in `{PREFIX}-{NNNN}` format and assigned by `stamp-product-ids.py`
- [ ] `keywords` is max 3, lowercase, domain tags (not actions, not generic)
- [ ] `description` has 4–6 specific trigger phrases
- [ ] `python3 scripts/validate-skill-frontmatter.py` returns OK
- [ ] `./scripts/finalize-skills-index.sh` run after adding a new skill
- [ ] Body has all eight sections (SKILL.md only)

## Why

The `id` + `keywords` + `description` fields are the **product metadata layer** — the data the router reads to match user intent, the data that populates product cards, teasers, and system integrations. A product without complete metadata is invisible to the distribution model.

Previously (`RL-0039` pre-2026-05-14): rule only checked for `name` and `description`. Missed `id` and `keywords` entirely, and said nothing about body section structure.

## Related

- **Schema**: `README.md` (master governance document — the full schema with examples)
- **Script**: `scripts/stamp-product-ids.py` (auto-assigns `id` and `keywords`)
- **Script**: `scripts/validate-skill-frontmatter.py` (validates frontmatter)
- **Skill**: `write-skill-product` (`SK-0021`) — the invocable guide for authoring a new skill
