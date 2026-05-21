---
name: metadata-post-or-product-mode
id: RL-0047
keywords: [enforce-metadata, check-product, build-mode]
hash: a0e6471
goal: Every new artifact gets the correct metadata thinking mode before files are written.
relations: [create-skill, skill-frontmatter]
before: [create-skill]
governed_by: [global]
meta: dynamic
description: >-
  Before creating metadata for a skill, agent, rule, folder, or Tower product,
  pick Product mode (catalog/plugin card) or Post mode (folder/workspace row).
  Triggers on "post or product metadata", "WordPress plugin card",
  "WooCommerce product card", "how do I metadata this", "post-meta.json",
  "skill.plugin.json", or "metadata thinking mode".
---

# Metadata — Post mode vs Product mode

## When this fires

Any time you create or update metadata for a skill, agent, library rule, folder package, Nephew runtime agent folder, or Tower marketplace entry.

Stop and classify **before** writing JSON or frontmatter.

## Two thinking modes

| Mode | Question to ask | Mental model |
|------|-----------------|--------------|
| **Product** | Would this appear in a store, grid, install list, or router? | WordPress **Plugins** screen or WooCommerce **product** card |
| **Post** | Is this a place the agent works inside day to day? | WordPress **post** row + postmeta + lead sheet |
| **Hybrid** | Both answers are yes | Same `slug` / `post_name`; product manifest links to post path |

## Decision table (Boolean)

| You are creating… | Product? | Post? | Required artifacts |
|-------------------|----------|-------|-------------------|
| AISL skill | Yes | Optional folder | `SKILL.md`, `skill.plugin.json`, `skill.plugin.md`, catalog row |
| AISL agent (flat) | Yes | No | `agents/<slug>.md`, `*.plugin.json`, `*.plugin.md`, Philosophy, catalog |
| AISL agent (folder) | Yes | Optional | `AGENT.md`, `agent.plugin.json`, `agent.plugin.md`, Philosophy |
| Library rule | Yes (frontmatter) | No | `body.md`, `meta.json`, `CHANGELOG.md` |
| Bishop / package folder | Optional | Yes | `post-meta.json`, `LEAD_SHEET.md` |
| Nephew `docs/agents/<name>/` | Optional | Yes | `post-meta.json`, `lead-sheet.md` or `plans/lead-sheet.md` |
| Tower app / connector | Yes | If embedded path | `tower-marketplace.catalog.json` + SSO + control-tower manifests |
| External pointer in AISL | Yes | No | `docs/external-tools.manifest.json` + generated bridge skill |

## Product mode checklist

1. Write YAML frontmatter on the contract (`SKILL.md`, `body.md`, or agent contract).
2. Run `python3 scripts/stamp-product-ids.py` (AISL).
3. Run `python3 scripts/validate-skill-frontmatter.py` (AISL).
4. Generate plugin pair: `generate-skill-plugin-manifests.py` or `generate-agent-plugin-manifests.py`.
5. Regenerate `LIBRARY-PLUGIN-CATALOG.md` when agents/skills change.
6. Validate plugin manifests.

Agents in AISL still require **Philosophy** — Bishop enforces that; this rule does not replace it.

## Post mode checklist

1. Create or update `post-meta.json` with stable `ID`, `post_title`, `post_status`, `post_name`, `post_content`, `meta`, `hashtags`.
2. Ensure `LEAD_SHEET.md` (or Nephew `lead-sheet.md`) exists for orchestration.
3. Keep `post_name` aligned with folder slug and product `slug` when hybrid.

Template: `bishop/kingdom/post-meta.json` in the Bishop repo.

## Hybrid checklist

- `post_name` === product `slug` (kebab-case).
- Product manifest includes `post_path` or equivalent pointer when UI needs both views.
- Do not fork doctrine into two conflicting titles.

## Anti-patterns

- Product card without `skill.plugin.json` / `agent.plugin.json` beside the contract.
- Agent without `## Philosophy` in AISL (Bishop rejects).
- `post-meta.json` with a different slug than the folder name.
- Copying upstream repo code into AISL instead of pointer registration ([`add-agent-to-skills-library`](../add-agent-to-skills-library/body.md)).
- Tower catalog entry without matching SSO / control-tower manifest rows.

## Examples

### Compliant

- New skill: `SKILL.md` + generated `skill.plugin.json` + row in `LIBRARY-PLUGIN-CATALOG.md`.
- `kingdom/`: `post-meta.json` + `LEAD_SHEET.md` (Post); Bishop cluster also has product cards in AISL (Product).

### Violation

- Only `SKILL.md` with no plugin pair — invisible to catalog/grid tooling.
- Only `*.plugin.json` with no `post-meta.json` for a Nephew agent workspace that operators open daily.

## Related

- Skill: [`create-skill`](../../skills/engineering/create-skill/SKILL.md)
- Skill: [`metadata-post-or-product-mode`](../../skills/methodology/metadata-post-or-product-mode/SKILL.md)
- Nephew binder: `AI_AGENT_RULES/METADATA_POST_AND_PRODUCT_RULE.md`
- Docs: [`docs/library-plugin-catalog.md`](../../docs/library-plugin-catalog.md)
- Versioning: [`docs/standards/artifact-versioning.md`](../../docs/standards/artifact-versioning.md)

## Why

Routers and marketplaces read **product** manifests. Agents orient inside **post** rows. Mixing the two produces missing catalog cards, orphan folders, and duplicate Bishop prose.
