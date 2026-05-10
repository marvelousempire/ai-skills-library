# Adding or updating a skill

## Install finished (CLI, download, marketplace)

1. Note **tool** (Cursor vs Claude Code) and **final path** on disk.
2. Open the skill’s `SKILL.md` — skim **description** and any **“when to use”** / trigger list.
3. Add a row to **[`../SKILL-INDEX.md`](../SKILL-INDEX.md)**.
4. If it collides with an existing row, add one line to **[`overlap-rules.md`](overlap-rules.md)**.
5. Commit: `git add SKILL-INDEX.md docs/ && git commit -m "Index skill: <name>"`

## Authoring a new skill

1. Use Cursor **create-skill** (or follow vendor docs).
2. Prefer **narrow triggers** in frontmatter `description:` so the skill does not steal every “improve” task.
3. Add to index + overlap docs as above.

## Rescan

```bash
find ~/.cursor/skills ~/.cursor/skills-cursor ~/.claude/skills -name SKILL.md 2>/dev/null
```

## Bulk pack (e.g. marketingskills)

1. Install: `command npx --yes skills add coreyhaines31/marketingskills` from `$HOME`.
2. Symlink into `~/.cursor/skills/` and `~/.claude/skills/` if tools do not read `~/.agents/skills/` alone.
3. Document in **`docs/marketingskills.md`** (this repo) and add a **bundle row** in **`SKILL-INDEX.md`**.

## Mirror into this repo (`skills/`)

After the skill exists under `~/`, refresh the private library:

```bash
cd ~/Developer/ai-skills-library
./scripts/vendor-skills-from-home.sh
git add skills/ context/ SKILL-INDEX.md  # plus any doc edits
git commit -m "chore: refresh vendored skills"
git push
```

For a **one-off** new folder under `~/.claude/skills/`, copy it into `skills/project/red-e-play/<name>/` and document in `SKILL-INDEX.md`.

## External GitHub tool → generated bridge skill

1. Add an entry to [`external-tools.manifest.json`](external-tools.manifest.json) (see schema: [`external-tools.manifest.schema.json`](external-tools.manifest.schema.json)).
2. Run `python3 scripts/generate-external-tool-skills.py` and `python3 scripts/generate-skill-catalogs.py`.
3. Commit the manifest + all generated files (`docs/related-github-projects.md`, `skills/external/**`).
4. Optional: `./scripts/link-external-skills-to-claude.sh` on each machine.

## Canonical rules (separate from skills)

Repo-wide behavior for Cursor + Claude lives under **`rules/`**. See [`rules-pipeline.md`](rules-pipeline.md) and [`../rules/README.md`](../rules/README.md).

