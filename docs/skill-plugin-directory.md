# Skill plugin directory (WordPress-style metadata)

Every skill folder under `skills/` is treated like a **WordPress plugin**: machine manifest + human lead sheet beside `SKILL.md`.

| File | Role |
|------|------|
| `SKILL.md` | Agent playbook (YAML frontmatter + body) |
| `skill.plugin.json` | Machine manifest — grid UIs, Bishop audits, tooling |
| `skill.plugin.md` | Human lead sheet — card header + tables |

**Master grid:** [`../SKILLS-PLUGIN-DIRECTORY.md`](../SKILLS-PLUGIN-DIRECTORY.md) (168 plugins, regenerated).

**Schema:** [`skill-plugin-manifest.schema.json`](skill-plugin-manifest.schema.json)

**Template:** [`../templates/skill.plugin.json`](../templates/skill.plugin.json)

## Regenerate

```bash
python3 scripts/generate-skill-plugin-manifests.py
python3 scripts/validate-skill-plugin-manifests.py
```

The generator reads `SKILL.md` frontmatter (including multiline `description: >-`) and preserves manual overrides in existing `skill.plugin.json` (`icon`, `featured`, `homepage`, `repository`, `overlap`, etc.).

## New skills

After creating `SKILL.md`, run the generator (see [`add-skill.md`](add-skill.md)). Bishop audits require both plugin files.
