# Syncing skill sources into this repo (`vendor/`)

Use this when you want **Git** to own copies of skills (backup, second machine, or drift detection). The default library is **index-only**; `vendor/` is optional.

## 1. Create `vendor/` layout

```bash
mkdir -p vendor/cursor vendor/claude
```

## 2. Copy examples (adjust names)

**Cursor — UI Pro install (large; may include scripts/data):**

```bash
rsync -a --delete \
  ~/.cursor/skills/.cursor/skills/ui-ux-pro-max/ \
  ./vendor/cursor/ui-ux-pro-max/
```

**Cursor — skills-cursor pack (one folder at a time or all):**

```bash
rsync -a ~/.cursor/skills-cursor/ ./vendor/cursor/skills-cursor/
```

**Claude Code:**

```bash
rsync -a ~/.claude/skills/ ./vendor/claude/skills/
```

## 3. Commit

```bash
git add vendor/
git commit -m "Vendor skill snapshots"
git push
```

## 4. Restore on a new machine

Copy or clone this repo, then reverse the paths (from `./vendor/...` into `~/.cursor/...` or `~/.claude/...`). Re-run installers (e.g. `npx uipro-cli`) if you prefer canonical installs over copies.

## 5. Drift check (optional)

After editing skills in-place under `~/`, diff against vendor:

```bash
diff -qr ~/.cursor/skills-cursor/babysit ./vendor/cursor/skills-cursor/babysit
```

