# Library plugin catalog (skills + agents)

The AI Skills Library UI mental model is the **WordPress Plugins** screen: every installable unit is a plugin with a machine manifest and a human lead sheet.

## Catalog files

| File | Contents |
|------|----------|
| [`LIBRARY-PLUGIN-CATALOG.md`](../LIBRARY-PLUGIN-CATALOG.md) | **Unified grid** — all skills + agents in one table |
| [`SKILLS-PLUGIN-DIRECTORY.md`](../SKILLS-PLUGIN-DIRECTORY.md) | Skills only, grouped by pack |
| [`AGENTS-PLUGIN-DIRECTORY.md`](../AGENTS-PLUGIN-DIRECTORY.md) | Agents only, grouped by team |

## Per-item files

| Kind | Source | Machine | Human |
|------|--------|---------|-------|
| Skill | `skills/.../SKILL.md` | `skill.plugin.json` | `skill.plugin.md` |
| Agent (flat) | `agents/<slug>.md` | `<slug>.plugin.json` | `<slug>.plugin.md` |
| Agent (folder) | `agents/<slug>/AGENT.md` | `agent.plugin.json` | `agent.plugin.md` |

## Regenerate

```bash
python3 scripts/generate-skill-plugin-manifests.py
python3 scripts/generate-agent-plugin-manifests.py
python3 scripts/generate-library-plugin-catalog.py
python3 scripts/validate-skill-plugin-manifests.py
python3 scripts/validate-agent-plugin-manifests.py
```

## Bishop gate

When Bishop creates an agent, both plugin files must exist and the agent must appear in `LIBRARY-PLUGIN-CATALOG.md`. See [`agents/bishop.md`](../agents/bishop.md).

Schemas: [`skill-plugin-manifest.schema.json`](skill-plugin-manifest.schema.json) · [`agent-plugin-manifest.schema.json`](agent-plugin-manifest.schema.json)
