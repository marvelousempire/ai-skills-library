# Standard: SKILL.md frontmatter contract

Every `SKILL.md` opens with YAML frontmatter that agents (Claude Code, Cursor) parse to decide when to invoke the skill.

## Required schema

```yaml
---
name: <skill-slug>           # MUST match the folder name exactly
description: <one paragraph> # MUST include trigger phrases (see below)
---
```

## Field-by-field

### `name` (required)

The skill slug. **Must equal the folder name.** Kebab-case. No spaces. No version numbers.

✓ `name: seeme`
✓ `name: self-hosted-git`
✗ `name: SeeMe`
✗ `name: seeme-v2`
✗ `name: see me`

### `description` (required)

A single paragraph that includes:

1. **What the skill does** (1–2 sentences)
2. **When it applies** ("Use when…")
3. **Trigger phrases** the user might say — these are how agents match queries to skills

**Pattern:** `<what it does>. <when it applies>. Triggers on "<phrase>", "<phrase>", "<phrase>".`

### Example (real)

```yaml
---
name: dockyard
description: Wire the ai-skills-library stacks into Dockyard — the user's Python-stdlib local-first Docker manager UI that replaces Docker Desktop's GUI. Talks any Docker socket (Colima → OrbStack → Docker Desktop), default Compose-project view, 12 MCP tools for AI agents. This skill ships the install + standalone-compose templates, the canonical label schema every library container must follow, an integration checklist, and a Docker Desktop → Colima migration guide. Triggers on "set up Dockyard", "use Dockyard with ai-skills-library", "Docker UI", "Colima manager", "Dockyard MCP", "Docker Desktop replacement".
---
```

## Anti-patterns

- `description: A skill for X.` — too short, no triggers
- `description: This skill does X. Also Y. And Z.` — no trigger phrases
- Missing `name:` or `description:` — frontmatter must validate

## Enforcement

`scripts/lint-skill-frontmatter.sh` validates:
- frontmatter present
- `name:` matches folder
- `description:` includes the word "trigger" or "Use when"
- file under 400 lines for the first version (kept legible)

Rule `rules/library/skill-frontmatter/` makes this `alwaysApply: true`.
