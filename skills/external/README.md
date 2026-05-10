# External tools (generated bridge skills)

These folders are **not** forks of upstream products. Each `SKILL.md` is **code-generated** from [`docs/external-tools.manifest.json`](../docs/external-tools.manifest.json) so agents get a consistent playbook (install pointers, safety notes, triggers) while the real code stays on GitHub.

| Doc | Purpose |
|-----|---------|
| [`SKILL-CATALOG.md`](SKILL-CATALOG.md) | Flat links to every bridge skill |
| [`../docs/related-github-projects.md`](../docs/related-github-projects.md) | Tables with **Artifact** vs **Skill** columns |

## Regenerate

```bash
python3 scripts/generate-external-tool-skills.py
python3 scripts/generate-skill-catalogs.py
```

## Use with Claude Code

```bash
./scripts/link-external-skills-to-claude.sh
```

Symlinks each `skills/external/<id>/` into `~/.claude/skills/<id>/` and (unless `LINK_EXTERNAL_TO_CURSOR=0`) into `~/.cursor/skills/<id>/`.
