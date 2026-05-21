# Artifact versioning (Plan 0022)

**Status:** Active  
**Plan:** `plans/0022-aisl-agent-skill-rule-versioning-and-mapping.md` (Nephew) · absorbed into Plan 0053 ship  
**Related:** [`metadata-post-or-product-mode`](../../rules/library/metadata-post-or-product-mode/body.md)

## Version fields

| Field | Where | When to bump |
|-------|--------|----------------|
| `schema_version` | `AI_AGENT_RULES/manifest.json` | Manifest structure changes (new sections, renamed slots) |
| `content_contract_version` | Same | Semantic meaning of required slots changes (`1.0.0` → `2.0.0` adds `metadata_post_product`) |
| `version` | `rules/library/*/meta.json`, `skill.plugin.json`, `agent.plugin.json` | Rule/skill/agent body or catalog card changes |
| `CHANGELOG.md` | Per rule folder, per skill folder, repo root | Every user- or agent-visible ship |

## Product vs Post artifacts

- **Product** artifacts (`*.plugin.json`, catalog rows) carry `version` and appear in `LIBRARY-PLUGIN-CATALOG.md`.
- **Post** artifacts (`post-meta.json`, `LEAD_SHEET.md`) carry `post_status`, `meta`, and verb-noun hashtags — not semver on the post file itself; bump the **parent Product** when the catalog card changes.

## Generators (DRY)

```bash
cd ai-skills-library
python3 scripts/stamp-product-ids.py
python3 scripts/generate-skill-plugin-manifests.py
python3 scripts/generate-agent-plugin-manifests.py
python3 scripts/generate-library-plugin-catalog.py
python3 scripts/validate-skill-plugin-manifests.py
python3 scripts/validate-agent-plugin-manifests.py
```

Nephew agent posts:

```bash
cd nephew
node scripts/generate-agent-post-meta.mjs
node scripts/generate-agent-post-meta.mjs --check
```

## Binder contract 2.0.0

Nephew root `AI_AGENT_RULES/manifest.json` uses `content_contract_version: "2.0.0"` and maps slot `metadata_post_product` → `METADATA_POST_AND_PRODUCT_RULE.md`. Child repos may stay on `1.0.0` until seeded; run:

```bash
node scripts/check-ai-agent-rules.mjs --repos <name> --create-missing
```
