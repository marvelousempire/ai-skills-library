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
