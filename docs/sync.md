# Syncing skills into this repo

## Primary: `skills/` (current layout)

From the **repo root**:

```bash
./scripts/vendor-skills-from-home.sh
```

That refreshes:

- `skills/marketing/` ← `~/.agents/skills/`
- `skills/ide/cursor/` ← `~/.cursor/skills-cursor/`
- `skills/project/red-e-play/` ← `verify-ship`, `generate-weather-plates`
- `skills/visual/design/ui-ux-pro-max/` ← UI Pro install path
- `context/readyplay-product-marketing-context.md` ← `~/Developer/red-e-play-app/.agents/` (if present)

Then regenerate catalogs (the script runs `generate-skill-catalogs.py`).

```bash
git add skills/ context/ scripts/
git status
git commit -m "chore: refresh vendored skills"
git push
```

## Manual rsync (custom paths)

If `HOME` or paths differ, mirror the commands inside `scripts/vendor-skills-from-home.sh`.

### Optional legacy `vendor/` folder

Some teams keep a **second** copy under `vendor/` for archival. Example:

```bash
mkdir -p vendor/agents-skills
rsync -a ~/.agents/skills/ ./vendor/agents-skills/
```

### Restore on a new machine

1. Clone this repo.
2. Either run `./scripts/vendor-skills-from-home.sh` **after** installing skills under `~/`, **or** rsync **from** `skills/*` **into** `~/.agents/skills/`, `~/.cursor/skills/`, etc. (reverse of vendor script).

### Drift check

```bash
diff -qr ~/.cursor/skills-cursor/babysit ./skills/ide/cursor/babysit
```

### Claude Code: link generated external skills

After cloning this repo:

\`\`\`bash
./scripts/link-external-skills-to-claude.sh
\`\`\`

Creates symlinks from \`skills/external/<id>/\` → \`~/.claude/skills/<id>/\`.

## Push canonical rules into a product repo

From `ai-skills-library` root:

```bash
./scripts/sync-rules-into-repo.sh /path/to/red-e-play-app
```

Uses [`rules-pipeline.md`](rules-pipeline.md) for details.

