# Audit — Artifact versioning gap (Plan 0022 / 0053)

**Date:** 2026-05-21  
**Standard:** [`docs/standards/artifact-versioning.md`](../standards/artifact-versioning.md)

## Scope

Canonical skills, agents, and library rules should carry `version` in plugin manifests / meta and a local `CHANGELOG.md` when the artifact is Product-mode.

## Findings (sampled)

| Area | Status | Note |
|------|--------|------|
| `metadata-post-or-product-mode` rule | g· | `CHANGELOG.md` v1.0.0 present |
| `metadata-post-or-product-mode` skill | g· | `skill.plugin.json` v1.0.0 + `CHANGELOG.md` via skill folder |
| Legacy skills without `CHANGELOG.md` | y· | Batch seed deferred — run `find rules/library skills -name CHANGELOG.md` before next mass ship |
| Plugin manifests | g· | Regenerated 2026-05-21; validators pass |

## Commands

```bash
cd ai-skills-library
python3 scripts/validate-skill-plugin-manifests.py
python3 scripts/validate-agent-plugin-manifests.py
find rules/library -maxdepth 2 -name body.md | wc -l
find rules/library -maxdepth 2 -name CHANGELOG.md | wc -l
```

## Next action

Before the next large AISL ship, close the CHANGELOG gap for any rule touched in that PR.
