---
name: metadata-post-or-product-mode
id: SK-0142
hash: b8e4f1a2
keywords: [audit-metadata, check-product, build-mode]
relations: [create-skill]
before: [create-skill]
governed_by: [RL-0047, skill-frontmatter, global]
meta: dynamic
goal: Teach agents to choose Post vs Product metadata mode and ship the correct file set every time.
description: >-
  Teaches Post mode (folder post-meta + lead sheet) vs Product mode (plugin.json
  catalog cards) before writing metadata. Use when asked "post or product metadata",
  "WordPress plugin card", "WooCommerce product card", "how do I metadata this",
  "post-meta.json", or when scaffolding skills, agents, rules, or Tower products.
---

# Metadata post-or-product-mode — teach the two thinking modes

Agents fail metadata when they treat every artifact like a README. This skill teaches **Product** (catalog) vs **Post** (workspace) before any file is written.

## When to use this product

- Creating a skill, agent, or rule in ai-skills-library
- Adding `post-meta.json` to a Bishop package or Nephew `docs/agents/<name>/`
- Registering a Tower marketplace product
- Operator asks how metadata should be shaped

## The mechanism — mode picker

```text
1. Ask: "Does this need to appear in a catalog/grid?"  → Product
2. Ask: "Is this a folder the agent works inside?"     → Post
3. If both yes → Hybrid (same slug, link paths)
4. Run the checklist for the mode(s) chosen
5. Validate with library or Nephew scripts
```

### Product mode deliverables

| Artifact | Files |
|----------|-------|
| Skill | `SKILL.md`, `skill.plugin.json`, `skill.plugin.md` |
| Agent | contract + `*.plugin.json` + `*.plugin.md` + Philosophy |
| Rule | `body.md`, `meta.json`, `CHANGELOG.md` |

```bash
cd ai-skills-library
python3 scripts/stamp-product-ids.py
python3 scripts/validate-skill-frontmatter.py
python3 scripts/generate-skill-plugin-manifests.py
python3 scripts/generate-agent-plugin-manifests.py
python3 scripts/generate-library-plugin-catalog.py
python3 scripts/validate-skill-plugin-manifests.py
python3 scripts/validate-agent-plugin-manifests.py
```

### Post mode deliverables

| Artifact | Files |
|----------|-------|
| Package | `post-meta.json`, `LEAD_SHEET.md` |
| Nephew agent | `docs/agents/<slug>/post-meta.json`, `lead-sheet.md` |

```bash
cd nephew
node scripts/generate-agent-post-meta.mjs
node scripts/generate-agent-post-meta.mjs --check
```

### Hybrid example

- AISL **Product:** `agents/bishop.md` + `bishop.plugin.json`
- Bishop repo **Post:** `kingdom/post-meta.json` with `post_name: "kingdom"`

## What this is NOT for

- Writing prose rules for humans (`RULE_FOR_WRITING_RULES` in Nephew)
- Replacing Bishop Philosophy enforcement on new agents

## Anti-patterns

- Skipping plugin generation after `SKILL.md` exists
- `post-meta.json` without matching folder slug
- Vendoring upstream repos into AISL instead of pointers

## Invocation

- "Use **metadata-post-or-product-mode**."
- "Is this post or product metadata?"
- "How do I metadata this agent folder?"

## Reference implementation

- Rule: `rules/library/metadata-post-or-product-mode/body.md`
- Post template: `bishop/kingdom/post-meta.json`
- Product template: `templates/skill.plugin.json`
