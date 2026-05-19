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
3. Run `python3 scripts/generate-skill-plugin-manifests.py` — creates **`skill.plugin.json`** + **`skill.plugin.md`** (WordPress-style plugin card metadata) beside `SKILL.md`.
4. Add to index + overlap docs as above.

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
python3 scripts/validate-skill-frontmatter.py
git add skills/ context/ SKILL-INDEX.md  # plus any doc edits
git commit -m "chore: refresh vendored skills"
git push
```

Every `SKILL.md` must start with YAML frontmatter (`name`, `description`). The validator enforces that across `skills/`.

For a **one-off** new folder under `~/.claude/skills/`, copy it into `skills/project/red-e-play/<name>/` and document in `SKILL-INDEX.md`.

## You-Sir Juan platform skills (agent-managed)

**Canonical path only:** `skills/yousirjuan/<skill-id>/` with frontmatter `domain: yousirjuan`.

**Never** create or link `skills/project/yousirjuan/` — that layout is retired. See [`rules/library/yousirjuan-skills-pack-path/body.md`](../rules/library/yousirjuan-skills-pack-path/body.md).

After add or move:

1. `python3 scripts/generate-skill-plugin-manifests.py`
2. Ripple SKILL-INDEX + [`skills/yousirjuan/README.md`](../skills/yousirjuan/README.md) + [`docs/yousirjuan-platform-skills-master.md`](yousirjuan-platform-skills-master.md)
3. `./scripts/install-repo-skills-to-cursor-project.sh /path/to/yousirjuan`

## External GitHub tool → generated bridge skill

1. Add an entry to [`external-tools.manifest.json`](external-tools.manifest.json) (see schema: [`external-tools.manifest.schema.json`](external-tools.manifest.schema.json)).
2. Run `python3 scripts/generate-external-tool-skills.py` and `python3 scripts/generate-skill-catalogs.py`.
3. Commit the manifest + all generated files (`docs/related-github-projects.md`, `skills/external/**`).
4. Optional: `./scripts/link-external-skills-to-claude.sh` on each machine.

## Canonical rules (separate from skills)

Repo-wide behavior for Cursor + Claude lives under **`rules/`**. See [`rules-pipeline.md`](rules-pipeline.md) and [`../rules/README.md`](../rules/README.md).

