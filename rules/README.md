# Rules library (canonical)

**Single source of truth** for team rules that should compile into **Cursor** (`.cursor/rules/*.mdc`) and **Claude Code** (`.claude/rules/*.md`). Bodies live here; product repos receive **generated** files so wording never drifts across machines.

## Layout

| Path | Role |
|------|------|
| [`library/<rule-id>/body.md`](library) | Markdown body; use `__DOCS__` where a link must reach the repo’s `docs/` folder from the generated rules file |
| [`library/<rule-id>/meta.json`](library) | `description`, `alwaysApply`, optional `globs` (Cursor path patterns for scoped rules) |
| [`profiles/*.json`](profiles) | Path math: how to reach `docs/` from `.cursor/rules` vs `.claude/rules` |
| [`packs/*.json`](packs) | Which rules ship together (core set, slice for one stack, etc.) |

## Generate into a repo

From this repo’s root:

```bash
./scripts/sync-rules-into-repo.sh ~/Developer/red-e-play-app
# or
python3 scripts/generate-agent-rules.py --pack rules/packs/red-e-play-core.json --repo-root ~/Developer/red-e-play-app
```

- **Cursor:** writes `.cursor/rules/<id>.mdc`
- **Claude:** writes `.claude/rules/<id>.md` (cross-links `.mdc` → `.md` in markdown links)

Flags: `--cursor-only`, `--claude-only`, `--dry-run`.

## Drill-down / scoped rules

1. Add a new folder under `rules/library/<id>/` with `body.md` + `meta.json`.
2. Set `"globs": ["relative/path/**"]` in `meta.json` so Cursor only injects the rule when matching files are in play (see [Cursor rules docs](https://cursor.com/docs)).
3. Add `<id>` to a **pack** (or create a new pack JSON that lists only the scoped rules for a sub-team).
4. Regenerate into the target repo.

## Ported packs

| Pack | Rules | Profile |
|------|-------|---------|
| [`packs/red-e-play-core.json`](packs/red-e-play-core.json) | dev-discipline, changelog-and-versioning, go-live-path | `default-monorepo` |

See [`RULES-CATALOG.md`](RULES-CATALOG.md) for a flat index.
