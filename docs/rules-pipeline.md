# Rules pipeline (canonical → Cursor + Claude)

## Why

Cursor and Claude Code use **different on-disk paths** and **link targets** (`.mdc` vs `.md`). Keeping prose in **this private repo** avoids copy-paste drift and lets you ship **packs** (core vs scoped) per codebase.

## Source layout

- **`rules/library/<id>/body.md`** — content; use `__DOCS__` token for links into the target repo’s `docs/` tree (resolved per profile).
- **`rules/library/<id>/meta.json`** — frontmatter fields (`description`, `alwaysApply`, `globs`).
- **`rules/profiles/*.json`** — `docs_path_from_cursor_rules`, `docs_path_from_claude_rules`.
- **`rules/packs/*.json`** — ordered list of rule ids + profile name.

## Commands

```bash
# Emit both .cursor/rules and .claude/rules
./scripts/sync-rules-into-repo.sh /path/to/target-repo

# Advanced
python3 scripts/generate-agent-rules.py --pack rules/packs/red-e-play-core.json \
  --repo-root /path/to/target-repo --dry-run
```

## Workflow

1. Edit canonical files under `rules/library/`.
2. Run sync against each product repo (or CI) before merge.
3. Commit generated outputs **in the product repo** when you want them pinned, or generate locally only — team choice.

## Skills library

Agent skills stay under `skills/`; rules stay under `rules/`. Skills teach *procedure* for tools; rules enforce *repo-wide* behavior. Both can reference the same policies in prose.
